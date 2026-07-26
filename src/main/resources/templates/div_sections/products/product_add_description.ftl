<!-- Product Characteristics -->
<div class="row row-cols-1 row-cols-md-1 g-4 all-optics3 main-rating-star">
<#if allOpticsIdentical??>
<#assign visibleIndex2 = 0>
<#list 0..(allOpticsIdentical?size - 1) as i>
<#if allOpticsIdentical[i]?exists>
<#assign optic = allOpticsIdentical[i]>
    <div class="col" id="optic-characteristic_${idToTokenOpticsMap[optic.id?string]}" <#if visibleIndex2 != 0>style="display: none;"</#if>>
        <div class="card h-100 position-relative">
        <div class="character-maximus-container">
            <p class="characteristic-title">Характеристики</p>

            <div class="characteristic-container">
                <#if optic.brand?has_content><div class="characteristic-optic">
                <p class="character1-optic">Бренд</p><p class="character2-optic">${optic.brand}</p></div></#if>

                <#if optic.opticsAddition.frameShape?has_content><div class="characteristic-optic">
                <p class="character1-optic">Форма оправи</p></p><p class="character2-optic">${optic.opticsAddition.frameShape?cap_first}</p></div></#if>

                <#if optic.opticsAddition.faceShape?has_content><div class="characteristic-optic">
                <p class="character1-optic">Форма обличчя</p></p><p class="character2-optic">${optic.opticsAddition.faceShape?cap_first}</p></div></#if>

                <#if optic.gender?has_content><div class="characteristic-optic">
                <p class="character1-optic">Стать</p></p><p class="character2-optic">${optic.gender?cap_first}</p></div></#if>

                <#if optic.opticsAddition.colorName2?has_content><div class="characteristic-optic">
                <p class="character1-optic">Колір оправи</p></p><p class="character2-optic">${optic.opticsAddition.colorName2?cap_first}</p></div></#if>

                <#if optic.opticsAddition.colorName1?has_content><div class="characteristic-optic">
                <p class="character1-optic">Колір лінз</p></p><p class="character2-optic">${optic.opticsAddition.colorName1?cap_first}</p></div></#if>

                <#if optic.eyeglass?has_content><div class="characteristic-optic">
                <p class="character1-optic">Лінза</p></p><p class="character2-optic">${optic.eyeglass?cap_first}</p></div></#if>

                <#if optic.material?has_content><div class="characteristic-optic">
                <p class="character1-optic">Матеріал оправи</p></p><p class="character2-optic">${optic.material?cap_first}</p></div></#if>

                <#if optic.opticsAddition.frameType?has_content><div class="characteristic-optic">
                <p class="character1-optic">Вид оправи</p></p><p class="character2-optic">${optic.opticsAddition.frameType?cap_first}</p></div></#if>

                <#if optic.opticsAddition.eyepieceSize?has_content><div class="characteristic-optic">
                <p class="character1-optic">Розмір окуляра</p></p><p class="character2-optic">${optic.opticsAddition.eyepieceSize}</p></div></#if>

                <#if optic.opticsAddition.earringSize?has_content><div class="characteristic-optic">
                <p class="character1-optic">Розмір завушника</p></p><p class="character2-optic">${optic.opticsAddition.earringSize}</p></div></#if>

                <#if optic.opticsAddition.bridgeSize?has_content><div class="characteristic-optic">
                <p class="character1-optic">Розмір мостика</p></p><p class="character2-optic">${optic.opticsAddition.bridgeSize}</p></div></#if>

                <#if optic.polarization?has_content><div class="characteristic-optic">
                <p class="character1-optic">Поляризація</p></p><p class="character2-optic">
                <#if optic.polarization == "есть">Наявний<#elseif optic.polarization == "нет">Немає<#else>${optic.polarization?cap_first}</#if></p></div></#if>

                <#if optic.opticsAddition.photochrome?has_content><div class="characteristic-optic">
                <p class="character1-optic">Фотохром</p></p><p class="character2-optic">${optic.opticsAddition.photochrome?cap_first}</p></div></#if>

                <#if optic.manufacturer?has_content><div class="characteristic-optic">
                <p class="character1-optic">Виробник</p></p><p class="character2-optic">${optic.manufacturer}</p></div></#if>

                <#if optic.country?has_content><div class="characteristic-optic">
                <p class="character1-optic">Країна</p></p><p class="character2-optic">${optic.country?cap_first}</p></div></#if>

                <#if optic.opticsAddition.collection?has_content><div class="characteristic-optic">
                <p class="character1-optic">Колекція</p></p><p class="character2-optic">${optic.opticsAddition.collection}</p></div></#if>

                <#if optic.opticsAddition.properties?has_content><div class="characteristic-optic">
                <p class="character1-optic">Властивості</p></p><p class="character2-optic">${optic.opticsAddition.properties?cap_first}</p></div></#if>

                <#if optic.opticsAddition.clipOn?has_content><div class="characteristic-optic">
                <p class="character1-optic">CLIP-ON</p></p><p class="character2-optic">${optic.opticsAddition.clipOn?cap_first}</p></div></#if>
            </div>
        </div>
        </div>
    </div>
    <#assign visibleIndex2 = visibleIndex2 + 1>
</#if>
</#list>
<#else>
<p>No Optics data available.</p>
</#if>
</div>


<div style="margin-top: calc(100vw * -40 / 1366);"></div>

<!-- Product Characteristics -->
<div class="row row-cols-1 row-cols-md-1 g-4 all-optics3 main-rating-star">
<#if allOpticsIdentical??>
<#assign visibleIndex3 = 0>
<#list 0..(allOpticsIdentical?size - 1) as i>
<#if allOpticsIdentical[i]?exists>
<#assign optic = allOpticsIdentical[i]>
    <div class="col" id="optic-description_${idToTokenOpticsMap[optic.id?string]}" <#if visibleIndex3 != 0>style="display: none;"</#if>>
        <div class="card h-100 position-relative">
        <div class="character-maximus-container">
            <p class="characteristic-title">Опис товару</p>

            <div class="characteristic-container">
                <#if optic.opticsAddition.opticDescription?has_content>
                <p class="optic-description">${optic.opticsAddition.opticDescription}</p></#if>
            </div>
        </div>
        </div>
    </div>
    <#assign visibleIndex3 = visibleIndex3 + 1>
</#if>
</#list>
<#else>
<p>No Optics data available.</p>
</#if>
</div>
