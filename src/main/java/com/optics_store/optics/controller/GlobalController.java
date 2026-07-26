package com.optics_store.optics.controller;

import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.users.User;
import com.optics_store.optics.entity.users.users_interaction.ReportAvailability;
import com.optics_store.optics.service.MainPageService;
import com.optics_store.optics.service.OpticsService;
import com.optics_store.optics.service.serv_client.ClientJWTService;
import com.optics_store.optics.service.serv_client.UserService;
import com.optics_store.optics.service.serv_secure.SessionTokenManager;
import com.optics_store.optics.service.serv_user_interaction.UserInteractionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
/**
 * Application Web Controller.
 * Bridges the Front-end (Freemarker templates) with the Back-end business
 * logic, handling HTTP request routing and data aggregation.
 */
public class GlobalController {

    private final MainPageService mainPageService;
    private final OpticsService opticsService;
    private final UserInteractionService userInteractionService;
    private final ClientJWTService clientJWTService;
    private final UserService userService;
    private final SessionTokenManager sessionTokenManager;

    @ModelAttribute
    public void addGlobalAttributes(
            Model model,
            HttpSession session,
            HttpServletRequest request) {
        Long guestId = clientJWTService.getCurrentGuestId(request);
        Long userId = clientJWTService.getCurrentUserId(request);

        model.addAttribute("guestId", guestId);
        model.addAttribute("userId", userId);

        if (userId != null) {
            User findUser = userService.getUserById(userId);
            model.addAttribute("MClient", findUser.getClient());
        }

        log.debug("guestId: {}, userId: {}", guestId, userId);

        // Session
        boolean isGet = "GET".equalsIgnoreCase(request.getMethod());

        Map<String, String> idToTokenOpticsMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenOpticsMap",
                () -> opticsService.getAllOptics(),
                Optics::getId);
        Map<String, String> idToTokenReportAvailabilityMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenReportAvailabilityMap",
                () -> userInteractionService.getAllReportAvailability(),
                ReportAvailability::getId);

        // OTH
        model.addAttribute("allImages", mainPageService.getAllSliderImages1());

        // Optics
        model.addAttribute("allOptics", opticsService.getAllOptics());
        model.addAttribute("idToTokenOpticsMap", idToTokenOpticsMap);
        model.addAttribute("idToTokenReportAvailabilityMap", idToTokenReportAvailabilityMap);

        // Nav 2
        model.addAttribute("allOpticsNav1", mainPageService.getAllOpticsByCardOpticsNav1());
        model.addAttribute("allOpticsNav2", mainPageService.getAllOpticsByCardOpticsNav2());

        // GlassesNav
        model.addAttribute("genderGlassesNav", opticsService.getDistinctValues("genderGlasses"));
        model.addAttribute("brandGlassesNav", opticsService.getDistinctValues("brandGlasses"));
        model.addAttribute("manufacturerGlassesNav", opticsService.getDistinctValues("manufacturerGlasses"));
        model.addAttribute("countryGlassesNav", opticsService.getDistinctValues("countryGlasses"));
        model.addAttribute("materialGlassesNav", opticsService.getDistinctValues("materialGlasses"));
        model.addAttribute("eyeglassGlassesNav", opticsService.getDistinctValues("eyeglassGlasses"));

        // FrameNav
        model.addAttribute("genderFrameNav", opticsService.getDistinctValues("genderFrame"));
        model.addAttribute("brandFrameNav", opticsService.getDistinctValues("brandFrame"));
        model.addAttribute("manufacturerFrameNav", opticsService.getDistinctValues("manufacturerFrame"));
        model.addAttribute("countryFrameNav", opticsService.getDistinctValues("countryFrame"));
        model.addAttribute("materialFrameNav", opticsService.getDistinctValues("materialFrame"));
    }
}
