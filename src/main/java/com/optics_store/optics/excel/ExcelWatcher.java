package com.optics_store.optics.excel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Component;

import com.optics_store.optics.sync.ChangeBufferManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
/**
 * Component of the custom two-way asynchronous synchronization system.
 * Facilitates seamless data exchange between the online MariaDB SQL database
 * and the offline store's Excel documents.
 */
public class ExcelWatcher {

    private final ChangeBufferManager changeBufferManager;

    private static class Interval {
        final String prefix;
        final int start;
        final int end;
        final int length;

        Interval(String area) {
            int dash = area.indexOf('-');
            if (dash >= 0) {
                this.start = Integer.parseInt(area.substring(0, dash));
                this.end = Integer.parseInt(area.substring(dash + 1));
                this.prefix = area.substring(0, dash);
            } else {
                this.start = Integer.parseInt(area);
                this.end = this.start;
                this.prefix = area;
            }
            this.length = this.end - this.start + 1;
        }
    }

    private List<Integer> missingValues(
            List<Pair<String, List<String>>> previousExcelData,
            List<Pair<String, List<String>>> currentExcelData) {
        Map<String, Integer> currentDataCount = new HashMap<>();
        for (Pair<String, List<String>> pair : currentExcelData) {
            String key = String.join("|", pair.getRight());
            currentDataCount.put(key, currentDataCount.getOrDefault(key, 0) + 1);
        }

        Map<String, List<Integer>> groupMissingIndices = new LinkedHashMap<>();
        List<Integer> finalMissingIndices = new ArrayList<>();

        Map<String, Integer> leftToIndex = new HashMap<>();
        for (int i = 0; i < previousExcelData.size(); i++) {
            leftToIndex.put(previousExcelData.get(i).getLeft(), i + 1);
        }

        for (int i = 0; i < previousExcelData.size(); i++) {
            Pair<String, List<String>> prevPair = previousExcelData.get(i);
            String key = String.join("|", prevPair.getRight());
            String left = prevPair.getLeft();

            if (!currentDataCount.containsKey(key) || currentDataCount.get(key) == 0) {
                if (left.matches("\\d+-\\d+")) {
                    String[] parts = left.split("-");
                    int group = Integer.parseInt(parts[0]);
                    int sub = Integer.parseInt(parts[1]);
                    if (sub > 0) {
                        groupMissingIndices.computeIfAbsent(String.valueOf(group), _ -> new ArrayList<>()).add(sub);
                        continue;
                    }
                }
                finalMissingIndices.add(i + 1);
            } else {
                currentDataCount.put(key, currentDataCount.get(key) - 1);
            }
        }

        for (Map.Entry<String, List<Integer>> entry : groupMissingIndices.entrySet()) {
            String group = entry.getKey();
            List<Integer> subs = entry.getValue();
            Collections.sort(subs);
            for (int i = 0; i < subs.size(); i++) {
                String composedLeft = group + "-" + i;
                Integer idx = leftToIndex.get(composedLeft);
                if (idx != null) {
                    finalMissingIndices.add(idx);
                }
            }
        }

        Collections.sort(finalMissingIndices);
        return finalMissingIndices;
    }

    private List<String> missingValuesArea(List<Integer> missingValues) {
        if (missingValues.isEmpty())
            return Collections.emptyList();
        List<String> areas = new ArrayList<>();
        Collections.sort(missingValues);
        int start = missingValues.get(0), end = start;
        for (int i = 1; i < missingValues.size(); i++) {
            int current = missingValues.get(i);
            if (current == end + 1)
                end = current;
            else {
                areas.add(start == end ? String.valueOf(start) : start + "-" + end);
                start = end = current;
            }
        }
        areas.add(start == end ? String.valueOf(start) : start + "-" + end);
        return areas;
    }

    private List<Integer> findingNewValues(
            List<Pair<String, List<String>>> previousExcelData,
            List<Pair<String, List<String>>> currentExcelData) {
        Map<String, Integer> previousDataCount = new HashMap<>();
        for (Pair<String, List<String>> pair : previousExcelData) {
            String key = String.join("|", pair.getRight());
            previousDataCount.put(key, previousDataCount.getOrDefault(key, 0) + 1);
        }

        Map<String, List<Integer>> groupNewSubs = new LinkedHashMap<>();
        List<Integer> finalNewIndices = new ArrayList<>();

        Map<String, Integer> leftToIndex = new HashMap<>();
        for (int i = 0; i < currentExcelData.size(); i++) {
            leftToIndex.put(currentExcelData.get(i).getLeft(), i + 1);
        }

        for (int i = 0; i < currentExcelData.size(); i++) {
            Pair<String, List<String>> currPair = currentExcelData.get(i);
            String key = String.join("|", currPair.getRight());
            String left = currPair.getLeft();

            if (!previousDataCount.containsKey(key) || previousDataCount.get(key) == 0) {
                if (left.matches("\\d+-\\d+")) {
                    String[] parts = left.split("-");
                    int group = Integer.parseInt(parts[0]);
                    int sub = Integer.parseInt(parts[1]);
                    if (sub > 0) {
                        groupNewSubs.computeIfAbsent(String.valueOf(group), _ -> new ArrayList<>()).add(sub);
                        continue;
                    }
                }
                finalNewIndices.add(i + 1);
            } else {
                previousDataCount.put(key, previousDataCount.get(key) - 1);
            }
        }

        for (Map.Entry<String, List<Integer>> entry : groupNewSubs.entrySet()) {
            String group = entry.getKey();
            List<Integer> subs = entry.getValue();
            Collections.sort(subs);
            for (int i = 0; i < subs.size(); i++) {
                String composedLeft = group + "-" + i;
                Integer idx = leftToIndex.get(composedLeft);
                if (idx != null) {
                    finalNewIndices.add(idx);
                }
            }
        }

        Collections.sort(finalNewIndices);
        return finalNewIndices;
    }

    private List<List<String>> fusionFindAdjustImproved(
            List<String> missingValuesArea,
            List<Integer> findingNewValues) {
        List<Interval> intervals = missingValuesArea.stream()
                .map(Interval::new)
                .collect(Collectors.toList());
        int nIntervals = intervals.size();

        List<List<String>> assignments = new ArrayList<>();
        int ci = 0;
        int totalOffset = 0;
        int prevOriginal = -1;
        int groupCount = 0;

        for (int i = 0; i < findingNewValues.size(); i++) {
            int currOriginal = findingNewValues.get(i);
            boolean newGroupStart = (i == 0) || (currOriginal - prevOriginal != 1);

            if (newGroupStart) {
                if (i == 0) {
                    while (ci < nIntervals && intervals.get(ci).end < currOriginal) {
                        ci++;
                    }
                } else {
                    if (ci < nIntervals) {
                        Interval iv = intervals.get(ci);
                        totalOffset += iv.length - groupCount;
                        ci++;
                    }
                    if (ci < nIntervals) {
                        Interval iv = intervals.get(ci);
                        int testOffset = iv.length;
                        int testCi = ci + 1;
                        int testAdjusted = currOriginal + totalOffset + testOffset;
                        if (testCi < nIntervals) {
                            Interval next = intervals.get(testCi);
                            if (testAdjusted >= next.start && testAdjusted <= next.end) {
                                totalOffset += testOffset;
                                ci = testCi;
                            }
                        }
                    }
                }
                groupCount = 0;
            }

            int currIntervalLength = (ci < nIntervals) ? intervals.get(ci).length : 0;
            String intervalStr;
            if (!newGroupStart && currIntervalLength > 0 && groupCount >= currIntervalLength) {
                intervalStr = "";
            } else if (ci < nIntervals) {
                intervalStr = intervals.get(ci).prefix;
            } else {
                intervalStr = "";
            }

            assignments.add(List.of(intervalStr, String.valueOf(currOriginal)));
            prevOriginal = currOriginal;
            if (!(intervalStr.isEmpty() && !newGroupStart && currIntervalLength > 0
                    && groupCount >= currIntervalLength)) {
                groupCount++;
            }
        }

        return assignments;
    }

    private List<List<String>> parameterDefinitionImproved(
            List<String> missingValuesArea,
            List<List<String>> fusionFindAdjust) {
        Map<String, List<String>> grouped = fusionFindAdjust.stream()
                .collect(Collectors.groupingBy(
                        pair -> pair.get(0),
                        LinkedHashMap::new,
                        Collectors.mapping(pair -> pair.get(1), Collectors.toList())));

        List<List<String>> result = new ArrayList<>();
        for (String area : missingValuesArea) {
            String startStr = area.contains("-")
                    ? area.substring(0, area.indexOf('-'))
                    : area;
            List<String> vals = grouped.getOrDefault(startStr, Collections.emptyList());
            List<String> row = new ArrayList<>(vals.size() + 1);
            row.add(area);
            row.addAll(vals);
            result.add(row);
        }
        List<String> extras = grouped.get("");
        if (extras != null && !extras.isEmpty()) {
            List<String> addRow = new ArrayList<>(extras.size() + 1);
            addRow.add("");
            addRow.addAll(extras);
            result.add(addRow);
        }

        return result;
    }

    public void definitionChanges(
            Class<?> entityClass,
            List<Pair<String, List<String>>> previousExcelData,
            List<Pair<String, List<String>>> currentExcelData,
            String excelFilePath,
            String wasChanged,
            int sheetNumber) {
        List<List<String>> prevDataRows = previousExcelData.stream().map(Pair::getRight).collect(Collectors.toList());
        List<List<String>> currDataRows = currentExcelData.stream().map(Pair::getRight).collect(Collectors.toList());

        List<Integer> missingValues = missingValues(previousExcelData, currentExcelData);
        List<String> missingValuesArea = missingValuesArea(missingValues);
        List<Integer> findingNewValues = findingNewValues(previousExcelData, currentExcelData);

        List<List<String>> fusionFindAdjust = fusionFindAdjustImproved(missingValuesArea, findingNewValues);
        List<List<String>> parameterDefinition = parameterDefinitionImproved(missingValuesArea, fusionFindAdjust);

        List<List<String>> addedRows = new ArrayList<>();
        List<List<String>> oldRows = new ArrayList<>();
        List<List<String>> updatedRows = new ArrayList<>();
        List<List<String>> deletedRows = new ArrayList<>();

        if (!parameterDefinition.isEmpty()) {
            log.info("{} was changed on sheet {}", wasChanged, sheetNumber);

            for (List<String> parameter : parameterDefinition) {
                String interval = parameter.get(0);
                List<Integer> newRowIndexes = parameter.subList(1, parameter.size()).stream()
                        .map(i -> Integer.parseInt(i) - 1)
                        .collect(Collectors.toList());

                if (interval.contains("-")) {
                    String[] bounds = interval.split("-");
                    int start = Integer.parseInt(bounds[0]) - 1;
                    int end = Integer.parseInt(bounds[1]) - 1;
                    processInterval(prevDataRows, currDataRows, start, end, newRowIndexes, oldRows, updatedRows,
                            deletedRows);
                } else if (!interval.isEmpty()) {
                    int rowIndex = Integer.parseInt(interval) - 1;
                    if (newRowIndexes.isEmpty()) {
                        deletedRows.add(prevDataRows.get(rowIndex));
                    } else {
                        processInterval(prevDataRows, currDataRows, rowIndex, rowIndex, newRowIndexes, oldRows,
                                updatedRows, deletedRows);
                    }
                } else {
                    processAddedRows(currDataRows, newRowIndexes, addedRows);
                }
            }
        }

        if (!addedRows.isEmpty()) {
            changeBufferManager.queueAdd(entityClass, excelFilePath, sheetNumber, addedRows);
        }
        if (!updatedRows.isEmpty()) {
            changeBufferManager.queueUpdate(entityClass, excelFilePath, sheetNumber, oldRows, updatedRows);
        }
        if (!deletedRows.isEmpty()) {
            changeBufferManager.queueDelete(entityClass, excelFilePath, sheetNumber, deletedRows);
        }
    }

    private void processInterval(
            List<List<String>> previousExcelData,
            List<List<String>> currentExcelData,
            int start, int end,
            List<Integer> newRowIndexes,
            List<List<String>> oldRows,
            List<List<String>> updatedRows,
            List<List<String>> deletedRows) {
        Set<Integer> usedRows = new HashSet<>();

        for (int newIndex : newRowIndexes) {
            int bestMatchIndex = findBestMatch(previousExcelData, currentExcelData.get(newIndex), start, end, usedRows);
            if (bestMatchIndex != -1) {
                usedRows.add(bestMatchIndex);
                oldRows.add(new ArrayList<>(previousExcelData.get(bestMatchIndex)));
                updatedRows.add(new ArrayList<>(currentExcelData.get(newIndex)));
            }
        }

        for (int i = start; i <= end; i++) {
            if (!usedRows.contains(i)) {
                deletedRows.add(previousExcelData.get(i));
            }
        }
    }

    private int findBestMatch(
            List<List<String>> previousExcelData,
            List<String> currentRow,
            int start, int end,
            Set<Integer> usedRows) {
        Set<String> currentSet = new HashSet<>(currentRow);
        int bestMatchIndex = -1;
        int maxMatches = -1;

        for (int i = start; i <= end; i++) {
            if (usedRows.contains(i))
                continue;
            int matches = countMatches(previousExcelData.get(i), currentSet);
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatchIndex = i;
            }
        }
        return bestMatchIndex;
    }

    private int countMatches(List<String> previousRow, Set<String> currentSet) {
        int count = 0;
        for (String value : previousRow) {
            if (currentSet.contains(value))
                count++;
        }
        return count;
    }

    private void processAddedRows(
            List<List<String>> currentExcelData,
            List<Integer> addedRowIndexes,
            List<List<String>> addedRows) {
        for (int index : addedRowIndexes) {
            addedRows.add(currentExcelData.get(index));
        }
    }
}
