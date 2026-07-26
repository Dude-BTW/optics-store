package com.optics_store.optics.cache;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.optics_store.optics.cache.cache_addit.CacheFactory;
import com.optics_store.optics.cache.cache_addit.ImmutableListCache;
import com.optics_store.optics.cache.cache_addit.RefreshableCache;
import com.optics_store.optics.entity.main_page.CardNavbar1;
import com.optics_store.optics.entity.main_page.CardNavbar2;
import com.optics_store.optics.entity.main_page.CardOptics1;
import com.optics_store.optics.entity.main_page.CardOptics2;
import com.optics_store.optics.entity.main_page.CardOptics3;
import com.optics_store.optics.entity.main_page.CaruslCategory;
import com.optics_store.optics.entity.main_page.CaruslGroup;
import com.optics_store.optics.entity.main_page.SliderImages1;
import com.optics_store.optics.repository.rep_main_page.CardNavbar1Repos;
import com.optics_store.optics.repository.rep_main_page.CardNavbar2Repos;
import com.optics_store.optics.repository.rep_main_page.CardOptics1Repos;
import com.optics_store.optics.repository.rep_main_page.CardOptics2Repos;
import com.optics_store.optics.repository.rep_main_page.CardOptics3Repos;
import com.optics_store.optics.repository.rep_main_page.CaruslCategoryRepos;
import com.optics_store.optics.repository.rep_main_page.CaruslGroupRepos;
import com.optics_store.optics.repository.rep_main_page.SliderImages1Repos;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
/**
 * Multi-level caching system for the Home Page components.
 * Uses the Caffeine library to store UI data (hero banners, carousels, navbars)
 * in-memory, drastically reducing database load during client request
 * processing.
 */
public class MPageCacheManager implements RefreshableCache {

    // Data Loading

    private final CardNavbar1Repos cardNavbar1Repos;
    private final CardNavbar2Repos cardNavbar2Repos;

    private final CardOptics1Repos cardOptics1Repos;
    private final CardOptics2Repos cardOptics2Repos;
    private final CardOptics3Repos cardOptics3Repos;

    private final CaruslCategoryRepos caruslCategoryRepos;
    private final CaruslGroupRepos caruslGroupRepos;
    private final SliderImages1Repos sliderImages1Repos;

    // Cache

    @Override
    /**
     * Fetches fresh UI component data from the SQL storage and seamlessly updates
     * the in-memory cache in the background.
     */
    public void refreshCache() {
        try {
            List<CardNavbar1> cardNavbar1List = cardNavbar1Repos.findAll();
            List<CardNavbar2> cardNavbar2List = cardNavbar2Repos.findAll();

            List<CardOptics1> cardOptics1List = cardOptics1Repos.findAll();
            List<CardOptics2> cardOptics2List = cardOptics2Repos.findAll();
            List<CardOptics3> cardOptics3List = cardOptics3Repos.findAll();

            List<CaruslCategory> caruslCategoryList = caruslCategoryRepos.findAll();
            List<CaruslGroup> caruslGroupList = caruslGroupRepos.findAll();
            List<SliderImages1> sliderImages1List = sliderImages1Repos.findAll();

            if (cardNavbar1List == null || cardNavbar2List == null || cardOptics1List == null || cardOptics2List == null
                    || cardOptics3List == null || caruslCategoryList == null || caruslGroupList == null
                    || sliderImages1List == null) {
                log.warn("Попередження: база повернула null. Кеш не оновлено.");
                return;
            }

            cardNavbar1Cache.put(Keys.CARD_NAVBAR_1, cardNavbar1List);
            cardNavbar2Cache.put(Keys.CARD_NAVBAR_2, cardNavbar2List);

            cardOptics1Cache.put(Keys.CARD_OPTICS_1, cardOptics1List);
            cardOptics2Cache.put(Keys.CARD_OPTICS_2, cardOptics2List);
            cardOptics3Cache.put(Keys.CARD_OPTICS_3, cardOptics3List);

            caruslCategoryCache.put(Keys.CARUSL_CATEGORY, caruslCategoryList);
            caruslGroupCache.put(Keys.CARUSL_GROUP, caruslGroupList);
            sliderImages1Cache.put(Keys.SLIDER_IMAGES_1, sliderImages1List);

        } catch (Exception e) {
            log.error("Помилка під час оновлення кешу: ", e);
        }
    }

    // Cache

    public static class Keys {
        public static final String CARD_NAVBAR_1 = "cardNavbar1";
        public static final String CARD_NAVBAR_2 = "cardNavbar2";

        public static final String CARD_OPTICS_1 = "cardOptics1";
        public static final String CARD_OPTICS_2 = "cardOptics2";
        public static final String CARD_OPTICS_3 = "cardOptics3";

        public static final String CARUSL_CATEGORY = "caruslCategory";
        public static final String CARUSL_GROUP = "caruslGroup";
        public static final String SLIDER_IMAGES_1 = "sliderImages1";
    }

    public final ImmutableListCache<String, CardNavbar1> cardNavbar1Cache;
    public final ImmutableListCache<String, CardNavbar2> cardNavbar2Cache;

    public final ImmutableListCache<String, CardOptics1> cardOptics1Cache;
    public final ImmutableListCache<String, CardOptics2> cardOptics2Cache;
    public final ImmutableListCache<String, CardOptics3> cardOptics3Cache;

    public final ImmutableListCache<String, CaruslCategory> caruslCategoryCache;
    public final ImmutableListCache<String, CaruslGroup> caruslGroupCache;
    public final ImmutableListCache<String, SliderImages1> sliderImages1Cache;

    public MPageCacheManager(
            CardNavbar1Repos cardNavbar1Repos,
            CardNavbar2Repos cardNavbar2Repos,
            CardOptics1Repos cardOptics1Repos,
            CardOptics2Repos cardOptics2Repos,
            CardOptics3Repos cardOptics3Repos,
            CaruslCategoryRepos caruslCategoryRepos,
            CaruslGroupRepos caruslGroupRepos,
            SliderImages1Repos sliderImages1Repos,
            MeterRegistry registry) {
        this.cardNavbar1Repos = cardNavbar1Repos;
        this.cardNavbar2Repos = cardNavbar2Repos;
        this.cardOptics1Repos = cardOptics1Repos;
        this.cardOptics2Repos = cardOptics2Repos;
        this.cardOptics3Repos = cardOptics3Repos;
        this.caruslCategoryRepos = caruslCategoryRepos;
        this.caruslGroupRepos = caruslGroupRepos;
        this.sliderImages1Repos = sliderImages1Repos;

        this.cardNavbar1Cache = CacheFactory.newListCache(registry, "clientCache", 1, 5, TimeUnit.MINUTES);
        this.cardNavbar2Cache = CacheFactory.newListCache(registry, "guestCache", 1, 1, TimeUnit.HOURS);
        this.cardOptics1Cache = CacheFactory.newListCache(registry, "guestRatingGlobalCache", 1, 5, TimeUnit.MINUTES);
        this.cardOptics2Cache = CacheFactory.newListCache(registry, "guestRatingGlobalCache", 1, 5, TimeUnit.MINUTES);
        this.cardOptics3Cache = CacheFactory.newListCache(registry, "guestRatingGlobalCache", 1, 5, TimeUnit.MINUTES);
        this.caruslCategoryCache = CacheFactory.newListCache(registry, "guestRatingGlobalCache", 1, 12, TimeUnit.HOURS);
        this.caruslGroupCache = CacheFactory.newListCache(registry, "guestRatingGlobalCache", 1, 6, TimeUnit.HOURS);
        this.sliderImages1Cache = CacheFactory.newListCache(registry, "guestRatingGlobalCache", 1, 15,
                TimeUnit.MINUTES);
    }

    // Cache Monitoring & Functions

    public void clearAll() {
        cardNavbar1Cache.invalidateAll();
        cardNavbar2Cache.invalidateAll();

        cardOptics1Cache.invalidateAll();
        cardOptics2Cache.invalidateAll();
        cardOptics3Cache.invalidateAll();

        caruslCategoryCache.invalidateAll();
        caruslGroupCache.invalidateAll();
        sliderImages1Cache.invalidateAll();
    }

    // All Data

    /**
     * Data retrieval methods for the Front-end rendering engine.
     * Returns the cached lists of UI components (cards, carousels, sliders) for
     * immediate display without executing heavy database queries.
     */
    public List<CardNavbar1> allCardNavbar1() {
        return cardNavbar1Cache.get(
                Keys.CARD_NAVBAR_1,
                _ -> cardNavbar1Repos.findAll());
    }

    public List<CardNavbar2> allCardNavbar2() {
        return cardNavbar2Cache.get(
                Keys.CARD_NAVBAR_2,
                _ -> cardNavbar2Repos.findAll());
    }

    public List<CardOptics1> allCardOptics1() {
        return cardOptics1Cache.get(
                Keys.CARD_OPTICS_1,
                _ -> cardOptics1Repos.findAll());
    }

    public List<CardOptics2> allCardOptics2() {
        return cardOptics2Cache.get(
                Keys.CARD_OPTICS_2,
                _ -> cardOptics2Repos.findAll());
    }

    public List<CardOptics3> allCardOptics3() {
        return cardOptics3Cache.get(
                Keys.CARD_OPTICS_3,
                _ -> cardOptics3Repos.findAll());
    }

    public List<CaruslCategory> allCaruslCategory() {
        return caruslCategoryCache.get(
                Keys.CARUSL_CATEGORY,
                _ -> caruslCategoryRepos.findAll());
    }

    public List<CaruslGroup> allCaruslGroup() {
        return caruslGroupCache.get(
                Keys.CARUSL_GROUP,
                _ -> caruslGroupRepos.findAll());
    }

    public List<SliderImages1> allSliderImages1() {
        return sliderImages1Cache.get(
                Keys.SLIDER_IMAGES_1,
                _ -> sliderImages1Repos.findAll());
    }
}
