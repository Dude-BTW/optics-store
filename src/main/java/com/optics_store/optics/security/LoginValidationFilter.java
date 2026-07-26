package com.optics_store.optics.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.optics_store.optics.dto.dto_users_secur.RecaptchaVerifDto;
import com.optics_store.optics.entity.users.users_secur.RecaptchaVerif;
import com.optics_store.optics.service.serv_client.ClientJWTService;
import com.optics_store.optics.service.serv_secure.RateLimiterService;
import com.optics_store.optics.service.serv_secure.RateLimiterService.RateLimitStatus;
import com.optics_store.optics.service.serv_secure.RecaptchaService;
import com.optics_store.optics.service.serv_secure.RequestValidationService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * Authentication checkpoint and pre-authentication filter.
 * Integrates Google reCAPTCHA verification and Rate Limiting algorithms prior
 * to processing login credentials,
 * actively safeguarding the infrastructure against brute-force and automated
 * bot attacks.
 */
public class LoginValidationFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final RecaptchaService recaptchaService;
    private final ClientJWTService clientJWTService;
    private final RequestValidationService requestValidationService;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {

        if ("/login".equals(request.getServletPath())
                && "POST".equalsIgnoreCase(request.getMethod())) {

            String recaptchaToken = request.getParameter("recaptchaToken");
            String version = request.getParameter("version");
            String recaptchaAction = "login";

            Long guestId = clientJWTService.getCurrentGuestId(request);
            Long userId = clientJWTService.getCurrentUserId(request);

            RecaptchaVerif verif = recaptchaService.verifyAndReturnRecaptcha(
                    request, guestId, userId, recaptchaToken, version, recaptchaAction);
            RecaptchaVerifDto captchaDto = new RecaptchaVerifDto(verif);

            String ip = rateLimiterService.resolveClientIp();
            String path = request.getRequestURI();
            RateLimitStatus status = rateLimiterService.checkRateLimit(ip, path, captchaDto);
            if (status != RateLimitStatus.ALLOWED) {
                ResponseEntity<Map<String, Object>> resp = requestValidationService.buildRateLimitResponse(status,
                        captchaDto);
                writeResponse(response, resp);
                return;
            }

            if (!verif.isSuccess()) {
                ResponseEntity<Map<String, Object>> resp = requestValidationService.buildRecaptchaFailureResponse();
                writeResponse(response, resp);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private void writeResponse(HttpServletResponse response, ResponseEntity<Map<String, Object>> entity)
            throws IOException {
        response.setStatus(entity.getStatusCode().value());
        response.setContentType("application/json;charset=UTF-8");
        mapper.writeValue(response.getWriter(), entity.getBody());
    }
}
