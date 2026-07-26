package com.optics_store.optics.service.serv_secure;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.function.Function;
import java.util.function.Supplier;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.optics_store.optics.util.Hashing;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Anti-CSRF and State Validation Manager.
 * Generates and validates temporary cryptographic tokens linked to user
 * sessions to secure specific workflow transitions and form submissions.
 */
public class SessionTokenManager {

    private final Hashing hashing;

    @SuppressWarnings("unchecked")
    public <T> Map<String, String> initTokenMap(
            HttpSession session,
            boolean isGet,
            String sessionKey,
            Supplier<List<T>> fetchAll,
            Function<T, Long> idExtractor) {
        Map<String, String> tokenMap = (Map<String, String>) session.getAttribute(sessionKey);

        if (tokenMap == null || isGet) {
            tokenMap = new HashMap<>();
            for (T entity : fetchAll.get()) {
                String id = idExtractor.apply(entity).toString();
                tokenMap.put(id, hashing.generateHashedTokenWithSalt());
            }
            session.setAttribute(sessionKey, tokenMap);
        }
        return tokenMap;
    }

    public Long extractFromToken(String token,
            HttpSession session,
            String sessionAttributeKey,
            String tokenTypeName) {
        @SuppressWarnings("unchecked")
        Map<String, String> tokenMap = (Map<String, String>) session.getAttribute(sessionAttributeKey);
        if (tokenMap == null) {
            throw new IllegalStateException(
                    "У сесії відсутній атрибут: " + sessionAttributeKey);
        }
        String originalIdStr = tokenMap.entrySet().stream()
                .filter(e -> e.getValue().equals(token))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Невірний " + tokenTypeName + ": " + token));
        return Long.parseLong(originalIdStr);
    }

    @SuppressWarnings("unchecked")
    public void removeToken(HttpSession session, String sessionAttributeKey, String token) {
        Map<String, String> map = (Map<String, String>) session.getAttribute(sessionAttributeKey);
        if (map != null) {
            map.entrySet().removeIf(e -> e.getValue().equals(token));
            session.setAttribute(sessionAttributeKey, map);
        }
    }

    public ResponseEntity<Map<String, Object>> processServiceCall(String errorPrefix) {
        Map<String, Object> resp = new HashMap<>();
        try {
            resp.put("success", true);
            return ResponseEntity.ok(resp);
        } catch (Exception ex) {
            ex.printStackTrace();
            resp.put("success", false);
            resp.put("error", errorPrefix + " — " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }

    public ResponseEntity<Map<String, Object>> processServiceOperation(
            Callable<Long> operation,
            HttpSession session,
            String sessionAttributeKey,
            String tokenResponseKey) {
        try {
            Long newId = operation.call();
            String token = hashing.generateHashedTokenWithSalt();

            @SuppressWarnings("unchecked")
            Map<String, String> map = (Map<String, String>) session.getAttribute(sessionAttributeKey);
            if (map == null) {
                map = new HashMap<>();
            }
            map.put(newId.toString(), token);
            session.setAttribute(sessionAttributeKey, map);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put(tokenResponseKey, token);
            return ResponseEntity.ok(resp);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "error", "Не вдалося зберегти рейтинг — " + ex.getMessage()));
        }
    }
}
