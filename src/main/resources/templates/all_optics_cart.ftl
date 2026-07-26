<#--
  SHOPPING CART PAGE: Displays the selected products, manages dynamic quantity inputs, and
  calculates the total order price synchronously. Provides the entry point for the checkout
  process and handles out-of-stock UI states.
-->
<#import "templ/templ.ftl" as clo>
<@clo.pages>
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_card.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/star_rating.css">
    <link rel="stylesheet" type="text/css" href="/css/grouped_favorites_cart.css">

    <div class="switching-pages-cart">
        <a class="switching-pages-button" id="home-page-button" href="/">
            <img src="/images/System_Interface/feedback_control/home_page/home_page.svg" alt="Home Page" class="switching-pages-icon">
        </a>
        <p class="hyphen" style="padding-top: calc(100vw * 0 / 1366);">/</p>
        <p class="p-none-a">КОШИК</p>
    </div>

    <div style="overflow: hidden;">
    <div class="row row-cols-1 row-cols-md-2 g-4 main-cart-row-container">
        <div class="col" style="width: 65%;">
            <div class="card h-100">
            <p class="optics-main-cart-title">Мій кошик</p>

            <div class="row row-cols-md-1 g-4 main-cart-row">
                <#if allOptics??>
                    <#list allOptics as optic>
                        <div class="col col-byCart"
                            data-cart-optic-quantity="${optic.opticsAddition.quantity}"
                            id="col-byCart_${idToTokenOpticsMap[optic.id?string]}" style="display: none;">
                            <div class="card h-100 position-relative">
                                <img src="${optic.opticsAddition.fullPathImage1?default("")}" alt="Close" class="cart-optic-img">
                            
                                <p class="cart-optic-name">
                                <#assign splitPosition = -1>
                                <#assign hasEnglishChar = false>
                                
                                <#list 0..(optic.fullName?length - 1) as i>
                                    <#assign char = optic.fullName?substring(i, i + 1)>
                                    <#if char?matches("[A-Za-z]")>
                                        <#assign splitPosition = i>
                                        <#assign hasEnglishChar = true>
                                        <#break>
                                    </#if>
                                </#list>
                                
                                <#if hasEnglishChar>
                                    <#assign firstPart = optic.fullName?substring(0, splitPosition)>
                                    <#assign secondPart = optic.fullName?substring(splitPosition)>
                                    <span class="cart-name-first-part">${firstPart}<span><br>${secondPart}
                                <#else>
                                    ${optic.fullName}
                                </#if>
                                </p>
                            
                                <#assign processedRetailPrice = optic.retailPrice>
                                <#if optic.opticsAddition.action != 0>
                                    <#assign discountedPrice = processedRetailPrice * (1 - (optic.opticsAddition.action / 100))>
                                    <#assign discountedPrice = discountedPrice?string["0.##"]>
                                    <#assign discountedPrice = discountedPrice?replace(",", ".")>
                                    <p class="cart-price-text" id="main-cart-price_${idToTokenOpticsMap[optic.id?string]}">
                                    <span class="cart-currency-text" id="main-cart-currency_${idToTokenOpticsMap[optic.id?string]}"><a>${discountedPrice}</a></span> грн.</p>
                                <#else>
                                    <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                                    <#assign processedRetailPrice = processedRetailPrice + "0">
                                    <p class="cart-price-text" id="main-cart-price_${idToTokenOpticsMap[optic.id?string]}">
                                    <span class="cart-currency-text" id="main-cart-currency_${idToTokenOpticsMap[optic.id?string]}"><a>${processedRetailPrice}</a></span> грн.</p>
                                </#if>

                                <div class="price-main-cart-container">
                                    <button class="main-cart-productMinus-button" id="main-cart-productMinus-input_${idToTokenOpticsMap[optic.id?string]}"></button>
                                    <span class="main-cart-productQuantity-span">
                                        <input type="text" value="1" class="main-cart-productQuantity-input"
                                            id="main-cart-productQuantity-input_${idToTokenOpticsMap[optic.id?string]}">
                                    </span>
                                    <button class="main-cart-productPlus-button" id="main-cart-productPlus-input_${idToTokenOpticsMap[optic.id?string]}"></button>
                                </div>

                                <button class="delete-main-cart-button" id="delete-main-cart-button_${idToTokenOpticsMap[optic.id?string]}">
                                    <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
                                </button>
                            </div>
                        </div>
                    </#list>
                </#if>
            </div>
            </div>
        </div>

        <div class="col" style="width: 29.5%; height: calc(100vw * 158 / 1366);">
            <div class="card h-100">
                <p class="price-sum-main-cart">
                    Сума<span class="cart-price-text" id="cart-price-sum">
                    <span class="cart-currency-text" id="cart-currency-sum">0.00</span> грн.</span>
                </p>
                
                <button id="cart-order-button">ОФОРМИТИ ЗАМОВЛЕННЯ</button>
            </div>
        </div>
    </div>
    </div>


    <script src="/js/jquery-3.7.1.min.js"></script>

    <script src="/js/main_cart.js"></script>
    <script src="/js/main_page/main_page_func.js"></script>
    <script src="/js/star_rating/number_optics_star.js"></script>
</@clo.pages>
