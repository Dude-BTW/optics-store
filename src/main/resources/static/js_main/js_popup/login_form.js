import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";
import { checkCode, checkLinks, checkProfanity } from "/js_main/profanity.js";

function initAllLogin(
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
      initLoginContainer(
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

window.initAllLogin = initAllLogin;

function initLoginContainer(
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
  const activeTimersLoginPop = {};

  function showMessageLoginPop(element) {
    if (!element) return;
    if (activeTimersLoginPop[element.id]) {
      clearTimeout(activeTimersLoginPop[element.id]);
    }
    element.style.opacity = "1";
    element.style.visibility = "visible";
  }

  function hideMessageLoginPop(element) {
    if (!element) return;
    if (activeTimersLoginPop[element.id]) {
      clearTimeout(activeTimersLoginPop[element.id]);
    }
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  function hideMessageLoginPopAfterDelay(element, delay) {
    if (!element) return;
    if (activeTimersLoginPop[element.id]) {
      clearTimeout(activeTimersLoginPop[element.id]);
    }
    activeTimersLoginPop[element.id] = setTimeout(() => {
      hideMessageLoginPop(element);
      delete activeTimersLoginPop[element.id];
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

  const clearButtonEmailLogin = pick("clear-button-login-popup-email");
  const inputEmailLogin = pick("enter-email-popup-login-input");
  const notCorrectMessageEmailLogin = pick(
    "not-correct-required-popup-login-field-email",
  );
  const emptyMessageEmailLogin = pick("required-popup-login-field-email");

  const clearButtonPasswordLogin = pick("clear-button-login-popup-password");
  const inputPasswordLogin = pick("enter-password-popup-login-input");
  const notCorrectMessagePasswordLogin = pick(
    "not-correct-required-popup-login-field-password",
  );
  const emptyMessagePasswordLogin = pick("required-popup-login-field-password");

  const tokenInputLogin = pick("recaptchaTokenLogin");
  const versionInputLogin = pick("recaptchaVersionLogin");

  const gRecaptchaContainerLogin = pick("login-popup-g-recaptcha-container");
  const emptyGRecaptchaLogin = pick("required-popup-field-login-g-recaptcha");

  const recaptchaV3Login = initRecaptchaV3({
    siteKey: "<REPLACE_ME>",
    action: actionForm,
    container,
    tokenInputSelector: tokenInputLogin ? `#${tokenInputLogin.id}` : null,
    versionInputSelector: versionInputLogin ? `#${versionInputLogin.id}` : null,
    trackedElements: [inputEmailLogin, inputPasswordLogin],
  });

  if (
    button &&
    inputEmailLogin &&
    notCorrectMessageEmailLogin &&
    emptyMessageEmailLogin &&
    inputPasswordLogin &&
    notCorrectMessagePasswordLogin &&
    emptyMessagePasswordLogin &&
    gRecaptchaContainerLogin &&
    emptyGRecaptchaLogin &&
    tokenInputLogin &&
    versionInputLogin
  ) {
    [
      notCorrectMessageEmailLogin,
      emptyMessageEmailLogin,
      notCorrectMessagePasswordLogin,
      emptyMessagePasswordLogin,
      emptyGRecaptchaLogin,
    ].forEach((msg) => hideMessageLoginPop(msg));

    button.addEventListener("click", function () {
      if (inputEmailLogin) {
        const email = inputEmailLogin.value.trim();
        if (email === "") {
          showMessageLoginPop(emptyMessageEmailLogin);
          inputEmailLogin.value = "";
        } else if (
          !(
            typeof validator !== "undefined" &&
            validator.isEmail(email) &&
            email.length >= 3
          )
        ) {
          showMessageLoginPop(notCorrectMessageEmailLogin);
          hideMessageLoginPopAfterDelay(notCorrectMessageEmailLogin, 2000);
        }
      }

      if (inputPasswordLogin) {
        const pass = inputPasswordLogin.value.trim();
        if (pass === "") {
          showMessageLoginPop(emptyMessagePasswordLogin);
          inputPasswordLogin.value = "";
        } else if (
          pass.length < 2 ||
          checkProfanity(pass) ||
          checkCode(pass) ||
          checkLinks(pass)
        ) {
          const hasProfanity = checkProfanity(pass);
          const hasCode = checkCode(pass);
          const hasLinks = checkLinks(pass);
          let dopTimeout = 0;

          if (hasProfanity || hasCode || hasLinks) {
            notCorrectMessagePasswordLogin.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "У паролі",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessagePasswordLogin.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageLoginPop(notCorrectMessagePasswordLogin);
          hideMessageLoginPopAfterDelay(
            notCorrectMessagePasswordLogin,
            2000 + dopTimeout,
          );
        }
      }

      if (isVisible(gRecaptchaContainerLogin)) {
        let recaptchaResponse;
        if (editId) {
          recaptchaResponse = grecaptcha.getResponse(
            window.widgetIdEdtiLogin[editId],
          );
        } else if (typeof widgetIdLogin !== "undefined") {
          recaptchaResponse = grecaptcha.getResponse(widgetIdLogin);
        }
        if (!recaptchaResponse) {
          showMessageLoginPop(emptyGRecaptchaLogin);
        } else {
          hideMessageLoginPop(emptyGRecaptchaLogin);
        }
      }
    });

    if (inputEmailLogin) {
      inputEmailLogin.addEventListener("input", function () {
        hideMessageLoginPop(emptyMessageEmailLogin);
      });
      inputEmailLogin.addEventListener("focus", function () {
        hideMessageLoginPop(notCorrectMessageEmailLogin);
      });
      notCorrectMessageEmailLogin.addEventListener("click", function () {
        hideMessageLoginPop(notCorrectMessageEmailLogin);
        inputEmailLogin.focus();
      });
    }

    if (inputPasswordLogin) {
      inputPasswordLogin.addEventListener("input", function () {
        hideMessageLoginPop(emptyMessagePasswordLogin);
      });
      inputPasswordLogin.addEventListener("focus", function () {
        hideMessageLoginPop(notCorrectMessagePasswordLogin);
      });
      notCorrectMessagePasswordLogin.addEventListener("click", function () {
        hideMessageLoginPop(notCorrectMessagePasswordLogin);
        inputPasswordLogin.focus();
      });
    }

    window.recaptchaSuccessCallbackPopLogin = function () {
      if (isVisible(gRecaptchaContainerLogin)) {
        hideMessageLoginPop(emptyGRecaptchaLogin);
      }
    };
  }

  const loginForm = parentContainerPop.querySelector(form);
  if (loginForm) {
    loginForm.style.transition = "opacity 250ms";
    $(loginForm).off("submit");

    $(loginForm).on("submit", function (event) {
      event.preventDefault();

      const required = [
        `#${button.id}`,

        `#${inputEmailLogin.id}`,
        `#${notCorrectMessageEmailLogin.id}`,
        `#${emptyMessageEmailLogin.id}`,

        `#${inputPasswordLogin.id}`,
        `#${notCorrectMessagePasswordLogin.id}`,
        `#${emptyMessagePasswordLogin.id}`,

        `#${gRecaptchaContainerLogin.id}`,
        `#${emptyGRecaptchaLogin.id}`,
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
            loginForm.submit();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return;
      }

      var errorMessages = [
        notCorrectMessageEmailLogin,
        notCorrectMessagePasswordLogin,
        emptyMessageEmailLogin,
        emptyMessagePasswordLogin,
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

      loginForm.style.opacity = "0.2";
      loginForm.style.pointerEvents = "none";

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

      function sendToken(token) {
        if (tokenInputLogin) {
          tokenInputLogin.value = token;
        }

        const formData = new FormData(loginForm);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", loginForm.action, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const resp = JSON.parse(xhr.responseText);

              if (resp.success) {
                loadingText.innerHTML = text2;
                const inputFadeMs = 750;

                setTimeout(() => {
                  const fields = [inputEmailLogin, inputPasswordLogin].filter(
                    Boolean,
                  );

                  fields.forEach((el) => {
                    el.style.transition = "opacity 500ms";
                    el.style.opacity = "0";
                  });

                  setTimeout(() => {
                    fields.forEach((el) => {
                      el.value = "";
                      el.style.opacity = "1";
                    });

                    loginForm.style.opacity = "1";
                    loginForm.style.pointerEvents = "auto";
                    loadingText.classList.remove("show");
                    clonePopup.style.opacity = "0";
                    setTimeout(() => {
                      clonePopup.remove();
                      window.location.reload();
                    }, 750);
                    if (button) button.disabled = false;
                  }, inputFadeMs);
                }, 750);

                try {
                  if (isVisible(gRecaptchaContainerLogin)) {
                    animateHide(gRecaptchaContainerLogin);
                  }
                  if (typeof grecaptcha !== "undefined") {
                    if (
                      editId &&
                      window.widgetIdEdtiLogin &&
                      window.widgetIdEdtiLogin[editId] !== undefined
                    ) {
                      grecaptcha.reset(window.widgetIdEdtiLogin[editId]);
                    } else if (typeof widgetIdLogin !== "undefined") {
                      grecaptcha.reset(widgetIdLogin);
                    }
                  }
                } catch (e) {}

                return;
              }

              loadingText.innerHTML = text3;
              setTimeout(() => {
                loginForm.style.opacity = "1";
                loginForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 750);
              return;
            } catch (e) {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";
              setTimeout(() => {
                loginForm.style.opacity = "1";
                loginForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 750);
              return;
            }
          } else if (xhr.status === 403 || xhr.status === 401) {
            try {
              const resp = JSON.parse(xhr.responseText);
              const err = resp.error;

              if (
                err.includes("Не вдалося підтвердити, що Ви не робот") ||
                err.includes("Часті невдалі спроби пройти перевірку на бота")
              ) {
                animateShow(gRecaptchaContainerLogin, null);
                loadingText.innerHTML = err;

                setTimeout(() => {
                  loginForm.style.opacity = "1";
                  loginForm.style.pointerEvents = "auto";
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
                  loginForm.style.opacity = "1";
                  loginForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  if (button) button.disabled = false;
                }, 1750);
                return;
              }

              loadingText.innerHTML =
                err === "Невірний email або пароль" ||
                err === "Акаунт не знайдений"
                  ? err
                  : "Відмова сервера: " + err;
              setTimeout(() => {
                loginForm.style.opacity = "1";
                loginForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                if (button) button.disabled = false;
              }, 1750);
              return;
            } catch (e) {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";
              setTimeout(() => {
                loginForm.style.opacity = "1";
                loginForm.style.pointerEvents = "auto";
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
              loginForm.style.opacity = "1";
              loginForm.style.pointerEvents = "auto";
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
            loginForm.style.opacity = "1";
            loginForm.style.pointerEvents = "auto";
            loadingText.classList.remove("show");
            setTimeout(() => {
              clonePopup.remove();
            }, 750);
            if (button) button.disabled = false;
          }, 750);
        };

        xhr.send(formData);
      }

      const v2Visible = isVisible(gRecaptchaContainerLogin);
      if (v2Visible) {
        let tokenV2;
        if (editId) {
          tokenV2 = grecaptcha.getResponse(window.widgetIdEdtiLogin[editId]);
        } else if (typeof widgetIdLogin !== "undefined") {
          tokenV2 = grecaptcha.getResponse(widgetIdLogin);
        }
        if (!tokenV2) {
          emptyGRecaptchaLogin.style.opacity = "1";
          emptyGRecaptchaLogin.style.visibility = "visible";
          loginForm.style.opacity = "1";
          loginForm.style.pointerEvents = "auto";
          loadingText.classList.remove("show");
          setTimeout(() => {
            clonePopup.remove();
          }, 750);
          if (button) button.disabled = false;
          return;
        }

        versionInputLogin.value = "v2";
        sendToken(tokenV2);
      } else {
        recaptchaV3Login.generateToken().then((token) => {
          versionInputLogin.value = "v3";
          sendToken(token);
        });
      }
    });
  }

  // Clear Login Button

  const fields = [
    {
      inputId: `#${inputEmailLogin.id}`,
      buttonId: `#${clearButtonEmailLogin.id}`,
    },
    {
      inputId: `#${inputPasswordLogin.id}`,
      buttonId: `#${clearButtonPasswordLogin.id}`,
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
}
