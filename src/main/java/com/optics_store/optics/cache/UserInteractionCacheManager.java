package com.optics_store.optics.cache;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.optics_store.optics.cache.cache_addit.CacheFactory;
import com.optics_store.optics.cache.cache_addit.ImmutableListCache;
import com.optics_store.optics.cache.cache_addit.RefreshableCache;
import com.optics_store.optics.entity.users.users_interaction.LikeDislike;
import com.optics_store.optics.entity.users.users_interaction.LikeDislikeGlobal;
import com.optics_store.optics.entity.users.users_interaction.QuestionAnswer;
import com.optics_store.optics.entity.users.users_interaction.Rating;
import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;
import com.optics_store.optics.entity.users.users_interaction.ReportAvailability;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.LikeDislikeGlobalRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.LikeDislikeRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.QuestionAnswerRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.RatingGlobalRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.RatingRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.ReportAvailabilityRepos;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
/**
 * Multi-level caching system for the User Interaction History.
 * Caches reviews, ratings, and Q&A to ensure fast UI state updates and
 * asynchronous DOM rendering across the platform.
 */
public class UserInteractionCacheManager implements RefreshableCache {

    // Data Loading

    private final LikeDislikeRepos likeDislikeRepos;
    private final LikeDislikeGlobalRepos likeDislikeGlobalRepos;
    private final QuestionAnswerRepos questionAnswerRepos;
    private final RatingRepos ratingRepos;
    private final RatingGlobalRepos ratingGlobalRepos;
    private final ReportAvailabilityRepos reportAvailabilityRepos;

    // Cache

    @Override
    /**
     * Pulls the latest user feedback records from the database, sorts them by
     * timestamp, and updates the active cache.
     */
    public void refreshCache() {
        try {
            List<LikeDislike> likeDislikeList = likeDislikeRepos.findAll();
            List<LikeDislikeGlobal> likeDislikeGlobalList = likeDislikeGlobalRepos.findAll();
            List<QuestionAnswer> questionAnswerList = questionAnswerRepos.findAll();
            List<Rating> ratingList = ratingRepos.findAll();
            List<RatingGlobal> ratingGlobalList = ratingGlobalRepos.findAll();
            List<ReportAvailability> reportAvailabilityList = reportAvailabilityRepos.findAll();

            ratingList.sort(Comparator.comparing(Rating::getFeedbackDate).reversed());
            ratingGlobalList.sort(Comparator.comparing(RatingGlobal::getFeedbackDate).reversed());
            questionAnswerList.sort(Comparator.comparing(QuestionAnswer::getFeedbackDate).reversed());

            if (likeDislikeList == null || likeDislikeGlobalList == null || questionAnswerList == null
                    || ratingList == null
                    || ratingGlobalList == null || reportAvailabilityList == null) {
                log.warn("Попередження: база повернула null. Кеш не оновлено.");
                return;
            }

            likeDislikeCache.put(Keys.LIKE_DISLIKE, likeDislikeList);
            likeDislikeGlobalCache.put(Keys.LIKE_DISLIKE_GLOBAL, likeDislikeGlobalList);
            questionAnswerCache.put(Keys.QUESTION_ANSWER, questionAnswerList);
            ratingCache.put(Keys.RATING, ratingList);
            ratingGlobalCache.put(Keys.RATING_GLOBAL, ratingGlobalList);
            reportAvailabilityCache.put(Keys.REPORT_AVAILABILITY, reportAvailabilityList);

        } catch (Exception e) {
            log.error("Помилка під час оновлення кешу", e);
        }
    }

    public static class Keys {
        public static final String QUESTION_ANSWER = "questionAnswer";
        public static final String RATING_GLOBAL = "ratingGlobal";
        public static final String RATING = "rating";
        public static final String LIKE_DISLIKE_GLOBAL = "likeDislikeGlobal";
        public static final String LIKE_DISLIKE = "likeDislike";
        public static final String REPORT_AVAILABILITY = "reportAvailability";
    }

    public final ImmutableListCache<String, QuestionAnswer> questionAnswerCache;
    public final ImmutableListCache<String, RatingGlobal> ratingGlobalCache;
    public final ImmutableListCache<String, Rating> ratingCache;
    public final ImmutableListCache<String, LikeDislikeGlobal> likeDislikeGlobalCache;
    public final ImmutableListCache<String, LikeDislike> likeDislikeCache;
    public final ImmutableListCache<String, ReportAvailability> reportAvailabilityCache;

    public UserInteractionCacheManager(
            LikeDislikeRepos likeDislikeRepos,
            LikeDislikeGlobalRepos likeDislikeGlobalRepos,
            QuestionAnswerRepos questionAnswerRepos,
            RatingRepos ratingRepos,
            RatingGlobalRepos ratingGlobalRepos,
            ReportAvailabilityRepos reportAvailabilityRepos,
            MeterRegistry registry) {
        this.likeDislikeRepos = likeDislikeRepos;
        this.likeDislikeGlobalRepos = likeDislikeGlobalRepos;
        this.questionAnswerRepos = questionAnswerRepos;
        this.ratingRepos = ratingRepos;
        this.ratingGlobalRepos = ratingGlobalRepos;
        this.reportAvailabilityRepos = reportAvailabilityRepos;

        this.questionAnswerCache = CacheFactory.newListCache(registry, "questionAnswerCache", 500, 1, TimeUnit.HOURS);
        this.ratingGlobalCache = CacheFactory.newListCache(registry, "ratingGlobalCache", 200, 5, TimeUnit.MINUTES);
        this.ratingCache = CacheFactory.newListCache(registry, "ratingCache", 1000, 15, TimeUnit.MINUTES);
        this.likeDislikeGlobalCache = CacheFactory.newListCache(registry, "likeDislikeGlobalCache", 200, 5,
                TimeUnit.MINUTES);
        this.likeDislikeCache = CacheFactory.newListCache(registry, "likeDislikeCache", 1000, 15, TimeUnit.MINUTES);
        this.reportAvailabilityCache = CacheFactory.newListCache(registry, "reportAvailabilityCache", 1000, 15,
                TimeUnit.MINUTES);
    }

    // Cache Monitoring & Functions

    public void clearAll() {
        questionAnswerCache.invalidateAll();
        ratingGlobalCache.invalidateAll();
        ratingCache.invalidateAll();
        likeDislikeGlobalCache.invalidateAll();
        likeDislikeCache.invalidateAll();
        reportAvailabilityCache.invalidateAll();
    }

    // All Data

    /**
     * Retrieval methods for user feedback components.
     * Delivers cached reviews, questions, and likes/dislikes to the Product Details
     * Page and general store rating sections.
     */
    public List<QuestionAnswer> allQuestionAnswer() {
        return questionAnswerCache.get(
                Keys.QUESTION_ANSWER,
                _ -> {
                    List<QuestionAnswer> list = questionAnswerRepos.findAll();
                    list.sort(Comparator.comparing(QuestionAnswer::getFeedbackDate).reversed());
                    return list;
                });
    }

    public List<RatingGlobal> allRatingGlobal() {
        return ratingGlobalCache.get(
                Keys.RATING_GLOBAL,
                _ -> {
                    List<RatingGlobal> list = ratingGlobalRepos.findAll();
                    list.sort(Comparator.comparing(RatingGlobal::getFeedbackDate).reversed());
                    return list;
                });
    }

    public List<Rating> allRating() {
        return ratingCache.get(
                Keys.RATING,
                _ -> {
                    List<Rating> list = ratingRepos.findAll();
                    list.sort(Comparator.comparing(Rating::getFeedbackDate).reversed());
                    return list;
                });
    }

    public List<LikeDislikeGlobal> allLikeDislikeGlobal() {
        return likeDislikeGlobalCache.get(
                Keys.LIKE_DISLIKE_GLOBAL,
                _ -> likeDislikeGlobalRepos.findAll());
    }

    public List<LikeDislike> allLikeDislike() {
        return likeDislikeCache.get(
                Keys.LIKE_DISLIKE,
                _ -> likeDislikeRepos.findAll());
    }

    public List<ReportAvailability> allReportAvailability() {
        return reportAvailabilityCache.get(
                Keys.REPORT_AVAILABILITY,
                _ -> reportAvailabilityRepos.findAll());
    }

    // Find by ID

    public Optional<QuestionAnswer> findQuestionAnswerById(Long id) {
        List<QuestionAnswer> list = allQuestionAnswer();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(q -> q.getId().equals(id))
                .findFirst();
    }

    public Optional<RatingGlobal> findRatingGlobalById(Long id) {
        List<RatingGlobal> list = allRatingGlobal();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(rg -> rg.getId().equals(id))
                .findFirst();
    }

    public Optional<Rating> findRatingById(Long id) {
        List<Rating> list = allRating();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();
    }

    public Optional<LikeDislikeGlobal> findLikeDislikeGlobalById(Long id) {
        List<LikeDislikeGlobal> list = allLikeDislikeGlobal();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(ld -> ld.getId().equals(id))
                .findFirst();
    }

    public Optional<LikeDislike> findLikeDislikeById(Long id) {
        List<LikeDislike> list = allLikeDislike();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(ld -> ld.getId().equals(id))
                .findFirst();
    }

    public Optional<ReportAvailability> findReportAvailabilityById(Long id) {
        List<ReportAvailability> list = allReportAvailability();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(q -> q.getId().equals(id))
                .findFirst();
    }
}
