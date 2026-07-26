package com.optics_store.optics.cache;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.github.benmanes.caffeine.cache.Cache;
import com.optics_store.optics.cache.cache_addit.CacheFactory;
import com.optics_store.optics.cache.cache_addit.CacheKey;
import com.optics_store.optics.cache.cache_addit.ImmutableListCache;
import com.optics_store.optics.cache.cache_addit.RefreshableCache;
import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.OpticsAddition;
import com.optics_store.optics.repository.OpticsAdditRepos;
import com.optics_store.optics.repository.OpticsRepos;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
/**
 * Multi-level caching system for the Optics Catalog.
 * Stores product details, brand lists, and category hierarchies in-memory to
 * accelerate the faceted search and dynamic filtering features on the
 * Front-end.
 */
public class OpticsCacheManager implements RefreshableCache {

    // Data Loading

    private final OpticsRepos opticsRepos;
    private final OpticsAdditRepos opticsAdditRepos;

    // Cache

    @Override
    /**
     * Synchronizes the in-memory catalog cache with the underlying SQL storage to
     * keep product availability, specifications, and pricing up-to-date.
     */
    public void refreshCache() {
        try {
            List<Optics> opticsList = opticsRepos.findAll();
            List<OpticsAddition> additions = opticsAdditRepos.findAll();

            if (opticsList == null || additions == null) {
                log.warn("Попередження: база повернула null. Кеш не оновлено.");
                return;
            }

            opticsCache.put(Keys.ALL, opticsList);
            opticsAdditionsCache.put(Keys.ALL, additions);

            allBrandsCache.put(Keys.BRANDS, opticsList.stream()
                    .map(Optics::getBrand)
                    .filter(b -> b != null && !b.isEmpty())
                    .distinct()
                    .collect(Collectors.toList()));

            allGroupsCache.put(Keys.GROUPS, opticsList.stream()
                    .map(Optics::getCategory)
                    .filter(g -> g != null && !g.isEmpty())
                    .distinct()
                    .collect(Collectors.toList()));

            allProductsCache.put(Keys.PRODUCTS, opticsList.stream()
                    .map(Optics::getFullName)
                    .filter(p -> p != null && !p.isEmpty())
                    .distinct()
                    .collect(Collectors.toList()));

            opticsWithActionCache.put(Keys.WITH_ACTION, opticsList.stream()
                    .filter(optic -> optic.getOpticsAddition() != null
                            && optic.getOpticsAddition().getAction() != null
                            && optic.getOpticsAddition().getAction() > 0)
                    .collect(Collectors.toList()));

            clearAllSimilarityCaches();

        } catch (Exception e) {
            log.error("Помилка під час оновлення кешу", e);
        }
    }

    // Cache

    public static class Keys {
        public static final String ALL = "all";
        public static final String BRANDS = "brands";
        public static final String GROUPS = "groups";
        public static final String PRODUCTS = "products";
        public static final String WITH_ACTION = "withAction";
    }

    public final ImmutableListCache<String, Optics> opticsCache;
    public final ImmutableListCache<String, OpticsAddition> opticsAdditionsCache;
    public final ImmutableListCache<String, Optics> opticsWithActionCache;

    public final ImmutableListCache<String, String> allBrandsCache;
    public final ImmutableListCache<String, String> allGroupsCache;
    public final ImmutableListCache<String, String> allProductsCache;

    public final Cache<String, String> brandSimilarityCache;
    public final Cache<String, String> groupSimilarityCache;
    public final Cache<String, String> productSimilarityCache;

    public final Cache<CacheKey, List<String>> distinctValuesCache;
    public final Cache<CacheKey, Map<String, List<String>>> uniqueFilterOptionsCache;

    public OpticsCacheManager(
            OpticsRepos opticsRepos,
            OpticsAdditRepos opticsAdditRepos,
            MeterRegistry registry) {
        this.opticsRepos = opticsRepos;
        this.opticsAdditRepos = opticsAdditRepos;

        this.opticsCache = CacheFactory.newListCache(registry, "opticsCache", 1, 30, TimeUnit.MINUTES);
        this.opticsAdditionsCache = CacheFactory.newListCache(registry, "opticsAdditionsCache", 1, 30,
                TimeUnit.MINUTES);
        this.opticsWithActionCache = CacheFactory.newListCache(registry, "opticsWithActionCache", 1, 30,
                TimeUnit.MINUTES);

        this.allBrandsCache = CacheFactory.newListCache(registry, "allBrandsCache", 1, 12, TimeUnit.HOURS);
        this.allGroupsCache = CacheFactory.newListCache(registry, "allGroupsCache", 1, 12, TimeUnit.HOURS);
        this.allProductsCache = CacheFactory.newListCache(registry, "allProductsCache", 1, 24, TimeUnit.HOURS);

        this.brandSimilarityCache = CacheFactory.newCache(registry, "brandSimilarityCache", 100, 2, TimeUnit.HOURS,
                CacheFactory.Expire.AFTER_ACCESS);
        this.groupSimilarityCache = CacheFactory.newCache(registry, "groupSimilarityCache", 50, 2, TimeUnit.HOURS,
                CacheFactory.Expire.AFTER_ACCESS);
        this.productSimilarityCache = CacheFactory.newCache(registry, "productSimilarityCache", 1000, 2, TimeUnit.HOURS,
                CacheFactory.Expire.AFTER_ACCESS);

        this.distinctValuesCache = CacheFactory.newCache(registry, "distinctValuesCache", 1000, 1, TimeUnit.HOURS,
                CacheFactory.Expire.AFTER_ACCESS);
        this.uniqueFilterOptionsCache = CacheFactory.newCache(registry, "uniqueFilterOptionsCache", 500, 4,
                TimeUnit.HOURS, CacheFactory.Expire.AFTER_WRITE);
    }

    // Cache Monitoring & Functions

    public void clearAllSimilarityCaches() {
        brandSimilarityCache.invalidateAll();
        groupSimilarityCache.invalidateAll();
        productSimilarityCache.invalidateAll();
        distinctValuesCache.invalidateAll();
        uniqueFilterOptionsCache.invalidateAll();
    }

    public void clearAll() {
        opticsCache.invalidateAll();
        opticsAdditionsCache.invalidateAll();
        opticsWithActionCache.invalidateAll();
        allBrandsCache.invalidateAll();
        allGroupsCache.invalidateAll();
        allProductsCache.invalidateAll();
        clearAllSimilarityCaches();
    }

    // All Data

    /**
     * Catalog data accessors.
     * Provide instant access to product lists, brands, and categories, supporting
     * dynamic UI state changes immediately upon user interaction.
     */
    public List<Optics> getAllOptics() {
        return opticsCache.get(
                Keys.ALL,
                _ -> opticsRepos.findAll());
    }

    public List<OpticsAddition> getAllOpticsAdditions() {
        return opticsAdditionsCache.get(
                Keys.ALL,
                _ -> opticsAdditRepos.findAll());
    }

    public List<Optics> getAllOpticsWithAction() {
        return opticsWithActionCache.get(
                Keys.WITH_ACTION,
                _ -> getAllOptics().stream()
                        .filter(optic -> optic.getOpticsAddition() != null
                                && optic.getOpticsAddition().getAction() != null
                                && optic.getOpticsAddition().getAction() > 0)
                        .collect(Collectors.toList()));
    }

    public List<String> getAllBrands() {
        return allBrandsCache.get(
                Keys.BRANDS,
                _ -> getAllOptics().stream()
                        .map(Optics::getBrand)
                        .filter(b -> b != null && !b.isEmpty())
                        .distinct()
                        .collect(Collectors.toList()));
    }

    public List<String> getAllGroups() {
        return allGroupsCache.get(
                Keys.GROUPS,
                _ -> getAllOptics().stream()
                        .map(Optics::getCategory)
                        .filter(g -> g != null && !g.isEmpty())
                        .distinct()
                        .collect(Collectors.toList()));
    }

    public List<String> getAllProducts() {
        return allProductsCache.get(
                Keys.PRODUCTS,
                _ -> getAllOptics().stream()
                        .map(Optics::getFullName)
                        .filter(p -> p != null && !p.isEmpty())
                        .distinct()
                        .collect(Collectors.toList()));
    }

    // Find by ID

    public Optional<Optics> findOpticsById(Long id) {
        List<Optics> list = getAllOptics();
        if (list == null)
            return Optional.empty();
        return list.stream()
                .filter(q -> q.getId().equals(id))
                .findFirst();
    }
}
