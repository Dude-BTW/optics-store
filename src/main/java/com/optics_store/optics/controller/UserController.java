package com.optics_store.optics.controller;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.optics_store.optics.entity.users.Client;
import com.optics_store.optics.entity.users.ERole;
import com.optics_store.optics.entity.users.Role;
import com.optics_store.optics.entity.users.User;
import com.optics_store.optics.repository.rep_users.ClientRepos;
import com.optics_store.optics.repository.rep_users.RoleRepos;
import com.optics_store.optics.repository.rep_users.UserGuestRoleRepos;
import com.optics_store.optics.repository.rep_users.UserRepos;
import com.optics_store.optics.security.secur_cust_users.CustomGuestDetails;
import com.optics_store.optics.service.serv_secure.RequestValidationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
/**
 * Authentication and Security Controller.
 * Manages client registration and login workflows. Issues secure JSON Web
 * Tokens (JWT) upon successful authentication
 * and acts as the entry point for role-based access control (RBAC) validation.
 */
/**
 * Application Web Controller.
 * Bridges the Front-end (Freemarker templates) with the Back-end business
 * logic, handling HTTP request routing and data aggregation.
 */
public class UserController {

    private final UserRepos usersRepo;
    private final RoleRepos roleRepo;
    private final UserGuestRoleRepos ugrRepo;
    private final ClientRepos clientRepo;
    private final PasswordEncoder passwordEncoder;
    private final RequestValidationService requestValidationService;

    /**
     * Data Submission and State Mutation Endpoints (HTTP POST).
     * Securely process user inputs (e.g., form submissions, cart updates). They
     * perform strict validation, verify reCAPTCHA trust scores,
     * and return structured JSON responses to trigger asynchronous UI animations
     * and state updates.
     */
    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phone") String phone,
            @RequestParam("email") String email,
            @RequestParam("password") String password,

            @RequestParam("recaptchaToken") String recaptchaToken,
            @RequestParam(value = "version", required = false) String version,

            HttpServletRequest request,
            HttpSession session,

            Principal principal) throws JsonProcessingException, ExecutionException, InterruptedException {

        return requestValidationService.handleBatch(
                null,
                (_, _) -> {
                    Client client = new Client();
                    client.setFirstName(firstName);
                    client.setLastName(lastName);
                    client.setPhone(phone);
                    client.setEmail(email);
                    client = clientRepo.save(client);

                    User tempUser = new User();
                    tempUser.setPassword(passwordEncoder.encode(password));
                    tempUser.setClient(client);
                    final User user = usersRepo.save(tempUser);

                    Role clientRole = roleRepo.findByName(ERole.CLIENT)
                            .orElseThrow(() -> new IllegalStateException("Роль CLIENT не знайдена"));

                    Long guestId = (principal instanceof CustomGuestDetails)
                            ? ((CustomGuestDetails) principal).getGuestId()
                            : null;

                    if (guestId != null) {
                        ugrRepo.findByGuestId(guestId).ifPresentOrElse(
                                ugr -> {
                                    ugr.setUser(user);
                                    ugr.setGuest(null);
                                    ugr.setRole(clientRole);
                                    ugrRepo.save(ugr);
                                },
                                () -> {
                                    user.addRole(clientRole);
                                    usersRepo.save(user);
                                });
                    } else {
                        user.addRole(clientRole);
                        usersRepo.save(user);
                    }
                },
                null,
                false,
                request,
                session,
                null,
                recaptchaToken,
                version,
                "register",
                "Не вдалося завершити реєстрацію, спробуйте пізніше");
    }
}
