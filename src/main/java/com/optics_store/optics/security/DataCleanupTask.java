package com.optics_store.optics.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.entity.history.his_user_interaction.RatingGlobalHistory;
import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;
import com.optics_store.optics.repository.rep_history.rep_his_user_interaction.RatingGlobalHistoryRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.RatingGlobalRepos;
import com.optics_store.optics.repository.rep_users.rep_users_secur.BlockedIpRepos;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
/**
 * Component of the platform's security and authentication module.
 * Enforces access control and data integrity rules across the e-commerce
 * application.
 */
public class DataCleanupTask {

    private final BlockedIpRepos blockedIpRepos;
    private final RatingGlobalRepos ratingGlobalRepos;
    private final RatingGlobalHistoryRepos ratingGlobalHistoryRepos;

    @Value("${rate-limiter.purgePermanentAfterMonths}")
    private int purgePermanentAfterMonths;

    @Scheduled(cron = "0 30 2 * * *", zone = "UTC")
    @Transactional
    public void runDailyCleanup() {
        try {
            purgeOldBlockedIpsFromDatabase();
            purgeOldRatings();
            logBlockedIpCount();
        } catch (Exception e) {
            log.error("Error during daily cleanup", e);
        }
    }

    private void purgeOldBlockedIpsFromDatabase() {
        Instant cutoff = ZonedDateTime.now(ZoneOffset.UTC)
                .minusMonths(purgePermanentAfterMonths)
                .toInstant();
        try {
            long count = blockedIpRepos.countByBlockedAtBefore(cutoff);
            if (count > 0) {
                int deleted = blockedIpRepos.deleteByBlockedAtBefore(cutoff);
                log.info("Deleted {} old permanently blocked IPs from DB.", deleted);
            }
        } catch (DataAccessException ex) {
            log.error("Database purge failed:", ex);
        }
    }

    private void purgeOldRatings() {
        LocalDateTime cutoff = LocalDateTime.now().minusMonths(6);
        try {
            List<RatingGlobal> oldRatings = ratingGlobalRepos.findAll().stream()
                    .filter(r -> r.getFeedbackDate() != null && r.getFeedbackDate().isBefore(cutoff))
                    .collect(Collectors.toList());

            for (RatingGlobal rating : oldRatings) {
                List<RatingGlobalHistory> histories = ratingGlobalHistoryRepos.findAll().stream()
                        .filter(h -> h.getRating() != null && h.getRating().getId().equals(rating.getId()))
                        .collect(Collectors.toList());
                ratingGlobalHistoryRepos.deleteAll(histories);
                ratingGlobalRepos.delete(rating);
            }
            log.info("Purged {} old ratings with history.", oldRatings.size());
        } catch (DataAccessException ex) {
            log.error("Error purging old ratings:", ex);
        }
    }

    private void logBlockedIpCount() {
        try {
            long count = blockedIpRepos.count();
            if (count > 1000) {
                log.warn("Blocked IP count exceeds threshold: {}", count);
            } else {
                log.info("Current blocked IP count: {}", count);
            }
        } catch (Exception ex) {
            log.error("Failed to fetch blocked IP count:", ex);
        }
    }
}
