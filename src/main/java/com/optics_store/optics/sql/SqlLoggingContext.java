package com.optics_store.optics.sql;

/**
 * Manages the thread-local context for SQL query interception.
 * Acts as a toggle switch to safely enable or disable the capturing of database
 * operations for specific user interactions.
 */
public class SqlLoggingContext {

    private static final ThreadLocal<Boolean> LOG_SQL = ThreadLocal.withInitial(() -> false);

    /**
     * Context management methods (enable, disable, clear).
     * Grouped functionality that controls when the system should actively listen
     * and record SQL operations
     * for the background Excel synchronization mechanism without affecting normal
     * database queries.
     */
    public static void enable() {
        LOG_SQL.set(true);
    }

    public static boolean isEnabled() {
        Boolean value = LOG_SQL.get();
        return value != null && value;
    }

    public static void clear() {
        LOG_SQL.remove();
    }
}
