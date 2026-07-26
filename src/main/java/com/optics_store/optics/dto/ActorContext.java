package com.optics_store.optics.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
/**
 * Data Transfer Object (DTO).
 * Acts as a secure data container for transferring information between the
 * Front-end and Back-end.
 * Ensures that sensitive internal database structures are not directly exposed
 * to the client side.
 */
public class ActorContext {

    private final Long guestId;
    private final Long userId;
    private final Boolean accountAvailable;
    private final Long actorId;

    public ActorContext(Long guestId, Long userId, Boolean accountAvailable) {
        this.guestId = guestId;
        this.userId = userId;
        this.accountAvailable = accountAvailable;
        this.actorId = (userId != null) ? userId : guestId;
    }
}
