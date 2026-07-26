package com.optics_store.optics.util;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.optics_store.optics.config.config_secur.EncryptionProperties;

import jakarta.annotation.PostConstruct;

@Component
/**
 * Core utility class providing shared helper functions across the e-commerce
 * platform.
 * Encapsulates reusable logic to keep the main business and security modules
 * clean and maintainable.
 */
public class CryptoUtil {

    private final EncryptionProperties props;
    private Map<String, SecretKeySpec> keySpecMap;
    private String currentKeyId;

    @Value("${encryption.algorithm}")
    private String algorithm;

    public CryptoUtil(EncryptionProperties props) {
        this.props = props;
    }

    public String getCurrentKeyId() {
        return currentKeyId;
    }

    @PostConstruct
    private void init() {
        currentKeyId = props.getCurrentKeyId();
        keySpecMap = new HashMap<>();
        for (var entry : props.getSecrets().entrySet()) {
            String keyId = entry.getKey();
            byte[] keyBytes = Arrays.copyOf(
                    entry.getValue().getBytes(StandardCharsets.UTF_8),
                    32);
            keySpecMap.put(keyId, new SecretKeySpec(keyBytes, "AES"));
        }
    }

    public String encrypt(String plain) {
        try {
            SecretKeySpec key = keySpecMap.get(currentKeyId);
            Cipher cipher = Cipher.getInstance(algorithm);

            byte[] iv = new byte[cipher.getBlockSize()];
            new SecureRandom().nextBytes(iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(iv));

            byte[] encrypted = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));
            byte[] combined = ByteBuffer.allocate(iv.length + encrypted.length)
                    .put(iv)
                    .put(encrypted)
                    .array();
            String payload = Base64.getEncoder().encodeToString(combined);
            return currentKeyId + "-" + payload;
        } catch (Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    public String decrypt(String cipherText) {
        try {
            int dash = cipherText.indexOf('-');
            if (dash < 0) {
                throw new IllegalArgumentException("Invalid cipher format");
            }
            String keyId = cipherText.substring(0, dash);
            String payload = cipherText.substring(dash + 1);

            SecretKeySpec key = keySpecMap.get(keyId);
            if (key == null) {
                throw new IllegalStateException("Unknown key id: " + keyId);
            }

            byte[] decoded = Base64.getDecoder().decode(payload);
            Cipher cipher = Cipher.getInstance(algorithm);
            int blockSize = cipher.getBlockSize();

            byte[] iv = Arrays.copyOfRange(decoded, 0, blockSize);
            byte[] enc = Arrays.copyOfRange(decoded, blockSize, decoded.length);

            cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
            byte[] plain = cipher.doFinal(enc);
            return new String(plain, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }
}
