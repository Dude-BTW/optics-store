package com.optics_store.optics.sync;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.optics_store.optics.dto.SqlOperationData;
import com.optics_store.optics.excel.ExcelChanger;
import com.optics_store.optics.excel.excel_sync.ExcelOperationService;
import com.optics_store.optics.util.FileLockDetector;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
/**
 * Scheduler for the custom two-way asynchronous synchronization system.
 * Manages thread pools and timed delays to write in-memory buffered SQL
 * operations to Excel documents,
 * significantly optimizing and reducing heavy disk write operations as
 * described in the platform architecture.
 */
public class ExcelSyncScheduler {

    private final ExcelOperationService excelOperationService;

    private final Map<String, List<SqlOperationData>> pendingOps = new ConcurrentHashMap<>();
    private final Map<String, ScheduledExecutorService> schedulers = new ConcurrentHashMap<>();
    private final Map<String, ExecutorService> fileExecutors = new ConcurrentHashMap<>();
    private final Object lock = new Object();

    private static final int MAX_BATCH_SIZE = 50;
    private static final long DELAY_MS = 30_000;
    private static final long MAX_WAIT_TIME = 60_000;
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final long EXECUTOR_TTL_MS = 60 * 60 * 1000;

    private final Map<String, Integer> retryAttempts = new ConcurrentHashMap<>();
    private final Map<String, Long> executorLastUsed = new ConcurrentHashMap<>();
    private final List<String> skippedFlushes = Collections.synchronizedList(new ArrayList<>());
    private final Set<String> alwaysTrackedKeys = new HashSet<>();

    @PostConstruct
    public void initTrackedKeys() {
        alwaysTrackedKeys.addAll(excelOperationService.getAlwaysTrackedKeys());

        if (log.isInfoEnabled()) {
            String formattedKeys = alwaysTrackedKeys.stream()
                    .map(key -> "- " + key)
                    .collect(Collectors.joining("\n"));

            log.info("Always-tracked keys initialized:\n{}", formattedKeys);
        }
    }

    @PreDestroy
    public void shutdown() {
        schedulers.values().forEach(ScheduledExecutorService::shutdownNow);
        fileExecutors.values().forEach(ExecutorService::shutdownNow);
        pendingOps.clear();
        retryAttempts.clear();
        log.info("ExcelSyncScheduler shut down.");
    }

    public void resetAllRetriesAndPendingOps() {
        retryAttempts.clear();
        pendingOps.clear();
    }

    /**
     * Asynchronous batch scheduling and execution methods.
     * Groups intercepted SQL operations in-memory up to a maximum batch size before
     * triggering a flush,
     * ensuring smooth client-side performance without blocking the main application
     * thread.
     */
    public void schedule(SqlOperationData op, String filePath, int sheetIndex) {
        String key = filePath + "#" + sheetIndex;
        synchronized (lock) {
            pendingOps.computeIfAbsent(key, _ -> Collections.synchronizedList(new ArrayList<>())).add(op);
            if (pendingOps.get(key).size() >= MAX_BATCH_SIZE) {
                flushAsync(key, filePath, sheetIndex);
            } else {
                scheduleFlush(key, filePath, sheetIndex);
            }
        }
    }

    public void scheduleBatch(List<SqlOperationData> operations) {
        Map<String, List<SqlOperationData>> grouped = new HashMap<>();
        for (SqlOperationData op : operations) {
            ExcelOperationService.TableInfo info = excelOperationService.getTableInfoByName(op.getTableName());
            if (info == null)
                continue;
            String key = info.filePath() + "#" + info.sheetIndex();
            grouped.computeIfAbsent(key, _ -> new ArrayList<>()).add(op);
        }

        for (Map.Entry<String, List<SqlOperationData>> entry : grouped.entrySet()) {
            String[] parts = entry.getKey().split("#", 2);
            String filePath = parts[0];
            int sheetIndex = Integer.parseInt(parts[1]);

            synchronized (lock) {
                pendingOps.computeIfAbsent(entry.getKey(), _ -> Collections.synchronizedList(new ArrayList<>()))
                        .addAll(entry.getValue());

                if (pendingOps.get(entry.getKey()).size() >= MAX_BATCH_SIZE) {
                    flushAsync(entry.getKey(), filePath, sheetIndex);
                } else {
                    scheduleFlush(entry.getKey(), filePath, sheetIndex);
                }
            }
        }
    }

    private void scheduleFlush(String key, String filePath, int sheetIndex) {
        updateLastUsed(key);
        cleanupInactiveExecutors();
        schedulers.computeIfAbsent(key, _ -> Executors.newSingleThreadScheduledExecutor())
                .schedule(() -> flushAsync(key, filePath, sheetIndex), DELAY_MS, TimeUnit.MILLISECONDS);
    }

    private void flushAsync(String key, String filePath, int sheetIndex) {
        updateLastUsed(key);
        fileExecutors.computeIfAbsent(filePath, _ -> Executors.newSingleThreadExecutor())
                .submit(() -> flush(key, filePath, sheetIndex));
    }

    public void flush(String key, String filePath, int sheetIndex) {
        List<SqlOperationData> ops;
        synchronized (lock) {
            ops = pendingOps.remove(key);
            if (ops == null || ops.isEmpty())
                return;
        }

        ops = excelOperationService.optimizeOperations(ops);
        if (ops.isEmpty())
            return;

        File file = new File("src/main/resources/" + filePath);
        long waitTime = 1000;
        long totalWait = 0;

        while (FileLockDetector.isExternallyLocked(file, key)) {
            if (totalWait >= MAX_WAIT_TIME) {
                int attempts = retryAttempts.getOrDefault(key, 0);
                if (attempts < MAX_RETRY_ATTEMPTS) {
                    retryAttempts.put(key, attempts + 1);
                    log.warn("Timeout waiting for file {} to unlock. Retrying flush for key {} (attempt {}/{})...",
                            file.getName(), key, attempts + 1, MAX_RETRY_ATTEMPTS);
                    scheduleFlush(key, filePath, sheetIndex);
                } else {
                    retryAttempts.remove(key);
                    skippedFlushes.add(key);
                    log.error("Max retry attempts exceeded for key {}. Flush aborted.", key);
                }
                return;
            }

            try {
                Thread.sleep(waitTime);
                totalWait += waitTime;
                waitTime = Math.min(waitTime * 2, 10_000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }

        retryAttempts.remove(key);
        FileLockDetector.markInternal(key);
        ExcelChanger.IGNORED.add(key);

        try {
            excelOperationService.searchAndAssignRowIndices(ops);
            excelOperationService.applyChanges(filePath, sheetIndex, ops);
            ExcelChanger.markInternalSync(key);
            log.info("Flush completed successfully for key {}", key);

        } catch (Exception e) {
            log.error("Flush failed for key {}: {}", key, e.getMessage(), e);
        } finally {
            FileLockDetector.unmarkInternal(key);
            ExcelChanger.IGNORED.remove(key);
        }
    }

    private void cleanupInactiveExecutors() {
        long now = System.currentTimeMillis();
        int cleaned = 0;

        for (String key : new ArrayList<>(executorLastUsed.keySet())) {
            Long lastUsed = executorLastUsed.get(key);
            if (!alwaysTrackedKeys.contains(key) && now - lastUsed > EXECUTOR_TTL_MS) {
                Optional.ofNullable(schedulers.remove(key)).ifPresent(ScheduledExecutorService::shutdownNow);
                Optional.ofNullable(fileExecutors.remove(key.split("#")[0])).ifPresent(ExecutorService::shutdownNow);
                executorLastUsed.remove(key);
                cleaned++;
                log.info("Cleaned up inactive executor for key {}", key);
            }
        }

        if (cleaned > 0) {
            log.info("Total cleaned inactive executors: {}", cleaned);
        }
    }

    private void updateLastUsed(String key) {
        executorLastUsed.put(key, System.currentTimeMillis());
    }

    /**
     * Error handling and recovery methods.
     * Tracks operations that failed due to prolonged file locks and provides a
     * mechanism for manual retries.
     */
    public List<String> getSkippedFlushKeys() {
        return new ArrayList<>(skippedFlushes);
    }

    public boolean retryManually(String key) {
        if (!skippedFlushes.contains(key))
            return false;
        String[] parts = key.split("#", 2);
        if (parts.length < 2)
            return false;

        try {
            flushAsync(key, parts[0], Integer.parseInt(parts[1]));
            skippedFlushes.remove(key);
            log.info("Manual retry initiated for key {}", key);
            return true;
        } catch (Exception e) {
            log.error("Manual retry failed for key {}: {}", key, e.getMessage());
            return false;
        }
    }
}
