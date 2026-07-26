import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";
import { checkCode, checkLinks, checkProfanity } from "/js_main/profanity.js";

// Open Popup Rating

$("#write-review").click(function () {
  $(".popup-bg-rating").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-rating").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");

  if ($(this).hasClass("bottom-icon-non-availability")) {
    return;
  }

  initAllRatingPopups(
    "",
    "",
    ".enter-rat-strProdct-popup-container",
    ".popup-rating",
    "#popup-rating-button",
    "#ratingStarPrdctPopupForm",
    "rating_global",
    "Надсилання відгуку",
    "Відгук надіслано",
    "Під час відправлення відгуку сталася помилка",
    false,
  );
});

// Add & Edit Rating Star Store

function initAllRatingPopups(
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
      initRatingPopupContainer(
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
window.initAllRatingPopups = initAllRatingPopups;

function initRatingPopupContainer(
  numCol,
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
  // Rating Star Store

  const activeTimersProductMRaringPop = {};

  function showMessageProductMRaringPop(element) {
    if (activeTimersProductMRaringPop[element.id]) {
      clearTimeout(activeTimersProductMRaringPop[element.id]);
    }
    element.style.opacity = "1";
    element.style.visibility = "visible";
  }

  function hideMessageProductMRaringPop(element) {
    if (activeTimersProductMRaringPop[element.id]) {
      clearTimeout(activeTimersProductMRaringPop[element.id]);
    }
    element.style.opacity = "0";
    element.style.visibility = "hidden";
  }

  function hideMessageProductMRaringPopAfterDelay(element, delay) {
    if (activeTimersProductMRaringPop[element.id]) {
      clearTimeout(activeTimersProductMRaringPop[element.id]);
    }
    activeTimersProductMRaringPop[element.id] = setTimeout(() => {
      hideMessageProductMRaringPop(element);
      delete activeTimersProductMRaringPop[element.id];
    }, delay);
  }

  const messageElementRtStrPrMessPopRtStrPrMessPop = document.querySelector(
    ".enter-ratStrPrdct-popup-message",
  );
  const messageElementRtStrPrMessPop = [
    messageElementRtStrPrMessPopRtStrPrMessPop,
  ];

  function updateStylesRtStrPrMessPop() {
    messageElementRtStrPrMessPop.forEach((el) => {
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

  updateStylesRtStrPrMessPop();
  messageElementRtStrPrMessPop.forEach((el) => {
    if (!el) return;
    el.addEventListener("input", updateStylesRtStrPrMessPop);
  });
  window.addEventListener("resize", updateStylesRtStrPrMessPop);

  // In Container

  const parentContainerPop = container.closest(parentContainer);
  if (!parentContainerPop) return;

  let minIndex, newIndex, containerIdMINI, root, smallestColId, match;
  if (editMode) {
    minIndex = numCol;
  } else {
    containerIdMINI = `feedback-rating-star`;
    root =
      document.getElementById(containerIdMINI) || parentContainer || document;
    smallestColId = getSmallestColIndex(root, "feedback-rating-star-col_");
    match = smallestColId ? smallestColId.match(/_(\-?\d+)$/) : null;
    minIndex = match ? parseInt(match[1], 10) : 0;
  }
  newIndex = editMode ? minIndex : minIndex - 1;
  let elemId = editMode ? `_${editId}` : "";
  const parentRoot =
    parentContainerPop || container.closest(".popup-rating") || document;
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
    let el = container.querySelector(`#${baseId}${elemId}`);
    if (!el) el = container.querySelector(`#${baseId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}${elemId}`);
    if (!el) el = parentRoot.querySelector(`#${baseId}`);
    if (!el) el = document.getElementById(`${baseId}${elemId}`);
    if (!el) el = document.getElementById(baseId);
    return el;
  };

  const button = pick(buttonSelector);

  const clearButtonNameProdMRatPop = pick("clear-button-m-rating-name-popup");
  const inputNameProdMRatPop = pick("enter-name-popup-m-rating-input");
  const notCorrectMessageNameProdMRatPop = pick(
    "not-correct-required-popup-m-rating-field-name",
  );
  const emptyMessageNameProdMRatPop = pick(
    "required-popup-m-rating-field-name",
  );

  const initialNameProdMRatPop = inputNameProdMRatPop.value.trim();
  let nameChanged = false;

  const mainRatingEnterProdMRatPopPrice = pick("main-rating-enter-popup_Price");
  const mainRatingEnterProdMRatPopProductQuality = pick(
    "main-rating-enter-popup_ProductQuality",
  );
  const mainRatingEnterProdMRatPopDelivery = pick(
    "main-rating-enter-popup_Delivery",
  );
  const mainRatingEnterProdMRatPopStoreRating = pick(
    "main-rating-enter-popup_StoreRating",
  );
  const emptyMainRatingProdMRatPop = pick("required-popup-field-rating");

  const textareaMessageProdMRatPop = pick(
    "enter-message-popup-m-rating-textarea",
  );
  const notCorrectMessageTXTARProdMRatPop = pick(
    "not-correct-required-popup-field-m-rating-message",
  );
  const emptyMessageTXTARProdMRatPop = pick(
    "required-popup-field-m-rating-message",
  );

  const tokenInputProdMRatPop = pick("recaptchaTokenPopupRating");
  const versionInputProdMRatPop = pick("recaptchaVersionPopupRating");

  const recaptchaRatingGlobalV3 = initRecaptchaV3({
    siteKey: "<REPLACE_ME>",
    action: actionForm,
    container,
    tokenInputSelector: `#${tokenInputProdMRatPop.id}`,
    versionInputSelector: `#${versionInputProdMRatPop.id}`,
    trackedElements: [
      inputNameProdMRatPop,
      textareaMessageProdMRatPop,
      mainRatingEnterProdMRatPopPrice,
      mainRatingEnterProdMRatPopProductQuality,
      mainRatingEnterProdMRatPopDelivery,
      mainRatingEnterProdMRatPopStoreRating,
    ],
  });

  let checkFamiliarRulesCustomMRatPop;
  let emptyMessageCheckMRatPop;
  if (!editMode) {
    checkFamiliarRulesCustomMRatPop = pick(
      "check-familiar-m-rating-popup-rules-custom",
    );
    emptyMessageCheckMRatPop = pick("required-field-m-rating-popup-familrul");
  }

  const gRecaptchaProdMRatPopContainer = pick(
    "m-rating-popup-g-recaptcha-container",
  );
  const emptyGRecaptchaProdMRatPop = pick(
    "required-popup-field-m-rating-g-recaptcha",
  );

  const rulesCheckOK = editMode
    ? true
    : checkFamiliarRulesCustomMRatPop && emptyMessageCheckMRatPop;

  if (
    button &&
    clearButtonNameProdMRatPop &&
    inputNameProdMRatPop &&
    notCorrectMessageNameProdMRatPop &&
    emptyMessageNameProdMRatPop &&
    mainRatingEnterProdMRatPopPrice &&
    mainRatingEnterProdMRatPopProductQuality &&
    mainRatingEnterProdMRatPopDelivery &&
    mainRatingEnterProdMRatPopStoreRating &&
    emptyMainRatingProdMRatPop &&
    textareaMessageProdMRatPop &&
    notCorrectMessageTXTARProdMRatPop &&
    emptyMessageTXTARProdMRatPop &&
    rulesCheckOK &&
    gRecaptchaProdMRatPopContainer &&
    emptyGRecaptchaProdMRatPop &&
    tokenInputProdMRatPop &&
    versionInputProdMRatPop
  ) {
    const messagesToHide = editMode
      ? [
          notCorrectMessageNameProdMRatPop,
          emptyMessageNameProdMRatPop,
          emptyMainRatingProdMRatPop,
          notCorrectMessageTXTARProdMRatPop,
          emptyMessageTXTARProdMRatPop,
          emptyGRecaptchaProdMRatPop,
        ]
      : [
          notCorrectMessageNameProdMRatPop,
          emptyMessageNameProdMRatPop,
          emptyMainRatingProdMRatPop,
          notCorrectMessageTXTARProdMRatPop,
          emptyMessageTXTARProdMRatPop,
          emptyMessageCheckMRatPop,
          emptyGRecaptchaProdMRatPop,
        ];

    messagesToHide.forEach((msg) => hideMessageProductMRaringPop(msg));
    button.addEventListener("click", function () {
      if (inputNameProdMRatPop) {
        const name = inputNameProdMRatPop.value.trim();
        if (name === "") {
          showMessageProductMRaringPop(emptyMessageNameProdMRatPop);
          inputNameProdMRatPop.value = "";
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
            notCorrectMessageNameProdMRatPop.innerHTML = buildValidationMessage(
              hasProfanity,
              hasCode,
              hasLinks,
              "В імені",
            );
            dopTimeout = 1000;
          } else {
            notCorrectMessageNameProdMRatPop.innerHTML =
              "Повинно бути мінімум 2 символа.";
          }

          showMessageProductMRaringPop(notCorrectMessageNameProdMRatPop);
          hideMessageProductMRaringPopAfterDelay(
            notCorrectMessageNameProdMRatPop,
            2000 + dopTimeout,
          );
        }
      }

      const checkedInputPopPrice =
        mainRatingEnterProdMRatPopPrice.querySelector("input:checked");
      const checkedInputPopProductQuality =
        mainRatingEnterProdMRatPopProductQuality.querySelector("input:checked");
      const checkedInputPopDelivery =
        mainRatingEnterProdMRatPopDelivery.querySelector("input:checked");
      const checkedInputPopStoreRating =
        mainRatingEnterProdMRatPopStoreRating.querySelector("input:checked");
      if (
        !checkedInputPopPrice ||
        !checkedInputPopProductQuality ||
        !checkedInputPopDelivery ||
        !checkedInputPopStoreRating
      ) {
        showMessageProductMRaringPop(emptyMainRatingProdMRatPop);
      } else {
        hideMessageProductMRaringPop(emptyMainRatingProdMRatPop);
      }

      const message = textareaMessageProdMRatPop.value.trim();
      if (message === "") {
        showMessageProductMRaringPop(emptyMessageTXTARProdMRatPop);
        textareaMessageProdMRatPop.value = "";
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
          notCorrectMessageTXTARProdMRatPop.innerHTML = buildValidationMessage(
            hasProfanity,
            hasCode,
            hasLinks,
            "У тексті",
          );
          dopTimeout = 1000;
        } else {
          notCorrectMessageTXTARProdMRatPop.innerHTML =
            "Повинно бути мінімум 10 символів.";
        }

        showMessageProductMRaringPop(notCorrectMessageTXTARProdMRatPop);
        hideMessageProductMRaringPopAfterDelay(
          notCorrectMessageTXTARProdMRatPop,
          2000 + dopTimeout,
        );
      }

      if (!editMode) {
        const square = checkFamiliarRulesCustomMRatPop.querySelector(
          ".check-familiar-rules-square",
        );
        if (!square || !square.classList.contains("active")) {
          showMessageProductMRaringPop(emptyMessageCheckMRatPop);
        } else {
          hideMessageProductMRaringPop(emptyMessageCheckMRatPop);
        }
      }

      if (isVisible(gRecaptchaProdMRatPopContainer)) {
        let recaptchaResponse;
        if (editId) {
          recaptchaResponse = grecaptcha.getResponse(
            window.widgetIdEdtiMainRating[editId],
          );
        } else {
          recaptchaResponse = grecaptcha.getResponse(widgetIdMainRating);
        }
        if (!recaptchaResponse) {
          showMessageProductMRaringPop(emptyGRecaptchaProdMRatPop);
        } else {
          hideMessageProductMRaringPop(emptyGRecaptchaProdMRatPop);
        }
      }
    });

    if (inputNameProdMRatPop) {
      inputNameProdMRatPop.addEventListener("input", function () {
        hideMessageProductMRaringPop(emptyMessageNameProdMRatPop);
        nameChanged =
          inputNameProdMRatPop.value.trim() !== initialNameProdMRatPop;
      });
      inputNameProdMRatPop.addEventListener("focus", function () {
        hideMessageProductMRaringPop(notCorrectMessageNameProdMRatPop);
      });
      notCorrectMessageNameProdMRatPop.addEventListener("click", function () {
        hideMessageProductMRaringPop(notCorrectMessageNameProdMRatPop);
        inputNameProdMRatPop.focus();
      });
    }

    [
      mainRatingEnterProdMRatPopPrice,
      mainRatingEnterProdMRatPopProductQuality,
      mainRatingEnterProdMRatPopDelivery,
      mainRatingEnterProdMRatPopStoreRating,
    ].forEach((section) => {
      if (section) {
        const ratingInputs = section.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]',
        );
        ratingInputs.forEach((input) => {
          input.addEventListener("change", function () {
            if (input.checked) {
              hideMessageProductMRaringPop(emptyMainRatingProdMRatPop);
            }
          });
        });
      }
    });

    textareaMessageProdMRatPop.addEventListener("input", function () {
      hideMessageProductMRaringPop(emptyMessageTXTARProdMRatPop);
    });
    textareaMessageProdMRatPop.addEventListener("focus", function () {
      hideMessageProductMRaringPop(notCorrectMessageTXTARProdMRatPop);
    });
    notCorrectMessageTXTARProdMRatPop.addEventListener("click", function () {
      hideMessageProductMRaringPop(notCorrectMessageTXTARProdMRatPop);
      textareaMessageProdMRatPop.focus();
    });

    if (!editMode) {
      const square = checkFamiliarRulesCustomMRatPop.querySelector(
        ".check-familiar-rules-square",
      );
      if (square) {
        const observer = new MutationObserver(() => {
          if (square.classList.contains("active")) {
            hideMessageProductMRaringPop(emptyMessageCheckMRatPop);
          }
        });
        observer.observe(square, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    }

    window.recaptchaSuccessCallbackPopMainRating = function () {
      if (isVisible(gRecaptchaProdMRatPopContainer)) {
        hideMessageProductMRaringPop(emptyGRecaptchaProdMRatPop);
      }
    };
  }

  const ratingStarFormPop = parentContainerPop.querySelector(form);
  ratingStarFormPop.style.transition = "opacity 250ms";

  if (ratingStarFormPop) {
    $(ratingStarFormPop).off("submit");

    $(ratingStarFormPop).on("submit", function (event) {
      event.preventDefault();
      const required = [
        `#${button.id}`,

        `#${clearButtonNameProdMRatPop.id}`,
        `#${inputNameProdMRatPop.id}`,
        `#${notCorrectMessageNameProdMRatPop.id}`,
        `#${emptyMessageNameProdMRatPop.id}`,

        `#${mainRatingEnterProdMRatPopPrice.id}`,
        `#${mainRatingEnterProdMRatPopProductQuality.id}`,
        `#${mainRatingEnterProdMRatPopDelivery.id}`,
        `#${mainRatingEnterProdMRatPopStoreRating.id}`,
        `#${emptyMainRatingProdMRatPop.id}`,

        `#${textareaMessageProdMRatPop.id}`,
        `#${notCorrectMessageTXTARProdMRatPop.id}`,
        `#${emptyMessageTXTARProdMRatPop.id}`,

        `#${gRecaptchaProdMRatPopContainer.id}`,
        `#${emptyGRecaptchaProdMRatPop.id}`,
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
            ratingStarFormPop.submit();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return;
      }

      event.preventDefault();
      button.disabled = true;

      let accountAvailEdit;

      if (editMode) {
        const colContainer = ratingStarFormPop.closest(".col");
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
        const hasInitial = initialNameProdMRatPop !== "";
        const isUnchanged = !nameChanged;
        accountAvailEdit = hasInitial && isUnchanged;
      }

      let prephix = editMode ? "Edit" : "";

      const selectedStarPriceInput = container.querySelector(
        `#${mainRatingEnterProdMRatPopPrice.id} input[name="star${prephix}Price"]:checked`,
      );
      const selectedStarProductQualityInput = container.querySelector(
        `#${mainRatingEnterProdMRatPopProductQuality.id} input[name="star${prephix}ProductQuality"]:checked`,
      );
      const selectedStarDeliveryInput = container.querySelector(
        `#${mainRatingEnterProdMRatPopDelivery.id} input[name="star${prephix}Delivery"]:checked`,
      );
      const selectedStoreRatingInput = container.querySelector(
        `#${mainRatingEnterProdMRatPopStoreRating.id} input[name="star${prephix}StoreRating"]:checked`,
      );

      let total;
      if (
        selectedStarPriceInput &&
        selectedStarProductQualityInput &&
        selectedStarDeliveryInput &&
        selectedStoreRatingInput
      ) {
        total =
          Number(selectedStarPriceInput.value) +
          Number(selectedStarProductQualityInput.value) +
          Number(selectedStarDeliveryInput.value) +
          Number(selectedStoreRatingInput.value);
      }

      const mainRatingEnterProdMRatPopValue =
        selectedStarPriceInput &&
        selectedStarProductQualityInput &&
        selectedStarDeliveryInput &&
        selectedStoreRatingInput
          ? Math.round((total / 4) * 10) / 10
          : null;

      var errorMessages;
      if (!editMode) {
        errorMessages = [
          notCorrectMessageNameProdMRatPop,
          emptyMessageNameProdMRatPop,
          emptyMainRatingProdMRatPop,
          notCorrectMessageTXTARProdMRatPop,
          emptyMessageTXTARProdMRatPop,
          emptyMessageCheckMRatPop,
        ];
      } else {
        errorMessages = [
          notCorrectMessageNameProdMRatPop,
          emptyMessageNameProdMRatPop,
          emptyMainRatingProdMRatPop,
          notCorrectMessageTXTARProdMRatPop,
          emptyMessageTXTARProdMRatPop,
        ];
      }

      const hasVisibleErrors = errorMessages.some(
        (msg) => msg.style.opacity === "1",
      );

      if (hasVisibleErrors) {
        event.preventDefault();
        button.disabled = false;
      } else if (ratingStarFormPop) {
        event.preventDefault();
        ratingStarFormPop.style.opacity = "0.2";
        ratingStarFormPop.style.pointerEvents = "none";

        const originalPopup = container.closest(parentContainer);
        if (!originalPopup) return;

        const clonePopup = originalPopup.cloneNode(false);
        clonePopup.classList.add("clone-transparent");

        const loadingText = document.createElement("div");
        loadingText.className = "loading-text-popup";
        loadingText.innerHTML = `${text1}<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>`;

        clonePopup.appendChild(loadingText);
        originalPopup.parentElement.appendChild(clonePopup);

        requestAnimationFrame(() => {
          loadingText.classList.add("show");
        });

        function sendToken(token) {
          container.querySelector(`#${tokenInputProdMRatPop.id}`).value = token;
          const formData = new FormData(ratingStarFormPop);
          const xhr = new XMLHttpRequest();
          xhr.open("POST", ratingStarFormPop.action, true);
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              const responseRatingGlobal = JSON.parse(xhr.responseText);
              if (responseRatingGlobal.success) {
                const newRatingGlobalId =
                  responseRatingGlobal.newRatingGlobalId;

                loadingText.innerHTML = text2;

                if (!editMode) {
                  inputNameProdMRatPop.style.transition = "opacity 500ms";
                  textareaMessageProdMRatPop.style.transition = "opacity 500ms";

                  [
                    mainRatingEnterProdMRatPopPrice,
                    mainRatingEnterProdMRatPopProductQuality,
                    mainRatingEnterProdMRatPopDelivery,
                    mainRatingEnterProdMRatPopStoreRating,
                  ].forEach((section) => {
                    if (section) {
                      const ratingInputs = section.querySelectorAll(
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
                  });

                  inputNameProdMRatPop.style.opacity = "0";
                  textareaMessageProdMRatPop.style.opacity = "0";

                  const square = checkFamiliarRulesCustomMRatPop.querySelector(
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

                  if (!editMode && isVisible(gRecaptchaProdMRatPopContainer)) {
                    animateHide(gRecaptchaProdMRatPopContainer);
                  }
                }

                const cardRatingStarPrdctFeedback =
                  document.createElement("div");
                cardRatingStarPrdctFeedback.className =
                  "card position-relative";
                cardRatingStarPrdctFeedback.style.backgroundColor = "#f4f5f7";

                const now = new Date();
                const formattedDate =
                  now.getDate().toString().padStart(2, "0") +
                  "-" +
                  (now.getMonth() + 1).toString().padStart(2, "0") +
                  "-" +
                  now.getFullYear();

                const mainContainer =
                  document.querySelector("#feedback-mainRating-star") ||
                  document.querySelector("#feedback-rating-star");

                let styleNewRatingGlobalId = `<style>
                                        #rating-feedbackContainer_1_${newRatingGlobalId} .mainSkills .mainRating input::before {
                                            content: '\f005';
                                            position: absolute;
                                            font-family: fontAwesome;
                                            font-size: calc(100vw * 19 / 1366);
                                            color: #cdced0;
                                            transition: 0.5s;
                                        }
                                        #rating-feedbackContainer_1_${newRatingGlobalId} .mainSkills .mainRating input.highlight::before {
                                            color: orange;
                                        }
                                        #rating-feedbackContainer_1_${newRatingGlobalId} .mainSkills .mainRating input.partial-highlight::before {
                                            background: linear-gradient(to right, orange var(--fill-percentage), #cdced0 var(--fill-percentage));
                                            -webkit-background-clip: text;
                                            background-clip: text;
                                            color: transparent;
                                        }
                                    </style>`;

                if (document.querySelector("#feedback-mainRating-star")) {
                  let nameFirstLastNon = accountAvail
                    ? `<div class="rating ava-feedback" style="text-align: left; background-color: #dee2e7;">
                                            <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                            style="width: calc(100vw * 20 / 1366); heigth: auto"></div>
                                            <div class="name-feedback" style="margin-left: 5.2%;">
                                            ${mainFirstName} ${mainLastName}</div>`
                    : !accountAvail
                      ? `<div class="name-feedback" style="margin-left: 1.5%;">${inputNameProdMRatPop.value}</div>`
                      : ``;

                  cardRatingStarPrdctFeedback.innerHTML = `
                                        <div class="main-rating-table"
                                            style="margin-left: 7.5%; margin-right: 7.5%; margin-top: 7.5%; margin-bottom: 1.5%;">
                                            <div class="progress-wrapper" style="margin-top: 0%;">
                                                ${nameFirstLastNon}
                                                <div class="data-feedback data-feedback-global-main" style="text-align: right;">
                                                    ${formattedDate}
                                                </div>
                                            </div>

                                            ${styleNewRatingGlobalId}

                                            <div class="non-selectable mainContainer" id="rating-feedbackContainer_1_${newRatingGlobalId}"
                                            style="text-align: left; margin-left: 0%; margin-top: 4%; margin-bottom: 1.2%;">
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
                                            
                                            <p class="feedback-text">${textareaMessageProdMRatPop.value}</p>
                                        </div>
                                    `;
                } else if (document.querySelector("#feedback-rating-star")) {
                  let nameFirstLastNon = accountAvail
                    ? `<div class="rating ava-feedback" style="text-align: left; background-color: #dee2e7;">
                                            <img src="/images/System_Interface/navbar_symbols/user/user.svg" alt="User"
                                            style="width: calc(100vw * 20 / 1366); heigth: auto"></div>
                                            <div class="name-feedback">
                                            ${mainFirstName} ${mainLastName}</div>`
                    : `<div class="name-feedback" style="margin-left: 0.5%;">
                                        ${inputNameProdMRatPop.value}</div>`;

                  cardRatingStarPrdctFeedback.innerHTML = `
                                        <div class="main-rating-table"
                                            style="margin-left: 2.5%; margin-right: 2.5%; margin-top: 2.5%; margin-bottom: 0%;">
                                            <div class="progress-wrapper" style="margin-top: 0%;">
                                                ${nameFirstLastNon}
                                                <div class="data-feedback" style="text-align: right;">
                                                    ${formattedDate}
                                                </div>
                                            </div>

                                            ${styleNewRatingGlobalId}

                                            <div class="feedback-actions">
                                            <div class="non-selectable mainContainer" id="rating-feedbackContainer_1_${newRatingGlobalId}"
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

                                            <button class="edit-feedback" id="edit-feedback-rating-star_${newRatingGlobalId}"
                                                data-num-col="${newIndex}"
                                                data-star-price="${selectedStarPriceInput.value}"
                                                data-star-product-quality="${selectedStarProductQualityInput.value}"
                                                data-star-delivery="${selectedStarDeliveryInput.value}"
                                                data-star-store-rating="${selectedStoreRatingInput.value}"
                                                data-account-used="${accountAvailEdit}"
                                                data-feedback="${textareaMessageProdMRatPop.value}"
                                                data-client-name="${inputNameProdMRatPop.value}">
                                                <img src="/images/System_Interface/feedback_control/edit/edit.svg" alt="Edit Feedback">
                                            </button>

                                            <button class="delete-feedback" id="delete-feedback-rating-star_${newRatingGlobalId}">
                                                <img src="/images/System_Interface/feedback_control/delete/delete.svg" alt="Delete Feedback">
                                            </button>
                                            </div>

                                            <div class="feedback-container">
                                                <p class="feedback-text feedback-text-global"
                                                id="feedback-text-global_${newRatingGlobalId}"
                                                >${textareaMessageProdMRatPop.value}</p>
                                                
                                                <table class="feedback-buttons">
                                                <tbody>
                                                <td>
                                                    <button id="likeGlobalButton_${newRatingGlobalId}" class="like-button" data-rating-global-id="${newRatingGlobalId}">
                                                        <img src="/images/System_Interface/feedback_control/like/like.svg" alt="Like" class="like-icon">
                                                        <p class="like-dislike-num" id="likeGlobal-num_${newRatingGlobalId}">0</p>
                                                    </button>
                                                </td>
                                                <td class="dislike-td">
                                                    <button id="dislikeGlobalButton_${newRatingGlobalId}" class="dislike-button" data-rating-global-id="${newRatingGlobalId}">
                                                        <img src="/images/System_Interface/feedback_control/dislike/dislike.svg" alt="Dislike" class="dislike-icon">
                                                        <p class="like-dislike-num" id="dislikeGlobal-num_${newRatingGlobalId}">0</p>
                                                    </button>
                                                </td>
                                                </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    `;
                }

                if (mainContainer) {
                  if (document.querySelector("#feedback-mainRating-star")) {
                    const storedCards = [];
                    for (let i = 0; i < 5; i++) {
                      const col = mainContainer.querySelector(
                        `#feedback-rating-star-col_${i}`,
                      );
                      const card = col?.querySelector(".card");
                      storedCards.push(card ? card.cloneNode(true) : null);
                    }

                    for (let i = 1; i <= 5; i++) {
                      const col = mainContainer.querySelector(
                        `#feedback-rating-star-col_${i}`,
                      );
                      if (col && storedCards[i - 1]) {
                        const existingCard = col.querySelector(".card");
                        if (existingCard) {
                          col.replaceChild(storedCards[i - 1], existingCard);
                        } else {
                          col.appendChild(storedCards[i - 1]);
                        }
                      }
                    }

                    const firstCol = mainContainer.querySelector(
                      `#feedback-rating-star-col_${newIndex}`,
                    );
                    if (firstCol) {
                      const oldCard = firstCol.querySelector(".card");
                      const newCard = cardRatingStarPrdctFeedback;

                      const existingTable = firstCol.querySelector(
                        `#main-rating-table_${newIndex}`,
                      );
                      if (existingTable) {
                        existingTable.style.opacity = "0";
                      }

                      if (oldCard) {
                        firstCol.replaceChild(newCard, oldCard);
                      } else {
                        firstCol.appendChild(newCard);
                      }

                      const totalCountElement =
                        document.querySelector(".total-count");
                      if (totalCountElement) {
                        const currentCount = parseInt(
                          totalCountElement.textContent.match(/\d+/)[0],
                          10,
                        );
                        totalCountElement.textContent = `Кількість відгуків ${currentCount + 1}`;
                      }

                      const arithmeticMainAvrg = parseFloat(
                        mainRatingEnterProdMRatPopValue,
                      );
                      const wholeMainPart = Math.floor(arithmeticMainAvrg);
                      const decimalMainPart =
                        arithmeticMainAvrg - wholeMainPart;

                      const starsMain = document.querySelectorAll(
                        `#rating-feedbackContainer_1_${newRatingGlobalId} input`,
                      );

                      starsMain.forEach((star, index) => {
                        const starIndex = index + 1;

                        if (starIndex <= wholeMainPart) {
                          star.classList.add("highlight");
                        } else if (starIndex === wholeMainPart + 1) {
                          const partialMainFill = decimalMainPart * 100;
                          star.style.setProperty(
                            "--fill-percentage",
                            partialMainFill + "%",
                          );
                          star.classList.add("partial-highlight");
                        }
                      });

                      const newTable =
                        newCard.querySelector(".main-rating-table");
                      if (newTable) {
                        newTable.style.opacity = "0";
                        newTable.style.transition = "opacity 750ms";
                        requestAnimationFrame(() => {
                          newTable.style.opacity = "1";
                        });
                      }
                    }
                  } else if (document.querySelector("#feedback-rating-star")) {
                    if (editMode) {
                      const cancelBtn = parentContainerPop.querySelector(
                        ".card-cont-cancel-button",
                      );
                      const col = cancelBtn.closest(".col");
                      const editBgElement =
                        col.querySelector(".edit-bg-visible");
                      const cardContainer =
                        col.querySelector(".card-container");
                      const oldCard = cardContainer.querySelector(
                        ".card.position-relative",
                      );
                      const newCard = cardRatingStarPrdctFeedback;
                      const feedbackText = newCard.querySelector(
                        `#feedback-text-global_${newRatingGlobalId}`,
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

                      const moreMax = createMoreMax(newRatingGlobalId);
                      const moreBtn = moreMax.querySelector(
                        `#more-content-feedback-button_${newRatingGlobalId}`,
                      );
                      const newMore = moreMax.querySelector(
                        ".more-content-feedback-container",
                      );

                      oldCard.addEventListener(
                        "transitionend",
                        function onFadeOut(e) {
                          if (e.propertyName !== "opacity") return;
                          if (existingMore) existingMore.remove();
                          oldCard.removeEventListener(
                            "transitionend",
                            onFadeOut,
                          );

                          if (newMore) {
                            newMore.style.transition = "opacity 500ms";
                            newMore.style.opacity = "0";
                          }
                          cardContainer.appendChild(moreMax);

                          newCard.style.opacity = "0";
                          newCard.style.transition = "opacity 500ms";
                          cardContainer.replaceChild(newCard, oldCard);

                          const moreBtnExist =
                            toggleMoreForElement(feedbackText);
                          if (moreBtnExist && moreBtn)
                            toggleMoreContentFeedbackInstant(moreBtn);

                          const oldId = editId;
                          const newId = newRatingGlobalId;

                          const oldLikeState = likeGlobalStates[oldId];
                          const oldLikeCount = likeGlobalCounts[oldId];
                          const oldLikeImageSrc = likeGlobalImages[oldId];

                          const oldDislikeState = dislikeGlobalStates[oldId];
                          const oldDislikeCount = dislikeGlobalCounts[oldId];
                          const oldDislikeImageSrc = dislikeGlobalImages[oldId];

                          likeGlobalStates[newId] = oldLikeState;
                          likeGlobalCounts[newId] =
                            oldLikeState !== undefined ? oldLikeCount : 0;
                          likeGlobalImages[newId] = oldLikeImageSrc;

                          dislikeGlobalStates[newId] = oldDislikeState;
                          dislikeGlobalCounts[newId] =
                            oldDislikeState !== undefined ? oldDislikeCount : 0;
                          dislikeGlobalImages[newId] = oldDislikeImageSrc;

                          if (
                            likeGlobalStates[newId] &&
                            likeGlobalStates[newId] !== undefined
                          ) {
                            updateLikeGlobalIcons(newId);
                            updateLikeGlobalNum(newId, oldLikeCount);
                          } else if (
                            dislikeGlobalStates[newId] &&
                            dislikeGlobalStates[newId] !== undefined
                          ) {
                            updateDislikeGlobalIcons(newId);
                            updateDislikeGlobalNum(newId, oldDislikeCount);
                          }

                          newCard
                            .querySelectorAll(".main-rating-table")
                            .forEach((container) => {
                              const dateElem =
                                container.querySelector(".data-feedback");
                              const buttonsTbl =
                                container.querySelector(".feedback-buttons");
                              const textTbl = container.querySelector(
                                ".feedback-container .feedback-text",
                              );
                              if (!dateElem || !buttonsTbl || !textTbl) return;

                              const dateW = dateElem.offsetWidth;
                              const buttonsW = buttonsTbl.offsetWidth;
                              const extra =
                                buttonsW - (window.innerWidth * 9) / 1366;

                              textTbl.style.paddingRight = extra + "px";
                              dateElem.style.marginLeft =
                                buttonsW - dateW + "px";
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

                      const avgRating = parseFloat(
                        mainRatingEnterProdMRatPopValue,
                      );
                      const whole = Math.floor(avgRating);
                      const frac = avgRating - whole;
                      const stars =
                        cardRatingStarPrdctFeedback.querySelectorAll(
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
                      newCol.id = `feedback-rating-star-col_${newIndex}`;
                      newCol.className =
                        "col rating-starPrdct-feedback rating-starPrdct-feedbackTOP";

                      const cardContainer = document.createElement("div");
                      cardContainer.className = "card-container";
                      cardContainer.appendChild(cardRatingStarPrdctFeedback);

                      const moreMax = createMoreMax(newRatingGlobalId);
                      const moreBtn = moreMax.querySelector(
                        `#more-content-feedback-button_${newRatingGlobalId}`,
                      );
                      cardContainer.appendChild(moreMax);

                      newCol.appendChild(cardContainer);

                      const wrapper = document.createElement("div");
                      wrapper.className = "vertical-line";
                      wrapper.dataset.index = newIndex;
                      const now = new Date();
                      const isoLocal = `${now.getFullYear().toString().padStart(4, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}T${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
                      wrapper.setAttribute("data-date", isoLocal);
                      wrapper.appendChild(newCol);

                      mainContainer.prepend(wrapper);

                      const feedbackText = newCol.querySelector(
                        `#feedback-text-global_${newRatingGlobalId}`,
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
                            ".feedback-container .feedback-text",
                          );
                          if (!dateElem || !buttonsTbl || !textTbl) return;

                          const dateW = dateElem.offsetWidth;
                          const buttonsW = buttonsTbl.offsetWidth;
                          const extra =
                            buttonsW - (window.innerWidth * 9) / 1366;

                          textTbl.style.paddingRight = extra + "px";
                          dateElem.style.marginLeft = buttonsW - dateW + "px";
                        });

                      const totalCountElement =
                        document.querySelector(".total-count");
                      if (totalCountElement) {
                        const currentCount = parseInt(
                          totalCountElement.textContent.match(/\d+/)[0],
                          10,
                        );
                        totalCountElement.textContent = `Кількість відгуків ${currentCount + 1}`;
                      }

                      const avgRating = parseFloat(
                        mainRatingEnterProdMRatPopValue,
                      );
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

                      const newTable =
                        newCol.querySelector(".main-rating-table");
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

                      window.ratings.unshift(wrapper);
                      window.initPagination();
                    }
                  }
                }

                const resetInputs = () => {
                  if (!editMode) {
                    inputNameProdMRatPop.value = "";
                    textareaMessageProdMRatPop.value = "";

                    if (editId) {
                      grecaptcha.reset(window.widgetIdEdtiMainRating[editId]);
                    } else {
                      grecaptcha.reset(widgetIdMainRating);
                    }
                  }

                  setTimeout(() => {
                    if (!editMode) {
                      inputNameProdMRatPop.style.transition = "opacity 250ms";

                      [
                        mainRatingEnterProdMRatPopPrice,
                        mainRatingEnterProdMRatPopProductQuality,
                        mainRatingEnterProdMRatPopDelivery,
                        mainRatingEnterProdMRatPopStoreRating,
                      ].forEach((section) => {
                        if (section) {
                          const ratingInputs = section.querySelectorAll(
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
                      });

                      textareaMessageProdMRatPop.style.transition =
                        "opacity 250ms";

                      inputNameProdMRatPop.style.opacity = "1";
                      textareaMessageProdMRatPop.style.opacity = "1";
                    }

                    setTimeout(
                      () => {
                        if (!editMode) {
                          ratingStarFormPop.style.opacity = "1";
                          ratingStarFormPop.style.pointerEvents = "auto";
                        }
                        loadingText.classList.remove("show");
                        setTimeout(() => {
                          clonePopup.remove();
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
                  containerIdMINI = `feedback-rating-star`;
                  root =
                    document.getElementById(containerIdMINI) ||
                    parentContainer ||
                    document;
                  smallestColId = getSmallestColIndex(
                    root,
                    "feedback-rating-star-col_",
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
                  ratingStarFormPop.style.opacity = "1";
                  ratingStarFormPop.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  setTimeout(() => {
                    clonePopup.remove();
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
                  const cancelBtn = parentContainerPop.querySelector(
                    ".card-cont-cancel-button",
                  );
                  const col = cancelBtn.closest(".col");
                  animateShow(gRecaptchaProdMRatPopContainer, col);
                } else {
                  animateShow(gRecaptchaProdMRatPopContainer, null);
                }
                loadingText.innerHTML = err;

                setTimeout(() => {
                  ratingStarFormPop.style.opacity = "1";
                  ratingStarFormPop.style.pointerEvents = "auto";
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
                  ratingStarFormPop.style.opacity = "1";
                  ratingStarFormPop.style.pointerEvents = "auto";
                  loadingText.classList.remove("show");
                  document.querySelector(".clone-transparent")?.remove();
                  button.disabled = false;
                }, 1500);
                return;
              }

              loadingText.innerHTML = "Відмова сервера: " + err;

              setTimeout(() => {
                ratingStarFormPop.style.opacity = "1";
                ratingStarFormPop.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                document.querySelector(".clone-transparent")?.remove();
                button.disabled = false;
              }, 1500);
              return;
            } else {
              loadingText.innerHTML =
                "Помилка сервера. Будь ласка, спробуйте пізніше";

              const resetInputs = () => {
                ratingStarFormPop.style.opacity = "1";
                ratingStarFormPop.style.pointerEvents = "auto";
                loadingText.classList.remove("show");
                setTimeout(() => {
                  clonePopup.remove();
                }, 250);
              };
              setTimeout(resetInputs, 500);
              button.disabled = false;
            }
          };

          xhr.onerror = function () {
            loadingText.innerHTML = "Помилка мережі. Спробуйте ще раз";

            const resetInputs = () => {
              ratingStarFormPop.style.opacity = "1";
              ratingStarFormPop.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                clonePopup.remove();
              }, 250);
            };
            setTimeout(resetInputs, 500);
            button.disabled = false;
          };

          xhr.send(formData);
        }

        const v2Visible = isVisible(gRecaptchaProdMRatPopContainer);
        if (v2Visible) {
          let tokenV2;

          if (editId) {
            tokenV2 = grecaptcha.getResponse(
              window.widgetIdEdtiMainRating[editId],
            );
          } else {
            tokenV2 = grecaptcha.getResponse(widgetIdMainRating);
          }

          if (!tokenV2) {
            loadingText.innerHTML = "Не вдалося підтвердити, що Ви не робот";

            const resetInputs = () => {
              ratingStarFormPop.style.opacity = "1";
              ratingStarFormPop.style.pointerEvents = "auto";
              loadingText.classList.remove("show");
              setTimeout(() => {
                clonePopup.remove();
              }, 250);
            };
            setTimeout(resetInputs, 500);
            button.disabled = false;
            return;
          }
          container.querySelector(`#${versionInputProdMRatPop.id}`).value =
            "v2";
          sendToken(tokenV2);
        } else {
          recaptchaRatingGlobalV3.generateToken().then((token) => {
            sendToken(token);
          });
        }
      }
    });
  }

  // Clear M Rating Button

  const fields = [
    {
      inputId: `#${inputNameProdMRatPop.id}`,
      buttonId: `#${clearButtonNameProdMRatPop.id}`,
    },
  ];

  fields.forEach(({ inputId, buttonId }) => {
    const input = container.querySelector(inputId);
    const button = container.querySelector(buttonId);

    if (!input || !button) return;

    const icon = button.querySelector(".clear-icon-popup");
    const wrapper = input.closest(".enter-ratStrPrdct-popup-CONT-input");

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
