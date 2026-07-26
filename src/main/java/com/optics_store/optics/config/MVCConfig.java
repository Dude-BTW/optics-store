package com.optics_store.optics.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
/**
 * Spring MVC configuration for the Server-Side Rendering (SSR) architecture.
 * Manages the delivery of front-end assets (HTML, CSS, JS, images) required by
 * the Freemarker templates.
 */
public class MVCConfig implements WebMvcConfigurer {

    @Override
    /**
     * Maps URL paths (e.g., '/images/**', '/css/**') to their physical locations on
     * the classpath,
     * enabling the client-side browser to load static UI components.
     */
    public void addResourceHandlers(@SuppressWarnings("null") ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

        registry.addResourceHandler("/font/**")
                .addResourceLocations("classpath:/static/font/");

        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");
        registry.addResourceHandler("/css_main/**")
                .addResourceLocations("classpath:/static/css_main/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");
        registry.addResourceHandler("/js_main/**")
                .addResourceLocations("classpath:/static/js_main/");
    }
}
