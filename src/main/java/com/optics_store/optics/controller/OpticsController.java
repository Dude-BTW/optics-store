package com.optics_store.optics.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.OpticsAddition;
import com.optics_store.optics.entity.main_page.CaruslCategory;
import com.optics_store.optics.entity.main_page.CaruslGroup;
import com.optics_store.optics.entity.users.users_interaction.LikeDislike;
import com.optics_store.optics.entity.users.users_interaction.QuestionAnswer;
import com.optics_store.optics.entity.users.users_interaction.Rating;
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
 * Catalog and Search Controller.
 * Manages the e-commerce storefront rendering. Processes URL parameters for
 * dynamic faceted search (filtering),
 * live search queries, and pagination, tying the Back-end SQL data to the
 * interactive Front-end components.
 */
/**
 * Application Web Controller.
 * Bridges the Front-end (Freemarker templates) with the Back-end business
 * logic, handling HTTP request routing and data aggregation.
 */
public class OpticsController {

    private final MainPageService mainPageService;
    private final OpticsService opticsService;
    private final UserInteractionService ratingLikeDisService;
    private final SessionTokenManager sessionTokenManager;

    /**
     * Page Rendering and Data Fetching Endpoints (HTTP GET).
     * These methods intercept browser navigation requests, aggregate necessary data
     * from fast in-memory caches (Caffeine)
     * or the SQL database, and return fully rendered HTML pages (SSR) directly to
     * the client.
     */
    @GetMapping("/brand/{categoryName}/**")
    public String getAllOpticsByCategory(@PathVariable("categoryName") String categoryName,
            @RequestParam(value = "sorting", defaultValue = "new") String sortOptics,
            Model model) {

        Map.Entry<String, List<Optics>> closestBrandEntry = opticsService.getAllOpticsByCategory(categoryName);
        String closestBrand = closestBrandEntry.getKey();
        List<Optics> filteredOptics = closestBrandEntry.getValue();

        List<OpticsAddition> allOpticsAdditions = opticsService.getAllOpticsAddition();

        Map<Long, OpticsAddition> opticsAdditionMap = allOpticsAdditions.stream()
                .collect(Collectors.toMap(addition -> addition.getOptic().getId(), addition -> addition));

        filteredOptics = sortOpticsList(filteredOptics, sortOptics, opticsAdditionMap);

        CaruslCategory selectedCategory = mainPageService.findCategoryByName(closestBrand);
        String logoCategory = selectedCategory != null ? selectedCategory.getLogoCategory() : "";

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        String currentDate = LocalDate.now().format(dateFormatter);

        double totalQuantity = filteredOptics.stream()
                .mapToDouble(optic -> {
                    OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                    return addition != null ? addition.getQuantity() : 0.0;
                })
                .sum();

        model.addAttribute("categoryName", closestBrand);
        model.addAttribute("sortOptics", sortOptics);
        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        model.addAttribute("allOpticsByCategory", filteredOptics);
        model.addAttribute("logoCategory", logoCategory);
        model.addAttribute("currentDate", currentDate);
        model.addAttribute("totalQuantity", totalQuantity);
        model.addAttribute("allCategory", mainPageService.getAllCaruslCategory());

        Map<String, List<String>> filterOptions = opticsService.getUniqueFilterOptions(closestBrand,
                null,
                null,
                null,
                false);
        if (filterOptions.values().stream().anyMatch(list -> !list.isEmpty())) {
            model.addAttribute("filterOptions", filterOptions);
        }

        return "optics_by_brand";
    }

    @GetMapping("/catalog/{groupName}/**")
    public String getAllOpticsByGroup(@PathVariable("groupName") String groupName,
            @RequestParam(value = "sorting", defaultValue = "new") String sortOptics,
            HttpServletRequest request,
            Model model) {

        String fullPath = request.getRequestURI();
        String afterGroupName = fullPath.replaceFirst("^/catalog/" + Pattern.quote(groupName) + "/?", "");
        String groupGender = null;
        if (!afterGroupName.isEmpty()) {
            String[] parts = afterGroupName.split("/");
            if (parts.length > 0) {
                String possibleGroupGroup = parts[0];
                if (!possibleGroupGroup.contains("-")) {
                    groupGender = possibleGroupGroup;
                }
            }
        }

        if ("okuliary-sontsezakhysni".equals(groupName)) {
            groupName = "Окуляри сонцезахисні";
        } else if ("opravy-dlia-okuliariv".equals(groupName)) {
            groupName = "Оправи для окулярів";
        }
        if (groupGender != null) {
            switch (groupGender) {
                case "zhinochi":
                    groupGender = "жіночі";
                    break;
                case "cholovichi":
                    groupGender = "чоловічі";
                    break;
                case "dytiachi":
                    groupGender = "дитячі";
                    break;
                case "uniseks":
                    groupGender = "унісекс";
                    break;
                default:
                    groupGender = null;
                    break;
            }
        }

        Map.Entry<String, List<Optics>> closestGroupEntry;
        if (groupGender != null) {
            closestGroupEntry = opticsService.getAllOpticsByGroup(groupName, groupGender);
        } else {
            closestGroupEntry = opticsService.getAllOpticsByGroup(groupName);
        }

        String closestGroup = closestGroupEntry.getKey();
        List<Optics> filteredOptics = closestGroupEntry.getValue();

        List<OpticsAddition> allOpticsAdditions = opticsService.getAllOpticsAddition();
        Map<Long, OpticsAddition> opticsAdditionMap = allOpticsAdditions.stream()
                .collect(Collectors.toMap(addition -> addition.getOptic().getId(), addition -> addition));
        filteredOptics = sortOpticsList(filteredOptics, sortOptics, opticsAdditionMap);

        CaruslGroup selectedGroup = mainPageService.findGroupByName(closestGroup);
        String logoGroup;

        if (groupGender != null) {
            CaruslGroup selectedGroupGender = mainPageService.findGroupByNameGender(closestGroup, groupGender);
            logoGroup = selectedGroupGender != null ? selectedGroupGender.getLogoGroup() : "";
        } else {
            logoGroup = selectedGroup != null ? selectedGroup.getLogoGroup() : "";
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        String currentDate = LocalDate.now().format(dateFormatter);

        double totalQuantity = filteredOptics.stream()
                .mapToDouble(optic -> {
                    OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                    return addition != null ? addition.getQuantity() : 0.0;
                })
                .sum();

        model.addAttribute("groupName", closestGroup);
        model.addAttribute("groupGender", groupGender);
        model.addAttribute("sortOptics", sortOptics);
        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        model.addAttribute("allOpticsByGroup", filteredOptics);
        model.addAttribute("logoGroup", logoGroup);
        model.addAttribute("currentDate", currentDate);
        model.addAttribute("totalQuantity", totalQuantity);
        model.addAttribute("allCategory", mainPageService.getAllCaruslCategory());

        Map<String, List<String>> filterOptions;
        if (groupGender != null) {
            filterOptions = opticsService.getUniqueFilterOptions(null,
                    null,
                    closestGroup,
                    groupGender,
                    false);
        } else {
            filterOptions = opticsService.getUniqueFilterOptions(null,
                    null,
                    closestGroup,
                    null,
                    false);
        }
        if (filterOptions.values().stream().anyMatch(list -> !list.isEmpty())) {
            model.addAttribute("filterOptions", filterOptions);
        }

        return "optics_by_group";
    }

    @GetMapping("/search/{searchQuery}/**")
    public String getAllOpticsBySearch(@PathVariable("searchQuery") String searchQuery,
            @RequestParam(value = "sorting", defaultValue = "new") String sortOptics,
            Model model) {

        List<Optics> filteredOptics = opticsService.searchOpticsBySimilarity(searchQuery);
        List<OpticsAddition> allOpticsAdditions = opticsService.getAllOpticsAddition();
        Map<Long, OpticsAddition> opticsAdditionMap = allOpticsAdditions.stream()
                .collect(Collectors.toMap(addition -> addition.getOptic().getId(), addition -> addition));

        filteredOptics = sortOpticsList(filteredOptics, sortOptics, opticsAdditionMap);

        CaruslGroup selectedGroup = mainPageService.findGroupByName("Пошук");
        String logoGroup = selectedGroup != null ? selectedGroup.getLogoGroup() : "";

        model.addAttribute("searchQuery", searchQuery);
        model.addAttribute("sortOptics", sortOptics);
        model.addAttribute("allOpticsBySearch", filteredOptics);
        model.addAttribute("currentDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        model.addAttribute("logoGroup", logoGroup);
        model.addAttribute("totalQuantity", filteredOptics.stream()
                .mapToDouble(optic -> {
                    OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                    return addition != null ? addition.getQuantity() : 0.0;
                })
                .sum());
        Map<String, List<String>> filterOptions = opticsService.getUniqueFilterOptions(null,
                filteredOptics,
                null,
                null,
                false);
        if (filterOptions.values().stream().anyMatch(list -> !list.isEmpty())) {
            model.addAttribute("filterOptions", filterOptions);
        }

        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        model.addAttribute("allCategory", mainPageService.getAllCaruslCategory());

        return "optics_by_search";
    }

    @GetMapping("/aktsiini_tovary/**")
    public String getAllOpticsByAction(@RequestParam(value = "sorting", defaultValue = "new") String sortOptics,
            Model model) {

        List<Optics> filteredOptics = opticsService.getAllOpticsByAction();
        List<OpticsAddition> allOpticsAdditions = opticsService.getAllOpticsAddition();
        Map<Long, OpticsAddition> opticsAdditionMap = allOpticsAdditions.stream()
                .collect(Collectors.toMap(addition -> addition.getOptic().getId(), addition -> addition));

        filteredOptics = sortOpticsList(filteredOptics, sortOptics, opticsAdditionMap);

        CaruslGroup selectedGroup = mainPageService.findGroupByName("Акційні товари");
        String logoGroup = selectedGroup != null ? selectedGroup.getLogoGroup() : "";

        model.addAttribute("sortOptics", sortOptics);
        model.addAttribute("allOpticsBySearch", filteredOptics);
        model.addAttribute("currentDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        model.addAttribute("logoGroup", logoGroup);
        model.addAttribute("totalQuantity", filteredOptics.stream()
                .mapToDouble(optic -> {
                    OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                    return addition != null ? addition.getQuantity() : 0.0;
                })
                .sum());
        Map<String, List<String>> filterOptions = opticsService.getUniqueFilterOptions(null,
                null,
                null,
                null,
                true);
        if (filterOptions.values().stream().anyMatch(list -> !list.isEmpty())) {
            model.addAttribute("filterOptions", filterOptions);
        }

        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        model.addAttribute("allCategory", mainPageService.getAllCaruslCategory());

        return "optics_by_action";
    }

    // Products

    @GetMapping("/products/{productName}/**")
    public String getProducts(@PathVariable("productName") String productName,
            Model model,
            HttpSession session,
            HttpServletRequest request) {

        Map.Entry<String, List<Optics>> closestProductEntry = opticsService.getAllOpticsByProduct(productName);
        String closestProduct = closestProductEntry.getKey();
        List<Optics> filteredOptics = closestProductEntry.getValue();

        List<Optics> identicalOptics = opticsService.getIdenticalOptics(closestProduct);
        List<Optics> similarOptics = opticsService.findSimilarOptics(identicalOptics);

        String productGender = identicalOptics.isEmpty() ? null : identicalOptics.get(0).getGender();
        String productСategory = identicalOptics.isEmpty() ? null : identicalOptics.get(0).getCategory();
        productСategory = productСategory != null ? productСategory.toUpperCase() : null;
        productGender = productGender != null ? productGender.toUpperCase() : null;
        closestProduct = closestProduct.replaceAll("^[^a-zA-Z]*", "");

        List<Rating> allRatings = ratingLikeDisService.getAllRating();
        List<LikeDislike> allLikeDislike = ratingLikeDisService.getAllLikeDislike();

        Map<String, Long> likeCounts = new HashMap<>();
        Map<String, Long> dislikeCounts = new HashMap<>();
        for (Rating rating : allRatings) {
            String ratingId = String.valueOf(rating.getId());
            long likeCount = allLikeDislike.stream()
                    .filter(ld -> ld.getRating().getId().equals(rating.getId()) && Boolean.TRUE.equals(ld.getLiked()))
                    .count();
            long dislikeCount = allLikeDislike.stream()
                    .filter(ld -> ld.getRating().getId().equals(rating.getId())
                            && Boolean.TRUE.equals(ld.getDisliked()))
                    .count();
            likeCounts.put(ratingId, likeCount);
            dislikeCounts.put(ratingId, dislikeCount);
        }

        // Session
        boolean isGet = "GET".equalsIgnoreCase(request.getMethod());

        Map<String, String> idToTokenRatingMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenRatingMap",
                () -> ratingLikeDisService.getAllRating(),
                Rating::getId);
        Map<String, String> idToTokenRatingGlobalMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenRatingGlobalMap",
                () -> ratingLikeDisService.getAllRatingGlobal(),
                RatingGlobal::getId);
        Map<String, String> idToTokenQuestionAnswerMap = sessionTokenManager.initTokenMap(
                session,
                isGet,
                "idToTokenQuestionAnswerMap",
                () -> ratingLikeDisService.getAllQuestionAnswer(),
                QuestionAnswer::getId);

        List<OpticsAddition> allOpticsAdditions = opticsService.getAllOpticsAddition();

        Map<Long, OpticsAddition> opticsAdditionMap = allOpticsAdditions.stream()
                .collect(Collectors.toMap(addition -> addition.getOptic().getId(), addition -> addition));

        double totalQuantity = filteredOptics.stream()
                .mapToDouble(optic -> {
                    OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                    return addition != null ? addition.getQuantity() : 0.0;
                })
                .sum();

        model.addAttribute("allQuestionAnswer", ratingLikeDisService.getAllQuestionAnswer());
        model.addAttribute("allQuestionAnswerByClient", ratingLikeDisService.getAllQuestionAnswerByClient());

        model.addAttribute("allRating", allRatings);
        model.addAttribute("allRatingAverage", ratingLikeDisService.getAllRatingAverage());
        model.addAttribute("allRatingByClient", ratingLikeDisService.getAllRatingByClient());
        model.addAttribute("allLikeDislike", allLikeDislike);
        model.addAttribute("idToTokenRatingMap", idToTokenRatingMap);

        model.addAttribute("allRatingGlobal", ratingLikeDisService.getAllRatingGlobal());
        model.addAttribute("allRatingGlobalAverage", ratingLikeDisService.getAllRatingGlobalAverage());
        model.addAttribute("allRatingGlobalByClient", ratingLikeDisService.getAllRatingGlobalByClient());
        model.addAttribute("idToTokenRatingGlobalMap", idToTokenRatingGlobalMap);
        model.addAttribute("idToTokenQuestionAnswerMap", idToTokenQuestionAnswerMap);

        model.addAttribute("allOpticsByProduct", filteredOptics);
        model.addAttribute("allOpticsIdentical", identicalOptics);
        model.addAttribute("allSimilarOptics", similarOptics);

        model.addAttribute("allCategory", mainPageService.getAllCaruslCategory());
        model.addAttribute("allOptics", opticsService.getAllOptics());

        model.addAttribute("productName", closestProduct);
        model.addAttribute("productСategory", productСategory);
        model.addAttribute("productGender", productGender);
        model.addAttribute("totalQuantity", totalQuantity);

        model.addAttribute("likeCounts", likeCounts);
        model.addAttribute("dislikeCounts", dislikeCounts);

        return "products";
    }

    private List<Optics> sortOpticsList(List<Optics> opticsList, String sortOptics,
            Map<Long, OpticsAddition> opticsAdditionMap) {
        switch (sortOptics) {
            case "new":
                return opticsList.stream()
                        .sorted(Comparator.comparing(Optics::getId).reversed())
                        .collect(Collectors.toList());
            case "promotional":
                return opticsList.stream()
                        .sorted(Comparator.comparing((Optics optic) -> {
                            OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                            return addition != null && addition.getAction() > 0 ? 0 : 1;
                        }))
                        .collect(Collectors.toList());
            case "top":
                return opticsList.stream()
                        .sorted(Comparator.comparing((Optics optic) -> {
                            OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                            return addition != null && Boolean.TRUE.equals(addition.getTop()) ? 0 : 1;
                        }))
                        .collect(Collectors.toList());
            case "cheaper":
                return opticsList.stream()
                        .sorted(Comparator.comparing((Optics optic) -> {
                            OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                            double retailPrice = optic.getRetailPrice();
                            double discount = (addition != null && addition.getAction() > 0)
                                    ? addition.getAction() / 100
                                    : 0.0;
                            return retailPrice * (1 - discount);
                        }, Comparator.nullsLast(Double::compareTo)))
                        .collect(Collectors.toList());
            case "expensive":
                return opticsList.stream()
                        .sorted(Comparator.comparing((Optics optic) -> {
                            OpticsAddition addition = opticsAdditionMap.get(optic.getId());
                            double retailPrice = optic.getRetailPrice();
                            double discount = (addition != null && addition.getAction() > 0)
                                    ? addition.getAction() / 100
                                    : 0.0;
                            return retailPrice * (1 - discount);
                        }, Comparator.nullsLast(Double::compareTo)).reversed())
                        .collect(Collectors.toList());
            case "alphabetical":
                return opticsList.stream()
                        .sorted(Comparator.comparing(Optics::getShortName,
                                Comparator.nullsLast(String::compareToIgnoreCase)))
                        .collect(Collectors.toList());
            default:
                return opticsList;
        }
    }
}
