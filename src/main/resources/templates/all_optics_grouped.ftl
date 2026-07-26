<#--
  ALPHABETICAL DIRECTORY PAGE: Organizes and displays a structured list of product categories or
  brands grouped alphabetically for easy scanning, navigation, and SEO optimization.
-->
<#import "templ/templ.ftl" as clo>
<@clo.pages>
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_card.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/star_rating.css">
    <link rel="stylesheet" type="text/css" href="/css/grouped_favorites_cart.css">

    <div class="switching-pages">
        <a class="switching-pages-button" id="home-page-button" href="/">
            <img src="/images/System_Interface/feedback_control/home_page/home_page.svg" alt="Home Page" class="switching-pages-icon">
        </a>
        <p class="hyphen" style="padding-top: calc(100vw * 0 / 1366);">/</p>
        <p class="p-none-a">УСІ ${groupedTitle?upper_case}</p>
    </div>

    <p class="optics-grouped-title">${groupedTitle}</p>

    <div class="row row-cols-2 row-cols-md-4 g-4 optics-grouped-row">
        <#list allGroupedVariable?keys as letter>
            <div class="col">
                <div class="card h-100 position-relative">
                    <p class="optics-grouped-name">${letter}</p>
                    <#list allGroupedVariable[letter] as value>
                        <p class="optics-grouped-description">${value}</p>
                    </#list>
                </div>
            </div>
        </#list>
    </div>

</@clo.pages>
