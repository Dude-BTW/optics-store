package com.optics_store.optics.util;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
/**
 * Cryptography Utility.
 * Provides secure hash generation algorithms used for session token creation
 * and verification processes.
 */
public class Hashing {

    @Value("${encryption.hmac-secret}")
    private String hmacSecret;

    private static final String HMAC_ALGO = "HmacSHA256";

    private String hmac(byte[] data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec keySpec = new SecretKeySpec(
                    hmacSecret.getBytes(StandardCharsets.UTF_8),
                    HMAC_ALGO);
            mac.init(keySpec);
            byte[] result = mac.doFinal(data);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(result);
        } catch (Exception e) {
            throw new RuntimeException("Failed to compute HMAC-SHA256", e);
        }
    }

    /**
     * Cryptographic functions.
     * Generates randomized, salted tokens to secure temporary user operations (like
     * forms and feedback) and validate request authenticity.
     */
    public String generateHashedTokenFast() {
        String uuid = UUID.randomUUID().toString();
        return hmac(uuid.getBytes(StandardCharsets.UTF_8));
    }

    public String generateHashedTokenStrong() {
        SecureRandom random = new SecureRandom();
        byte[] randomBytes = new byte[32];
        random.nextBytes(randomBytes);
        return hmac(randomBytes);
    }

    public String generateHashedTokenWithSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        byte[] randomBytes = new byte[32];
        random.nextBytes(randomBytes);
        byte[] combined = new byte[salt.length + randomBytes.length];
        System.arraycopy(salt, 0, combined, 0, salt.length);
        System.arraycopy(randomBytes, 0, combined, salt.length, randomBytes.length);
        String token = hmac(combined);
        // adjust characters if needed
        return token.replace('_', '-');
    }
}
