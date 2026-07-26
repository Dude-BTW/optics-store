package com.optics_store.optics.config;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.entity.users.ERole;
import com.optics_store.optics.entity.users.Role;
import com.optics_store.optics.repository.rep_users.RoleRepos;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
/**
 * Application startup hook.
 * Ensures that foundational data required for the platform's business logic is
 * present upon deployment.
 */
public class DataInitializer implements CommandLineRunner {

    private final RoleRepos roleRepos;

    @Override
    @Transactional
    /**
     * Automatically populates the database with default user roles (GUEST, CLIENT,
     * ADMINISTRATOR)
     * if the roles table is empty, initializing the Role-Based Access Control
     * (RBAC) structure.
     */
    public void run(String... args) {
        if (roleRepos.count() == 0) {
            Arrays.stream(ERole.values())
                    .map(roleName -> new Role(null, roleName))
                    .forEach(roleRepos::save);
            log.info("Initialized roles table with default data.");
        } else {
            log.info("Roles already initialized, skipping.");
        }
    }
}
