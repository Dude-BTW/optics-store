package com.optics_store.optics.service.serv_secure;

import java.util.EnumMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.optics_store.optics.service.serv_secure.RateLimiterService.RateLimitStatus;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
/**
 * Security Decision Matrix.
 * Dynamically shifts Rate Limiting strictness (e.g., from ALLOWED to BLOCKED)
 * based on the calculated Trust Level of the provided reCAPTCHA score.
 */
public class CaptchaTrustPolicyHandler {

    public enum TrustLevel {
        HIGH, MEDIUM, LOW, NONE
    }

    private final Map<RateLimitStatus, Map<TrustLevel, RateLimitStatus>> decisionMatrix;

    public CaptchaTrustPolicyHandler() {
        decisionMatrix = new EnumMap<>(RateLimitStatus.class);

        // ALLOWED
        Map<TrustLevel, RateLimitStatus> allowedMap = new EnumMap<>(TrustLevel.class);
        for (TrustLevel level : TrustLevel.values()) {
            allowedMap.put(level, RateLimitStatus.ALLOWED);
        }
        decisionMatrix.put(RateLimitStatus.ALLOWED, allowedMap);

        // TOO_MANY_REQUESTS
        Map<TrustLevel, RateLimitStatus> tooManyMap = new EnumMap<>(TrustLevel.class);
        tooManyMap.put(TrustLevel.HIGH, RateLimitStatus.ALLOWED);
        tooManyMap.put(TrustLevel.MEDIUM, RateLimitStatus.TOO_MANY_REQUESTS);
        tooManyMap.put(TrustLevel.LOW, RateLimitStatus.TOO_MANY_REQUESTS);
        tooManyMap.put(TrustLevel.NONE, RateLimitStatus.TOO_MANY_REQUESTS);
        decisionMatrix.put(RateLimitStatus.TOO_MANY_REQUESTS, tooManyMap);

        // SUSPICIOUS_ACTIVITY
        Map<TrustLevel, RateLimitStatus> suspiciousMap = new EnumMap<>(TrustLevel.class);
        suspiciousMap.put(TrustLevel.HIGH, RateLimitStatus.ALLOWED);
        suspiciousMap.put(TrustLevel.MEDIUM, RateLimitStatus.SUSPICIOUS_ACTIVITY);
        suspiciousMap.put(TrustLevel.LOW, RateLimitStatus.BLOCKED);
        suspiciousMap.put(TrustLevel.NONE, RateLimitStatus.SUSPICIOUS_ACTIVITY);
        decisionMatrix.put(RateLimitStatus.SUSPICIOUS_ACTIVITY, suspiciousMap);

        // BLOCKED
        Map<TrustLevel, RateLimitStatus> blockedMap = new EnumMap<>(TrustLevel.class);
        blockedMap.put(TrustLevel.HIGH, RateLimitStatus.TOO_MANY_REQUESTS);
        blockedMap.put(TrustLevel.MEDIUM, RateLimitStatus.BLOCKED);
        blockedMap.put(TrustLevel.LOW, RateLimitStatus.BLOCKED);
        blockedMap.put(TrustLevel.NONE, RateLimitStatus.BLOCKED);
        decisionMatrix.put(RateLimitStatus.BLOCKED, blockedMap);

        // PERMANENTLY_BLOCKED — завжди лишається таким
        Map<TrustLevel, RateLimitStatus> permanentMap = new EnumMap<>(TrustLevel.class);
        for (TrustLevel level : TrustLevel.values()) {
            permanentMap.put(level, RateLimitStatus.PERMANENTLY_BLOCKED);
        }
        decisionMatrix.put(RateLimitStatus.PERMANENTLY_BLOCKED, permanentMap);
    }

    public TrustLevel getTrustLevel(double score) {
        if (score >= 0.8)
            return TrustLevel.HIGH;
        if (score >= 0.4)
            return TrustLevel.MEDIUM;
        if (score >= 0.0)
            return TrustLevel.LOW;
        return TrustLevel.NONE;
    }

    public RateLimitStatus adjustStatus(RateLimitStatus original, double score) {
        TrustLevel trustLevel = getTrustLevel(score);
        RateLimitStatus adjusted = decisionMatrix.get(original).get(trustLevel);

        log.debug("Adjusting status: original={}, trustLevel={}, adjusted={}", original, trustLevel, adjusted);
        return adjusted;
    }
}
