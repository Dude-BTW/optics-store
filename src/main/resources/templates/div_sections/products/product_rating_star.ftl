<!-- Product Rating -->
<div class="row row-cols-1 row-cols-md-1 g-4 all-optics3 main-rating-star">
<#if allOpticsIdentical??>
<#assign visibleIndex5 = 0>
<#list 0..(allOpticsIdentical?size - 1) as i>
<#if allOpticsIdentical[i]?exists>
<#assign optic = allOpticsIdentical[i]>
    <div class="col" id="optic-main-rating_${idToTokenOpticsMap[optic.id?string]}" <#if visibleIndex5 != 0>style="display: none;"</#if>>
        <div class="card h-100 position-relative">
        <div class="character-maximus-container ratStrPrdct-maximus-container" id="ratStrPrdct-maximus-container_${idToTokenOpticsMap[optic.id?string]}">
            <p class="characteristic-title">Відгуки</p>

            <div class="rating-starProduct-container">
            <div class="characteristic-container rating-starProduct" onclick="toggleDropdownRatStProd('${idToTokenOpticsMap[optic.id?string]}')">
                <p class="close-rating-starProduct-p non-selectable">Залишити відгук</p>
                <button class="close-rating-starProduct-button" class="btn">
                    <img src="/images/System_Interface/plus/plus_white.svg" alt="Close" class="close-icon non-selectable">
                </button>
            </div>

            <div class="enter-rat-strProdct-dropdown" id="enter-rat-strProdct-dropdown_${idToTokenOpticsMap[optic.id?string]}">
            <div class="enter-rat-strProdct-form" id="enter-rat-strProdct-form_${idToTokenOpticsMap[optic.id?string]}">
            <form id="ratingStarPrdctForm_${idToTokenOpticsMap[optic.id?string]}" action="/rating" method="post">
                <div class="enter-rat-strProdct-container">
                    <div class="enter-ratStrPrdct-container">
                    <div class="enter-ratStrPrdct-CONT-input"><input type="text" name="guestName" placeholder="Прiзвище та Iм’я"
                        <#if userId??>value="${MClient.firstName} ${MClient.lastName}"</#if>
                        class="enter-ratStrPrdct-input" style="margin-top: calc(100vw * 26 / 1366);" id="enter-name-m-rating-input_${idToTokenOpticsMap[optic.id?string]}" maxlength="255"></div>

                        <button type="button" class="clear-button" id="clear-ratStrPrdct-button-m-rating-name_${idToTokenOpticsMap[optic.id?string]}">
                        <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon non-selectable"></button>

                        <div class="enter-required-field" id="not-correct-required-m-rating-field-name_${idToTokenOpticsMap[optic.id?string]}">Прiзвище та Iм’я введено не вірно!</div>
                        <p class="required-field" id="required-m-rating-field-name_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>
                    </div>

                    <div class="enter-ratStrPrdct-container" style="<#if userId??>margin-top: calc(100vw * 26 / 1366);</#if>">
                        <div class="mainContainerEnter">
                            <div class="mainSkillsEnter">
                                <div class="mainRatingEnter" id="main-rating-enter_${idToTokenOpticsMap[optic.id?string]}">
                                    <input type="radio" name="star" id="star-5_${idToTokenOpticsMap[optic.id?string]}" value="5"><label for="star-5_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-4.5_${idToTokenOpticsMap[optic.id?string]}" value="4.5"><label for="star-4.5_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-4_${idToTokenOpticsMap[optic.id?string]}" value="4"><label for="star-4_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-3.5_${idToTokenOpticsMap[optic.id?string]}" value="3.5"><label for="star-3.5_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-3_${idToTokenOpticsMap[optic.id?string]}" value="3"><label for="star-3_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-2.5_${idToTokenOpticsMap[optic.id?string]}" value="2.5"><label for="star-2.5_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-2_${idToTokenOpticsMap[optic.id?string]}" value="2"><label for="star-2_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-1.5_${idToTokenOpticsMap[optic.id?string]}" value="1.5"><label for="star-1.5_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-1_${idToTokenOpticsMap[optic.id?string]}" value="1"><label for="star-1_${idToTokenOpticsMap[optic.id?string]}"></label>
                                    <input type="radio" name="star" id="star-0.5_${idToTokenOpticsMap[optic.id?string]}" value="0.5"><label for="star-0.5_${idToTokenOpticsMap[optic.id?string]}"></label>
                                </div>
                            </div>
                        </div>
                        <p class="required-field" id="required-field-rating_${idToTokenOpticsMap[optic.id?string]}" style="margin-top: calc(100vw * -6 / 1366);">Оберіть кількість балів</p>
                    </div>

                    <div class="enter-ratStrPrdct-container" style="margin-top: calc(100vw * -5 / 1366);">
                        <div class="enter-ratStrPrdct-message-container">
                            <textarea name="feedback" placeholder="Текст Вашого відгуку" class="enter-ratStrPrdct-message"
                             id="enter-message-m-rating-textarea_${idToTokenOpticsMap[optic.id?string]}" maxlength="1000"></textarea>
                        </div>
                        <div class="enter-required-field-textarea" id="not-correct-required-field-m-rating-message_${idToTokenOpticsMap[optic.id?string]}">Повинно бути мінімум 10 символів.</div>
                    </div>

                    <div class="enter-ratStrPrdct-container">
                    <div class="enter-ratStrPrdct-advan-disadvan-container">
                        <div class="enter-ratStrPrdct-message-advan-container">
                            <textarea name="advantages" placeholder="Переваги" class="enter-ratStrPrdct-message-advan"
                            id="enter-message-advan-m-rating-textarea_${idToTokenOpticsMap[optic.id?string]}" maxlength="500"></textarea>
                            <div class="enter-required-field-textarea-advan" id="not-correct-required-field-m-rating-advantages_${idToTokenOpticsMap[optic.id?string]}"></div>
                        </div>
                        <div class="enter-ratStrPrdct-message-disadvan-container">
                            <textarea name="disadvantages" placeholder="Недоліки" class="enter-ratStrPrdct-message-disadvan"
                            id="enter-message-disadvan-m-rating-textarea_${idToTokenOpticsMap[optic.id?string]}" maxlength="500"></textarea>
                            <div class="enter-required-field-textarea-disadvan" id="not-correct-required-field-m-rating-disadvantages_${idToTokenOpticsMap[optic.id?string]}"></div>
                        </div>
                    </div>
                    <p class="required-field" id="required-field-m-rating-message_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>
                    </div>

                    <div class="check-familiar-rules-custom non-selectable" id="check-familiar-m-rating-rules-custom_${idToTokenOpticsMap[optic.id?string]}" onclick="toggleFamilRulCheckbox(this)">
                        <div class="check-familiar-rules-square"></div>
                        <span class="check-familiar-rules-title">Я ознайомлений з правилами сайту</span>
                    </div>
                    <p class="required-field" style="margin-top: calc(100vw * -2 / 1366); margin-bottom: calc(100vw * 10 / 1366);" id="required-field-m-rating-familrul_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>


                    <div style="display: none; margin-bottom: calc(100vw * -6.5 / 1366);" id="m-rating-g-recaptcha-container_${idToTokenOpticsMap[optic.id?string]}">
                    <div class="g-recaptcha" id="m-rating-g-recaptcha_${idToTokenOpticsMap[optic.id?string]}"></div>
                    <p class="required-field" style="margin-bottom: calc(100vw * 0 / 1366);" id="required-field-m-rating-g-recaptcha_${idToTokenOpticsMap[optic.id?string]}">Підтвердьте, що ви не робот</p>
                    <input type="hidden" id="recaptchaTokenMRating_${idToTokenOpticsMap[optic.id?string]}" name="recaptchaToken" value=""/>
                    <input type="hidden" id="recaptchaVersionMRating_${idToTokenOpticsMap[optic.id?string]}" name="version" value=""/>
                    </div>

                    <input type="hidden" name="opticId" value="${idToTokenOpticsMap[optic.id?string]}">
                    <button type="submit" class="report-familrul-button non-selectable" id="report-m-rating-button_${idToTokenOpticsMap[optic.id?string]}" style="margin-top: calc(100vw * 16 / 1366);">ЗАЛИШИТИ ВІДГУК</button>
                </div>
            </form>
            </div>
            </div>
            </div>


            <#assign lastIndex = -1>
            <#list 0..(allRating?size - 1) as i>
            <#if idToTokenOpticsMap[allRating[i].optic.id?string] == idToTokenOpticsMap[optic.id?string]>
                <#assign lastIndex = i>
            </#if>
            </#list>


            <div class="feedback-rating-star-product" id="feedback-rating-star-product_${idToTokenOpticsMap[optic.id?string]}">
            <#if allRating?? && allRatingByClient?? && allRatingByClient?size == allRating?size>
            <#assign firstRatProduct = 1>

            <#assign idxsRat = 0..(allRating?size - 1)>
            <#assign guestIdxsRat = []>
            <#assign userIdxsRat = []>

            <#if guestId??>
                <#assign guestIdxsRat = idxsRat?filter(i ->
                    allRating[i].clientId == guestId
                    && allRating[i].accountUsed == false
                )>

                <#if userId??>
                    <#assign userIdxsRat = idxsRat?filter(i ->
                        allRating[i].clientId == userId
                        && allRating[i].accountUsed == true
                    )>

                    <#assign otherIdxs = idxsRat?filter(i ->
                        !guestIdxsRat?seq_contains(i)
                        && !userIdxsRat?seq_contains(i)
                    )>
                <#else>
                    <#assign otherIdxs = idxsRat?filter(i ->
                        !guestIdxsRat?seq_contains(i)
                    )>
                </#if>

                <#assign allIdxsRat = userIdxsRat + guestIdxsRat + otherIdxs>
                <#list allIdxsRat as i><@renderRating i/></#list>
            <#else>
                <#list idxsRat as i><@renderRating i/></#list>
            </#if>

            <#macro renderRating i>
            <#assign ratingStar = allRating[i]>
            <#if idToTokenOpticsMap[ratingStar.optic.id?string] == idToTokenOpticsMap[optic.id?string]>

            <div class="vertical-lineMINI" data-index="${i}" data-date="${ratingStar.feedbackDate}">
                <#--  1 Col  -->
                <div id="feedback-rating-star-product-col_${i}" class="col rating-starPrdct-feedback
                 <#if firstRatProduct == 1>rating-starPrdct-feedbackTOP</#if>
                 <#if ratingStar.feedbackAdmin?has_content>feedbackBOTTOM</#if>">
                    <#if firstRatProduct == 1>
                        <#assign firstRatProduct = 0>
                    </#if>
                    <div class="card-container">
                    <div class="card position-relative"
                        <#if userIdxsRat?seq_contains(i) || guestIdxsRat?seq_contains(i)>style="background-color: #f4f5f7;"</#if>>
                        <div class="main-rating-table"
                            style="margin-left: 2.6%; margin-right: 4.7%; margin-top: 2.05%; margin-bottom: 0.55%;">
                            <div class="progress-wrapper" style="margin-top: 0%;">

                                <#assign clientOrGuestMap = allRatingByClient?filter(m -> m.id == ratingStar.id)?first>
                                <#assign type = clientOrGuestMap.type>
                                <#assign data = clientOrGuestMap.data>

                                <#if type == "Client">
                                    <div class="rating ava-feedback" style="text-align: left;
                                        <#if userIdxsRat?seq_contains(i)> background-color: #dee2e7;</#if>">
                                        <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                        style="width: calc(100vw * 20 / 1366); heigth: auto">
                                    </div>
                                </#if>

                                <#if type == "Client">
                                    <div class="name-feedback" style="margin-left: 1.8%;">
                                        ${data.firstName} ${data.lastName}
                                    </div>
                                <#elseif type == "GuestRating">
                                    <div class="name-feedback" style="margin-left: 0.5%;">
                                        ${data.guestName}
                                    </div>
                                </#if>

                                <#assign feedbackOnlyDateParts = ratingStar.feedbackDate?substring(0, 10)?split("-")>
                                <#assign feedbackOnlyDate = feedbackOnlyDateParts[2] + "-" + feedbackOnlyDateParts[1] + "-" + feedbackOnlyDateParts[0]>

                                <div class="data-feedback" style="text-align: right;">
                                    ${feedbackOnlyDate}
                                </div>
                            </div>

                            <#if userIdxsRat?seq_contains(i) || guestIdxsRat?seq_contains(i)><style>
                                #rating-feedbackProductContainer_1_${idToTokenRatingMap[ratingStar.id?string]} .mainSkills .mainRating input::before {
                                    content: '\f005';
                                    position: absolute;
                                    font-family: fontAwesome;
                                    font-size: calc(100vw * 19 / 1366);
                                    color: #cdced0;
                                    transition: 0.5s;
                                }
                                #rating-feedbackProductContainer_1_${idToTokenRatingMap[ratingStar.id?string]} .mainSkills .mainRating input.highlight::before {
                                    color: orange;
                                }
                                #rating-feedbackProductContainer_1_${idToTokenRatingMap[ratingStar.id?string]} .mainSkills .mainRating input.partial-highlight::before {
                                    background: linear-gradient(to right, orange var(--fill-percentage), #cdced0 var(--fill-percentage));
                                    -webkit-background-clip: text;
                                    background-clip: text;
                                    color: transparent;
                                }
                            </style></#if>

                            <#if userIdxsRat?seq_contains(i) || guestIdxsRat?seq_contains(i)>
                                <div class="feedback-actions">
                            </#if>
                            <div class="non-selectable mainContainer" id="rating-feedbackProductContainer_1_${idToTokenRatingMap[ratingStar.id?string]}"
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

                            <#if userIdxsRat?seq_contains(i) || guestIdxsRat?seq_contains(i)>
                                <button class="edit-feedback" id="edit-feedback-rating-star-product_${idToTokenRatingMap[ratingStar.id?string]}"
                                 data-num-col="${i}"
                                 data-star="${ratingStar.star?string("0.#")?replace(",", ".")}"
                                 data-account-used="${ratingStar.accountUsed?string("true","false")}"
                                 data-feedback="${ratingStar.feedback?html}"
                                 data-advantages="${ratingStar.advantages?html}"
                                 data-disadvantages="${ratingStar.disadvantages?html}"
                                 data-client-name="<#if type == "Client">${data.firstName} ${data.lastName}<#elseif type == "GuestRating">${data.guestName}</#if>">
                                    <img src="/images/System_Interface/feedback_control/edit/edit.svg" alt="Edit Feedback">
                                </button>

                                <button class="delete-feedback" id="delete-feedback-rating-star-product_${idToTokenRatingMap[ratingStar.id?string]}">
                                    <img src="/images/System_Interface/feedback_control/delete/delete.svg" alt="Delete Feedback">
                                </button>
                                </div>
                            </#if>

                            <#assign ratingStarFeedback = ratingStar.star>
                            <#assign ratingStarFeedback = ratingStarFeedback?string("0.0")?replace(",", ".")>

                            <#assign ratingId = idToTokenRatingMap[ratingStar.id?string]>

                            <script>
                                function applyFeedbackRating(containerId, averageRating) {
                                    const arithmeticMainAvrg = parseFloat(averageRating);
                                    const wholeMainPart = Math.floor(arithmeticMainAvrg);
                                    const decimalMainPart = arithmeticMainAvrg - wholeMainPart;

                                    const starsMain = document.querySelectorAll('#rating-feedbackProductContainer_1_' + containerId + ' .mainSkills .mainRating input');

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

                                applyFeedbackRating(`${ratingId}`, ${ratingStarFeedback});
                            </script>

                            <div class="ratStarPrdctFeed-feedback-container" id="feedback-container-likeDislike_${idToTokenRatingMap[ratingStar.id?string]}">
                                <p class="ratStarPrdctFeed-feedback-text feedback-text-global" id="ratStarPrdctFeed-feedback-text_${idToTokenRatingMap[ratingStar.id?string]}"
                                >${ratingStar.feedback?html}<#if ratingStar.advantages?has_content><br
                                        ><span style="display: block; height: 1em;"></span
                                        ><strong>Переваги:</strong><br>${ratingStar.advantages?html}</#if><#if ratingStar.disadvantages?has_content><br
                                        ><span style="display: block; height: 1em;"></span
                                        ><strong>Недоліки:</strong><br>${ratingStar.disadvantages?html}</#if></p>

                                <#assign likeIcon = "/images/System_Interface/feedback_control/like/like.svg">
                                <#assign dislikeIcon = "/images/System_Interface/feedback_control/dislike/dislike.svg">

                                <#if guestId??>
                                <#list allLikeDislike as likeDislike>
                                <#if idToTokenRatingMap[likeDislike.rating.id?string] == idToTokenRatingMap[ratingStar.id?string]>
                                <#if likeDislike.clientId == guestId>
                                    <#if likeDislike.liked?string('true', 'false') == "true">
                                        <#assign likeIcon = "/images/System_Interface/feedback_control/like/like_fill.svg">
                                    <#elseif likeDislike.disliked?string('true', 'false') == "true">
                                        <#assign dislikeIcon = "/images/System_Interface/feedback_control/dislike/dislike_fill.svg">
                                    </#if>
                                </#if>
                                </#if>
                                </#list>
                                </#if>

                                <table class="feedback-buttons">
                                <tbody>
                                <td>
                                    <button id="likeButton_${idToTokenRatingMap[ratingStar.id?string]}" class="like-button" data-rating-id="${idToTokenRatingMap[ratingStar.id?string]}">
                                        <img src="${likeIcon}" alt="Like" class="like-icon">
                                        <p class="like-dislike-num" id="like-num_${idToTokenRatingMap[ratingStar.id?string]}">
                                            ${likeCounts[ratingStar.id?string]!0}
                                        </p>
                                    </button>
                                </td>
                                <td class="dislike-td">
                                    <button id="dislikeButton_${idToTokenRatingMap[ratingStar.id?string]}" class="dislike-button" data-rating-id="${idToTokenRatingMap[ratingStar.id?string]}">
                                        <img src="${dislikeIcon}" alt="Dislike" class="dislike-icon">
                                        <p class="like-dislike-num" id="dislike-num_${idToTokenRatingMap[ratingStar.id?string]}">
                                            ${dislikeCounts[ratingStar.id?string]!0}
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
                                <#if userIdxsRat?seq_contains(i) || guestIdxsRat?seq_contains(i)>
                                style="background: linear-gradient(
                                    to top,
                                    rgba(244, 245, 247, 1) 0%,
                                    rgba(244, 245, 247, 0.8) 50%,
                                    rgba(244, 245, 247, 0) 100%);"
                                </#if>>
                                
                                <button class="more-content-feedback-button"
                                id="more-content-feedback-button_${idToTokenRatingMap[ratingStar.id?string]}"
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
                <#if ratingStar.feedbackAdmin?has_content>
                    <div class="col rating-starPrdct-feedbackAdmin" style="margin-top: calc(100vw * 24 / 1366);">
                        <div class="card h-100 position-relative"
                            <#if userIdxsRat?seq_contains(i) || guestIdxsRat?seq_contains(i)>style="background-color: #f4f5f7;"</#if>>
                            <div class="main-rating-table"
                                style="margin-left: 2.6%; margin-right: 4.7%; margin-top: 0.2%; margin-bottom: 2.05%;">
                                <div class="progress-wrapper" style="margin-top: 0%;">
                                    <div class="feedback-container">
                                        <p class="ratStarPrdctFeed-feedback-text feedback-text-global"
                                        style="margin-right: 0%; margin-top: 0%; margin-bottom: 0%;"
                                        >${ratingStar.feedbackAdmin?html}</p>
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
        </div>
        </div>
    </div>
    <#assign visibleIndex5 = visibleIndex5 + 1>
</#if>
</#list>
<#else>
<p>No Optics data available.</p>
</#if>
</div>


<script>
    let likeCounts = {
    <#list likeCounts?keys as id>
        "${idToTokenRatingMap[id]?string}": ${likeCounts[id]!0}<#if id_has_next>,</#if>
    </#list>
    };
    let dislikeCounts = {
    <#list dislikeCounts?keys as id>
        "${idToTokenRatingMap[id]?string}": ${dislikeCounts[id]!0}<#if id_has_next>,</#if>
    </#list>
    };
</script>
