package com.optics_store.optics.service.serv_client;

import org.springframework.stereotype.Service;

import com.optics_store.optics.entity.users.Client;
import com.optics_store.optics.repository.rep_users.ClientRepos;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Backend Business Service component.
 * Implements transactional logic and integrates data flow between repositories,
 * caches, and API controllers.
 */
public class ClientService {

    private final ClientRepos clientRepos;

    public Client getClientById(Long clientId) {
        return clientRepos.findById(clientId).orElse(null);
    }
}
