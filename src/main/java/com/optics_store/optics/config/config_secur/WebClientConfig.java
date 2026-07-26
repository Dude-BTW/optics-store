package com.optics_store.optics.config.config_secur;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import io.netty.resolver.DefaultAddressResolverGroup;
import reactor.netty.http.HttpProtocol;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

@Configuration
/**
 * HTTP client configuration tailored for integrating third-party security
 * assets, such as Google reCAPTCHA.
 */
public class WebClientConfig {

    @Value("${recaptcha.verify.url}")
    private String verifyUrl;

    @Bean
    /**
     * Group of methods configuring a high-performance, asynchronous WebClient.
     * Defines connection pooling, network timeouts, and base URLs required for
     * rapid and secure communication
     * with external verification APIs (like Google reCAPTCHA).
     */
    public ConnectionProvider connectionProvider() {
        return ConnectionProvider.builder("recaptcha-pool")
                .maxConnections(20)
                .pendingAcquireTimeout(Duration.ofSeconds(1))
                .maxIdleTime(Duration.ofMinutes(5))
                .evictInBackground(Duration.ofMinutes(1))
                .build();
    }

    @Bean
    public WebClient recaptchaWebClient(WebClient.Builder builder,
            ConnectionProvider provider) {
        HttpClient httpClient = HttpClient.create(provider)
                .protocol(HttpProtocol.H2, HttpProtocol.HTTP11)
                .secure()
                .resolver(DefaultAddressResolverGroup.INSTANCE)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 500)
                .responseTimeout(Duration.ofMillis(500))
                .responseTimeout(Duration.ofSeconds(2))
                .option(ChannelOption.TCP_NODELAY, true)
                .option(ChannelOption.SO_KEEPALIVE, true);

        return builder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(verifyUrl)
                .defaultHeader("Content-Type", "application/x-www-form-urlencoded")
                .build();
    }
}
