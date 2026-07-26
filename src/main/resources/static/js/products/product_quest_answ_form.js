// Initialization and validation logic for User Feedback modules (Q&A).
// Supports client-side validation and asynchronous UI state updates during CRUD operations.
import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";
import { checkCode, checkLinks, checkProfanity } from "/js_main/profanity.js";

// Add & Edit Question Answer

function initAllQuestionAnswer(
  numCol,
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
      initQuestionAnswerContainer(
        numCol,
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
window.initAllQuestionAnswer = initAllQuestionAnswer;

function initQuestionAnswerContainer(
  numCol,
  editId,
  container,
  mainParentContainer,
  buttonSelector,
  form,
  actionForm,
  text1,
  text2,
  text3,
  editMode,
) {
  if (container.dataset.rpInited === "1") return;
  container.dataset.rpInited = "1";

  // Question Answer

  const activeTimersQuean = {};

  function showMessageQuean(element) {
    if (activeTimersQuean[element.id]) {
      clearTimeout(activeTimersQuean[element.id]);
    }
    element.style.opacity = "1";
    element.style.visibility = "visible";
  }

  function hideMessageQuean(element) {
    if (activeTimersQuean[element.id]) {
      clearTimeout(activeTimersQuean[element.id]);
    }
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  function hideMessageQueanAfterDelay(element, delay) {
    if (activeTimersQuean[element.id]) {
      clearTimeout(activeTimersQuean[element.id]);
    }
    activeTimersQuean[element.id] = setTimeout(() => {
      hideMessageQuean(element);
      delete activeTimersQuean[element.id];
    }, delay);
  }

  const messageElementQuean = document.querySelector(".enter-quean-message");
  const messageElementsQuean = [messageElementQuean];

  function updateStylesQuean() {
    messageElementsQuean.forEach((el) => {
      if (!el) return;

      const isScrollbarVisible = el.scrollHeight > el.clientHeight;
      if (isScrollbarVisible) {
        el.style.paddingRight =
          "calc(calc(100vw * 17 / 1366) - calc(100vw * 4 / 1366))";
        el.style.width =
          "calc(100% - (calc(100vw * 17 / 1366) * 2 - calc(100vw * 4 / 1366)))";
      } else {
        el.style.paddingRight = "calc(100vw * 17 / 1366)";
        el.style.width = "calc(100% - (calc(100vw * 17 / 1366) * 2))";
      }
    });
  }

  updateStylesQuean();
  messageElementsQuean.forEach((el) => {
    if (!el) return;
    el.addEventListener("input", updateStylesQuean);
  });
  window.addEventListener("resize", updateStylesQuean);

  // In Containers

  const parentContainer = container.closest(mainParentContainer);
  if (!parentContainer) return;

  const containerId = parentContainer.id;
  const opticId = containerId.split("_").pop();

  let minIndex, newIndex, containerIdMINI, root, smallestColId, match;
  if (editMode) {
    minIndex = numCol;
  } else {
    containerIdMINI = `feedback-question-answer_${opticId}`;
    root =
      document.getElementById(containerIdMINI) || parentContainer || document;
    smallestColId = getSmallestColIndex(root, "feedback-question-answer-col_");
    match = smallestColId ? smallestColId.match(/_(\-?\d+)$/) : null;
    minIndex = match ? parseInt(match[1], 10) : 0;
  }
  newIndex = editMode ? minIndex : minIndex - 1;
  let elemId = editMode ? `_${editId}` : "";
  const parentRoot =
    container.closest(mainParentContainer) ||
    container.closest(".") ||
    document;
  const pick = (baseOrSelector, selectorOverride) => {
    const isSelector = (s) =>
      typeof s === "string" &&
      (s.startsWith("#") ||
        s.startsWith(".") ||
        s.includes(" ") ||
        s.includes("["));
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
    let el = container.querySelector(`#${baseId}_${opticId}${elemId}`);
    if (!el) el = container.querySelector(`#${baseId}${elemId}`);
    if (!el) el = container.querySelector(`#${baseId}_${opticId}`);
    if (!el) el = container.querySelector(`#${baseId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}_${opticId}${elemId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}${elemId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}_${opticId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}`);
    if (!el) el = document.getElementById(`${baseId}_${opticId}${elemId}`);
    if (!el) el = document.getElementById(`${baseId}${elemId}`);
    if (!el) el = document.getElementById(`${baseId}_${opticId}`);
    if (!el) el = document.getElementById(baseId);
    return el;
  };

  const button = pick(buttonSelector);

  const clearButtonNameQuestAnsw = pick(
    "clear-questions-answers-button-quean-name",
  );
  const inputNameQuestAnsw = pick("enter-quean-name-input");
  const notCorrectMessageNameQuestAnsw = pick(
    "not-correct-required-field-name",
  );
  const emptyMessageNameQuestAnsw = pick("required-field-name");

  const initialNameQuestAnsw = inputNameQuestAnsw.value.trim();
  let nameChanged = false;

  const clearButtonPhoneQuestAnsw = pick(
    "clear-questions-answers-button-quean-phone",
  );
  const inputPhoneQuestAnsw = pick("enter-quean-phone-input");
  const notCorrectMessagePhoneQuestAnsw = pick(
    "not-correct-required-field-phone",
  );
  const emptyMessagePhoneQuestAnsw = pick("required-field-phone");

  const clearButtonEmailQuestAnsw = pick(
    "clear-questions-answers-button-quean-email",
  );
  const inputEmailQuestAnsw = pick("enter-quean-email-input");
  const notCorrectMessageEmailQuestAnsw = pick(
    "not-correct-required-field-email",
  );
  const emptyMessageEmailQuestAnsw = pick("required-field-email");

  const textareaMessageQuestAnsw = pick("enter-quean-message-textarea");
  const notCorrectMessageTXTARQuestAnsw = pick(
    "not-correct-required-field-message",
  );
  const emptyMessageTXTARQuestAnsw = pick("required-field-message");

  const tokenInputQuestAnsw = pick("recaptchaTokenQuestAnsw");
  const versionInputQuestAnsw = pick("recaptchaVersionQuestAnsw");

  const recaptchaV3QuestionAnswer = initRecaptchaV3({
    siteKey: "<REPLACE_ME>",
    action: actionForm,
    container,
    tokenInputSelector: `#${tokenInputQuestAnsw.id}`,
    versionInputSelector: `#${versionInputQuestAnsw.id}`,
    trackedElements: [
      inputEmailQuestAnsw,
      inputNameQuestAnsw,
      inputPhoneQuestAnsw,
      textareaMessageQuestAnsw,
    ],
  });

  let checkFamiliarRulesCustomQuestAnsw;
  let emptyMessageCheckQuestAnsw;
  if (!editMode) {
    checkFamiliarRulesCustomQuestAnsw = pick("check-familiar-rules-custom");
    emptyMessageCheckQuestAnsw = pick("required-field-familrul");
  }

  const gRecaptchaProdQueanContainer = pick("quean-g-recaptcha-container");
  const emptyGRecaptchaProdQuean = pick("required-field-quean-g-recaptcha");

  const rulesCheckOK = editMode
    ? true
    : checkFamiliarRulesCustomQuestAnsw && emptyMessageCheckQuestAnsw;

  if (
    button &&
    clearButtonNameQuestAnsw &&
    inputNameQuestAnsw &&
    notCorrectMessageNameQuestAnsw &&
    emptyMessageNameQuestAnsw &&
    clearButtonPhoneQuestAnsw &&
    inputPhoneQuestAnsw &&
    notCorrectMessagePhoneQuestAnsw &&
    emptyMessagePhoneQuestAnsw &&
    clearButtonEmailQuestAnsw &&
    inputEmailQuestAnsw &&
    notCorrectMessageEmailQuestAnsw &&
    emptyMessageEmailQuestAnsw &&
    textareaMessageQuestAnsw &&
    notCorrectMessageTXTARQuestAnsw &&
    emptyMessageTXTARQuestAnsw &&
    rulesCheckOK &&
    gRecaptchaProdQueanContainer &&
    emptyGRecaptchaProdQuean &&
    tokenInputQuestAnsw &&
    versionInputQuestAnsw
  ) {
    const messagesToHide = editMode
      ? [
          notCorrectMessageNameQuestAnsw,
          emptyMessageNameQuestAnsw,
          notCorrectMessagePhoneQuestAnsw,
          emptyMessagePhoneQuestAnsw,
          notCorrectMessageEmailQuestAnsw,
          emptyMessageEmailQuestAnsw,
          notCorrectMessageTXTARQuestAnsw,
          emptyMessageTXTARQuestAnsw,
          emptyGRecaptchaProdQuean,
        ]
      : [
          notCorrectMessageNameQuestAnsw,
          emptyMessageNameQuestAnsw,
          notCorrectMessagePhoneQuestAnsw,
          emptyMessagePhoneQuestAnsw,
          notCorrectMessageEmailQuestAnsw,
          emptyMessageEmailQuestAnsw,
          notCorrectMessageTXTARQuestAnsw,
          emptyMessageTXTARQuestAnsw,
          emptyMessageCheckQuestAnsw,
          emptyGRecaptchaProdQuean,
        ];

    messagesToHide.forEach((msg) => hideMessageQuean(msg));
    // Client-side form validation handling empty fields, formatting, and checking for restricted content (profanity, code, links).
    button.addEventListener("click", function () {
      if (inputEmailQuestAnsw) {
        const email = inputEmailQuestAnsw.value.trim();
        if (email === "") {
          showMessageQuean(emptyMessageEmailQuestAnsw);
          inputEmailQuestAnsw.value = "";
        } else if (validator.isEmail(email) && email.length >= 3) {
        } else {
          showMessageQuean(notCorrectMessageEmailQuestAnsw);
          hideMessageQueanAfterDelay(notCorrectMessageEmailQuestAnsw, 2000);
        }
      }

      if (inputNameQuestAnsw) {
        const name = inputNameQuestAnsw.value.trim();
        if (name === "") {
          showMessageQuean(emptyMessageNameQuestAnsw);
          inputNameQuestAnsw.value = "";
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
            notCorrectMessageNameQuestAnsw.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "В імені",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessageNameQuestAnsw.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageQuean(notCorrectMessageNameQuestAnsw);
          hideMessageQueanAfterDelay(
            notCorrectMessageNameQuestAnsw,
            2000 + dopTimeout,
          );
        }
      }

      if (inputPhoneQuestAnsw) {
        const phone = inputPhoneQuestAnsw.value.trim();
        if (phone === "") {
          showMessageQuean(emptyMessagePhoneQuestAnsw);
          inputPhoneQuestAnsw.value = "";
        } else if (phone.length < 10) {
          showMessageQuean(notCorrectMessagePhoneQuestAnsw);
          hideMessageQueanAfterDelay(notCorrectMessagePhoneQuestAnsw, 2000);
        }
      }

      const message = textareaMessageQuestAnsw.value.trim();
      if (message === "") {
        showMessageQuean(emptyMessageTXTARQuestAnsw);
        textareaMessageQuestAnsw.value = "";
      } else if (
        message.length < 10 ||
        checkProfanity(message) ||
        checkCode(message) ||
        checkLinks(message)
      ) {
        const hasProfanity = checkProfanity(message);
        const hasCode = checkCode(message);
        const hasLinks = checkLinks(message);
        let dopTimeout = 0;

        if (hasProfanity || hasCode || hasLinks) {
          notCorrectMessageTXTARQuestAnsw.innerHTML = buildValidationMessage(
            hasProfanity,
            hasCode,
            hasLinks,
            "У тексті",
          );
          dopTimeout = 1000;
        } else {
          notCorrectMessageTXTARQuestAnsw.innerHTML =
            "Повинно бути мінімум 10 символів.";
        }

        showMessageQuean(notCorrectMessageTXTARQuestAnsw);
        hideMessageQueanAfterDelay(
          notCorrectMessageTXTARQuestAnsw,
          2000 + dopTimeout,
        );
      }

      if (!editMode) {
        const square = checkFamiliarRulesCustomQuestAnsw.querySelector(
          ".check-familiar-rules-square",
        );
        if (!square || !square.classList.contains("active")) {
          showMessageQuean(emptyMessageCheckQuestAnsw);
        } else {
          hideMessageQuean(emptyMessageCheckQuestAnsw);
        }
      }

      if (isVisible(gRecaptchaProdQueanContainer)) {
        let recaptchaResponse;
        if (editId) {
          recaptchaResponse = grecaptcha.getResponse(
            window.widgetIdEdtiQuestAnswer[opticId][editId],
          );
        } else {
          recaptchaResponse = grecaptcha.getResponse(
            widgetIdQuestAnswer[opticId],
          );
        }
        if (!recaptchaResponse) {
          showMessageQuean(emptyGRecaptchaProdQuean);
        } else {
          hideMessageQuean(emptyGRecaptchaProdQuean);
        }
      }
    });

    if (inputEmailQuestAnsw) {
      inputEmailQuestAnsw.addEventListener("input", function () {
        hideMessageQuean(emptyMessageEmailQuestAnsw);
      });
      inputEmailQuestAnsw.addEventListener("focus", function () {
        hideMessageQuean(notCorrectMessageEmailQuestAnsw);
      });
      notCorrectMessageEmailQuestAnsw.addEventListener("click", function () {
        hideMessageQuean(notCorrectMessageEmailQuestAnsw);
        inputEmailQuestAnsw.focus();
      });
    }

    if (inputNameQuestAnsw) {
      inputNameQuestAnsw.addEventListener("input", function () {
        hideMessageQuean(emptyMessageNameQuestAnsw);
      });
      inputNameQuestAnsw.addEventListener("focus", function () {
        hideMessageQuean(notCorrectMessageNameQuestAnsw);
      });
      notCorrectMessageNameQuestAnsw.addEventListener("click", function () {
        hideMessageQuean(notCorrectMessageNameQuestAnsw);
        inputNameQuestAnsw.focus();
      });
    }

    if (inputPhoneQuestAnsw) {
      inputPhoneQuestAnsw.addEventListener("input", function () {
        hideMessageQuean(emptyMessagePhoneQuestAnsw);
      });
      inputPhoneQuestAnsw.addEventListener("focus", function () {
        hideMessageQuean(notCorrectMessagePhoneQuestAnsw);
      });
      notCorrectMessagePhoneQuestAnsw.addEventListener("click", function () {
        hideMessageQuean(notCorrectMessagePhoneQuestAnsw);
        inputPhoneQuestAnsw.focus();
      });
    }

    textareaMessageQuestAnsw.addEventListener("input", function () {
      hideMessageQuean(emptyMessageTXTARQuestAnsw);
    });
    textareaMessageQuestAnsw.addEventListener("focus", function () {
      hideMessageQuean(notCorrectMessageTXTARQuestAnsw);
    });
    notCorrectMessageTXTARQuestAnsw.addEventListener("click", function () {
      hideMessageQuean(notCorrectMessageTXTARQuestAnsw);
      textareaMessageQuestAnsw.focus();
    });

    if (!editMode) {
      const square = checkFamiliarRulesCustomQuestAnsw.querySelector(
        ".check-familiar-rules-square",
      );
      if (square) {
        const observer = new MutationObserver(() => {
          if (square.classList.contains("active")) {
            hideMessageQuean(emptyMessageCheckQuestAnsw);
          }
        });
        observer.observe(square, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    }

    window.recaptchaSuccessCallbackQuean = function () {
      if (isVisible(gRecaptchaProdQueanContainer)) {
        hideMessageQuean(emptyGRecaptchaProdQuean);
      }
    };
  }

  const questionAnswerForm = parentContainer.querySelector(form);
  questionAnswerForm.style.transition = "opacity 250ms";

  if (questionAnswerForm) {
    $(questionAnswerForm).off("submit");

    // Intercepts standard form submission to perform an asynchronous (AJAX) POST request.
    // On success, dynamically renders the new feedback record directly into the DOM.
    $(questionAnswerForm).on("submit", function (event) {
      event.preventDefault();
      const required = [
        `#${button.id}`,

        `#${clearButtonEmailQuestAnsw.id}`,
        `#${inputEmailQuestAnsw.id}`,
        `#${notCorrectMessageEmailQuestAnsw.id}`,
        `#${emptyMessageEmailQuestAnsw.id}`,

        `#${clearButtonNameQuestAnsw.id}`,
        `#${inputNameQuestAnsw.id}`,
        `#${notCorrectMessageNameQuestAnsw.id}`,
        `#${emptyMessageNameQuestAnsw.id}`,

        `#${clearButtonPhoneQuestAnsw.id}`,
        `#${inputPhoneQuestAnsw.id}`,
        `#${notCorrectMessagePhoneQuestAnsw.id}`,
        `#${emptyMessagePhoneQuestAnsw.id}`,

        `#${textareaMessageQuestAnsw.id}`,
        `#${notCorrectMessageTXTARQuestAnsw.id}`,
        `#${emptyMessageTXTARQuestAnsw.id}`,

        `#${gRecaptchaProdQueanContainer.id}`,
        `#${emptyGRecaptchaProdQuean.id}`,
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
            questionAnswerForm.submit();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return;
      }

      event.preventDefault();
      button.disabled = true;

      let accountAvailEdit;

      if (editMode) {
        const colContainer = questionAnswerForm.closest(".col");
        if (colContainer) {
          const editFeedback = colContainer.querySelector(".edit-feedback");
          if (editFeedback) {
            accountAvailEdit =
              editFeedback.getAttribute("data-account-used") === "true";
          } else {
            accountAvailEdit = false;
          }
        } else {
          accountAvailEdit = false;
        }
      } else {
        const hasInitial = initialNameQuestAnsw !== "";
        const isUnchanged = !nameChanged;
        accountAvailEdit = hasInitial && isUnchanged;
      }

      var errorMessages;
      if (!editMode) {
        errorMessages = [
          notCorrectMessageEmailQuestAnsw,
          emptyMessageEmailQuestAnsw,
          notCorrectMessageNameQuestAnsw,
          emptyMessageNameQuestAnsw,
          notCorrectMessagePhoneQuestAnsw,
          emptyMessagePhoneQuestAnsw,
          notCorrectMessageTXTARQuestAnsw,
          emptyMessageTXTARQuestAnsw,
          emptyMessageCheckQuestAnsw,
        ];
      } else {
        errorMessages = [
          notCorrectMessageEmailQuestAnsw,
          emptyMessageEmailQuestAnsw,
          notCorrectMessageNameQuestAnsw,
          emptyMessageNameQuestAnsw,
          notCorrectMessagePhoneQuestAnsw,
          emptyMessagePhoneQuestAnsw,
          notCorrectMessageTXTARQuestAnsw,
          emptyMessageTXTARQuestAnsw,
          emptyMessageCheckQuestAnsw,
        ];
      }

      const hasVisibleErrors = errorMessages.some(
        (msg) => msg.style.opacity === "1",
      );

      if (hasVisibleErrors) {
        event.preventDefault();
        button.disabled = false;
      } else if (questionAnswerForm) {
        event.preventDefault();
        questionAnswerForm.style.opacity = "0.2";
        questionAnswerForm.style.pointerEvents = "none";

        const originalСontainer = container.closest(mainParentContainer);
        if (!originalСontainer) return;

        const cloneСontainer = originalСontainer.cloneNode(false);
        cloneСontainer.classList.add("clone-transparent");

        const loadingText = document.createElement("div");
        loadingText.className = "loading-text-popup";
        loadingText.innerHTML = `${text1}<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>`;

        cloneСontainer.appendChild(loadingText);
        originalСontainer.parentElement.appendChild(cloneСontainer);

        requestAnimationFrame(() => {
          loadingText.classList.add("show");
        });

        function sendToken(token) {
          container.querySelector(`#${tokenInputQuestAnsw.id}`).value = token;
          const formData = new FormData(questionAnswerForm);
          const xhr = new XMLHttpRequest();
          xhr.open("POST", questionAnswerForm.action, true);
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                const newQuestionAnswerId = response.newQuestionAnswerId;

                loadingText.innerHTML = text2;

                if (!editMode) {
                  inputEmailQuestAnsw.style.transition = "opacity 500ms";
                  inputNameQuestAnsw.style.transition = "opacity 500ms";
                  inputPhoneQuestAnsw.style.transition = "opacity 500ms";
                  textareaMessageQuestAnsw.style.transition = "opacity 500ms";

                  inputEmailQuestAnsw.style.opacity = "0";
                  inputNameQuestAnsw.style.opacity = "0";
                  inputPhoneQuestAnsw.style.opacity = "0";
                  textareaMessageQuestAnsw.style.opacity = "0";

                  const square =
                    checkFamiliarRulesCustomQuestAnsw.querySelector(
                      ".check-familiar-rules-square",
                    );
                  if (square) {
                    square.style.transition = "background-color 500ms";
                    square.classList.remove("active");
                    square.style.backgroundColor = "";
                    const img = square.querySelector("img");
                    if (img) {
                      img.style.transition = "opacity 500ms";
                      img.style.opacity = "0";
                      setTimeout(() => {
                        img.remove();
                      }, 500);
                    }
                  }

                  if (isVisible(gRecaptchaProdQueanContainer)) {
                    animateHide(gRecaptchaProdQueanContainer);
                  }
                }

                const cardQuestionAnswerFeedback =
                  document.createElement("div");
                cardQuestionAnswerFeedback.className = "card position-relative";
                cardQuestionAnswerFeedback.classList.add(
                  "product-quest-fade-in",
                );
                cardQuestionAnswerFeedback.style.backgroundColor = "#f4f5f7";

                cardQuestionAnswerFeedback.addEventListener(
                  "animationend",
                  () => {
                    cardQuestionAnswerFeedback.classList.remove(
                      "product-quest-fade-in",
                    );
                  },
                  { once: true },
                );

                const now = new Date();
                const formattedDate =
                  now.getDate().toString().padStart(2, "0") +
                  "-" +
                  (now.getMonth() + 1).toString().padStart(2, "0") +
                  "-" +
                  now.getFullYear();

                const mainContainer = document.getElementById(
                  `feedback-question-answer_${opticId}`,
                );

                let nameFirstLastNon = accountAvail
                  ? `<div class="rating ava-feedback" style="text-align: left; background-color: #dee2e7;">
                                        <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                        style="width: calc(100vw * 20 / 1366); heigth: auto"></div>
                                        <div class="name-feedback" style="margin-left: 1.8%;">
                                        ${mainFirstName} ${mainLastName}</div>`
                  : !accountAvail
                    ? `<div class="name-feedback" style="margin-left: 0.5%;">${inputNameQuestAnsw.value}</div>`
                    : ``;

                cardQuestionAnswerFeedback.innerHTML = `
                                    <div class="main-rating-table"
                                        style="margin-left: 2.6%; margin-right: 4.7%; margin-top: 2.05%; margin-bottom: 0.55%;">
                                        <div class="progress-wrapper" style="margin-top: 0%;">
                                            ${nameFirstLastNon}
                                            <div class="data-feedback" style="text-align: right;">
                                                ${formattedDate}
                                            </div>
                                        </div>

                                        <div class="feedback-actions">
                                        <button class="edit-feedback" id="edit-feedback-question-answer_${newQuestionAnswerId}"
                                            data-num-col="${newIndex}"
                                            data-phone="${inputPhoneQuestAnsw.value}"
                                            data-email="${inputEmailQuestAnsw.value}"
                                            data-account-used="${accountAvailEdit}"
                                            data-feedback="${textareaMessageQuestAnsw.value}"
                                            data-client-name="${inputNameQuestAnsw.value}">
                                            <img src="/images/System_Interface/feedback_control/edit/edit.svg" alt="Edit Feedback">
                                        </button>

                                        <button class="delete-feedback" id="delete-feedback-question-answer_${newQuestionAnswerId}">
                                            <img src="/images/System_Interface/feedback_control/delete/delete.svg" alt="Delete Feedback">
                                        </button>
                                        </div>

                                        <p class="questAnswFeed-feedback-text feedback-text-global"
                                        id="questAnswFeed-feedback-text_${newQuestionAnswerId}"
                                        style="margin-top: 1.3%; height: auto;">${textareaMessageQuestAnsw.value}</p>
                                    </div>
                                `;

                if (mainContainer) {
                  let container =
                    mainContainer.querySelector(".vertical-lineMINI");

                  if (!container) {
                    container = document.createElement("div");
                    container.classList.add("vertical-lineMINI");
                    mainContainer.appendChild(container);
                  }

                  container.insertBefore(
                    cardQuestionAnswerFeedback,
                    container.firstChild,
                  );

                  const whiteOverlay =
                    cardQuestionAnswerFeedback.querySelector(".white-overlay");
                  if (whiteOverlay) {
                    requestAnimationFrame(() => {
                      whiteOverlay.style.opacity = "0";
                    });

                    setTimeout(() => {
                      whiteOverlay.remove();
                    }, 500);
                  }
                }

                if (mainContainer) {
                  if (editMode) {
                    const cancelBtn = parentContainer.querySelector(
                      ".card-cont-cancel-button",
                    );
                    const col = cancelBtn.closest(".col");
                    const editBgElement = col.querySelector(".edit-bg-visible");
                    const cardContainer = col.querySelector(".card-container");
                    const oldCard = cardContainer.querySelector(
                      ".card.position-relative",
                    );
                    const newCard = cardQuestionAnswerFeedback;
                    const feedbackText = newCard.querySelector(
                      `#questAnswFeed-feedback-text_${newQuestionAnswerId}`,
                    );

                    const initialCardHeight =
                      oldCard.getBoundingClientRect().height;
                    oldCard.style.transition = "opacity 500ms";
                    editBgElement.style.transition = "background-color 500ms";
                    oldCard.style.opacity = "0";
                    editBgElement.style.backgroundColor = "white";

                    const existingMore = col.querySelector(
                      ".more-content-feedback-container-MAX",
                    );
                    if (existingMore) {
                      existingMore.style.transition = "opacity 500ms";
                      existingMore.style.opacity = "0";
                    }

                    const moreMax = createMoreMax(newQuestionAnswerId);
                    const moreBtn = moreMax.querySelector(
                      `#more-content-feedback-button_${newQuestionAnswerId}`,
                    );
                    const newMore = moreMax.querySelector(
                      ".more-content-feedback-container",
                    );

                    oldCard.addEventListener(
                      "transitionend",
                      function onFadeOut(e) {
                        if (e.propertyName !== "opacity") return;
                        if (existingMore) existingMore.remove();
                        oldCard.removeEventListener("transitionend", onFadeOut);

                        if (newMore) {
                          newMore.style.transition = "opacity 500ms";
                          newMore.style.opacity = "0";
                        }
                        cardContainer.appendChild(moreMax);

                        newCard.style.opacity = "0";
                        newCard.style.transition = "opacity 500ms";
                        cardContainer.replaceChild(newCard, oldCard);

                        const moreBtnExist = toggleMoreForElement(feedbackText);
                        if (moreBtnExist && moreBtn)
                          toggleMoreContentFeedbackInstant(moreBtn);

                        newCard.getBoundingClientRect();
                        newCard.style.opacity = "0.2";
                        if (newMore) newMore.style.opacity = "1";
                        if (moreBtn) moreBtn.style.pointerEvents = "none";
                        editBgElement.style.backgroundColor = "#fdfdfd";
                        setTimeout(() => {
                          editBgElement.style.backgroundColor = "";
                        }, 250);
                      },
                    );

                    cardQuestionAnswerFeedback.style.opacity = "0.2";
                    cardQuestionAnswerFeedback.style.pointerEvents = "none";
                    cardQuestionAnswerFeedback.style.height = `${initialCardHeight}px`;

                    setTimeout(() => {
                      const cloneCard =
                        col?.querySelector(".clone-transparent");
                      const origCardContainer =
                        col?.querySelector(".card-container");
                      const origCard = origCardContainer?.querySelector(
                        ".card:not(.clone-transparent)",
                      );

                      if (!col || !origCardContainer || !origCard) {
                        console.warn(
                          "Не знайдено .col або оригінальної .card для cancelBtn",
                        );
                        return;
                      }

                      const wrapperDiv = col?.querySelector(
                        ".enter-rat-strProdct-popup-container-wrapper",
                      );
                      const htmlWrapper = col?.querySelector(
                        ".enter-rat-strProdct-popup-container-MAX",
                      );
                      const buttonEdit = col?.querySelector(".edit-feedback");

                      wrapperDiv.classList.remove("edit-bg-visible");
                      htmlWrapper.classList.remove("show");

                      handleCancel(
                        cancelBtn,
                        htmlWrapper,
                        origCard,
                        buttonEdit,
                        cloneCard,
                        500,
                      );
                      if (moreBtn)
                        setTimeout(() => {
                          moreBtn.style.pointerEvents = "auto";
                        }, 500);
                    }, 1050);
                  } else {
                    const newCol = document.createElement("div");
                    newCol.id = `feedback-question-answer-col_${newIndex}`;
                    newCol.className =
                      "col question-answer-feedback question-answer-feedbackTOP";

                    const cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
                    cardContainer.appendChild(cardQuestionAnswerFeedback);

                    const moreMax = createMoreMax(newQuestionAnswerId);
                    const moreBtn = moreMax.querySelector(
                      `#more-content-feedback-button_${newQuestionAnswerId}`,
                    );
                    cardContainer.appendChild(moreMax);

                    newCol.appendChild(cardContainer);

                    const wrapper = document.createElement("div");
                    wrapper.className = "vertical-lineMINI";
                    wrapper.dataset.index = newIndex;
                    const now = new Date();
                    const isoLocal = `${now.getFullYear().toString().padStart(4, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}T${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
                    wrapper.setAttribute("data-date", isoLocal);
                    wrapper.appendChild(newCol);

                    mainContainer.prepend(wrapper);
                    const wrappers =
                      mainContainer.querySelectorAll(".vertical-lineMINI");
                    const lowerWrapper = wrappers[1];

                    if (lowerWrapper) {
                      const lowerCol = lowerWrapper.querySelector(".col");
                      if (lowerCol) {
                        lowerCol.classList.add("feedbackTOP-anim-out-MAX");

                        const onAnimEnd = (e) => {
                          if (e.target !== lowerCol) return;
                          lowerCol.classList.remove(
                            "feedbackTOP-anim-out-MAX",
                            "question-answer-feedbackTOP",
                          );
                          lowerCol.removeEventListener(
                            "animationend",
                            onAnimEnd,
                          );
                        };

                        lowerCol.addEventListener("animationend", onAnimEnd);
                      }
                    }

                    const feedbackText = newCol.querySelector(
                      `#questAnswFeed-feedback-text_${newQuestionAnswerId}`,
                    );
                    const moreBtnExist = toggleMoreForElement(feedbackText);

                    const newTable = newCol.querySelector(".main-rating-table");
                    if (newTable) {
                      newTable.style.opacity = "0";
                      newTable.style.transition = "opacity 750ms";
                      if (moreBtn) moreBtn.style.pointerEvents = "none";
                      if (moreBtnExist)
                        toggleMoreContentFeedbackInstant(moreBtn);
                      requestAnimationFrame(() => {
                        newTable.style.opacity = "1";
                        if (moreBtn)
                          setTimeout(() => {
                            moreBtn.style.pointerEvents = "auto";
                          }, 750);
                      });
                    }
                  }
                }

                const resetInputs = () => {
                  if (!editMode) {
                    inputEmailQuestAnsw.value = "";
                    inputNameQuestAnsw.value = "";
                    inputPhoneQuestAnsw.value = "";
                    textareaMessageQuestAnsw.value = "";

                    if (editId) {
                      grecaptcha.reset(
                        window.widgetIdEdtiQuestAnswer[opticId][editId],
                      );
                    } else {
                      grecaptcha.reset(widgetIdQuestAnswer[opticId]);
                    }
                  }

                  setTimeout(() => {
                    if (!editMode) {
                      inputEmailQuestAnsw.style.transition = "opacity 250ms";
                      inputNameQuestAnsw.style.transition = "opacity 250ms";
                      inputPhoneQuestAnsw.style.transition = "opacity 250ms";
                      textareaMessageQuestAnsw.style.transition =
                        "opacity 250ms";

                      const square =
                        checkFamiliarRulesCustomQuestAnsw.querySelector(
                          ".check-familiar-rules-square",
                        );
                      if (square) {
                        square.style.transition = "background-color 100ms";
                        const img = square.querySelector("img");
                        if (img) {
                          img.style.transition = "opacity 100ms";
                        }
                      }

                      inputEmailQuestAnsw.style.opacity = "1";
                      inputNameQuestAnsw.style.opacity = "1";
                      inputPhoneQuestAnsw.style.opacity = "1";
                      textareaMessageQuestAnsw.style.opacity = "1";
                    }

                    setTimeout(
                      () => {
                        if (!editMode) {
                          questionAnswerForm.style.opacity = "1";
                          questionAnswerForm.style.pointerEvents = "auto";
                        }
                        loadingText.classList.remove("show");
                        setTimeout(() => {
                          cloneСontainer.remove();
                        }, 250);
                      },
                      editMode ? 0 : 250,
                    );
                  }, 250);
                };
                setTimeout(resetInputs, 500);
                if (editMode) {
                  minIndex = numCol;
                } else {
                  containerIdMINI = `feedback-question-answer_${opticId}`;
                  root =
                    document.getElementById(containerIdMINI) ||
                    parentContainer ||
                    document;
                  smallestColId = getSmallestColIndex(
                    root,
                    "feedback-question-answer-col_",
                  );
                  match = smallestColId
                    ? smallestColId.match(/_(\-?\d+)$/)
                    : null;
                  minIndex = match ? parseInt(match[1], 10) : 0;
                }
                newIndex = editMode ? minIndex : minIndex - 1;
                button.disabled = false;
              } else {
                loadingText.innerHTML = text3;

                const resetInputs = () => {
                  questionAnswerForm.style.opacity = "1";
                  questionAnswerForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  setTimeout(() => {
                    cloneСontainer.remove();
                  }, 250);
                };
                setTimeout(resetInputs, 500);
                button.disabled = false;
              }
            } else if (xhr.status === 403) {
              const resp = JSON.parse(xhr.responseText);
              const err = resp.error;

              if (
                err.includes("Не вдалося підтвердити, що Ви не робот") ||
                err.includes("Часті невдалі спроби пройти перевірку на бота")
              ) {
                if (editMode) {
                  const cancelBtn = parentContainer.querySelector(
                    ".card-cont-cancel-button",
                  );
                  const col = cancelBtn.closest(".col");
                  animateShow(gRecaptchaProdQueanContainer, col);
                } else {
                  animateShow(gRecaptchaProdQueanContainer, null);
                }
                loadingText.innerHTML = err;

                setTimeout(() => {
                  questionAnswerForm.style.opacity = "1";
                  questionAnswerForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  button.disabled = false;
                }, 500);
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
                  questionAnswerForm.style.opacity = "1";
                  questionAnswerForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  button.disabled = false;
                }, 1500);
                return;
              }

              loadingText.innerHTML = "Відмова сервера: " + err;

              setTimeout(() => {
                questionAnswerForm.style.opacity = "1";
                questionAnswerForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                button.disabled = false;
              }, 1500);
              return;
            } else {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";

              const resetInputs = () => {
                questionAnswerForm.style.opacity = "1";
                questionAnswerForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                setTimeout(() => {
                  cloneСontainer.remove();
                }, 250);
              };
              setTimeout(resetInputs, 500);
              button.disabled = false;
            }
          };

          xhr.onerror = function () {
            loadingText.innerHTML = "Помилка мережі. Спробуйте ще раз";

            const resetInputs = () => {
              questionAnswerForm.style.opacity = "1";
              questionAnswerForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                cloneСontainer.remove();
              }, 250);
            };
            setTimeout(resetInputs, 500);
            button.disabled = false;
          };

          xhr.send(formData);
        }

        const v2Visible = isVisible(gRecaptchaProdQueanContainer);
        if (v2Visible) {
          let tokenV2;

          if (editId) {
            tokenV2 = grecaptcha.getResponse(
              window.widgetIdEdtiQuestAnswer[opticId][editId],
            );
          } else {
            tokenV2 = grecaptcha.getResponse(widgetIdQuestAnswer[opticId]);
          }

          if (!tokenV2) {
            loadingText.innerHTML = "Не вдалося підтвердити, що Ви не робот";

            const resetInputs = () => {
              questionAnswerForm.style.opacity = "1";
              questionAnswerForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                cloneСontainer.remove();
              }, 250);
            };
            setTimeout(resetInputs, 500);
            button.disabled = false;
            return;
          }
          container.querySelector(`#${versionInputQuestAnsw.id}`).value = "v2";
          sendToken(tokenV2);
        } else {
          recaptchaV3QuestionAnswer.generateToken().then((token) => {
            sendToken(token);
          });
        }
      }
    });
  }

  // Clear Question Answer Button

  const fields = [
    {
      inputId: `#${inputNameQuestAnsw.id}`,
      buttonId: `#${clearButtonNameQuestAnsw.id}`,
    },
    {
      inputId: `#${inputPhoneQuestAnsw.id}`,
      buttonId: `#${clearButtonPhoneQuestAnsw.id}`,
    },
    {
      inputId: `#${inputEmailQuestAnsw.id}`,
      buttonId: `#${clearButtonEmailQuestAnsw.id}`,
    },
  ];

  fields.forEach(({ inputId, buttonId }) => {
    const input = container.querySelector(inputId);
    const button = container.querySelector(buttonId);

    if (!input || !button) return;

    const icon = button.querySelector(".clear-icon");
    const wrapper = input.closest(".enter-quean-CONT-input");

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
    // Client-side form validation handling empty fields, formatting, and checking for restricted content (profanity, code, links).
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

  // Phone Question Answer Input

  if (inputPhoneQuestAnsw) {
    const iti = window.intlTelInput(inputPhoneQuestAnsw, {
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

    inputPhoneQuestAnsw.addEventListener("focus", () => {
      const currentNumber = inputPhoneQuestAnsw.value.trim();
      if (currentNumber === "") {
        const countryData = iti.getSelectedCountryData();
        const dialCode = countryData.dialCode;
        inputPhoneQuestAnsw.value = `+${dialCode} `;
        inputPhoneQuestAnsw.setSelectionRange(
          inputPhoneQuestAnsw.value.length,
          inputPhoneQuestAnsw.value.length,
        );
      }
    });
  }
}
