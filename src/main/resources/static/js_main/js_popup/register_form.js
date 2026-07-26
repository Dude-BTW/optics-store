/**
 * ============================================================================
 * FEATURE: Authentication Module & Registration UI
 * ============================================================================
 * Handles initialization of the registration/login modal. Implements strict client-side
 * input validation (email formatting, password strength) and asynchronous form submission.
 * Integrates dynamic rendering of loading states and error handling via REST API responses.
 */
import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";
import { checkCode, checkLinks, checkProfanity } from "/js_main/profanity.js";

// Open Popup Register

$("#user-button").click(function () {
  $(".popup-bg-register-login").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-register-login").css({ left: "50%" });

  if (typeof scrollbarWidth !== "undefined") {
    $(".margin-body").css("margin-right", scrollbarWidth + "px");
  }

  const popupLogin = document.getElementById("popup-login");
  const popupRegister = document.getElementById("popup-register");
  const btnLoginTab = document.getElementById("part-login");
  const btnRegisterTab = document.getElementById("part-register");

  let registerInitAttached = false;

  let loginInitAttached = false;

  function maybeInitRegister() {
    if (!popupRegister) return;

    if (popupRegister.style.display === "") {
      if (!registerInitAttached) {
        registerInitAttached = true;

        initAllRegister(
          "",
          ".enter-register-popup-container",
          "#popup-register",
          "#popup-register-button",
          "#registerPartPopupForm",
          "register",
          "Реєстрація",
          "Вас зареєстровано!",
          "Під час відправлення даних сталася помилка",
          false,
        );
      }
    } else if (popupRegister.style.display === "none") {
      registerInitAttached = false;
    }
  }

  function maybeInitLogin() {
    if (!popupLogin) return;

    if (popupLogin.style.display === "") {
      if (!loginInitAttached) {
        loginInitAttached = true;

        initAllLogin(
          "",
          ".enter-register-popup-container",
          "#popup-login",
          "#popup-login-button",
          "#loginPartPopupForm",
          "login",
          "Вхід",
          "Ви увійшли!",
          "Під час відправлення даних сталася помилка",
          false,
        );
      }
    } else if (popupLogin.style.display === "none") {
      loginInitAttached = false;
    }
  }

  maybeInitRegister();
  maybeInitLogin();

  if (popupRegister && !popupRegister.__registerDisplayObserver) {
    const obs = new MutationObserver(maybeInitRegister);
    obs.observe(popupRegister, {
      attributes: true,
      attributeFilter: ["style"],
    });
    popupRegister.__registerDisplayObserver = obs;
  }

  if (popupLogin && !popupLogin.__loginDisplayObserver) {
    const obsLogin = new MutationObserver(maybeInitLogin);
    obsLogin.observe(popupLogin, {
      attributes: true,
      attributeFilter: ["style"],
    });
    popupLogin.__loginDisplayObserver = obsLogin;
  }

  if (btnLoginTab && btnRegisterTab && popupLogin && popupRegister) {
    if (!btnLoginTab.__boundSwitch) {
      btnLoginTab.addEventListener("click", () => {
        popupLogin.style.display = "";
        popupRegister.style.display = "none";
        maybeInitLogin();
      });
      btnLoginTab.__boundSwitch = true;
    }
    if (!btnRegisterTab.__boundSwitch) {
      btnRegisterTab.addEventListener("click", () => {
        popupLogin.style.display = "none";
        popupRegister.style.display = "";
        maybeInitRegister();
      });
      btnRegisterTab.__boundSwitch = true;
    }
  }
});

function initAllRegister(
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
    .forEach(function (el) {
      initRegisterContainer(
        editId,
        el,
        parentSelector,
        buttonSelector,
        form,
        actionForm,
        text1,
        text2,
        text3,
        editMode,
      );
    });
}

window.initAllRegister = initAllRegister;

/**
 * Initializes DOM bindings, configures intlTelInput for international phone formatting,
 * and sets up form submission interceptors with reCAPTCHA token generation.
 */
function initRegisterContainer(
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
  const activeTimersRegisterPop = {};

  function showMessageRegisterPop(element) {
    if (!element) return;
    if (activeTimersRegisterPop[element.id]) {
      clearTimeout(activeTimersRegisterPop[element.id]);
    }
    element.style.opacity = "1";
    element.style.visibility = "visible";
  }

  function hideMessageRegisterPop(element) {
    if (!element) return;
    if (activeTimersRegisterPop[element.id]) {
      clearTimeout(activeTimersRegisterPop[element.id]);
    }
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  function hideMessageRegisterPopAfterDelay(element, delay) {
    if (!element) return;
    if (activeTimersRegisterPop[element.id]) {
      clearTimeout(activeTimersRegisterPop[element.id]);
    }
    activeTimersRegisterPop[element.id] = setTimeout(() => {
      hideMessageRegisterPop(element);
      delete activeTimersRegisterPop[element.id];
    }, delay);
  }

  const parentContainerPop = container.closest(parentContainer);
  if (!parentContainerPop) return;

  let elemId = editMode ? `_${editId}` : "";

  const parentRoot =
    parentContainerPop ||
    container.closest(".popup-register-login") ||
    document;

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

  const clearButtonFNameRegister = pick("clear-button-register-popup-fname");
  const inputFNameRegister = pick("enter-fname-popup-register-input");
  const notCorrectMessageFNameRegister = pick(
    "not-correct-required-popup-register-field-fname",
  );
  const emptyMessageFNameRegister = pick("required-popup-register-field-fname");

  const clearButtonLNameRegister = pick("clear-button-register-popup-lname");
  const inputLNameRegister = pick("enter-lname-popup-register-input");
  const notCorrectMessageLNameRegister = pick(
    "not-correct-required-popup-register-field-lname",
  );
  const emptyMessageLNameRegister = pick("required-popup-register-field-lname");

  const clearButtonPhoneRegister = pick("clear-button-register-popup-phone");
  const inputPhoneRegister = pick("enter-phone-popup-register-input");
  const notCorrectMessagePhoneRegister = pick(
    "not-correct-required-popup-register-field-phone",
  );
  const emptyMessagePhoneRegister = pick("required-popup-register-field-phone");

  const clearButtonEmailRegister = pick("clear-button-register-popup-email");
  const inputEmailRegister = pick("enter-email-popup-register-input");
  const notCorrectMessageEmailRegister = pick(
    "not-correct-required-popup-register-field-email",
  );
  const emptyMessageEmailRegister = pick("required-popup-register-field-email");

  const clearButtonPasswordRegister = pick(
    "clear-button-register-popup-password",
  );
  const inputPasswordRegister = pick("enter-password-popup-register-input");
  const notCorrectMessagePasswordRegister = pick(
    "not-correct-required-popup-register-field-password",
  );
  const emptyMessagePasswordRegister = pick(
    "required-popup-register-field-password",
  );

  const tokenInputRegister = pick("recaptchaTokenRegister");
  const versionInputRegister = pick("recaptchaVersionRegister");

  const gRecaptchaContainerRegister = pick(
    "register-popup-g-recaptcha-container",
  );
  const emptyGRecaptchaRegister = pick(
    "required-popup-field-register-g-recaptcha",
  );

  const recaptchaV3Register = initRecaptchaV3({
    siteKey: "<REPLACE_ME>",
    action: actionForm,
    container,
    tokenInputSelector: `#${tokenInputRegister.id}`,
    versionInputSelector: `#${versionInputRegister.id}`,
    trackedElements: [
      inputFNameRegister,
      inputLNameRegister,
      inputPhoneRegister,
      inputEmailRegister,
      inputPasswordRegister,
    ],
  });

  if (
    button &&
    inputFNameRegister &&
    notCorrectMessageFNameRegister &&
    emptyMessageFNameRegister &&
    inputLNameRegister &&
    notCorrectMessageLNameRegister &&
    emptyMessageLNameRegister &&
    inputPhoneRegister &&
    notCorrectMessagePhoneRegister &&
    emptyMessagePhoneRegister &&
    inputEmailRegister &&
    notCorrectMessageEmailRegister &&
    emptyMessageEmailRegister &&
    inputPasswordRegister &&
    notCorrectMessagePasswordRegister &&
    emptyMessagePasswordRegister &&
    gRecaptchaContainerRegister &&
    emptyGRecaptchaRegister &&
    tokenInputRegister &&
    versionInputRegister
  ) {
    [
      notCorrectMessageFNameRegister,
      emptyMessageFNameRegister,
      notCorrectMessageLNameRegister,
      emptyMessageLNameRegister,
      notCorrectMessagePhoneRegister,
      emptyMessagePhoneRegister,
      notCorrectMessageEmailRegister,
      emptyMessageEmailRegister,
      notCorrectMessagePasswordRegister,
      emptyMessagePasswordRegister,
      emptyGRecaptchaRegister,
    ].forEach((msg) => hideMessageRegisterPop(msg));

    button.addEventListener("click", function () {
      if (inputFNameRegister) {
        const fname = inputFNameRegister.value.trim();
        if (fname === "") {
          showMessageRegisterPop(emptyMessageFNameRegister);
          inputFNameRegister.value = "";
        } else if (
          fname.length < 2 ||
          checkProfanity(fname) ||
          checkCode(fname) ||
          checkLinks(fname)
        ) {
          const hasProfanity = checkProfanity(fname);
          const hasCode = checkCode(fname);
          const hasLinks = checkLinks(fname);
          let dopTimeout = 0;

          if (hasProfanity || hasCode || hasLinks) {
            notCorrectMessageFNameRegister.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "В імені",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessageFNameRegister.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageRegisterPop(notCorrectMessageFNameRegister);
          hideMessageRegisterPopAfterDelay(
            notCorrectMessageFNameRegister,
            2000 + dopTimeout,
          );
        }
      }

      if (inputLNameRegister) {
        const lname = inputLNameRegister.value.trim();
        if (lname === "") {
          showMessageRegisterPop(emptyMessageLNameRegister);
          inputLNameRegister.value = "";
        } else if (
          lname.length < 2 ||
          checkProfanity(lname) ||
          checkCode(lname) ||
          checkLinks(lname)
        ) {
          const hasProfanity = checkProfanity(lname);
          const hasCode = checkCode(lname);
          const hasLinks = checkLinks(lname);
          let dopTimeout = 0;

          if (hasProfanity || hasCode || hasLinks) {
            notCorrectMessageLNameRegister.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "В прізвищі",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessageLNameRegister.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageRegisterPop(notCorrectMessageLNameRegister);
          hideMessageRegisterPopAfterDelay(
            notCorrectMessageLNameRegister,
            2000 + dopTimeout,
          );
        }
      }

      if (inputPhoneRegister) {
        const phone = inputPhoneRegister.value.trim();
        if (phone === "") {
          showMessageRegisterPop(emptyMessagePhoneRegister);
          inputPhoneRegister.value = "";
        } else if (phone.length < 10) {
          showMessageRegisterPop(notCorrectMessagePhoneRegister);
          hideMessageRegisterPopAfterDelay(
            notCorrectMessagePhoneRegister,
            2000,
          );
        }
      }

      if (inputEmailRegister) {
        const email = inputEmailRegister.value.trim();
        if (email === "") {
          showMessageRegisterPop(emptyMessageEmailRegister);
          inputEmailRegister.value = "";
        } else if (
          !(
            typeof validator !== "undefined" &&
            validator.isEmail(email) &&
            email.length >= 3
          )
        ) {
          showMessageRegisterPop(notCorrectMessageEmailRegister);
          hideMessageRegisterPopAfterDelay(
            notCorrectMessageEmailRegister,
            2000,
          );
        }
      }

      if (inputPasswordRegister) {
        const pass = inputPasswordRegister.value.trim();
        if (pass === "") {
          showMessageRegisterPop(emptyMessagePasswordRegister);
          inputPasswordRegister.value = "";
        } else if (pass.length < 2) {
          showMessageRegisterPop(notCorrectMessagePasswordRegister);
          hideMessageRegisterPopAfterDelay(
            notCorrectMessagePasswordRegister,
            2000,
          );
        }
      }

      if (isVisible(gRecaptchaContainerRegister)) {
        let recaptchaResponse;
        if (editId) {
          recaptchaResponse = grecaptcha.getResponse(
            window.widgetIdEdtiRegister[editId],
          );
        } else {
          recaptchaResponse = grecaptcha.getResponse(widgetIdRegister);
        }
        if (!recaptchaResponse) {
          showMessageRegisterPop(emptyGRecaptchaRegister);
        } else {
          hideMessageRegisterPop(emptyGRecaptchaRegister);
        }
      }
    });

    if (inputFNameRegister) {
      inputFNameRegister.addEventListener("input", function () {
        hideMessageRegisterPop(emptyMessageFNameRegister);
      });
      inputFNameRegister.addEventListener("focus", function () {
        hideMessageRegisterPop(notCorrectMessageFNameRegister);
      });
      notCorrectMessageFNameRegister.addEventListener("click", function () {
        hideMessageRegisterPop(notCorrectMessageFNameRegister);
        inputFNameRegister.focus();
      });
    }

    if (inputLNameRegister) {
      inputLNameRegister.addEventListener("input", function () {
        hideMessageRegisterPop(emptyMessageLNameRegister);
      });
      inputLNameRegister.addEventListener("focus", function () {
        hideMessageRegisterPop(notCorrectMessageLNameRegister);
      });
      notCorrectMessageLNameRegister.addEventListener("click", function () {
        hideMessageRegisterPop(notCorrectMessageLNameRegister);
        inputLNameRegister.focus();
      });
    }

    if (inputPhoneRegister) {
      inputPhoneRegister.addEventListener("input", function () {
        hideMessageRegisterPop(emptyMessagePhoneRegister);
      });
      inputPhoneRegister.addEventListener("focus", function () {
        hideMessageRegisterPop(notCorrectMessagePhoneRegister);
      });
      notCorrectMessagePhoneRegister.addEventListener("click", function () {
        hideMessageRegisterPop(notCorrectMessagePhoneRegister);
        inputPhoneRegister.focus();
      });
    }

    if (inputEmailRegister) {
      inputEmailRegister.addEventListener("input", function () {
        hideMessageRegisterPop(emptyMessageEmailRegister);
      });
      inputEmailRegister.addEventListener("focus", function () {
        hideMessageRegisterPop(notCorrectMessageEmailRegister);
      });
      notCorrectMessageEmailRegister.addEventListener("click", function () {
        hideMessageRegisterPop(notCorrectMessageEmailRegister);
        inputEmailRegister.focus();
      });
    }

    if (inputPasswordRegister) {
      inputPasswordRegister.addEventListener("input", function () {
        hideMessageRegisterPop(emptyMessagePasswordRegister);
      });
      inputPasswordRegister.addEventListener("focus", function () {
        hideMessageRegisterPop(notCorrectMessagePasswordRegister);
      });
      notCorrectMessagePasswordRegister.addEventListener("click", function () {
        hideMessageRegisterPop(notCorrectMessagePasswordRegister);
        inputPasswordRegister.focus();
      });
    }

    window.recaptchaSuccessCallbackPopRegister = function () {
      if (isVisible(gRecaptchaContainerRegister)) {
        hideMessageRegisterPop(emptyGRecaptchaRegister);
      }
    };
  }

  const registerForm = parentContainerPop.querySelector(form);
  if (registerForm) {
    registerForm.style.transition = "opacity 250ms";
    $(registerForm).off("submit");

    $(registerForm).on("submit", function (event) {
      event.preventDefault();

      const required = [
        `#${button.id}`,

        `#${inputFNameRegister.id}`,
        `#${notCorrectMessageFNameRegister.id}`,
        `#${emptyMessageFNameRegister.id}`,

        `#${inputLNameRegister.id}`,
        `#${notCorrectMessageLNameRegister.id}`,
        `#${emptyMessageLNameRegister.id}`,

        `#${inputPhoneRegister.id}`,
        `#${notCorrectMessagePhoneRegister.id}`,
        `#${emptyMessagePhoneRegister.id}`,

        `#${inputEmailRegister.id}`,
        `#${notCorrectMessageEmailRegister.id}`,
        `#${emptyMessageEmailRegister.id}`,

        `#${inputPasswordRegister.id}`,
        `#${notCorrectMessagePasswordRegister.id}`,
        `#${emptyMessagePasswordRegister.id}`,

        `#${gRecaptchaContainerRegister.id}`,
        `#${emptyGRecaptchaRegister.id}`,
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
            registerForm.submit();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return;
      }

      var errorMessages = [
        notCorrectMessageEmailRegister,
        notCorrectMessageFNameRegister,
        notCorrectMessageLNameRegister,
        notCorrectMessagePasswordRegister,
        notCorrectMessagePhoneRegister,
        emptyMessageEmailRegister,
        emptyMessageFNameRegister,
        emptyMessageLNameRegister,
        emptyMessagePasswordRegister,
        emptyMessagePhoneRegister,
      ];

      const hasVisibleErrors = errorMessages.some(
        (msg) => msg.style.opacity === "1",
      );

      if (hasVisibleErrors) {
        event.preventDefault();
        if (button) button.disabled = false;
        return;
      }

      if (button) button.disabled = true;

      registerForm.style.opacity = "0.2";
      registerForm.style.pointerEvents = "none";

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
          registerForm.style.opacity = "1";
          registerForm.style.pointerEvents = "auto";
          loadingText.classList.remove("show");
          setTimeout(() => {
            clonePopup.remove();
          }, 500);
          if (button) button.disabled = false;
        }, 750);
      }

      function sendToken(token) {
        if (tokenInputRegister) {
          tokenInputRegister.value = token;
        }

        const formData = new FormData(registerForm);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", registerForm.action, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const resp = JSON.parse(xhr.responseText);

              if (resp.success) {
                loadingText.innerHTML = text2;
                const inputFadeMs = 750;

                setTimeout(() => {
                  const fields = [
                    inputFNameRegister,
                    inputLNameRegister,
                    inputPhoneRegister,
                    inputEmailRegister,
                    inputPasswordRegister,
                  ].filter(Boolean);

                  fields.forEach((el) => {
                    el.style.transition = "opacity 500ms";
                    el.style.opacity = "0";
                  });

                  setTimeout(() => {
                    fields.forEach((el) => {
                      el.value = "";
                      el.style.opacity = "1";
                    });

                    registerForm.style.opacity = "1";
                    registerForm.style.pointerEvents = "auto";
                    loadingText.classList.remove("show");
                    clonePopup.style.opacity = "0";
                    setTimeout(() => {
                      clonePopup.remove();
                    }, 750);
                    if (button) button.disabled = false;
                  }, inputFadeMs);
                }, 750);

                try {
                  if (isVisible(gRecaptchaContainerRegister)) {
                    animateHide(gRecaptchaContainerRegister);
                  }
                  if (typeof grecaptcha !== "undefined") {
                    if (
                      editId &&
                      window.widgetIdEdtiRegister &&
                      window.widgetIdEdtiRegister[editId] !== undefined
                    ) {
                      grecaptcha.reset(window.widgetIdEdtiRegister[editId]);
                    } else if (typeof widgetIdRegister !== "undefined") {
                      grecaptcha.reset(widgetIdRegister);
                    }
                  }
                } catch (e) {}

                return;
              }

              loadingText.innerHTML = text3;
              setTimeout(() => {
                registerForm.style.opacity = "1";
                registerForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 750);
              return;
            } catch (e) {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";
              setTimeout(() => {
                registerForm.style.opacity = "1";
                registerForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 750);
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
                animateShow(gRecaptchaContainerRegister, null);
                loadingText.innerHTML = err;

                setTimeout(() => {
                  registerForm.style.opacity = "1";
                  registerForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                }, 750);
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
                  registerForm.style.opacity = "1";
                  registerForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                }, 1750);
                return;
              }

              loadingText.innerHTML = "Відмова сервера: " + err;
              setTimeout(() => {
                registerForm.style.opacity = "1";
                registerForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 1750);
              return;
            } catch (e) {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";
              setTimeout(() => {
                registerForm.style.opacity = "1";
                registerForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 750);
              return;
            }
          } else {
            loadingText.innerHTML =
              "Помилка сервера. Будь ласка, спробуйте пізніше";
            setTimeout(() => {
              registerForm.style.opacity = "1";
              registerForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                clonePopup.remove();
              }, 750);
              if (button) button.disabled = false;
            }, 750);
            return;
          }
        };

        xhr.onerror = function () {
          loadingText.innerHTML = "Помилка мережі. Спробуйте ще раз";
          setTimeout(() => {
            registerForm.style.opacity = "1";
            registerForm.style.pointerEvents = "auto";
            loadingText.classList.remove("show");
            setTimeout(() => {
              clonePopup.remove();
            }, 750);
            if (button) button.disabled = false;
          }, 750);
        };

        xhr.send(formData);
      }

      const v2Visible = isVisible(gRecaptchaContainerRegister);
      if (v2Visible) {
        let tokenV2;
        if (editId) {
          tokenV2 = grecaptcha.getResponse(window.widgetIdEdtiRegister[editId]);
        } else if (typeof widgetIdRegister !== "undefined") {
          tokenV2 = grecaptcha.getResponse(widgetIdRegister);
        }

        if (!tokenV2) {
          loadingText.innerHTML = "Не вдалося підтвердити, що Ви не робот";
          setTimeout(() => {
            registerForm.style.opacity = "1";
            registerForm.style.pointerEvents = "auto";
            loadingText.classList.remove("show");
            setTimeout(() => {
              clonePopup.remove();
            }, 750);
            if (button) button.disabled = false;
          }, 750);
          return;
        }

        versionInputRegister.value = "v2";
        sendToken(tokenV2);
      } else {
        recaptchaV3Register.generateToken().then((token) => {
          sendToken(token);
        });
      }
    });
  }

  // Clear Register Button

  const fields = [
    {
      inputId: `#${inputFNameRegister.id}`,
      buttonId: `#${clearButtonFNameRegister.id}`,
    },
    {
      inputId: `#${inputLNameRegister.id}`,
      buttonId: `#${clearButtonLNameRegister.id}`,
    },
    {
      inputId: `#${inputPhoneRegister.id}`,
      buttonId: `#${clearButtonPhoneRegister.id}`,
    },
    {
      inputId: `#${inputEmailRegister.id}`,
      buttonId: `#${clearButtonEmailRegister.id}`,
    },
    {
      inputId: `#${inputPasswordRegister.id}`,
      buttonId: `#${clearButtonPasswordRegister.id}`,
    },
  ];

  fields.forEach(({ inputId, buttonId }) => {
    const input = container.querySelector(inputId);
    const button = container.querySelector(buttonId);

    if (!input || !button) return;

    const icon = button.querySelector(".clear-icon-popup");
    const wrapper = input.closest(".enter-registerLogin-popup-CONT-input");

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

  // Phone Register Input

  if (inputPhoneRegister) {
    const iti = window.intlTelInput(inputPhoneRegister, {
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

    inputPhoneRegister.addEventListener("focus", () => {
      const currentNumber = inputPhoneRegister.value.trim();
      if (currentNumber === "") {
        const countryData = iti.getSelectedCountryData();
        const dialCode = countryData.dialCode;
        inputPhoneRegister.value = `+${dialCode} `;
        inputPhoneRegister.setSelectionRange(
          inputPhoneRegister.value.length,
          inputPhoneRegister.value.length,
        );
      }
    });
  }
}

// Close Popup Register/Login

$(".close-popup-register-login, .popup-bg-register-login, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-register-login").length === 0 ||
      $(event.target).hasClass("close-popup-register-login") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-register-login").fadeOut(300);
      $("body").css("overflow", "auto");

      if (typeof scrollbarWidth !== "undefined") {
        $(".popup-register-login").css({
          left: `calc(50% + ${scrollbarWidth / 2}px)`,
        });
        $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
      } else {
        $(".popup-register-login").css({ left: "50%" });
      }
    }
  },
);
