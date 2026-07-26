// package com.optics_store.optics;

// import java.time.Instant;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.params.ParameterizedTest;
// import org.junit.jupiter.params.provider.CsvSource;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.reactive.server.WebTestClient;

// import com.optics_store.optics.cache.IpLogCacheManager;
// import com.optics_store.optics.dto.dto_users_secur.RecaptchaVerifDto;
// import com.optics_store.optics.entity.users.users_secur.BlockedIp;
// import
// com.optics_store.optics.repository.rep_users.rep_users_secur.BlockedIpRepos;
// import com.optics_store.optics.service.serv_secure.RateLimiterService;

// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// public class RateLimitStatusWithCaptchaTest {

// @Autowired
// private RateLimiterService rateLimiterService;

// @Autowired
// private IpLogCacheManager ipLogCacheManager;

// @Autowired
// private BlockedIpRepos blockedIpRepos;

// @Autowired
// private WebTestClient webTestClient;

// private static final Logger log =
// LoggerFactory.getLogger(RateLimitStatusWithCaptchaTest.class);

// private static final String TEST_IP = "192.0.2.1";
// private static final String PATH = "/for_test";

// @BeforeEach
// public void cleanBeforeTest() {
// ipLogCacheManager.clearForIp(TEST_IP);
// blockedIpRepos.findAllByIp(TEST_IP).forEach(blockedIpRepos::delete);
// }

// private RecaptchaVerifDto buildDto(String trustLevel) {
// switch (trustLevel) {
// case "HIGH": return new RecaptchaVerifDto(1L, 1L, true, Instant.now());
// case "MEDIUM": return simulateTrust(0.6);
// case "LOW": return simulateTrust(0.3);
// case "NONE": return new RecaptchaVerifDto(0L, 0L, false, Instant.EPOCH);
// default: throw new IllegalArgumentException("Invalid trust level: " +
// trustLevel);
// }
// }

// private RecaptchaVerifDto simulateTrust(double score) {
// int total = 10;
// int success = (int) (score * total);
// for (int i = 0; i < total; i++) {
// boolean passed = i < success;
// RecaptchaVerifDto dto = new RecaptchaVerifDto(1L, 1L, passed, Instant.now());
// rateLimiterService.checkRateLimit(TEST_IP, PATH, dto);
// }
// return new RecaptchaVerifDto(1L, 1L, true, Instant.now());
// }

// @ParameterizedTest(name = "{index} — Controller POST {0} + {1} trust")
// @DisplayName("Full Controller Integration: POST /for_test vs Captcha Trust")
// @CsvSource({
// "ALLOWED, HIGH, 200",
// "ALLOWED, MEDIUM, 200",
// "ALLOWED, LOW, 200",
// "ALLOWED, NONE, 200",

// "TOO_MANY_REQUESTS, HIGH, 200",
// "TOO_MANY_REQUESTS, MEDIUM, 429",
// "TOO_MANY_REQUESTS, LOW, 429",
// "TOO_MANY_REQUESTS, NONE, 429",

// "SUSPICIOUS_ACTIVITY, HIGH, 200",
// "SUSPICIOUS_ACTIVITY, MEDIUM, 429",
// "SUSPICIOUS_ACTIVITY, LOW, 423",
// "SUSPICIOUS_ACTIVITY, NONE, 429",

// "BLOCKED, HIGH, 429",
// "BLOCKED, MEDIUM, 423",
// "BLOCKED, LOW, 423",
// "BLOCKED, NONE, 423",

// "PERMANENTLY_BLOCKED, HIGH, 423",
// "PERMANENTLY_BLOCKED, MEDIUM, 423",
// "PERMANENTLY_BLOCKED, LOW, 423",
// "PERMANENTLY_BLOCKED, NONE, 423"
// })
// public void testControllerEndpoint(String simulatedStatus, String trust, int
// expectedStatus) {
// simulateStatus(simulatedStatus);
// RecaptchaVerifDto dto = buildDto(trust);

// webTestClient.post()
// .uri(PATH)
// .header("X-FORWARDED-FOR", TEST_IP)
// .contentType(MediaType.APPLICATION_JSON)
// .bodyValue(dto)
// .exchange()
// .expectStatus().isEqualTo(expectedStatus);

// log.info("POST {} + {} → expected HTTP {} → OK", simulatedStatus, trust,
// expectedStatus);
// }

// private void simulateStatus(String status) {
// Instant now = Instant.now();
// int count;
// switch (status) {
// case "TOO_MANY_REQUESTS": count = 2; break;
// case "SUSPICIOUS_ACTIVITY": count = 3; break;
// case "BLOCKED": count = 6; break;
// case "PERMANENTLY_BLOCKED":
// BlockedIp ip = new BlockedIp();
// ip.setIp(TEST_IP);
// ip.setBlockedAt(Instant.EPOCH);
// ip.setReason("Simulated permanent block");
// blockedIpRepos.save(ip);
// return;
// default: return; // ALLOWED
// }
// for (int i = 0; i < count; i++) {
// RecaptchaVerifDto dto = new RecaptchaVerifDto(1L, 1L, false,
// now.minusSeconds(i * 10));
// rateLimiterService.checkRateLimit(TEST_IP, PATH, dto);
// }
// }
// }
