package com.optics_store.optics.service.serv_client;

/**
 * Backend Business Service component.
 * Implements transactional logic and integrates data flow between repositories,
 * caches, and API controllers.
 */
public interface ClientAuthorizable {
    Boolean getAccountUsed();

    Long getClientId();
}
