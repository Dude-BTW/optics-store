package com.optics_store.optics.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.optics_store.optics.entity.users.users_interaction.RatingGlobal;
import com.optics_store.optics.service.MainPageService;
import com.optics_store.optics.service.OpticsService;
import com.optics_store.optics.service.serv_secure.SessionTokenManager;
import com.optics_store.optics.service.serv_user_interaction.UserInteractionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
/**
 * Server-Side Rendering (SSR) Controller for the Home Page.
 * Orchestrates the delivery of Freemarker templates populated with cached UI
 * components (hero banners, carousels, mega-menu),
 * ensuring rapid initial page loads and responsive grid/flex layouts.
 */
/**
 * Application Web Controller.
 * Bridges the Front-end (Freemarker templates) with the Back-end business
 * logic, handling HTTP request routing and data aggregation.
 */
public class MainPageController {

    private final OpticsService opticsService;
    private final MainPageService mainPageService;
    private final UserInteractionService ratingLikeDisService;

    private final SessionTokenManager sessionTokenManager;

    // SliderImages1

    /**
     * Page Rendering and Data Fetching Endpoints (HTTP GET).
     * These methods intercept browser navigation requests, aggregate necessary data
     * from fast in-memory caches (Caffeine)
     * or the SQL database, and return fully rendered HTML pages (SSR) directly to
     * the client.
     */
    @GetMapping("/")
    public String getData(
            Model model,
            HttpSession session,
            HttpServletRequest request) {
        // Session
        boolean isGet = "GET".equalsIgnoreCase(request.getMethod());

        Map<String, String> idToTokenRatingGlobalMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenRatingGlobalMap",
                () -> ratingLikeDisService.getAllRatingGlobal(),
                RatingGlobal::getId);

        model.addAttribute("allImages", mainPageService.getAllSliderImages1());
        model.addAttribute("allOptics1", mainPageService.getAllOpticsByCardOptics1());
        model.addAttribute("allOptics2", mainPageService.getAllOpticsByCardOptics2());
        model.addAttribute("allOptics3", mainPageService.getAllOpticsByCardOptics3());
        model.addAttribute("allCardOptics3", mainPageService.getAllCardOptics3());
        model.addAttribute("allCategory", mainPageService.getAllCaruslCategory());

        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        model.addAttribute("allRatingGlobal", ratingLikeDisService.getAllRatingGlobal());
        model.addAttribute("allRatingGlobalAverage", ratingLikeDisService.getAllRatingGlobalAverage());
        model.addAttribute("allRatingGlobalByClient", ratingLikeDisService.getAllRatingGlobalByClient());
        model.addAttribute("idToTokenRatingGlobalMap", idToTokenRatingGlobalMap);

        return "main_page";
    }

    @GetMapping("/all_{groupe}/**")
    public String getAllOpticsByGroupe(
            @PathVariable("groupe") String groupeName,
            Model model) {
        String groupedTitle;
        Map<String, List<String>> groupedVariable;

        switch (groupeName) {
            case "gender":
                groupedVariable = opticsService.getGroupedFieldValuesAlphabetically(groupeName);
                groupedTitle = "Категорії";
                break;
            case "brand":
                groupedVariable = opticsService.getGroupedFieldValuesAlphabetically(groupeName);
                groupedTitle = "Бренди";
                break;
            case "manufacturer":
                groupedVariable = opticsService.getGroupedFieldValuesAlphabetically(groupeName);
                groupedTitle = "Виробники";
                break;
            case "country":
                groupedVariable = opticsService.getGroupedFieldValuesAlphabetically(groupeName);
                groupedTitle = "Країни";
                break;
            case "material":
                groupedVariable = opticsService.getGroupedFieldValuesAlphabetically(groupeName);
                groupedTitle = "Матеріали";
                break;
            case "eyeglass":
                groupedVariable = opticsService.getGroupedFieldValuesAlphabetically(groupeName);
                groupedTitle = "Лінзи";
                break;
            default:
                return "redirect:/";
        }

        model.addAttribute("groupedTitle", groupedTitle);
        model.addAttribute("allGroupedVariable", groupedVariable);

        return "all_optics_grouped";
    }

    @GetMapping("/wishlist/**")
    public String getAllOpticsByFavorites(
            Model model) {
        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        return "all_optics_favorites";
    }

    @GetMapping("/cart/**")
    public String getAllOpticsByCart(Model model) {
        return "all_optics_cart";
    }
}
