package com.optics_store.optics.excel;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import com.optics_store.optics.util.CryptoUtil;
import com.optics_store.optics.util.FileLockDetector;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * File modification and lock state manager for Excel documents.
 * Works alongside file locking detectors to prevent read/write conflicts and
 * race conditions when multiple asynchronous threads attempt to modify the same
 * Excel document simultaneously.
 */
public class ExcelChanger {

    private final ExcelReader excelReader;
    private final ExcelWatcher excelWatcher;
    private final CryptoUtil cryptoUtil;

    private final ExecutorService executorService = Executors.newCachedThreadPool();
    public static final Set<String> IGNORED = ConcurrentHashMap.newKeySet();
    private static final Map<String, Long> lastInternalSync = new ConcurrentHashMap<>();

    public void addRows(
            String filePath,
            int sheetIndex,
            List<String> columnFormats,
            List<List<String>> newValues) throws IOException {
        decryptNewValues(newValues);

        File file = resolveFilePath(filePath);
        if (!file.exists())
            throw new IOException("File not found: " + file.getAbsolutePath());

        String key = filePath + "#" + sheetIndex;
        FileLockDetector.markInternal(key);
        IGNORED.add(key);
        try (FileInputStream fis = new FileInputStream(file);
                Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(sheetIndex);
            int lastRowNum = excelReader.findLastNonEmptyRow(sheet, sheetIndex);
            List<Integer> columnNumbers = excelReader.findNonEmptyColumnNumbers(sheet);
            List<Pair<Integer, String>> colSpec = zip(columnNumbers, columnFormats);
            Row refRow = sheet.getRow(lastRowNum);

            for (List<String> values : newValues) {
                lastRowNum++;
                Row newRow = sheet.createRow(lastRowNum);

                for (int j = 0; j < colSpec.size(); j++) {
                    int col = colSpec.get(j).getLeft();
                    String format = colSpec.get(j).getRight();
                    String value = values.get(j);

                    Cell cell = newRow.createCell(col);
                    Cell refCell = refRow.getCell(col, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);

                    if (refCell.getCellType() == CellType.FORMULA) {
                        String formula = updateFormulaIndex(refCell.getCellFormula());
                        cell.setCellFormula(formula);
                    } else if (value == null || value.isEmpty()) {
                        cell.setBlank();
                    } else {
                        applyFormattedValue(cell, value, format);
                    }

                    cell.setCellStyle(refCell.getCellStyle());
                }
            }

            try (FileOutputStream fos = new FileOutputStream(file)) {
                workbook.write(fos);
            }
        } finally {
            FileLockDetector.unmarkInternal(key);
            IGNORED.remove(key);
        }
    }

    public void updateRows(
            String filePath,
            int sheetIndex,
            List<Integer> rowIndices,
            List<String> columnFormats,
            List<List<String>> newValues) throws IOException {
        decryptNewValues(newValues);

        File file = resolveFilePath(filePath);
        if (!file.exists())
            throw new IOException("File not found: " + file.getAbsolutePath());

        String key = filePath + "#" + sheetIndex;
        FileLockDetector.markInternal(key);
        IGNORED.add(key);
        try (FileInputStream fis = new FileInputStream(file);
                Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(sheetIndex);
            List<Integer> columnNumbers = excelReader.findNonEmptyColumnNumbers(sheet);
            var colSpec = zip(columnNumbers, columnFormats);
            var evaluator = workbook.getCreationHelper().createFormulaEvaluator();

            for (int i = 0; i < rowIndices.size(); i++) {
                int rowIndex = rowIndices.get(i);
                Row row = sheet.getRow(rowIndex);
                if (row == null)
                    row = sheet.createRow(rowIndex);
                List<String> values = newValues.get(i);

                for (int j = 0; j < colSpec.size(); j++) {
                    int col = colSpec.get(j).getLeft();
                    String format = colSpec.get(j).getRight();
                    String value = values.get(j);

                    Cell cell = row.getCell(col, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    CellStyle style = cell.getCellStyle();

                    if ("FORMULA".equalsIgnoreCase(format)) {
                        evaluator.evaluateFormulaCell(cell);
                    } else if (value == null || value.isEmpty()) {
                        cell.setBlank();
                    } else {
                        applyFormattedValue(cell, value, format);
                    }

                    cell.setCellStyle(style);
                }
            }

            try (FileOutputStream fos = new FileOutputStream(file)) {
                workbook.write(fos);
            }
        } finally {
            FileLockDetector.unmarkInternal(key);
            IGNORED.remove(key);
        }
    }

    public void deleteRows(
            String filePath,
            int sheetIndex,
            List<Integer> rowIndices) throws IOException {
        File file = resolveFilePath(filePath);
        if (!file.exists())
            throw new IOException("File not found: " + file.getAbsolutePath());

        String key = filePath + "#" + sheetIndex;
        FileLockDetector.markInternal(key);
        IGNORED.add(key);
        try (FileInputStream fis = new FileInputStream(file);
                Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(sheetIndex);
            int lastRowNum = sheet.getLastRowNum();
            List<Integer> sortedRowIndices = rowIndices.stream()
                    .filter(i -> i >= 0 && i <= lastRowNum)
                    .sorted(Comparator.reverseOrder())
                    .toList();

            for (int rowIndex : sortedRowIndices) {
                sheet.removeRow(sheet.getRow(rowIndex));
                if (rowIndex < lastRowNum) {
                    sheet.shiftRows(rowIndex + 1, lastRowNum, -1);
                }
            }

            try (FileOutputStream fos = new FileOutputStream(file)) {
                workbook.write(fos);
            }
        } finally {
            FileLockDetector.unmarkInternal(key);
            IGNORED.remove(key);
        }
    }

    // Change Tracking

    public void watchFileChanges(
            Class<?> entityClass,
            String filePath,
            int sheetNumber) {
        String key = filePath + "#" + sheetNumber;

        executorService.submit(() -> {
            try {
                File file = resolveFilePath(filePath);
                Path dir = file.toPath().getParent();
                WatchService watchService = FileSystems.getDefault().newWatchService();
                dir.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

                String lastHash = getFileHash(file);
                long lastModified = file.lastModified();
                List<Pair<String, List<String>>> prevData = excelReader.readExcel(new FileInputStream(file),
                        sheetNumber);
                final long DEBOUNCE_MS = 500;
                long lastProcessed = 0;

                while (true) {
                    WatchKey watchKey = watchService.take();
                    for (WatchEvent<?> event : watchKey.pollEvents()) {
                        if (event.kind() == StandardWatchEventKinds.ENTRY_MODIFY
                                && ((Path) event.context()).toString().equals(file.getName())) {

                            long now = System.currentTimeMillis();
                            if (now - lastProcessed < DEBOUNCE_MS)
                                continue;
                            lastProcessed = now;

                            if (file.length() == 0 || file.lastModified() == lastModified)
                                continue;
                            lastModified = file.lastModified();

                            String currentHash = getFileHash(file);
                            if (currentHash.equals(lastHash))
                                continue;
                            lastHash = currentHash;

                            List<Pair<String, List<String>>> currData;
                            try (InputStream in = new FileInputStream(file)) {
                                currData = excelReader.readExcel(in, sheetNumber);
                            } catch (Exception e) {
                                continue;
                            }

                            Long t0 = lastInternalSync.get(key);
                            if (t0 != null && System.currentTimeMillis() - t0 < 2_000) {
                                lastInternalSync.remove(key);
                                prevData = new ArrayList<>(currData);
                            } else {
                                excelWatcher.definitionChanges(entityClass, prevData, currData, filePath,
                                        file.getName(), sheetNumber);
                                prevData = new ArrayList<>(currData);
                            }
                        }
                    }
                    watchKey.reset();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    // Mini functions

    private <L, R> List<Pair<L, R>> zip(List<L> left, List<R> right) {
        int size = Math.min(left.size(), right.size());
        List<Pair<L, R>> result = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            result.add(Pair.of(left.get(i), right.get(i)));
        }
        return result;
    }

    /**
     * Concurrency and state control methods.
     * Used to explicitly mark specific Excel files as 'currently being modified by
     * the system' to prevent external access or redundant synchronization loops.
     */
    public static void markInternalSync(String key) {
        lastInternalSync.put(key, System.currentTimeMillis());
    }

    private String updateFormulaIndex(String formula) {
        Pattern pattern = Pattern.compile("([A-Z]+)(\\d+)");
        Matcher matcher = pattern.matcher(formula);
        StringBuffer updatedFormula = new StringBuffer();

        while (matcher.find()) {
            String column = matcher.group(1);
            int rowNumber = Integer.parseInt(matcher.group(2)) + 1;
            matcher.appendReplacement(updatedFormula, column + rowNumber);
        }
        matcher.appendTail(updatedFormula);

        return updatedFormula.toString();
    }

    private void decryptNewValues(List<List<String>> newValues) {
        newValues.parallelStream().forEach(row -> {
            for (int i = 0; i < row.size(); i++) {
                String v = row.get(i);
                if (v != null && v.contains("-")) {
                    try {
                        String plain = cryptoUtil.decrypt(v);
                        row.set(i, plain);
                    } catch (Exception ignored) {
                    }
                }
            }
        });
    }

    private void applyFormattedValue(Cell cell, String value, String format) {
        try {
            switch (format) {
                case "TEXT":
                    cell.setCellValue(value);
                    break;
                case "NUMERIC":
                    cell.setCellValue(Double.parseDouble(value));
                    break;
                case "INTEGER":
                    cell.setCellValue(Double.parseDouble(value));
                    break;
                case "DECIMAL":
                    cell.setCellValue(Double.parseDouble(value.replace(',', '.')));
                    break;
                case "DATETIME":
                    SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
                    Date date = sdf.parse(value);
                    cell.setCellValue(date);
                    break;
                case "BOOLEAN":
                    cell.setCellValue(Boolean.parseBoolean(value));
                    break;
                default:
                    cell.setCellValue(value);
                    break;
            }
        } catch (Exception e) {
            cell.setCellValue(value);
        }
    }

    private File resolveFilePath(String filePath) {
        File srcPath = Paths.get("src/main/resources", filePath).toFile();
        File targetPath = Paths.get("target/classes", filePath).toFile();
        File defaultPath = new File(filePath);

        if (srcPath.exists()) {
            return srcPath;
        } else if (targetPath.exists()) {
            return targetPath;
        } else {
            return defaultPath;
        }
    }

    private String getFileHash(File file) {
        try (InputStream fis = new FileInputStream(file)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }
            byte[] hashBytes = digest.digest();
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
