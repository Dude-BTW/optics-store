import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";

/**
 * ============================================================================
 * FEATURE: Asynchronous CRUD Operations for User Feedback
 * ============================================================================
 * Centralized controller for Update and Delete workflows (Reviews and Q&A).
 * Intercepts UI triggers, presents confirmation dialogs, executes AJAX requests,
 * integrates Google reCAPTCHA v2/v3 tokens for anti-bot protection, and dynamically
 * mutates the DOM tree to reflect state changes without full page reloads.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Remove

  const configs = {
    global: {
      prefix: "delete-feedback-rating-star_",
      wrapperSelector: "#feedback-rating-star",
      url: "/remove_rating_global",
      action: "remove_rating_global",
      recaptchaContainerId: "remove-global-rating-popup-g-recaptcha-container_",
      recaptchaPopupId: "remove-global-rating-popup-g-recaptcha_",
      tokenInputPrefix: "recaptchaTokenRemoveRating_",
      versionInputPrefix: "recaptchaVersionRemoveRating_",
      requiredFieldId: "required-popup-field-remove-global-rating-g-recaptcha_",
      paramName: "ratingGlobalId",
    },
    product: {
      prefix: "delete-feedback-rating-star-product_",
      wrapperSelector: '[id^="feedback-rating-star-product_"]',
      url: "/remove_rating",
      action: "remove_rating",
      recaptchaContainerId: "remove-rating-popup-g-recaptcha-container_",
      recaptchaPopupId: "remove-rating-popup-g-recaptcha_",
      tokenInputPrefix: "recaptchaTokenRemoveRating_",
      versionInputPrefix: "recaptchaVersionRemoveRating_",
      requiredFieldId: "required-popup-field-remove-rating-g-recaptcha_",
      paramName: "ratingId",
    },
    questionAnswer: {
      prefix: "delete-feedback-question-answer_",
      wrapperSelector: '[id^="feedback-question-answer_"]',
      url: "/remove_question_answer",
      action: "remove_question_answer",
      recaptchaContainerId:
        "remove-question-answer-popup-g-recaptcha-container_",
      recaptchaPopupId: "remove-question-answer-popup-g-recaptcha_",
      tokenInputPrefix: "recaptchaTokenRemoveQuestionAnswer_",
      versionInputPrefix: "recaptchaVersionRemoveQuestionAnswer_",
      requiredFieldId:
        "required-popup-field-remove-question-answer-g-recaptcha_",
      paramName: "questionAnswerId",
    },
  };

  function detectType(buttonId) {
    return (
      Object.keys(configs).find((key) =>
        buttonId.startsWith(configs[key].prefix),
      ) || null
    );
  }

  /**
   * Universal Delete Handler: Detects the entity type (Global Rating, Product Rating, Q&A),
   * renders a cloned transparent node for confirmation, handles reCAPTCHA validation,
   * and animates the DOM removal upon successful server response.
   */
  function handleDeleteFeedback(event, buttonDelete) {
    event.preventDefault();
    buttonDelete.disabled = true;

    const type = detectType(buttonDelete.id);
    if (!type) return;
    const cfg = configs[type];
    const deleteId = buttonDelete.id.slice(cfg.prefix.length);
    const wrapperClass =
      type === "global" ? "vertical-line" : "vertical-lineMINI";

    const col = buttonDelete.closest(`${cfg.wrapperSelector} .col`);
    const wrapper = buttonDelete.closest(
      `${cfg.wrapperSelector} .${wrapperClass}`,
    );
    const cardContainer = buttonDelete.closest(
      `${cfg.wrapperSelector} .card-container`,
    );
    const card = buttonDelete.closest(`${cfg.wrapperSelector} .card`);
    const feedbackTextMoreContent = card.querySelector(
      ".feedback-text-global, .ratStarPrdctFeed-feedback-text, .questAnswFeed-feedback-text",
    );
    const moreContentFeedbackButton = cardContainer.querySelector(
      ".more-content-feedback-button",
    );

    if (
      !col ||
      !wrapper ||
      !card ||
      !cardContainer ||
      !feedbackTextMoreContent ||
      !moreContentFeedbackButton
    )
      return;

    let moreBABAM = false;

    const initialCardHeight = card.getBoundingClientRect().height;
    card.style.transition = "opacity 300ms";
    card.style.opacity = "0.2";
    card.style.pointerEvents = "none";
    moreContentFeedbackButton.style.pointerEvents = "none";

    const cloneCard = cardContainer.cloneNode(false);
    cloneCard.classList.add("clone-transparent");
    const cloneCardContainer = document.createElement("div");
    cloneCardContainer.className = "clone-card-container";

    cloneCardContainer.innerHTML = `
            <div class="delete-text" id="delete-text_${deleteId}">
                Ви впевнені, що хочете видалити свій відгук?
            </div>
            <div style="display: flex; justify-content: center; gap: calc(100vw * 20 / 1366); margin-top: 0;">
                <button id="card-cont-delete-yes_${deleteId}" class="card-cont-delete-yes">ТАК</button>
                <button id="card-cont-delete-no_${deleteId}" class="card-cont-delete-no">НІ</button>
            </div>
            <div id="${cfg.recaptchaContainerId + deleteId}"
                style="display: none; width: fit-content; margin: calc(100vw * 20 / 1366) auto 0;">
                <input type="hidden" id="${cfg.tokenInputPrefix + deleteId}" name="g-recaptcha-response">
                <input type="hidden" id="${cfg.versionInputPrefix + deleteId}" name="recaptchaVersion">
                <div id="${cfg.recaptchaPopupId + deleteId}"></div>
                <p class="required-popup-field" id="${cfg.requiredFieldId + deleteId}">
                    Підтвердьте, що ви не робот
                </p>
            </div>
        `;
    cloneCard.appendChild(cloneCardContainer);
    cardContainer.parentElement.appendChild(cloneCard);
    const popupId = cfg.recaptchaPopupId + deleteId;
    window.widgetIdRemoveRating = window.widgetIdRemoveRating || {};
    window.widgetIdRemoveRating[deleteId] = grecaptcha.render(popupId, {
      sitekey: "<REPLACE_ME>",
      callback: (token) => {
        document.getElementById(
          cfg.requiredFieldId + deleteId,
        ).style.visibility = "hidden";
        document.getElementById(cfg.tokenInputPrefix + deleteId).value = token;
        document.getElementById(cfg.versionInputPrefix + deleteId).value = "v2";
      },
    });

    const recaptchaV3 = initRecaptchaV3({
      siteKey: "<REPLACE_ME>",
      action: cfg.action,
      container: cloneCardContainer,
      tokenInputSelector: `#${cfg.tokenInputPrefix + deleteId}`,
      versionInputSelector: `#${cfg.versionInputPrefix + deleteId}`,
      trackedElements: [cardContainer, cloneCard],
    });

    const extra = (window.innerWidth * 40) / 1366;
    const wrapperRect = cloneCardContainer.getBoundingClientRect();
    const targetHeight = wrapperRect.height + extra;
    card.style.height = `${initialCardHeight}px`;
    card.style.transition = "height 300ms ease, opacity 300ms ease";

    requestAnimationFrame(() => {
      let plusTimeout = 0;
      let finalTargetHeight = targetHeight;
      if (feedbackTextMoreContent.classList.contains("more-content")) {
        moreBABAM = true;
        const autoHeight = toggleMoreContentFeedback(moreContentFeedbackButton);
        plusTimeout = 300;
        finalTargetHeight = Math.max(targetHeight, autoHeight);
      }
      const needGrow = finalTargetHeight > initialCardHeight;
      if (needGrow) {
        card.style.height = `${finalTargetHeight}px`;
      }
      setTimeout(() => {
        if (needGrow) {
          const curH = parseFloat(card.style.height) || 0;
          if (Math.abs(curH - finalTargetHeight) > 0.5) {
            card.style.height = `${finalTargetHeight}px`;
          }
        }
        cloneCardContainer.classList.add("show");
        const onCloneShown = (e) => {
          if (e.target !== cloneCardContainer || e.propertyName !== "opacity")
            return;
          cloneCardContainer.removeEventListener("transitionend", onCloneShown);
          if (needGrow) {
            const curH2 = parseFloat(card.style.height) || 0;
            if (Math.abs(curH2 - finalTargetHeight) > 0.5) {
              card.style.height = `${finalTargetHeight}px`;
            }
          }
        };
        cloneCardContainer.addEventListener("transitionend", onCloneShown);
        setTimeout(() => {
          cloneCardContainer.style.width = `${cloneCardContainer.getBoundingClientRect().width}px`;
        }, 0);
      }, 200 + plusTimeout);
    });

    const yesBtn = cloneCardContainer.querySelector(
      `#card-cont-delete-yes_${deleteId}`,
    );
    const noBtn = cloneCardContainer.querySelector(
      `#card-cont-delete-no_${deleteId}`,
    );
    const req = cloneCardContainer.querySelector(
      `#${cfg.requiredFieldId + deleteId}`,
    );

    noBtn.addEventListener("click", () => {
      if (moreBABAM) {
        setTimeout(
          () => toggleMoreContentFeedback(moreContentFeedbackButton),
          250,
        );
      }
      const origCol = noBtn.closest(".col");
      const origCardContainer = origCol.querySelector(".card-container");
      const origCard = origCardContainer.querySelector(
        ".card:not(.clone-transparent)",
      );
      handleCancel(
        noBtn,
        cloneCardContainer,
        origCard,
        buttonDelete,
        cloneCard,
        300,
      );
      setTimeout(
        () => (moreContentFeedbackButton.style.pointerEvents = "auto"),
        300,
      );
    });

    yesBtn.addEventListener("click", () => {
      yesBtn.disabled = noBtn.disabled = true;
      const statusText = cloneCardContainer.querySelector(".delete-text");
      statusText.innerHTML =
        "Ваш відгук видаляється<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>";

      function sendDelete(token, ver) {
        $.ajax({
          url: cfg.url,
          method: "POST",
          data: {
            [cfg.paramName]: deleteId,
            "g-recaptcha-response": token,
            version: ver,
          },
          success(response) {
            if (!response.success) {
              statusText.textContent =
                response.error || "Помилка при видаленні відгуку";
              yesBtn.disabled = noBtn.disabled = false;
            } else {
              if (type === "global") {
                const totalCountElement =
                  document.querySelector(".total-count");
                if (totalCountElement) {
                  const current = parseInt(
                    totalCountElement.textContent.match(/\d+/)[0],
                    10,
                  );
                  totalCountElement.textContent = `Кількість відгуків ${current - 1}`;
                }
              }
              statusText.textContent = "Ваш відгук видалено";
              setTimeout(() => {
                wrapper.style.height = `${wrapper.offsetHeight}px`;
                wrapper.style.overflow = "hidden";
                requestAnimationFrame(() => {
                  wrapper.style.transition =
                    "opacity 500ms,height 500ms,margin 500ms,padding 500ms";
                  wrapper.style.opacity = "0";
                  wrapper.style.height = "0";
                  wrapper.style.margin = "0";
                  wrapper.style.padding = "0";
                  setTimeout(() => wrapper.remove(), 500);
                });
              }, 300);
            }
          },
          error(xhr) {
            if (xhr.status === 403) {
              statusText.textContent = "Не вдалося підтвердити, що Ви не робот";
              const recaptchaContainer = cloneCardContainer.querySelector(
                `#${cfg.recaptchaContainerId + deleteId}`,
              );
              animateShow(recaptchaContainer, col);
            } else {
              statusText.textContent =
                "Сталася помилка при відправленні запиту";
            }
            yesBtn.disabled = noBtn.disabled = false;
          },
        });
      }

      const v2container = document.getElementById(
        cfg.recaptchaContainerId + deleteId,
      );
      if (
        v2container &&
        window.getComputedStyle(v2container).display !== "none"
      ) {
        const tokenV2 = grecaptcha.getResponse(
          window.widgetIdRemoveRating[deleteId],
        );
        if (!tokenV2) {
          req.style.opacity = req.style.visibility = "visible";
          yesBtn.disabled = noBtn.disabled = false;
          return;
        }
        sendDelete(tokenV2, "v2");
      } else {
        recaptchaV3.generateToken().then((tokenV3) => {
          if (!tokenV3) {
            req.style.opacity = req.style.visibility = "visible";
            yesBtn.disabled = noBtn.disabled = false;
            return;
          }
          sendDelete(tokenV3, "v3");
        });
      }
    });
  }

  document.body.addEventListener("click", (event) => {
    const buttonDelete = event.target.closest(
      'button[id^="delete-feedback-rating-star_"],' +
        'button[id^="delete-feedback-rating-star-product_"],' +
        'button[id^="delete-feedback-question-answer_"]',
    );
    if (buttonDelete) handleDeleteFeedback(event, buttonDelete);
  });

  // Edit

  function generateRatingBlock(suffix, i, id) {
    return `
            <div class="mainContainerEnterPopup"
                style="text-align: right;
                        margin-left: calc(100vw * 20 / 1366);
                        margin-bottom: calc(100vw * 6 / 1366);">
            <div class="mainSkillsEnterPopup">
                <div class="mainSkillsEnterPopup" id="main-rating-enter-popup_${suffix}_${id}">
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-5_${i}_${id}"   value="5"><label for="star${suffix}-5_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-4.5_${i}_${id}" value="4.5"><label for="star${suffix}-4.5_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-4_${i}_${id}"   value="4"><label for="star${suffix}-4_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-3.5_${i}_${id}" value="3.5"><label for="star${suffix}-3.5_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-3_${i}_${id}"   value="3"><label for="star${suffix}-3_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-2.5_${i}_${id}" value="2.5"><label for="star${suffix}-2.5_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-2_${i}_${id}"   value="2"><label for="star${suffix}-2_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-1.5_${i}_${id}" value="1.5"><label for="star${suffix}-1.5_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-1_${i}_${id}"   value="1"><label for="star${suffix}-1_${i}_${id}"></label>
                <input type="radio" name="starEdit${suffix}" id="star${suffix}-0.5_${i}_${id}" value="0.5"><label for="star${suffix}-0.5_${i}_${id}"></label>
                </div>
            </div>
            </div>
        `;
  }

  document.body.addEventListener("click", function (event) {
    const buttonEdit = event.target.closest(
      'button[id^="edit-feedback-rating-star_"]',
    );
    if (!buttonEdit) return;

    event.preventDefault();
    buttonEdit.disabled = true;

    const editId = buttonEdit.id.split("edit-feedback-rating-star_")[1];

    const card = buttonEdit.closest("#feedback-rating-star .card");
    const cardContainer = buttonEdit.closest(
      "#feedback-rating-star .card-container",
    );
    const feedbackTextMoreContent = card.querySelector(".feedback-text-global");
    const moreContentContainer = cardContainer.querySelector(
      ".more-content-feedback-container-MAX",
    );
    const moreContentFeedbackButton = cardContainer.querySelector(
      ".more-content-feedback-button",
    );
    if (
      !card ||
      !cardContainer ||
      !feedbackTextMoreContent ||
      !moreContentContainer ||
      !moreContentFeedbackButton
    )
      return;

    const initialCardHeight = card.getBoundingClientRect().height;
    const computed = window.getComputedStyle(moreContentContainer).display;

    card.style.transition = "opacity 300ms";
    card.style.opacity = "0.2";
    card.style.pointerEvents = "none";
    moreContentFeedbackButton.style.pointerEvents = "none";

    const cloneCard = cardContainer.cloneNode(false);
    cloneCard.classList.add("clone-transparent");

    let html = `
            <div class="enter-ratStrPrdct-popup-container">
                <p id="update-text_${editId}" class="update-text">Редагування відгуку</p>

                <div class="enter-ratStrPrdct-popup-CONT-input">
                <input type="text" name="guestName" placeholder="Прізвище та Ім’я" class="enter-ratStrPrdct-popup-input"
                 style="margin-top: calc(100vw * 26 / 1366);" id="enter-name-popup-m-rating-input_${editId}" maxlength="255"></div>

                <button type="button" class="clear-button-popup" id="clear-button-m-rating-name-popup_${editId}" 
                 style="bottom: calc(100vw * 18 / 1366);" >
                    <img src="/images/System_Interface/close/close_tiny.svg" alt="Close" class="clear-icon-popup non-selectable">
                </button>

                <div class="enter-required-popup-field" id="not-correct-required-popup-m-rating-field-name_${editId}">
                 Прізвище та Ім’я введено невірно!</div>

                <p class="required-popup-field" id="required-popup-m-rating-field-name_${editId}"
                 style="margin-bottom: calc(100vw * -2.5 / 1366);">Обов’язкове поле</p>
            </div>
        `;

    const ratingConfigs = [
      {
        i: 1,
        id: editId,
        suffix: "Price",
        label: "Ціна",
        marginTop: "calc(100vw * 7 / 1366)",
      },
      {
        i: 2,
        id: editId,
        suffix: "ProductQuality",
        label: "Якість товару",
        marginTop: "calc(100vw * -4 / 1366)",
      },
      {
        i: 3,
        id: editId,
        suffix: "Delivery",
        label: "Доставка",
        marginTop: "calc(100vw * -4 / 1366)",
      },
      {
        i: 4,
        id: editId,
        suffix: "StoreRating",
        label: "Оцінка магазину",
        marginTop: "calc(100vw * -4 / 1366)",
      },
    ];

    ratingConfigs.forEach(({ i, id, suffix, label, marginTop }) => {
      html += `
                <div class="progress-wrapper" id="rating-progressWrapper_${i}_${id}"
                    style="margin-top: ${marginTop};">
                    <div class="rating"
                        style="text-align: left;
                                margin-right: calc(100vw * 27 / 1366);
                                margin-bottom: 0;
                                white-space: nowrap;">
                    <p class="name-rating">${label}</p>
                    </div>
                    <div class="dash-placeholder"><p class="dash"></p></div>
                    ${generateRatingBlock(suffix, i, id)}
                </div>
            `;
    });

    html += `
            <p class="required-popup-field" id="required-popup-field-rating_${editId}" style="margin-top: calc(100vw * -17.5 / 1366);">
             Оберіть кількість балів</p>

            <div class="enter-ratStrPrdct-popup-container" style="margin-top: calc(100vw * -4 / 1366);">
                <div class="enter-ratStrPrdct-popup-message-container">
                <textarea name="feedback" placeholder="Текст Вашого відгуку" class="enter-ratStrPrdct-popup-message"
                 id="enter-message-popup-m-rating-textarea_${editId}" maxlength="1000" ></textarea></div>

                <div class="enter-required-popup-field-textarea" id="not-correct-required-popup-field-m-rating-message_${editId}">
                 Повинно бути мінімум 10 символів.</div>

                <p class="required-popup-field" style="margin-bottom: calc(100vw * 10 / 1366);"
                 id="required-popup-field-m-rating-message_${editId}">Обов’язкове поле</p>
            </div>

            <div id="m-rating-popup-g-recaptcha-container_${editId}" style="display: none;">
            <div class="g-recaptcha" id="m-rating-popup-g-recaptcha_${editId}"></div>
            <p class="required-popup-field" style="margin-bottom: calc(100vw * 0 / 1366);" id="required-popup-field-m-rating-g-recaptcha_${editId}">Підтвердьте, що ви не робот</p>
            <input type="hidden" id="recaptchaTokenPopupRating_${editId}" name="recaptchaToken" value=""/>
            <input type="hidden" id="recaptchaVersionPopupRating_${editId}" name="version" value=""/>
            </div>

            <input type="hidden" name="ratingGlobalId" value="${editId}">

            <div class="feedback-actions" style="margin-bottom: calc(100vw * -7.5 / 1366); margin-top: calc(100vw * 10 / 1366);">
                <button type="submit" class="card-cont-update-button" id="card-cont-update-button_${editId}">ОНОВИТИ</button>
                <button type="button" class="card-cont-cancel-button">СКАСУВАТИ</button>
            </div>

            <style>
                .mainContainerEnterPopup .mainSkillsEnterPopup input::before {
                    content: '\f005';
                    position: absolute;
                    font-family: fontAwesome;
                    font-size: calc(100vw * 19 / 1366);
                    color: #cdced0;
                    transition: 0.5s;
                }
                .mainContainerEnterPopup .mainSkillsEnterPopup input.highlight::before {
                    color: orange;
                }
                .mainContainerEnterPopup .mainSkillsEnterPopup input.partial-highlight::before {
                    background: linear-gradient(to right, orange var(--fill-percentage), #cdced0 var(--fill-percentage));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
            </style>
        `;

    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "enter-rat-strProdct-popup-container-wrapper";

    const form = document.createElement("form");
    form.id = `ratingStarPrdctPopupEditForm_${editId}`;
    form.action = "/edit_rating_global";
    form.method = "post";
    form.style.backgroundColor = "transparent";

    const htmlWrapper = document.createElement("div");
    htmlWrapper.className =
      "enter-rat-strProdct-popup-container enter-rat-strProdct-popup-container-MAX";
    htmlWrapper.innerHTML = html;

    // Publishing Values

    form.appendChild(htmlWrapper);
    wrapperDiv.appendChild(form);
    cloneCard.appendChild(wrapperDiv);

    const numCol = buttonEdit.dataset.numCol;
    const clientName = buttonEdit.dataset.clientName;
    const feedbackText = buttonEdit.dataset.feedback;
    const accountUsed = buttonEdit.dataset.accountUsed === "true";
    const starPrice = buttonEdit.dataset.starPrice;
    const starQuality = buttonEdit.dataset.starProductQuality;
    const starDelivery = buttonEdit.dataset.starDelivery;
    const starStoreRating = buttonEdit.dataset.starStoreRating;

    const nameInput = htmlWrapper.querySelector(
      ".enter-ratStrPrdct-popup-input",
    );
    const messageTextarea = htmlWrapper.querySelector(
      `#enter-message-popup-m-rating-textarea_${editId}`,
    );

    nameInput.value = clientName;
    messageTextarea.value = feedbackText;

    const ratingsMap = {
      Price: starPrice,
      ProductQuality: starQuality,
      Delivery: starDelivery,
      StoreRating: starStoreRating,
    };

    Object.entries(ratingsMap).forEach(([suffix, value]) => {
      const selector = `input[name="starEdit${suffix}"][value="${value}"]`;
      const radio = htmlWrapper.querySelector(selector);
      if (radio) radio.checked = true;
    });

    if (accountUsed) {
      nameInput.style.backgroundColor = "#f0f2f4";
      nameInput.disabled = true;
    }

    window.widgetIdEdtiMainRating = window.widgetIdEdtiMainRating || {};
    grecaptcha.ready(function () {
      window.recaptchaSuccessCallbackPopMainRating = function () {
        const req = document.getElementById(
          `required-popup-field-m-rating-g-recaptcha_${editId}`,
        );
        req.style.opacity = "1";
        req.style.visibility = "hidden";
      };

      widgetIdEdtiMainRating[editId] = grecaptcha.render(
        `m-rating-popup-g-recaptcha_${editId}`,
        {
          sitekey: "<REPLACE_ME>",
          callback: recaptchaSuccessCallbackPopMainRating,
        },
      );
    });

    cardContainer.parentElement.appendChild(cloneCard);

    const initArgs = [
      numCol,
      editId,
      ".enter-rat-strProdct-popup-container-MAX",
      `#feedback-rating-star-col_${numCol} .clone-transparent`,
      `#feedback-rating-star-col_${numCol} .card-cont-update-button`,
      `#ratingStarPrdctPopupEditForm_${editId}`,
      "edit_rating_global",
      "Оновлення відгуку",
      "Відгук оновлено",
      "Під час оновлення відгуку сталася помилка",
      true,
    ];

    const observer = new MutationObserver((mutations, obs) => {
      const inputSections = [
        htmlWrapper.querySelector(`#enter-name-popup-m-rating-input_${editId}`),
        htmlWrapper.querySelector(
          `#enter-message-popup-m-rating-textarea_${editId}`,
        ),
        htmlWrapper.querySelector(
          `#required-popup-field-m-rating-g-recaptcha_${editId}`,
        ),
      ];
      const starSections = [
        htmlWrapper.querySelector(`#main-rating-enter-popup_Price_${editId}`),
        htmlWrapper.querySelector(
          `#main-rating-enter-popup_ProductQuality_${editId}`,
        ),
        htmlWrapper.querySelector(
          `#main-rating-enter-popup_Delivery_${editId}`,
        ),
        htmlWrapper.querySelector(
          `#main-rating-enter-popup_StoreRating_${editId}`,
        ),
      ];
      const notCorrectSections = [
        htmlWrapper.querySelector(
          `#not-correct-required-popup-m-rating-field-name_${editId}`,
        ),
        htmlWrapper.querySelector(
          `#not-correct-required-popup-field-m-rating-message_${editId}`,
        ),
      ];
      const emptySections = [
        htmlWrapper.querySelector(
          `#required-popup-m-rating-field-name_${editId}`,
        ),
        htmlWrapper.querySelector(`#required-popup-field-rating_${editId}`),
        htmlWrapper.querySelector(
          `#required-popup-field-m-rating-message_${editId}`,
        ),
        htmlWrapper.querySelector(
          `#required-popup-field-m-rating-g-recaptcha_${editId}`,
        ),
      ];

      const allReady =
        inputSections.every((i) => i) &&
        starSections.every((s) => s) &&
        notCorrectSections.every((n) => n) &&
        emptySections.every((e) => e);

      if (allReady) {
        obs.disconnect();

        try {
          window.initAllRatingPopups(...initArgs);
        } catch (err) {
          // console.warn('Immediate initAllRatingPopups failed:', err);
        }

        setTimeout(() => {
          try {
            window.initAllRatingPopups(...initArgs);
          } catch (err) {
            // console.warn('Delayed initAllRatingPopups failed:', err);
          }
        }, 200);
      }
    });

    observer.observe(htmlWrapper, {
      childList: true,
      subtree: true,
    });

    // Action & Animation

    const extra =
      computed === "block"
        ? (window.innerWidth * 70) / 1366
        : (window.innerWidth * 40) / 1366;
    const wrapperRect = htmlWrapper.getBoundingClientRect();
    const targetHeight = wrapperRect.height + extra;
    let moreBABAM = false;

    card.style.height = `${initialCardHeight}px`;
    card.style.transition = "height 300ms ease, opacity 300ms ease";

    requestAnimationFrame(() => {
      let plusTimeout = 0;
      let finalTargetHeight = targetHeight;
      if (
        !feedbackTextMoreContent.classList.contains("more-content") &&
        computed === "block"
      ) {
        toggleMoreContentFeedback(moreContentFeedbackButton);
        plusTimeout = 300;
        finalTargetHeight = Math.max(targetHeight, measureAutoHeight(card));
      }
      const needGrow = finalTargetHeight > initialCardHeight;
      if (needGrow) {
        card.style.height = `${finalTargetHeight}px`;
      }
    });

    const onExpand = (e) => {
      if (e.propertyName !== "height") return;
      card.removeEventListener("transitionend", onExpand);
      const curH = parseFloat(card.style.height) || 0;
      const extra =
        computed === "block"
          ? (window.innerWidth * 70) / 1366
          : (window.innerWidth * 40) / 1366;
      const recalced = htmlWrapper.getBoundingClientRect().height + extra;
      const finalTargetHeight = Math.max(recalced, initialCardHeight);
      if (
        finalTargetHeight > initialCardHeight &&
        Math.abs(curH - finalTargetHeight) > 0.5
      ) {
        card.style.height = `${finalTargetHeight}px`;
      }
      htmlWrapper.classList.add("show");
      wrapperDiv.classList.add("edit-bg-visible");
    };

    card.addEventListener("transitionend", onExpand);

    const cancelBtn = cloneCard.querySelector(".card-cont-cancel-button");
    cancelBtn.addEventListener("click", () => {
      const col = cancelBtn.closest(".col");
      const origCardContainer = col?.querySelector(".card-container");
      const origCard = origCardContainer?.querySelector(
        ".card:not(.clone-transparent)",
      );

      if (!col || !origCardContainer || !origCard) {
        console.warn("Не знайдено .col або оригінальної .card для cancelBtn");
        return;
      }

      wrapperDiv.classList.remove("edit-bg-visible");
      htmlWrapper.classList.remove("show");

      if (moreBABAM)
        setTimeout(() => {
          toggleMoreContentFeedback(moreContentFeedbackButton);
        }, 250);
      handleCancel(
        cancelBtn,
        htmlWrapper,
        origCard,
        buttonEdit,
        cloneCard,
        300,
      );
      setTimeout(() => {
        moreContentFeedbackButton.style.pointerEvents = "auto";
      }, 300);
    });
  });
});
