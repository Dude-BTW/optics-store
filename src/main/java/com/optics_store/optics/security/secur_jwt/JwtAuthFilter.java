package com.optics_store.optics.security.secur_jwt;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.optics_store.optics.entity.guests.Guest;
import com.optics_store.optics.entity.users.User;
import com.optics_store.optics.repository.rep_guests.GuestRepos;
import com.optics_store.optics.repository.rep_users.UserRepos;
import com.optics_store.optics.security.secur_cust_users.CustomGuestDetails;
import com.optics_store.optics.security.secur_cust_users.CustomUseGueDetails;
import com.optics_store.optics.service.serv_client.ClientJWTService;
import com.optics_store.optics.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
/**
 * Core security filter for JWT-based authentication.
 * Intercepts incoming HTTP requests to validate JSON Web Tokens, enforcing
 * Role-Based Access Control (RBAC)
 * and maintaining stateless, secure sessions for authenticated clients and
 * administrators.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtils;
    private final GuestRepos guestRepos;
    private final UserRepos userRepos;

    private final ClientJWTService clientJWTService;

    @Value("${app.cookie.guest-name}")
    private String guestCookieName;
    @Value("${app.cookie.user-name}")
    private String userCookieName;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
            @NonNull HttpServletResponse res,
            @NonNull FilterChain chain)
            throws ServletException, IOException {
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                String name = c.getName();
                String token = c.getValue();
                try {
                    Claims claims = jwtUtils.parseToken(token).getBody();
                    Long id = claims.get("id", Long.class);
                    String subject = claims.getSubject();
                    Authentication auth = null;

                    if (guestCookieName.equals(name) && "GUEST".equals(subject)) {
                        Optional<Guest> guestOpt = guestRepos.findById(id);
                        if (guestOpt.isEmpty()) {
                            clientJWTService.deleteGuestCookie(res);
                            break;
                        }
                        CustomGuestDetails det = CustomGuestDetails.build(guestOpt.get());
                        auth = new UsernamePasswordAuthenticationToken(det, null, det.getAuthorities());

                    } else if (userCookieName.equals(name) && "USER".equals(subject)) {
                        Optional<User> userOpt = userRepos.findById(id);
                        if (userOpt.isEmpty()) {
                            clientJWTService.deleteUserCookie(res);
                            break;
                        }
                        CustomUseGueDetails det = CustomUseGueDetails.build(userOpt.get());
                        auth = new UsernamePasswordAuthenticationToken(det, null, det.getAuthorities());
                    }

                    if (auth != null) {
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        break;
                    }

                } catch (JwtException ex) {
                    if (guestCookieName.equals(name)) {
                        clientJWTService.deleteGuestCookie(res);
                    } else if (userCookieName.equals(name)) {
                        clientJWTService.deleteUserCookie(res);
                    }
                    break;
                }
            }
        }
        chain.doFilter(req, res);
    }
}
