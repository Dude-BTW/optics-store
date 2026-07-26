package com.optics_store.optics.security.secur_jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.optics_store.optics.security.secur_cust_users.CustomUseGueDetails;
import com.optics_store.optics.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * Authentication success handler.
 * Generates and securely delivers the JWT (usually via HttpOnly cookies) upon
 * successful login,
 * establishing the user's secure session state across the platform.
 */
public class JwtAuthSuccHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtils;

    @Value("${app.cookie.domain}")
    private String cookieDomain;
    @Value("${app.cookie.user-name}")
    private String userCookieName;

    @Override
    /**
     * HTTP Request Interception method.
     * Evaluates incoming client requests, applies the relevant security logic
     * (e.g., token validation, bot checking, credential parsing),
     * and determines whether to allow the request to proceed through the filter
     * chain or reject it.
     */
    public void onAuthenticationSuccess(HttpServletRequest req,
            HttpServletResponse res,
            Authentication auth) throws IOException {
        Long userId = ((CustomUseGueDetails) auth.getPrincipal()).getUserId();
        String token = jwtUtils.generateTokenWithId(userId, "USER");

        Cookie cookie = new Cookie(userCookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setDomain(cookieDomain);
        cookie.setMaxAge((int) (jwtUtils.getJwtExpirationMs() / 1000));
        res.addCookie(cookie);

        res.sendRedirect("/");
    }
}
