<#--
  FOOTER COMPONENT: Contains grid-based navigation links, payment options, and the newsletter
  subscription form. The form integrates client-side validation and interacts with the security module
  via reCAPTCHA.
-->
<link rel="stylesheet" type="text/css" href="/css_main/footer.css">

<div class="footer-container" style="overflow: hidden;">
    <table class="footer-table_1">
        <tbody>
            <tr>
                <td class="footer_1-one-column">
                    <img src="/images/Головний лого/Y!O (R).png"
                        alt="Brand Optics" class="brand-optics-footer-icon">

                    <p class="brand-optics-footer-text">Optics - це весь спектр<br>
                        офтальмологічних послуг та оптичних товарів.</p>

                    <span style="display: inline-flex; align-items: center; font-size: calc(100vw * 12 / 1366);">
                        <img src="/images/System_Interface/telephone/telephone_white.svg" alt="Phone" class="phone-icon"
                            style="width: calc(100vw * 22 / 1366); margin-bottom: calc(100vw * 1 / 1366);">
                        <span class="phone-text">XXX XXX XXXXXX</span>
                    </span>

                    <button id="brand-optics-footer-button">ЗАМОВИТИ ЗВІНОК</button>

                </td>

                <td class="footer_1-two-column" style="width: 23.5%;">
                <table>
                <tbody>
                    <tr>
                        <th>КАТАЛОГ</th>
                    </tr>
                    <tr>
                        <td>
                            <table class="footer-table-tr">
                                <tr><td><a href="#" class="button-like non-selectable">СОНЦЕЗАХИСНІ ОКУЛЯРИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ОПРАВИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">КОНТАКТНІ ЛІНЗИ</a></td></tr>
                            </table>
                        </td>
                    </tr>
                </tbody>
                </table>
                </td>

                <td class="footer_1-two-column" style="width: 26%;">
                <table>
                <tbody>
                    <tr>
                        <th>ПРО НАС</th>
                    </tr>
                    <tr>
                        <td>
                            <table class="footer-table-tr">
                                <tr><td><a href="#" class="button-like non-selectable">ПРО НАС</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">КОНТАКТИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ПОСЛУГИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">САЛОНИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ЛIКАРI-ОФТАЛЬМОЛОГИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ПУБЛІЧНИЙ ДОГОВІР (ОФЕРТА)</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ПРОГРАМА ЛОЯЛЬНОСТІ</a></td></tr>
                            </table>
                        </td>
                    </tr>
                </tbody>
                </table>
                </td>

                <td class="footer_1-two-column" style="width: 15.5%;">
                <table>
                <tbody>
                    <tr>
                        <th>ІНШЕ</th>
                    </tr>
                    <tr>
                        <td>
                            <table class="footer-table-tr">
                                <tr><td><a href="#" class="button-like non-selectable">ОПЛАТА І ДОСТАВКА</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ГАРАНТІЯ ТА ПОВЕРНЕННЯ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ПИТАННЯ ТА ВІДПОВІДІ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">НОВИНИ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">КАРТА САЙТУ</a></td></tr>
                                <tr><td><a href="#" class="button-like non-selectable">ПРАЙС НА ПОСЛУГИ</a></td></tr>
                            </table>
                        </td>
                    </tr>
                </tbody>
                </table>
                </td>
            </tr>
        </tbody>
    </table>

    <table class="footer-table_2">
        <tbody>
            <tr>
                <td class="footer_2-one-column">
                    <div id="recaptcha-container"></div>

                    <p class="subscription-newsletter">Більше переваг для вас! Пiдпишиться на розсилку</p>
                    <ul>
                        <li>Акційні пропозиції</li>
                        <li>Промокоди зі знижками</li>
                        <li>Новини</li>
                    </ul>

                    <div class="footer-enter-container">
                        <input type="text" placeholder="Email" class="footer-enter-input" id="subscription-input">
                        <div class="enter-message" id="correctly-message">Дякую! Ви пiдписались на розсилки</div>
                        <div class="enter-message" id="not-correct-message">Email введено не вірно!</div>
                        <div class="enter-message" id="empty-message">Поле для вводу пусте!</div>
                        <button class="footer-enter-button" id="subscription-button">
                            <img src="/images/System_Interface/send.svg" alt="Send" style="width: calc(100vw * 30 / 1366); height: auto;">
                        </button>
                    </div>
                </td>

                <td class="footer_2-two-column">
                    <div class="footer-enter-container">
                        <img src="/images/System_Interface/payment/visa.svg" alt="Visa" class="visa-icon"
                        style="width: calc(100vw * 60 / 1366); height: auto;">
                        <img src="/images/System_Interface/payment/mastercard.svg" alt="Mastercard" class="mastercard-icon"
                        style="width: calc(100vw * 58 / 1366); height: auto;">
                    </div>
                </td>

                <td class="footer_2-one-column">
                    <div class="footer-enter-container" style="justify-content: flex-end; margin-top: calc(100vw * 48 / 1366);">
                        <input type="text" placeholder="Не знайшли інформацію? Спробуйте пошук!"
                         class="footer-enter-input" id="footer-search-input" style="width: 75.9%;">
                        <button class="footer-enter-button" id="footer-search-button">
                            <img src="/images/System_Interface/navbar_symbols/search/search.svg"
                             alt="Footer Search" style="width: calc(100vw * 24 / 1366); height: auto;">
                        </button>
                    </div>
                    <div class="footer-enter-container"
                     style="justify-content: flex-end; margin-top: calc(100vw * 38 / 1366);">
                        <p class="social-media-text">Ми в соцiальних медiа</p>
                        <a href="#" class="button-like non-selectable facebook-button">
                            <img src="/images/System_Interface/social_networks/facebook.svg" alt="Facebook"
                             style="width: calc(100vw * 28 / 1366); height: auto; margin-bottom: calc(100vw * -6 / 1366); margin-right: calc(100vw * -5 / 1366);">
                        </a>
                        <a href="#" class="button-like non-selectable instagram-button">
                            <img src="/images/System_Interface/social_networks/instagram.svg" alt="Instagram"
                             style="width: calc(100vw * 25 / 1366); height: auto;">
                        </a>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <table class="footer-table_3">
        <hr>
        <tbody>
            <tr>
                <td class="footer_3-one-column">
                    Всi права захищенi © 2024 Optics
                </td>

                <td class="footer_3-two-column">
                    <a href="#" class="button-like non-selectable">ПОЛІТИКА КОНФIДЕНЦIЙНОСТI</a>
                </td>

                <td class="footer_3-two-column" style="width: 17.52%;">
                    <a href="#" class="button-like non-selectable">ПРАВИЛА КОРИСТУВАННЯ САЙТОМ</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<script src="/js_main/footer.js"></script>
