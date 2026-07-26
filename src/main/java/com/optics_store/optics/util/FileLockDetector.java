package com.optics_store.optics.util;

import java.io.File;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
/**
 * File Concurrency Utility.
 * Integral to the two-way asynchronous synchronization system with Excel
 * documents.
 * Monitors file availability to prevent race conditions and read/write
 * conflicts when the system exports SQL changes to offline files.
 */
public class FileLockDetector {

    private static final Set<String> INTERNALLY_LOCKED = ConcurrentHashMap.newKeySet();

    /**
     * Lock management methods.
     * Evaluates if a file is currently opened by an external user (e.g., offline
     * store staff)
     * and manages internal system locks to guarantee safe, atomic write operations
     * without data corruption.
     */
    public static void markInternal(String key) {
        INTERNALLY_LOCKED.add(key);
    }

    public static void unmarkInternal(String key) {
        INTERNALLY_LOCKED.remove(key);
    }

    public static boolean isExternallyLocked(File file, String key) {
        if (INTERNALLY_LOCKED.contains(key))
            return false;

        try (RandomAccessFile raf = new RandomAccessFile(file, "rw");
                FileChannel channel = raf.getChannel()) {
            FileLock lock = channel.tryLock();
            if (lock != null) {
                lock.release();
                return false;
            }
        } catch (Exception e) {
            return true;
        }
        return true;
    }
}
