package com.optics_store.optics.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.optics_store.optics.entity.guests.Guest;
import com.optics_store.optics.repository.rep_guests.GuestRepos;
import com.optics_store.optics.security.secur_cust_users.CustomGuestDetails;
import com.optics_store.optics.service.serv_client.ClientJWTService;
import com.optics_store.optics.service.serv_client.GuestService;
import com.optics_store.optics.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * Security filter for unauthenticated visitors.
 * Establishes temporary Guest sessions using JWTs, allowing anonymous users to
 * interact with the product catalog,
 * submit reviews, and use the cart without requiring formal registration.
 */
public class GuestAuthFilter extends OncePerRequestFilter {

    private final ClientJWTService clientJWTService;
    private final GuestService guestService;
    private final GuestRepos guestRepos;
    private final JwtUtil jwtUtils;

    @Value("${app.cookie.domain}")
    private String cookieDomain;
    @Value("${app.cookie.guest-name}")
    private String guestCookieName;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
            @NonNull HttpServletResponse res,
            @NonNull FilterChain chain)
            throws ServletException, IOException {
        Authentication current = SecurityContextHolder.getContext().getAuthentication();
        if (current != null && current.isAuthenticated()
                && !(current instanceof AnonymousAuthenticationToken)) {
            chain.doFilter(req, res);
            return;
        }

        String path = req.getServletPath();
        if (path.startsWith("/images/")
                || path.startsWith("/font/")
                || path.startsWith("/css/")
                || path.startsWith("/css_main/")
                || path.startsWith("/js/")
                || path.startsWith("/js_main/")) {
            chain.doFilter(req, res);
            return;
        }

        Long guestId = clientJWTService.getCurrentGuestId(req);
        if (guestId == null) {
            Long newGuestId = guestService.createGuestAndReturnId();
            String token = jwtUtils.generateTokenWithId(newGuestId, "GUEST");

            Cookie cookie = new Cookie(guestCookieName, token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setDomain(cookieDomain);
            cookie.setMaxAge((int) (jwtUtils.getJwtExpirationMs() / 1000));
            res.addCookie(cookie);

            Guest guest = guestRepos.findById(newGuestId).orElseThrow();
            CustomGuestDetails det = CustomGuestDetails.build(guest);
            Authentication auth = new UsernamePasswordAuthenticationToken(det, null, det.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        chain.doFilter(req, res);
    }
}
