<#--
  REVIEWS PAGE TEMPLATE: Displays the overall store statistics, including average rating and
  distribution histograms. Renders individual review components with nested responses and voting
  elements (likes/dislikes). Supports CRUD operations for reviews and dynamic data sorting.
-->
<#import "templ/templ.ftl" as frsg>
<@frsg.pages
    showCartPopup               = false
    showGlobalReaptchaPopup     = true
    showReaptchaPopup           = false
    showReportAvailabilityPopup = false
    showRatingGlobalPopup       = true
    showMainTopPopup            = false
    showProductFilter1Popup     = false
    showProductFilter2Popup     = false>

    <link rel="stylesheet" type="text/css" href="/css/main_page_func/all_optics_3.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_card.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/main_body.css">
    <link rel="stylesheet" type="text/css" href="/css/main_page_func/star_rating.css">

    <!-- One Column -->
    <#assign totalStarsPrice = 0>
    <#assign totalCountStarPrice = 0>

    <#assign totalStarsQuality = 0>
    <#assign totalCountStarQuality = 0>

    <#assign totalStarsDelivery = 0>
    <#assign totalCountStarDelivery = 0>

    <#assign totalStarsStoreRating = 0>
    <#assign totalCountStarStoreRating = 0>

    <#list allRatingGlobal as rating>    
        <#assign totalStarsPrice += rating.starPrice>
        <#assign totalCountStarPrice += 1>

        <#assign totalStarsQuality += rating.starProductQuality>
        <#assign totalCountStarQuality += 1>

        <#assign totalStarsDelivery += rating.starDelivery>
        <#assign totalCountStarDelivery += 1>

        <#assign totalStarsStoreRating += rating.starStoreRating>
        <#assign totalCountStarStoreRating += 1>
    </#list>


    <#assign arithmeticMainAvrg_1 = totalStarsPrice / totalCountStarPrice>
    <#assign arithmeticMainAvrg_2 = totalStarsQuality / totalCountStarQuality>
    <#assign arithmeticMainAvrg_3 = totalStarsDelivery / totalCountStarDelivery>
    <#assign arithmeticMainAvrg_4 = totalStarsStoreRating / totalCountStarStoreRating>

    <#assign arithmeticMainAvrg_1 = arithmeticMainAvrg_1?string("0.0")?replace(",", ".")>
    <#assign arithmeticMainAvrg_2 = arithmeticMainAvrg_2?string("0.0")?replace(",", ".")>
    <#assign arithmeticMainAvrg_3 = arithmeticMainAvrg_3?string("0.0")?replace(",", ".")>
    <#assign arithmeticMainAvrg_4 = arithmeticMainAvrg_4?string("0.0")?replace(",", ".")>


    <!-- Two Column -->
    <#assign totalAverageGlobalStar = 0>
    <#assign totalCount = 0>

    <#assign starCount_1 = 0>
    <#assign starCount_2 = 0>
    <#assign starCount_3 = 0>
    <#assign starCount_4 = 0>
    <#assign starCount_5 = 0>

    <#list allRatingGlobalAverage as rating>
        <#assign totalAverageGlobalStar += rating.averageGlobalStar>
        <#assign totalCount += 1>

        <#if (rating.averageGlobalStar >= 0.5) && (rating.averageGlobalStar <= 1)>
            <#assign starCount_1 += 1>
        <#elseif (rating.averageGlobalStar >= 1.5) && (rating.averageGlobalStar <= 2)>
            <#assign starCount_2 += 1>
        <#elseif (rating.averageGlobalStar >= 2.5) && (rating.averageGlobalStar <= 3)>
            <#assign starCount_3 += 1>
        <#elseif (rating.averageGlobalStar >= 3.5) && (rating.averageGlobalStar <= 4)>
            <#assign starCount_4 += 1>
        <#elseif (rating.averageGlobalStar >= 4.5) && (rating.averageGlobalStar <= 5)>
            <#assign starCount_5 += 1>
        </#if>
    </#list>

    <#assign arithmeticAverage = totalAverageGlobalStar / totalCount>
    <#assign arithmeticAverage = arithmeticAverage?string("0.0")?replace(",", ".")>

    <div class="switching-pages" style="margin-top: calc(100vw * 24 / 1366); margin-bottom: calc(100vw * -26.5 / 1366);">
        <a class="switching-pages-button" id="home-page-button" style="margin-left: calc(100vw * 10 / 1366);" href="/">
            <img src="/images/System_Interface/feedback_control/home_page/home_page.svg" alt="Home Page" class="switching-pages-icon">
        </a>
        <p class="hyphen">/</p>
        <p class="p-none-a">ВІДГУКИ ПРО МАГАЗИН</p>
    </div>

    <div class="row row-cols-1 row-cols-md-2 g-4 all-optics3 main-rating-star">
        <div class="col">

            <#--  1 Col  -->
            <div class="card h-100 position-relative">
                <table class="main-rating-table">
                <tbody>
                    <tr>
                    <td class="one-column">
                        <div class="mainContainerHuiner">
                            <svg class="arithmetic-average" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                            <g><ellipse style="fill: #9c3139;" cx="377.5" cy="422.5" rx="377.5" ry="377.5"></ellipse>
                            <g transform="matrix(1, 0, 0, 1, 5.5, -22.5)">
                            <ellipse style="fill: #e6746d;" cx="400" cy="400" rx="377.5" ry="377.5"></ellipse>
                            <g transform="matrix(1, 0, 0, 1, 5, 5)">
                            <ellipse style="fill: #be303b;" cx="395" cy="395" rx="305" ry="305"></ellipse>
                            <text style="white-space: pre; fill: #ffffff; font-family: Montserrat, sans-serif; font-size: 240px;" x="228.19" y="478.835">${arithmeticAverage}</text>
                            </g></g></g></svg>

                            <p class="total-count">Кількість відгуків ${totalCount}</p>

                            <div class="non-selectable mainContainer" id="rating-mainContainer">
                                <div class="mainSkills">
                                    <div class="mainRating">
                                        <input type="radio" name="star-5" value="5">
                                        <input type="radio" name="star-4" value="4">
                                        <input type="radio" name="star-3" value="3">
                                        <input type="radio" name="star-2" value="2">
                                        <input type="radio" name="star-1" value="1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="two-column">

                        <#list 1..5 as i>
                            <div class="progress-wrapper" id="progress-wrapper_${i}">
                                <div class="rating" style="text-align: left;">
                                    <input type="radio">
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                        style="<#if i == 1>width: ${(starCount_5 / totalCount * 100)?round}%;
                                            <#elseif i == 2>width: ${(starCount_4 / totalCount * 100)?round}%;
                                            <#elseif i == 3>width: ${(starCount_3 / totalCount * 100)?round}%;
                                            <#elseif i == 4>width: ${(starCount_2 / totalCount * 100)?round}%;
                                            <#elseif i == 5>width: ${(starCount_1 / totalCount * 100)?round}%;
                                            </#if>">
                                    </div>
                                </div>
                                <div class="numb-progress" style="text-align: right;
                                    <#if i == 5>margin-top: 1%;
                                    </#if>">
                                    <#if i == 1>${(starCount_5 / totalCount * 100)?round}%
                                    <#elseif i == 2>${(starCount_4 / totalCount * 100)?round}%
                                    <#elseif i == 3>${(starCount_3 / totalCount * 100)?round}%
                                    <#elseif i == 4>${(starCount_2 / totalCount * 100)?round}%
                                    <#elseif i == 5>${(starCount_1 / totalCount * 100)?round}%
                                    </#if>
                                </div>
                            </div>
                        </#list>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
        
        <#--  2 Col  -->
        <div class="col">
            <div class="card h-100 position-relative">
                <div class="main-rating-table">
                    <#list 1..4 as i>
                        <div class="progress-wrapper" id="rating-progressWrapper_${i}"
                        style="<#if i == 1>margin-top: calc(100vw * 7 / 1366);
                                <#elseif i != 1>margin-top: calc(100vw * -4 / 1366);</#if>">

                            <div class="rating" style="text-align: left;
                                                       margin-left: calc(100vw * -2 / 1366);
                                                       margin-right: calc(100vw * 27 / 1366);
                                                       margin-bottom: 0;
                                                       white-space: nowrap;">
                                <p class="name-rating">
                                    <#if i == 1>Ціна
                                    <#elseif i == 2>Якість товару
                                    <#elseif i == 3>Доставка
                                    <#elseif i == 4>Оцінка магазину</#if>
                                </p>
                            </div>

                            <div class="dash-placeholder">
                                <p class="dash"></p>
                            </div>

                            <div class="non-selectable mainContainer rating-mainContainer" id="rating-mainContainer_${i}"
                                 style="text-align: right;
                                        margin-left: calc(100vw * 20 / 1366);
                                        margin-bottom: calc(100vw * 6 / 1366);">
                                <div class="mainSkills">
                                    <div class="mainRating">
                                        <input type="radio" name="star-5" value="5">
                                        <input type="radio" name="star-4" value="4">
                                        <input type="radio" name="star-3" value="3">
                                        <input type="radio" name="star-2" value="2">
                                        <input type="radio" name="star-1" value="1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </#list>

                    <button id="write-review" class="btn">Написати відгук</button>
                </div>
            </div>
        </div>
    </div>

    <div class="dropdown1-feedback">
        <div class="dropdown1" style="font-size: calc(100vw * 13 / 1366); margin-right: calc(100vw * 10 / 1366);">
            <span class="non-selectable larger-click-area-nav1" id="dropdown1-span-feedback">
                15&nbsp;
                <img src="/images/System_Interface/dropdown_symbols/down_red.svg" alt="Dropdown" class="dropdown1-icon"
                 style="margin-bottom: calc(100vw * 0 / 1366);">
            </span>
            <div class="dropdown1-content dropdown1-content-button" id="dropdown1-content-feedback">
                <button type="submit" class="non-selectable"
                name="listFeedbackSize" id="list-feedback-15" value="15">15</button>
                <button type="submit" class="non-selectable"
                name="listFeedbackSize" id="list-feedback-25" value="25">25</button>
                <button type="submit" class="non-selectable"
                name="listFeedbackSize" id="list-feedback-50" value="50">50</button>
                <button type="submit" class="non-selectable"
                name="listFeedbackSize" id="list-feedback-75" value="75">75</button>
                <button type="submit" class="non-selectable"
                name="listFeedbackSize" id="list-feedback-100" value="100">100</button>
            </div>
        </div>

        <div class="dropdown1" style="font-size: calc(100vw * 13 / 1366); margin-right: -0.1%">
            <span class="non-selectable larger-click-area-nav1" id="dropdown2-span-feedback">
                <img src="/images/System_Interface/sorting_left.svg" alt="Dropdown"
                 style="width: calc(100vw * 17 / 1366); height: auto; margin-bottom: calc(100vw * 3 / 1366);">
                &nbsp;Сортування&nbsp;
                <img src="/images/System_Interface/dropdown_symbols/down_red.svg" alt="Dropdown" class="dropdown1-icon"
                 style="margin-bottom: calc(100vw * 0 / 1366);">
            </span>
            <div class="dropdown1-content dropdown1-content-button" id="dropdown2-content-feedback">
                <button type="submit" class="non-selectable"
                name="sortOrder" value="new" id="button-sort-new">Нові зверху</button>
                <button type="submit" class="non-selectable"
                name="sortOrder" value="old" id="button-sort-old">Старі зверху</button>
            </div>
        </div>
    </div>

    <div class="row row-cols-1 row-cols-md-1 g-4 all-optics3 main-rating-star" id="feedback-rating-star" style="margin-top:-3.1%">
        <#if allRatingGlobal?? && allRatingGlobalByClient?? && allRatingGlobal?size == allRatingGlobalByClient?size>
            <#assign idxsRatGlob = (0..(allRatingGlobal?size - 1))?filter(i -> allRatingGlobal[i].isVisible)>
            <#assign guestIdxsRatGlob = []>
            <#assign userIdxsRatGlob = []>

            <#if guestId??>
                <#assign guestIdxsRatGlob = idxsRatGlob?filter(i ->
                    allRatingGlobal[i].clientId == guestId
                    && allRatingGlobal[i].accountUsed == false
                )>

                <#if userId??>
                    <#assign userIdxsRatGlob = idxsRatGlob?filter(i ->
                        allRatingGlobal[i].clientId == userId
                        && allRatingGlobal[i].accountUsed == true
                    )>

                    <#assign otherIdxs = idxsRatGlob?filter(i ->
                        !guestIdxsRatGlob?seq_contains(i)
                        && !userIdxsRatGlob?seq_contains(i)
                    )>
                <#else>
                    <#assign otherIdxs = idxsRatGlob?filter(i ->
                        !guestIdxsRatGlob?seq_contains(i)
                    )>
                </#if>

                <#assign allIdxsRatGlob = userIdxsRatGlob + guestIdxsRatGlob + otherIdxs>
                <#list allIdxsRatGlob as i><@renderRatingGlobal i/></#list>
            <#else>
                <#list idxsRatGlob as i><@renderRatingGlobal i/></#list>
            </#if>

            <#macro renderRatingGlobal i>
                <#if allRatingGlobal[i]?exists>
                    <#assign rating = allRatingGlobal[i]>
                    <#assign ratingGlobal = allRatingGlobalAverage?filter(rg -> idToTokenRatingGlobalMap[rg.id?string] == idToTokenRatingGlobalMap[rating.id?string])?first>

                    <div class="vertical-line<#if (i > 15)> hidden-line</#if>"
                     data-index="${i}" data-date="${rating.feedbackDate}">
                        <#--  1 Col  -->
                        <div id="feedback-rating-star-col_${i}" class="col">
                            <div class="card-container">
                            <div class="card position-relative"
                                <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)>style="background-color: #f4f5f7;"</#if>>
                                <div class="main-rating-table" id="main-rating-table_${i}"
                                    style="margin-left: 2.5%; margin-right: 2.5%; margin-top: 2.5%; margin-bottom: 0%;">
                                    <div class="progress-wrapper" style="margin-top: 0%;">

                                        <#assign clientOrGuestMap = allRatingGlobalByClient?filter(m -> m.id == rating.id)?first>
                                        <#assign type = clientOrGuestMap.type>
                                        <#assign data = clientOrGuestMap.data>

                                        <#if type == "Client">
                                            <div class="rating ava-feedback" style="text-align: left;
                                                <#if userIdxsRatGlob?seq_contains(i)> background-color: #dee2e7;</#if>">
                                                <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                                 style="width: calc(100vw * 20 / 1366); heigth: auto">
                                            </div>
                                        </#if>

                                        <#if type == "Client">
                                            <div class="name-feedback">
                                                ${data.firstName} ${data.lastName}
                                            </div>
                                        <#elseif type == "GuestRatingGlob">
                                            <div class="name-feedback" style="margin-left: 0.5%;">
                                                ${data.guestName}
                                            </div>
                                        </#if>

                                        <#assign feedbackOnlyDateParts = rating.feedbackDate?substring(0, 10)?split("-")>
                                        <#assign feedbackOnlyDate = feedbackOnlyDateParts[2] + "-" + feedbackOnlyDateParts[1] + "-" + feedbackOnlyDateParts[0]>

                                        <div class="data-feedback" style="text-align: right;">
                                            ${feedbackOnlyDate}
                                        </div>
                                    </div>

                                    <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)><style>
                                        #rating-feedbackContainer_1_${idToTokenRatingGlobalMap[rating.id?string]} .mainSkills .mainRating input::before {
                                            content: '\f005';
                                            position: absolute;
                                            font-family: fontAwesome;
                                            font-size: calc(100vw * 19 / 1366);
                                            color: #cdced0;
                                            transition: 0.5s;
                                        }
                                        #rating-feedbackContainer_1_${idToTokenRatingGlobalMap[rating.id?string]} .mainSkills .mainRating input.highlight::before {
                                            color: orange;
                                        }
                                        #rating-feedbackContainer_1_${idToTokenRatingGlobalMap[rating.id?string]} .mainSkills .mainRating input.partial-highlight::before {
                                            background: linear-gradient(to right, orange var(--fill-percentage), #cdced0 var(--fill-percentage));
                                            -webkit-background-clip: text;
                                            background-clip: text;
                                            color: transparent;
                                        }
                                    </style></#if>

                                    <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)>
                                        <div class="feedback-actions">
                                    </#if>
                                    <div class="non-selectable mainContainer" id="rating-feedbackContainer_1_${idToTokenRatingGlobalMap[rating.id?string]}"
                                    style="text-align: left; margin-left: 0%; margin-top: 1.2%;">
                                        <div class="mainSkills">
                                            <div class="mainRating">
                                                <input type="radio" name="star-5" value="5">
                                                <input type="radio" name="star-4" value="4">
                                                <input type="radio" name="star-3" value="3">
                                                <input type="radio" name="star-2" value="2">
                                                <input type="radio" name="star-1" value="1">
                                            </div>
                                        </div>
                                    </div>

                                    <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)>
                                        <button class="edit-feedback" id="edit-feedback-rating-star_${idToTokenRatingGlobalMap[rating.id?string]}"
                                         data-num-col="${i}"
                                         data-star-price="${rating.starPrice?string("0.#")?replace(",", ".")}"
                                         data-star-product-quality="${rating.starProductQuality?string("0.#")?replace(",", ".")}"
                                         data-star-delivery="${rating.starDelivery?string("0.#")?replace(",", ".")}"
                                         data-star-store-rating="${rating.starStoreRating?string("0.#")?replace(",", ".")}"
                                         data-account-used="${rating.accountUsed?string("true","false")}"
                                         data-feedback="${rating.feedback?html}"
                                         data-client-name="<#if type == "Client">${data.firstName} ${data.lastName}<#elseif type == "GuestRatingGlob">${data.guestName}</#if>">
                                            <img src="/images/System_Interface/feedback_control/edit/edit.svg" alt="Edit Feedback">
                                        </button>

                                        <button class="delete-feedback" id="delete-feedback-rating-star_${idToTokenRatingGlobalMap[rating.id?string]}">
                                            <img src="/images/System_Interface/feedback_control/delete/delete.svg" alt="Delete Feedback">
                                        </button>
                                        </div>
                                    </#if>

                                    <#assign ratinFeedback = ratingGlobal.averageGlobalStar>
                                    <#assign ratinFeedback = ratinFeedback?string("0.0")?replace(",", ".")>

                                    <#assign ratingGlobalId = idToTokenRatingGlobalMap[rating.id?string]>

                                    <script>
                                        function applyFeedbackRating(containerId, averageRating) {
                                            const arithmeticMainAvrg = parseFloat(averageRating);
                                            const wholeMainPart = Math.floor(arithmeticMainAvrg);
                                            const decimalMainPart = arithmeticMainAvrg - wholeMainPart;

                                            const starsMain = document.querySelectorAll('#rating-feedbackContainer_1_' + containerId + ' .mainSkills .mainRating input');

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

                                        applyFeedbackRating(`${ratingGlobalId}`, ${ratinFeedback});
                                    </script>

                                    <#assign likeIcon = "/images/System_Interface/feedback_control/like/like.svg">
                                    <#assign dislikeIcon = "/images/System_Interface/feedback_control/dislike/dislike.svg">

                                    <#if guestId??>
                                    <#list allLikeDislikeGlobal as likeDislikeGlobal>
                                    <#if idToTokenRatingGlobalMap[likeDislikeGlobal.ratingGlobal.id?string] == idToTokenRatingGlobalMap[rating.id?string]>
                                    <#if likeDislikeGlobal.clientId == guestId>
                                        <#if likeDislikeGlobal.liked?string('true', 'false') == "true">
                                            <#assign likeIcon = "/images/System_Interface/feedback_control/like/like_fill.svg">
                                        <#elseif likeDislikeGlobal.disliked?string('true', 'false') == "true">
                                            <#assign dislikeIcon = "/images/System_Interface/feedback_control/dislike/dislike_fill.svg">
                                        </#if>
                                    </#if>
                                    </#if>
                                    </#list>
                                    </#if>

                                    <div class="feedback-container">
                                        <p class="feedback-text feedback-text-global"
                                        id="feedback-text-global_${idToTokenRatingGlobalMap[rating.id?string]}">${rating.feedback?html}</p>
                                        <table class="feedback-buttons">
                                        <tbody>
                                        <td>
                                            <button id="likeGlobalButton_${idToTokenRatingGlobalMap[rating.id?string]}" class="like-button" data-rating-global-id="${idToTokenRatingGlobalMap[rating.id?string]}">
                                                <img src="${likeIcon}" alt="Like" class="like-icon">
                                                <p class="like-dislike-num" id="likeGlobal-num_${idToTokenRatingGlobalMap[rating.id?string]}">
                                                    ${likeGlobalCounts[rating.id?string]!0}
                                                </p>
                                            </button>
                                        </td>
                                        <td class="dislike-td">
                                            <button id="dislikeGlobalButton_${idToTokenRatingGlobalMap[rating.id?string]}" class="dislike-button" data-rating-global-id="${idToTokenRatingGlobalMap[rating.id?string]}">
                                                <img src="${dislikeIcon}" alt="Dislike" class="dislike-icon">
                                                <p class="like-dislike-num" id="dislikeGlobal-num_${idToTokenRatingGlobalMap[rating.id?string]}">
                                                    ${dislikeGlobalCounts[rating.id?string]!0}
                                                </p>
                                            </button>
                                        </td>
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                                <div class="more-content-feedback-container-MAX">
                                    <div class="more-content-feedback-container"
                                        <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)>
                                        style="background: linear-gradient(
                                            to top,
                                            rgba(244, 245, 247, 1) 0%,
                                            rgba(244, 245, 247, 0.8) 50%,
                                            rgba(244, 245, 247, 0) 100%);"
                                        </#if>>
                                        
                                        <button class="more-content-feedback-button"
                                        id="more-content-feedback-button_${idToTokenRatingGlobalMap[rating.id?string]}"
                                        onclick="toggleMoreContentFeedback(this)">
                                            <img src="/images/System_Interface/feedback_control/more_content.svg"
                                            alt="More Content Feedback Button">
                                            <span class="gradient-hover"></span>
                                            <span class="gradient-active"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <#-- 2 Col -->
                        <#if rating.feedbackAdmin?has_content>
                            <div class="col" style="width: 95%; margin-top: calc(100vw * 24 / 1366); margin-left: auto;">
                                <div class="card h-100 position-relative" style="border-radius: calc(100vw * 10 / 1366); border: calc(100vw * 1 / 1366) solid #dfdfdf
                                    <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)> background-color: #f4f5f7;</#if>">
                                    <div class="main-rating-table"
                                        style="margin-left: 2.5%; margin-right: 2.5%; margin-top: 0.2%; margin-bottom: 2.05%;">
                                        <div class="progress-wrapper" style="margin-top: 0%;">
                                            <div class="feedback-container">
                                                <p class="feedback-text feedback-text-global"
                                                style="margin-right: 0%; margin-top: 0%; margin-bottom: 0%;"
                                                >${rating.feedbackAdmin?html}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </#if>
                    </div>
                </#if>
            </#macro>
        <#else>
            <p>No Response data available.</p>
        </#if>
    </div>


    <script>
        window.addEventListener('load', function() {
            var dropdown1 = document.querySelectorAll('.dropdown1-feedback .dropdown1');

            dropdown1.forEach(function(dropdown) {
                var span1 = dropdown.querySelector('#dropdown1-span-feedback');
                var content1 = dropdown.querySelector('#dropdown1-content-feedback');

                if (span1 && content1) {
                    content1.style.width = span1.offsetWidth + 'px';
                }
            });

            var dropdown2 = document.querySelectorAll('.dropdown1-feedback .dropdown1');

            dropdown2.forEach(function(dropdown) {
                var span2 = dropdown.querySelector('#dropdown2-span-feedback');
                var content2 = dropdown.querySelector('#dropdown2-content-feedback');

                if (span2 && content2) {
                    content2.style.width = span2.offsetWidth + 'px';
                }
            });
        });

        document.addEventListener("DOMContentLoaded", () => {
            const arithmeticAverage = parseFloat("${arithmeticAverage}");

            const wholePart = Math.floor(arithmeticAverage);
            const decimalPart = arithmeticAverage - wholePart;

            const stars = document.querySelectorAll('#rating-mainContainer .mainSkills .mainRating input');

            stars.forEach((star, index) => {
                const starIndex = index + 1;

                if (starIndex <= wholePart) {
                    star.classList.add('highlight');
                } else if (starIndex === wholePart + 1) {
                    const partialFill = decimalPart * 100;
                    star.style.setProperty('--fill-percentage', partialFill + "%");
                    star.classList.add('partial-highlight');
                }
            });


            function applyRating(containerId, averageRating) {
                const arithmeticMainAvrg = parseFloat(averageRating);
                const wholeMainPart = Math.floor(arithmeticMainAvrg);
                const decimalMainPart = arithmeticMainAvrg - wholeMainPart;

                const starsMain = document.querySelectorAll('#' + containerId + ' .mainSkills .mainRating input');

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

            applyRating('rating-mainContainer_1', "${arithmeticMainAvrg_1}");
            applyRating('rating-mainContainer_2', "${arithmeticMainAvrg_2}");
            applyRating('rating-mainContainer_3', "${arithmeticMainAvrg_3}");
            applyRating('rating-mainContainer_4', "${arithmeticMainAvrg_4}");
        });
    </script>


    <script src="/js/jquery-3.7.1.min.js"></script>
    
    <script>
        let likeGlobalCounts = {
        <#list likeGlobalCounts?keys as id>
            "${idToTokenRatingGlobalMap[id]?string}": ${likeGlobalCounts[id]!0}<#if id_has_next>,</#if>
        </#list>
        };
        let dislikeGlobalCounts = {
        <#list dislikeGlobalCounts?keys as id>
            "${idToTokenRatingGlobalMap[id]?string}": ${dislikeGlobalCounts[id]!0}<#if id_has_next>,</#if>
        </#list>
        };
    </script>

    <script type="module" src="/js/star_rating/star_rating_global.js"></script>
    <script src="/js/star_rating/number_optics_star.js"></script>

</@frsg.pages>
