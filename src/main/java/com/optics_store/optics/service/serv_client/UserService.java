package com.optics_store.optics.service.serv_client;

import org.springframework.stereotype.Service;

import com.optics_store.optics.entity.users.User;
import com.optics_store.optics.repository.rep_users.UserRepos;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Backend Business Service component.
 * Implements transactional logic and integrates data flow between repositories,
 * caches, and API controllers.
 */
public class UserService {

    private final UserRepos userRepos;

    public User getUserById(Long userId) {
        return userRepos.findById(userId).orElse(null);
    }
}
