package com.optics_store.optics.repository.rep_users.rep_users_interaction;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.optics_store.optics.entity.users.users_interaction.LikeDislikeGlobal;
import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;

@Repository
/**
 * Database access interface (Repository).
 * Handles CRUD operations for the associated entity, integrating with the
 * multi-level caching system
 * (Caffeine library) to reduce database load during client request processing.
 */
public interface LikeDislikeGlobalRepos extends JpaRepository<LikeDislikeGlobal, Long> {
    /**
     * Custom database query methods.
     * Used for specific business logic retrievals (e.g., fetching visible records,
     * filtering by state).
     * Optimized to work alongside the SQL storage and query interception
     * mechanisms.
     */
    Optional<LikeDislikeGlobal> findFirstByRatingGlobalAndAccountAvailabilityAndClientId(
            RatingGlobal ratingGlobal,
            Boolean accountAvailability,
            Long clientId);
}
