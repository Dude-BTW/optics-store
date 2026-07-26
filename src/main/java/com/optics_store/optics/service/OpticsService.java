package com.optics_store.optics.service;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;

import com.optics_store.optics.cache.OpticsCacheManager;
import com.optics_store.optics.cache.OpticsCacheManager.Keys;
import com.optics_store.optics.cache.cache_addit.CacheKey;
import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.OpticsAddition;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Core business logic for the Optics Catalog.
 * Powers the dynamic faceted search, live search mechanisms, and product
 * recommendations described in the platform architecture.
 * Deeply integrated with the Caffeine multi-level caching system to ensure
 * instant UI updates.
 */
public class OpticsService {

    private final OpticsCacheManager cache;

    @PersistenceContext
    private EntityManager entityManager;

    // Optics & OpticsAddition

    public List<Optics> getAllOptics() {
        return cache.getAllOptics();
    }

    public Optics getOpticsById(Long id) {
        return cache.findOpticsById(id).orElse(null);
    }

    public List<OpticsAddition> getAllOpticsAddition() {
        return cache.opticsAdditionsCache.getIfPresent(Keys.ALL);
    }

    public List<Optics> getAllOpticsByAction() {
        return cache.getAllOpticsWithAction();
    }

    /**
     * Retrieves unique attributes (e.g., brands, materials, genders) directly from
     * the cached catalog.
     * Used to dynamically populate the sidebar filters (faceted search) on the
     * Brand Catalog Page.
     */
    public List<String> getDistinctValues(String fieldName) {
        CacheKey key = new CacheKey("distinctValues", Map.of("field", fieldName));

        return cache.distinctValuesCache.get(key, _ -> {
            List<Optics> opticsList = cache.getAllOptics();
            if (opticsList == null)
                return List.of();

            return opticsList.stream()
                    .map(optics -> {
                        switch (fieldName) {
                            case "brand":
                                return optics.getBrand();
                            case "manufacturer":
                                return optics.getManufacturer();
                            case "group":
                                return optics.getCategory();
                            case "gender":
                                return optics.getGender();
                            case "country":
                                return optics.getCountry();
                            case "material":
                                return optics.getMaterial();
                            case "eyeglass":
                                return optics.getEyeglass();
                            case "polarization":
                                return optics.getPolarization();

                            case "brandFrame":
                                return "оправи для окулярів".equals(optics.getCategory()) ? optics.getBrand() : null;
                            case "brandGlasses":
                                return "Окуляри сонцезахисні".equals(optics.getCategory()) ? optics.getBrand() : null;
                            case "manufacturerFrame":
                                return "оправи для окулярів".equals(optics.getCategory()) ? optics.getManufacturer()
                                        : null;
                            case "manufacturerGlasses":
                                return "Окуляри сонцезахисні".equals(optics.getCategory()) ? optics.getManufacturer()
                                        : null;
                            case "countryFrame":
                                return "оправи для окулярів".equals(optics.getCategory()) ? optics.getCountry() : null;
                            case "countryGlasses":
                                return "Окуляри сонцезахисні".equals(optics.getCategory()) ? optics.getCountry() : null;
                            case "materialFrame":
                                return "оправи для окулярів".equals(optics.getCategory()) ? optics.getMaterial() : null;
                            case "materialGlasses":
                                return "Окуляри сонцезахисні".equals(optics.getCategory()) ? optics.getMaterial()
                                        : null;
                            case "genderFrame":
                                return "оправи для окулярів".equals(optics.getCategory()) ? optics.getGender() : null;
                            case "genderGlasses":
                                return "оправи для окулярів".equals(optics.getCategory()) ? optics.getGender() : null;
                            case "eyeglassGlasses":
                                return "Окуляри сонцезахисні".equals(optics.getCategory()) ? optics.getEyeglass()
                                        : null;
                            default:
                                return "";
                        }
                    })
                    .filter(value -> value != null && !value.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());
        });
    }

    // Get Unique Filter Options

    private String normalizeKeyComponent(String value) {
        return (value == null || value.trim().isEmpty()) ? "none" : value.trim();
    }

    /**
     * Calculates available filtering options dynamically based on the current user
     * selection.
     * Updates the UI state of checkboxes and product grid seamlessly without full
     * page reloads.
     */
    public Map<String, List<String>> getUniqueFilterOptions(String brandName, List<Optics> customOptics,
            String groupName, String groupGender, Boolean promotionExists) {
        if (customOptics != null)
            return computeUniqueFilterOptions(customOptics);

        Map<String, String> params = Map.of(
                "brand", normalizeKeyComponent(brandName),
                "group", normalizeKeyComponent(groupName),
                "gender", normalizeKeyComponent(groupGender),
                "promo", promotionExists != null ? promotionExists.toString() : "none");

        CacheKey key = new CacheKey("filterOptions", params);

        return cache.uniqueFilterOptionsCache.get(key, _ -> {
            List<Optics> allOptics = getAllOptics();
            Stream<Optics> opticsStream = allOptics != null ? allOptics.stream() : Stream.empty();

            if (!params.get("brand").equals("none")) {
                opticsStream = opticsStream.filter(optic -> params.get("brand").equals(optic.getBrand()));
            }
            if (!params.get("group").equals("none")) {
                opticsStream = opticsStream.filter(optic -> params.get("group").equals(optic.getCategory()));
            }
            if (!params.get("gender").equals("none")) {
                opticsStream = opticsStream.filter(optic -> params.get("gender").equals(optic.getGender()));
            }
            if (Boolean.TRUE.toString().equals(params.get("promo"))) {
                opticsStream = opticsStream.filter(optic -> optic.getOpticsAddition() != null
                        && optic.getOpticsAddition().getAction() != null
                        && optic.getOpticsAddition().getAction() > 0);
            }

            return computeUniqueFilterOptions(opticsStream.collect(Collectors.toList()));
        });
    }

    private Map<String, List<String>> computeUniqueFilterOptions(List<Optics> filteredOptics) {
        Map<String, List<String>> filterOptions = new HashMap<>();
        Function<Stream<String>, List<String>> distinctSortedCleaned = stream -> stream
                .filter(value -> value != null && !value.isEmpty() && !"-".equals(value))
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        Map<String, Function<Optics, String>> opticsFields = Map.of(
                "brand", Optics::getBrand,
                "manufacturer", Optics::getManufacturer,
                "group", Optics::getCategory,
                "gender", Optics::getGender,
                "country", Optics::getCountry,
                "material", Optics::getMaterial,
                "eyeglass", Optics::getEyeglass,
                "polarization", Optics::getPolarization);

        opticsFields.forEach((key, getter) -> filterOptions.put(key,
                distinctSortedCleaned.apply(filteredOptics.stream().map(getter))));

        List<OpticsAddition> filteredOpticsAdditions = filteredOptics.stream()
                .map(Optics::getOpticsAddition)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Map<String, Function<OpticsAddition, String>> additionFields = Map.ofEntries(
                Map.entry("colorName1", OpticsAddition::getColorName1),
                Map.entry("colorName2", OpticsAddition::getColorName2),
                Map.entry("frameShape", OpticsAddition::getFrameShape),
                Map.entry("faceShape", OpticsAddition::getFaceShape),
                Map.entry("frameType", OpticsAddition::getFrameType),
                Map.entry("eyepieceSize", OpticsAddition::getEyepieceSize),
                Map.entry("earringSize", OpticsAddition::getEarringSize),
                Map.entry("bridgeSize", OpticsAddition::getBridgeSize),
                Map.entry("photochrome", OpticsAddition::getPhotochrome),
                Map.entry("collection", OpticsAddition::getCollection),
                Map.entry("properties", OpticsAddition::getProperties),
                Map.entry("clipOn", OpticsAddition::getClipOn));

        additionFields.forEach((key, getter) -> filterOptions.put(key,
                distinctSortedCleaned.apply(filteredOpticsAdditions.stream().map(getter))));

        return filterOptions;
    }

    public Map<String, List<String>> getGroupedFieldValuesAlphabetically(String fieldName) {
        List<Optics> opticsList = cache.getAllOptics();
        if (opticsList == null)
            return Map.of();

        Function<Optics, String> getter;

        switch (fieldName) {
            case "brand":
                getter = Optics::getBrand;
                break;
            case "manufacturer":
                getter = Optics::getManufacturer;
                break;
            case "category":
                getter = Optics::getCategory;
                break;
            case "gender":
                getter = Optics::getGender;
                break;
            case "country":
                getter = Optics::getCountry;
                break;
            case "material":
                getter = Optics::getMaterial;
                break;
            case "eyeglass":
                getter = Optics::getEyeglass;
                break;
            case "polarization":
                getter = Optics::getPolarization;
                break;
            case "fullName":
                getter = Optics::getFullName;
                break;
            case "shortName":
                getter = Optics::getShortName;
                break;
            default:
                return Map.of();
        }

        return opticsList.stream()
                .map(getter)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .sorted(String::compareToIgnoreCase)
                .collect(Collectors.groupingBy(
                        s -> s.substring(0, 1).toUpperCase(),
                        TreeMap::new,
                        Collectors.toList()));
    }

    // Brand

    /**
     * Typo tolerance and auto-correction algorithms.
     * Uses Levenshtein distance calculations to find the closest matching brand,
     * group, or product name if the user makes a typo during search or routing.
     */
    public String findClosestBrand(String brandName) {
        return cache.brandSimilarityCache.get(brandName, name -> {
            List<String> brands = cache.getAllBrands();
            if (brands == null || brands.isEmpty())
                return name;

            LevenshteinDistance levenshtein = new LevenshteinDistance(Integer.MAX_VALUE);
            String closestBrand = null;
            int minDistance = Integer.MAX_VALUE;

            for (String brand : brands) {
                int distance = levenshtein.apply(name.toLowerCase(), brand.toLowerCase());
                if (distance < minDistance) {
                    minDistance = distance;
                    closestBrand = brand;
                }
            }

            return closestBrand != null ? closestBrand : name;
        });
    }

    public Map.Entry<String, List<Optics>> getAllOpticsByCategory(String brandName) {
        String closestBrand = findClosestBrand(brandName);
        List<Optics> opticsList = cache.getAllOptics();

        if (opticsList == null)
            return new AbstractMap.SimpleEntry<>(closestBrand, List.of());

        List<Optics> filtered = opticsList.stream()
                .filter(optic -> closestBrand.equalsIgnoreCase(optic.getBrand()))
                .collect(Collectors.toList());

        return new AbstractMap.SimpleEntry<>(closestBrand, filtered);
    }

    // Group

    public String findClosestGroup(String groupName) {
        return cache.groupSimilarityCache.get(groupName, name -> {
            List<String> groups = cache.getAllGroups();
            if (groups == null || groups.isEmpty())
                return name;

            LevenshteinDistance levenshtein = new LevenshteinDistance(Integer.MAX_VALUE);
            String closestGroup = null;
            int minDistance = Integer.MAX_VALUE;

            for (String group : groups) {
                int distance = levenshtein.apply(name.toLowerCase(), group.toLowerCase());
                if (distance < minDistance) {
                    minDistance = distance;
                    closestGroup = group;
                }
            }

            return closestGroup != null ? closestGroup : name;
        });
    }

    public Map.Entry<String, List<Optics>> getAllOpticsByGroup(String groupName) {
        String closestGroup = findClosestGroup(groupName);
        List<Optics> opticsList = cache.getAllOptics();

        if (opticsList == null)
            return new AbstractMap.SimpleEntry<>(closestGroup, List.of());

        List<Optics> filtered = opticsList.stream()
                .filter(optic -> closestGroup.equalsIgnoreCase(optic.getCategory()))
                .collect(Collectors.toList());

        return new AbstractMap.SimpleEntry<>(closestGroup, filtered);
    }

    public Map.Entry<String, List<Optics>> getAllOpticsByGroup(String groupName, String groupGender) {
        String closestGroup = findClosestGroup(groupName);
        List<Optics> opticsList = cache.getAllOptics();

        if (opticsList == null)
            return new AbstractMap.SimpleEntry<>(closestGroup, List.of());

        List<Optics> filtered = opticsList.stream()
                .filter(optic -> closestGroup.equalsIgnoreCase(optic.getCategory()))
                .filter(optic -> groupGender.equalsIgnoreCase(optic.getGender()))
                .collect(Collectors.toList());

        return new AbstractMap.SimpleEntry<>(closestGroup, filtered);
    }

    // Product

    public String findClosestProduct(String productName) {
        return cache.productSimilarityCache.get(productName, name -> {
            List<String> products = cache.getAllProducts();
            if (products == null || products.isEmpty())
                return name;

            LevenshteinDistance levenshtein = new LevenshteinDistance(Integer.MAX_VALUE);
            String closestProduct = null;
            int minDistance = Integer.MAX_VALUE;

            for (String product : products) {
                int distance = levenshtein.apply(name.toLowerCase(), product.toLowerCase());
                if (distance < minDistance) {
                    minDistance = distance;
                    closestProduct = product;
                }
            }

            return closestProduct != null ? closestProduct : name;
        });
    }

    public Map.Entry<String, List<Optics>> getAllOpticsByProduct(String productName) {
        String closestProduct = findClosestProduct(productName);
        List<Optics> opticsList = cache.getAllOptics();

        if (opticsList == null)
            return new AbstractMap.SimpleEntry<>(closestProduct, List.of());

        List<Optics> filtered = opticsList.stream()
                .filter(optic -> closestProduct.equalsIgnoreCase(optic.getFullName()))
                .collect(Collectors.toList());

        return new AbstractMap.SimpleEntry<>(closestProduct, filtered);
    }

    public List<Optics> getIdenticalOptics(String productName) {
        List<Optics> opticsList = cache.getAllOptics();
        if (opticsList == null || productName == null || !productName.contains(" "))
            return List.of();

        String trimmedName = productName.substring(0, productName.lastIndexOf(" "));

        return opticsList.stream()
                .filter(optic -> {
                    String fullName = optic.getFullName();
                    if (fullName == null || !fullName.contains(" "))
                        return false;
                    String opticTrimmedName = fullName.substring(0, fullName.lastIndexOf(" "));
                    return opticTrimmedName.equalsIgnoreCase(trimmedName);
                })
                .sorted((optic1, optic2) -> {
                    if (optic1.getFullName().equalsIgnoreCase(productName))
                        return -1;
                    if (optic2.getFullName().equalsIgnoreCase(productName))
                        return 1;
                    return 0;
                })
                .collect(Collectors.toList());
    }

    public String getProductNameByOpticId(Long opticId) {
        Optics optics = getOpticsById(opticId);
        if (optics != null) {
            return transliterate(optics.getFullName());
        }
        return null;
    }

    private static final Map<Character, String> TRANSLITERATION_MAP = Map.ofEntries(
            Map.entry('а', "a"), Map.entry('б', "b"), Map.entry('в', "v"), Map.entry('г', "h"),
            Map.entry('д', "d"), Map.entry('е', "e"), Map.entry('є', "ie"), Map.entry('ж', "zh"),
            Map.entry('з', "z"), Map.entry('и', "y"), Map.entry('і', "i"), Map.entry('ї', "i"),
            Map.entry('й', "i"), Map.entry('к', "k"), Map.entry('л', "l"), Map.entry('м', "m"),
            Map.entry('н', "n"), Map.entry('о', "o"), Map.entry('п', "p"), Map.entry('р', "r"),
            Map.entry('с', "s"), Map.entry('т', "t"), Map.entry('у', "u"), Map.entry('ф', "f"),
            Map.entry('х', "kh"), Map.entry('ц', "ts"), Map.entry('ч', "ch"), Map.entry('ш', "sh"),
            Map.entry('щ', "shch"), Map.entry('ю', "iu"), Map.entry('я', "ia"), Map.entry('ь', ""),
            Map.entry('ъ', ""), Map.entry(',', ""), Map.entry(' ', "-"));

    private String transliterate(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "";
        }

        StringBuilder transliterated = new StringBuilder();
        for (char c : fullName.toLowerCase().toCharArray()) {
            transliterated.append(TRANSLITERATION_MAP.getOrDefault(c, String.valueOf(c)));
        }

        return transliterated.toString();
    }

    // Search Optics

    /**
     * Live Search and Recommendation Engine.
     * Implements token matching and Levenshtein scoring to instantly render search
     * results in the dropdown list.
     * Analyzes product attributes (brand, material, polarization) to populate the
     * "Similar products" carousel.
     */
    public List<Optics> searchOpticsBySimilarity(String query) {
        if (query == null || query.trim().isEmpty())
            return List.of();

        List<Optics> opticsList = cache.getAllOptics();
        if (opticsList == null || opticsList.isEmpty())
            return List.of();

        String normalizedQuery = query.trim().toLowerCase();
        List<String> queryTokens = List.of(normalizedQuery.split("\\s+"));

        LevenshteinDistance levenshtein = new LevenshteinDistance(Integer.MAX_VALUE);

        return opticsList.stream()
                .map(optic -> new AbstractMap.SimpleEntry<>(optic,
                        calculateMatchScore(queryTokens, optic.getFullName(), levenshtein)))
                .filter(entry -> entry.getValue() > 0.5)
                .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private double calculateMatchScore(List<String> queryTokens, String fullName, LevenshteinDistance levenshtein) {
        if (fullName == null || fullName.isEmpty())
            return 0.0;

        String normalizedName = fullName.toLowerCase();
        List<String> nameTokens = List.of(normalizedName.split("\\s+"));

        long matches = queryTokens.stream()
                .filter(q -> nameTokens.stream().anyMatch(n -> n.contains(q) || q.contains(n)))
                .count();

        double tokenMatchScore = (double) matches / queryTokens.size();

        int distance = levenshtein.apply(String.join(" ", queryTokens), normalizedName);
        double levenshteinScore = 1.0 - (double) distance / Math.max(normalizedName.length(), 1);

        return 0.7 * tokenMatchScore + 0.3 * levenshteinScore;
    }

    // Find Similar Optics

    public List<Optics> findSimilarOptics(List<Optics> opticsList) {
        Set<Optics> allResults = new HashSet<>();
        Set<Long> excludedIds = new HashSet<>();
        for (Optics optic : opticsList) {
            excludedIds.add(optic.getId());
        }

        for (Optics currentOptic : opticsList) {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Optics> cq = cb.createQuery(Optics.class);
            Root<Optics> opticsRoot = cq.from(Optics.class);

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(opticsRoot.get("category"), currentOptic.getCategory()));
            predicates.add(cb.equal(opticsRoot.get("gender"), currentOptic.getGender()));

            Double price = currentOptic.getRetailPrice();
            if (price != null) {
                predicates.add(cb.between(opticsRoot.get("retailPrice"), price * 0.85, price * 1.15));
            }

            predicates.add(cb.not(opticsRoot.get("id").in(excludedIds)));

            cq.select(opticsRoot).where(cb.and(predicates.toArray(new Predicate[0])));
            List<Optics> filtered = entityManager.createQuery(cq).getResultList();

            List<Optics> sorted = filtered.stream()
                    .sorted((a, b) -> Integer.compare(
                            calculateSimilarityScore(currentOptic, b),
                            calculateSimilarityScore(currentOptic, a)))
                    .limit(10)
                    .toList();

            allResults.addAll(sorted);
        }

        List<Optics> sortedAllResults = new ArrayList<>(allResults);
        sortedAllResults.sort((a, b) -> Long.compare(a.getId(), b.getId()));

        return sortedAllResults;
    }

    private int calculateSimilarityScore(Optics base, Optics candidate) {
        int score = 0;

        if (Objects.equals(base.getBrand(), candidate.getBrand()))
            score += 3;
        if (Objects.equals(base.getMaterial(), candidate.getMaterial()))
            score += 2;
        if (Objects.equals(base.getPolarization(), candidate.getPolarization()))
            score += 1;

        OpticsAddition a = base.getOpticsAddition();
        OpticsAddition b = candidate.getOpticsAddition();
        if (a != null && b != null) {
            if (Objects.equals(a.getFrameShape(), b.getFrameShape()))
                score += 2;
            if (Objects.equals(a.getFrameType(), b.getFrameType()))
                score += 2;
            if (Objects.equals(a.getColorName1(), b.getColorName1())
                    || Objects.equals(a.getColorName1(), b.getColorName2()))
                score += 1;
            if (Objects.equals(a.getPhotochrome(), b.getPhotochrome()))
                score += 1;
            if (Objects.equals(a.getClipOn(), b.getClipOn()))
                score += 1;
        }

        return score;
    }
}
