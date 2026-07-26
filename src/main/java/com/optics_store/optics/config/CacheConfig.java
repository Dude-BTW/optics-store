package com.optics_store.optics.config;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
/**
 * Configuration for the multi-level caching system based on the Caffeine
 * library.
 * Designed to reduce database load during client request processing and store
 * infrastructure protection data.
 */
public class CacheConfig {

    @Bean
    /**
     * Initializes a high-performance, in-memory cache for tracking client IP access
     * history,
     * forming the foundation of the custom rate-limiting and anti-bot protection
     * mechanisms.
     */
    public Cache<String, List<Instant>> ipAccessLogCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .maximumSize(10_000)
                .build();
    }
}
