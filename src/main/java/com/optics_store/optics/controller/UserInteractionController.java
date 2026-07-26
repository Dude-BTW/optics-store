package com.optics_store.optics.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.optics_store.optics.dto.dto_users_secur.RecaptchaVerifDto;
import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.users.users_interaction.LikeDislikeGlobal;
import com.optics_store.optics.entity.users.users_interaction.QuestionAnswer;
import com.optics_store.optics.entity.users.users_interaction.Rating;
import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;
import com.optics_store.optics.entity.users.users_interaction.ReportAvailability;
import com.optics_store.optics.service.OpticsService;
import com.optics_store.optics.service.serv_secure.RateLimiterService;
import com.optics_store.optics.service.serv_secure.RequestValidationService;
import com.optics_store.optics.service.serv_secure.SessionTokenManager;
import com.optics_store.optics.service.serv_user_interaction.LikeDisGlobScheduler;
import com.optics_store.optics.service.serv_user_interaction.LikeDisScheduler;
import com.optics_store.optics.service.serv_user_interaction.UserInteractionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
/**
 * User-Generated Content (UGC) Controller.
 * Handles incoming user feedback (reviews, ratings, Q&A). Integrates with
 * anti-bot mechanisms (Google reCAPTCHA, Rate Limiting)
 * and triggers dynamic DOM updates on the client side for CRUD operations
 * without requiring full page reloads.
 */
/**
 * Authentication and Security Controller.
 * Manages client registration and login workflows. Issues secure JSON Web
 * Tokens (JWT) upon successful authentication
 * and acts as the entry point for role-based access control (RBAC) validation.
 */
/**
 * Application Web Controller.
 * Bridges the Front-end (Freemarker templates) with the Back-end business
 * logic, handling HTTP request routing and data aggregation.
 */
public class UserInteractionController {

    private final UserInteractionService ratingLikeDisService;
    private final OpticsService opticsService;
    private final LikeDisGlobScheduler likeDisGBatchService;
    private final LikeDisScheduler likeDisBatchService;
    private final SessionTokenManager sessionTokenManager;
    private final RequestValidationService requestValidationService;
    private final RateLimiterService rateLimiterService;

    /**
     * Data Submission and State Mutation Endpoints (HTTP POST).
     * Securely process user inputs (e.g., form submissions, cart updates). They
     * perform strict validation, verify reCAPTCHA trust scores,
     * and return structured JSON responses to trigger asynchronous UI animations
     * and state updates.
     */
    @PostMapping("/for_test")
    @ResponseBody
    public ResponseEntity<String> handleForTest(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String path = "/for_test";
        RecaptchaVerifDto captchaDto = new RecaptchaVerifDto();

        RateLimiterService.RateLimitStatus status = rateLimiterService.checkRateLimit(ip, path, captchaDto);

        return switch (status) {
            case ALLOWED -> ResponseEntity.ok("OK");
            case TOO_MANY_REQUESTS -> ResponseEntity.status(429).body("Too Many Requests");
            case SUSPICIOUS_ACTIVITY -> ResponseEntity.status(403).body("Suspicious Activity");
            case BLOCKED -> ResponseEntity.status(403).body("Temporarily Blocked");
            case PERMANENTLY_BLOCKED -> ResponseEntity.status(423).body("Permanently Blocked");
        };
    }

    /**
     * Page Rendering and Data Fetching Endpoints (HTTP GET).
     * These methods intercept browser navigation requests, aggregate necessary data
     * from fast in-memory caches (Caffeine)
     * or the SQL database, and return fully rendered HTML pages (SSR) directly to
     * the client.
     */
    @GetMapping("/reviews_the_store/**")
    public String getFeedbackRatingStarGlobal(
            @RequestParam(value = "sorting", defaultValue = "new") String sortOrder,
            Model model,
            HttpSession session,
            HttpServletRequest request) {
        List<RatingGlobal> allRatingsGlobal = new ArrayList<>(ratingLikeDisService.getAllRatingGlobal());

        if (sortOrder.equals("old")) {
            allRatingsGlobal.sort(Comparator.comparing(RatingGlobal::getFeedbackDate));
        } else {
            allRatingsGlobal.sort(Comparator.comparing(RatingGlobal::getFeedbackDate).reversed());
        }

        // Session
        boolean isGet = "GET".equalsIgnoreCase(request.getMethod());

        Map<String, String> idToTokenRatingGlobalMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenRatingGlobalMap",
                () -> ratingLikeDisService.getAllRatingGlobal(),
                RatingGlobal::getId);

        List<LikeDislikeGlobal> allLikeDislikeGlobal = ratingLikeDisService.getAllLikeDislikeGlobal();

        Map<String, Long> likeGlobalCounts = new HashMap<>();
        Map<String, Long> dislikeGlobalCounts = new HashMap<>();
        for (RatingGlobal rating : allRatingsGlobal) {
            String ratingId = String.valueOf(rating.getId());
            long likeCount = allLikeDislikeGlobal.stream()
                    .filter(ld -> ld.getRatingGlobal().getId().equals(rating.getId())
                            && Boolean.TRUE.equals(ld.getLiked()))
                    .count();
            long dislikeCount = allLikeDislikeGlobal.stream()
                    .filter(ld -> ld.getRatingGlobal().getId().equals(rating.getId())
                            && Boolean.TRUE.equals(ld.getDisliked()))
                    .count();
            likeGlobalCounts.put(ratingId, likeCount);
            dislikeGlobalCounts.put(ratingId, dislikeCount);
        }

        model.addAttribute("allRatingGlobal", allRatingsGlobal);
        model.addAttribute("allRatingGlobalAverage", ratingLikeDisService.getAllRatingGlobalAverage());
        model.addAttribute("allRatingGlobalByClient", ratingLikeDisService.getAllRatingGlobalByClient());
        model.addAttribute("allLikeDislikeGlobal", allLikeDislikeGlobal);
        model.addAttribute("idToTokenRatingGlobalMap", idToTokenRatingGlobalMap);

        model.addAttribute("likeGlobalCounts", likeGlobalCounts);
        model.addAttribute("dislikeGlobalCounts", dislikeGlobalCounts);

        model.addAttribute("sortOrder", sortOrder);

        return "feedback_rating_star_global";
    }

    // Like Dislike && Like Dislike Global

    @PostMapping("/add_like_dislike_global")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleLikeDislikeGlobal(
            @RequestParam String ratingGlobalId,
            @RequestParam Boolean like,
            @RequestParam Boolean dislike,
            @RequestParam("g-recaptcha-response") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws ExecutionException, InterruptedException, JsonProcessingException {
        Long id = sessionTokenManager.extractFromToken(
                ratingGlobalId,
                session,
                "idToTokenRatingGlobalMap",
                "лайк/дизлайк на відгук магазину");
        RatingGlobal ratingGlobal = ratingLikeDisService.getRatingGlobalById(id);

        return requestValidationService.handleBatch(
                ratingGlobal,
                (rg, ctx) -> likeDisGBatchService.schedule(
                        rg,
                        ctx.getActorId(),
                        ctx.getAccountAvailable(),
                        like,
                        dislike),
                ratingGlobalId,
                false,
                request,
                session,
                "idToTokenRatingGlobalMap",
                recaptchaToken,
                version,
                "add_like_dislike_global",
                "Не вдалося зберегти лайк/дизлайк на відгук магазину, спробуйте пізніше");
    }

    @PostMapping("/add_like_dislike")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleLikeDislike(
            @RequestParam String ratingId,
            @RequestParam Boolean like,
            @RequestParam Boolean dislike,
            @RequestParam("g-recaptcha-response") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws ExecutionException, InterruptedException, JsonProcessingException {
        Long id = sessionTokenManager.extractFromToken(
                ratingId,
                session,
                "idToTokenRatingMap",
                "лайк/дизлайк на відгук товару");
        Rating rating = ratingLikeDisService.getRatingById(id);

        return requestValidationService.handleBatch(
                rating,
                (r, ctx) -> likeDisBatchService.schedule(
                        r,
                        ctx.getActorId(),
                        ctx.getAccountAvailable(),
                        like,
                        dislike),
                ratingId,
                false,
                request,
                session,
                "idToTokenRatingMap",
                recaptchaToken,
                version,
                "add_like_dislike",
                "Не вдалося зберегти лайк/дизлайк на відгук товару, спробуйте пізніше");
    }

    // Add Rating Global && Rating && Question Answer && Report Availability

    @PostMapping("/rating_global")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleRatingGlobal(
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam("starPrice") Double starPrice,
            @RequestParam("starProductQuality") Double starProductQuality,
            @RequestParam("starDelivery") Double starDelivery,
            @RequestParam("starStoreRating") Double starStoreRating,
            @RequestParam("feedback") String feedback,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.addRatingGlobal(
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        starPrice,
                        starProductQuality,
                        starDelivery,
                        starStoreRating,
                        feedback),
                null,
                request,
                session,
                recaptchaToken,
                version,
                "rating_global",
                "idToTokenRatingGlobalMap",
                "newRatingGlobalId");
    }

    @PostMapping("/rating")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleRating(
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam("opticId") String opticToken,
            @RequestParam("star") Double star,
            @RequestParam("feedback") String feedback,
            @RequestParam("advantages") String advantages,
            @RequestParam("disadvantages") String disadvantages,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long opticId = sessionTokenManager.extractFromToken(
                opticToken, session, "idToTokenOpticsMap", "відгук на товар");
        Optics optic = opticsService.getOpticsById(opticId);

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.addRating(
                        optic,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        star,
                        feedback,
                        advantages,
                        disadvantages),
                null,
                request,
                session,
                recaptchaToken,
                version,
                "rating",
                "idToTokenRatingMap",
                "newRatingId");
    }

    @PostMapping("/question_answer")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleQuestionAnswer(
            @RequestParam("opticId") String opticToken,
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam("feedback") String feedback,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long opticId = sessionTokenManager.extractFromToken(
                opticToken, session, "idToTokenOpticsMap", "питання на товар");
        Optics optic = opticsService.getOpticsById(opticId);

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.addQuestionAnswer(
                        optic,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        phone,
                        email,
                        feedback),
                null,
                request,
                session,
                recaptchaToken,
                version,
                "question_answer",
                "idToTokenQuestionAnswerMap",
                "newQuestionAnswerId");
    }

    @PostMapping("/report_availability")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleReportAvailability(
            @RequestParam("opticId") String opticToken,
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long opticId = sessionTokenManager.extractFromToken(
                opticToken, session, "idToTokenOpticsMap", "повідомлення про наявність");
        Optics optic = opticsService.getOpticsById(opticId);

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.addReportAvailability(
                        optic,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        phone,
                        email),
                null,
                request,
                session,
                recaptchaToken,
                version,
                "report_availability",
                "idToTokenReportAvailabilityMap",
                "newReportAvailabilityId");
    }

    // Update Rating Global && Rating && Question Answer && Report Availability

    @PostMapping("/edit_rating_global")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> editRatingGlobal(
            @RequestParam("ratingGlobalId") String ratingGlobalToken,
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam("starEditPrice") Double starPrice,
            @RequestParam("starEditProductQuality") Double starProductQuality,
            @RequestParam("starEditDelivery") Double starDelivery,
            @RequestParam("starEditStoreRating") Double starStoreRating,
            @RequestParam("feedback") String feedback,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long ratingGlobalId = sessionTokenManager.extractFromToken(
                ratingGlobalToken, session,
                "idToTokenRatingGlobalMap",
                "оновлення відгуку на магазину");

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.updateRatingGlobal(
                        ratingGlobalId,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        starPrice,
                        starProductQuality,
                        starDelivery,
                        starStoreRating,
                        feedback),
                ratingGlobalToken,
                request,
                session,
                recaptchaToken,
                version,
                "edit_rating_global",
                "idToTokenRatingGlobalMap",
                "newRatingGlobalId");
    }

    @PostMapping("/edit_rating")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> editRating(
            @RequestParam("ratingId") String ratingToken,
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam("star") Double star,
            @RequestParam("feedback") String feedback,
            @RequestParam("advantages") String advantages,
            @RequestParam("disadvantages") String disadvantages,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long ratingId = sessionTokenManager.extractFromToken(
                ratingToken,
                session,
                "idToTokenRatingMap",
                "оновлення відгуку на товар");

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.updateRating(
                        ratingId,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        star,
                        feedback,
                        advantages,
                        disadvantages),
                ratingToken,
                request,
                session,
                recaptchaToken,
                version,
                "edit_rating",
                "idToTokenRatingMap",
                "newRatingId");
    }

    @PostMapping("/edit_question_answer")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> editQuestionAnswer(
            @RequestParam("questionAnswerId") String questionAnswerToken,
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam("feedback") String feedback,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long questionAnswerId = sessionTokenManager.extractFromToken(
                questionAnswerToken,
                session,
                "idToTokenQuestionAnswerMap",
                "оновлення питання на товар");

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.updateQuestionAnswer(
                        questionAnswerId,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        phone,
                        email,
                        feedback),
                questionAnswerToken,
                request,
                session,
                recaptchaToken,
                version,
                "edit_question_answer",
                "idToTokenQuestionAnswerMap",
                "newQuestionAnswerId");
    }

    @PostMapping("/edit_report_availability")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> editReportAvailability(
            @RequestParam("reportAvailabilityId") String reportAvailabilityToken,
            @RequestParam(value = "guestName", required = false) String guestName,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws JsonProcessingException {
        Long reportAvailabilityId = sessionTokenManager.extractFromToken(
                reportAvailabilityToken,
                session,
                "idToTokenReportAvailabilityMap",
                "оновлення повідомлення про наявність");

        return requestValidationService.handleOperation(
                ctx -> ratingLikeDisService.updateReportAvailability(
                        reportAvailabilityId,
                        ctx.getGuestId(),
                        ctx.getUserId(),
                        ctx.getAccountAvailable(),
                        guestName,
                        phone,
                        email),
                reportAvailabilityToken,
                request,
                session,
                recaptchaToken,
                version,
                "edit_report_availability",
                "idToTokenReportAvailabilityMap",
                "newReportAvailabilityId");
    }

    // Remove Rating Global && Rating && Question Answer && Report Availability

    @PostMapping("/remove_rating_global")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeRatingGlobal(
            @RequestParam("ratingGlobalId") String ratingGlobalToken,
            @RequestParam("g-recaptcha-response") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws ExecutionException, InterruptedException, JsonProcessingException {
        Long ratingGlobalId = sessionTokenManager.extractFromToken(
                ratingGlobalToken, session,
                "idToTokenRatingGlobalMap",
                "видалення відгуку на магазину");
        RatingGlobal ratingGlobal = ratingLikeDisService.getRatingGlobalById(ratingGlobalId);

        return requestValidationService.handleBatch(
                ratingGlobal,
                (entity, ctx) -> ratingLikeDisService.deleteRatingGlobal(
                        entity.getId(),
                        ctx.getGuestId(),
                        ctx.getUserId()),
                ratingGlobalToken,
                true,
                request,
                session,
                "idToTokenRatingGlobalMap",
                recaptchaToken,
                version,
                "remove_rating_global",
                "Не вдалося видалити відгук на магазин, спробуйте пізніше");
    }

    @PostMapping("/remove_rating")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeRating(
            @RequestParam("ratingId") String ratingToken,
            @RequestParam("g-recaptcha-response") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws ExecutionException, InterruptedException, JsonProcessingException {
        Long ratingId = sessionTokenManager.extractFromToken(
                ratingToken, session,
                "idToTokenRatingMap",
                "видалення відгуку на товар");
        Rating rating = ratingLikeDisService.getRatingById(ratingId);

        return requestValidationService.handleBatch(
                rating,
                (entity, ctx) -> ratingLikeDisService.deleteRating(
                        entity.getId(),
                        ctx.getGuestId(),
                        ctx.getUserId()),
                ratingToken,
                true,
                request,
                session,
                "idToTokenRatingMap",
                recaptchaToken,
                version,
                "remove_rating",
                "Не вдалося видалити відгук на товар, спробуйте пізніше");
    }

    @PostMapping("/remove_question_answer")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeQuestionAnswer(
            @RequestParam("questionAnswerId") String questionAnswerToken,
            @RequestParam("g-recaptcha-response") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws ExecutionException, InterruptedException, JsonProcessingException {
        Long questionAnswerId = sessionTokenManager.extractFromToken(
                questionAnswerToken, session,
                "idToTokenQuestionAnswerMap",
                "видалення питання/відповіді на товар");
        QuestionAnswer questionAnswer = ratingLikeDisService.getQuestionAnswerById(questionAnswerId);

        return requestValidationService.handleBatch(
                questionAnswer,
                (entity, ctx) -> ratingLikeDisService.deleteQuestionAnswer(
                        entity.getId(),
                        ctx.getGuestId(),
                        ctx.getUserId()),
                questionAnswerToken,
                true,
                request,
                session,
                "idToTokenQuestionAnswerMap",
                recaptchaToken,
                version,
                "remove_question_answer",
                "Не вдалося видалити питання/відповідь, спробуйте пізніше");
    }

    @PostMapping("/remove_report_availability")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> removeReportAvailability(
            @RequestParam("reportAvailabilityId") String reportAvailabilityToken,
            @RequestParam("g-recaptcha-response") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,
            HttpSession session,
            HttpServletRequest request) throws ExecutionException, InterruptedException, JsonProcessingException {
        Long reportAvailabilityId = sessionTokenManager.extractFromToken(
                reportAvailabilityToken, session,
                "idToTokenReportAvailabilityMap",
                "видалення повідомлення про наявність");
        ReportAvailability reportAvailability = ratingLikeDisService.getReportAvailabilityById(reportAvailabilityId);

        return requestValidationService.handleBatch(
                reportAvailability,
                (entity, ctx) -> ratingLikeDisService.deleteReportAvailability(
                        entity.getId(),
                        ctx.getGuestId(),
                        ctx.getUserId()),
                reportAvailabilityToken,
                true,
                request,
                session,
                "idToTokenReportAvailabilityMap",
                recaptchaToken,
                version,
                "remove_report_availability",
                "Не вдалося видалити повідомлення про наявність, спробуйте пізніше");
    }
}
