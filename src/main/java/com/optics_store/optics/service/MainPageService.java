package com.optics_store.optics.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.optics_store.optics.cache.MPageCacheManager;
import com.optics_store.optics.entity.Optics;
import com.optics_store.optics.entity.main_page.CardNavbar1;
import com.optics_store.optics.entity.main_page.CardNavbar2;
import com.optics_store.optics.entity.main_page.CardOptics1;
import com.optics_store.optics.entity.main_page.CardOptics2;
import com.optics_store.optics.entity.main_page.CardOptics3;
import com.optics_store.optics.entity.main_page.CaruslCategory;
import com.optics_store.optics.entity.main_page.CaruslGroup;
import com.optics_store.optics.entity.main_page.SliderImages1;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Business logic for rendering the Server-Side (SSR) Home Page.
 * Orchestrates the retrieval of UI components (hero banners, carousels,
 * categorized product grids) from the fast in-memory cache.
 */
public class MainPageService {

    private final OpticsService opticsService;
    private final MPageCacheManager cache;

    private static String norm(String s) {
        return s == null ? null : s.trim().toLowerCase(Locale.ROOT);
    }

    // Get All

    /**
     * Bulk data retrieval methods for rendering the Freemarker templates.
     * Fetches grouped lists of products, sliders, and navigation categories to
     * construct the responsive grid and flex layouts.
     */
    public List<SliderImages1> getAllSliderImages1() {
        return cache.allSliderImages1();
    }

    public List<CardOptics1> getAllCardOptics1() {
        return cache.allCardOptics1();
    }

    public List<CardOptics2> getAllCardOptics2() {
        return cache.allCardOptics2();
    }

    public List<CardOptics3> getAllCardOptics3() {
        return cache.allCardOptics3();
    }

    public List<CardNavbar1> getAllCardOpticsNav1() {
        return cache.allCardNavbar1();
    }

    public List<CardNavbar2> getAllCardOpticsNav2() {
        return cache.allCardNavbar2();
    }

    public List<CaruslCategory> getAllCaruslCategory() {
        return cache.allCaruslCategory();
    }

    public List<Optics> getAllOpticsByCardOptics1() {
        List<CardOptics1> cardOptics1List = getAllCardOptics1();
        List<Optics> opticsList = new ArrayList<>();

        for (CardOptics1 cardOptic : cardOptics1List) {
            Optics optics = opticsService.getOpticsById(cardOptic.getOpticId());
            if (optics != null) {
                opticsList.add(optics);
            }
        }
        return opticsList;
    }

    public List<Optics> getAllOpticsByCardOptics2() {
        List<CardOptics2> cardOptics2List = getAllCardOptics2();
        List<Optics> opticsList = new ArrayList<>();

        for (CardOptics2 cardOptic : cardOptics2List) {
            Optics optics = opticsService.getOpticsById(cardOptic.getOpticId());
            if (optics != null) {
                opticsList.add(optics);
            }
        }
        return opticsList;
    }

    public List<Optics> getAllOpticsByCardOptics3() {
        List<CardOptics3> cardOptics3List = getAllCardOptics3();
        List<Optics> opticsList = new ArrayList<>();

        for (CardOptics3 cardOptic : cardOptics3List) {
            Optics optics = opticsService.getOpticsById(cardOptic.getOpticId());
            if (optics != null) {
                opticsList.add(optics);
            }
        }
        return opticsList;
    }

    public List<Optics> getAllOpticsByCardOpticsNav1() {
        List<CardNavbar1> cardOpticsNav1List = getAllCardOpticsNav1();
        List<Optics> opticsList = new ArrayList<>();

        for (CardNavbar1 cardOptic : cardOpticsNav1List) {
            Optics optics = opticsService.getOpticsById(cardOptic.getOpticId());
            if (optics != null) {
                opticsList.add(optics);
            }
        }
        return opticsList;
    }

    public List<Optics> getAllOpticsByCardOpticsNav2() {
        List<CardNavbar2> cardOpticsNav2List = getAllCardOpticsNav2();
        List<Optics> opticsList = new ArrayList<>();

        for (CardNavbar2 cardOptic : cardOpticsNav2List) {
            Optics optics = opticsService.getOpticsById(cardOptic.getOpticId());
            if (optics != null) {
                opticsList.add(optics);
            }
        }
        return opticsList;
    }

    // Find By Name & Gender

    public CaruslCategory findCategoryByName(String name) {
        return cache.allCaruslCategory().stream()
                .filter(category -> category.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public CaruslGroup findGroupByName(String name) {
        return cache.allCaruslGroup().stream()
                .filter(group -> group.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public CaruslGroup findGroupByNameGender(String name, String gender) {
        return cache.allCaruslGroup().stream()
                .filter(cg -> Objects.equals(norm(cg.getName()), norm(name)))
                .filter(cg -> Objects.equals(norm(cg.getGenderGroup()), norm(gender)))
                .findFirst()
                .orElse(null);
    }
}
