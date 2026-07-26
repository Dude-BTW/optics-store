<div class="row row-cols-2 row-cols-md-2 g-4 all-optics3">
    <#if allOptics3?? && allCardOptics3?? && allOptics3?size == allCardOptics3?size>
        <#list 0..(allOptics3?size - 1) as i>
            <div class="col" id="col-${i}">
                <div class="card card_AllOptics3 h-100 position-relative">
                    <#assign optic = allOptics3[i]>
                    <#assign cardOptics3 = allCardOptics3[i]>
                    <#assign processedRetailPrice = optic.retailPrice>
                    <#if optic.opticsAddition.action != 0>
                        <#assign discountedPrice = processedRetailPrice * (1 - (optic.opticsAddition.action / 100))>
                        <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                        <#assign processedRetailPrice = processedRetailPrice + "0">
                        <#assign discountedPrice = discountedPrice?string["0.##"]>
                        <#assign discountedPrice = discountedPrice?replace(",", ".")>

                        <div class="price-container">
                            <div class="triangle-container">
                                <div class="square-right"><span class="triangle-price-text"><span class="triangle-currency-text"><a>18${discountedPrice}</a></span> грн.</span></div>
                                <div class="triangle-square"></div>
                                <div class="triangle-circle"></div>
                                <div class="triangle-top"></div>
                                <div class="triangle-bottom"></div>
                            </div>
                        </div>
                    <#else>
                        <#assign processedRetailPrice = processedRetailPrice?replace(",", ".")>
                        <#assign processedRetailPrice = processedRetailPrice + "0">

                        <div class="price-container">
                            <div class="triangle-container">
                                <div class="square-right"><span class="triangle-price-text"><span class="triangle-currency-text"><a>18${processedRetailPrice}</a></span> грн.</span></div>
                                <div class="triangle-square"></div>
                                <div class="triangle-circle"></div>
                                <div class="triangle-top"></div>
                                <div class="triangle-bottom"></div>
                            </div>
                        </div>
                    </#if>

                    <a>
                        <img id="opticImage_${idToTokenOpticsMap[optic.id?string]}"
                         src="${optic.opticsAddition.fullPathImage1?default("")}"
                          class="card-img-top custom-image-size_AllOptics3 non-selectable"
                           alt="${optic.fullName}">
                    </a>
                    <div class="custom-card">
                        <h5 class="card-title_AllOptics3" id="card-title-optics3">
                            <#assign splitPosition = -1>
                            <#assign hasEnglishChar = false>
                            
                            <#list 0..(optic.fullName?length - 1) as j>
                                <#assign char = optic.fullName?substring(j, j + 1)>
                                <#if char?matches("[A-Za-z]")>
                                    <#assign splitPosition = j>
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
                        <div class="custom-body_AllOptics3" id="custom-body-optics3">
                            ${cardOptics3.descriptionOptics}
                        </div>
                    </div>
                </div>
            </div>
        </#list>
    <#else>
        <p>No Optics or Card Optics data available.</p>
    </#if>
</div>
