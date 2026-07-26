package com.optics_store.optics.repository.rep_users.rep_users_secur;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.entity.users.users_secur.BlockedIp;

/**
 * Database access interface (Repository).
 * Handles CRUD operations for the associated entity, integrating with the
 * multi-level caching system
 * (Caffeine library) to reduce database load during client request processing.
 */
public interface BlockedIpRepos extends JpaRepository<BlockedIp, Long> {

    /**
     * Custom database query methods.
     * Used for specific business logic retrievals (e.g., fetching visible records,
     * filtering by state).
     * Optimized to work alongside the SQL storage and query interception
     * mechanisms.
     */
    Optional<BlockedIp> findByIp(String ip);

    boolean existsByIp(String ip);

    @Query("SELECT COUNT(b) FROM BlockedIp b WHERE b.blockedAt < :cutoff")
    long countByBlockedAtBefore(Instant cutoff);

    @Modifying
    @Transactional
    @Query("DELETE FROM BlockedIp b WHERE b.blockedAt < :cutoff")
    int deleteByBlockedAtBefore(Instant cutoff);

    List<BlockedIp> findAllByIp(String ip);
}
