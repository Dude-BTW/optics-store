<#--
  HOME PAGE TEMPLATE: Renders the hero banner and brand logo carousels. Includes sub-sections for
  product carousels (New, Top, Recommended) and the store statistics component with a rating
  distribution histogram. Uses Server-Side Rendering (SSR) for initial load performance.
-->
<#import "templ/templ.ftl" as amp>
<@amp.pages 
    showCartPopup               = true
    showGlobalReaptchaPopup     = false
    showReaptchaPopup           = false
    showReportAvailabilityPopup = true
    showRatingGlobalPopup       = true
    showMainTopPopup            = false
    showProductFilter1Popup     = false
    showProductFilter2Popup     = false>

    <link rel="stylesheet" type="text/css" href="/css/main_page_func/all_optics_3.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_card.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_body.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/star_rating.css">

    <link rel="stylesheet" type="text/css" href="/css/main_page_photo_body.css">

    <div id="photoCarousel" class="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        data-bs-pause="hover">
        <div class="carousel-inner" style="height: calc(100vw * 400 / 1366);">
            <#list allImages as image>
            <div class="carousel-item <#if image?index == 0>active</#if>">
            <a>
                <img src="${image.fullPathSlider1}" class="carousel-inner-img d-block w-100" alt="Image ${image?index + 1}" style="height: calc(100vw * 400 / 1366); object-fit: cover;">
            </a>
            </div>
            </#list>
        </div>
        <button id="imagePrev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
            <img src="/images/System_Interface/carousel_symbols/carousel_prev.svg" alt="Previous">
        </button>
        <button id="imageNext" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
            <img src="/images/System_Interface/carousel_symbols/carousel_next.svg" alt="Next">
        </button>

        <div id="carouselIndicators" class="d-flex justify-content-center mt-3">
            <#list allImages as image>
            <img src="/images/System_Interface/carousel_symbols/circle_carousel.svg" class="carousel-indicator non-selectable" data-slide-to="${image?index}" alt="Indicator for Image ${image?index + 1}">
            </#list>
        </div>
    </div>

    <div class="swiper-container-hueiner" style="margin-bottom: calc(100vw * 34 / 1366); margin-top: calc(100vw * 15 / 1366);">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <#list allCategory as image>
                <div class="swiper-slide non-selectable">
                    <a href="/brand/${image.name?lower_case?replace(" ", "-")}">
                        <img src="${image.imageCategory}" alt="Image ${image.name}">
                    </a>
                </div>
                </#list>
            </div>
        </div>
        <div class="swiper-pagination" style="width: auto;"></div>
    </div>

    <div class="no-wrap-row-controls">
        <button id="noWrapRowPrev" class="btn">Оправи для окулярів</button>
        <button id="noWrapRowNext" class="btn">Окуляри сонцезахисні</button>
    </div>
    
    <div id="noWrapRow1">
        <#assign prefix="row1">
        <#include "div_sections/main_page/main_page_wrap_row_1.ftl">
    </div>

    <div id="noWrapRow2" class="noWrapRowHidden">
        <#assign prefix="row2">
        <#include "div_sections/main_page/main_page_wrap_row_2.ftl">
    </div>

    <#include "div_sections/main_page/main_page_multi_cols.ftl">

    <div class="no-wrap-row-controls" style="margin-bottom: calc(100vw * -72 / 1366); margin-left: 5.8%;">Рекомендовані</div>
    <div style="margin-bottom: calc(100vw * 40 / 1366);">
        <#assign prefix="row3">
        <#include "div_sections/main_page/main_page_wrap_row_1.ftl">
    </div>

    <div class="no-wrap-row-controls" style="margin-bottom: calc(100vw * -72 / 1366); margin-left: 5.8%;">Рекомендовані</div>
    <div style="margin-bottom: calc(100vw * 40 / 1366);">
        <#assign prefix="row4">
        <#include "div_sections/main_page/main_page_wrap_row_2.ftl">
    </div>

    <div class="no-wrap-row-controls" style="margin-bottom: calc(100vw * -72 / 1366); margin-left: 5.8%;">Новинка</div>
    <div style="margin-bottom: calc(100vw * 40 / 1366);">
        <#assign prefix="row5">
        <#include "div_sections/main_page/main_page_wrap_row_1.ftl">
    </div>
    
    <div class="no-wrap-row-controls" style="margin-top: 6.8%; margin-left: 5.8%; margin-bottom: calc(100vw * -73 / 1366);">Відгуки про магазин</div>
    <div>
        <#include "div_sections/main_rating_star.ftl">
    </div>


    <script src="/js/jquery-3.7.1.min.js"></script>
    
    <script src="/js/star_rating/number_optics_star.js"></script>
    <script src="/js/star_rating/main_star_rating.js"></script>
    <script src="/js/main_page/main_page_func.js"></script>
    <script src="/js/main_page/main_page_photo_shit.js"></script>
</@amp.pages>
