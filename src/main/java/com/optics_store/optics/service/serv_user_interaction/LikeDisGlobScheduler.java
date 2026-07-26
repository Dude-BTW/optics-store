package com.optics_store.optics.service.serv_user_interaction;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.LikeDislikeGlobalRepos;
import com.optics_store.optics.sql.SqlCaptureInspector;
import com.optics_store.optics.sql.SqlLoggingContext;
import com.optics_store.optics.sync.ExcelSyncScheduler;

import jakarta.annotation.PreDestroy;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
/**
 * Asynchronous Event Debouncer for voting elements.
 * Batches rapid "Like/Dislike" clicks in memory before flushing them to the
 * database and queueing them for the Excel SQL-sync system,
 * preventing disk write overloads during heavy user interaction.
 */
public class LikeDisGlobScheduler {

    private final LikeDislikeGlobalRepos likeDislikeGlobalRepos;
    private final UserInteractionService ratingLikeDisService;
    private final ExcelSyncScheduler excelSyncScheduler;

    private final ConcurrentMap<Key, Pending> buffer = new ConcurrentHashMap<>();
    private static final long DELAY_SECONDS = 2;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(
            Runtime.getRuntime().availableProcessors(),
            runnable -> {
                Thread t = Executors.defaultThreadFactory().newThread(runnable);
                t.setDaemon(true);
                return t;
            });

    /**
     * Debouncing and flush mechanisms.
     * Intercepts rapid UI events, holds them in a ConcurrentHashMap for a short
     * delay, and executes a single optimized database/Excel sync operation.
     */
    public void schedule(RatingGlobal ratingGlobal, Long clientId, Boolean accountAvail, boolean like,
            boolean dislike) {
        Key key = new Key(ratingGlobal.getId(), clientId);

        Pending existing = buffer.putIfAbsent(key, new Pending(ratingGlobal, clientId, accountAvail, like, dislike));
        if (existing == null) {
            scheduler.schedule(() -> flush(key), DELAY_SECONDS, TimeUnit.SECONDS);
        } else {
            existing.setLike(like);
            existing.setDislike(dislike);
        }
    }

    private void flush(Key key) {
        Pending p = buffer.remove(key);
        if (p == null) {
            return;
        }

        try {
            SqlLoggingContext.enable();

            if (!p.isLike()
                    && !p.isDislike()
                    && !likeDislikeGlobalRepos
                            .findFirstByRatingGlobalAndAccountAvailabilityAndClientId(
                                    p.getRatingGlobal(), p.getAccountAvail(), p.getClientId())
                            .isPresent()) {
                return;
            }

            ratingLikeDisService.likeOrDislikeGlobal(
                    p.getRatingGlobal(),
                    p.getClientId(),
                    p.getAccountAvail(),
                    p.isLike(),
                    p.isDislike());

            var ops = SqlCaptureInspector.getOperations();
            if (!ops.isEmpty()) {
                excelSyncScheduler.scheduleBatch(ops);
            }

        } catch (Exception ex) {
            log.error("Помилка при flush для ключа {}: {}", key, ex.getMessage(), ex);
        } finally {
            SqlCaptureInspector.clear();
            SqlLoggingContext.clear();
        }
    }

    @PreDestroy
    public void shutdown() {
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    private record Key(Long ratingGlobalId, Long clientId) {
    }

    @Getter
    @Setter
    @AllArgsConstructor
    private static class Pending {
        private final RatingGlobal ratingGlobal;
        private final Long clientId;
        private final Boolean accountAvail;
        private volatile boolean like;
        private volatile boolean dislike;
    }
}
