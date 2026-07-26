package com.optics_store.optics.sql;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.optics_store.optics.dto.SqlOperationData;

/**
 * Core component for the two-way asynchronous SQL-to-Excel synchronization
 * system.
 * Intercepts and buffers SQL operations (INSERT, UPDATE, DELETE) in-memory to
 * optimize disk write operations.
 * Ensures that database changes triggered by the Front-end are accurately
 * tracked and queued for Excel export.
 */
public class SqlCaptureInspector {

    private static final ThreadLocal<List<SqlOperationData>> OPS = ThreadLocal.withInitial(() -> new ArrayList<>(4));

    public static void addOperation(SqlOperationData op) {
        OPS.get().add(op);
    }

    /**
     * Retrieves the buffered SQL operations for the current transaction.
     * These operations are later processed by the ExcelSyncScheduler to update the
     * offline store's Excel documents.
     */
    public static List<SqlOperationData> getOperations() {
        List<SqlOperationData> ops = OPS.get();
        return ops != null ? ops : Collections.emptyList();
    }

    /**
     * Clears the in-memory buffer of SQL operations after they have been
     * successfully processed or if a transaction fails.
     * Prevents memory leaks and ensures data consistency.
     */
    public static void clear() {
        OPS.remove();
    }
}
