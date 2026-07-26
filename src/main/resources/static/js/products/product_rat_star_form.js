// Initialization and validation logic for Product Reviews.
// Handles star rating inputs, client-side validation, and dynamic rendering.
import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";
import { checkCode, checkLinks, checkProfanity } from "/js_main/profanity.js";

// Add & Edit Rating Star Product

function initAllRatingProduct(
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
      initRatingProductContainer(
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
window.initAllRatingProduct = initAllRatingProduct;

function initRatingProductContainer(
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

  // Rating Star Product

  const activeTimersProductMRaring = {};

  function showMessageProductMRaring(element) {
    if (activeTimersProductMRaring[element.id]) {
      clearTimeout(activeTimersProductMRaring[element.id]);
    }
    element.style.opacity = "1";
    element.style.visibility = "visible";
  }

  function hideMessageProductMRaring(element) {
    if (activeTimersProductMRaring[element.id]) {
      clearTimeout(activeTimersProductMRaring[element.id]);
    }
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  function hideMessageProductMRaringAfterDelay(element, delay) {
    if (activeTimersProductMRaring[element.id]) {
      clearTimeout(activeTimersProductMRaring[element.id]);
    }
    activeTimersProductMRaring[element.id] = setTimeout(() => {
      hideMessageProductMRaring(element);
      delete activeTimersProductMRaring[element.id];
    }, delay);
  }

  const messageElementRtStrPrMess = document.querySelector(
    ".enter-ratStrPrdct-message",
  );
  const messageElementRtStrPrMessAdvan = document.querySelector(
    ".enter-ratStrPrdct-message-advan",
  );
  const messageElementRtStrPrdctMessDisadvan = document.querySelector(
    ".enter-ratStrPrdct-message-disadvan",
  );
  const messageElements = [
    messageElementRtStrPrMess,
    messageElementRtStrPrMessAdvan,
    messageElementRtStrPrdctMessDisadvan,
  ];

  function updateStyles() {
    messageElements.forEach((el) => {
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

  updateStyles();
  messageElements.forEach((el) => {
    if (!el) return;
    el.addEventListener("input", updateStyles);
  });
  window.addEventListener("resize", updateStyles);

  // In Containers

  const parentContainer = container.closest(mainParentContainer);
  if (!parentContainer) return;

  const containerId = parentContainer.id;
  const opticId = containerId.split("_").pop();

  let minIndex, newIndex, containerIdMINI, root, smallestColId, match;
  if (editMode) {
    minIndex = numCol;
  } else {
    containerIdMINI = `feedback-rating-star-product_${opticId}`;
    root =
      document.getElementById(containerIdMINI) || parentContainer || document;
    smallestColId = getSmallestColIndex(
      root,
      "feedback-rating-star-product-col_",
    );
    match = smallestColId ? smallestColId.match(/_(\-?\d+)$/) : null;
    minIndex = match ? parseInt(match[1], 10) : 0;
  }
  newIndex = editMode ? minIndex : minIndex - 1;
  let elemId = editMode ? `_${editId}` : "";
  const parentRoot = parentContainer || document;
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

  const clearButtonNameProdMRat = pick(
    "clear-ratStrPrdct-button-m-rating-name",
  );
  const inputNameProdMRat = pick("enter-name-m-rating-input");
  const notCorrectMessageNameProdMRat = pick(
    "not-correct-required-m-rating-field-name",
  );
  const emptyMessageNameProdMRat = pick("required-m-rating-field-name");

  const initialNameProdMRat = inputNameProdMRat.value.trim();
  let nameChanged = false;

  const mainRatingEnterProdMRat = pick("main-rating-enter");
  const emptyMainRatingProdMRat = pick("required-field-rating");

  const textareaMessageProdMRat = pick("enter-message-m-rating-textarea");
  const notCorrectMessageTXTARProdMRat = pick(
    "not-correct-required-field-m-rating-message",
  );
  const emptyMessageTXTARProdMRat = pick("required-field-m-rating-message");

  const textareaMessageProdMRatAdvan = pick(
    "enter-message-advan-m-rating-textarea",
  );
  const notCorrectAdvanTXTARProdMRat = pick(
    "not-correct-required-field-m-rating-advantages",
  );

  const textareaMessageProdMRatDisadvan = pick(
    "enter-message-disadvan-m-rating-textarea",
  );
  const notCorrectDisadvanTXTARProdMRat = pick(
    "not-correct-required-field-m-rating-disadvantages",
  );

  const tokenInputProdMRat = pick("recaptchaTokenMRating");
  const versionInputProdMRat = pick("recaptchaVersionMRating");

  const recaptchaV3RatingStarProduct = initRecaptchaV3({
    siteKey: "<REPLACE_ME>",
    action: actionForm,
    container,
    tokenInputSelector: `#${tokenInputProdMRat.id}`,
    versionInputSelector: `#${versionInputProdMRat.id}`,
    trackedElements: [
      inputNameProdMRat,
      mainRatingEnterProdMRat,
      textareaMessageProdMRat,
      textareaMessageProdMRatAdvan,
      textareaMessageProdMRatDisadvan,
    ],
  });

  let checkFamiliarRulesCustomMRat;
  let emptyMessageCheckMRat;
  if (!editMode) {
    checkFamiliarRulesCustomMRat = pick("check-familiar-m-rating-rules-custom");
    emptyMessageCheckMRat = pick("required-field-m-rating-familrul");
  }

  const gRecaptchaProdMRatContainer = pick("m-rating-g-recaptcha-container");
  const emptyGRecaptchaProdMRat = pick("required-field-m-rating-g-recaptcha");

  const rulesCheckOK = editMode
    ? true
    : checkFamiliarRulesCustomMRat && emptyMessageCheckMRat;

  if (
    button &&
    clearButtonNameProdMRat &&
    inputNameProdMRat &&
    notCorrectMessageNameProdMRat &&
    emptyMessageNameProdMRat &&
    mainRatingEnterProdMRat &&
    emptyMainRatingProdMRat &&
    textareaMessageProdMRat &&
    notCorrectMessageTXTARProdMRat &&
    emptyMessageTXTARProdMRat &&
    textareaMessageProdMRatAdvan &&
    notCorrectAdvanTXTARProdMRat &&
    textareaMessageProdMRatDisadvan &&
    notCorrectDisadvanTXTARProdMRat &&
    rulesCheckOK &&
    gRecaptchaProdMRatContainer &&
    emptyGRecaptchaProdMRat &&
    tokenInputProdMRat &&
    versionInputProdMRat
  ) {
    const messagesToHide = editMode
      ? [
          notCorrectMessageNameProdMRat,
          emptyMessageNameProdMRat,
          emptyMainRatingProdMRat,
          notCorrectMessageTXTARProdMRat,
          emptyMessageTXTARProdMRat,
          notCorrectAdvanTXTARProdMRat,
          notCorrectDisadvanTXTARProdMRat,
          emptyGRecaptchaProdMRat,
        ]
      : [
          notCorrectMessageNameProdMRat,
          emptyMessageNameProdMRat,
          emptyMainRatingProdMRat,
          notCorrectMessageTXTARProdMRat,
          emptyMessageTXTARProdMRat,
          notCorrectAdvanTXTARProdMRat,
          notCorrectDisadvanTXTARProdMRat,
          emptyMessageCheckMRat,
          emptyGRecaptchaProdMRat,
        ];

    messagesToHide.forEach((msg) => hideMessageProductMRaring(msg));
    // Validates review text, user inputs, and ensures a star rating is selected before submission.
    button.addEventListener("click", function () {
      if (inputNameProdMRat) {
        const name = inputNameProdMRat.value.trim();
        if (name === "") {
          showMessageProductMRaring(emptyMessageNameProdMRat);
          inputNameProdMRat.value = "";
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
            notCorrectMessageNameProdMRat.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "В імені",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessageNameProdMRat.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageProductMRaring(notCorrectMessageNameProdMRat);
          hideMessageProductMRaringAfterDelay(
            notCorrectMessageNameProdMRat,
            2000 + dopTimeout,
          );
        }
      }

      const checkedInput =
        mainRatingEnterProdMRat.querySelector("input:checked");
      if (!checkedInput) {
        showMessageProductMRaring(emptyMainRatingProdMRat);
      } else {
        hideMessageProductMRaring(emptyMainRatingProdMRat);
      }

      const message = textareaMessageProdMRat.value.trim();
      if (message === "") {
        showMessageProductMRaring(emptyMessageTXTARProdMRat);
        textareaMessageProdMRat.value = "";
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
          notCorrectMessageTXTARProdMRat.innerHTML = buildValidationMessage(
            hasProfanity,
            hasCode,
            hasLinks,
            "У тексті",
          );
          dopTimeout = 1000;
        } else {
          notCorrectMessageTXTARProdMRat.innerHTML =
            "Повинно бути мінімум 10 символів.";
        }

        showMessageProductMRaring(notCorrectMessageTXTARProdMRat);
        hideMessageProductMRaringAfterDelay(
          notCorrectMessageTXTARProdMRat,
          2000 + dopTimeout,
        );
      }

      const advan = textareaMessageProdMRatAdvan.value.trim();
      if (checkProfanity(advan) || checkCode(advan) || checkLinks(advan)) {
        const hasProfanity = checkProfanity(advan);
        const hasCode = checkCode(advan);
        const hasLinks = checkLinks(advan);
        let dopTimeout = 0;

        if (hasProfanity || hasCode || hasLinks) {
          notCorrectAdvanTXTARProdMRat.innerHTML = buildValidationMessage(
            hasProfanity,
            hasCode,
            hasLinks,
            "У тексті",
          );
          dopTimeout = 1000;
        }

        showMessageProductMRaring(notCorrectAdvanTXTARProdMRat);
        hideMessageProductMRaringAfterDelay(
          notCorrectAdvanTXTARProdMRat,
          2000 + dopTimeout,
        );
      }

      const disadvan = textareaMessageProdMRatDisadvan.value.trim();
      if (
        checkProfanity(disadvan) ||
        checkCode(disadvan) ||
        checkLinks(disadvan)
      ) {
        const hasProfanity = checkProfanity(disadvan);
        const hasCode = checkCode(disadvan);
        const hasLinks = checkLinks(disadvan);
        let dopTimeout = 0;

        if (hasProfanity || hasCode || hasLinks) {
          notCorrectDisadvanTXTARProdMRat.innerHTML = buildValidationMessage(
            hasProfanity,
            hasCode,
            hasLinks,
            "У тексті",
          );
          dopTimeout = 1000;
        }

        showMessageProductMRaring(notCorrectDisadvanTXTARProdMRat);
        hideMessageProductMRaringAfterDelay(
          notCorrectDisadvanTXTARProdMRat,
          2000 + dopTimeout,
        );
      }

      if (!editMode) {
        const square = checkFamiliarRulesCustomMRat.querySelector(
          ".check-familiar-rules-square",
        );
        if (!square || !square.classList.contains("active")) {
          showMessageProductMRaring(emptyMessageCheckMRat);
        } else {
          hideMessageProductMRaring(emptyMessageCheckMRat);
        }
      }

      if (isVisible(gRecaptchaProdMRatContainer)) {
        let recaptchaResponse;
        if (editId) {
          recaptchaResponse = grecaptcha.getResponse(
            window.widgetIdEdtiProductRating[opticId][editId],
          );
        } else {
          recaptchaResponse = grecaptcha.getResponse(
            widgetIdProductRating[opticId],
          );
        }
        if (!recaptchaResponse) {
          showMessageProductMRaring(emptyGRecaptchaProdMRat);
        } else {
          hideMessageProductMRaring(emptyGRecaptchaProdMRat);
        }
      }
    });

    if (inputNameProdMRat) {
      inputNameProdMRat.addEventListener("input", function () {
        hideMessageProductMRaring(emptyMessageNameProdMRat);
      });
      inputNameProdMRat.addEventListener("focus", function () {
        hideMessageProductMRaring(notCorrectMessageNameProdMRat);
      });
      notCorrectMessageNameProdMRat.addEventListener("click", function () {
        hideMessageProductMRaring(notCorrectMessageNameProdMRat);
        inputNameProdMRat.focus();
      });
    }

    if (mainRatingEnterProdMRat) {
      const ratingInputs = mainRatingEnterProdMRat.querySelectorAll(
        'input[type="radio"], input[type="checkbox"]',
      );
      ratingInputs.forEach((input) => {
        input.addEventListener("change", function () {
          if (input.checked) {
            hideMessageProductMRaring(emptyMainRatingProdMRat);
          }
        });
      });
    }

    textareaMessageProdMRat.addEventListener("input", function () {
      hideMessageProductMRaring(emptyMessageTXTARProdMRat);
    });
    textareaMessageProdMRat.addEventListener("focus", function () {
      hideMessageProductMRaring(notCorrectMessageTXTARProdMRat);
    });
    notCorrectMessageTXTARProdMRat.addEventListener("click", function () {
      hideMessageProductMRaring(notCorrectMessageTXTARProdMRat);
      textareaMessageProdMRat.focus();
    });

    if (!editMode) {
      const square = checkFamiliarRulesCustomMRat.querySelector(
        ".check-familiar-rules-square",
      );
      if (square) {
        const observer = new MutationObserver(() => {
          if (square.classList.contains("active")) {
            hideMessageProductMRaring(emptyMessageCheckMRat);
          }
        });
        observer.observe(square, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    }

    window.recaptchaSuccessCallbackRating = function () {
      if (isVisible(gRecaptchaProdMRatContainer)) {
        hideMessageProductMRaring(emptyGRecaptchaProdMRat);
      }
    };
  }

  const ratingStarForm = parentContainer.querySelector(form);
  ratingStarForm.style.transition = "opacity 250ms";

  if (ratingStarForm) {
    $(ratingStarForm).off("submit");

    // Performs AJAX POST request for the review form and handles dynamic DOM updates for the newly created review.
    $(ratingStarForm).on("submit", function (event) {
      event.preventDefault();
      const required = [
        `#${button.id}`,

        `#${clearButtonNameProdMRat.id}`,
        `#${inputNameProdMRat.id}`,
        `#${notCorrectMessageNameProdMRat.id}`,
        `#${emptyMessageNameProdMRat.id}`,

        `#${mainRatingEnterProdMRat.id}`,
        `#${emptyMainRatingProdMRat.id}`,

        `#${textareaMessageProdMRat.id}`,
        `#${notCorrectMessageTXTARProdMRat.id}`,
        `#${emptyMessageTXTARProdMRat.id}`,

        `#${textareaMessageProdMRatAdvan.id}`,
        `#${notCorrectAdvanTXTARProdMRat.id}`,

        `#${textareaMessageProdMRatDisadvan.id}`,
        `#${notCorrectDisadvanTXTARProdMRat.id}`,

        `#${gRecaptchaProdMRatContainer.id}`,
        `#${emptyGRecaptchaProdMRat.id}`,
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
            ratingStarForm.submit();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return;
      }

      event.preventDefault();
      button.disabled = true;

      let accountAvailEdit;

      if (editMode) {
        const colContainer = ratingStarForm.closest(".col");
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
        const hasInitial = initialNameProdMRat !== "";
        const isUnchanged = !nameChanged;
        accountAvailEdit = hasInitial && isUnchanged;
      }

      let prephix = editMode ? "Edit" : "";

      const selectedStarInput = document.querySelector(
        `#${mainRatingEnterProdMRat.id} input[name="star${prephix}"]:checked`,
      );
      const mainRatingEnterProdMRatValue = selectedStarInput
        ? selectedStarInput.value
        : null;

      var errorMessages;
      if (!editMode) {
        errorMessages = [
          notCorrectMessageNameProdMRat,
          emptyMessageNameProdMRat,
          emptyMainRatingProdMRat,
          notCorrectMessageTXTARProdMRat,
          emptyMessageTXTARProdMRat,
          notCorrectAdvanTXTARProdMRat,
          notCorrectDisadvanTXTARProdMRat,
          emptyMessageCheckMRat,
        ];
      } else {
        errorMessages = [
          notCorrectMessageNameProdMRat,
          emptyMessageNameProdMRat,
          emptyMainRatingProdMRat,
          notCorrectMessageTXTARProdMRat,
          emptyMessageTXTARProdMRat,
          notCorrectAdvanTXTARProdMRat,
          notCorrectDisadvanTXTARProdMRat,
        ];
      }

      const hasVisibleErrors = errorMessages.some(
        (msg) => msg.style.opacity === "1",
      );

      if (hasVisibleErrors) {
        event.preventDefault();
        button.disabled = false;
      } else if (ratingStarForm) {
        event.preventDefault();
        ratingStarForm.style.opacity = "0.2";
        ratingStarForm.style.pointerEvents = "none";

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
          container.querySelector(`#${tokenInputProdMRat.id}`).value = token;
          const formData = new FormData(ratingStarForm);
          const xhr = new XMLHttpRequest();
          xhr.open("POST", ratingStarForm.action, true);
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              const responseRating = JSON.parse(xhr.responseText);
              if (responseRating.success) {
                const newRatingId = responseRating.newRatingId;

                loadingText.innerHTML = text2;

                if (!editMode) {
                  inputNameProdMRat.style.transition = "opacity 500ms";
                  textareaMessageProdMRat.style.transition = "opacity 500ms";
                  textareaMessageProdMRatAdvan.style.transition =
                    "opacity 500ms";
                  textareaMessageProdMRatDisadvan.style.transition =
                    "opacity 500ms";

                  inputNameProdMRat.style.opacity = "0";

                  if (mainRatingEnterProdMRat) {
                    const ratingInputs =
                      mainRatingEnterProdMRat.querySelectorAll(
                        'input[type="radio"]',
                      );
                    ratingInputs.forEach((input) => {
                      input.checked = false;

                      const label = input.nextElementSibling;
                      if (label) {
                        label.style.transition = "color 500ms";
                      }
                    });
                  }

                  textareaMessageProdMRat.style.opacity = "0";
                  textareaMessageProdMRatAdvan.style.opacity = "0";
                  textareaMessageProdMRatDisadvan.style.opacity = "0";

                  const square = checkFamiliarRulesCustomMRat.querySelector(
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

                  if (isVisible(gRecaptchaProdMRatContainer)) {
                    animateHide(gRecaptchaProdMRatContainer);
                  }
                }

                const cardRatingStarPrdctFeedback =
                  document.createElement("div");
                cardRatingStarPrdctFeedback.className =
                  "card position-relative";
                cardRatingStarPrdctFeedback.classList.add(
                  "product-quest-fade-in",
                );
                cardRatingStarPrdctFeedback.style.backgroundColor = "#f4f5f7";

                cardRatingStarPrdctFeedback.addEventListener(
                  "animationend",
                  () => {
                    cardRatingStarPrdctFeedback.classList.remove(
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
                  `feedback-rating-star-product_${opticId}`,
                );

                let styleNewRatingId = `<style>
                                        #rating-feedbackProductContainer_1_${newRatingId} .mainSkills .mainRating input::before {
                                            content: '\f005';
                                            position: absolute;
                                            font-family: fontAwesome;
                                            font-size: calc(100vw * 19 / 1366);
                                            color: #cdced0;
                                            transition: 0.5s;
                                        }
                                        #rating-feedbackProductContainer_1_${newRatingId} .mainSkills .mainRating input.highlight::before {
                                            color: orange;
                                        }
                                        #rating-feedbackProductContainer_1_${newRatingId} .mainSkills .mainRating input.partial-highlight::before {
                                            background: linear-gradient(to right, orange var(--fill-percentage), #cdced0 var(--fill-percentage));
                                            -webkit-background-clip: text;
                                            background-clip: text;
                                            color: transparent;
                                        }
                                    </style>`;

                let nameFirstLastNon = accountAvail
                  ? `<div class="rating ava-feedback" style="text-align: left; background-color: #dee2e7;">
                                        <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                        style="width: calc(100vw * 20 / 1366); heigth: auto"></div>
                                        <div class="name-feedback" style="margin-left: 1.8%;">
                                        ${mainFirstName} ${mainLastName}</div>`
                  : !accountAvail
                    ? `<div class="name-feedback" style="margin-left: 0.5%;">${inputNameProdMRat.value}</div>`
                    : ``;

                let advanSection =
                  textareaMessageProdMRatAdvan.value.trim() !== ""
                    ? `<br><span style="display: block; height: 1em;"></span
                                    ><strong>Переваги:</strong><br>${textareaMessageProdMRatAdvan.value}`
                    : "";

                let disadvanSection =
                  textareaMessageProdMRatDisadvan.value.trim() !== ""
                    ? `<br><span style="display: block; height: 1em;"></span
                                    ><strong>Недоліки:</strong><br>${textareaMessageProdMRatDisadvan.value}`
                    : "";

                cardRatingStarPrdctFeedback.innerHTML = `
                                    <div class="main-rating-table"
                                        style="margin-left: 2.6%; margin-right: 4.7%; margin-top: 2.05%; margin-bottom: 0.55%;">
                                        <div class="progress-wrapper" style="margin-top: 0%;">
                                            ${nameFirstLastNon}
                                            <div class="data-feedback" style="text-align: right;">
                                                ${formattedDate}
                                            </div>
                                        </div>

                                        ${styleNewRatingId}

                                        <div class="feedback-actions">
                                        <div class="non-selectable mainContainer id="rating-feedbackProductContainer_1_${newRatingId}"
                                        style="text-align: left; margin-left: 0%; margin-top: 1.2%;">
                                            <div class="mainSkills">
                                                <div class="mainRating"">
                                                    <input type="radio" name="star-5" value="5">
                                                    <input type="radio" name="star-4" value="4">
                                                    <input type="radio" name="star-3" value="3">
                                                    <input type="radio" name="star-2" value="2">
                                                    <input type="radio" name="star-1" value="1">
                                                </div>
                                            </div>
                                        </div>

                                        <button class="edit-feedback" id="edit-feedback-rating-star-product_${newRatingId}"
                                            data-num-col="${newIndex}"
                                            data-star="${selectedStarInput.value}"
                                            data-account-used="${accountAvailEdit}"
                                            data-feedback="${textareaMessageProdMRat.value}"
                                            data-advantages="${textareaMessageProdMRatAdvan.value}"
                                            data-disadvantages="${textareaMessageProdMRatDisadvan.value}"
                                            data-client-name="${inputNameProdMRat.value}">
                                            <img src="/images/System_Interface/feedback_control/edit/edit.svg" alt="Edit Feedback">
                                        </button>

                                        <button class="delete-feedback" id="delete-feedback-rating-star-product_${newRatingId}">
                                            <img src="/images/System_Interface/feedback_control/delete/delete.svg" alt="Delete Feedback">
                                        </button>
                                        </div>

                                        <div class="ratStarPrdctFeed-feedback-container">
                                            <p class="ratStarPrdctFeed-feedback-text feedback-text-global"
                                            id="ratStarPrdctFeed-feedback-text_${newRatingId}"
                                            >${textareaMessageProdMRat.value}${advanSection}${disadvanSection}</p>

                                            <table class="feedback-buttons">
                                            <tbody>
                                            <td>
                                                <button id="likeButton_${newRatingId}" class="like-button" data-rating-id="${newRatingId}">
                                                    <img src="/images/System_Interface/feedback_control/like/like.svg" alt="Like" class="like-icon">
                                                    <p class="like-dislike-num" id="like-num_${newRatingId}">0</p>
                                                </button>
                                            </td>
                                            <td class="dislike-td">
                                                <button id="dislikeButton_${newRatingId}" class="dislike-button" data-rating-id="${newRatingId}">
                                                    <img src="/images/System_Interface/feedback_control/dislike/dislike.svg" alt="Dislike" class="dislike-icon">
                                                    <p class="like-dislike-num" id="dislike-num_${newRatingId}">0</p>
                                                </button>
                                            </td>
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                `;

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
                    const newCard = cardRatingStarPrdctFeedback;
                    const feedbackText = newCard.querySelector(
                      `#ratStarPrdctFeed-feedback-text_${newRatingId}`,
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

                    const moreMax = createMoreMax(newRatingId);
                    const moreBtn = moreMax.querySelector(
                      `#more-content-feedback-button_${newRatingId}`,
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

                        const oldId = editId;
                        const newId = newRatingId;

                        const oldLikeState = likeStates[oldId];
                        const oldLikeCount = likeCounts[oldId];
                        const oldLikeImageSrc = likeImages[oldId];

                        const oldDislikeState = dislikeStates[oldId];
                        const oldDislikeCount = dislikeCounts[oldId];
                        const oldDislikeImageSrc = dislikeImages[oldId];

                        likeStates[newId] = oldLikeState;
                        likeCounts[newId] =
                          oldLikeState !== undefined ? oldLikeCount : 0;
                        likeImages[newId] = oldLikeImageSrc;

                        dislikeStates[newId] = oldDislikeState;
                        dislikeCounts[newId] =
                          oldDislikeState !== undefined ? oldDislikeCount : 0;
                        dislikeImages[newId] = oldDislikeImageSrc;

                        if (
                          likeStates[newId] &&
                          likeStates[newId] !== undefined
                        ) {
                          updateLikeIcons(newId);
                          updateLikeNum(newId, oldLikeCount);
                        } else if (
                          dislikeStates[newId] &&
                          dislikeStates[newId] !== undefined
                        ) {
                          updateDislikeIcons(newId);
                          updateDislikeNum(newId, oldDislikeCount);
                        }

                        newCard
                          .querySelectorAll(".main-rating-table")
                          .forEach((container) => {
                            const dateElem =
                              container.querySelector(".data-feedback");
                            const buttonsTbl =
                              container.querySelector(".feedback-buttons");
                            const textTbl = container.querySelector(
                              ".ratStarPrdctFeed-feedback-container .ratStarPrdctFeed-feedback-text",
                            );
                            if (!dateElem || !buttonsTbl || !textTbl) return;

                            const dateW = dateElem.offsetWidth;
                            const buttonsW = buttonsTbl.offsetWidth;
                            const extra =
                              buttonsW - (window.innerWidth * 9) / 1366;

                            textTbl.style.paddingRight = extra + "px";
                            dateElem.style.marginLeft = buttonsW - dateW + "px";
                          });

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

                    cardRatingStarPrdctFeedback.style.opacity = "0.2";
                    cardRatingStarPrdctFeedback.style.pointerEvents = "none";
                    cardRatingStarPrdctFeedback.style.height = `${initialCardHeight}px`;

                    const avgRating = parseFloat(mainRatingEnterProdMRatValue);
                    const whole = Math.floor(avgRating);
                    const frac = avgRating - whole;
                    const stars = cardRatingStarPrdctFeedback.querySelectorAll(
                      'input[type="radio"]',
                    );

                    stars.forEach((star, idx) => {
                      const index = idx + 1;
                      if (index <= whole) {
                        star.classList.add("highlight");
                      } else if (index === whole + 1) {
                        star.style.setProperty(
                          "--fill-percentage",
                          `${frac * 100}%`,
                        );
                        star.classList.add("partial-highlight");
                      }
                    });

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
                    newCol.id = `feedback-rating-star-product-col_${newIndex}`;
                    newCol.className =
                      "col rating-starPrdct-feedback rating-starPrdct-feedbackTOP";

                    const cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
                    cardContainer.appendChild(cardRatingStarPrdctFeedback);

                    const moreMax = createMoreMax(newRatingId);
                    const moreBtn = moreMax.querySelector(
                      `#more-content-feedback-button_${newRatingId}`,
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
                            "rating-starPrdct-feedbackTOP",
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
                      `#ratStarPrdctFeed-feedback-text_${newRatingId}`,
                    );
                    const moreBtnExist = toggleMoreForElement(feedbackText);

                    newCol
                      .querySelectorAll(".main-rating-table")
                      .forEach((container) => {
                        const dateElem =
                          container.querySelector(".data-feedback");
                        const buttonsTbl =
                          container.querySelector(".feedback-buttons");
                        const textTbl = container.querySelector(
                          ".ratStarPrdctFeed-feedback-container .ratStarPrdctFeed-feedback-text",
                        );
                        if (!dateElem || !buttonsTbl || !textTbl) return;

                        const dateW = dateElem.offsetWidth;
                        const buttonsW = buttonsTbl.offsetWidth;
                        const extra = buttonsW - (window.innerWidth * 9) / 1366;

                        textTbl.style.paddingRight = extra + "px";
                        dateElem.style.marginLeft = buttonsW - dateW + "px";
                      });

                    const avgRating = parseFloat(mainRatingEnterProdMRatValue);
                    const whole = Math.floor(avgRating);
                    const frac = avgRating - whole;
                    const stars = newCol.querySelectorAll(
                      'input[type="radio"]',
                    );
                    stars.forEach((star, idx) => {
                      const index = idx + 1;
                      if (index <= whole) {
                        star.classList.add("highlight");
                      } else if (index === whole + 1) {
                        star.style.setProperty(
                          "--fill-percentage",
                          `${frac * 100}%`,
                        );
                        star.classList.add("partial-highlight");
                      }
                    });

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
                    inputNameProdMRat.value = "";
                    textareaMessageProdMRat.value = "";
                    textareaMessageProdMRatAdvan.value = "";
                    textareaMessageProdMRatDisadvan.value = "";

                    if (editId) {
                      grecaptcha.reset(
                        window.widgetIdEdtiProductRating[opticId][editId],
                      );
                    } else {
                      grecaptcha.reset(widgetIdProductRating[opticId]);
                    }
                  }

                  setTimeout(() => {
                    if (!editMode) {
                      inputNameProdMRat.style.transition = "opacity 250ms";

                      if (mainRatingEnterProdMRat) {
                        const ratingInputs =
                          mainRatingEnterProdMRat.querySelectorAll(
                            'input[type="radio"]',
                          );
                        ratingInputs.forEach((input) => {
                          input.checked = false;

                          const label = input.nextElementSibling;
                          if (label) {
                            label.style.transition = "color 300ms";
                          }
                        });
                      }

                      textareaMessageProdMRat.style.transition =
                        "opacity 250ms";
                      textareaMessageProdMRatAdvan.style.transition =
                        "opacity 250ms";
                      textareaMessageProdMRatDisadvan.style.transition =
                        "opacity 250ms";

                      const square = checkFamiliarRulesCustomMRat.querySelector(
                        ".check-familiar-rules-square",
                      );
                      if (square) {
                        square.style.transition = "background-color 100ms";
                        const img = square.querySelector("img");
                        if (img) {
                          img.style.transition = "opacity 100ms";
                        }
                      }

                      inputNameProdMRat.style.opacity = "1";
                      textareaMessageProdMRat.style.opacity = "1";
                      textareaMessageProdMRatAdvan.style.opacity = "1";
                      textareaMessageProdMRatDisadvan.style.opacity = "1";
                    }

                    setTimeout(
                      () => {
                        if (!editMode) {
                          ratingStarForm.style.opacity = "1";
                          ratingStarForm.style.pointerEvents = "auto";
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
                  containerIdMINI = `feedback-rating-star-product_${opticId}`;
                  root =
                    document.getElementById(containerIdMINI) ||
                    parentContainer ||
                    document;
                  smallestColId = getSmallestColIndex(
                    root,
                    "feedback-rating-star-product-col_",
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
                  ratingStarForm.style.opacity = "1";
                  ratingStarForm.style.pointerEvents = "auto";
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
                  animateShow(gRecaptchaProdMRatContainer, col);
                } else {
                  animateShow(gRecaptchaProdMRatContainer, null);
                }
                loadingText.innerHTML = err;

                setTimeout(() => {
                  ratingStarForm.style.opacity = "1";
                  ratingStarForm.style.pointerEvents = "auto";
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
                  ratingStarForm.style.opacity = "1";
                  ratingStarForm.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  button.disabled = false;
                }, 1500);
                return;
              }

              loadingText.innerHTML = "Відмова сервера: " + err;

              setTimeout(() => {
                ratingStarForm.style.opacity = "1";
                ratingStarForm.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                button.disabled = false;
              }, 1500);
              return;
            } else {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";

              const resetInputs = () => {
                ratingStarForm.style.opacity = "1";
                ratingStarForm.style.pointerEvents = "auto";
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
              ratingStarForm.style.opacity = "1";
              ratingStarForm.style.pointerEvents = "auto";
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

        const v2Visible = isVisible(gRecaptchaProdMRatContainer);
        if (v2Visible) {
          let tokenV2;

          if (editId) {
            tokenV2 = grecaptcha.getResponse(
              window.widgetIdEdtiProductRating[opticId][editId],
            );
          } else {
            tokenV2 = grecaptcha.getResponse(widgetIdProductRating[opticId]);
          }

          if (!tokenV2) {
            loadingText.innerHTML = "Не вдалося підтвердити, що Ви не робот";

            const resetInputs = () => {
              ratingStarForm.style.opacity = "1";
              ratingStarForm.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                cloneСontainer.remove();
              }, 250);
            };
            setTimeout(resetInputs, 500);
            button.disabled = false;
            return;
          }
          container.querySelector(`#${versionInputProdMRat.id}`).value = "v2";
          sendToken(tokenV2);
        } else {
          recaptchaV3RatingStarProduct.generateToken().then((token) => {
            sendToken(token);
          });
        }
      }
    });
  }

  // Clear M Rating Button

  const fields = [
    {
      inputId: `#${inputNameProdMRat.id}`,
      buttonId: `#${clearButtonNameProdMRat.id}`,
    },
  ];

  fields.forEach(({ inputId, buttonId }) => {
    const input = container.querySelector(inputId);
    const button = container.querySelector(buttonId);

    if (!input || !button) return;

    const icon = button.querySelector(".clear-icon");
    const wrapper = input.closest(".enter-ratStrPrdct-CONT-input");

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
    // Validates review text, user inputs, and ensures a star rating is selected before submission.
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
