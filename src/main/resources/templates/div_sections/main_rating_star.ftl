<#--
  STORE STATISTICS & FEEDBACK COMPONENT: Renders the overall store rating, average score, and
  distribution histogram (1 to 5 stars). Contains the initialization logic for the feedback
  modal window, supporting asynchronous UI state updates during CRUD operations as outlined
  in the platform's architecture.
-->
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


<div class="non-selectable carousel-controls" id="rightArrowControls" style="margin-bottom: calc(100vw * -29 / 1366);">
    <a href="/reviews_the_store">
        <div class="rightArrowText">
            Переглянути всі відгуки
        </div>
    </a>
    <a href="/reviews_the_store">
        <div class="rightArrowNext"></div>
    </a>
</div>

<div class="row row-cols-1 row-cols-md-2 g-4 main-rating-star" id="main-rating-star-Card_1-2">
    <div class="col">

        <#--  1 Col  -->
        <div class="card h-100 position-relative" id="main-rating-star-Card_1">
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
        <div class="card h-100 position-relative" id="main-rating-star-Card_2">
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


<div class="row row-cols-1 row-cols-md-3 g-4 main-rating-star" id="feedback-mainRating-star">
    <#if allRatingGlobal?? && allRatingGlobalByClient?? && allRatingGlobal?size == allRatingGlobalByClient?size>
        <#assign idxsRatGlob = 0..(allRatingGlobal?size - 1)>
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
            <#list allIdxsRatGlob as i>
                <#if (i <= 5) ><@renderRatingGlobal i/></#if>
            </#list>
        <#else>
            <#list idxsRatGlob as i>
                <#if (i <= 5) ><@renderRatingGlobal i/></#if>
            </#list>

        </#if>

        <#macro renderRatingGlobal i>
            <#assign rating = allRatingGlobal[i]>
            <#assign ratingGlobal = allRatingGlobalAverage?filter(rg -> idToTokenRatingGlobalMap[rg.id?string] == idToTokenRatingGlobalMap[rating.id?string])?first>
            <div class="col <#if (i > 2)>hidden-col-MratingStar</#if>" id="col_${i}">
                <div class="card h-100 position-relative"
                    <#if userIdxsRatGlob?seq_contains(i) || guestIdxsRatGlob?seq_contains(i)>style="background-color: #f4f5f7;"</#if>>
                    <div class="main-rating-table" id="main-rating-table_${i}"
                        style="margin-left: 7.5%; margin-right: 7.5%; margin-top: 7.5%; margin-bottom: 1.5%;">
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
                                <div class="name-feedback" style="margin-left: 5.2%;">
                                    ${data.firstName} ${data.lastName}
                                </div>
                            <#elseif type == "GuestRatingGlob">
                                <div class="name-feedback" style="margin-left: 1.5%;">
                                    ${data.guestName}
                                </div>
                            </#if>

                            <#assign feedbackOnlyDateParts = rating.feedbackDate?substring(0, 10)?split("-")>
                            <#assign feedbackOnlyDate = feedbackOnlyDateParts[2] + "-" + feedbackOnlyDateParts[1] + "-" + feedbackOnlyDateParts[0]>

                            <div class="data-feedback data-feedback-global-main" style="text-align: right;">
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

                        <div class="non-selectable mainContainer" id="rating-feedbackContainer_1_${idToTokenRatingGlobalMap[rating.id?string]}"
                        style="text-align: left; margin-left: 0%; margin-top: 4%; margin-bottom: 1.2%;">
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
                        
                        <p class="feedback-text">${rating.feedback?html}</p>
                    </div>
                </div>
            </div>
        </#macro>
    <#else>
        <p>No Response data available.</p>
    </#if>

    <button id="show-more-feedback" class="btn">
        <img src="/images/System_Interface/more.svg" alt="More" class="more-icon">
    </button>
</div>


<script>
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
