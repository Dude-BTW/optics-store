package com.optics_store.optics.dto.dto_users_secur;

import java.time.Instant;

import com.optics_store.optics.entity.users.users_secur.RecaptchaVerif;

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
public class RecaptchaVerifDto {

    private Long guestId;
    private Long userId;
    private boolean success;
    private String reason;
    private Instant timestamp;

    private Double score;

    public RecaptchaVerifDto(RecaptchaVerif entity) {
        this.guestId = entity.getGuestId();
        this.userId = entity.getUserId();
        this.success = entity.isSuccess();
        this.reason = entity.getReason();
        this.timestamp = entity.getTimestamp();
        this.score = entity.getScore();
    }

    public RecaptchaVerif toEntity() {
        return new RecaptchaVerif(
                null,
                guestId,
                userId,
                success,
                reason,
                timestamp,
                score);
    }
}
