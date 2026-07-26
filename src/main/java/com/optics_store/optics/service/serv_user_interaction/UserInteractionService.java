package com.optics_store.optics.service.serv_user_interaction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.cache.UserInteractionCacheManager;
import com.optics_store.optics.dto.RatingAverage;
import com.optics_store.optics.dto.RatingGlobalAverage;
import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.guests.GuestQuest;
import com.optics_store.optics.entity.guests.GuestRating;
import com.optics_store.optics.entity.guests.GuestRatingGlob;
import com.optics_store.optics.entity.guests.GuestReport;
import com.optics_store.optics.entity.history.his_user_interaction.QuestionAnswerHistory;
import com.optics_store.optics.entity.history.his_user_interaction.RatingGlobalHistory;
import com.optics_store.optics.entity.history.his_user_interaction.RatingHistory;
import com.optics_store.optics.entity.history.his_user_interaction.ReportAvailabilityHistory;
import com.optics_store.optics.entity.users.users_interaction.LikeDislike;
import com.optics_store.optics.entity.users.users_interaction.LikeDislikeGlobal;
import com.optics_store.optics.entity.users.users_interaction.QuestionAnswer;
import com.optics_store.optics.entity.users.users_interaction.Rating;
import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;
import com.optics_store.optics.entity.users.users_interaction.ReportAvailability;
import com.optics_store.optics.repository.rep_guests.GuestQuestRepos;
import com.optics_store.optics.repository.rep_guests.GuestRatingGlobRepos;
import com.optics_store.optics.repository.rep_guests.GuestRatingRepos;
import com.optics_store.optics.repository.rep_guests.GuestReportRepos;
import com.optics_store.optics.repository.rep_history.rep_his_user_interaction.QuestionAnswerHistoryRepos;
import com.optics_store.optics.repository.rep_history.rep_his_user_interaction.RatingGlobalHistoryRepos;
import com.optics_store.optics.repository.rep_history.rep_his_user_interaction.RatingHistoryRepos;
import com.optics_store.optics.repository.rep_history.rep_his_user_interaction.ReportAvailabilityHistoryRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.LikeDislikeGlobalRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.LikeDislikeRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.QuestionAnswerRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.RatingGlobalRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.RatingRepos;
import com.optics_store.optics.repository.rep_users.rep_users_interaction.ReportAvailabilityRepos;
import com.optics_store.optics.service.serv_client.ClientDataService;
import com.optics_store.optics.service.serv_user_interaction.UserInteractionManager.GeoData;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Central manager for User-Generated Content (UGC) and Feedback.
 * Handles CRUD operations for reviews, Q&A, and store ratings. Triggers
 * asynchronous UI state updates and recalculates overall statistics.
 */
public class UserInteractionService {

    private final LikeDislikeRepos likeDislikeRepos;
    private final LikeDislikeGlobalRepos likeDislikeGlobalRepos;
    private final QuestionAnswerRepos questionAnswerRepos;
    private final RatingRepos ratingRepos;
    private final RatingGlobalRepos ratingGlobalRepos;
    private final ReportAvailabilityRepos reportAvailabilityRepos;

    private final QuestionAnswerHistoryRepos questionAnswerHistoryRepos;
    private final RatingGlobalHistoryRepos ratingGlobalHistoryRepos;
    private final RatingHistoryRepos ratingHistoryRepos;
    private final ReportAvailabilityHistoryRepos reportAvailabilityHistoryRepos;

    private final GuestQuestRepos guestQuestRepos;
    private final GuestRatingGlobRepos guestRatingGlobRepos;
    private final GuestRatingRepos guestRatingRepos;
    private final GuestReportRepos guestReportRepos;

    private final ClientDataService clientDataService;
    private final UserInteractionManager userInteractionManager;
    private final UserInteractionCacheManager cache;

    // Get All

    public List<QuestionAnswer> getAllQuestionAnswer() {
        return cache.allQuestionAnswer();
    }

    public List<RatingGlobal> getAllRatingGlobal() {
        return cache.allRatingGlobal();
    }

    public List<Rating> getAllRating() {
        return cache.allRating();
    }

    public List<LikeDislikeGlobal> getAllLikeDislikeGlobal() {
        return cache.allLikeDislikeGlobal();
    }

    public List<LikeDislike> getAllLikeDislike() {
        return cache.allLikeDislike();
    }

    public List<ReportAvailability> getAllReportAvailability() {
        return cache.allReportAvailability();
    }

    // Get By Id

    public QuestionAnswer getQuestionAnswerById(Long id) {
        return cache.findQuestionAnswerById(id).orElse(null);
    }

    public RatingGlobal getRatingGlobalById(Long id) {
        return cache.findRatingGlobalById(id).orElse(null);
    }

    public Rating getRatingById(Long id) {
        return cache.findRatingById(id).orElse(null);
    }

    public ReportAvailability getReportAvailabilityById(Long id) {
        return cache.findReportAvailabilityById(id).orElse(null);
    }

    public LikeDislikeGlobal getLikeDislikeByIdGlobal(Long id) {
        return cache.findLikeDislikeGlobalById(id).orElse(null);
    }

    public LikeDislike getLikeDislikeById(Long id) {
        return cache.findLikeDislikeById(id).orElse(null);
    }

    // Get All By Client

    public List<Map<String, Object>> getAllQuestionAnswerByClient() {
        return clientDataService.buildClientDataList(
                cache.allQuestionAnswer(),
                QuestionAnswer::getAccountUsed,
                QuestionAnswer::getClientId,
                QuestionAnswer::getGuest,
                QuestionAnswer::getId);
    }

    public List<Map<String, Object>> getAllRatingGlobalByClient() {
        return clientDataService.buildClientDataList(
                cache.allRatingGlobal(),
                RatingGlobal::getAccountUsed,
                RatingGlobal::getClientId,
                RatingGlobal::getGuest,
                RatingGlobal::getId);
    }

    public List<Map<String, Object>> getAllRatingByClient() {
        return clientDataService.buildClientDataList(
                cache.allRating(),
                Rating::getAccountUsed,
                Rating::getClientId,
                Rating::getGuest,
                Rating::getId);
    }

    // Get All Average

    /**
     * Statistical Aggregation Methods.
     * Calculates the overall store rating, average product scores, and distribution
     * histograms for rendering in the statistics components on the Reviews Page.
     */
    public List<RatingGlobalAverage> getAllRatingGlobalAverage() {
        return cache.allRatingGlobal().stream()
                .collect(Collectors.groupingBy(RatingGlobal::getId))
                .entrySet().stream()
                .map(entry -> {
                    Long clientId = entry.getKey();
                    List<RatingGlobal> ratings = entry.getValue();

                    double sumAllStars = ratings.stream()
                            .mapToDouble(r -> r.getStarPrice() +
                                    r.getStarProductQuality() +
                                    r.getStarDelivery() +
                                    r.getStarStoreRating())
                            .sum();

                    int totalStarsCount = ratings.size() * 4;

                    double rawAverage = totalStarsCount > 0
                            ? sumAllStars / totalStarsCount
                            : 0.0;

                    BigDecimal bd = BigDecimal.valueOf(rawAverage)
                            .setScale(2, RoundingMode.HALF_UP);
                    double overallAverage = bd.doubleValue();

                    RatingGlobalAverage avg = new RatingGlobalAverage();
                    avg.setId(ratings.get(0).getId());
                    avg.setClientId(clientId);
                    avg.setAverageGlobalStar(overallAverage);
                    return avg;
                })
                .collect(Collectors.toList());
    }

    public List<RatingAverage> getAllRatingAverage() {
        return cache.allRating().stream()
                .collect(Collectors.groupingBy(Rating::getOptic))
                .entrySet().stream()
                .map(entry -> {
                    Optics optic = entry.getKey();
                    List<Rating> ratingsForOptic = entry.getValue();

                    Double averageStar = ratingsForOptic.stream()
                            .collect(Collectors.averagingDouble(Rating::getStar));
                    Long numberOpticIds = (long) ratingsForOptic.size();

                    return new RatingAverage(optic, averageStar, numberOpticIds);
                })
                .collect(Collectors.toList());
    }

    // Add

    @Transactional
    /**
     * Create (CRUD) operations for user feedback.
     * Handles form submissions, resolves geolocation data, associates the record
     * with authenticated clients or anonymous guests,
     * and logs the action into the historical tracking tables.
     */
    public Long addQuestionAnswer(
            Optics optic,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            String phone,
            String email,
            String feedback) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.addInteraction(
                GuestQuest.class,
                guestId,
                userId,
                accountAvail,
                guestName,
                phone,
                email,
                ctx -> QuestionAnswer.builder()
                        .optic(optic)
                        .guest(ctx.guest())
                        .region(geoData.region)
                        .timezone(geoData.timezone)
                        .feedbackDate(geoData.feedbackDate)
                        .feedback(feedback)
                        .build(),

                (qa, ctx) -> {
                    qa.setIsVisible(true)
                            .setClientId(ctx.clientId())
                            .setAccountUsed(ctx.accountUsed())
                            .setFeedbackDate(geoData.feedbackDate);
                },

                ctx -> questionAnswerRepos.findFirstByClientIdAndAccountUsedAndIsVisibleFalse(ctx.clientId(),
                        ctx.accountUsed()),
                qa -> questionAnswerHistoryRepos.save(
                        QuestionAnswerHistory.builder()
                                .isVisible(qa.getIsVisible())
                                .question(qa)
                                .feedbackDate(qa.getFeedbackDate())
                                .feedback(qa.getFeedback())
                                .feedbackAdmin(qa.getFeedbackAdmin())
                                .build()),

                (qa, ctx) -> {
                    qa.setGuest(ctx.guest())
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone)
                            .setFeedback(feedback);
                },

                questionAnswerRepos::save,
                QuestionAnswer::getId,
                () -> cache.questionAnswerCache.invalidateAll());
    }

    @Transactional
    public Long addRatingGlobal(
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            Double starPrice,
            Double starProductQuality,
            Double starDelivery,
            Double starStoreRating,
            String feedback) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.addInteraction(
                GuestRatingGlob.class,
                guestId,
                userId,
                accountAvail,
                guestName,
                null,
                null,
                ctx -> RatingGlobal.builder()
                        .guest(ctx.guest())
                        .starPrice(starPrice)
                        .starProductQuality(starProductQuality)
                        .starDelivery(starDelivery)
                        .starStoreRating(starStoreRating)
                        .region(geoData.region)
                        .timezone(geoData.timezone)
                        .feedbackDate(geoData.feedbackDate)
                        .feedback(feedback)
                        .build(),

                (rg, ctx) -> {
                    rg.setIsVisible(true)
                            .setClientId(ctx.clientId())
                            .setAccountUsed(ctx.accountUsed())
                            .setFeedbackDate(geoData.feedbackDate);
                },

                ctx -> ratingGlobalRepos.findFirstByClientIdAndAccountUsedAndIsVisibleFalse(ctx.clientId(),
                        ctx.accountUsed()),
                rg -> ratingGlobalHistoryRepos.save(
                        RatingGlobalHistory.builder()
                                .isVisible(rg.getIsVisible())
                                .rating(rg)
                                .starPrice(rg.getStarPrice())
                                .starProductQuality(rg.getStarProductQuality())
                                .starDelivery(rg.getStarDelivery())
                                .starStoreRating(rg.getStarStoreRating())
                                .feedbackDate(rg.getFeedbackDate())
                                .feedback(rg.getFeedback())
                                .feedbackAdmin(rg.getFeedbackAdmin())
                                .build()),

                (rg, ctx) -> {
                    rg.setGuest(ctx.guest())
                            .setStarPrice(starPrice)
                            .setStarProductQuality(starProductQuality)
                            .setStarDelivery(starDelivery)
                            .setStarStoreRating(starStoreRating)
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone)
                            .setFeedback(feedback);
                },

                ratingGlobalRepos::save,
                RatingGlobal::getId,
                () -> cache.ratingGlobalCache.invalidateAll());
    }

    @Transactional
    public Long addRating(
            Optics optic,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            Double star,
            String feedback,
            String advantages,
            String disadvantages) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.addInteraction(
                GuestRating.class,
                guestId,
                userId,
                accountAvail,
                guestName,
                null,
                null,
                ctx -> Rating.builder()
                        .optic(optic)
                        .guest(ctx.guest())
                        .star(star)
                        .region(geoData.region)
                        .timezone(geoData.timezone)
                        .feedbackDate(geoData.feedbackDate)
                        .feedback(feedback)
                        .advantages(advantages)
                        .disadvantages(disadvantages)
                        .build(),

                (r, ctx) -> {
                    r.setIsVisible(true)
                            .setClientId(ctx.clientId())
                            .setAccountUsed(ctx.accountUsed())
                            .setFeedbackDate(geoData.feedbackDate);
                },

                ctx -> ratingRepos.findFirstByClientIdAndAccountUsedAndIsVisibleFalse(ctx.clientId(),
                        ctx.accountUsed()),
                r -> ratingHistoryRepos.save(
                        RatingHistory.builder()
                                .isVisible(r.getIsVisible())
                                .rating(r)
                                .availabilityPurchases(r.getAvailabilityPurchases())
                                .star(r.getStar())
                                .feedbackDate(r.getFeedbackDate())
                                .feedback(r.getFeedback())
                                .advantages(r.getAdvantages())
                                .disadvantages(r.getDisadvantages())
                                .feedbackAdmin(r.getFeedbackAdmin())
                                .build()),

                (r, ctx) -> {
                    r.setGuest(ctx.guest())
                            .setStar(star)
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone)
                            .setFeedback(feedback)
                            .setAdvantages(advantages)
                            .setDisadvantages(disadvantages);
                },

                ratingRepos::save,
                Rating::getId,
                () -> cache.ratingCache.invalidateAll());
    }

    @Transactional
    public Long addReportAvailability(
            Optics optic,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            String phone,
            String email) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.addInteraction(
                GuestReport.class,
                guestId,
                userId,
                accountAvail,
                guestName,
                phone,
                email,
                ctx -> ReportAvailability.builder()
                        .optic(optic)
                        .guest(ctx.guest())
                        .region(geoData.region)
                        .timezone(geoData.timezone)
                        .feedbackDate(geoData.feedbackDate)
                        .build(),

                (ra, ctx) -> {
                    ra.setIsVisible(true)
                            .setClientId(ctx.clientId())
                            .setAccountUsed(ctx.accountUsed())
                            .setFeedbackDate(geoData.feedbackDate);
                },

                ctx -> reportAvailabilityRepos.findFirstByClientIdAndAccountUsedAndIsVisibleFalse(ctx.clientId(),
                        ctx.accountUsed()),
                ra -> reportAvailabilityHistoryRepos.save(
                        ReportAvailabilityHistory.builder()
                                .isVisible(ra.getIsVisible())
                                .report(ra)
                                .feedbackDate(ra.getFeedbackDate())
                                .isReported(ra.getIsReported())
                                .build()),

                (ra, ctx) -> {
                    ra.setGuest(ctx.guest())
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone);
                },

                reportAvailabilityRepos::save,
                ReportAvailability::getId,
                () -> cache.reportAvailabilityCache.invalidateAll());
    }

    // Update

    @Transactional
    /**
     * Update (CRUD) operations for user feedback.
     * Processes edits submitted via the modal forms, capturing the old state in the
     * history tables before applying new UI-reflected data.
     */
    public Long updateQuestionAnswer(
            Long questionAnswerId,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            String phone,
            String email,
            String feedback) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.updateInteraction(
                questionAnswerId,
                guestId,
                userId,
                accountAvail,
                this::getQuestionAnswerById,
                QuestionAnswer::getGuest,

                qa -> questionAnswerHistoryRepos.save(
                        QuestionAnswerHistory.builder()
                                .isVisible(qa.getIsVisible())
                                .question(qa)
                                .feedbackDate(qa.getFeedbackDate())
                                .feedback(qa.getFeedback())
                                .feedbackAdmin(qa.getFeedbackAdmin())
                                .build()),

                guest -> {
                    guest.setGuestName(guestName)
                            .setPhone(phone)
                            .setEmail(email);
                    guestQuestRepos.save(guest);
                },

                (entity, ctx) -> {
                    entity.setClientId(ctx.clientId())
                            .setAccountUsed(accountAvail)
                            .setFeedbackDate(geoData.feedbackDate);
                },

                (entity, _) -> {
                    QuestionAnswer qa = (QuestionAnswer) entity;
                    qa.setGuest(qa.getGuest())
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone)
                            .setFeedback(feedback);
                },

                questionAnswerRepos::save,
                () -> cache.questionAnswerCache.invalidateAll());
    }

    @Transactional
    public Long updateRatingGlobal(
            Long ratingGlobalId,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            Double starPrice,
            Double starProductQuality,
            Double starDelivery,
            Double starStoreRating,
            String feedback) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.updateInteraction(
                ratingGlobalId,
                guestId,
                userId,
                accountAvail,
                this::getRatingGlobalById,
                RatingGlobal::getGuest,

                rg -> ratingGlobalHistoryRepos.save(
                        RatingGlobalHistory.builder()
                                .isVisible(rg.getIsVisible())
                                .rating(rg)
                                .starPrice(rg.getStarPrice())
                                .starProductQuality(rg.getStarProductQuality())
                                .starDelivery(rg.getStarDelivery())
                                .starStoreRating(rg.getStarStoreRating())
                                .feedbackDate(rg.getFeedbackDate())
                                .feedback(rg.getFeedback())
                                .feedbackAdmin(rg.getFeedbackAdmin())
                                .build()),

                guest -> {
                    guest.setGuestName(guestName);
                    guestRatingGlobRepos.save(guest);
                },

                (entity, ctx) -> {
                    entity.setClientId(ctx.clientId())
                            .setAccountUsed(accountAvail)
                            .setFeedbackDate(geoData.feedbackDate);
                },

                (entity, _) -> {
                    RatingGlobal rg = (RatingGlobal) entity;
                    rg.setGuest(rg.getGuest())
                            .setStarPrice(starPrice)
                            .setStarProductQuality(starProductQuality)
                            .setStarDelivery(starDelivery)
                            .setStarStoreRating(starStoreRating)
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone)
                            .setFeedback(feedback);
                },

                ratingGlobalRepos::save,
                () -> cache.ratingGlobalCache.invalidateAll());
    }

    @Transactional
    public Long updateRating(
            Long ratingId,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            Double star,
            String feedback,
            String advantages,
            String disadvantages) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.updateInteraction(
                ratingId,
                guestId,
                userId,
                accountAvail,
                this::getRatingById,
                Rating::getGuest,

                r -> ratingHistoryRepos.save(
                        RatingHistory.builder()
                                .isVisible(r.getIsVisible())
                                .rating(r)
                                .availabilityPurchases(r.getAvailabilityPurchases())
                                .star(r.getStar())
                                .feedbackDate(r.getFeedbackDate())
                                .feedback(r.getFeedback())
                                .advantages(r.getAdvantages())
                                .disadvantages(r.getDisadvantages())
                                .feedbackAdmin(r.getFeedbackAdmin())
                                .build()),

                guest -> {
                    guest.setGuestName(guestName);
                    guestRatingRepos.save(guest);
                },

                (entity, ctx) -> {
                    entity.setClientId(ctx.clientId())
                            .setAccountUsed(accountAvail)
                            .setFeedbackDate(geoData.feedbackDate);
                },

                (entity, _) -> {
                    Rating r = (Rating) entity;
                    r.setGuest(r.getGuest())
                            .setStar(star)
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone)
                            .setFeedback(feedback)
                            .setAdvantages(advantages)
                            .setDisadvantages(disadvantages);
                },

                ratingRepos::save,
                () -> cache.ratingCache.invalidateAll());
    }

    @Transactional
    public Long updateReportAvailability(
            Long reportAvailabilityId,
            Long guestId,
            Long userId,
            Boolean accountAvail,
            String guestName,
            String phone,
            String email) {
        GeoData geoData = userInteractionManager.resolveGeoData();
        return userInteractionManager.updateInteraction(
                reportAvailabilityId,
                guestId,
                userId,
                accountAvail,
                this::getReportAvailabilityById,
                ReportAvailability::getGuest,

                ra -> reportAvailabilityHistoryRepos.save(
                        ReportAvailabilityHistory.builder()
                                .isVisible(ra.getIsVisible())
                                .report(ra)
                                .feedbackDate(ra.getFeedbackDate())
                                .isReported(ra.getIsReported())
                                .build()),

                guest -> {
                    guest.setGuestName(guestName)
                            .setPhone(phone)
                            .setEmail(email);
                    guestReportRepos.save(guest);
                },

                (entity, ctx) -> {
                    entity.setClientId(ctx.clientId())
                            .setAccountUsed(accountAvail)
                            .setFeedbackDate(geoData.feedbackDate);
                },

                (entity, _) -> {
                    ReportAvailability ra = (ReportAvailability) entity;
                    ra.setGuest(ra.getGuest())
                            .setRegion(geoData.region)
                            .setTimezone(geoData.timezone);
                },

                reportAvailabilityRepos::save,
                () -> cache.reportAvailabilityCache.invalidateAll());
    }

    // Delete

    /**
     * Delete (CRUD) operations for user feedback.
     * Soft-deletes or completely removes nodes from the database, prompting the
     * Front-end to dynamically remove the element from the DOM and recalculate
     * ratings.
     */
    public void deleteQuestionAnswer(Long id, Long guestId, Long userId) {
        userInteractionManager.deleteEntity(
                id,
                guestId,
                userId,
                this::getQuestionAnswerById,
                QuestionAnswer::getGuest,

                (qa, guest) -> {
                    qa.setIsVisible(false);
                    if (!qa.getAccountUsed() && guest != null) {
                        qa.setGuest(null);
                    }
                },

                guestQuestRepos::delete,
                () -> cache.questionAnswerCache.invalidateAll());
    }

    public void deleteRatingGlobal(Long id, Long guestId, Long userId) {
        userInteractionManager.deleteEntity(
                id,
                guestId,
                userId,
                this::getRatingGlobalById,
                RatingGlobal::getGuest,

                (rg, guest) -> {
                    rg.setIsVisible(false);
                    if (!rg.getAccountUsed() && guest != null) {
                        rg.setGuest(null);
                    }
                },

                guestRatingGlobRepos::delete,
                () -> cache.ratingGlobalCache.invalidateAll());
    }

    public void deleteRating(Long id, Long guestId, Long userId) {
        userInteractionManager.deleteEntity(
                id,
                guestId,
                userId,
                this::getRatingById,
                Rating::getGuest,

                (r, guest) -> {
                    r.setIsVisible(false);
                    if (!r.getAccountUsed() && guest != null) {
                        r.setGuest(null);
                    }
                },

                guestRatingRepos::delete,
                () -> cache.ratingCache.invalidateAll());
    }

    public void deleteReportAvailability(Long id, Long guestId, Long userId) {
        userInteractionManager.deleteEntity(
                id,
                guestId,
                userId,
                this::getReportAvailabilityById,
                ReportAvailability::getGuest,

                (ra, guest) -> {
                    ra.setIsVisible(false);
                    if (!ra.getAccountUsed() && guest != null) {
                        ra.setGuest(null);
                    }
                },

                guestReportRepos::delete,
                () -> cache.reportAvailabilityCache.invalidateAll());
    }

    // Like Dislike Global & Like Dislike

    @Transactional
    public synchronized void likeOrDislikeGlobal(
            RatingGlobal ratingGlobal,
            Long clientId,
            Boolean accountAvail,
            Boolean like,
            Boolean dislike) {
        Optional<LikeDislikeGlobal> existing = likeDislikeGlobalRepos
                .findFirstByRatingGlobalAndAccountAvailabilityAndClientId(
                        ratingGlobal, accountAvail, clientId);

        userInteractionManager.handleLikeOrDislikeGeneric(
                existing,
                likeDislikeGlobalRepos::delete,
                LikeDislikeGlobal::setLiked,
                LikeDislikeGlobal::setDisliked,
                () -> LikeDislikeGlobal.builder()
                        .ratingGlobal(ratingGlobal)
                        .clientId(clientId)
                        .accountAvailability(accountAvail)
                        .build(),
                likeDislikeGlobalRepos::save,
                () -> cache.likeDislikeGlobalCache.invalidateAll(),
                like,
                dislike);
    }

    @Transactional
    public synchronized void likeOrDislike(
            Rating rating,
            Long clientId,
            Boolean accountAvail,
            Boolean like,
            Boolean dislike) {
        Optional<LikeDislike> existing = likeDislikeRepos.findFirstByRatingAndAccountAvailabilityAndClientId(
                rating, accountAvail, clientId);

        userInteractionManager.handleLikeOrDislikeGeneric(
                existing,
                likeDislikeRepos::delete,
                LikeDislike::setLiked,
                LikeDislike::setDisliked,
                () -> LikeDislike.builder()
                        .rating(rating)
                        .clientId(clientId)
                        .accountAvailability(accountAvail)
                        .build(),
                likeDislikeRepos::save,
                () -> cache.likeDislikeCache.invalidateAll(),
                like,
                dislike);
    }
}
