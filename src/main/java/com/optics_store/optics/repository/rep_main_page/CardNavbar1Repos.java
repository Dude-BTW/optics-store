package com.optics_store.optics.repository.rep_main_page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.optics_store.optics.entity.main_page.CardNavbar1;

@Repository
/**
 * Database access interface (Repository).
 * Handles CRUD operations for the associated entity, integrating with the
 * multi-level caching system
 * (Caffeine library) to reduce database load during client request processing.
 */
public interface CardNavbar1Repos extends JpaRepository<CardNavbar1, Long> {
}
