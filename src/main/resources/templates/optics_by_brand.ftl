<#--
  BRAND CATALOG PAGE: Displays products filtered by a specific brand. Includes the Faceted Search
  panel for dynamic filtering by attributes (gender, material, color, etc.) and integrates the
  pagination component for managing large datasets efficiently.
-->
<#import "templ/templ.ftl" as clo>
<@clo.pages
    showCartPopup               = true
    showGlobalReaptchaPopup     = false
    showReaptchaPopup           = false
    showReportAvailabilityPopup = true
    showRatingGlobalPopup       = false
    showMainTopPopup            = false
    showProductFilter1Popup     = true
    showProductFilter2Popup     = false>

    <link rel="stylesheet" type="text/css" href="/css/main_page_func/all_optics_3.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_card.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_body.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/star_rating.css">
    
    <link rel="stylesheet" type="text/css" href="/css/catalog_optics.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_photo_body.css">

    <div id="photoCarousel" class="carousel slide">
        <div class="carousel-inner" style="height: calc(100vw * 400 / 1366);">
            <div class="carousel-item active">
                <img src="${logoCategory}" class="d-block w-100 carousel-item carousel-inner-img" alt="Selected Logo" style="height: calc(100vw * 400 / 1366); object-fit: cover;">
            </div>
        </div>
    </div>

    <div class="switching-clnOptics">
        <a class="switching-pages-button" id="home-page-button" style="margin-top: calc(100vw * 0.5 / 1366);" href="/">
            <img src="/images/System_Interface/feedback_control/home_page/home_page.svg" alt="Home Page" class="switching-pages-icon">
        </a>
        <p class="hyphen" style="padding-top: calc(100vw * 0 / 1366);">/</p>
        <p class="p-none-a" style="opacity: 1;">${categoryName?upper_case}</p>
    </div>

    <div class="title-clnOptics">
        <p id="category-display">Сонцезахисні окуляри та оправи ${categoryName}</p>
    </div>

    <div class="dropdown1-feedback" style="margin-bottom: calc(100vw * 24 / 1366); margin-top: calc(100vw * 0 / 1366);">
        <button class="open-popup-filter1">
            <img src="/images/System_Interface/filter.svg" alt="Dropdown" class="dropdown1-icon"
            style="margin-bottom: calc(100vw * 0 / 1366); margin-top: calc(100vw * 2 / 1366); width: calc(100vw * 17 / 1366); height: auto;">
            &nbsp;Фільтр
        </button>

        <div class="price-quantity-text">
            <p class="priceVisual-text">Актуальна ціна на: ${currentDate}</p>
            <p class="quantityVisual-text">Кількість моделей: <span id="dynamicQuantity">${totalQuantity}</span></p>
        </div>

        <div class="dropdown1" style="font-size: calc(100vw * 13 / 1366); margin-right: -0.1%">
            <span class="non-selectable larger-click-area-nav1" id="dropdown-span-sortingOptics">
                <img src="/images/System_Interface/sorting_left.svg" alt="Dropdown"
                    style="width: calc(100vw * 17 / 1366); height: auto; margin-bottom: calc(100vw * 3 / 1366);">
                &nbsp;Сортування&nbsp;
                <img src="/images/System_Interface/dropdown_symbols/down_red.svg" alt="Dropdown" class="dropdown1-icon"
                    style="margin-bottom: calc(100vw * 0 / 1366);">
            </span>
            <div class="dropdown1-content dropdown1-content-button" id="dropdown-content-sortingOptics">
                <button onclick="setConfirmSortAndSort('new')" class="non-selectable" id="button-sort-new">Спочатку Нові</button>
                <button onclick="setConfirmSortAndSort('promotional')" class="non-selectable" id="button-sort-promotional">Спочатку Акційні товари</button>
                <button onclick="setConfirmSortAndSort('top')" class="non-selectable" id="button-sort-top">Спочатку Топ продажу</button>
                <button onclick="setConfirmSortAndSort('cheaper')" class="non-selectable" id="button-sort-cheaper">Спочатку дешевші</button>
                <button onclick="setConfirmSortAndSort('expensive')" class="non-selectable" id="button-sort-expensive">Спочатку дорогі</button>
                <button onclick="setConfirmSortAndSort('alphabetical')" class="non-selectable" id="button-sort-alphabetical">Від А до Я</button>
            </div>
        </div>
    </div>


    <#macro dedupProductOption val>
        <#assign count = 0>
        <#list seenValues as s>
            <#if s == val>
                <#assign count = count + 1>
            </#if>
        </#list>
        <#if count == 0>
            ${val}
        <#else>
            ${val}_${count}
        </#if>
        <#assign seenValues = seenValues + [val]>
    </#macro>


    <div class="row row-cols-2 row-cols-md-4 g-4 custom-margin-left all-optics1" id="all-optics-byCategory"
     style="width: 92%; margin-bottom: calc(100vw * 40 / 1366);">
        <#if allOpticsByCategory??>
            <#list 0..(allOpticsByCategory?size - 1) as i>
            <#if allOpticsByCategory[i]?exists>
                <#assign optic = allOpticsByCategory[i]>

                <#assign actionLength = 0>
                <#if optic.opticsAddition.action??><#assign actionLength = optic.opticsAddition.action?string?length></#if>

                <#assign opticBrand = optic.brand?default("")>
                <#assign opticManufacturer = optic.manufacturer?default("")>
                <#assign opticGroup = optic.category?default("")>
                <#assign opticGender = optic.gender?default("")>
                <#assign opticCountry = optic.country?default("")>
                <#assign opticMaterial = optic.material?default("")>
                <#assign opticEyeglass = optic.eyeglass?default("")>
                <#assign opticPolarization = optic.polarization?default("")>
                <#assign opticColorName1 = optic.opticsAddition.colorName1?default("")>
                <#assign opticColorName2 = optic.opticsAddition.colorName2?default("")>
                <#assign opticFrameShape = optic.opticsAddition.frameShape?default("")>
                <#assign opticFaceShape = optic.opticsAddition.faceShape?default("")>
                <#assign opticFrameType = optic.opticsAddition.frameType?default("")>
                <#assign opticEyepieceSize = optic.opticsAddition.eyepieceSize?default("")>
                <#assign opticEarringSize = optic.opticsAddition.earringSize?default("")>
                <#assign opticBridgeSize = optic.opticsAddition.bridgeSize?default("")>
                <#assign opticPhotochrome = optic.opticsAddition.photochrome?default("")>
                <#assign opticCollection = optic.opticsAddition.collection?default("")>
                <#assign opticProperties = optic.opticsAddition.properties?default("")>
                <#assign opticClipOn = optic.opticsAddition.clipOn?default("")>

                <#assign seenValues = []>
                <#list [
                    "group", 
                    "gender", 
                    "brand", 
                    "frameShape", 
                    "faceShape", 
                    "colorName1", 
                    "colorName2", 
                    "eyeglass", 
                    "material", 
                    "frameType", 
                    "eyepieceSize", 
                    "earringSize", 
                    "bridgeSize", 
                    "polarization", 
                    "photochrome", 
                    "manufacturer", 
                    "country", 
                    "collection", 
                    "properties", 
                    "clipOn"
                ] as filterType>

                <#if filterOptions?? && filterOptions[filterType]?? && (filterOptions[filterType]?size > 0)>
                <#list filterOptions[filterType] as option>

                <#assign dedupOrigOption><@dedupProductOption option/></#assign>
                <#assign dedupOrigOption = dedupOrigOption?trim>

                <#if (filterType == "brand" && option == opticBrand)><#assign opticBrand = dedupOrigOption></#if>
                <#if (filterType == "manufacturer" && option == opticManufacturer)><#assign opticManufacturer = dedupOrigOption></#if>
                <#if (filterType == "group" && option == opticGroup)><#assign opticGroup = dedupOrigOption></#if>
                <#if (filterType == "gender" && option == opticGender)><#assign opticGender = dedupOrigOption></#if>
                <#if (filterType == "country" && option == opticCountry)><#assign opticCountry = dedupOrigOption></#if>
                <#if (filterType == "material" && option == opticMaterial)><#assign opticMaterial = dedupOrigOption></#if>
                <#if (filterType == "eyeglass" && option == opticEyeglass)><#assign opticEyeglass = dedupOrigOption></#if>
                <#if (filterType == "polarization" && option == opticPolarization)><#assign opticPolarization = dedupOrigOption></#if>
                <#if (filterType == "colorName1" && option == opticColorName1)><#assign opticColorName1 = dedupOrigOption></#if>
                <#if (filterType == "colorName2" && option == opticColorName2)><#assign opticColorName2 = dedupOrigOption></#if>
                <#if (filterType == "frameShape" && option == opticFrameShape)><#assign opticFrameShape = dedupOrigOption></#if>
                <#if (filterType == "faceShape" && option == opticFaceShape)><#assign opticFaceShape = dedupOrigOption></#if>
                <#if (filterType == "frameType" && option == opticFrameType)><#assign opticFrameType = dedupOrigOption></#if>
                <#if (filterType == "eyepieceSize" && option == opticEyepieceSize)><#assign opticEyepieceSize = dedupOrigOption></#if>
                <#if (filterType == "earringSize" && option == opticEarringSize)><#assign opticEarringSize = dedupOrigOption></#if>
                <#if (filterType == "bridgeSize" && option == opticBridgeSize)><#assign opticBridgeSize = dedupOrigOption></#if>
                <#if (filterType == "photochrome" && option == opticPhotochrome)><#assign opticPhotochrome = dedupOrigOption></#if>
                <#if (filterType == "collection" && option == opticCollection)><#assign opticCollection = dedupOrigOption></#if>
                <#if (filterType == "properties" && option == opticProperties)><#assign opticProperties = dedupOrigOption></#if>
                <#if (filterType == "clipOn" && option == opticClipOn)><#assign opticClipOn = dedupOrigOption></#if>
                </#list>
                <#else>
                </#if>
                </#list>

                <div class="col card-byCategory<#if (i > 27)> hidden-line</#if>" style="flex: 0 0 auto;"
                    data-id="${idToTokenOpticsMap[optic.id?string]}"
                    data-brand="${opticBrand}"
                    data-manufacturer="${opticManufacturer}"
                    data-group="${opticGroup}"
                    data-gender="${opticGender}"
                    data-country="${opticCountry}"
                    data-material="${opticMaterial}"
                    data-eyeglass="${opticEyeglass}"
                    data-polarization="${opticPolarization}"
                    data-price="${optic.retailPrice}"
                    data-action="${optic.opticsAddition.action}"
                    data-top="${optic.opticsAddition.top?string('true', 'false')}"
                    data-top-quantity="${optic.opticsAddition.quantity}"
                    data-color-name1="${opticColorName1}"
                    data-color-name2="${opticColorName2}"
                    data-frame-shape="${opticFrameShape}"
                    data-face-shape="${opticFaceShape}"
                    data-frame-type="${opticFrameType}"
                    data-eyepiece-size="${opticEyepieceSize}"
                    data-earring-size="${opticEarringSize}"
                    data-bridge-size="${opticBridgeSize}"
                    data-photochrome="${opticPhotochrome}"
                    data-collection="${opticCollection}"
                    data-properties="${opticProperties}"
                    data-clip-on="${opticClipOn}">
                    <div class="card h-100 position-relative" style="border-radius: calc(100vw * 10 / 1366);">
                        
                        <#assign rating = (allRatingAverage?filter(r -> idToTokenOpticsMap[r.optic.id?string] == idToTokenOpticsMap[optic.id?string])?first)?default(0)>

                        
                        <#if !(optic.opticsAddition.quantity?? && optic.opticsAddition.quantity == 0)>
                            <#if optic.opticsAddition.top?string("true", "false") == "true">
                                <svg class="top-left-icon" width="800px" height="800px" viewBox="-5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e6c56d" transform="rotate(270)">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                <g id="SVGRepo_iconCarrier"><title>bookmark_fill [#1227]</title><desc>Created with Sketch.</desc><defs></defs>
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-265.000000, -2679.000000)" fill="#e6c56d"> 
                                <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                <path d="M219,2521 L219,2537.998 C219,2538.889 217.923,2539.335 217.293,2538.705 L214.707,2536.119 C214.317,2535.729 213.683,2535.729 213.293,2536.119 L210.707,2538.705 C210.077,2539.335 209,2538.889 209,2537.998 L209,2521 C209,2519.895 209.895,2519 211,2519 L217,2519 C218.105,2519 219,2519.895 219,2521" id="bookmark_fill-[#1227]"></path> 
                                </g></g></g></g><text x="-2.5" y="10.2" font-size="4" fill="#ffffff" text-anchor="start" alignment-baseline="middle" transform="rotate(-270 5 10)" font-family="Montserrat, sans-serif">Топ</text>
                                </svg>
                            </#if>
                            <#if optic.opticsAddition.action != 0>
                                <svg class="top-left-icon" width="800px" height="800px" viewBox="-5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e6746d" transform="rotate(270)">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                <g id="SVGRepo_iconCarrier"> <title>bookmark_fill [#1227]</title><desc>Created with Sketch.</desc><defs> </defs> 
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> 
                                <g id="Dribbble-Light-Preview" transform="translate(-265.000000, -2679.000000)" fill="#e6746d"> 
                                <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                <path d="M219,2521 L219,2537.998 C219,2538.889 217.923,2539.335 217.293,2538.705 L214.707,2536.119 C214.317,2535.729 213.683,2535.729 213.293,2536.119 L210.707,2538.705 C210.077,2539.335 209,2538.889 209,2537.998 L209,2521 C209,2519.895 209.895,2519 211,2519 L217,2519 C218.105,2519 219,2519.895 219,2521" id="bookmark_fill-[#1227]"></path> 
                                </g></g></g></g><text x="-2.5" y="10.2" font-size="4" fill="#ffffff" text-anchor="start" alignment-baseline="middle" transform="rotate(-270 5 10)" font-family="Montserrat">Акція</text>
                                </svg>
                            </#if>                        
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
                            <img id="opticImage_${idToTokenOpticsMap[optic.id?string]}" 
                                src="${optic.opticsAddition.fullPathImage1?default("")}" 
                                class="card-img-top custom-image-size" 
                                alt="${optic.fullName}"
                                data-image1="${optic.opticsAddition.fullPathImage1?default("")}" 
                                data-image2="${optic.opticsAddition.fullPathImage2?default("")}">
                        </a>
                        <button id="heartButton_${idToTokenOpticsMap[optic.id?string]}" class="top-right-icon heart-button" data-optic-heart-id="${idToTokenOpticsMap[optic.id?string]}">
                            <img src="/images/System_Interface/card/heart/heart.svg" class="heart-icon" alt="Heart Icon">
                        </button>
                        
                        <button id="cart-card_${idToTokenOpticsMap[optic.id?string]}" class="bottom-right-icon-wrapper
                        <#if optic.opticsAddition.quantity?? && optic.opticsAddition.quantity == 0> bottom-icon-non-availability</#if>"
                        data-optic-cart-id="${idToTokenOpticsMap[optic.id?string]}"></button>
                        <div class="custom-card d-flex flex-column">
                            <h5 class="card-title">
                                
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
                            <div class="non-selectable productContainer" id="rating-productContainer_${idToTokenOpticsMap[optic.id?string]}">
                                <div class="productSkills" id="0_productSkills_${idToTokenOpticsMap[optic.id?string]}">
                                    <div class="productRating">
                                        <input type="radio" name="star-5" value="5">
                                        <input type="radio" name="star-4" value="4">
                                        <input type="radio" name="star-3" value="3">
                                        <input type="radio" name="star-2" value="2">
                                        <input type="radio" name="star-1" value="1">
                                    </div>
                                </div>
                                <div class="non-selectable numberOptics" id="0_numberOptics_${idToTokenOpticsMap[optic.id?string]}">
                                <#if rating?is_hash>${rating.numberOpticIds}<#else>0</#if></div>
                            </div>

                            <#if rating?is_hash>
                                <#assign checkedStar = rating.averageStar?replace(",", ".")>
                            <#else>
                                <#assign checkedStar = "0">
                            </#if>
                            <#assign opticId = idToTokenOpticsMap[optic.id?string]>

                            <script>
                                function applyRating(containerId, averageRating) {
                                    const arithmeticMainAvrg = parseFloat(averageRating);
                                    const wholeMainPart = Math.floor(arithmeticMainAvrg);
                                    const decimalMainPart = arithmeticMainAvrg - wholeMainPart;

                                    const starsMain = document.querySelectorAll('#' + containerId + ' .productSkills .productRating input');

                                    starsMain.forEach((star, index) => {
                                        const starIndex = index + 1;

                                        if (starIndex <= wholeMainPart) {
                                            star.classList.add('highlight');
                                        } else if (starIndex === wholeMainPart + 1) {
                                            const partialMainFill = decimalMainPart * 100;
                                            star.style.setProperty('--fill-percentage', partialMainFill + "%");
                                            star.classList.add('partial-highlight');
                                        }
                                    });
                                }

                                applyRating(`rating-productContainer_${opticId}`, ${checkedStar});
                            </script>

                            <div class="custom-body">
                                <#assign processedRetailPrice = optic.retailPrice>
                                
                                <#if optic.opticsAddition.action != 0>
                                    <#assign discountedPrice = processedRetailPrice * (1 - (optic.opticsAddition.action / 100))>

                                    <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                                    <#assign processedRetailPrice = processedRetailPrice + "0">
                                    
                                    <div class="price-with-action-info" id="0_price-with-action-info_${idToTokenOpticsMap[optic.id?string]}">
                                        <p class="original-price">
                                            <span class="currency-textOrg"><a>${processedRetailPrice}</a></span> грн.
                                        </p>
                                        
                                        <div class="action-info-container">
                                        <#if actionLength == 2 || actionLength == 3>
                                            <svg class="action-info-icon_S2" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 562 512" fill="#000000" bx:transform="matrix(-1, 0, 0, -1, 0, 0)rotate(90)" xmlns:bx="https://boxy-svg.com">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier" style="transform-origin: 255.999px 256px;" transform="matrix(0, -1, 1.097658, 0, 25.001583, 0.000014)">
                                            <path style="fill:#be303b;" d="M427.66,84.342L350.509,7.193c-4.604-4.604-10.847-7.191-17.358-7.191h-77.149h-77.151 c-4.884,0-9.617,1.455-13.62,4.124c-1.334,0.89-2.587,1.915-3.738,3.065L84.341,84.342c-0.576,0.576-1.119,1.177-1.632,1.8 c-3.581,4.368-5.56,9.862-5.56,15.558v385.746c0,13.559,10.991,24.549,24.549,24.549l154.302,0.002l154.299,0.002 c6.512,0,12.756-2.589,17.358-7.191c4.604-4.604,7.191-10.849,7.191-17.358V101.701C434.85,95.191,432.264,88.946,427.66,84.342z"></path>
                                            <path style="fill:#be303b;" d="M292.824,148.762c0-0.635-0.016-1.267-0.047-1.895c-0.116-2.317-0.458-4.574-0.985-6.759 c-0.588-2.442-1.417-4.789-2.465-7.013c-0.195-0.414-0.401-0.82-0.609-1.226c-0.115-0.219-0.221-0.444-0.339-0.66 c-0.007-0.013-0.015-0.026-0.023-0.038c-4.254-7.808-11.248-13.906-19.695-16.998c-0.234-0.085-0.475-0.159-0.71-0.241 c-0.332-0.115-0.661-0.234-1-0.337c-0.172-0.054-0.349-0.098-0.52-0.149c-0.408-0.119-0.813-0.241-1.226-0.347 c-0.11-0.028-0.223-0.049-0.332-0.077c-0.481-0.119-0.961-0.234-1.45-0.336c-0.18-0.036-0.365-0.064-0.547-0.098 c-0.422-0.08-0.841-0.162-1.265-0.226c-0.277-0.043-0.558-0.07-0.836-0.106c-0.336-0.043-0.669-0.093-1.007-0.128 c-0.229-0.023-0.462-0.034-0.691-0.052c-0.393-0.033-0.784-0.069-1.182-0.09c-0.131-0.007-0.265-0.005-0.396-0.01 c-0.496-0.021-0.993-0.038-1.496-0.038v73.645C276.337,185.585,292.826,169.097,292.824,148.762z"></path>
                                            <path style="fill:#be303b;" d="M255.999,111.938c-20.335-0.002-36.822,16.487-36.82,36.822 c-0.002,20.341,16.484,36.827,36.823,36.823v-73.645H255.999z"></path>
                                            <g><path style="fill:#be303b;" d="M266.429,113.446c0.172,0.051,0.349,0.095,0.52,0.149 C266.778,113.542,266.601,113.498,266.429,113.446z"></path>
                                            <path style="fill:#be303b;" d="M288.356,131.172c0.008,0.013,0.016,0.025,0.023,0.038 C288.373,131.196,288.365,131.185,288.356,131.172z"></path>
                                            <path style="fill:#be303b;" d="M267.951,113.933c0.237,0.082,0.476,0.155,0.71,0.241 C268.428,114.089,268.187,114.015,267.951,113.933z"></path>
                                            <path style="fill:#be303b;" d="M264.871,113.022c0.11,0.028,0.223,0.049,0.332,0.077 C265.094,113.071,264.981,113.05,264.871,113.022z"></path>
                                            <path style="fill:#be303b;" d="M288.718,131.869c0.208,0.406,0.414,0.812,0.609,1.226 C289.132,132.681,288.926,132.273,288.718,131.869z"></path>
                                            <path style="fill:#be303b;" d="M291.792,140.108c0.525,2.185,0.867,4.442,0.985,6.759 C292.659,144.551,292.317,142.292,291.792,140.108z"></path>
                                            <path style="fill:#be303b;" d="M257.498,111.978c0.131,0.005,0.265,0.003,0.396,0.01 C257.763,111.981,257.629,111.983,257.498,111.978z"></path>
                                            <path style="fill:#be303b;" d="M262.875,112.59c0.182,0.034,0.367,0.061,0.547,0.098 C263.241,112.65,263.056,112.624,262.875,112.59z"></path>
                                            <path style="fill:#be303b;" d="M260.773,112.258c0.278,0.036,0.56,0.064,0.836,0.106 C261.333,112.321,261.051,112.294,260.773,112.258z"></path>
                                            <path style="fill:#be303b;" d="M259.076,112.076c0.229,0.02,0.462,0.029,0.691,0.052 C259.538,112.105,259.305,112.096,259.076,112.076z"></path>
                                            </g><path style="fill:#be303b;" d="M256.002,511.998V185.584c-20.34,0.003-36.825-16.482-36.823-36.823 c-0.002-20.335,16.485-36.823,36.82-36.822h0.003V0h-77.151c-6.512,0-12.756,2.586-17.358,7.191L84.341,84.342 c-4.605,4.604-7.191,10.849-7.191,17.358v385.746c0,13.559,10.991,24.549,24.549,24.549L256.002,511.998z"></path>
                                            </g><text style="white-space: pre; fill: #ffffff; font-family: Montserrat, sans-serif; font-size: 179px; font-weight: bold;" x="125.524" y="310.844">${optic.opticsAddition.action}%</text></svg>
                                        <#else>
                                            <svg class="action-info-icon_S1" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 480 512" fill="#000000" bx:transform="matrix(-1, 0, 0, -1, 0, 0)rotate(90)" xmlns:bx="https://boxy-svg.com">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier" style="transform-origin: 255.999px 256px;" transform="matrix(0, -1, 0.937502, 0, -15.998662, 0.000014)">
                                            <path style="fill:#be303b;" d="M427.66,84.342L350.509,7.193c-4.604-4.604-10.847-7.191-17.358-7.191h-77.149h-77.151 c-4.884,0-9.617,1.455-13.62,4.124c-1.334,0.89-2.587,1.915-3.738,3.065L84.341,84.342c-0.576,0.576-1.119,1.177-1.632,1.8 c-3.581,4.368-5.56,9.862-5.56,15.558v385.746c0,13.559,10.991,24.549,24.549,24.549l154.302,0.002l154.299,0.002 c6.512,0,12.756-2.589,17.358-7.191c4.604-4.604,7.191-10.849,7.191-17.358V101.701C434.85,95.191,432.264,88.946,427.66,84.342z"></path>
                                            <path style="fill:#be303b;" d="M292.824,148.762c0-0.635-0.016-1.267-0.047-1.895c-0.116-2.317-0.458-4.574-0.985-6.759 c-0.588-2.442-1.417-4.789-2.465-7.013c-0.195-0.414-0.401-0.82-0.609-1.226c-0.115-0.219-0.221-0.444-0.339-0.66 c-0.007-0.013-0.015-0.026-0.023-0.038c-4.254-7.808-11.248-13.906-19.695-16.998c-0.234-0.085-0.475-0.159-0.71-0.241 c-0.332-0.115-0.661-0.234-1-0.337c-0.172-0.054-0.349-0.098-0.52-0.149c-0.408-0.119-0.813-0.241-1.226-0.347 c-0.11-0.028-0.223-0.049-0.332-0.077c-0.481-0.119-0.961-0.234-1.45-0.336c-0.18-0.036-0.365-0.064-0.547-0.098 c-0.422-0.08-0.841-0.162-1.265-0.226c-0.277-0.043-0.558-0.07-0.836-0.106c-0.336-0.043-0.669-0.093-1.007-0.128 c-0.229-0.023-0.462-0.034-0.691-0.052c-0.393-0.033-0.784-0.069-1.182-0.09c-0.131-0.007-0.265-0.005-0.396-0.01 c-0.496-0.021-0.993-0.038-1.496-0.038v73.645C276.337,185.585,292.826,169.097,292.824,148.762z"></path>
                                            <path style="fill:#be303b;" d="M255.999,111.938c-20.335-0.002-36.822,16.487-36.82,36.822 c-0.002,20.341,16.484,36.827,36.823,36.823v-73.645H255.999z"></path>
                                            <g><path style="fill:#be303b;" d="M266.429,113.446c0.172,0.051,0.349,0.095,0.52,0.149 C266.778,113.542,266.601,113.498,266.429,113.446z"></path>
                                            <path style="fill:#be303b;" d="M288.356,131.172c0.008,0.013,0.016,0.025,0.023,0.038 C288.373,131.196,288.365,131.185,288.356,131.172z"></path>
                                            <path style="fill:#be303b;" d="M267.951,113.933c0.237,0.082,0.476,0.155,0.71,0.241 C268.428,114.089,268.187,114.015,267.951,113.933z"></path>
                                            <path style="fill:#be303b;" d="M264.871,113.022c0.11,0.028,0.223,0.049,0.332,0.077 C265.094,113.071,264.981,113.05,264.871,113.022z"></path>
                                            <path style="fill:#be303b;" d="M288.718,131.869c0.208,0.406,0.414,0.812,0.609,1.226 C289.132,132.681,288.926,132.273,288.718,131.869z"></path>
                                            <path style="fill:#be303b;" d="M291.792,140.108c0.525,2.185,0.867,4.442,0.985,6.759 C292.659,144.551,292.317,142.292,291.792,140.108z"></path>
                                            <path style="fill:#be303b;" d="M257.498,111.978c0.131,0.005,0.265,0.003,0.396,0.01 C257.763,111.981,257.629,111.983,257.498,111.978z"></path>
                                            <path style="fill:#be303b;" d="M262.875,112.59c0.182,0.034,0.367,0.061,0.547,0.098 C263.241,112.65,263.056,112.624,262.875,112.59z"></path>
                                            <path style="fill:#be303b;" d="M260.773,112.258c0.278,0.036,0.56,0.064,0.836,0.106 C261.333,112.321,261.051,112.294,260.773,112.258z"></path>
                                            <path style="fill:#be303b;" d="M259.076,112.076c0.229,0.02,0.462,0.029,0.691,0.052 C259.538,112.105,259.305,112.096,259.076,112.076z"></path>
                                            </g><path style="fill:#be303b;" d="M256.002,511.998V185.584c-20.34,0.003-36.825-16.482-36.823-36.823 c-0.002-20.335,16.485-36.823,36.82-36.822h0.003V0h-77.151c-6.512,0-12.756,2.586-17.358,7.191L84.341,84.342 c-4.605,4.604-7.191,10.849-7.191,17.358v385.746c0,13.559,10.991,24.549,24.549,24.549L256.002,511.998z"></path>
                                            </g><text style="white-space: pre; fill: #ffffff; font-family: Montserrat, sans-serif; font-size: 182px; font-weight: bold;" x="110.524" y="310.844">${optic.opticsAddition.action}%</text></svg>
                                        </#if>
                                        </div>
                                    </div>

                                    <#assign discountedPrice = discountedPrice?string["0.##"]>
                                    <#assign discountedPrice = discountedPrice?replace(",", ".")>

                                    <p class="price-text" style="margin-top: -4%;"><span class="currency-text"><a>${discountedPrice}</a></span> грн.</p>
                                <#else>
                                    <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                                    <#assign processedRetailPrice = processedRetailPrice + "0">
                                    <p class="price-text"><span class="currency-text"><a>${processedRetailPrice}</a></span> грн.</p>
                                </#if>

                                <#if optic.opticsAddition.quantity?? && optic.opticsAddition.quantity == 0>
                                    <p class="non-availability-text">ВІДСУТНІЙ</p>
                                <#else>
                                    <p class="availability-text">В НАЯВНОСТІ</p>
                                </#if>
                            </div>
                        </div>
                    </div>
                </div>
            </#if>
            </#list>
        <#else>
            <p>No Optics data available.</p>
        </#if>
    </div>

    <div id="pagination-container"></div>

    <div class="swiper-container-hueiner" style="margin-bottom: calc(100vw * 22 / 1366); margin-top: calc(100vw * 36 / 1366);">
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

    <script src="/js/jquery-3.7.1.min.js"></script>

    <script src="/js/catalog_optics/catalog_optics_by_brand.js"></script>
    <script src="/js/main_page/main_page_func.js"></script>
    <script src="/js/main_page/main_page_photo_shit.js"></script>
    <script src="/js/star_rating/number_optics_star.js"></script>
</@clo.pages>
