package com.optics_store.optics.service.serv_secure;

import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.function.BiConsumer;
import java.util.function.Function;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.optics_store.optics.dto.ActorContext;
import com.optics_store.optics.dto.dto_users_secur.RecaptchaVerifDto;
import com.optics_store.optics.entity.users.users_secur.RecaptchaVerif;
import com.optics_store.optics.service.serv_client.ClientJWTService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Security Orchestrator for sensitive endpoints.
 * Integrates Google reCAPTCHA v2/v3 and the custom Rate Limiting algorithms to
 * protect critical client-side forms (registration, feedback, subscriptions)
 * from automated bots.
 */
public class RequestValidationService {

    private final ClientJWTService clientJWTService;
    private final RecaptchaService recaptchaService;
    private final SessionTokenManager sessionTokenManager;
    private final RateLimiterService rateLimiterService;

    private ActorContext resolveActor(HttpServletRequest request) {
        Long guestId = clientJWTService.getCurrentGuestId(request);
        Long userId = clientJWTService.getCurrentUserId(request);
        Boolean available = clientJWTService.accountAvailability();
        return new ActorContext(guestId, userId, available);
    }

    /**
     * Transaction validation wrappers.
     * Resolves the user's context, checks their IP against the Rate Limiter,
     * verifies the reCAPTCHA token score,
     * and either processes the operation or returns a structured JSON error for the
     * frontend to render dynamically.
     */
    public <T> ResponseEntity<Map<String, Object>> handleBatch(
            T entity,
            BiConsumer<T, ActorContext> scheduler,
            String oldToken,
            boolean deleteToken,
            HttpServletRequest request,
            HttpSession session,
            String sessionAttributeKey,
            String recaptchaToken,
            String version,
            String recaptchaAction,
            String errorMessage) throws ExecutionException, InterruptedException, JsonProcessingException {

        ActorContext ctx = resolveActor(request);
        RecaptchaVerif verif = recaptchaService.verifyAndReturnRecaptcha(
                request, ctx.getGuestId(), ctx.getUserId(), recaptchaToken, version, recaptchaAction);
        RecaptchaVerifDto captchaDto = new RecaptchaVerifDto(verif);

        String ip = rateLimiterService.resolveClientIp();
        String path = request.getRequestURI();
        RateLimiterService.RateLimitStatus status = rateLimiterService.checkRateLimit(ip, path, captchaDto);
        if (status != RateLimiterService.RateLimitStatus.ALLOWED) {
            return buildRateLimitResponse(status, captchaDto);
        }

        if (!verif.isSuccess()) {
            return buildRecaptchaFailureResponse();
        }

        scheduler.accept(entity, ctx);

        if (deleteToken && sessionAttributeKey != null && oldToken != null) {
            sessionTokenManager.removeToken(session, sessionAttributeKey, oldToken);
        }

        return sessionTokenManager.processServiceCall(errorMessage);
    }

    public ResponseEntity<Map<String, Object>> handleOperation(
            Function<ActorContext, Long> operation,
            String oldToken,
            HttpServletRequest request,
            HttpSession session,
            String recaptchaToken,
            String version,
            String recaptchaAction,
            String sessionAttributeKey,
            String tokenResponseKey) throws JsonProcessingException {

        ActorContext ctx = resolveActor(request);
        RecaptchaVerif verif = recaptchaService.verifyAndReturnRecaptcha(
                request, ctx.getGuestId(), ctx.getUserId(), recaptchaToken, version, recaptchaAction);
        RecaptchaVerifDto captchaDto = new RecaptchaVerifDto(verif);

        String ip = rateLimiterService.resolveClientIp();
        String path = request.getRequestURI();
        RateLimiterService.RateLimitStatus status = rateLimiterService.checkRateLimit(ip, path, captchaDto);
        if (status != RateLimiterService.RateLimitStatus.ALLOWED) {
            return buildRateLimitResponse(status, captchaDto);
        }

        if (!verif.isSuccess()) {
            return buildRecaptchaFailureResponse();
        }

        ResponseEntity<Map<String, Object>> response = sessionTokenManager.processServiceOperation(
                () -> operation.apply(ctx),
                session,
                sessionAttributeKey,
                tokenResponseKey);

        if (oldToken != null && response.getStatusCode().is2xxSuccessful()) {
            sessionTokenManager.removeToken(session, sessionAttributeKey, oldToken);
        }

        return response;
    }

    public ResponseEntity<Map<String, Object>> buildRecaptchaFailureResponse() {
        return ResponseEntity
                .status(403)
                .body(Map.of(
                        "success", false,
                        "error", "Не вдалося підтвердити, що Ви не робот"));
    }

    public ResponseEntity<Map<String, Object>> buildRateLimitResponse(
            RateLimiterService.RateLimitStatus status,
            RecaptchaVerifDto captchaDto) {

        String captchaNote = (captchaDto != null && !captchaDto.isSuccess())
                ? " Часті невдалі спроби пройти перевірку на бота."
                : "";

        String msg;
        switch (status) {
            case SUSPICIOUS_ACTIVITY:
                msg = "Ваш IP тимчасово заблоковано на 15 хвилин через підозрілу активність."
                        + captchaNote;
                return ResponseEntity
                        .status(403)
                        .body(Map.of("success", false, "error", msg));

            case BLOCKED:
                msg = "Ваш IP тимчасово заблоковано на 60 хвилин через агресивні запити."
                        + captchaNote;
                return ResponseEntity
                        .status(403)
                        .body(Map.of("success", false, "error", msg));

            case PERMANENTLY_BLOCKED:
                msg = "Ваш IP заблоковано назавжди через агресивні запити."
                        + captchaNote;
                return ResponseEntity
                        .status(403)
                        .body(Map.of("success", false, "error", msg));

            default:
                return ResponseEntity
                        .status(429)
                        .body(Map.of("success", false, "error", "Забагато запитів, зачекайте трохи."));
        }
    }
}
