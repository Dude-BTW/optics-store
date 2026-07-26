<#--
  CENTRALIZED MODAL WINDOWS (POPUPS): Handles rendering for overlay interfaces. Includes: Cart
  confirmations, Global reCAPTCHA challenges, 'Report Availability' subscriptions, JWT-based
  Authentication forms (Login/Register), and Store Rating CRUD operations.
-->
<!-- Popup for Product Added to Cart -->
<#if showCartPopup?? && showCartPopup>
<div class="popup-bg-cart non-selectable">
    <div class="popup-cart">
        <p class="close-popup-cart button-like" id="close-cart-p">ЗАКРИТИ ТА ПРОДОВЖИТИ ПОКУПКИ</p>
        <button class="close-popup-cart" id="close-cart-button" class="btn">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>

        <p class="popup-cart-text">ТОВАР ДОДАНО В КОШИК</p>
        <button id="popup-cart-button">ОФОРМИТИ ЗАМОВЛЕННЯ</button>
    </div>
</div>
</#if>


<!-- Popup for Global Reaptcha -->
<#if showGlobalReaptchaPopup?? && showGlobalReaptchaPopup>
<div class="popup-bg-global-recap-rat non-selectable">
    <div class="popup-global-recap-rat">
        <button class="close-popup-global-recap-rat" id="close-global-recap-rat-button" class="btn">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <p class="popup-global-recap-rat-text">Не вдалося підтвердити, що Ви не робот</p>

        <div class="g-recaptcha" style="margin-left: auto; margin-right: auto;" id="global-recap-rat-popup-g-recaptcha"></div>
        <div id="required-popup-field-global-recap-rat-g-recaptcha"></div>
    </div>
</div>
</#if>


<!-- Popup for Reaptcha -->
<#if showReaptchaPopup?? && showReaptchaPopup>
<div class="popup-bg-recap-rat non-selectable">
    <div class="popup-recap-rat">
        <button class="close-popup-recap-rat" id="close-recap-rat-button" class="btn">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <p class="popup-recap-rat-text">Не вдалося підтвердити, що Ви не робот</p>

        <div class="g-recaptcha" style="margin-left: auto; margin-right: auto;" id="recap-rat-popup-g-recaptcha"></div>
        <div id="required-popup-field-recap-rat-g-recaptcha"></div>
    </div>
</div>
</#if>


<!-- Popup for Add to Report Availability -->
<#if showReportAvailabilityPopup?? && showReportAvailabilityPopup>
<div class="popup-bg-report-avail non-selectable">
    <div class="popup-report-avail">
        <button class="close-popup-report-avail" id="close-report-avail-button" class="btn">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <p class="popup-report-avail-text">ПОВІДОМИТИ ПРО НАЯВНІСТЬ</p>

        <form id="reportAvailPopupForm" action="/report_availability" method="post">
            <div class="enter-report-Availability-popup-container">


                <#--  Enter Report Avail Name Input  -->

                <div class="enter-reportAvail-popup-container">
                <div class="enter-reportAvail-popup-CONT-input"><input type="text" name="guestName" placeholder="Прiзвище та Iм’я"
                    <#if userId??>value="${MClient.firstName} ${MClient.lastName}"</#if>
                    class="enter-report-avail-popup-input" style="margin-top: calc(100vw * 26 / 1366);" id="enter-name-popup-report-avail-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-report-avail-popup-name"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-report-avail-field-name">Прiзвище та Iм’я введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-report-avail-field-name" style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
                </div>


                <#--  Enter Report Avail Phone Input  -->

                <div class="enter-reportAvail-popup-container" style="margin-top: calc(100vw * 12 / 1366);">
                <div class="enter-reportAvail-popup-CONT-input"><input type="tel" name="phone" style="width: calc(100% + (100vw * 25 / 1366));"
                    <#if userId??>value="${MClient.phone}"</#if>
                    class="enter-report-avail-popup-input" id="enter-phone-popup-report-avail-input" maxlength="255" oninput="this.value = formatPhoneInput(this.value)"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-report-avail-popup-phone">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-report-avail-field-phone"
                        style="bottom: calc(100vw * 23 / 1366);">Телефон введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-report-avail-field-phone">Обов’язкове поле</p>
                </div>


                <#--  Enter Report Avail Email Input  -->

                <div class="enter-reportAvail-popup-container">
                <div class="enter-reportAvail-popup-CONT-input"><input type="text" name="email" placeholder="Email"
                    <#if userId??>value="${MClient.email}"</#if>
                    class="enter-report-avail-popup-input" id="enter-email-popup-report-avail-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-report-avail-popup-email">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-report-avail-field-email">Email введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-report-avail-field-email">Обов’язкове поле</p>
                </div>
                

                <div id="report-avail-popup-g-recaptcha-container" style="display: none;">
                <div class="g-recaptcha" id="report-avail-popup-g-recaptcha"></div>
                <p class="required-popup-field" id="required-popup-field-report-avail-g-recaptcha">Підтвердьте, що ви не робот</p>
                <input type="hidden" id="recaptchaTokenReportAvail" name="recaptchaToken" value=""/>
                <input type="hidden" id="recaptchaVersionReportAvail" name="version" value=""/>
                </div>

                <input type="hidden" name="opticId" id="popup-hidden-optic-id">
                <button type="submit" id="popup-report-avail-button">ПОВІДОМИТИ ПРО НАЯВНІСТЬ</button>
            </div>
        </form>

        <div class="dropdown1" style="font-size: calc(100vw * 13 / 1366); margin-right: -0.1%">
            <span class="non-selectable larger-click-area-nav1" id="dropdown-span-sortingOptics">
                <img src="/images/System_Interface/sorting_left.svg" alt="Dropdown"
                    style="width: calc(100vw * 17 / 1366); height: auto; margin-bottom: calc(100vw * 3 / 1366);">
                &nbsp;Сортування&nbsp;
                <img src="/images/System_Interface/dropdown_symbols/down_red.svg" alt="Dropdown" class="dropdown1-icon"
                    style="margin-bottom: calc(100vw * 0 / 1366);">
            </span>
            <div class="dropdown1-content dropdown1-content-button" id="dropdown-content-sortingOptics">
                <button class="non-selectable" id="button-sort-new">Спочатку Нові</button>
                <button class="non-selectable" id="button-sort-promotional">Спочатку Акційні товари</button>
                <button class="non-selectable" id="button-sort-top">Спочатку Топ продажу</button>
                <button class="non-selectable" id="button-sort-cheaper">Спочатку дешевші</button>
                <button class="non-selectable" id="button-sort-expensive">Спочатку дорогі</button>
                <button class="non-selectable" id="button-sort-alphabetical">Від А до Я</button>
            </div>
        </div>
    </div>
</div>
</#if>


<!-- Popup for Add to Register Login -->
<#--
  AUTHENTICATION MODULE: Implements forms for user registration and login. Incorporates client-side
  validation and hidden fields for reCAPTCHA tokens.
-->
<div class="popup-bg-register-login non-selectable">
    <div class="popup-register-login" id="popup-register" style="display: none;">
        <button class="close-popup-register-login close-register-login-button">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <p class="popup-register-login-text">РЕЄСТРАЦІЯ</p>

        <p>Є профiль, увiйдiть до свого профiлю</p>
        <button id="part-login">ВXIД</button>

        <form id="registerPartPopupForm" action="/register" method="post">
            <div class="enter-register-popup-container">


                <#--  Enter Register Input 1  -->

                <div class="enter-registerLogin-popup-container">
                <div class="enter-registerLogin-popup-CONT-input"><input type="text" name="firstName" placeholder="Iм’я"
                    class="enter-register-login-popup-input" style="margin-top: calc(100vw * 26 / 1366);" id="enter-fname-popup-register-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-register-popup-fname"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-register-field-fname">Iм’я введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-register-field-fname" style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
                </div>


                <#--  Enter Register Input 2  -->

                <div class="enter-registerLogin-popup-container" style="margin-top: calc(100vw * 12 / 1366);">
                <div class="enter-registerLogin-popup-CONT-input"><input type="text" name="lastName" placeholder="Прiзвище"
                    class="enter-register-login-popup-input" id="enter-lname-popup-register-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-register-popup-lname"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-register-field-lname">Прiзвище введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-register-field-lname" style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
                </div>


                <#--  Enter Register Phone Input  -->

                <div class="enter-registerLogin-popup-container" style="margin-top: calc(100vw * 12 / 1366);">
                <div class="enter-registerLogin-popup-CONT-input"><input type="tel" name="phone" style="width: calc(100% + (100vw * 25 / 1366));"
                    class="enter-register-login-popup-input" id="enter-phone-popup-register-input" maxlength="255" oninput="this.value = formatPhoneInput(this.value)">
                </div>

                    <button type="button" class="clear-button-popup" id="clear-button-register-popup-phone"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-register-field-phone"
                        style="bottom: calc(100vw * 23 / 1366);">Телефон введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-register-field-phone">Обов’язкове поле</p>
                </div>


                <#--  Enter Register Email Input  -->

                <div class="enter-registerLogin-popup-container">
                <div class="enter-registerLogin-popup-CONT-input"><input type="text" name="email" placeholder="Email"
                    class="enter-register-login-popup-input" id="enter-email-popup-register-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-register-popup-email"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-register-field-email">Email введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-register-field-email">Обов’язкове поле</p>
                </div>


                <#--  Enter Register Password  -->

                <div class="enter-registerLogin-popup-container">
                <div class="enter-registerLogin-popup-CONT-input"><input type="password" name="password" placeholder="Пароль"
                    class="enter-register-login-popup-input" id="enter-password-popup-register-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-register-popup-password"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-register-field-password">Пароль введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-register-field-password" style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
                </div>


                <div id="register-popup-g-recaptcha-container" style="display: none;">
                <div class="g-recaptcha" id="register-popup-g-recaptcha"></div>
                <p class="required-popup-field" id="required-popup-field-register-g-recaptcha">Підтвердьте, що ви не робот</p>
                <input type="hidden" id="recaptchaTokenRegister" name="recaptchaToken" value=""/>
                <input type="hidden" id="recaptchaVersionRegister" name="version" value=""/>
                </div>

                <button type="submit" class="popup-register-login-button" id="popup-register-button" style="margin-top: calc(100vw * 16 / 1366);">ЗАРЕЄСТРУВАТИСЯ</button>
            </div>
        </form>
    </div>

    <div class="popup-register-login" id="popup-login">
        <button class="close-popup-register-login close-register-login-button">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <p class="popup-register-login-text">ВXIД</p>

        <p>Немає профiлю, зареєструйтесь</p>
        <button id="part-register">РЕЄСТРАЦІЯ</button>

        <form id="loginPartPopupForm" action="/login" method="post">
            <div class="enter-register-popup-container">


                <#--  Enter Register Email Input  -->

                <div class="enter-registerLogin-popup-container">
                <div class="enter-registerLogin-popup-CONT-input"><input type="text" name="email" placeholder="Email"
                    class="enter-register-login-popup-input" style="margin-top: calc(100vw * 26 / 1366);" id="enter-email-popup-login-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-login-popup-email"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-login-field-email">Email введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-login-field-email">Обов’язкове поле</p>
                </div>


                <#--  Enter Register Password  -->

                <div class="enter-registerLogin-popup-container">
                <div class="enter-registerLogin-popup-CONT-input"><input type="password" name="password" placeholder="Пароль"
                    class="enter-register-login-popup-input" id="enter-password-popup-login-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-login-popup-password"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-login-field-password">Пароль введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-login-field-password" style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
                </div>


                <div id="login-popup-g-recaptcha-container" style="display: none;">
                <div class="g-recaptcha" id="login-popup-g-recaptcha"></div>
                <p class="required-popup-field" id="required-popup-field-login-g-recaptcha">Підтвердьте, що ви не робот</p>
                <input type="hidden" id="recaptchaTokenLogin" name="recaptchaToken" value=""/>
                <input type="hidden" id="recaptchaVersionLogin" name="version" value=""/>
                </div>

                <button type="submit" class="popup-register-login-button" id="popup-login-button" style="margin-top: calc(100vw * 16 / 1366);">ЗАРЕЄСТРУВАТИСЯ</button>
            </div>
        </form>
    </div>
</div>


<!-- Popup for Add to Rating -->
<#--
  USER FEEDBACK MODULE: Form for submitting general store reviews. Features dynamic star rating UI and
  synchronous/asynchronous state updates.
-->
<#if showRatingGlobalPopup?? && showRatingGlobalPopup>
<div class="popup-bg-rating non-selectable">
    <div class="popup-rating">
        <button class="close-popup-rating" id="close-rating-button" class="btn">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <p class="popup-rating-text">ОЦІНКА МАГАЗИНА</p>

        <form id="ratingStarPrdctPopupForm" action="/rating_global" method="post">
            <div class="enter-rat-strProdct-popup-container">
                <div class="enter-ratStrPrdct-popup-container">
                <div class="enter-ratStrPrdct-popup-CONT-input"><input type="text" name="guestName" placeholder="Прiзвище та Iм’я"
                    <#if userId??>value="${MClient.firstName} ${MClient.lastName}"</#if>
                    class="enter-ratStrPrdct-popup-input" style="margin-top: calc(100vw * 26 / 1366);" id="enter-name-popup-m-rating-input" maxlength="255"></div>

                    <button type="button" class="clear-button-popup" id="clear-button-m-rating-name-popup"
                    style="bottom: calc(100vw * 18 / 1366);">
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable"></button>

                    <div class="enter-required-popup-field" id="not-correct-required-popup-m-rating-field-name">Прiзвище та Iм’я введено не вірно!</div>
                    <p class="required-popup-field" id="required-popup-m-rating-field-name" style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
                </div>

                <#list 1..4 as i>
                    <div class="progress-wrapper" id="rating-progressWrapper_${i}"
                     style="<#if i == 1>margin-top: calc(100vw * 7 / 1366);
                            <#elseif i != 1>margin-top: calc(100vw * -4 / 1366);</#if>">
                        
                        <div class="rating" style="text-align: left;
                                                   margin-right: calc(100vw * 13.5 / 1366);
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

                        <#assign suffix = "">
                        <#if i == 1>
                        <#assign suffix = "Price">
                        <#elseif i == 2>
                        <#assign suffix = "ProductQuality">
                        <#elseif i == 3>
                        <#assign suffix = "Delivery">
                        <#elseif i == 4>
                        <#assign suffix = "StoreRating">
                        </#if>

                        <div class="mainContainerEnterPopup"
                         style="text-align: right;
                                margin-left: calc(100vw * 10 / 1366);
                                margin-bottom: calc(100vw * 6 / 1366);">
                            <div class="mainSkillsEnterPopup">
                                <div class="mainSkillsEnterPopup" id="main-rating-enter-popup_${suffix}">
                                    <input type="radio" name="star${suffix}" id="star${suffix}-5_${i}" value="5"><label for="star${suffix}-5_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-4.5_${i}" value="4.5"><label for="star${suffix}-4.5_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-4_${i}" value="4"><label for="star${suffix}-4_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-3.5_${i}" value="3.5"><label for="star${suffix}-3.5_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-3_${i}" value="3"><label for="star${suffix}-3_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-2.5_${i}" value="2.5"><label for="star${suffix}-2.5_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-2_${i}" value="2"><label for="star${suffix}-2_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-1.5_${i}" value="1.5"><label for="star${suffix}-1.5_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-1_${i}" value="1"><label for="star${suffix}-1_${i}"></label>
                                    <input type="radio" name="star${suffix}" id="star${suffix}-0.5_${i}" value="0.5"><label for="star${suffix}-0.5_${i}"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </#list>
                <p class="required-popup-field" id="required-popup-field-rating" style="margin-top: calc(100vw * -17.5 / 1366);">Оберіть кількість балів</p>

                <div class="enter-ratStrPrdct-popup-container" style="margin-top: calc(100vw * -4 / 1366);">
                    <div class="enter-ratStrPrdct-popup-message-container">
                        <textarea name="feedback" placeholder="Текст Вашого відгуку" class="enter-ratStrPrdct-popup-message"
                            id="enter-message-popup-m-rating-textarea" maxlength="1000"></textarea>
                    </div>
                    <div class="enter-required-popup-field-textarea" id="not-correct-required-popup-field-m-rating-message">Повинно бути мінімум 10 символів.</div>
                    <p class="required-popup-field" style="margin-bottom: calc(100vw * 10 / 1366);" id="required-popup-field-m-rating-message">Обов’язкове поле</p>
                </div>

                <div class="check-familiar-rules-custom non-selectable" id="check-familiar-m-rating-popup-rules-custom" onclick="toggleFamilRulCheckbox(this)">
                    <div class="check-familiar-rules-square"></div>
                    <span class="check-familiar-rules-title">Я ознайомлений з правилами сайту</span>
                </div>
                <p class="required-popup-field" style="margin-top: calc(100vw * -2 / 1366); margin-bottom: calc(100vw * 10 / 1366);" id="required-field-m-rating-popup-familrul">Обов’язкове поле</p>


                <div style="display: none; margin-bottom: calc(100vw * -6.5 / 1366);" id="m-rating-popup-g-recaptcha-container">
                <div class="g-recaptcha" id="m-rating-popup-g-recaptcha"></div>
                <p class="required-popup-field" style="margin-bottom: calc(100vw * 0 / 1366);" id="required-popup-field-m-rating-g-recaptcha">Підтвердьте, що ви не робот</p>
                <input type="hidden" id="recaptchaTokenPopupRating" name="recaptchaToken" value=""/>
                <input type="hidden" id="recaptchaVersionPopupRating" name="version" value=""/>
                </div>

                <button type="submit" id="popup-rating-button">ЗАЛИШИТИ ВІДГУК</button>
            </div>
        </form>
    </div>
</div>
</#if>


<!-- Popup for Add to Main Top 1-4 -->
<#if showMainTopPopup?? && showMainTopPopup>
<#list 1..4 as i>
<div class="popup-bg-main-top_${i} non-selectable">
    <div class="popup-main-top_${i}">
        <button class="close-popup-main-top_${i}" id="close-main-top_${i}-button">
            <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
        </button>
        <div class="container-popup-main-top_${i}">
        <#if i == 1>
        <p class="p-popup-main-top_${i}">Ми намагаємося зробити покупки в нашому інтернет магазині максимально зручними та приємними для наших клієнтів і тому:
    <br><br>Доставка товару безкоштовна для замовлень від 1000 грн.
        <br>Комісію при оплаті післяплати сплачуємо ми
        <br>Ви сплачуєте тільки вартість товару зазначену на сайті.
    <br><br>Ці умови діють в незалежності від того якого перевізника ви виберете при оформленні замовлення та незалежно від того чи буде доставка до відділення чи за адресою.
    <br><br>Бажаємо вам приємних покупок!</p>
        <#elseif i == 2>
        <p class="p-popup-main-top_${i}">&nbsp;В нашому інтернет-магазині повернення доступне протягом 30 днів за умови, що товар не використовувався та не має пошкоджень.  
    <br><br>&nbsp;&nbsp;Контактні лінзи та супутні розчини являються предметом медичного призначення та індивідуального користування і не підлягають поверненню.
    <br><br>&nbsp;&nbsp;Обмін можливий при заводських дефектах. В такому випадку зателефонуйте за номером телефону:
        <br>XXX XXX XXXXXX</p>
        <#elseif i == 3>
        <p class="p-popup-main-top_${i}">&nbsp;Optics співпрацює лише з представниками брендів та офіційними дистриб'юторами в Україні.
    <br><br>&nbsp;Зі свого боку, ми контролюємо якість товару, умови зберігання і піклуємося про збереження посилки на всіх етапах транспортування замовлення.
    <br><br>&nbsp;Замовляючи товар в нашому інтернет магазині, ви можете бути впевнені на 100% в оригінальності і якості всіх наших товарних позицій.
    <br><br>Відповідаємо за якість своєю репутацією перевіреною роками нашої співпраці з вами.</p>
        <#elseif i == 4>
        <p class="p-popup-main-top_${i}">&nbsp;Ми надаємо гарантію на окуляри 6 місяців з дня придбання окулярів в нашому інтернет магазині.
    <br><br>&nbsp;Вона діє при поломках та заводських дефектах.
    <br><br>&nbsp;Гарантія не розповсюджується за умови:
        <br>- недотримання правил користування окулярами
        <br>- самостійному ремонті чи заміні частин оправи
        <br>- фізичного зносу після закінчення терміну гарантії</p>
        </#if>
        </div>
    </div>
</div>
</#list>
</#if>


<!-- Popup for Product Added to Filter1 -->
<#--
  DYNAMIC FILTERING (FACETED SEARCH): Renders available filter attributes based on the current
  category context. Maps to the SSR Faceted Search functionality documented in README.
-->
<#if showProductFilter1Popup?? && showProductFilter1Popup>
<div class="popup-bg-filter1 non-selectable">
    <div class="popup-filter1">
        <div class="close">
            <p class="title-filter">ФІЛЬТР</p>
            <button id="clear-filter-button-brand">ОЧИСТИТИ ВСІ ФІЛЬТРИ</button>
            <button class="close-popup-filter1" id="close-filter1-button"
                style="border-bottom-left-radius: calc(100vw * 0 / 1366); top: calc(100vw * 0 / 1366);">
                <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
            </button>
        </div>

        <div class="popup-filter1-body">

            <#assign filterDisplayNames = {
                "group": "Група", "gender": "Гендер", "frameShape": "Форма оправи", "faceShape": "Форма обличчя", 
                "colorName1": "Колір оправи", "colorName2": "Колір лінз", "eyeglass": "Лінза", "material": "Матеріал", 
                "frameType": "Вид оправи", "eyepieceSize": "Розмір окуляра", "earringSize": "Розмір завушника", 
                "bridgeSize": "Розмір мостика", "polarization": "Поляризація", "photochrome": "Фотохром", "manufacturer": "Виробник", 
                "country": "Країна", "collection": "Колекція", "properties": "Властивості", "clipOn": "CLIP-ON"
            } />

            <#macro dedupOption val>
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

            <#assign seenValues = []>

            <#list [
                "group", "gender", "frameShape", "faceShape", "colorName1", "colorName2", "eyeglass", 
                "material", "frameType", "eyepieceSize", "earringSize", "bridgeSize", "polarization", "photochrome", 
                "manufacturer", "country", "collection", "properties", "clipOn"
            ] as filterType>

            <#if filterOptions?? && filterOptions[filterType]?? && (filterOptions[filterType]?size > 0)>
            <div class="drop-down-activator" id="activator-${filterType}">
                <div class="drop-down-area">
                    <span id="filterType-${filterDisplayNames[filterType]}">${filterDisplayNames[filterType]}</span>
                    <img src="/images/System_Interface/plus/plus.svg" alt="Toggle" class="toggle-icon">
                </div>
            </div>

            <div class="drop-down-filter1 <#if filterType == "group" || filterType == "gender" || filterType == "frameShape"
             || filterType == "faceShape">show</#if>" id="filter-${filterType}">
            
                <#list filterOptions[filterType] as option>
                    <#assign dedupOrigOption><@dedupOption option/></#assign>
                    <#assign dedupOrigOption = dedupOrigOption?trim>
                    
                    <#assign transliterateOption = dedupOrigOption?lower_case>
                    <#assign transliterateOption = transliterateOption
                        ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                        ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                        ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                        ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                        ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                        ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                        ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                        ?replace(" ", "")?replace("-", "")>

                    <div class="check-custom" onclick="toggleCheckbox(this)"
                        data-originalByBrand-transliterateOption="${transliterateOption}" data-originalByBrand-option="${dedupOrigOption}">
                        <div class="check-square"></div>
                        <span class="check-title" id="filterType-${filterDisplayNames[filterType]}&filter-${dedupOrigOption}">
                            <#if filterType == "polarization">
                                <#if option == "есть">Наявний<#elseif option == "нет">Немає<#else>${option}</#if>
                            <#elseif filterType == "manufacturer">
                                ${option}
                            <#elseif filterType == "group">
                                ${option?cap_first}
                            <#else>
                                ${option?capitalize}
                            </#if>
                        </span>
                    </div>
                </#list>
            </div>
            </#if>
            </#list>
        </div>
    </div>
</div>
</#if>


<!-- Popup for Product Added to Filter2 -->
<#if showProductFilter2Popup?? && showProductFilter2Popup>
<div class="popup-bg-filter2 non-selectable">
    <div class="popup-filter2">
        <div class="close">
            <p class="title-filter">ФІЛЬТР</p>
            <button id="clear-filter-button-group">ОЧИСТИТИ ВСІ ФІЛЬТРИ</button>
            <button class="close-popup-filter2" id="close-filter2-button"
                style="border-bottom-left-radius: calc(100vw * 0 / 1366); top: calc(100vw * 0 / 1366);">
                <img src="/images/System_Interface/close/close.svg" alt="Close" class="close-icon">
            </button>
        </div>

        <div class="popup-filter2-body">

            <#assign filterDisplayNames = {
                "gender": "Гендер", "brand": "Бренд", "frameShape": "Форма оправи", "faceShape": "Форма обличчя", 
                "colorName1": "Колір оправи", "colorName2": "Колір лінз", "eyeglass": "Лінза", "material": "Матеріал", 
                "frameType": "Вид оправи", "eyepieceSize": "Розмір окуляра", "earringSize": "Розмір завушника", 
                "bridgeSize": "Розмір мостика", "polarization": "Поляризація", "photochrome": "Фотохром", "manufacturer": "Виробник", 
                "country": "Країна", "collection": "Колекція", "properties": "Властивості", "clipOn": "CLIP-ON"
            } />

            <#macro dedupOption val>
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

            <#assign seenValues = []>

            <#list [
                "gender", "brand", "frameShape", "faceShape", "colorName1", "colorName2", "eyeglass", 
                "material", "frameType", "eyepieceSize", "earringSize", "bridgeSize", "polarization", "photochrome", 
                "manufacturer", "country", "collection", "properties", "clipOn"
            ] as filterType>

            <#if filterOptions?? && filterOptions[filterType]?? && (filterOptions[filterType]?size > 0)>
            <#assign isGenderSingleOption = (filterType == "gender" && filterOptions["gender"]?size == 1)>
            <div class="drop-down-activator<#if isGenderSingleOption> filter-none-display</#if>" id="activator-${filterType}">
                <div class="drop-down-area">
                    <span id="filterType-${filterDisplayNames[filterType]}">${filterDisplayNames[filterType]}</span>
                    <img src="/images/System_Interface/plus/plus.svg" alt="Toggle" class="toggle-icon">
                </div>
            </div>

            <div class="drop-down-filter2<#if (filterType == "gender" && !isGenderSingleOption) || filterType == "frameShape"
             || filterType == "faceShape"> show</#if>" id="filter-${filterType}">
                
                <#list filterOptions[filterType] as option>
                    <#assign dedupOrigOption><@dedupOption option/></#assign>
                    <#assign dedupOrigOption = dedupOrigOption?trim>

                    <#assign transliterateOption = dedupOrigOption?lower_case>
                    <#assign transliterateOption = transliterateOption
                        ?replace("а", "a")?replace("б", "b")?replace("в", "v")?replace("г", "h")
                        ?replace("д", "d")?replace("е", "e")?replace("є", "ie")?replace("ж", "zh")?replace("з", "z")
                        ?replace("и", "y")?replace("і", "i")?replace("ї", "i")?replace("й", "i")?replace("к", "k")
                        ?replace("л", "l")?replace("м", "m")?replace("н", "n")?replace("о", "o")?replace("п", "p")
                        ?replace("р", "r")?replace("с", "s")?replace("т", "t")?replace("у", "u")?replace("ф", "f")
                        ?replace("х", "kh")?replace("ц", "ts")?replace("ч", "ch")?replace("ш", "sh")?replace("щ", "shch")
                        ?replace("ю", "iu")?replace("я", "ia")?replace("ь", "")?replace("ъ", "")?replace(",", "")
                        ?replace(" ", "")?replace("-", "")>

                    <div class="check-custom" onclick="toggleCheckbox(this)" data-group-filter="${filterType}"
                        data-originalByGroup-transliterateOption="${transliterateOption}" data-originalByGroup-option="${dedupOrigOption}">
                        <div class="check-square"></div>
                        <span class="check-title" id="filterType-${filterDisplayNames[filterType]}&filter-${dedupOrigOption}">
                            <#if filterType == "polarization">
                                <#if option == "есть">Наявний<#elseif option == "нет">Немає<#else>${option}</#if>
                            <#elseif filterType == "brand" || filterType == "manufacturer">
                                ${option}
                            <#else>
                                ${option?capitalize}
                            </#if>
                        </span>
                    </div>
                </#list>
            </div>
            </#if>
            </#list>
        </div>
    </div>
</div>
</#if>


<#assign mainFirstName = MClient?if_exists.firstName!"" />
<#assign mainLastName = MClient?if_exists.lastName!"" />
<script>
    var accountAvail = ${userId?has_content?string("true","false")};
    var mainFirstName = "${mainFirstName}";
    var mainLastName = "${mainLastName}";
</script>

<#if showProductFilter1Popup?? && showProductFilter1Popup || showProductFilter2Popup?? && showProductFilter2Popup>
<script>
    <#if categoryName?has_content>
        const formattedCategoryName = "${categoryName?lower_case?replace(" ", "-")}";
        const categoryJS = "${categoryName}";
    <#else>
        const formattedCategoryName = "";
        const categoryJS = "";
    </#if>

    <#if groupName?has_content>
        const formattedGroupName = "${groupName?lower_case?replace(" ", "-")}";
        const groupJS = "${groupName?cap_first}";
    <#else>
        const formattedGroupName = "";
        const groupJS = "";
    </#if>
</script>
</#if>
