package com.optics_store.optics.security;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Authentication failure handler optimized for dynamic client-side
 * interactions.
 * Returns security error messages in JSON format instead of triggering standard
 * Server-Side Rendering (SSR) page redirects,
 * enabling asynchronous UI state updates during failed login attempts.
 */
public class JsonAuthFailureHandler implements AuthenticationFailureHandler {

    @Override
    /**
     * HTTP Request Interception method.
     * Evaluates incoming client requests, applies the relevant security logic
     * (e.g., token validation, bot checking, credential parsing),
     * and determines whether to allow the request to proceed through the filter
     * chain or reject it.
     */
    public void onAuthenticationFailure(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        String message;
        if (exception instanceof UsernameNotFoundException) {
            message = "Акаунт не знайдений";
        } else if (exception instanceof BadCredentialsException) {
            message = "Невірний email або пароль";
        } else {
            message = "Невірний email або пароль";
        }
        String body = "{\"success\":false,\"error\":\"" + message + "\"}";
        response.getWriter().write(body);
    }
}
