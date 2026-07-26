package com.optics_store.optics.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
@EnableScheduling
@EnableAsync
/**
 * Core scheduling and asynchronous task configuration.
 * Supports the platform's custom system for background data processing,
 * including the asynchronous SQL-to-Excel synchronization.
 */
public class CoreConfig {

    @Bean
    /**
     * Defines a dedicated thread pool ('debounce-scheduler-') for handling delayed
     * or scheduled background tasks
     * efficiently without blocking the main application flow.
     */
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5);
        scheduler.setThreadNamePrefix("debounce-scheduler-");
        return scheduler;
    }
}
