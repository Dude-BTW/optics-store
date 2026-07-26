package com.optics_store.optics.repository.rep_users.rep_users_secur;

import org.springframework.data.jpa.repository.JpaRepository;

import com.optics_store.optics.entity.users.users_secur.RecaptchaVerif;

/**
 * Database access interface (Repository).
 * Handles CRUD operations for the associated entity, integrating with the
 * multi-level caching system
 * (Caffeine library) to reduce database load during client request processing.
 */
public interface RecaptchaVerifRepos extends JpaRepository<RecaptchaVerif, Long> {
}
