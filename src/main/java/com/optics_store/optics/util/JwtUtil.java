package com.optics_store.optics.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;

@Component
/**
 * Security Utility: JSON Web Token (JWT) Manager.
 * Implements the JWT-based authentication mechanism mentioned in the platform
 * architecture,
 * providing stateless, secure user session management without relying on
 * traditional server-side sessions.
 */
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Getter
    @Setter
    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    /**
     * JWT lifecycle methods (Generation, Parsing, Validation).
     * Handles the creation of secure tokens upon user login and the
     * extraction/validation of claims
     * (such as user ID and roles) during subsequent requests to ensure data
     * integrity and access control.
     */
    public String generateTokenWithId(Long id, String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .claim("id", id)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS512)
                .compact();
    }

    public Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token);
    }
}
