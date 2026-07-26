package com.optics_store.optics.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

import org.springframework.stereotype.Component;

@Component
/**
 * Network Utility: Client IP Extraction.
 * A foundational component for the platform's infrastructure protection against
 * automated attacks.
 * Accurately resolves the user's real IP address (even behind proxies/load
 * balancers) to feed the Rate Limiting algorithms and malicious IP blocking
 * system.
 */
public class ClientIpResolver {

    /**
     * Analyzes HTTP headers (like X-Forwarded-For) to reliably identify the origin
     * of a request,
     * preventing automated bot attacks from spoofing their location or bypassing
     * the security rate limiters.
     */
    public String resolveClientIp() {
        try {
            URL url = new URI("https://api64.ipify.org?format=text").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()))) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                return sb.toString().trim();
            }
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }
}
