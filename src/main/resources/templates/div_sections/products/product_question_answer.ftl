<#--
  PRODUCT Q&A MODULE (CRUD): Manages the entire lifecycle of user questions and administrative
  answers for a specific product. Includes the form initialization, client-side validation
  (email formatting, required fields), custom select handling, and reCAPTCHA integration to
  prevent automated spam algorithms.
-->
<!-- Product Questions and Answers -->
<div class="row row-cols-1 row-cols-md-1 g-4 all-optics3 main-rating-star">
<#if allOpticsIdentical??>
<#assign visibleIndex4 = 0>
<#list 0..(allOpticsIdentical?size - 1) as i>
<#if allOpticsIdentical[i]?exists>
<#assign optic = allOpticsIdentical[i]>
    <div class="col" id="optic-question-answer_${idToTokenOpticsMap[optic.id?string]}" <#if visibleIndex4 != 0>style="display: none;"</#if>>
        <div class="card h-100 position-relative">
        <div class="character-maximus-container quean-maximus-container" id="quean-maximus-container_${idToTokenOpticsMap[optic.id?string]}">
            <p class="characteristic-title">Питання та вiдповiдi</p>

            <div class="questions-answers-container">
            <div class="characteristic-container questions-answers" onclick="toggleDropdownQuestAnsw('${idToTokenOpticsMap[optic.id?string]}')">
                <p class="close-questions-answers-p non-selectable">Поставити питання</p>
                <button class="close-questions-answers-button">
                    <img src="/images/System_Interface/plus/plus_white.svg" alt="Close" class="close-icon non-selectable">
                </button>
            </div>

            <div class="enter-quest-answ-dropdown" id="enter-quest-answ-dropdown_${idToTokenOpticsMap[optic.id?string]}">
            <div class="enter-quest-answ-form" id="enter-quest-answ-form_${idToTokenOpticsMap[optic.id?string]}">
            <form id="questionAnswerForm_${idToTokenOpticsMap[optic.id?string]}" action="/question_answer" method="post">
                <div class="enter-quest-answ-container">
                    <#--  Enter Quean Name Input  -->

                    <div class="enter-quean-container">
                    <div class="enter-quean-CONT-input"><input type="text" name="guestName" placeholder="Прiзвище та Iм’я"
                        <#if userId??>value="${MClient.firstName} ${MClient.lastName}"</#if>
                        class="enter-quean-input" style="margin-top: calc(100vw * 26 / 1366);" id="enter-quean-name-input_${idToTokenOpticsMap[optic.id?string]}" maxlength="255"></div>

                        <button type="button" class="clear-button" id="clear-questions-answers-button-quean-name_${idToTokenOpticsMap[optic.id?string]}">
                        <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon non-selectable"></button>

                        <div class="enter-required-field" id="not-correct-required-field-name_${idToTokenOpticsMap[optic.id?string]}">Прiзвище та Iм’я введено не вірно!</div>
                        <p class="required-field" id="required-field-name_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>
                    </div>


                    <#--  Enter Quean Phone Input  -->

                    <div class="enter-quean-container">
                    <div class="enter-quean-CONT-input"><input type="tel" name="phone" class="enter-quean-input" style="width: calc(100% + (100vw * 25 / 1366));"
                        <#if userId??>value="${MClient.phone}"</#if>
                        id="enter-quean-phone-input_${idToTokenOpticsMap[optic.id?string]}" maxlength="255" oninput="this.value = formatPhoneInput(this.value)"></div>

                        <button type="button" class="clear-button" id="clear-questions-answers-button-quean-phone_${idToTokenOpticsMap[optic.id?string]}">
                        <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon non-selectable"></button>

                        <div class="enter-required-field" id="not-correct-required-field-phone_${idToTokenOpticsMap[optic.id?string]}"
                            style="bottom: calc(100vw * 23 / 1366);">Телефон введено не вірно!</div>
                        <p class="required-field" id="required-field-phone_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>
                    </div>


                    <#--  Enter Quean Email Input  -->

                    <div class="enter-quean-container">
                    <div class="enter-quean-CONT-input"><input type="text" name="email" placeholder="Email"
                        <#if userId??>value="${MClient.email}"</#if>
                        class="enter-quean-input" style="margin-top: calc(100vw * -1 / 1366);" id="enter-quean-email-input_${idToTokenOpticsMap[optic.id?string]}" maxlength="255"></div>

                        <button type="button" class="clear-button" id="clear-questions-answers-button-quean-email_${idToTokenOpticsMap[optic.id?string]}"
                        style="bottom: calc(100vw * 18 / 1366);">
                        <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon non-selectable"></button>

                        <div class="enter-required-field" id="not-correct-required-field-email_${idToTokenOpticsMap[optic.id?string]}">Email введено не вірно!</div>
                        <p class="required-field" id="required-field-email_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>
                    </div>


                    <#--  Enter Quean Message Textarea  -->

                    <div class="enter-quean-container" style="<#if userId??>margin-top: calc(100vw * 26 / 1366);</#if>">
                        <div class="enter-quean-message-container">
                            <textarea name="feedback" placeholder="Текст Вашого питання" class="enter-quean-message"
                             id="enter-quean-message-textarea_${idToTokenOpticsMap[optic.id?string]}" maxlength="1000"></textarea>
                        </div>
                        <div class="enter-required-field-textarea" id="not-correct-required-field-message_${idToTokenOpticsMap[optic.id?string]}">Повинно бути мінімум 10 символів.</div>
                        <p class="required-field" id="required-field-message_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>
                    </div>

                    <div class="check-familiar-rules-custom non-selectable" id="check-familiar-rules-custom_${idToTokenOpticsMap[optic.id?string]}" onclick="toggleFamilRulCheckbox(this)">
                        <div class="check-familiar-rules-square"></div>
                        <span class="check-familiar-rules-title">Я ознайомлений з правилами сайту</span>
                    </div>
                    <p class="required-field" style="margin-top: calc(100vw * -2 / 1366); margin-bottom: calc(100vw * 10 / 1366);" id="required-field-familrul_${idToTokenOpticsMap[optic.id?string]}">Обов’язкове поле</p>


                    <div style="display: none; margin-bottom: calc(100vw * -6.5 / 1366);" id="quean-g-recaptcha-container_${idToTokenOpticsMap[optic.id?string]}">
                    <div class="g-recaptcha" id="quean-g-recaptcha_${idToTokenOpticsMap[optic.id?string]}"></div>
                    <p class="required-field" style="margin-bottom: calc(100vw * 0 / 1366);" id="required-field-quean-g-recaptcha_${idToTokenOpticsMap[optic.id?string]}">Підтвердьте, що ви не робот</p>
                    <input type="hidden" id="recaptchaTokenQuestAnsw_${idToTokenOpticsMap[optic.id?string]}" name="recaptchaToken" value=""/>
                    <input type="hidden" id="recaptchaVersionQuestAnsw_${idToTokenOpticsMap[optic.id?string]}" name="version" value=""/>
                    </div>

                    <input type="hidden" name="opticId" value="${idToTokenOpticsMap[optic.id?string]}">
                    <button type="submit" class="report-familrul-button non-selectable" id="report-familrul-button_${idToTokenOpticsMap[optic.id?string]}" style="margin-top: calc(100vw * 16 / 1366);">ПОСТАВИТИ ЗАПИТАННЯ</button>
                </div>
            </form>
            </div>
            </div>
            </div>


            <#assign lastIndex = -1>
            <#list 0..(allQuestionAnswer?size - 1) as i>
            <#if idToTokenOpticsMap[allQuestionAnswer[i].optic.id?string] == idToTokenOpticsMap[optic.id?string]>
                <#assign lastIndex = i>
            </#if>
            </#list>


            <div class="feedback-question-answer" id="feedback-question-answer_${idToTokenOpticsMap[optic.id?string]}">
            <#if allQuestionAnswer?? && allQuestionAnswerByClient?? && allQuestionAnswerByClient?size == allQuestionAnswer?size>
            <#assign firstQuestAnsw = 1>

            <#assign idxsQueAnsw = 0..(allQuestionAnswer?size - 1)>
            <#assign guestIdxsQueAnsw = []>
            <#assign userIdxsQueAnsw = []>

            <#if guestId??>
                <#assign guestIdxsQueAnsw = idxsQueAnsw?filter(i ->
                    allQuestionAnswer[i].clientId == guestId
                    && allQuestionAnswer[i].accountUsed == false
                )>

                <#if userId??>
                    <#assign userIdxsQueAnsw = idxsQueAnsw?filter(i ->
                        allQuestionAnswer[i].clientId == userId
                        && allQuestionAnswer[i].accountUsed == true
                    )>

                    <#assign otherIdxs = idxsQueAnsw?filter(i ->
                        !guestIdxsQueAnsw?seq_contains(i)
                        && !userIdxsQueAnsw?seq_contains(i)
                    )>
                <#else>
                    <#assign otherIdxs = idxsQueAnsw?filter(i ->
                        !guestIdxsQueAnsw?seq_contains(i)
                    )>
                </#if>

                <#assign allIdxsQueAnsw = userIdxsQueAnsw + guestIdxsQueAnsw + otherIdxs>
                <#list allIdxsQueAnsw as i><@renderQuestionAnswer i/></#list>
            <#else>
                <#list idxsQueAnsw as i><@renderQuestionAnswer i/></#list>
<#--
  DYNAMIC RECORD RENDERING MACRO: This reusable function handles the display of individual
  Q&A nodes in the DOM. It includes nested response components (admin answers), timestamp
  formatting, and conditionally renders management icons (Edit/Delete) based on the user's
  authorization state (JWT-based role access control).
-->
            </#if>

            <#macro renderQuestionAnswer i>
            <#assign questAnsw = allQuestionAnswer[i]>
            <#if idToTokenOpticsMap[questAnsw.optic.id?string] == idToTokenOpticsMap[optic.id?string]>

            <div class="vertical-lineMINI" data-index="${i}" data-date="${questAnsw.feedbackDate}">
                <#--  1 Col  -->
                <div id="feedback-question-answer-col_${i}" class="col question-answer-feedback
                 <#if firstQuestAnsw == 1>question-answer-feedbackTOP</#if>
                 <#if questAnsw.feedbackAdmin?has_content>feedbackBOTTOM</#if>">
                    <#if firstQuestAnsw == 1>
                        <#assign firstQuestAnsw = 0>
                    </#if>
                    <div class="card-container">
                    <div class="card position-relative"
                        <#if userIdxsQueAnsw?seq_contains(i) || guestIdxsQueAnsw?seq_contains(i)>style="background-color: #f4f5f7;"</#if>>
                        <div class="main-rating-table"
                            style="margin-left: 2.6%; margin-right: 4.7%; margin-top: 2.05%; margin-bottom: 0.55%;">
                            <div class="progress-wrapper" style="margin-top: 0%;">

                                <#assign clientOrGuestMap = allQuestionAnswerByClient?filter(m -> m.id == questAnsw.id)?first>
                                <#assign type = clientOrGuestMap.type>
                                <#assign data = clientOrGuestMap.data>

                                <#if type == "Client">
                                    <div class="rating ava-feedback" style="text-align: left;
                                        <#if userIdxsQueAnsw?seq_contains(i)> background-color: #dee2e7;</#if>">
                                        <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                        style="width: calc(100vw * 20 / 1366); heigth: auto">
                                    </div>
                                </#if>

                                <#if type == "Client">
                                    <div class="name-feedback" style="margin-left: 1.8%;">
                                        ${data.firstName} ${data.lastName}
                                    </div>
                                <#elseif type == "GuestQuest">
                                    <div class="name-feedback" style="margin-left: 0.5%;">
                                        ${data.guestName}
                                    </div>
                                </#if>

                                <#assign feedbackOnlyDateParts = questAnsw.feedbackDate?substring(0, 10)?split("-")>
                                <#assign feedbackOnlyDate = feedbackOnlyDateParts[2] + "-" + feedbackOnlyDateParts[1] + "-" + feedbackOnlyDateParts[0]>
                            
                                <div class="data-feedback" style="text-align: right;">
                                    ${feedbackOnlyDate}
                                </div>
                            </div>

                            <#if userIdxsQueAnsw?seq_contains(i) || guestIdxsQueAnsw?seq_contains(i)>
                            <div class="feedback-actions">
                                <button class="edit-feedback" id="edit-feedback-question-answer_${idToTokenQuestionAnswerMap[questAnsw.id?string]}"
                                 data-num-col="${i}"
                                 data-phone="${data.phone}"
                                 data-email="${data.email}"
                                 data-account-used="${questAnsw.accountUsed?string("true","false")}"
                                 data-feedback="${questAnsw.feedback?html}"
                                 data-client-name="<#if type == "Client">${data.firstName} ${data.lastName}<#elseif type == "GuestQuest">${data.guestName}</#if>">
                                    <img src="/images/System_Interface/feedback_control/edit/edit.svg" alt="Edit Feedback">
                                </button>

                                <button class="delete-feedback" id="delete-feedback-question-answer_${idToTokenQuestionAnswerMap[questAnsw.id?string]}">
                                    <img src="/images/System_Interface/feedback_control/delete/delete.svg" alt="Delete Feedback">
                                </button>
                            </div>
                            </#if>
                            
                            <p class="questAnswFeed-feedback-text feedback-text-global" id="questAnswFeed-feedback-text_${idToTokenQuestionAnswerMap[optic.id?string]}"
                               style="margin-top: 1.3%; height: auto;">${questAnsw.feedback?html}</p>
                        </div>
                    </div>

                        <div class="more-content-feedback-container-MAX">
                            <div class="more-content-feedback-container"
                                <#if userIdxsQueAnsw?seq_contains(i) || guestIdxsQueAnsw?seq_contains(i)>
                                style="background: linear-gradient(
                                    to top,
                                    rgba(244, 245, 247, 1) 0%,
                                    rgba(244, 245, 247, 0.8) 50%,
                                    rgba(244, 245, 247, 0) 100%);"
                                </#if>>
                                
                                <button class="more-content-feedback-button"
                                id="more-content-feedback-button_${idToTokenQuestionAnswerMap[optic.id?string]}"
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
                <#if questAnsw.feedbackAdmin?has_content>
                    <div class="col question-answer-feedbackAdmin" style="margin-top: calc(100vw * 24 / 1366);">
                        <div class="card h-100 position-relative"
                            <#if userIdxsQueAnsw?seq_contains(i) || guestIdxsQueAnsw?seq_contains(i)>style="background-color: #f4f5f7;"</#if>>
                            <div class="main-rating-table"
                                style="margin-left: 2.6%; margin-right: 4.7%; margin-top: 0.2%; margin-bottom: 2.05%;">
                                <div class="progress-wrapper" style="margin-top: 0%;">
                                    <div class="feedback-container">
                                        <p class="questAnswFeed-feedback-text feedback-text-global"
                                        style="margin-right: 0%; margin-top: 0%; margin-bottom: 0%;"
                                        >${questAnsw.feedbackAdmin?html}</p>
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
    <#assign visibleIndex4 = visibleIndex4 + 1>
</#if>
</#list>
<#else>
<p>No Optics data available.</p>
</#if>
</div>
