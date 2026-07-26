package com.optics_store.optics.service.serv_secure;

import java.time.Instant;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.optics_store.optics.entity.users.users_secur.RecaptchaVerif;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
/**
 * Google reCAPTCHA Verification Provider.
 * Handles secure server-to-server communication with Google's API to evaluate
 * interaction trust scores for v2 (checkbox) and v3 (invisible) integrations.
 */
public class RecaptchaService {

    @Value("${recaptcha.secret.key.v2}")
    private String secretKeyV2;
    @Value("${recaptcha.secret.key.v3}")
    private String secretKeyV3;
    @Value("${recaptcha.secret.key.threshold}")
    private Double threshold;
    @Value("${recaptcha.v3.cache.form.seconds}")
    private long formCacheSeconds;
    @Value("${recaptcha.v3.cache.like.seconds}")
    private long likeCacheSeconds;

    private final WebClient webClient;
    private final ConcurrentMap<String, Instant> lastPassedV3 = new ConcurrentHashMap<>();

    @PostConstruct
    public void warmJackson() throws JsonProcessingException {
        new ObjectMapper().readValue("{}", RecaptchaResponse.class);
    }

    @PostConstruct
    public void warmUpRecaptcha() {
        webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("secret", secretKeyV2)
                        .queryParam("response", "invalid-token")
                        .build())
                .retrieve()
                .bodyToMono(RecaptchaResponse.class)
                .onErrorResume(_ -> Mono.empty())
                .block();
    }

    private String extractReason(
            RecaptchaResponse resp,
            boolean success,
            boolean hostOk,
            boolean noErrors,
            boolean actionMatches,
            Double score,
            String expectedAction) {
        if (success && hostOk && noErrors && actionMatches && (score == null || score >= threshold)) {
            return null;
        }
        if (!success) {
            return "API failure: " + Arrays.toString(resp.getErrorCodes());
        }
        if (!hostOk) {
            return "Hostname mismatch: " + resp.getHostname();
        }
        if (!noErrors) {
            return "Errors: " + Arrays.toString(resp.getErrorCodes());
        }
        if (expectedAction != null && !actionMatches) {
            return "Action mismatch: expected=" + expectedAction + " but was=" + resp.getAction();
        }
        if (score != null && score < threshold) {
            return "Low score: " + score;
        }
        return "Unknown failure";
    }

    /**
     * Token verification processors.
     * Evaluates the response payload (hostnames, action matches, thresholds) to
     * confidently classify the interaction as human or bot.
     */
    private Mono<Boolean> verifyV2(
            String token,
            Long guestId,
            Long userId) {
        return callRecaptcha(secretKeyV2, token)
                .map(resp -> {
                    boolean success = resp.isSuccess();
                    boolean hostOk = "localhost".equals(resp.getHostname());
                    boolean noErrors = resp.getErrorCodes() == null || resp.getErrorCodes().length == 0;
                    boolean finalOk = success && hostOk && noErrors;

                    String reason = extractReason(resp, success, hostOk, noErrors, true, null, null);

                    log.info(
                            "reCAPTCHA v2 — results: success={}, hostOk={}, noErrors={}, → OK={}, guestId={}, userId={}, reason={}",
                            success, hostOk, noErrors, finalOk, guestId, userId, reason);
                    return finalOk;
                })
                .onErrorResume(ex -> {
                    log.error("Error calling reCAPTCHA v2 API — guestId={}, userId={}", guestId, userId, ex);
                    return Mono.just(false);
                });
    }

    private Mono<Boolean> verifyV3(
            String token,
            Long guestId,
            Long userId,
            String expectedAction) {
        String key = (userId != null ? "U:" + userId : "G:" + guestId);
        Instant now = Instant.now();
        Instant last = lastPassedV3.getOrDefault(key, Instant.EPOCH);

        long cacheSeconds = "add_like_dislike_global".equals(expectedAction)
                || "add_like_dislike".equals(expectedAction)
                        ? likeCacheSeconds
                        : formCacheSeconds;

        if (now.minusSeconds(cacheSeconds).isBefore(last)) {
            log.debug("Reusing recent V3 token — key={}, cacheSeconds={}", key, cacheSeconds);
            return Mono.just(true);
        }

        return callRecaptcha(secretKeyV3, token)
                .map(resp -> {
                    boolean success = resp.isSuccess();
                    boolean hostOk = "localhost".equals(resp.getHostname());
                    boolean noErrors = resp.getErrorCodes() == null || resp.getErrorCodes().length == 0;
                    boolean actionMatches = expectedAction.equals(resp.getAction());
                    Double score = resp.getScore();
                    boolean scoreOk = score != null && score >= threshold;
                    boolean finalOk = success && hostOk && noErrors && actionMatches && scoreOk;

                    String reason = extractReason(resp, success, hostOk, noErrors, actionMatches, score,
                            expectedAction);

                    if (finalOk) {
                        lastPassedV3.put(key, now);
                    }

                    log.info(
                            "reCAPTCHA v3 — results: success={}, score={}, threshold={}, action='{}', expectedAction='{}', actionMatches={}, hostOk={}, noErrors={}, → OK={}, key={}, reason={}",
                            success, score, threshold, resp.getAction(), expectedAction, actionMatches, hostOk,
                            noErrors, finalOk, key, reason);
                    return finalOk;
                })
                .onErrorResume(ex -> {
                    log.error("Error calling reCAPTCHA v3 API — key={}, guestId={}, userId={}", key, guestId, userId,
                            ex);
                    return Mono.just(false);
                });
    }

    public ResponseEntity<Map<String, Object>> verifyRecaptcha(
            HttpServletRequest request,
            Long guestId,
            Long userId,
            String recaptchaToken,
            String version,
            String action) throws JsonProcessingException {
        boolean captchaOk;
        if ("v2".equals(version)) {
            captchaOk = verifyV2(recaptchaToken, guestId, userId).blockOptional().orElse(false);
        } else {
            captchaOk = verifyV3(recaptchaToken, guestId, userId, action).blockOptional().orElse(false);
        }

        if (!captchaOk) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "success", false,
                            "error", "Не вдалося підтвердити, що Ви не робот"));
        }
        return null;
    }

    public RecaptchaVerif verifyAndReturnRecaptcha(
            HttpServletRequest request,
            Long guestId,
            Long userId,
            String recaptchaToken,
            String version,
            String action) {
        String key = (userId != null ? "U:" + userId : "G:" + guestId);
        Instant now = Instant.now();

        boolean success;
        String reason;
        Double score = null;

        if ("v2".equals(version)) {
            RecaptchaResponse resp = callRecaptcha(secretKeyV2, recaptchaToken)
                    .blockOptional()
                    .orElseThrow(() -> new IllegalStateException("Cannot call reCAPTCHA v2"));

            boolean hostOk = "localhost".equals(resp.getHostname());
            boolean noErrors = resp.getErrorCodes() == null || resp.getErrorCodes().length == 0;

            success = resp.isSuccess() && hostOk && noErrors;
            reason = extractReason(resp,
                    resp.isSuccess(),
                    hostOk,
                    noErrors,
                    true,
                    score = success ? 1.0 : 0.0,
                    null);
        } else {
            Instant last = lastPassedV3.getOrDefault(key, Instant.EPOCH);
            long cacheSeconds = ("add_like_dislike".equals(action) || "add_like_dislike_global".equals(action))
                    ? likeCacheSeconds
                    : formCacheSeconds;

            if (now.minusSeconds(cacheSeconds).isBefore(last)) {
                success = true;
                reason = null;
            } else {
                RecaptchaResponse resp = callRecaptcha(secretKeyV3, recaptchaToken)
                        .blockOptional()
                        .orElseThrow(() -> new IllegalStateException("Cannot call reCAPTCHA v3"));

                boolean hostOk = "localhost".equals(resp.getHostname());
                boolean noErrors = resp.getErrorCodes() == null || resp.getErrorCodes().length == 0;
                boolean actionMatches = action.equals(resp.getAction());
                score = resp.getScore();
                boolean scoreOk = score != null && score >= threshold;

                success = resp.isSuccess() && hostOk && noErrors && actionMatches && scoreOk;
                reason = extractReason(resp,
                        resp.isSuccess(),
                        hostOk,
                        noErrors,
                        actionMatches,
                        score,
                        action);

                if (success) {
                    lastPassedV3.put(key, now);
                }
            }
        }

        return new RecaptchaVerif(
                null,
                guestId,
                userId,
                success,
                reason,
                now,
                score);
    }

    private Mono<RecaptchaResponse> callRecaptcha(String secretKey, String token) {
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("secret", secretKey)
                        .queryParam("response", token)
                        .build())
                .retrieve()
                .bodyToMono(RecaptchaResponse.class);
    }

    @Getter
    private static class RecaptchaResponse {
        @JsonProperty("success")
        private boolean success;
        @JsonProperty("action")
        private String action;
        @JsonProperty("challenge_ts")
        private String challengeTs;
        @JsonProperty("hostname")
        private String hostname;
        @JsonProperty("score")
        private Double score;
        @JsonProperty("error-codes")
        private String[] errorCodes;
    }
}
