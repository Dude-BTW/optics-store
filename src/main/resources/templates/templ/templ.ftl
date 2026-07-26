<#macro pages 
    showCartPopup               = false
    showGlobalReaptchaPopup     = false
    showReaptchaPopup           = false
    showReportAvailabilityPopup = false
    showRatingGlobalPopup       = false
    showMainTopPopup            = false
    showProductFilter1Popup     = false
    showProductFilter2Popup     = false>

    <!DOCTYPE html>
    <html lang="uk">
    <head>
<#--
  MAIN LAYOUT TEMPLATE: Implements the SSR (Server-Side Rendering) architecture wrapper. Connects
  global CSS/JS, Google reCAPTCHA (infrastructure protection), and includes primary layout components
  (navbars, footer, popups).
-->
        <link rel="icon" type="image/svg+xml" href="/images/System_Interface/favicon.svg">

        <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
        <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/css/intlTelInput.css">

        <link rel="dns-prefetch" href="//www.google.com">
        <link rel="preconnect" href="https://www.google.com" crossorigin>
        <link rel="preconnect" href="https://www.gstatic.com" crossorigin>
        <link rel="preload" href="https://www.google.com/recaptcha/api.js?render=<REPLACE_ME>" as="script">
        <script src="https://www.google.com/recaptcha/api.js?render=<REPLACE_ME>"></script>
        <script src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit" async defer></script>


        <meta charset="UTF-8">
        <title>Optics</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
              crossorigin="anonymous">

        <link rel="stylesheet" type="text/css" href="/css_main/templ.css">
        <link rel="stylesheet" type="text/css" href="/css_main/main_page_func_popup.css">
        <link rel="stylesheet" type="text/css" href="/css_main/main_page_popup.css">
    </head>
    <body>

    <div class="container-fluid" id="body">

        <div class="row demn" id="navbar1-container">
            <div class="col">
                <div class="margin-body">
                    <#include "navbar_1.ftl">
                </div>
            </div>
        </div>

        <div class="row demn" id="navbar2-container">
            <div class="col">
                <div class="margin-body">
                    <#include "navbar_2.ftl">
                </div>
            </div>
        </div>

        <div class="row flex-grow-1" id="content">
            <#-- <div class="col-0 col-md-2" id="demn">
                <#include "left.ftl">
            </div> -->
            
            <div class="col-12 p-0">
                <div class="margin-body">
                    <#nested>
                </div>
            </div>
        </div>

        <div class="row demn">
            <div class="col">
                <div class="margin-body">
                    <#include "footer.ftl">
                </div>
            </div>
        </div>

        <#include "main_popup.ftl">
        
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
            integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
            integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
            crossorigin="anonymous"></script>

    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.1/js/utils.js"></script>

    <script src="https://unpkg.com/validator@latest/validator.min.js"></script>    
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

    <script src="/js_main/js_popup/main_page_popup.js"></script>
    <script src="/js_main/js_global_func/global_functions.js"></script>
    <script type="module" src="/js_main/js_global_func/global_form_seccap.js"></script>
    <script src="/js_main/all_pages.js"></script>
    <script type="module" src="/js_main/js_popup/register_form.js"></script>
    <script type="module" src="/js_main/js_popup/login_form.js"></script>
    <script src="/js_main/local_storage_optics.js"></script>


    <#if showCartPopup?? && showCartPopup
    || showGlobalReaptchaPopup?? && showGlobalReaptchaPopup
    || showReaptchaPopup?? && showReaptchaPopup
    || showReportAvailabilityPopup?? && showReportAvailabilityPopup
    || showRatingGlobalPopup?? && showRatingGlobalPopup
    || showMainTopPopup?? && showMainTopPopup
    || showProductFilter1Popup?? && showProductFilter1Popup
    || showProductFilter2Popup?? && showProductFilter2Popup>
        <script type="module" src="/js_main/profanity.js"></script>
    </#if>

    <#if showReportAvailabilityPopup?? && showReportAvailabilityPopup>
        <script type="module" src="/js_main/js_popup/report_avail_form.js"></script>
    </#if>
    <#if showMainTopPopup?? && showMainTopPopup>
        <script type="module" src="/js/products/product_quest_answ_form.js"></script>
        <script type="module" src="/js/products/product_rat_star_form.js"></script>
    </#if>
    <#if showRatingGlobalPopup?? && showRatingGlobalPopup>
        <script type="module" src="/js/star_rating/star_rating_form.js"></script>
    </#if>
    <#if showReportAvailabilityPopup?? && showReportAvailabilityPopup
      || showRatingGlobalPopup?? && showRatingGlobalPopup
      || showMainTopPopup?? && showMainTopPopup>
        <script type="module" src="/js_main/js_global_func/global_form_edit_delete.js"></script>
    </#if>


    <script>
        $(document).ready(function() {
            $('#navbar1-container').hover(
                function() {
                    $('#navbar2-container').css('z-index', '501');
                },
                function() {
                    $('#navbar2-container').css('z-index', '');
                }
            );
        });
    </script>

    </body>
    </html>
</#macro>
