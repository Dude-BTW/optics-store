package com.optics_store.optics.config.config_secur;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.optics_store.optics.security.GuestAuthFilter;
import com.optics_store.optics.security.JsonAuthFailureHandler;
import com.optics_store.optics.security.LoginValidationFilter;
import com.optics_store.optics.security.secur_jwt.JwtAuthFilter;
import com.optics_store.optics.security.secur_jwt.JwtAuthSuccHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
/**
 * Core security configuration for the e-commerce platform.
 * Implements JWT-based authentication, role-based access control (RBAC), and
 * integrates custom filters
 * for secure guest and authenticated user interactions.
 */
public class SecurityConfig {

    @Bean
    /**
     * Authentication provider and handler configurations.
     * Ensures secure password processing (bcrypt) and tailored JSON/AJAX responses
     * for client-side interactions
     * without triggering default server-side redirects.
     */
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    DaoAuthenticationProvider authProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        provider.setHideUserNotFoundExceptions(false);
        return provider;
    }

    @Bean
    AuthenticationFailureHandler jsonFailureHandler() {
        return new JsonAuthFailureHandler();
    };

    @Bean
    AuthenticationSuccessHandler ajaxAwareSuccessHandler(JwtAuthSuccHandler delegate) {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
            String xrw = request.getHeader("X-Requested-With");
            boolean ajax = "XMLHttpRequest".equalsIgnoreCase(xrw);
            if (ajax) {
                response.setStatus(200);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":true}");
            } else {
                delegate.onAuthenticationSuccess(request, response, authentication);
            }
        };
    }

    @Bean
    /**
     * Main security filter chain.
     * Disables CSRF (handled via stateless JWT), sets up custom authentication
     * filters (GuestAuthFilter, JwtAuthFilter)
     * before standard filters, and defines explicit role-based access rules
     * ('/admin/**', '/client/**').
     */
    SecurityFilterChain filterChain(
            HttpSecurity http,
            GuestAuthFilter guestAuthFilter,
            JwtAuthFilter jwtAuthFilter,
            JwtAuthSuccHandler successHandler,
            LoginValidationFilter loginValidationFilter,
            DaoAuthenticationProvider authProvider) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .addFilterBefore(guestAuthFilter, AnonymousAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, AnonymousAuthenticationFilter.class)
                .addFilterBefore(loginValidationFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authProvider)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                // Main Page Controller
                                "/", "/all_{groupe}/**", "/wishlist/**", "/cart/**",

                                // Optics Controller
                                "/brand/{categoryName}/**", "/catalog/{groupName}/**", "/search/{searchQuery}/**",
                                "/aktsiini_tovary/**", "/products/{productName}/**",

                                // Rating Like Controller
                                "/reviews_the_store/**",

                                "/register", "/login",

                                // Static resources
                                "/images/**", "/font/**",
                                "/css/**", "/css_main/**",
                                "/js/**", "/js_main/**")
                        .permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMINISTRATOR")
                        .requestMatchers("/client/**").hasRole("CLIENT")
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .successHandler(ajaxAwareSuccessHandler(successHandler))
                        .failureHandler(jsonFailureHandler())
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .deleteCookies("AUTH_TOKEN")
                        .permitAll());
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    /**
     * Configures Cross-Origin Resource Sharing (CORS) rules to safely allow
     * specific HTTP methods and headers
     * from authorized frontend origins.
     */
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("https://localhost", "http://localhost", "http://localhost:8080"));
        cfg.setAllowedMethods(List.of("GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"));
        cfg.setAllowedHeaders(List.of("Content-Type", "X-Requested-With", "Authorization"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
