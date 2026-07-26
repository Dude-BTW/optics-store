package com.optics_store.optics.repository.rep_history.rep_his_user_interaction;

import org.springframework.data.jpa.repository.JpaRepository;

import com.optics_store.optics.entity.history.his_user_interaction.RatingGlobalHistory;

/**
 * Database access interface (Repository).
 * Handles CRUD operations for the associated entity, integrating with the
 * multi-level caching system
 * (Caffeine library) to reduce database load during client request processing.
 */
public interface RatingGlobalHistoryRepos extends JpaRepository<RatingGlobalHistory, Long> {
}
