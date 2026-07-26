package com.optics_store.optics.cache.cache_addit;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.Expiry;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.cache.CaffeineCacheMetrics;

/**
 * Centralized factory for creating high-performance Caffeine cache instances.
 * Configures memory limits, expiration policies (TTL), and attaches metrics for
 * system monitoring.
 */
public class CacheFactory {

    public enum Expire {
        AFTER_WRITE,
        AFTER_ACCESS
    }

    /**
     * Group of factory methods to build specialized cache structures.
     * Automates the configuration of write/access expiry times and maximum cache
     * capacity to prevent memory leaks.
     */
    public static <K, V> ImmutableListCache<K, V> newListCache(
            MeterRegistry registry,
            String name,
            long maxSize,
            long duration,
            TimeUnit unit) {
        Caffeine<Object, Object> builder = Caffeine.newBuilder()
                .recordStats()
                .maximumSize(maxSize);

        if (duration > 0) {
            builder.expireAfterWrite(duration, unit);
        }

        Cache<K, List<V>> cache = builder.build();
        CaffeineCacheMetrics.monitor(registry, cache, name);
        return new ImmutableListCache<>(cache);
    }

    public static <K, V> Cache<K, V> newCache(
            MeterRegistry registry,
            String name,
            long maxSize,
            long duration,
            TimeUnit unit,
            Expire expireType) {
        Caffeine<Object, Object> builder = Caffeine.newBuilder()
                .recordStats()
                .maximumSize(maxSize);

        if (duration > 0) {
            if (expireType == Expire.AFTER_WRITE) {
                builder.expireAfterWrite(duration, unit);
            } else {
                builder.expireAfterAccess(duration, unit);
            }
        }

        Cache<K, V> cache = builder.build();
        CaffeineCacheMetrics.monitor(registry, cache, name);
        return cache;
    }

    private static <V> Expiry<Object, V> timestampExpiry(
            long ttl,
            TimeUnit unit,
            Function<? super V, Instant> extractor) {
        return new Expiry<Object, V>() {
            @Override
            public long expireAfterCreate(Object key, V value, long currentTime) {
                return computeNanos(value);
            }

            @Override
            public long expireAfterUpdate(Object key, V value, long currentTime, long currentDuration) {
                return computeNanos(value);
            }

            @Override
            public long expireAfterRead(Object key, V value, long currentTime, long currentDuration) {
                return currentDuration;
            }

            private long computeNanos(V value) {
                Instant last = extractor.apply(value);
                long millisUntil = ChronoUnit.MILLIS.between(
                        Instant.now(),
                        last.plus(ttl, toChronoUnit(unit)));
                return Math.max(TimeUnit.MILLISECONDS.toNanos(millisUntil), 0);
            }
        };
    }

    public static <K, V> Cache<K, V> newCacheWithTimestampExpiry(
            MeterRegistry registry,
            String name,
            long maxSize,
            long ttl,
            TimeUnit unit,
            Function<? super V, Instant> timestampExtractor) {
        Caffeine<K, V> builder = Caffeine.newBuilder()
                .recordStats()
                .maximumSize(maxSize)
                .expireAfter(timestampExpiry(ttl, unit, timestampExtractor));

        Cache<K, V> cache = builder.build();
        CaffeineCacheMetrics.monitor(registry, cache, name);
        return cache;
    }

    public static <K, T> ImmutableListCache<K, T> newListCacheWithTimestampExpiry(
            MeterRegistry registry,
            String name,
            long maxSize,
            long ttl,
            TimeUnit unit,
            Function<? super List<T>, Instant> timestampExtractor) {
        Caffeine<K, List<T>> builder = Caffeine.newBuilder()
                .recordStats()
                .maximumSize(maxSize)
                .expireAfter(timestampExpiry(ttl, unit, timestampExtractor));

        Cache<K, List<T>> delegate = builder.build();
        CaffeineCacheMetrics.monitor(registry, delegate, name);
        return new ImmutableListCache<>(delegate);
    }

    private static ChronoUnit toChronoUnit(TimeUnit unit) {
        switch (unit) {
            case DAYS:
                return ChronoUnit.DAYS;
            case HOURS:
                return ChronoUnit.HOURS;
            case MINUTES:
                return ChronoUnit.MINUTES;
            case SECONDS:
                return ChronoUnit.SECONDS;
            case MILLISECONDS:
                return ChronoUnit.MILLIS;
            default:
                throw new IllegalArgumentException("Unsupported TimeUnit: " + unit);
        }
    }
}
