package com.optics_store.optics.cache.cache_addit;

/**
 * Common interface implemented by all cache managers to standardise the
 * automated background data refresh process.
 */
public interface RefreshableCache {
    void refreshCache();
}
