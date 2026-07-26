package com.optics_store.optics.sql;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.optics_store.optics.dto.SqlOperationData;
import com.optics_store.optics.excel.ImportExcelDB;

import jakarta.persistence.Entity;
import lombok.RequiredArgsConstructor;
import net.ttddyy.dsproxy.ExecutionInfo;
import net.ttddyy.dsproxy.QueryInfo;
import net.ttddyy.dsproxy.listener.QueryExecutionListener;
import net.ttddyy.dsproxy.support.ProxyDataSourceBuilder;

@Configuration
@RequiredArgsConstructor
/**
 * Custom SQL filter/handler component.
 * Supports the query interception mechanism required for synchronizing the
 * MariaDB database with offline Excel documents.
 */
public class DataSourceProxyConfig {

    private static final Pattern INSERT_PATTERN = Pattern
            .compile("(?i)INSERT\\s+INTO\\s+(\\w+)\\s*\\(([^)]+)\\)\\s*VALUES\\s*\\(([^)]+)\\)");
    private static final Pattern UPDATE_SET_PATTERN = Pattern.compile("(?i)SET\\s+(.+?)\\s+WHERE", Pattern.DOTALL);
    private static final Pattern WHERE_PATTERN = Pattern.compile("(?i)WHERE\\s+\\w+\\s*=\\s*(\\d+)");

    private final ObjectProvider<EntityClassResolver> entityClassResolverProvider;
    private final ObjectProvider<ImportExcelDB> importExcelDBProvider;

    private final Map<String, List<String>> entityFieldCache = new HashMap<>();
    private final Map<String, List<Class<?>>> entityTypeCache = new HashMap<>();
    private final Map<String, String> fieldToColumnCache = new HashMap<>();

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties props) {
        DataSource realDs = props.initializeDataSourceBuilder().build();

        return ProxyDataSourceBuilder.create(realDs)
                .name("DS-Proxy")
                .listener(new QueryExecutionListener() {
                    @Override
                    public void beforeQuery(ExecutionInfo execInfo, List<QueryInfo> queryInfoList) {
                    }

                    @Override
                    public void afterQuery(ExecutionInfo execInfo, List<QueryInfo> queryInfoList) {
                        if (!SqlLoggingContext.isEnabled()) {
                            SqlCaptureInspector.clear();
                            return;
                        }

                        EntityClassResolver resolver = entityClassResolverProvider.getIfAvailable();
                        ImportExcelDB importExcelDB = importExcelDBProvider.getIfAvailable();

                        for (QueryInfo qi : queryInfoList) {
                            String sql = formatSqlWithBindings(qi);
                            String trimmed = sql.trim();
                            String upperSql = trimmed.toUpperCase(Locale.ROOT);

                            if (!(upperSql.startsWith("INSERT INTO") || upperSql.startsWith("UPDATE")
                                    || upperSql.startsWith("DELETE FROM"))) {
                                continue;
                            }

                            SqlOperationData op = new SqlOperationData();

                            if (upperSql.startsWith("INSERT INTO")) {
                                handleInsert(trimmed, resolver, importExcelDB, op);
                            } else if (upperSql.startsWith("UPDATE")) {
                                handleUpdate(trimmed, resolver, importExcelDB, op);
                            } else {
                                handleDelete(trimmed, resolver, importExcelDB, op);
                            }

                            SqlCaptureInspector.addOperation(op);
                        }
                    }

                    private void handleInsert(String sql, EntityClassResolver resolver,
                            ImportExcelDB importExcelDB, SqlOperationData op) {
                        op.setAction(SqlOperationData.Action.INSERT);
                        Matcher m = INSERT_PATTERN.matcher(sql);
                        if (m.find()) {
                            String table = m.group(1);
                            op.setTableName(table);

                            List<String> sqlColumns = Arrays.asList(m.group(2).split("\\s*,\\s*"));
                            List<String> sqlValuesRow = Arrays.stream(m.group(3).split("\\s*,\\s*"))
                                    .map(val -> val.equalsIgnoreCase("NULL") ? null : val)
                                    .collect(Collectors.toList());

                            List<String> entityFields = new ArrayList<>();
                            List<Class<?>> entityTypes = new ArrayList<>();
                            resolveEntityFields(table, resolver, importExcelDB, entityFields, entityTypes);

                            List<String> sortedRow = new ArrayList<>();
                            List<String> sortedFormats = new ArrayList<>();
                            formatAndSortRow(sqlColumns, sqlValuesRow, entityFields, entityTypes, sortedRow,
                                    sortedFormats);

                            op.getColumnFormats().addAll(sortedFormats);
                            op.getNewValues().add(sortedRow);
                        }
                    }

                    private void handleUpdate(String sql, EntityClassResolver resolver,
                            ImportExcelDB importExcelDB, SqlOperationData op) {
                        op.setAction(SqlOperationData.Action.UPDATE);
                        String table = sql.replaceFirst("(?i)UPDATE\\s+", "").split("\\s")[0];
                        op.setTableName(table);

                        Matcher where = WHERE_PATTERN.matcher(sql);
                        if (where.find()) {
                            int id = Integer.parseInt(where.group(1));
                            processOldValues(table, id, op, resolver, importExcelDB);
                        }

                        Matcher set = UPDATE_SET_PATTERN.matcher(sql);
                        if (set.find()) {
                            String[] assignments = set.group(1).split("\\s*,\\s*");
                            List<String> sqlColumns = new ArrayList<>();
                            List<String> sqlValuesRow = new ArrayList<>();

                            for (String assign : assignments) {
                                int eq = assign.indexOf('=');
                                if (eq < 0)
                                    continue;
                                sqlColumns.add(assign.substring(0, eq).trim());
                                String raw = assign.substring(eq + 1).trim();
                                sqlValuesRow.add(raw.equalsIgnoreCase("NULL") ? null : raw);
                            }

                            List<String> entityFields = new ArrayList<>();
                            List<Class<?>> entityTypes = new ArrayList<>();
                            resolveEntityFields(table, resolver, importExcelDB, entityFields, entityTypes);

                            List<String> sortedRow = new ArrayList<>();
                            List<String> sortedFormats = new ArrayList<>();
                            formatAndSortRow(sqlColumns, sqlValuesRow, entityFields, entityTypes, sortedRow,
                                    sortedFormats);

                            op.getColumnFormats().addAll(sortedFormats);
                            op.getNewValues().add(sortedRow);
                        }
                    }

                    private void handleDelete(String sql, EntityClassResolver resolver,
                            ImportExcelDB importExcelDB, SqlOperationData op) {
                        op.setAction(SqlOperationData.Action.DELETE);
                        String table = sql.replaceFirst("(?i)DELETE\\s+FROM\\s+", "").split("\\s")[0];
                        op.setTableName(table);

                        Matcher where = WHERE_PATTERN.matcher(sql);
                        if (where.find()) {
                            int id = Integer.parseInt(where.group(1));
                            processOldValues(table, id, op, resolver, importExcelDB);
                        }
                    }

                    private void resolveEntityFields(String table, EntityClassResolver resolver,
                            ImportExcelDB importExcelDB,
                            List<String> entityFields, List<Class<?>> entityTypes) {
                        String key = table.toLowerCase(Locale.ROOT);
                        if (entityFieldCache.containsKey(key)) {
                            entityFields.addAll(entityFieldCache.get(key));
                            entityTypes.addAll(entityTypeCache.get(key));
                            return;
                        }
                        if (resolver != null && importExcelDB != null) {
                            resolver.resolveByTableName(table)
                                    .ifPresent(clazz -> {
                                        importExcelDB.extractTableFields(clazz, entityFields, entityTypes);
                                        entityFieldCache.put(key, new ArrayList<>(entityFields));
                                        entityTypeCache.put(key, new ArrayList<>(entityTypes));
                                    });
                        }
                    }

                    private void formatAndSortRow(List<String> sqlColumns, List<String> sqlValuesRow,
                            List<String> entityFields, List<Class<?>> entityTypes,
                            List<String> sortedRow, List<String> sortedFormats) {
                        Map<String, Integer> columnIndexMap = new HashMap<>();
                        for (int i = 0; i < sqlColumns.size(); i++) {
                            columnIndexMap.put(sqlColumns.get(i), i);
                        }

                        for (int i = 0; i < entityFields.size(); i++) {
                            String dbCol = getDbColumn(entityFields.get(i));
                            if ("excel_changes".equals(dbCol))
                                continue;
                            Integer idx = columnIndexMap.get(dbCol);
                            if (idx != null) {
                                sortedFormats.add(formatByType(entityTypes.get(i)));
                                sortedRow.add(stripTrailingZero(sqlValuesRow.get(idx)));
                            }
                        }
                    }

                    private void processOldValues(String table, int id, SqlOperationData op,
                            EntityClassResolver resolver,
                            ImportExcelDB importExcelDB) {
                        List<String> entityFields = new ArrayList<>();
                        List<Class<?>> entityTypes = new ArrayList<>();
                        resolveEntityFields(table, resolver, importExcelDB, entityFields, entityTypes);

                        List<String> oldRow = getFormattedRowById(table, id, entityFields, resolver, importExcelDB);
                        if (oldRow != null) {
                            op.getOldValues().add(oldRow);
                        }
                    }

                    private String getDbColumn(String fieldName) {
                        return fieldToColumnCache.computeIfAbsent(fieldName,
                                f -> f.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase(Locale.ROOT));
                    }

                    private String formatSqlWithBindings(QueryInfo qi) {
                        String sql = qi.getQuery();
                        var paramSets = qi.getParametersList();
                        if (!paramSets.isEmpty()) {
                            for (var p : paramSets.get(0)) {
                                String replacement;
                                if ("setNull".equals(p.getMethod().getName())) {
                                    replacement = "null";
                                } else {
                                    Object v = p.getArgs()[1];
                                    String formatted = formatValue(v);
                                    replacement = (formatted == null ? "null" : formatted);
                                }
                                sql = sql.replaceFirst("\\?", Matcher.quoteReplacement(replacement));
                            }
                        }
                        return sql;
                    }

                    private String stripTrailingZero(String val) {
                        if (val == null || val.equalsIgnoreCase("null"))
                            return "";
                        try {
                            BigDecimal bd = new BigDecimal(val);
                            return bd.stripTrailingZeros().toPlainString();
                        } catch (NumberFormatException ignored) {
                        }
                        return val;
                    }

                    private String formatValue(Object v) {
                        if (v == null)
                            return null;
                        if (v instanceof String s)
                            return s;
                        if (v instanceof java.util.Date date)
                            return new SimpleDateFormat("dd.MM.yyyy HH:mm:ss").format(date);
                        return v.toString();
                    }

                    private String formatByType(Class<?> type) {
                        if (type == String.class)
                            return "STRING";
                        if (type == Integer.class || type == Long.class)
                            return "INTEGER";
                        if (type == Double.class)
                            return "DECIMAL";
                        if (type == Boolean.class)
                            return "BOOLEAN";
                        if (type == java.time.LocalDateTime.class)
                            return "DATETIME";
                        if (type.isAnnotationPresent(Entity.class))
                            return "INTEGER";
                        return "UNKNOWN";
                    }

                    private List<String> getFormattedRowById(String table, int id,
                            List<String> expectedFields,
                            EntityClassResolver resolver,
                            ImportExcelDB importExcelDB) {
                        List<String> result = new ArrayList<>();
                        try (var conn = realDs.getConnection();
                                var stmt = conn.prepareStatement("SELECT * FROM " + table + " WHERE id = ?")) {

                            stmt.setInt(1, id);
                            try (var rs = stmt.executeQuery()) {
                                if (!rs.next())
                                    return null;

                                Map<String, String> rowMap = new HashMap<>();
                                var meta = rs.getMetaData();
                                for (int i = 1; i <= meta.getColumnCount(); i++) {
                                    String colName = meta.getColumnName(i).toLowerCase(Locale.ROOT);
                                    Object val = rs.getObject(i);
                                    String formatted = val instanceof java.sql.Timestamp ts
                                            ? new SimpleDateFormat("dd.MM.yyyy HH:mm:ss").format(ts)
                                            : (val != null ? val.toString() : null);
                                    rowMap.put(colName, formatted);
                                }

                                for (String field : expectedFields) {
                                    String dbCol = getDbColumn(field);
                                    if ("excel_changes".equals(dbCol))
                                        continue;
                                    result.add(stripTrailingZero(rowMap.getOrDefault(dbCol, null)));
                                }

                                return result;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            return null;
                        }
                    }
                })
                .build();
    }
}
