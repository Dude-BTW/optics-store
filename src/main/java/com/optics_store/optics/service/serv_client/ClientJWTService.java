package com.optics_store.optics.service.serv_client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.optics_store.optics.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
/**
 * Stateless Session Manager.
 * Interacts with the browser's HttpOnly cookies to securely extract, parse, and
 * destroy JSON Web Tokens (JWT),
 * acting as the foundation for the platform's authentication architecture.
 */
public class ClientJWTService {

    private final JwtUtil jwtUtils;
    private final HttpServletRequest request;

    @Value("${app.cookie.domain}")
    private String cookieDomain;
    @Value("${app.cookie.guest-name}")
    private String guestCookieName;
    @Value("${app.cookie.user-name}")
    private String userCookieName;

    public boolean accountAvailability() {
        return getCurrentUserId(request) != null;
    }

    /**
     * JWT Cookie lifecycle methods.
     * Retrieves user/guest identity claims from the request or forcefully
     * invalidates the session by erasing the cookie.
     */
    public Long getCurrentGuestId(HttpServletRequest request) {
        return parseIdFromCookie(request, guestCookieName, "GUEST");
    }

    public Long getCurrentUserId(HttpServletRequest request) {
        return parseIdFromCookie(request, userCookieName, "USER");
    }

    private Long parseIdFromCookie(HttpServletRequest req,
            String cookieName,
            String subjectExpected) {
        if (req.getCookies() == null)
            return null;
        for (Cookie c : req.getCookies()) {
            if (!cookieName.equals(c.getName()))
                continue;
            try {
                Claims claims = jwtUtils.parseToken(c.getValue()).getBody();
                if (subjectExpected.equals(claims.getSubject()))
                    return claims.get("id", Long.class);
            } catch (JwtException ex) {
                return null;
            }
        }
        return null;
    }

    public void deleteGuestCookie(HttpServletResponse response) {
        log.warn("Deleting expired or invalid guest cookie '{}' for domain {}", guestCookieName, cookieDomain);
        ResponseCookie deleteCookie = ResponseCookie.from(guestCookieName, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .domain(cookieDomain)
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }

    public void deleteUserCookie(HttpServletResponse response) {
        log.warn("Deleting expired or invalid user cookie '{}' for domain {}", userCookieName, cookieDomain);
        ResponseCookie deleteCookie = ResponseCookie.from(userCookieName, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .domain(cookieDomain)
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }
}
