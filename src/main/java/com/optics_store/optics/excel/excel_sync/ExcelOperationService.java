package com.optics_store.optics.excel.excel_sync;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import com.optics_store.optics.dto.SqlOperationData;
import com.optics_store.optics.excel.ExcelChanger;
import com.optics_store.optics.excel.ExcelReader;

import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
/**
 * Core service for the two-way asynchronous synchronization of the SQL storage
 * with Excel documents.
 * Optimizes disk write operations by processing in-memory buffered SQL
 * operations and applying them to the physical Excel files.
 * Serves as the primary bridge between online interactions and the offline
 * store's local data.
 */
public class ExcelOperationService {

    private final ExcelChanger excelChanger;
    private final ExcelReader excelReader;
    private final ExcelTableMappings tableMappings;

    public record TableInfo(String filePath, int sheetIndex) {
    }

    /**
     * Batch processing and optimization methods.
     * This group of functions intercepts SQL operations (INSERT, UPDATE, DELETE),
     * locates the precise target rows in the Excel sheet, and applies the changes
     * efficiently to minimize disk I/O.
     */
    public TableInfo getTableInfoByName(String tableName) {
        for (Map.Entry<Class<?>, TableInfo> entry : tableMappings.getMappings().entrySet()) {
            Table annotation = entry.getKey().getAnnotation(Table.class);
            if (annotation != null && annotation.name().equalsIgnoreCase(tableName)) {
                return entry.getValue();
            }
        }
        return null;
    }

    public Set<String> getAlwaysTrackedKeys() {
        Set<String> keys = new HashSet<>();
        for (Map.Entry<Class<?>, TableInfo> entry : tableMappings.getMappings().entrySet()) {
            TableInfo info = entry.getValue();
            keys.add(info.filePath() + "#" + info.sheetIndex());
        }
        return keys;
    }

    public void searchAndAssignRowIndices(List<SqlOperationData> ops) {
        if (ops == null || ops.isEmpty())
            return;

        List<List<String>> allOld = new ArrayList<>();
        int updateCount = 0;

        for (SqlOperationData op : ops) {
            if ((op.getAction() == SqlOperationData.Action.UPDATE || op.getAction() == SqlOperationData.Action.DELETE)
                    && op.getOldValues() != null) {
                allOld.addAll(op.getOldValues());
                if (op.getAction() == SqlOperationData.Action.UPDATE) {
                    updateCount += op.getOldValues().size();
                }
            }
        }

        TableInfo info = getTableInfoByName(ops.get(0).getTableName());
        if (info == null)
            return;

        try {
            Map<String, List<Integer>> found = excelReader.searchRows(allOld, info.filePath(), info.sheetIndex(),
                    updateCount);
            assignRowIndices(ops, found);
        } catch (Exception e) {
            log.error("Failed searchRows for table {}: {}", info.filePath(), e.getMessage(), e);
        }
    }

    public void assignRowIndices(List<SqlOperationData> ops, Map<String, List<Integer>> found) {
        List<Integer> updateIds = found.getOrDefault("UPDATE", Collections.emptyList());
        List<Integer> deleteIds = found.getOrDefault("DELETE", Collections.emptyList());
        int ui = 0, di = 0;

        for (SqlOperationData op : ops) {
            if (op.getAction() == SqlOperationData.Action.UPDATE) {
                for (int i = 0; i < op.getOldValues().size(); i++) {
                    if (ui < updateIds.size())
                        op.getRowIndices().add(updateIds.get(ui++));
                }
            }
        }

        for (SqlOperationData op : ops) {
            if (op.getAction() == SqlOperationData.Action.DELETE) {
                for (int i = 0; i < op.getOldValues().size(); i++) {
                    if (di < deleteIds.size())
                        op.getRowIndices().add(deleteIds.get(di++));
                }
            }
        }
    }

    public void applyChanges(String filePath, int sheetIndex, List<SqlOperationData> ops) {
        Map<String, List<List<String>>> insertGrouped = new LinkedHashMap<>();
        Map<String, Pair<List<Integer>, List<List<String>>>> updateGrouped = new LinkedHashMap<>();
        List<Integer> deleteIndices = new ArrayList<>();

        for (SqlOperationData op : ops) {
            String formatKey = String.join(",", op.getColumnFormats());
            switch (op.getAction()) {
                case INSERT -> insertGrouped
                        .computeIfAbsent(formatKey, _ -> new ArrayList<>())
                        .addAll(op.getNewValues());
                case UPDATE -> {
                    Pair<List<Integer>, List<List<String>>> pair = updateGrouped
                            .computeIfAbsent(formatKey, _ -> Pair.of(new ArrayList<>(), new ArrayList<>()));
                    pair.getLeft().addAll(op.getRowIndices());
                    pair.getRight().addAll(op.getNewValues());
                }
                case DELETE -> deleteIndices.addAll(op.getRowIndices());
            }
        }

        insertGrouped.forEach((format, rows) -> {
            try {
                excelChanger.addRows(filePath, sheetIndex, Arrays.asList(format.split(",")), rows);
            } catch (Exception e) {
                log.error("Failed to add rows to {}: {}", filePath, e.getMessage(), e);
            }
        });

        updateGrouped.forEach((format, pair) -> {
            try {
                excelChanger.updateRows(filePath, sheetIndex, pair.getLeft(),
                        Arrays.asList(format.split(",")), pair.getRight());
            } catch (Exception e) {
                log.error("Failed to update rows in {}: {}", filePath, e.getMessage(), e);
            }
        });

        if (!deleteIndices.isEmpty()) {
            try {
                excelChanger.deleteRows(filePath, sheetIndex, deleteIndices);
            } catch (Exception e) {
                log.error("Failed to delete rows from {}: {}", filePath, e.getMessage(), e);
            }
        }
    }

    public List<SqlOperationData> optimizeOperations(List<SqlOperationData> ops) {
        Map<String, List<SqlOperationData>> groupedByTable = new HashMap<>();
        ops.forEach(op -> groupedByTable
                .computeIfAbsent(op.getTableName(), _ -> new ArrayList<>())
                .add(op));

        List<SqlOperationData> result = new ArrayList<>();
        groupedByTable.values().forEach(
                tableOps -> splitIntoStreams(tableOps).forEach(stream -> result.addAll(optimizeStream(stream))));
        return result;
    }

    private List<List<SqlOperationData>> splitIntoStreams(List<SqlOperationData> ops) {
        List<List<SqlOperationData>> streams = new ArrayList<>();
        boolean[] used = new boolean[ops.size()];

        for (int i = 0; i < ops.size(); i++) {
            if (used[i])
                continue;
            SqlOperationData seed = ops.get(i);
            List<SqlOperationData> chain = new ArrayList<>();
            chain.add(seed);
            used[i] = true;
            List<String> lastNew = getLastNewValue(seed);

            for (int j = 0; j < ops.size(); j++) {
                if (used[j])
                    continue;
                SqlOperationData candidate = ops.get(j);
                if (rowsEqual(lastNew, getFirstOldValue(candidate))) {
                    chain.add(candidate);
                    lastNew = getLastNewValue(candidate);
                    used[j] = true;
                    j = -1;
                }
            }

            streams.add(chain);
        }

        return streams;
    }

    private List<SqlOperationData> optimizeStream(List<SqlOperationData> chain) {
        if (chain.isEmpty())
            return List.of();
        SqlOperationData first = chain.get(0);
        SqlOperationData last = chain.get(chain.size() - 1);

        if (first.getAction() == SqlOperationData.Action.INSERT && last.getAction() == SqlOperationData.Action.DELETE)
            return List.of();

        if (first.getAction() == SqlOperationData.Action.UPDATE && last.getAction() == SqlOperationData.Action.DELETE) {
            SqlOperationData merged = new SqlOperationData();
            merged.setTableName(first.getTableName());
            merged.setAction(SqlOperationData.Action.DELETE);
            merged.setOldValues(List.of(first.getOldValues().get(0)));
            merged.setColumnFormats(first.getColumnFormats());
            return List.of(merged);
        }

        if (first.getAction() == SqlOperationData.Action.UPDATE) {
            SqlOperationData merged = new SqlOperationData();
            merged.setTableName(first.getTableName());
            merged.setAction(SqlOperationData.Action.UPDATE);
            merged.setOldValues(List.of(first.getOldValues().get(0)));
            merged.setNewValues(List.of(last.getNewValues().get(0)));
            merged.setColumnFormats(last.getColumnFormats());
            return List.of(merged);
        }

        if (first.getAction() == SqlOperationData.Action.INSERT && last.getAction() == SqlOperationData.Action.UPDATE) {
            SqlOperationData merged = new SqlOperationData();
            merged.setTableName(first.getTableName());
            merged.setAction(SqlOperationData.Action.INSERT);
            merged.setNewValues(List.of(last.getNewValues().get(0)));
            merged.setColumnFormats(last.getColumnFormats());
            return List.of(merged);
        }

        return chain;
    }

    private List<String> getFirstOldValue(SqlOperationData op) {
        return (op.getOldValues() == null || op.getOldValues().isEmpty()) ? null : op.getOldValues().get(0);
    }

    private List<String> getLastNewValue(SqlOperationData op) {
        return (op.getNewValues() == null || op.getNewValues().isEmpty()) ? null : op.getNewValues().get(0);
    }

    private boolean rowsEqual(List<String> row1, List<String> row2) {
        if (row1 == null || row2 == null || row1.size() != row2.size())
            return false;
        for (int i = 0; i < row1.size(); i++) {
            if (!normalize(row1.get(i)).equals(normalize(row2.get(i))))
                return false;
        }
        return true;
    }

    private String normalize(String s) {
        return StringUtils.stripEnd(s == null ? "" : s.trim(), "=");
    }
}
