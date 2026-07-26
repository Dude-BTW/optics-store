package com.optics_store.optics.sync;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.optics_store.optics.excel.ImportExcelDB;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
/**
 * In-memory buffer manager for SQL operations (INSERT, UPDATE, DELETE).
 * A critical component of the synchronization architecture that intercepts and
 * groups database changes,
 * reducing the load on the system during intensive client request processing.
 */
public class ChangeBufferManager {

    private final ImportExcelDB importExcelDB;

    private record Key(Class<?> entityClass, String filePath, int sheetNumber) {
    }

    private enum Action {
        INSERT, UPDATE, DELETE
    }

    private static class Operation {
        private final Action action;
        private final List<String> oldRow;
        private final List<String> newRow;

        public Operation(Action action, List<String> oldRow, List<String> newRow) {
            this.action = action;
            this.oldRow = oldRow;
            this.newRow = newRow;
        }

        public Action getAction() {
            return action;
        }

        public List<String> getOldRow() {
            return oldRow;
        }

        public List<String> getNewRow() {
            return newRow;
        }
    }

    private static class Buffer {
        long firstTimestamp = System.currentTimeMillis();
        List<Operation> ops = new ArrayList<>();
    }

    private static final int MAX_BATCH_SIZE = 50;
    private static final long MAX_WAIT_MS = 30_000;

    private final Map<Key, Buffer> bufferMap = new ConcurrentHashMap<>();
    private final Map<String, String> normalizationCache = new ConcurrentHashMap<>();

    /**
     * Queueing methods for database operations.
     * Captures data modifications triggered by user interactions (e.g., reviews,
     * ratings, orders) into memory buffers
     * rather than writing them to disk immediately.
     */
    public void queueAdd(Class<?> entityClass, String filePath, int sheet, List<List<String>> rows) {
        Key key = new Key(entityClass, filePath, sheet);
        Buffer buf = bufferMap.computeIfAbsent(key, _ -> new Buffer());
        synchronized (buf) {
            if (buf.ops.isEmpty()) {
                buf.firstTimestamp = System.currentTimeMillis();
            }
            for (List<String> row : rows)
                buf.ops.add(new Operation(Action.INSERT, null, row));
        }
        log.debug("Queued {} ADD rows for {}", rows.size(), key);
    }

    public void queueUpdate(Class<?> entityClass, String filePath, int sheet,
            List<List<String>> oldRows, List<List<String>> newRows) {
        Key key = new Key(entityClass, filePath, sheet);
        Buffer buf = bufferMap.computeIfAbsent(key, _ -> new Buffer());
        synchronized (buf) {
            if (buf.ops.isEmpty()) {
                buf.firstTimestamp = System.currentTimeMillis();
            }
            for (int i = 0; i < newRows.size(); i++)
                buf.ops.add(new Operation(Action.UPDATE, oldRows.get(i), newRows.get(i)));
        }
        log.debug("Queued {} UPDATE rows for {}", newRows.size(), key);
    }

    public void queueDelete(Class<?> entityClass, String filePath, int sheet,
            List<List<String>> oldRows) {
        Key key = new Key(entityClass, filePath, sheet);
        Buffer buf = bufferMap.computeIfAbsent(key, _ -> new Buffer());
        synchronized (buf) {
            if (buf.ops.isEmpty()) {
                buf.firstTimestamp = System.currentTimeMillis();
            }
            for (List<String> row : oldRows)
                buf.ops.add(new Operation(Action.DELETE, row, null));
        }
        log.debug("Queued {} DELETE rows for {}", oldRows.size(), key);
    }

    @Scheduled(fixedRate = 5_000)
    /**
     * Buffer optimization and flushing methods.
     * Scheduled periodically to consolidate redundant operations (e.g., multiple
     * updates to the same record)
     * and apply the optimized batch to the persistence layer.
     */
    public void flushBuffers() {
        List<Map.Entry<Key, Buffer>> entries = new ArrayList<>(bufferMap.entrySet());
        long now = System.currentTimeMillis();

        entries.parallelStream().forEach(entry -> {
            Key key = entry.getKey();
            Buffer buf = entry.getValue();

            synchronized (buf) {
                int count = buf.ops.size();
                if (count > 0 && (now - buf.firstTimestamp > MAX_WAIT_MS || count >= MAX_BATCH_SIZE)) {
                    log.info("Flushing {} ops for {}", count, key);
                    List<Operation> optimized = optimizeOperations(buf.ops);
                    log.info("Optimized to {} ops", optimized.size());
                    processOperations(key, optimized);
                    buf.ops.clear();
                    buf.firstTimestamp = System.currentTimeMillis();
                }
            }
        });
    }

    private List<Operation> optimizeOperations(List<Operation> ops) {
        Map<String, String> identityMap = new HashMap<>();
        Map<String, List<Operation>> groups = new HashMap<>();

        for (Operation op : ops) {
            String oldKey = keyFromRow(op.getOldRow());
            String newKey = keyFromRow(op.getNewRow());
            String groupKey;

            switch (op.getAction()) {
                case INSERT -> {
                    groupKey = identityMap.getOrDefault(newKey, newKey);
                    identityMap.put(newKey, groupKey);
                }
                case UPDATE -> {
                    groupKey = identityMap.getOrDefault(oldKey, oldKey);
                    identityMap.put(oldKey, groupKey);
                    identityMap.put(newKey, groupKey);
                }
                case DELETE -> {
                    groupKey = identityMap.getOrDefault(oldKey, oldKey);
                    identityMap.put(oldKey, groupKey);
                }
                default -> groupKey = newKey;
            }
            groups.computeIfAbsent(groupKey, _ -> new ArrayList<>()).add(op);
        }

        List<Operation> result = new ArrayList<>();
        for (List<Operation> grp : groups.values()) {
            result.addAll(optimizeStream(grp));
        }
        return result;
    }

    private String keyFromRow(List<String> row) {
        if (row == null)
            return "";
        return String.join("|", row.stream().map(this::normalize).toArray(String[]::new));
    }

    private List<Operation> optimizeStream(List<Operation> chain) {
        if (chain.isEmpty())
            return List.of();
        Operation first = chain.get(0), last = chain.get(chain.size() - 1);
        if (last.getAction() == Action.DELETE) {
            if (first.getAction() == Action.INSERT) {
                return List.of();
            }
            return List.of(new Operation(Action.DELETE, first.getOldRow(), null));
        }
        if (first.getAction() == Action.INSERT) {
            return List.of(new Operation(Action.INSERT, null, last.getNewRow()));
        }
        if (first.getAction() == Action.UPDATE) {
            return List.of(new Operation(Action.UPDATE, first.getOldRow(), last.getNewRow()));
        }
        return new ArrayList<>(chain);
    }

    private String normalize(String s) {
        return normalizationCache.computeIfAbsent(s == null ? "" : s,
                str -> str.trim().replaceAll("=+$", ""));
    }

    private void processOperations(Key key, List<Operation> ops) {
        try {
            List<List<String>> ins = new ArrayList<>();
            List<List<String>> updOld = new ArrayList<>();
            List<List<String>> updNew = new ArrayList<>();
            List<List<String>> del = new ArrayList<>();

            for (Operation op : ops) {
                switch (op.getAction()) {
                    case INSERT -> ins.add(op.getNewRow());
                    case UPDATE -> {
                        updOld.add(op.getOldRow());
                        updNew.add(op.getNewRow());
                    }
                    case DELETE -> del.add(op.getOldRow());
                }
            }

            if (!ins.isEmpty()) {
                importExcelDB.addRows(key.entityClass(), ins);
                log.info("Processed {} INSERT rows for {}", ins.size(), key);
            }

            if (!updOld.isEmpty() || !del.isEmpty()) {
                List<List<String>> searchList = new ArrayList<>(updOld);
                searchList.addAll(del);
                int updateCount = updOld.size();
                Map<String, List<Integer>> ids = importExcelDB.searchRows(key.entityClass(), searchList, updateCount);
                List<Integer> upIds = ids.getOrDefault("UPDATE", Collections.emptyList());
                List<Integer> delIds = ids.getOrDefault("DELETE", Collections.emptyList());

                if (!upIds.isEmpty()) {
                    importExcelDB.updateRows(key.entityClass(), upIds,
                            updNew.subList(0, upIds.size()));
                    log.info("Processed {} UPDATE rows for {}", upIds.size(), key);
                }
                if (!delIds.isEmpty()) {
                    importExcelDB.deleteRows(key.entityClass(), delIds);
                    log.info("Processed {} DELETE rows for {}", delIds.size(), key);
                }
            }
        } catch (Exception e) {
            log.error("Error processing operations for {}", key, e);
        }
    }
}
