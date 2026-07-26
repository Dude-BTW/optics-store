<#--
  PRIMARY NAVIGATION & MEGA-MENU: Features dynamic interactive UI components including live search
  input, user profile routing, and real-time state counters for the cart and wishlist. The mega-menu
  handles extensive product categorizations.
-->
<link rel="stylesheet" type="text/css" href="/css_main/navbar_2.css">
<link rel="stylesheet" type="text/css" href="/css_main/css_navbar_2/navbar_2_dropdown.css">
<link rel="stylesheet" type="text/css" href="/css_main/css_navbar_2/navbar_2_idk.css">

<div class="navbar-container2">
    <div class="navbar-left">
        <a href="/">
            <img src="/images/Головний лого/Y!O.png" alt="Brand Optics" class="brand-optics-icon">
        </a>
    </div>
    <div class="navbar-center">
        <div id="drop1" class="dropdown1">
            <span class="non-selectable larger-click-area-nav2" style="display: inline-flex; align-items: center; margin-right: calc(100vw * 16 / 1366); white-space: nowrap;">
                ТОВАР&nbsp;
                <img src="/images/System_Interface/dropdown_symbols/down_red.svg" alt="Dropdown" class="dropdown2-icon">
            </span>
            <div id="dropCon1" class="dropdown1-content" style="margin-left: calc(100vw * 3 / 1366);">
                <a href="/catalog/okuliary-sontsezakhysni" id="sunglasses-hover" class="button-like non-selectable">
                    СОНЦЕЗАХИСНІ ОКУЛЯРИ&nbsp;
                    <img src="/images/System_Interface/dropdown_symbols/right_left_red.svg" alt="Dropdown" id="sunglasses-dropdown" class="dropdown2-icon">
                </a>
                <a href="/catalog/opravy-dlia-okuliariv" id="frames" class="button-like non-selectable">
                    ОПРАВИ&nbsp;
                    <img src="/images/System_Interface/dropdown_symbols/right_left_red.svg" alt="Dropdown" id="frames-dropdown" class="dropdown2-icon">
                </a>
            </div>
        </div>
        <span class="button-like non-selectable" style="white-space: nowrap;">ПОСЛУГИ</span>
        <a href="/aktsiini_tovary"><span class="button-like non-selectable" style="white-space: nowrap;">АКЦІЙНІ ТОВАРИ</span></a>
        <span class="button-like non-selectable" style="white-space: nowrap;">ЗАПИСАТИСЬ ДО ЛІКАРЯ</span>
    </div>

    <div class="navbar-right">
        <button class="icon-button" id="search-button">
            <img src="/images/System_Interface/navbar_symbols/search/search.svg" alt="Search" class="right-icon" style="width: calc(100vw * 20 / 1366);">
        </button>
        <div class="search-container" id="search-container">
            <input type="text" id="search-input" placeholder="Пошук...">
            <div id="search-results" class="search-results"></div>
            <button class="icon-button" id="cancel-button">
                <img src="/images/System_Interface/close/close.svg" alt="Close Search" class="close-icon-search">
            </button>
        </div>
        <!-- Other icons -->
        <button class="icon-button" id="user-button">
            <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User" class="right-icon" style="width: calc(100vw * 22 / 1366); margin-top: calc(100vw * 1 / 1366);">
        </button>
        <a class="icon-button" id="heart-button" href="/wishlist">
            <img src="/images/System_Interface/navbar_symbols/heart_nav/heart_nav.svg" alt="Heart" class="right-icon" style="width: calc(100vw * 26 / 1366); margin-top: calc(100vw * 1 / 1366);">
            <div class="heart-num">0</div>
        </a>
        <a class="icon-button" id="cart-button" href="/cart">
            <img src="/images/System_Interface/navbar_symbols/cart_card_nav/cart_card_nav.svg" alt="Cart Card" class="right-icon" style="width: calc(100vw * 27 / 1366);">
            <div class="cart-card-num">0</div>
        </a>
    </div>
</div>

<div class="additional-navbar1">
    <div class="additNavbar1">
        <table class="additional-navbar1-table">
            <thead>
                <tr>
                    <th class="category-column non-selectable">КАТЕГОРІЯ</th>
                    <th class="category-column non-selectable">БРЕНД</th>
                    <th class="category-column non-selectable">ВИРОБНИК</th>
                    <th class="category-column non-selectable">КРАЇНА</th>
                    <th class="category-column non-selectable">МАТЕРІАЛ</th>
                    <th class="category-column non-selectable">ЛІНЗА</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="category-column" id="gender-nav1">
                        <#list genderGlassesNav as gender>
                            <#if gender?index < 6>
                            <#assign transliterateGender = gender?lower_case>
                            <#assign transliterateGender = transliterateGender
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/okuliary-sontsezakhysni/${transliterateGender}">${gender}</a></div>
                            </#if>
                        </#list>
                        <#if (genderGlassesNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (genderGlassesNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_gender">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="brand-column" id="brand-nav1">
                        <#list brandGlassesNav as brand>
                            <#if brand?index < 6>
                                <div class="non-selectable">
                                <a href="/brand/${brand?lower_case?replace(" ", "-")}/okuliarysontsezakhysni">${brand}</a></div>
                            </#if>
                        </#list>
                        <#if (brandGlassesNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (brandGlassesNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_brand">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="brand-column" id="manufacturer-nav1">
                        <#list manufacturerGlassesNav as manufacturer>
                            <#if manufacturer?index < 6>
                                <div class="non-selectable">
                                <a href="/catalog/okuliary-sontsezakhysni/${manufacturer?lower_case?replace(" ", "-")}">${manufacturer}</a></div>
                            </#if>
                        </#list>
                        <#if (manufacturerGlassesNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (manufacturerGlassesNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_manufacturer">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="category-column" id="country-nav1">
                        <#list countryGlassesNav as country>
                            <#if country?index < 6>
                            <#assign transliterateCountry = country?lower_case>
                            <#assign transliterateCountry = transliterateCountry
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/okuliary-sontsezakhysni/${transliterateCountry}">${country}</a></div>
                            </#if>
                        </#list>
                        <#if (countryGlassesNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (countryGlassesNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_country">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="category-column" id="material-nav1">
                        <#list materialGlassesNav as material>
                            <#if material?index < 6>
                            <#assign transliterateMaterial = material?lower_case>
                            <#assign transliterateMaterial = transliterateMaterial
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/okuliary-sontsezakhysni/${transliterateMaterial}">${material}</a></div>
                            </#if>
                        </#list>
                        <#if (materialGlassesNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (materialGlassesNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_material">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="category-column" id="eyeglass-nav1">
                        <#list eyeglassGlassesNav as eyeglass>
                            <#if eyeglass?index < 6>
                            <#assign transliterateEyeglass = eyeglass?lower_case>
                            <#assign transliterateEyeglass = transliterateEyeglass
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/okuliary-sontsezakhysni/${transliterateEyeglass}">${eyeglass}</a></div>
                            </#if>
                        </#list>
                        <#if (eyeglassGlassesNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (eyeglassGlassesNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_eyeglass">Показати більше</a></div>
                        </#if>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="all-optics3-column" id="all-optics3-column-nav1">
            <#include "navbar_2/navbar_2_row_cols_1.ftl">
        </div>
    </div>


    <div class="additNavbar2">
        <table class="additional-navbar2-table">
            <thead>
                <tr>
                    <th class="category-column non-selectable">КАТЕГОРІЯ</th>
                    <th class="category-column non-selectable">БРЕНД</th>
                    <th class="category-column non-selectable">ВИРОБНИК</th>
                    <th class="category-column non-selectable">КРАЇНА</th>
                    <th class="category-column non-selectable">МАТЕРІАЛ</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="category-column" id="gender-nav2">
                        <#list genderFrameNav as gender>
                            <#if gender?index < 6>
                            <#assign translitFrameGender = gender?lower_case>
                            <#assign translitFrameGender = translitFrameGender
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/opravy-dlia-okuliariv/${translitFrameGender}">${gender}</a></div>
                            </#if>
                        </#list>
                        <#if (genderFrameNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (genderFrameNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_gender">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="brand-column" id="brand-nav2">
                        <#list brandFrameNav as brand>
                            <#if brand?index < 6>
                                <div class="non-selectable">
                                <a href="/brand/${brand?lower_case?replace(" ", "-")}/opravydliaokuliariv">${brand}</a></div>
                            </#if>
                        </#list>
                        <#if (brandFrameNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (brandFrameNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_brand">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="brand-column" id="manufacturer-nav2">
                        <#list manufacturerFrameNav as manufacturer>
                            <#if manufacturer?index < 6>
                                <div class="non-selectable">
                                <a href="/catalog/opravy-dlia-okuliariv/${manufacturer?lower_case?replace(" ", "-")}">${manufacturer}</a></div>
                            </#if>
                        </#list>
                        <#if (manufacturerFrameNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (manufacturerFrameNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_manufacturer">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="category-column" id="country-nav2">
                        <#list countryFrameNav as country>
                            <#if country?index < 6>
                            <#assign translitFrameCountry = country?lower_case>
                            <#assign translitFrameCountry = translitFrameCountry
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/opravy-dlia-okuliariv/${translitFrameCountry}">${country}</a></div>
                            </#if>
                        </#list>
                        <#if (countryFrameNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (countryFrameNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_country">Показати більше</a></div>
                        </#if>
                    </td>
                    <td class="category-column" id="material-nav2">
                        <#list materialFrameNav as material>
                            <#if material?index < 6>
                            <#assign translitFrameMaterial = material?lower_case>
                            <#assign translitFrameMaterial = translitFrameMaterial
                                ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                                ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                                ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                                ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                                ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                                ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                                ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                                ?replace(" ", "")?replace("-", "")>
                                <div class="non-selectable">
                                <a href="/catalog/opravy-dlia-okuliariv/${translitFrameMaterial}">${material}</a></div>
                            </#if>
                        </#list>
                        <#if (materialFrameNav?size == 6)><div class="non-selectable interval-nav">&nbsp;</div></#if>
                        <#if (materialFrameNav?size > 6)>
                            <div class="show-more-nav"><a href="/all_material">Показати більше</a></div>
                        </#if>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="all-optics3-column" id="all-optics3-column-nav2">
            <#include "navbar_2/navbar_2_row_cols_2.ftl">
        </div>
    </div>
</div>

<script src="/js/jquery-3.7.1.min.js"></script>

<script>
    window.allOptics = [
    <#list allOptics as optic>
        {
            "id": "${optic.id}",
            "fullName": "${optic.fullName?js_string}",
            "category": "${optic.category?cap_first?js_string}",
            "fullPathImage1": "${optic.opticsAddition.fullPathImage1?default("")?js_string}"
        }<#if optic_has_next>,</#if>
    </#list>
    ];
</script>

<script src="/js_main/js_navbar_2/navbar_2_additional.js"></script>
<script src="/js_main/js_navbar_2/navbar_2_others.js"></script>
