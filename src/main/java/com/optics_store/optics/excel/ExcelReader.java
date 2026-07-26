package com.optics_store.optics.excel;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.optics_store.optics.util.CryptoUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
/**
 * Component of the custom two-way asynchronous synchronization system.
 * Facilitates seamless data exchange between the online MariaDB SQL database
 * and the offline store's Excel documents.
 */
public class ExcelReader {

    private final CryptoUtil cryptoUtil;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter INPUT_DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    public ExcelReader(CryptoUtil cryptoUtil) {
        this.cryptoUtil = cryptoUtil;
    }

    public List<Pair<String, List<String>>> readExcel(InputStream inputStream, int sheetNumber) throws IOException {
        List<Pair<String, List<String>>> tableData = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(sheetNumber);
            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

            int startingRow = findFirstNonEmptyRow(sheet);
            int lastRowNum = findLastNonEmptyRow(sheet, startingRow);
            int startingCol = findFirstNonEmptyColumn(sheet, startingRow, lastRowNum);
            int lastColNum = findLastNonEmptyColumn(sheet, startingRow, lastRowNum);
            List<Boolean> nonEmptyCols = findNonEmptyColumns(sheet, startingRow, lastRowNum, startingCol, lastColNum);

            Map<String, Integer> rowHashToGroupId = new LinkedHashMap<>();
            Map<String, Integer> occurrences = new HashMap<>();
            int nextGroupId = 0;

            StringBuilder rowKeyBuilder = new StringBuilder(512);

            for (int rowNum = startingRow + 1; rowNum <= lastRowNum; rowNum++) {
                Row row = sheet.getRow(rowNum);
                if (row == null)
                    continue;

                List<String> rowData = new ArrayList<>();
                boolean isEmpty = true;
                rowKeyBuilder.setLength(0);

                for (int colOffset = 0; colOffset <= lastColNum - startingCol; colOffset++) {
                    if (!nonEmptyCols.get(colOffset))
                        continue;
                    int colNum = startingCol + colOffset;

                    Cell cell = row.getCell(colNum);
                    String value = getCellValue(cell, evaluator);
                    rowData.add(value);

                    if (value != null && !value.isEmpty()) {
                        isEmpty = false;
                    }

                    rowKeyBuilder.append(value == null ? "∅" : value).append('\u0001');
                }

                if (isEmpty)
                    continue;

                String rowKey = rowKeyBuilder.toString();

                if (!rowHashToGroupId.containsKey(rowKey)) {
                    rowHashToGroupId.put(rowKey, nextGroupId++);
                    occurrences.put(rowKey, 0);
                }

                int groupId = rowHashToGroupId.get(rowKey);
                int occ = occurrences.get(rowKey);
                String key = groupId + "-" + occ;

                occurrences.put(rowKey, occ + 1);
                tableData.add(Pair.of(key, rowData));
            }
        }

        return tableData;
    }

    public Map<String, List<Integer>> searchRows(
            List<List<String>> searchValuesList,
            String excelFilePath,
            int sheetNumber,
            int updateCount) throws IOException {
        List<List<String>> decryptedSearchValuesList = searchValuesList.stream()
                .map(list -> list.stream().map(this::tryDecrypt).toList())
                .toList();

        ClassPathResource resource = new ClassPathResource(excelFilePath);
        List<List<String>> allRowValues = new ArrayList<>();
        try (InputStream is = resource.getInputStream();
                Workbook wb = new XSSFWorkbook(is)) {

            Sheet sheet = wb.getSheetAt(sheetNumber);
            FormulaEvaluator eval = wb.getCreationHelper().createFormulaEvaluator();
            for (int r = 0; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) {
                    allRowValues.add(new ArrayList<>());
                    continue;
                }
                List<String> rowVals = new ArrayList<>();
                for (Cell c : row) {
                    rowVals.add(getCellValue(c, eval));
                }
                allRowValues.add(rowVals);
            }
        }

        List<List<Integer>> allMatchedIndices = new ArrayList<>();
        for (List<String> terms : decryptedSearchValuesList) {
            List<Integer> matched = new ArrayList<>();
            for (int i = 0; i < allRowValues.size(); i++) {
                List<String> row = allRowValues.get(i);
                boolean ok = terms.stream().allMatch(term -> row.stream().anyMatch(cell -> matchesTerm(cell, term)));
                if (ok)
                    matched.add(i);
            }
            Collections.sort(matched);
            allMatchedIndices.add(matched);
        }

        Map<List<Integer>, Integer> reuse = new HashMap<>();
        List<Integer> updateIds = new ArrayList<>();
        List<Integer> deleteIds = new ArrayList<>();

        for (int i = 0; i < allMatchedIndices.size(); i++) {
            List<Integer> list = allMatchedIndices.get(i);
            if (list.isEmpty())
                continue;
            reuse.putIfAbsent(list, 0);
            int idx = reuse.get(list);
            if (idx < list.size()) {
                int id = list.get(idx);
                if (i < updateCount) {
                    updateIds.add(id);
                } else {
                    deleteIds.add(id);
                }
                reuse.put(list, idx + 1);
            }
        }

        return Map.of("UPDATE", updateIds, "DELETE", deleteIds);
    }

    public List<String> columnFormats(String excelFilePath, int sheetNumber) throws IOException {
        List<String> columnFormats = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource(excelFilePath);
        try (InputStream inputStream = resource.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(sheetNumber);
            int startingRow = findFirstNonEmptyRow(sheet);
            int lastRowNum = findLastNonEmptyRow(sheet, startingRow);
            int startingColumn = findFirstNonEmptyColumn(sheet, startingRow, lastRowNum);
            int lastColumnNum = findLastNonEmptyColumn(sheet, startingRow, lastRowNum);
            List<Boolean> nonEmptyColumns = findNonEmptyColumns(sheet, startingRow, lastRowNum, startingColumn,
                    lastColumnNum);

            for (int colNum = startingColumn; colNum <= lastColumnNum; colNum++) {
                if (!nonEmptyColumns.get(colNum - startingColumn))
                    continue;

                String columnType = "UNKNOWN";
                for (int rowNum = startingRow + 1; rowNum <= lastRowNum; rowNum++) {
                    Row row = sheet.getRow(rowNum);
                    if (row == null)
                        continue;

                    Cell cell = row.getCell(colNum);
                    if (cell == null || cell.getCellType() == CellType.BLANK)
                        continue;

                    switch (cell.getCellType()) {
                        case STRING -> columnType = "TEXT";
                        case NUMERIC -> columnType = DateUtil.isCellDateFormatted(cell) ? "DATETIME" : "NUMERIC";
                        case BOOLEAN -> columnType = "BOOLEAN";
                        case FORMULA -> columnType = "FORMULA";
                        default -> {
                        }
                    }
                    if (!columnType.equals("UNKNOWN"))
                        break;
                }
                columnFormats.add(columnType);
            }
        } catch (Exception e) {
            log.error("Error reading Excel file {} on sheet {}: {}", excelFilePath, sheetNumber, e.getMessage());
        }
        return columnFormats;
    }

    // Mini functions

    private String tryDecrypt(String input) {
        if (input == null || !input.startsWith(cryptoUtil.getCurrentKeyId() + "-")) {
            return input;
        }
        try {
            return cryptoUtil.decrypt(input);
        } catch (Exception e) {
            return input;
        }
    }

    private int findFirstNonEmptyRow(Sheet sheet) {
        for (int rowNum = 0; rowNum <= sheet.getLastRowNum(); rowNum++) {
            Row row = sheet.getRow(rowNum);
            if (row != null && !isRowEmpty(row)) {
                return rowNum;
            }
        }
        return 0;
    }

    public int findLastNonEmptyRow(Sheet sheet, int startingRow) {
        for (int rowNum = sheet.getLastRowNum(); rowNum >= startingRow; rowNum--) {
            Row row = sheet.getRow(rowNum);
            if (row != null && !isRowEmpty(row)) {
                return rowNum;
            }
        }
        return startingRow;
    }

    private int findFirstNonEmptyColumn(Sheet sheet, int startingRow, int lastRowNum) {
        int firstColumn = Integer.MAX_VALUE;
        for (int rowNum = startingRow; rowNum <= lastRowNum; rowNum++) {
            Row row = sheet.getRow(rowNum);
            if (row == null)
                continue;
            for (int colNum = 0; colNum < row.getLastCellNum(); colNum++) {
                Cell cell = row.getCell(colNum);
                if (cell != null && !cell.toString().trim().isEmpty()) {
                    firstColumn = Math.min(firstColumn, colNum);
                }
            }
        }
        return (firstColumn == Integer.MAX_VALUE) ? 0 : firstColumn;
    }

    private int findLastNonEmptyColumn(Sheet sheet, int startingRow, int lastRowNum) {
        int lastColumn = 0;
        for (int rowNum = startingRow; rowNum <= lastRowNum; rowNum++) {
            Row row = sheet.getRow(rowNum);
            if (row == null)
                continue;
            for (int colNum = row.getLastCellNum() - 1; colNum >= 0; colNum--) {
                Cell cell = row.getCell(colNum);
                if (cell != null && !cell.toString().trim().isEmpty()) {
                    lastColumn = Math.max(lastColumn, colNum);
                    break;
                }
            }
        }
        return lastColumn;
    }

    private List<Boolean> findNonEmptyColumns(Sheet sheet, int startingRow, int lastRowNum, int startingColumn,
            int lastColumnNum) {
        List<Boolean> nonEmptyColumns = new ArrayList<>(Collections.nCopies(lastColumnNum - startingColumn + 1, false));
        for (int rowNum = startingRow; rowNum <= lastRowNum; rowNum++) {
            Row row = sheet.getRow(rowNum);
            if (row == null)
                continue;
            for (int colNum = startingColumn; colNum <= lastColumnNum; colNum++) {
                Cell cell = row.getCell(colNum);
                if (cell != null && !cell.toString().trim().isEmpty()) {
                    nonEmptyColumns.set(colNum - startingColumn, true);
                }
            }
        }
        return nonEmptyColumns;
    }

    public List<Integer> findNonEmptyColumnNumbers(Sheet sheet) {
        int firstRow = findFirstNonEmptyRow(sheet);
        int lastRow = findLastNonEmptyRow(sheet, firstRow);
        int firstCol = findFirstNonEmptyColumn(sheet, firstRow, lastRow);
        int lastCol = findLastNonEmptyColumn(sheet, firstRow, lastRow);

        List<Boolean> nonEmptyFlags = findNonEmptyColumns(sheet, firstRow, lastRow, firstCol, lastCol);

        List<Integer> cols = new ArrayList<>();
        for (int i = 0; i < nonEmptyFlags.size(); i++) {
            if (nonEmptyFlags.get(i)) {
                cols.add(firstCol + i);
            }
        }
        return cols;
    }

    private boolean matchesTerm(String cell, String term) {
        if (cell == null || term == null)
            return false;
        try {
            if (term.length() == 19 && cell.length() == 19) {
                LocalDateTime termDate = LocalDateTime.parse(term, INPUT_DATE_FORMATTER);
                LocalDateTime cellDate = LocalDateTime.parse(cell, DATE_TIME_FORMATTER);
                return cellDate.equals(termDate);
            }
        } catch (Exception ignored) {
        }
        return cell.contains(term);
    }

    private String getCellValue(Cell cell, FormulaEvaluator evaluator) {
        if (cell == null)
            return null;
        return switch (cell.getCellType()) {
            case STRING -> {
                String s = cell.getStringCellValue().trim();
                yield s.isEmpty() ? null : s;
            }
            case NUMERIC -> DateUtil.isCellDateFormatted(cell)
                    ? formatDate(cell.getDateCellValue())
                    : formatNumber(cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> evaluator != null ? getFormulaCellValue(cell, evaluator) : null;
            default -> null;
        };
    }

    private String getFormulaCellValue(Cell cell, FormulaEvaluator evaluator) {
        CellValue cellValue = evaluator.evaluate(cell);
        if (cellValue == null)
            return null;
        return switch (cellValue.getCellType()) {
            case STRING -> cellValue.getStringValue().trim();
            case NUMERIC -> DateUtil.isCellDateFormatted(cell)
                    ? formatDate(cell.getDateCellValue())
                    : formatNumber(cellValue.getNumberValue());
            case BOOLEAN -> String.valueOf(cellValue.getBooleanValue());
            default -> null;
        };
    }

    private String formatDate(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime()
                .format(DATE_TIME_FORMATTER);
    }

    private String formatNumber(double value) {
        return (value % 1 == 0) ? String.valueOf((long) value) : String.valueOf(value);
    }

    private boolean isRowEmpty(Row row) {
        int nonEmptyCellCount = 0;
        for (int cellNum = row.getFirstCellNum(); cellNum < row.getLastCellNum(); cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null && !cell.toString().trim().isEmpty()) {
                if (++nonEmptyCellCount > 1)
                    return false;
            }
        }
        return true;
    }
}
