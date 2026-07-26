package com.optics_store.optics.excel;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.util.CryptoUtil;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
/**
 * Database synchronization handler.
 * Responsible for detecting changes from the offline Excel documents and
 * reflecting them back into the MariaDB SQL storage, ensuring true two-way data
 * consistency across the platform.
 */
public class ImportExcelDB {

    private final JdbcTemplate jdbcTemplate;
    private final ExcelReader excelReader;
    private final CryptoUtil cryptoUtil;

    private List<Map<String, String>> foreignKeys;
    private Boolean foreignKeysCheck = false;

    private static final Pattern CAMEL_TO_SNAKE = Pattern.compile("([a-z])([A-Z]+)");

    private static final Set<String> ENCRYPTED_COLUMNS = Set.of(
            "guest_name", "phone",
            "first_name", "last_name", "city",
            "ip", "region", "timezone");

    public record ForeignKeyInfo(
            String tableName,
            String constraintName,
            String columnName,
            String referencedTableName,
            String referencedColumnName) {
    }

    private void ensureForeignKeysInitialized() {
        if (!foreignKeysCheck) {
            foreignKeys = logForeignKeys().stream().map(fk -> {
                Map<String, String> map = new HashMap<>();
                map.put("TABLE_NAME", fk.tableName());
                map.put("CONSTRAINT_NAME", fk.constraintName());
                map.put("COLUMN_NAME", fk.columnName());
                map.put("REFERENCED_TABLE_NAME", fk.referencedTableName());
                map.put("REFERENCED_COLUMN_NAME", fk.referencedColumnName());
                return map;
            }).toList();
            foreignKeysCheck = true;
        }
    }

    @Transactional
    public <T> void importData(Class<T> entityClass, String excelFilePath, int sheetIndex) {
        String tableName = getTableName(entityClass);
        ensureForeignKeysInitialized();

        if (!isTableEmpty(tableName)) {
            log.info("The table {} is not empty. Data batch import aborted.", tableName);
            return;
        }

        List<String> columnNames = new ArrayList<>();
        List<Class<?>> columnTypes = new ArrayList<>();
        extractTableFields(entityClass, columnNames, columnTypes);

        String sql = String.format("INSERT INTO %s (id, %s) VALUES (?, %s)",
                tableName,
                String.join(", ", columnNames),
                generateSqlPlaceholders(columnNames.size()));

        try (InputStream inputStream = new ClassPathResource(excelFilePath).getInputStream()) {
            List<List<String>> tableData = excelReader.readExcel(inputStream, sheetIndex)
                    .stream()
                    .map(pair -> pair.getRight())
                    .toList();

            List<Object[]> batchArgs = new ArrayList<>();
            int idCounter = 1;

            for (List<String> row : tableData) {
                List<Object> rowData = new ArrayList<>();
                rowData.add(idCounter++);
                rowData.addAll(buildParsedRowValues(columnNames, columnTypes, row, false));
                batchArgs.add(rowData.toArray());
            }

            jdbcTemplate.batchUpdate(sql, batchArgs);
            log.info("Batch import complete: {}", tableName);

        } catch (Exception e) {
            log.error("Error reading Excel file {} on sheet {}: {}", excelFilePath, sheetIndex, e.getMessage());
        }
    }

    @Transactional
    /**
     * CRUD mapping methods for Excel-to-SQL synchronization.
     * These functions parse specific rows from the Excel documents and execute the
     * corresponding database operations using the established Java entity models.
     */
    public <T> Map<String, List<Integer>> searchRows(
            Class<T> entityClass,
            List<List<String>> searchValuesList,
            int updateCount) {
        if (searchValuesList == null || searchValuesList.isEmpty()) {
            return Map.of("UPDATE", Collections.emptyList(), "DELETE", Collections.emptyList());
        }

        String tableName = getTableName(entityClass);
        List<String> columnNames = new ArrayList<>();
        List<Class<?>> columnTypes = new ArrayList<>();
        extractTableFields(entityClass, columnNames, columnTypes);

        List<Integer> encryptedIndexes = new ArrayList<>();
        for (int i = 0; i < columnNames.size(); i++) {
            if (ENCRYPTED_COLUMNS.contains(columnNames.get(i))) {
                encryptedIndexes.add(i);
            }
        }

        List<List<Integer>> allMatchedIds = new ArrayList<>();

        for (List<String> searchValues : searchValuesList) {
            List<String> whereParts = new ArrayList<>();
            List<Object> paramsList = new ArrayList<>();

            for (int i = 0; i < columnNames.size(); i++) {
                if (encryptedIndexes.contains(i))
                    continue;

                String col = columnNames.get(i);
                String rawValue = i < searchValues.size() ? searchValues.get(i) : null;

                if (rawValue == null || rawValue.isEmpty()) {
                    if (columnTypes.get(i) == LocalDateTime.class) {
                        whereParts.add(col + " IS NULL");
                    } else {
                        whereParts.add("(" + col + " IS NULL OR " + col + " = '')");
                    }
                } else if (columnTypes.get(i) == Boolean.class) {
                    whereParts.add(col + " = " +
                            (rawValue.equalsIgnoreCase("true") || rawValue.equals("1") ? "TRUE" : "FALSE"));
                } else {
                    whereParts.add(col + " LIKE ?");
                    paramsList.add("%" + rawValue + "%");
                }
            }

            if (whereParts.isEmpty()) {
                allMatchedIds.add(Collections.emptyList());
                continue;
            }

            String whereClause = String.join(" AND ", whereParts);
            String sql = "SELECT * FROM " + tableName + " WHERE " + whereClause;
            List<Map<String, Object>> matchedRows = jdbcTemplate.queryForList(sql, paramsList.toArray());

            List<Integer> currentMatchedIds = matchedRows.parallelStream()
                    .filter(row -> {
                        for (int i : encryptedIndexes) {
                            String colName = columnNames.get(i);
                            String searchValue = i < searchValues.size() ? searchValues.get(i) : "";
                            if (searchValue.isEmpty())
                                continue;

                            String encryptedStr = (String) row.get(colName);
                            try {
                                String decrypted = cryptoUtil.decrypt(encryptedStr);
                                if (!decrypted.contains(searchValue)) {
                                    return false;
                                }
                            } catch (Exception e) {
                                return false;
                            }
                        }
                        return true;
                    })
                    .map(row -> ((Number) row.get("id")).intValue())
                    .sorted()
                    .collect(Collectors.toList());

            allMatchedIds.add(currentMatchedIds);
        }

        Map<List<Integer>, Integer> reuseCounter = new HashMap<>();
        List<Integer> updateIds = new ArrayList<>();
        List<Integer> deleteIds = new ArrayList<>();

        for (int i = 0; i < allMatchedIds.size(); i++) {
            List<Integer> matchList = allMatchedIds.get(i);
            if (matchList.isEmpty())
                continue;

            reuseCounter.putIfAbsent(matchList, 0);
            int idx = reuseCounter.get(matchList);
            if (idx < matchList.size()) {
                int selectedId = matchList.get(idx);
                if (i < updateCount) {
                    updateIds.add(selectedId);
                } else {
                    deleteIds.add(selectedId);
                }
                reuseCounter.put(matchList, idx + 1);
            }
        }

        return Map.of("UPDATE", updateIds, "DELETE", deleteIds);
    }

    @Transactional
    public <T> void updateRows(Class<T> entityClass, List<Integer> rowIndices, List<List<String>> newValues) {
        if (rowIndices == null || rowIndices.isEmpty())
            return;

        String tableName = getTableName(entityClass);
        ensureForeignKeysInitialized();

        List<String> columnNames = new ArrayList<>();
        List<Class<?>> columnTypes = new ArrayList<>();
        extractTableFields(entityClass, columnNames, columnTypes);

        Map<String, List<String>> columnsByTable = getColumnNamesFromForeignKeys(foreignKeys, tableName);

        String sql = "UPDATE " + tableName + " SET " +
                columnNames.stream().map(col -> col + " = ?").collect(Collectors.joining(", ")) +
                " WHERE id = ?";

        List<Object[]> batchArgs = new ArrayList<>();

        for (int i = 0; i < rowIndices.size(); i++) {
            Integer id = rowIndices.get(i);
            List<String> rowValues = new ArrayList<>(newValues.get(i));
            while (rowValues.size() < columnNames.size()) {
                rowValues.add(null);
            }

            List<Object> parsedRow = buildParsedRowValues(columnNames, columnTypes, rowValues, true);
            parsedRow.add(id);
            batchArgs.add(parsedRow.toArray());
        }

        jdbcTemplate.batchUpdate(sql, batchArgs);

        if (columnsByTable != null && !columnsByTable.isEmpty()) {
            for (Map.Entry<String, List<String>> entry : columnsByTable.entrySet()) {
                String relatedTable = entry.getKey();
                List<String> relatedColumns = entry.getValue();
                String fkColumn = relatedColumns.stream().filter(col -> col.endsWith("_id")).findFirst().orElse(null);
                if (fkColumn == null || !relatedColumns.contains("excel_changes"))
                    continue;

                String checkSql = "SELECT id FROM " + relatedTable + " WHERE " + fkColumn + " = ?";
                String updateSqlTemplate = "UPDATE " + relatedTable + " SET excel_changes = TRUE WHERE id IN (%s)";

                for (Integer id : rowIndices) {
                    List<Integer> relatedIds = jdbcTemplate.query(
                            checkSql,
                            ps -> ps.setObject(1, id),
                            (rs, _) -> rs.getInt("id"));

                    if (!relatedIds.isEmpty()) {
                        String idList = relatedIds.stream().map(String::valueOf).collect(Collectors.joining(", "));
                        jdbcTemplate.update(String.format(updateSqlTemplate, idList));
                    }
                }
            }
        }
    }

    @Transactional
    public <T> void addRows(Class<T> entityClass, List<List<String>> newValues) {
        if (newValues == null || newValues.isEmpty())
            return;

        String tableName = getTableName(entityClass);
        List<String> columnNames = new ArrayList<>();
        List<Class<?>> columnTypes = new ArrayList<>();
        extractTableFields(entityClass, columnNames, columnTypes);

        String sql = String.format("INSERT INTO %s (%s) VALUES (%s)",
                tableName,
                String.join(", ", columnNames),
                generateSqlPlaceholders(columnNames.size()));

        List<Object[]> batchArgs = new ArrayList<>();
        for (List<String> rowValues : newValues) {
            List<Object> parsedRow = buildParsedRowValues(columnNames, columnTypes, rowValues, false);
            batchArgs.add(parsedRow.toArray());
        }

        jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    @Transactional
    public <T> void deleteRows(Class<T> entityClass, List<Integer> rowIndices) {
        if (rowIndices == null || rowIndices.isEmpty())
            return;

        String tableName = getTableName(entityClass);
        ensureForeignKeysInitialized();

        int batchSize = 1000;

        for (int i = 0; i < rowIndices.size(); i += batchSize) {
            List<Integer> batch = rowIndices.subList(i, Math.min(i + batchSize, rowIndices.size()));
            String placeholders = batch.stream().map(_ -> "?").collect(Collectors.joining(", "));
            String sql = "DELETE FROM " + tableName + " WHERE id IN (" + placeholders + ")";
            jdbcTemplate.update(sql, batch.toArray());
        }
    }

    // Foreign Keys

    public List<ForeignKeyInfo> logForeignKeys() {
        String sql = "SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME " +
                "FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
                "WHERE CONSTRAINT_NAME LIKE 'FK%' AND REFERENCED_TABLE_NAME IS NOT NULL";

        return jdbcTemplate.query(sql, (rs, _) -> new ForeignKeyInfo(
                rs.getString("TABLE_NAME"),
                rs.getString("CONSTRAINT_NAME"),
                rs.getString("COLUMN_NAME"),
                rs.getString("REFERENCED_TABLE_NAME"),
                rs.getString("REFERENCED_COLUMN_NAME")));
    }

    public void updateForeignKeys(List<ForeignKeyInfo> foreignKeys) {
        for (ForeignKeyInfo fk : foreignKeys) {
            String dropFKSql = "ALTER TABLE " + fk.tableName() + " DROP FOREIGN KEY " + fk.constraintName();
            jdbcTemplate.execute(dropFKSql);

            String addFKSql = "ALTER TABLE " + fk.tableName() +
                    " ADD CONSTRAINT " + fk.constraintName() +
                    " FOREIGN KEY (" + fk.columnName() + ") " +
                    " REFERENCES " + fk.referencedTableName() + "(" + fk.referencedColumnName() + ")" +
                    " ON DELETE CASCADE";
            jdbcTemplate.execute(addFKSql);
        }
    }

    @Transactional
    public void setupGuestTriggers() {
        List<String> tables = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME " +
                        "FROM INFORMATION_SCHEMA.TABLES " +
                        "WHERE TABLE_SCHEMA = DATABASE() " +
                        "  AND TABLE_NAME LIKE 'guests\\_%'",
                String.class);

        for (String table : tables) {
            String triggerName = "before_insert_" + table;
            jdbcTemplate.execute("DROP TRIGGER IF EXISTS " + triggerName + "");

            String createTrigger = "CREATE TRIGGER " + triggerName + "\n" +
                    "BEFORE INSERT ON " + table + "\n" +
                    "FOR EACH ROW\n" +
                    "BEGIN\n" +
                    "  DECLARE cnt INT;\n" +
                    "  SELECT COUNT(*) INTO cnt FROM guests WHERE id = NEW.guest_id;\n" +
                    "  IF cnt = 0 THEN\n" +
                    "    -- Вставляємо пустий рядок, щоб отримати новий ID\n" +
                    "    INSERT INTO guests () VALUES ();\n" +
                    "    SET NEW.guest_id = LAST_INSERT_ID();\n" +
                    "  END IF;\n" +
                    "END";
            jdbcTemplate.execute(createTrigger);
        }
    }

    private Map<String, List<String>> getColumnNamesFromForeignKeys(
            List<Map<String, String>> foreignKeys, String mainTable) {

        Set<String> relatedTableNames = foreignKeys.stream()
                .filter(fk -> mainTable.equalsIgnoreCase(fk.get("REFERENCED_TABLE_NAME")))
                .map(fk -> fk.get("TABLE_NAME"))
                .collect(Collectors.toSet());

        if (relatedTableNames.isEmpty())
            return Map.of();

        String inClause = String.join(", ", relatedTableNames.stream()
                .map(name -> "'" + name + "'").toList());

        String sql = "SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME IN (" + inClause
                + ")";

        List<Map<String, String>> rows = jdbcTemplate.query(sql, (rs, _) -> {
            Map<String, String> map = new HashMap<>();
            map.put("TABLE_NAME", rs.getString("TABLE_NAME"));
            map.put("COLUMN_NAME", rs.getString("COLUMN_NAME"));
            return map;
        });

        return rows.stream()
                .collect(Collectors.groupingBy(
                        r -> r.get("TABLE_NAME"),
                        Collectors.mapping(r -> r.get("COLUMN_NAME"), Collectors.toList())));
    }

    // Mini functions

    private List<Object> buildParsedRowValues(
            List<String> columnNames,
            List<Class<?>> columnTypes,
            List<String> rowValues,
            boolean isUpdate) {
        List<Object> parsedValues = new ArrayList<>();
        for (int i = 0; i < columnNames.size(); i++) {
            String columnName = columnNames.get(i);
            Class<?> type = columnTypes.get(i);
            Object value;

            if ("excel_changes".equals(columnName)) {
                value = isUpdate;
            } else if (i >= rowValues.size() || rowValues.get(i) == null || rowValues.get(i).isEmpty()) {
                value = getDefaultForType(type);
            } else {
                value = convertValue(rowValues.get(i), type);
                if (value instanceof String && ENCRYPTED_COLUMNS.contains(columnName)) {
                    value = cryptoUtil.encrypt((String) value);
                }
            }
            parsedValues.add(value);
        }
        return parsedValues;
    }

    private String generateSqlPlaceholders(int count) {
        return String.join(", ", Collections.nCopies(count, "?"));
    }

    private boolean isTableEmpty(String tableName) {
        String sql = "SELECT COUNT(*) FROM " + tableName;
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null && count == 0;
    }

    private <T> String getTableName(Class<T> entityClass) {
        if (entityClass.isAnnotationPresent(Table.class)) {
            return entityClass.getAnnotation(Table.class).name();
        }
        throw new IllegalArgumentException("Class does not have @Table annotation");
    }

    public <T> void extractTableFields(Class<T> entityClass, List<String> columnNames, List<Class<?>> columnTypes) {
        for (Field field : entityClass.getDeclaredFields()) {
            if (field.isAnnotationPresent(Id.class)) {
                continue;
            }
            if (field.getType().isAssignableFrom(List.class)) {
                continue;
            }
            if (field.isAnnotationPresent(JoinColumn.class)) {
                JoinColumn joinColumn = field.getAnnotation(JoinColumn.class);
                String columnName = joinColumn.name().isEmpty() ? toSqlFormat(field.getName()) : joinColumn.name();
                columnNames.add(columnName);
                columnTypes.add(field.getType());
            } else if (isSimpleType(field.getType())) {
                columnNames.add(toSqlFormat(field.getName()));
                columnTypes.add(field.getType());
            }
        }
    }

    private boolean isSimpleType(Class<?> type) {
        return type == String.class || type == Integer.class || type == Double.class || type == Long.class
                || type == Boolean.class || type == LocalDateTime.class;
    }

    private String toSqlFormat(String fieldName) {
        return CAMEL_TO_SNAKE.matcher(fieldName).replaceAll("$1_$2").toLowerCase();
    }

    private Object convertValue(String value, Class<?> targetType) {
        try {
            return switch (targetType.getSimpleName()) {
                case "String" -> value;
                case "Integer" -> value.contains(".") ? (int) Double.parseDouble(value) : Integer.parseInt(value);
                case "Double" -> Double.parseDouble(value);
                case "Long" -> Long.parseLong(value.split("\\.")[0]);
                case "Boolean" -> value.equalsIgnoreCase("true") || value.equals("1");
                case "LocalDateTime" -> parseDate(value);
                default -> Long.parseLong(value.split("\\.")[0]);
            };
        } catch (Exception e) {
            return getDefaultForType(targetType);
        }
    }

    private Object getDefaultForType(Class<?> targetType) {
        return switch (targetType.getSimpleName()) {
            case "String" -> null;
            case "Integer" -> 0;
            case "Double" -> 0.0;
            case "Long" -> 0L;
            case "Boolean" -> false;
            case "LocalDateTime" -> LocalDateTime.MIN;
            default -> null;
        };
    }

    private LocalDateTime parseDate(String value) {
        try {
            if (value.matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}")) {
                return LocalDateTime.parse(value, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            }
            if (value.matches("^\\d+(\\.\\d+)?$")) {
                double excelDate = Double.parseDouble(value);
                return LocalDateTime.of(1899, 12, 30, 0, 0).plusSeconds((long) (excelDate * 86400));
            }
        } catch (Exception e) {
            log.error("Date parse value {} error: {}", value, e);
        }
        return LocalDateTime.MIN;
    }
}
