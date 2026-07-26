package com.optics_store.optics.config.config_secur;

import java.time.Duration;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "rate-limiter")
/**
 * Configuration properties for the custom Rate Limiting algorithms.
 * Defines thresholds, time windows, and penalty parameters to protect the
 * infrastructure against automated attacks.
 */
public class RateLimitProperties {

    private long blockTtlMinutes;
    private Duration defaultMinInterval;
    private long aggressiveBlockMinutes;
    private int permanentAfterAggressiveCount;
    private Duration permanentAggressiveWindow;
    private int recentMultiplier;

    private Map<String, Rule> rules;

    @Data
    public static class Rule {
        private int normalLimit;
        private Duration normalWindow;
        private int suspiciousLimit;
        private Duration suspiciousWindow;
        private int aggressiveLimit;
        private Duration aggressiveWindow;
        private Duration minInterval;
    }
}
