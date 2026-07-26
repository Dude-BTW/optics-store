package com.optics_store.optics.cache;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.Cache;
import com.optics_store.optics.cache.cache_addit.CacheFactory;
import com.optics_store.optics.cache.cache_addit.CacheKey;
import com.optics_store.optics.cache.cache_addit.ImmutableListCache;
import com.optics_store.optics.cache.cache_addit.RefreshableCache;
import com.optics_store.optics.config.config_secur.RateLimitProperties;
import com.optics_store.optics.dto.dto_users_secur.AccessLogEntry;
import com.optics_store.optics.dto.dto_users_secur.AccessLogEntryTimestamp;
import com.optics_store.optics.entity.users.users_secur.BlockedIp;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
/**
 * Manages the in-memory caching of client IP requests to prevent automated
 * attacks.
 * Integral to the Rate Limiting algorithm, it temporarily stores access logs
 * and blocked IP states to protect the infrastructure.
 */
public class IpLogCacheManager implements RefreshableCache {

    private final ImmutableListCache<String, AccessLogEntryTimestamp> ipTimestampsCache;
    private final Cache<String, AccessLogEntry> ipEntryCache;
    private final ImmutableListCache<CacheKey, AccessLogEntryTimestamp> pathTimestampsCache;
    private final Cache<String, BlockedIp> tempBlockedIpCache;
    private final ImmutableListCache<String, Instant> aggressiveBlockCache;
    private final ConcurrentMap<String, Set<CacheKey>> ipToPathKeysMap = new ConcurrentHashMap<>();
    private final Cache<String, Boolean> ipEvictionMarker;
    private final RateLimitProperties rateLimitProperties;

    public IpLogCacheManager(MeterRegistry registry, RateLimitProperties rateLimitProperties) {
        this.rateLimitProperties = rateLimitProperties;

        this.ipTimestampsCache = newListCacheWithTimestampExpiry(registry, "ipTimestampsCache",
                list -> getMaxTimestamp(list));

        this.ipEntryCache = CacheFactory.newCacheWithTimestampExpiry(
                registry, "ipEntryCache", 10_000, 24, TimeUnit.HOURS,
                entry -> getMaxTimestamp(entry.getTimestamps()));

        this.pathTimestampsCache = newListCacheWithTimestampExpiryForCacheKey(registry, "pathTimestampsCache",
                list -> getMaxTimestamp(list));

        this.tempBlockedIpCache = CacheFactory.newCache(
                registry, "tempBlockedIpCache", 10_000,
                rateLimitProperties.getBlockTtlMinutes(), TimeUnit.MINUTES,
                CacheFactory.Expire.AFTER_WRITE);

        this.ipEvictionMarker = CacheFactory.newCache(
                registry, "ipEvictionMarker", 10_000,
                rateLimitProperties.getBlockTtlMinutes(), TimeUnit.MINUTES,
                CacheFactory.Expire.AFTER_WRITE);

        this.aggressiveBlockCache = CacheFactory.newListCache(
                registry, "aggressiveBlockCache", 10_000,
                rateLimitProperties.getPermanentAggressiveWindow().toMinutes(), TimeUnit.MINUTES);
    }

    private <K, V> void addToImmutableListCache(ImmutableListCache<K, V> cache, K key, V item) {
        List<V> list = new ArrayList<>(Optional.ofNullable(cache.getIfPresent(key)).orElse(List.of()));
        list.add(item);
        cache.put(key, list);
    }

    private Instant getMaxTimestamp(List<AccessLogEntryTimestamp> list) {
        return list.stream()
                .map(AccessLogEntryTimestamp::getTimestamp)
                .max(Instant::compareTo)
                .orElse(Instant.now());
    }

    private ImmutableListCache<String, AccessLogEntryTimestamp> newListCacheWithTimestampExpiry(
            MeterRegistry registry, String name, Function<? super List<AccessLogEntryTimestamp>, Instant> extractor) {
        return CacheFactory.newListCacheWithTimestampExpiry(
                registry, name, 10_000, 24, TimeUnit.HOURS, extractor);
    }

    private ImmutableListCache<CacheKey, AccessLogEntryTimestamp> newListCacheWithTimestampExpiryForCacheKey(
            MeterRegistry registry, String name, Function<? super List<AccessLogEntryTimestamp>, Instant> extractor) {
        return CacheFactory.newListCacheWithTimestampExpiry(
                registry, name, 10_000, 24, TimeUnit.HOURS, extractor);
    }

    /**
     * Core functions for tracking incoming network requests.
     * Records request timestamps per IP to evaluate them against the system's
     * rate-limiting thresholds.
     */
    public AccessLogEntry getOrCreateLogEntry(String ip) {
        return ipEntryCache.get(ip, _ -> new AccessLogEntry(ip));
    }

    public void saveLogEntry(String ip, AccessLogEntryTimestamp timestamp) {
        if (ipEvictionMarker.getIfPresent(ip) != null)
            return;

        AccessLogEntry entry = getOrCreateLogEntry(ip);
        synchronized (entry.getTimestamps()) {
            entry.getTimestamps().add(timestamp);
        }
        ipEntryCache.put(ip, entry);

        addToImmutableListCache(ipTimestampsCache, ip, timestamp);

        CacheKey key = new CacheKey("access", ip, timestamp.getRequestPath());
        addToImmutableListCache(pathTimestampsCache, key, timestamp);

        ipToPathKeysMap.computeIfAbsent(ip, _ -> ConcurrentHashMap.newKeySet()).add(key);
    }

    public List<AccessLogEntryTimestamp> getTimestampsByIp(String ip) {
        return ipTimestampsCache.getIfPresent(ip);
    }

    public List<AccessLogEntryTimestamp> getTimestampsByIpAndPath(String ip, String path) {
        return pathTimestampsCache.getIfPresent(new CacheKey("access", ip, path));
    }

    public void clearForIp(String ip) {
        ipEntryCache.invalidate(ip);
        ipTimestampsCache.invalidate(ip);

        Set<CacheKey> keys = ipToPathKeysMap.remove(ip);
        if (keys != null && !keys.isEmpty()) {
            pathTimestampsCache.invalidateAll(keys);
        }

        ipEvictionMarker.put(ip, true);
    }

    /**
     * Operations for managing temporary IP bans.
     * Caches data about IPs blocked for suspicious or aggressive activity to
     * quickly reject future requests without hitting the database.
     */
    public void saveTempBlockedIp(String ip, BlockedIp blockedIp) {
        tempBlockedIpCache.put(ip, blockedIp);
    }

    public BlockedIp getTempBlockedIp(String ip) {
        return tempBlockedIpCache.getIfPresent(ip);
    }

    public void clearTempBlockedIp(String ip) {
        tempBlockedIpCache.invalidate(ip);
    }

    public void recordAggressiveBlock(String ip, Instant when) {
        addToImmutableListCache(aggressiveBlockCache, ip, when);
    }

    public List<Instant> getAggressiveBlockHistory(String ip) {
        return aggressiveBlockCache.getIfPresent(ip);
    }

    public long countTempBlockedBeforeAndReason(Instant cutoff, String reason) {
        return tempBlockedIpCache.asMap().values().stream()
                .filter(ipObj -> ipObj.getBlockedAt() != null &&
                        ipObj.getBlockedAt().isBefore(cutoff) &&
                        reason.equals(ipObj.getReason()))
                .count();
    }

    public int deleteTempBlockedBeforeAndReason(Instant cutoff, String reason) {
        List<String> toRemove = tempBlockedIpCache.asMap().entrySet().stream()
                .filter(e -> e.getValue().getBlockedAt() != null &&
                        e.getValue().getBlockedAt().isBefore(cutoff) &&
                        reason.equals(e.getValue().getReason()))
                .map(Map.Entry::getKey)
                .toList();
        tempBlockedIpCache.invalidateAll(toRemove);
        return toRemove.size();
    }

    public long countTempBlockedBeforeAndBlockedAtNot(Instant cutoff, Instant exclude) {
        return tempBlockedIpCache.asMap().values().stream()
                .filter(ipObj -> ipObj.getBlockedAt() != null &&
                        ipObj.getBlockedAt().isBefore(cutoff) &&
                        !ipObj.getBlockedAt().equals(exclude))
                .count();
    }

    public int deleteTempBlockedBeforeAndBlockedAtNot(Instant cutoff, Instant exclude) {
        List<String> toRemove = tempBlockedIpCache.asMap().entrySet().stream()
                .filter(e -> e.getValue().getBlockedAt() != null &&
                        e.getValue().getBlockedAt().isBefore(cutoff) &&
                        !e.getValue().getBlockedAt().equals(exclude))
                .map(Map.Entry::getKey)
                .toList();
        tempBlockedIpCache.invalidateAll(toRemove);
        return toRemove.size();
    }

    @Scheduled(cron = "${rate-limiter.cacheCleanupCron:0 0/15 * * * *}", zone = "UTC")
    /**
     * Scheduled background task to automatically lift temporary bans once their
     * penalty time expires.
     */
    public void purgeExpiredTempBlockedIps() {
        Instant now = Instant.now();
        Instant suspiciousCutoff = now.minus(Duration.ofMinutes(rateLimitProperties.getBlockTtlMinutes()));
        Instant aggressiveCutoff = now.minus(Duration.ofMinutes(rateLimitProperties.getAggressiveBlockMinutes()));

        purgeFromCacheByReason(suspiciousCutoff, "Suspicious activity");
        purgeFromCacheByBlockedAt(aggressiveCutoff, Instant.EPOCH);
    }

    private void purgeFromCacheByReason(Instant cutoff, String reason) {
        int deleted = deleteTempBlockedBeforeAndReason(cutoff, reason);
        if (deleted > 0) {
            log.info("Purged {} entries from cache for reason '{}'.", deleted, reason);
        }
    }

    private void purgeFromCacheByBlockedAt(Instant cutoff, Instant exclude) {
        int deleted = deleteTempBlockedBeforeAndBlockedAtNot(cutoff, exclude);
        if (deleted > 0) {
            log.info("Purged {} temporarily blocked IPs from cache.", deleted);
        }
    }

    public void invalidateAll() {
        ipTimestampsCache.invalidateAll();
        ipEntryCache.invalidateAll();
        pathTimestampsCache.invalidateAll();
        tempBlockedIpCache.invalidateAll();
        aggressiveBlockCache.invalidateAll();
        ipToPathKeysMap.clear();
        ipEvictionMarker.invalidateAll();
    }

    @Override
    public void refreshCache() {
        invalidateAll();
        log.info("IpLogCacheManager: всі кеші очищено");
    }
}
