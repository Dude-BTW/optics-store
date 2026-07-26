package com.optics_store.optics.cache.cache_addit;

import java.util.List;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * Scheduled task manager for the caching ecosystem.
 * Automatically triggers background cache refreshes to ensure data consistency
 * between the SQL storage and the in-memory buffers.
 */
public class CacheRefresher {

    private final List<RefreshableCache> caches;

    @EventListener(ApplicationReadyEvent.class)
    public void initAfterStartup() {
        runAll();
    }

    @Scheduled(initialDelay = 3600000, fixedRate = 3600000)
    public void scheduled() {
        runAll();
    }

    private void runAll() {
        for (RefreshableCache cache : caches) {
            try {
                cache.refreshCache();
            } catch (Exception e) {
            }
        }
    }
}
