<#--
  MEGA-MENU PRODUCT GRID: SSR loop generating product cards. Automatically calculates discounted
  prices and transliterates Cyrillic product names to generate SEO-friendly Latin URLs. Used across
  category hover states.
-->
<link rel="stylesheet" type="text/css" href="/css_main/css_navbar_2/navbar_2_row_cols.css">

<div id="rowNav" class="row row-cols-2 row-cols-md-4 g-4 all-optics3-nav">
    <#if allOpticsNav1??>
        <#list allOpticsNav1 as optic>
            <div class="col" id="optics3-nav1">
                <div class="card cardNav h-100 position-relative"
                    <#if optic?index == 0>
                        style="border-left: none;"
                    <#elseif optic?index == (allOpticsNav1?size - 1)>
                        style="border-right: none;"
                    </#if>>

                    <#assign processedRetailPrice = optic.retailPrice>

                    <#if optic.opticsAddition.action != 0>
                        <#assign discountedPrice = processedRetailPrice * (1 - (optic.opticsAddition.action / 100))>
                        <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                        <#assign processedRetailPrice = processedRetailPrice + "0">
                        <#assign discountedPrice = discountedPrice?string["0.##"]>
                        <#assign discountedPrice = discountedPrice?replace(",", ".")>

                        <div class="price-container">
                            <div class="rowNav-triangle-container">
                                <div class="rowNav-square-right"><span class="rowNav-price-text"><span class="rowNav-currency-text"><a>10${discountedPrice}</a></span> грн.</span></div>
                                <div class="rowNav-triangle-square"></div>
                                <div class="rowNav-triangle-circle"></div>
                                <div class="rowNav-triangle-top"></div>
                                <div class="rowNav-triangle-bottom"></div>
                            </div>
                        </div>
                    <#else>
                        <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                        <#assign processedRetailPrice = processedRetailPrice + "0">

                        <div class="price-container">
                            <div class="rowNav-triangle-container">
                                <div class="rowNav-square-right"><span class="rowNav-price-text"><span class="rowNav-currency-text"><a>10${processedRetailPrice}</a></span> грн.</span></div>
                                <div class="rowNav-triangle-square"></div>
                                <div class="rowNav-triangle-circle"></div>
                                <div class="rowNav-triangle-top"></div>
                                <div class="rowNav-triangle-bottom"></div>
                            </div>
                        </div>
                    </#if>

                    <#assign transliterateFullName = optic.fullName?lower_case>
                    <#assign transliterateFullName = transliterateFullName
                        ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                        ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                        ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                        ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                        ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                        ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                        ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                        ?replace(" ", "-")>

                    <a href="/products/${transliterateFullName}" data-optic-a="${idToTokenOpticsMap[optic.id?string]}">
                        <img id="opticImage_${idToTokenOpticsMap[optic.id?string]}" src="${optic.opticsAddition.fullPathImage1?default("")}"
                         class="card-img-top cardNav-img-top custom-image-size_RowNav non-selectable" alt="${optic.fullName}">
                    </a>
                    <div class="custom-card">
                        <h5 class="cardNav-title">
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
                                ${firstPart}<br>
                                <div style="margin-top: calc(100vw * 10 / 1366);">${secondPart}</div>
                            <#else>
                                ${optic.fullName}
                            </#if>
                        </h5>
                    </div>
                </div>
            </div>
        </#list>
    <#else>
        <p>No Optics data available.</p>
    </#if>
</div>

<script src="/js_main/js_navbar_2/navbar_2_row_cols.js"></script>
