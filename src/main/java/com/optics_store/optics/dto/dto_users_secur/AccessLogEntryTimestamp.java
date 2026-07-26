package com.optics_store.optics.dto.dto_users_secur;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/**
 * Data Transfer Object (DTO).
 * Acts as a secure data container for transferring information between the
 * Front-end and Back-end.
 * Ensures that sensitive internal database structures are not directly exposed
 * to the client side.
 */
public class AccessLogEntryTimestamp {

    private Instant timestamp;
    private String requestPath;
    private RecaptchaVerifDto recaptchaVerif;

    public AccessLogEntryTimestamp(Instant timestamp, String requestPath) {
        this.timestamp = timestamp;
        this.requestPath = requestPath;
    }
}
