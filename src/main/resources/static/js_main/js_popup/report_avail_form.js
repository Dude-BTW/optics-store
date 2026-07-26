/**
 * ============================================================================
 * FEATURE: Out-of-Stock Subscription System
 * ============================================================================
 * Overrides standard cart interactions for unavailable products. Initializes a specialized
 * subscription form modal, handling data validation and asynchronous API communication.
 */
import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";
import { checkCode, checkLinks, checkProfanity } from "/js_main/profanity.js";

// Open Popup Report Availability

$(".bottom-icon-non-availability").click(function () {
  const buttonId = $(this).attr("id");
  const opticId = buttonId.split("_")[1];

  $("#popup-hidden-optic-id").val(opticId);
  $(".popup-bg-report-avail").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-report-avail").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");

  initAllReportAvail(
    "",
    ".enter-report-Availability-popup-container",
    ".popup-report-avail",
    "#popup-report-avail-button",
    "#reportAvailPopupForm",
    "report_availability",
    "Надсилання даних",
    "Дані надіслано.<br>Чекайте відповіді!",
    "Під час відправлення даних сталася помилка",
    false,
  );
});

// Add & Edit Report Availability

function initAllReportAvail(
  editId,
  container,
  parentSelector,
  buttonSelector,
  form,
  actionForm,
  text1,
  text2,
  text3,
  editMode,
) {
  document
    .querySelectorAll(parentSelector + " " + container)
    .forEach((container) =>
      initReportAvailContainer(
        editId,
        container,
        parentSelector,
        buttonSelector,
        form,
        actionForm,
        text1,
        text2,
        text3,
        editMode,
      ),
    );
}
window.initAllReportAvail = initAllReportAvail;

function initReportAvailContainer(
  editId,
  container,
  parentContainer,
  buttonSelector,
  form,
  actionForm,
  text1,
  text2,
  text3,
  editMode,
) {
  // Dropdown

  const dropdownContentSortingOptics = document.getElementById(
    "dropdown-content-sortingOptics",
  );
  const dropdownSpanSortingOptics = document.getElementById(
    "dropdown-span-sortingOptics",
  );

  (function () {
    function adjustCurrentDropdown() {
      if (!dropdownSpanSortingOptics || !dropdownContentSortingOptics) return;

      dropdownContentSortingOptics.style.width =
        dropdownSpanSortingOptics.offsetWidth + "px";

      const buttons = dropdownContentSortingOptics.querySelectorAll("button");
      buttons.forEach((button) => {
        if (button.scrollWidth > button.clientWidth) {
          const words = button.innerText.split(" ");
          const lastWord = words.pop();
          button.innerHTML = words.join(" ") + "<br>" + lastWord;
        }
      });
    }
    window.addEventListener("load", adjustCurrentDropdown);
    if (document.readyState === "complete") adjustCurrentDropdown();
  })();

  function addHoverStyles(dropdownSpan) {
    dropdownSpan.style.backgroundColor = "#e9ecef";
    dropdownSpan.style.color = "#e6746d";
  }

  function removeHoverStyles(dropdownSpan) {
    dropdownSpan.style.backgroundColor = "";
    dropdownSpan.style.color = "";
  }

  dropdownContentSortingOptics.addEventListener("mouseenter", function () {
    dropdownSpanSortingOptics.style.borderBottomLeftRadius =
      "calc(100vw * 0 / 1366)";
    dropdownSpanSortingOptics.style.borderBottomRightRadius =
      "calc(100vw * 0 / 1366)";
    addHoverStyles(dropdownSpanSortingOptics);
  });

  dropdownContentSortingOptics.addEventListener("mouseleave", function () {
    dropdownSpanSortingOptics.style.borderBottomLeftRadius =
      "calc(100vw * 5 / 1366)";
    dropdownSpanSortingOptics.style.borderBottomRightRadius =
      "calc(100vw * 5 / 1366)";
    removeHoverStyles(dropdownSpanSortingOptics);
  });

  dropdownSpanSortingOptics.addEventListener("mouseenter", function () {
    dropdownSpanSortingOptics.style.borderBottomLeftRadius =
      "calc(100vw * 0 / 1366)";
    dropdownSpanSortingOptics.style.borderBottomRightRadius =
      "calc(100vw * 0 / 1366)";
    addHoverStyles(dropdownSpanSortingOptics);
  });

  dropdownSpanSortingOptics.addEventListener("mouseleave", function () {
    dropdownSpanSortingOptics.style.borderBottomLeftRadius =
      "calc(100vw * 5 / 1366)";
    dropdownSpanSortingOptics.style.borderBottomRightRadius =
      "calc(100vw * 5 / 1366)";
    removeHoverStyles(dropdownSpanSortingOptics);
  });

  // Report Availability

  const activeTimersReportAvailPop = {};

  function showMessageReportAvailPop(element) {
    if (!element) return;
    if (activeTimersReportAvailPop[element.id]) {
      clearTimeout(activeTimersReportAvailPop[element.id]);
    }
    element.style.opacity = "1";
    element.style.visibility = "visible";
  }

  function hideMessageReportAvailPop(element) {
    if (!element) return;
    if (activeTimersReportAvailPop[element.id]) {
      clearTimeout(activeTimersReportAvailPop[element.id]);
    }
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  function hideMessageReportAvailPopAfterDelay(element, delay) {
    if (!element) return;
    if (activeTimersReportAvailPop[element.id]) {
      clearTimeout(activeTimersReportAvailPop[element.id]);
    }
    activeTimersReportAvailPop[element.id] = setTimeout(() => {
      hideMessageReportAvailPop(element);
      delete activeTimersReportAvailPop[element.id];
    }, delay);
  }

  const parentContainerPop = container.closest(parentContainer);
  if (!parentContainerPop) return;

  let elemId = editMode ? `_${editId}` : "";
  const parentRoot =
    parentContainerPop || container.closest(".popup-report-avail") || document;

  const isSelector = (s) =>
    typeof s === "string" &&
    (s.startsWith("#") ||
      s.startsWith(".") ||
      s.includes(" ") ||
      s.includes("["));
  const pick = (baseOrSelector, selectorOverride) => {
    const selector =
      selectorOverride || (isSelector(baseOrSelector) ? baseOrSelector : null);
    if (selector) {
      return (
        container.querySelector(selector) ||
        parentRoot.querySelector(selector) ||
        document.querySelector(selector)
      );
    }
    const baseId = String(baseOrSelector);
    let el = container.querySelector(`#${baseId}${elemId}`);
    if (!el) el = container.querySelector(`#${baseId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}${elemId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}`);
    if (!el) el = document.getElementById(`${baseId}${elemId}`);
    if (!el) el = document.getElementById(baseId);
    return el;
  };

  const button = pick(buttonSelector);

  const clearButtonNameReportAvail = pick(
    "clear-button-report-avail-popup-name",
  );
  const inputNameReportAvail = pick("enter-name-popup-report-avail-input");
  const notCorrectMessageNameReportAvail = pick(
    "not-correct-required-popup-report-avail-field-name",
  );
  const emptyMessageNameReportAvail = pick(
    "required-popup-report-avail-field-name",
  );

  const clearButtonPhoneReportAvail = pick(
    "clear-button-report-avail-popup-phone",
  );
  const inputPhoneReportAvail = pick("enter-phone-popup-report-avail-input");
  const notCorrectMessagePhoneReportAvail = pick(
    "not-correct-required-popup-report-avail-field-phone",
  );
  const emptyMessagePhoneReportAvail = pick(
    "required-popup-report-avail-field-phone",
  );

  const clearButtonEmailReportAvail = pick(
    "clear-button-report-avail-popup-email",
  );
  const inputEmailReportAvail = pick("enter-email-popup-report-avail-input");
  const notCorrectMessageEmailReportAvail = pick(
    "not-correct-required-popup-report-avail-field-email",
  );
  const emptyMessageEmailReportAvail = pick(
    "required-popup-report-avail-field-email",
  );

  const tokenInputReportAvail = pick("recaptchaTokenReportAvail");
  const versionInputReportAvail = pick("recaptchaVersionReportAvail");

  const gRecaptchaContainerReportAvail = pick(
    "report-avail-popup-g-recaptcha-container",
  );
  const emptyGRecaptchaReportAvail = pick(
    "required-popup-field-report-avail-g-recaptcha",
  );

  const recaptchaV3ReportAvail = initRecaptchaV3({
    siteKey: "<REPLACE_ME>",
    action: actionForm,
    container,
    tokenInputSelector: `#${tokenInputReportAvail.id}`,
    versionInputSelector: `#${versionInputReportAvail.id}`,
    trackedElements: [
      inputNameReportAvail,
      inputPhoneReportAvail,
      inputEmailReportAvail,
    ],
  });

  if (
    button &&
    clearButtonNameReportAvail &&
    inputNameReportAvail &&
    notCorrectMessageNameReportAvail &&
    emptyMessageNameReportAvail &&
    clearButtonPhoneReportAvail &&
    inputPhoneReportAvail &&
    notCorrectMessagePhoneReportAvail &&
    emptyMessagePhoneReportAvail &&
    clearButtonEmailReportAvail &&
    inputEmailReportAvail &&
    notCorrectMessageEmailReportAvail &&
    emptyMessageEmailReportAvail &&
    gRecaptchaContainerReportAvail &&
    emptyGRecaptchaReportAvail &&
    tokenInputReportAvail &&
    versionInputReportAvail
  ) {
    [
      notCorrectMessageNameReportAvail,
      emptyMessageNameReportAvail,
      notCorrectMessagePhoneReportAvail,
      emptyMessagePhoneReportAvail,
      notCorrectMessageEmailReportAvail,
      emptyMessageEmailReportAvail,
      emptyGRecaptchaReportAvail,
    ].forEach((msg) => hideMessageReportAvailPop(msg));

    button.addEventListener("click", function () {
      if (inputNameReportAvail) {
        const name = inputNameReportAvail.value.trim();
        if (name === "") {
          showMessageReportAvailPop(emptyMessageNameReportAvail);
          inputNameReportAvail.value = "";
        } else if (
          name.length < 2 ||
          checkProfanity(name) ||
          checkCode(name) ||
          checkLinks(name)
        ) {
          const hasProfanity = checkProfanity(name);
          const hasCode = checkCode(name);
          const hasLinks = checkLinks(name);
          let dopTimeout = 0;

          if (hasProfanity || hasCode || hasLinks) {
            notCorrectMessageNameReportAvail.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "В імені",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessageNameReportAvail.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageReportAvailPop(notCorrectMessageNameReportAvail);
          hideMessageReportAvailPopAfterDelay(
            notCorrectMessageNameReportAvail,
            2000 + dopTimeout,
          );
        }
      }

      if (inputPhoneReportAvail) {
        const phone = inputPhoneReportAvail.value.trim();
        if (phone === "") {
          showMessageReportAvailPop(emptyMessagePhoneReportAvail);
          inputPhoneReportAvail.value = "";
        } else if (phone.length < 10) {
          showMessageReportAvailPop(notCorrectMessagePhoneReportAvail);
          hideMessageReportAvailPopAfterDelay(
            notCorrectMessagePhoneReportAvail,
            2000,
          );
        }
      }

      if (inputEmailReportAvail) {
        const email = inputEmailReportAvail.value.trim();
        if (email === "") {
          showMessageReportAvailPop(emptyMessageEmailReportAvail);
          inputEmailReportAvail.value = "";
        } else if (
          !(
            typeof validator !== "undefined" &&
            validator.isEmail(email) &&
            email.length >= 3
          )
        ) {
          showMessageReportAvailPop(notCorrectMessageEmailReportAvail);
          hideMessageReportAvailPopAfterDelay(
            notCorrectMessageEmailReportAvail,
            2000,
          );
        }
      }

      if (isVisible(gRecaptchaContainerReportAvail)) {
        let recaptchaResponse;
        if (editId) {
          recaptchaResponse = grecaptcha.getResponse(
            window.widgetIdEdtiReportAvail[editId],
          );
        } else {
          recaptchaResponse = grecaptcha.getResponse(widgetIdReportAvail);
        }
        if (!recaptchaResponse) {
          showMessageReportAvailPop(emptyGRecaptchaReportAvail);
        } else {
          hideMessageReportAvailPop(emptyGRecaptchaReportAvail);
        }
      }
    });

    if (inputNameReportAvail) {
      inputNameReportAvail.addEventListener("input", function () {
        hideMessageReportAvailPop(emptyMessageNameReportAvail);
      });
      inputNameReportAvail.addEventListener("focus", function () {
        hideMessageReportAvailPop(notCorrectMessageNameReportAvail);
      });
      notCorrectMessageNameReportAvail.addEventListener("click", function () {
        hideMessageReportAvailPop(notCorrectMessageNameReportAvail);
        inputNameReportAvail.focus();
      });
    }

    if (inputPhoneReportAvail) {
      inputPhoneReportAvail.addEventListener("input", function () {
        hideMessageReportAvailPop(emptyMessagePhoneReportAvail);
      });
      inputPhoneReportAvail.addEventListener("focus", function () {
        hideMessageReportAvailPop(notCorrectMessagePhoneReportAvail);
      });
      notCorrectMessagePhoneReportAvail.addEventListener("click", function () {
        hideMessageReportAvailPop(notCorrectMessagePhoneReportAvail);
        inputPhoneReportAvail.focus();
      });
    }

    if (inputEmailReportAvail) {
      inputEmailReportAvail.addEventListener("input", function () {
        hideMessageReportAvailPop(emptyMessageEmailReportAvail);
      });
      inputEmailReportAvail.addEventListener("focus", function () {
        hideMessageReportAvailPop(notCorrectMessageEmailReportAvail);
      });
      notCorrectMessageEmailReportAvail.addEventListener("click", function () {
        hideMessageReportAvailPop(notCorrectMessageEmailReportAvail);
        inputEmailReportAvail.focus();
      });
    }

    window.recaptchaSuccessCallbackPopReportAvail = function () {
      if (isVisible(gRecaptchaContainerReportAvail)) {
        hideMessageReportAvailPop(emptyGRecaptchaReportAvail);
      }
    };
  }

  const reportForm = parentContainerPop.querySelector(form);
  if (reportForm) {
    reportForm.style.transition = "opacity 250ms";
    $(reportForm).off("submit");

    $(reportForm).on("submit", function (event) {
      event.preventDefault();
      const required = [
        `#${button.id}`,

        `#${inputNameReportAvail.id}`,
        `#${notCorrectMessageNameReportAvail.id}`,
        `#${emptyMessageNameReportAvail.id}`,

        `#${inputPhoneReportAvail.id}`,
        `#${notCorrectMessagePhoneReportAvail.id}`,
        `#${emptyMessagePhoneReportAvail.id}`,

        `#${inputEmailReportAvail.id}`,
        `#${notCorrectMessageEmailReportAvail.id}`,
        `#${emptyMessageEmailReportAvail.id}`,

        `#${gRecaptchaContainerReportAvail.id}`,
        `#${emptyGRecaptchaReportAvail.id}`,
      ];
      const missingSelectors = required.filter(
        (sel) => container.querySelector(sel) === null,
      );
      if (missingSelectors.length > 0) {
        console.error(
          "Не знайдено обов’язкових елементів форми:",
          missingSelectors.join(", "),
        );
        event.preventDefault();

        const observer = new MutationObserver((_, obs) => {
          const stillMissing = required.filter(
            (sel) => container.querySelector(sel) === null,
          );
          if (stillMissing.length === 0) {
            obs.disconnect();
            reportForm.submit();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return;
      }

      var errorMessages = [
        notCorrectMessageEmailReportAvail,
        notCorrectMessageNameReportAvail,
        notCorrectMessagePhoneReportAvail,
        emptyMessageEmailReportAvail,
        emptyMessageNameReportAvail,
        emptyMessagePhoneReportAvail,
      ];

      const hasVisibleErrors = errorMessages.some(
        (msg) => msg.style.opacity === "1",
      );

      if (hasVisibleErrors) {
        event.preventDefault();
        if (button) button.disabled = false;
        return;
      }

      event.preventDefault();
      if (button) button.disabled = true;

      reportForm.style.opacity = "0.2";
      reportForm.style.pointerEvents = "none";

      const originalPopup = container.closest(parentContainer);
      if (!originalPopup) return;

      const clonePopup = originalPopup.cloneNode(false);
      clonePopup.classList.add("clone-transparent");

      clonePopup.style.transition = "opacity 250ms";
      clonePopup.style.opacity = "1";
      const loadingText = document.createElement("div");
      loadingText.className = "loading-text-popup";
      loadingText.innerHTML = `${text1}<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>`;

      clonePopup.appendChild(loadingText);
      originalPopup.parentElement.appendChild(clonePopup);

      requestAnimationFrame(() => {
        loadingText.classList.add("show");
      });

      function finalizeReset(successText) {
        loadingText.innerHTML = successText;
        setTimeout(() => {
          reportForm.style.opacity = "1";
          reportForm.style.pointerEvents = "auto";
          loadingText.classList.remove("show");
          setTimeout(() => {
            clonePopup.remove();
          }, 250);
          if (button) button.disabled = false;
        }, 500);
      }

      function sendToken(token) {
        if (tokenInputReportAvail) {
          tokenInputReportAvail.value = token;
        }
        const formData = new FormData(reportForm);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", reportForm.action, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const resp = JSON.parse(xhr.responseText);

              if (resp.success) {
                if (!editMode) {
                  if (inputNameReportAvail) {
                    inputNameReportAvail.style.transition = "opacity 500ms";
                    inputNameReportAvail.style.opacity = "0";
                  }
                  if (inputPhoneReportAvail) {
                    inputPhoneReportAvail.style.transition = "opacity 500ms";
                    inputPhoneReportAvail.style.opacity = "0";
                  }
                  if (inputEmailReportAvail) {
                    inputEmailReportAvail.style.transition = "opacity 500ms";
                    inputEmailReportAvail.style.opacity = "0";
                  }
                }
                if (!editMode && isVisible(gRecaptchaContainerReportAvail)) {
                  animateHide(gRecaptchaContainerReportAvail);
                }
                if (!editMode && typeof grecaptcha !== "undefined") {
                  if (
                    editId &&
                    window.widgetIdEdtiReportAvail &&
                    window.widgetIdEdtiReportAvail[editId] !== undefined
                  ) {
                    grecaptcha.reset(window.widgetIdEdtiReportAvail[editId]);
                  } else if (typeof widgetIdReportAvail !== "undefined") {
                    grecaptcha.reset(widgetIdReportAvail);
                  }
                }

                loadingText.innerHTML = text2;

                if (!editMode) {
                  const inputFadeMs = 500;
                  setTimeout(() => {
                    const fields = [
                      inputNameReportAvail,
                      inputPhoneReportAvail,
                      inputEmailReportAvail,
                    ].filter(Boolean);

                    fields.forEach((el) => {
                      el.value = "";
                      el.style.opacity = "0";
                      el.style.transition = `opacity ${inputFadeMs}ms`;
                    });

                    requestAnimationFrame(() => {
                      fields.forEach((el) => {
                        el.style.opacity = "1";
                      });
                    });

                    setTimeout(() => {
                      reportForm.style.opacity = "1";
                      reportForm.style.pointerEvents = "auto";
                      loadingText.classList.remove("show");
                      clonePopup.style.opacity = "0";
                      setTimeout(() => {
                        clonePopup.remove();
                      }, 500);
                      if (button) button.disabled = false;
                    }, inputFadeMs);
                  }, 500);
                } else {
                  setTimeout(() => {
                    reportForm.style.opacity = "1";
                    reportForm.style.pointerEvents = "auto";
                    loadingText.classList.remove("show");
                    clonePopup.style.opacity = "0";
                    setTimeout(() => {
                      clonePopup.remove();
                    }, 500);
                    if (button) button.disabled = false;
                  }, 500);
                }

                try {
                  if (editMode) {
                    const cancelBtn =
                      parentContainerPop &&
                      parentContainerPop.querySelector(
                        ".card-cont-cancel-button",
                      );
                    if (cancelBtn && typeof cancelBtn.click === "function") {
                      cancelBtn.click();
                    }
                  }
                } catch (e) {}
                return;
              }

              loadingText.innerHTML = text3;
              setTimeout(() => {
                reportForm.style.opacity = "1";
                reportForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 500);
              return;
            } catch (e) {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";
              setTimeout(
                () => {
                  reportForm.style.opacity = "1";
                  reportForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                },
                editMode ? 0 : 500,
              );
              return;
            }
          } else if (xhr.status === 403) {
            try {
              const resp = JSON.parse(xhr.responseText);
              const err = resp.error;

              if (
                err.includes("Не вдалося підтвердити, що Ви не робот") ||
                err.includes("Часті невдалі спроби пройти перевірку на бота")
              ) {
                if (editMode) {
                  const cancelBtn = parentContainerPop.querySelector(
                    ".card-cont-cancel-button",
                  );
                  const col = cancelBtn.closest(".col");
                  animateShow(gRecaptchaContainerReportAvail, col);
                } else {
                  animateShow(gRecaptchaContainerReportAvail, null);
                }
                loadingText.innerHTML = err;

                setTimeout(
                  () => {
                    reportForm.style.opacity = "1";
                    reportForm.style.pointerEvents = "auto";
                    loadingText.classList.remove("show");
                    document.querySelector(".clone-transparent")?.remove();
                    if (button) button.disabled = false;
                  },
                  editMode ? 0 : 500,
                );
                return;
              }

              if (
                err.startsWith("Ваш IP тимчасово заблоковано на 15") ||
                err.startsWith("Ваш IP тимчасово заблоковано на 60") ||
                err.startsWith("Ваш IP заблоковано назавжди") ||
                err === "Забагато запитів, зачекайте трохи."
              ) {
                loadingText.innerHTML = err;

                setTimeout(() => {
                  reportForm.style.opacity = "1";
                  reportForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                }, 1500);
                return;
              }

              if (editMode) {
                reportForm.style.opacity = "1";
                reportForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              } else {
                loadingText.innerHTML = "Відмова сервера: " + err;

                setTimeout(() => {
                  reportForm.style.opacity = "1";
                  reportForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                }, 1500);
                return;
              }
            } catch (e) {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";
              setTimeout(
                () => {
                  reportForm.style.opacity = "1";
                  reportForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                },
                editMode ? 0 : 500,
              );
              return;
            }
          } else {
            loadingText.innerHTML =
              "Помилка сервера. Будь ласка, спробуйте пізніше";

            const resetInputs = () => {
              reportForm.style.opacity = "1";
              reportForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                clonePopup.remove();
              }, 250);
            };
            setTimeout(resetInputs, editMode ? 0 : 500);
            if (button) button.disabled = false;
            return;
          }
        };

        xhr.onerror = function () {
          loadingText.innerHTML = "Помилка мережі. Спробуйте ще раз";
          setTimeout(
            () => {
              reportForm.style.opacity = "1";
              reportForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                clonePopup.remove();
              }, 250);
              if (button) button.disabled = false;
            },
            editMode ? 0 : 500,
          );
        };

        xhr.send(formData);
      }

      const v2Visible = isVisible(gRecaptchaContainerReportAvail);
      if (v2Visible) {
        let tokenV2;
        if (editId) {
          tokenV2 = grecaptcha.getResponse(
            window.widgetIdEdtiReportAvail[editId],
          );
        } else if (typeof widgetIdReportAvail !== "undefined") {
          tokenV2 = grecaptcha.getResponse(widgetIdReportAvail);
        }

        if (!tokenV2) {
          loadingText.innerHTML = "Не вдалося підтвердити, що Ви не робот";
          setTimeout(
            () => {
              reportForm.style.opacity = "1";
              reportForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                clonePopup.remove();
              }, 250);
              if (button) button.disabled = false;
            },
            editMode ? 0 : 500,
          );
          return;
        }
        if (versionInputReportAvail) {
          versionInputReportAvail.value = "v2";
        }
        sendToken(tokenV2);
      } else {
        recaptchaV3ReportAvail.generateToken().then((token) => {
          sendToken(token);
        });
      }
    });
  }

  // Clear Report Availability Button

  const fields = [
    {
      inputId: `#${inputNameReportAvail.id}`,
      buttonId: `#${clearButtonNameReportAvail.id}`,
    },
    {
      inputId: `#${inputPhoneReportAvail.id}`,
      buttonId: `#${clearButtonPhoneReportAvail.id}`,
    },
    {
      inputId: `#${inputEmailReportAvail.id}`,
      buttonId: `#${clearButtonEmailReportAvail.id}`,
    },
  ];

  fields.forEach(({ inputId, buttonId }) => {
    const input = container.querySelector(inputId);
    const button = container.querySelector(buttonId);

    if (!input || !button) return;

    const icon = button.querySelector(".clear-icon-popup");
    const wrapper = input.closest(".enter-reportAvail-popup-CONT-input");

    if (!wrapper) return;

    wrapper.addEventListener("focusin", () => {
      button.style.opacity = "1";
    });

    wrapper.addEventListener("focusout", (e) => {
      const related = e.relatedTarget;
      if (!wrapper.contains(related)) {
        button.style.opacity = "0";
      }
    });

    const changeToRed = () => {
      icon.src = "/images/System_Interface/close/close_tiny_red.svg";
    };

    const changeToDefault = () => {
      icon.src = "/images/System_Interface/close/close_tiny.svg";
    };

    button.addEventListener("mouseenter", changeToRed);
    button.addEventListener("mouseleave", changeToDefault);
    icon.addEventListener("mouseenter", changeToRed);
    icon.addEventListener("mouseleave", changeToDefault);

    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
    });
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const __prevTrans = button.style.transition;
      button.style.transition = "none";
      input.value = "";
      button.style.opacity = "0";
      button.style.pointerEvents = "";
      if (button.style.removeProperty) {
        button.style.removeProperty("pointer-events");
      }
      void button.offsetWidth;
      button.style.transition = __prevTrans;
      input.blur();
      requestAnimationFrame(() => {
        button.style.pointerEvents = "";
        if (button.style.removeProperty) {
          button.style.removeProperty("pointer-events");
        }
      });
    });
  });

  // Phone Report Availability Input

  if (inputPhoneReportAvail) {
    const iti = window.intlTelInput(inputPhoneReportAvail, {
      loadUtils: () =>
        import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),
      autoPlaceholder: "polite",
      geoIpLookup: function (callback) {
        fetch("https://ipinfo.io/json?token=<REPLACE_ME>")
          .then((response) => response.json())
          .then((data) => {
            const countryCode = data.country || "us";
            callback(countryCode);
          })
          .catch(() => {
            callback("us");
          });
      },
      initialCountry: "auto",
      nationalMode: false,
      formatOnDisplay: true,
      dropdownContainer: document.body,
    });

    inputPhoneReportAvail.addEventListener("focus", () => {
      const currentNumber = inputPhoneReportAvail.value.trim();
      if (currentNumber === "") {
        const countryData = iti.getSelectedCountryData();
        const dialCode = countryData.dialCode;
        inputPhoneReportAvail.value = `+${dialCode} `;
        inputPhoneReportAvail.setSelectionRange(
          inputPhoneReportAvail.value.length,
          inputPhoneReportAvail.value.length,
        );
      }
    });
  }
}

// Close Popup Report Availability

$(".close-popup-report-avail, .popup-bg-report-avail, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-report-avail").length === 0 ||
      $(event.target).hasClass("close-popup-report-avail") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-report-avail").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-report-avail").css({
        left: `calc(50% + ${scrollbarWidth / 2}px)`,
      });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);
