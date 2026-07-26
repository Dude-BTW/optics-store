package com.optics_store.optics.service.serv_secure;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.optics_store.optics.cache.IpLogCacheManager;
import com.optics_store.optics.config.config_secur.RateLimitProperties;
import com.optics_store.optics.config.config_secur.RateLimitProperties.Rule;
import com.optics_store.optics.dto.dto_users_secur.AccessLogEntry;
import com.optics_store.optics.dto.dto_users_secur.AccessLogEntryTimestamp;
import com.optics_store.optics.dto.dto_users_secur.RecaptchaVerifDto;
import com.optics_store.optics.entity.users.users_secur.BlockedIp;
import com.optics_store.optics.entity.users.users_secur.BlockedIpTimestamp;
import com.optics_store.optics.entity.users.users_secur.RecaptchaVerif;
import com.optics_store.optics.repository.rep_users.rep_users_secur.BlockedIpRepos;
import com.optics_store.optics.repository.rep_users.rep_users_secur.RecaptchaVerifRepos;
import com.optics_store.optics.util.ClientIpResolver;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
/**
 * Algorithmic Rate Limiting Service.
 * Defends the platform's infrastructure against brute-force and DDoS attacks by
 * analyzing IP request frequencies,
 * adjusting limits dynamically based on reCAPTCHA trust scores, and applying
 * temporary or permanent network blocks.
 */
public class RateLimiterService {

    private final ClientIpResolver clientIpResolver;
    private final BlockedIpRepos blockedIpRepos;
    private final RateLimitProperties rateLimitProperties;
    private final MeterRegistry meterRegistry;
    private final IpLogCacheManager ipLogCacheManager;
    private final RecaptchaVerifRepos recaptchaVerifRepos;
    private final CaptchaTrustPolicyHandler captchaPolicy;

    // Кеш правил для зменшення навантаження
    private final ConcurrentMap<String, Rule> ruleCache = new ConcurrentHashMap<>();

    public enum RateLimitStatus {
        ALLOWED,
        TOO_MANY_REQUESTS,
        SUSPICIOUS_ACTIVITY,
        BLOCKED,
        PERMANENTLY_BLOCKED
    }

    public String resolveClientIp() {
        return clientIpResolver.resolveClientIp();
    }

    public CaptchaTrustPolicyHandler getCaptchaPolicy() {
        return captchaPolicy;
    }

    /**
     * Rate limiting evaluation engines.
     * Analyzes the recent request history for a given IP. Triggers block mechanisms
     * if aggressive or suspicious traffic patterns are detected.
     */
    public RateLimitStatus checkRateLimit(String ip, String path, RecaptchaVerifDto captchaDto) {
        Instant now = Instant.now();

        if (isPermanentlyBlocked(ip, path, now)) {
            return RateLimitStatus.PERMANENTLY_BLOCKED;
        }

        if (isBlockedTemporarily(ip, path, now)) {
            return RateLimitStatus.BLOCKED;
        }

        Rule rule = ruleCache.computeIfAbsent(path, p -> rateLimitProperties.getRules().get(p));
        if (rule == null) {
            return RateLimitStatus.ALLOWED;
        }

        AccessLogEntry logEntry = ipLogCacheManager.getOrCreateLogEntry(ip);
        AccessLogEntryTimestamp ts = new AccessLogEntryTimestamp(now, path, captchaDto);
        ipLogCacheManager.saveLogEntry(ip, ts);

        int multiplier = rateLimitProperties.getRecentMultiplier();
        Instant oldestAllowed = now.minus(rule.getAggressiveWindow().multipliedBy(multiplier));
        synchronized (logEntry.getTimestamps()) {
            logEntry.getTimestamps().removeIf(t -> t.getTimestamp().isBefore(oldestAllowed));
        }

        long aggressiveLimit = rule.getAggressiveLimit();
        int recentCap = (int) (aggressiveLimit * multiplier);

        List<AccessLogEntryTimestamp> recent;
        long normalCount;
        long suspiciousCount;
        long aggressiveCount;

        synchronized (logEntry.getTimestamps()) {
            List<AccessLogEntryTimestamp> allForPath = logEntry.getTimestamps().stream()
                    .filter(t -> t.getRequestPath().equals(path))
                    .sorted(Comparator.comparing(AccessLogEntryTimestamp::getTimestamp).reversed())
                    .collect(Collectors.toList());

            if (allForPath.size() > recentCap) {
                log.warn("Recent cap={} exceeded for ip={}, path={}; trimming {}→{}",
                        recentCap, ip, path, allForPath.size(), recentCap);
            }

            recent = allForPath.stream()
                    .limit(recentCap)
                    .collect(Collectors.toList());

            normalCount = recent.stream()
                    .filter(t -> t.getTimestamp().isAfter(now.minus(rule.getNormalWindow())))
                    .count();

            suspiciousCount = recent.stream()
                    .filter(t -> t.getTimestamp().isAfter(now.minus(rule.getSuspiciousWindow())))
                    .count();

            aggressiveCount = logEntry.getTimestamps().stream()
                    .filter(t -> t.getTimestamp().isAfter(now.minus(rule.getAggressiveWindow())))
                    .count();
        }

        Duration minInterval = rule.getMinInterval() != null
                ? rule.getMinInterval()
                : rateLimitProperties.getDefaultMinInterval();
        boolean rapidFire = isRapidFire(recent, minInterval);

        RateLimitStatus initialStatus;
        if (aggressiveCount > rule.getAggressiveLimit()) {
            return handleAggressiveBlock(ip, now, logEntry.getTimestamps());
        } else if (suspiciousCount > rule.getSuspiciousLimit() || rapidFire) {
            blockIp(ip, now, "Suspicious activity", recent, false);
            initialStatus = RateLimitStatus.SUSPICIOUS_ACTIVITY;
        } else if (normalCount > rule.getNormalLimit()) {
            initialStatus = RateLimitStatus.TOO_MANY_REQUESTS;
        } else {
            initialStatus = RateLimitStatus.ALLOWED;
        }

        double captchaTrustScore = calculateCaptchaTrustScore(recent);
        RateLimitStatus finalStatus = captchaPolicy.adjustStatus(initialStatus, captchaTrustScore);

        log.info("Rate check: ip={}, path={}, status={} (before adjust: {}), trustScore={}",
                ip, path, finalStatus, initialStatus, captchaTrustScore);

        return finalStatus;
    }

    private boolean isRapidFire(List<AccessLogEntryTimestamp> recent, Duration minInterval) {
        if (recent.size() >= 2) {
            Instant t1 = recent.get(0).getTimestamp();
            Instant t2 = recent.get(1).getTimestamp();
            return Duration.between(t2, t1).compareTo(minInterval) < 0;
        }
        return false;
    }

    private RateLimitStatus handleAggressiveBlock(String ip, Instant now, List<AccessLogEntryTimestamp> entries) {
        List<Instant> history = ipLogCacheManager.getAggressiveBlockHistory(ip);
        long pastAggressive = history == null ? 0L : history.size();

        boolean permanent = (pastAggressive + 1) >= rateLimitProperties.getPermanentAfterAggressiveCount();

        blockIp(ip, now, "Aggressive attack", entries, permanent);

        ipLogCacheManager.recordAggressiveBlock(ip, now);

        log.warn("Blocked IP due to aggressive requests: {} (permanent: {})", ip, permanent);
        meterRegistry.counter("rate_limit.blocked", "reason", permanent ? "permanent" : "aggressive").increment();

        return permanent ? RateLimitStatus.PERMANENTLY_BLOCKED : RateLimitStatus.BLOCKED;
    }

    private void blockIp(String ip, Instant now, String reason, List<AccessLogEntryTimestamp> entries,
            boolean permanent) {
        BlockedIp blocked = new BlockedIp();
        blocked.setIp(ip);
        blocked.setBlockedAt(permanent ? Instant.EPOCH : now);
        blocked.setReason(reason);

        List<BlockedIpTimestamp> timestamps = new ArrayList<>();
        for (AccessLogEntryTimestamp e : entries) {
            BlockedIpTimestamp bts = new BlockedIpTimestamp();
            bts.setTimestamp(e.getTimestamp());
            bts.setRequestPath(e.getRequestPath());
            bts.setBlockedIp(blocked);

            if (e.getRecaptchaVerif() != null) {
                RecaptchaVerif entity = e.getRecaptchaVerif().toEntity();
                recaptchaVerifRepos.save(entity);
                bts.setRecaptchaVerif(entity);
            }

            timestamps.add(bts);
        }

        blocked.setTimestamps(timestamps);

        if (permanent) {
            // Зберігаємо тільки в БД
            blockedIpRepos.save(blocked);
        } else {
            // Тимчасова блокада — кеш
            ipLogCacheManager.saveTempBlockedIp(ip, blocked);
        }

        // Кеш очищається завжди, незалежно від типу блокування
        ipLogCacheManager.clearForIp(ip);
    }

    private boolean isBlockedTemporarily(String ip, String path, Instant now) {
        BlockedIp tempBlocked = ipLogCacheManager.getTempBlockedIp(ip);
        if (tempBlocked != null) {
            long ttlMinutes = "Aggressive attack".equals(tempBlocked.getReason())
                    ? rateLimitProperties.getAggressiveBlockMinutes()
                    : rateLimitProperties.getBlockTtlMinutes();

            if (tempBlocked.getBlockedAt().plus(Duration.ofMinutes(ttlMinutes)).isAfter(now)) {
                log.info("Rate check: ip={}, path={}, status=BLOCKED (from cache)", ip, path);
                meterRegistry.counter("rate_limit.blocked", "reason", "temporary").increment();
                return true;
            } else {
                ipLogCacheManager.clearTempBlockedIp(ip);
            }
        }
        return false;
    }

    private boolean isPermanentlyBlocked(String ip, String path, Instant now) {
        Optional<BlockedIp> blocked = blockedIpRepos.findByIp(ip);
        if (blocked.isPresent()) {
            BlockedIp b = blocked.get();

            // Перманентна блокада — EPOCH → не знімається ніколи
            if (b.getBlockedAt().equals(Instant.EPOCH)) {
                log.info("Rate check: ip={}, path={}, status=PERMANENTLY_BLOCKED", ip, path);
                meterRegistry.counter("rate_limit.blocked", "reason", "permanent").increment();
                return true;
            }

            // Тимчасова блокада з TTL
            long ttlMinutes = "Aggressive attack".equals(b.getReason())
                    ? rateLimitProperties.getAggressiveBlockMinutes()
                    : rateLimitProperties.getBlockTtlMinutes();

            if (b.getBlockedAt().plus(Duration.ofMinutes(ttlMinutes)).isAfter(now)) {
                log.info("Rate check: ip={}, path={}, status=BLOCKED (from DB)", ip, path);
                meterRegistry.counter("rate_limit.blocked", "reason", "temporary").increment();
                return true;
            } else {
                // Лише тимчасові блоки можна знімати
                blockedIpRepos.delete(b);
            }
        }
        return false;
    }

    private double calculateCaptchaTrustScore(List<AccessLogEntryTimestamp> recent) {
        double sumScores = recent.stream()
                .map(AccessLogEntryTimestamp::getRecaptchaVerif)
                .filter(Objects::nonNull)
                .map(RecaptchaVerifDto::getScore)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        long countScores = recent.stream()
                .map(AccessLogEntryTimestamp::getRecaptchaVerif)
                .filter(Objects::nonNull)
                .map(RecaptchaVerifDto::getScore)
                .filter(Objects::nonNull)
                .count();

        if (countScores == 0) {
            return -1.0;
        }

        return sumScores / countScores;
    }
}
