function getScrollbarWidth() {
  const scrollbarTester = document.createElement("div");
  scrollbarTester.style.width = "100px";
  scrollbarTester.style.height = "100px";
  scrollbarTester.style.overflow = "scroll";
  scrollbarTester.style.position = "absolute";
  scrollbarTester.style.top = "-9999px";
  document.body.appendChild(scrollbarTester);

  const scrollbarWidth =
    scrollbarTester.offsetWidth - scrollbarTester.clientWidth;

  document.body.removeChild(scrollbarTester);

  return scrollbarWidth;
}

let scrollbarWidth = getScrollbarWidth();

function toggleFamilRulCheckbox(element) {
  const square = element.querySelector(".check-familiar-rules-square");
  if (square.classList.contains("active")) {
    square.classList.remove("active");
    square.style.backgroundColor = "";
    if (square.querySelector("img")) {
      square.querySelector("img").remove();
    }
  } else {
    square.classList.add("active");
    square.style.backgroundColor = "#be303b";
    const checkImage = document.createElement("img");
    checkImage.src = "/images/System_Interface/check.svg";
    checkImage.alt = "Checked";
    square.appendChild(checkImage);
  }
}

// On Recaptcha Load Callback

let widgetIdRegister;
let widgetIdReportAvail;
let widgetIdMainRating;
let widgetIdLikeDisGlob;
let widgetIdLikeDis;
let widgetIdQuestAnswer = {};
let widgetIdProductRating = {};

function onRecaptchaLoadCallback() {
  const requiredWidgetIdRegister = document.getElementById(
    "required-popup-field-register-g-recaptcha",
  );
  const requiredWidgetIdReportAvail = document.getElementById(
    "required-popup-field-report-avail-g-recaptcha",
  );
  const requiredWidgetIdMainRating = document.getElementById(
    "required-popup-field-m-rating-g-recaptcha",
  );
  const requiredWidgetIdLikeDisGlob = document.getElementById(
    "required-popup-field-global-recap-rat-g-recaptcha",
  );
  const requiredWidgetIdLikeDis = document.getElementById(
    "required-popup-field-recap-rat-g-recaptcha",
  );

  if (requiredWidgetIdRegister) {
    window.recaptchaSuccessCallbackPopRegister = function () {
      requiredWidgetIdRegister.style.opacity = "1";
      requiredWidgetIdRegister.style.visibility = "hidden";
    };

    widgetIdRegister = grecaptcha.render("register-popup-g-recaptcha", {
      sitekey: "<REPLACE_ME>",
      callback: recaptchaSuccessCallbackPopRegister,
    });
  }

  if (requiredWidgetIdReportAvail) {
    window.recaptchaSuccessCallbackPopReportAvail = function () {
      requiredWidgetIdReportAvail.style.opacity = "1";
      requiredWidgetIdReportAvail.style.visibility = "hidden";
    };

    widgetIdReportAvail = grecaptcha.render("report-avail-popup-g-recaptcha", {
      sitekey: "<REPLACE_ME>",
      callback: recaptchaSuccessCallbackPopReportAvail,
    });
  }

  if (requiredWidgetIdMainRating) {
    window.recaptchaSuccessCallbackPopMainRating = function () {
      requiredWidgetIdMainRating.style.opacity = "1";
      requiredWidgetIdMainRating.style.visibility = "hidden";
    };

    widgetIdMainRating = grecaptcha.render("m-rating-popup-g-recaptcha", {
      sitekey: "<REPLACE_ME>",
      callback: recaptchaSuccessCallbackPopMainRating,
    });
  }

  if (requiredWidgetIdLikeDisGlob) {
    window.recaptchaSuccessCallbackPopLikeDisGlob = function () {
      requiredWidgetIdLikeDisGlob.style.opacity = "1";
      requiredWidgetIdLikeDisGlob.style.visibility = "hidden";

      var tokenV2 = grecaptcha.getResponse(widgetIdLikeDisGlob);
      if (pendingLikeDisGlobAction && tokenV2) {
        var action = pendingLikeDisGlobAction;

        setTimeout(() => {
          $(".popup-bg-global-recap-rat").fadeOut(300);
          $("body").css("overflow", "auto");
          $(".popup-global-recap-rat").css({
            left: `calc(50% + ${scrollbarWidth / 2}px)`,
          });
          $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
        }, 600);
        setTimeout(() => {
          grecaptcha.reset(widgetIdLikeDisGlob);
        }, 900);

        $.ajax({
          url: "/add_like_dislike_global",
          method: "POST",
          data: {
            ratingGlobalId: action.ratingGlobalId,
            like: action.like,
            dislike: action.dislike,
            "g-recaptcha-response": tokenV2,
            version: "v2",
          },
          success: function (response) {
            if (!response.success) {
              alert(response.error || "Помилка при обробці лайку/дизлайку");
            }
          },
          error: function () {
            alert("Сталася помилка при обробці лайку/дизлайку");
          },
        });
        pendingLikeDisGlobAction = null;
      }
    };

    widgetIdLikeDisGlob = grecaptcha.render(
      "global-recap-rat-popup-g-recaptcha",
      {
        sitekey: "<REPLACE_ME>",
        callback: recaptchaSuccessCallbackPopLikeDisGlob,
      },
    );
  }

  if (requiredWidgetIdLikeDis) {
    window.recaptchaSuccessCallbackPopLikeDis = function () {
      requiredWidgetIdLikeDis.style.opacity = "1";
      requiredWidgetIdLikeDis.style.visibility = "hidden";

      var tokenV2 = grecaptcha.getResponse(widgetIdLikeDis);
      if (pendingLikeDisAction && tokenV2) {
        var action = pendingLikeDisAction;

        setTimeout(() => {
          $(".popup-bg-recap-rat").fadeOut(300);
          $("body").css("overflow", "auto");
          $(".popup-recap-rat").css({
            left: `calc(50% + ${scrollbarWidth / 2}px)`,
          });
          $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
        }, 600);
        setTimeout(() => {
          grecaptcha.reset(widgetIdLikeDis);
        }, 900);

        $.ajax({
          url: "/add_like_dislike",
          method: "POST",
          data: {
            ratingId: action.ratingId,
            like: action.like,
            dislike: action.dislike,
            "g-recaptcha-response": tokenV2,
            version: "v2",
          },
          success: function (response) {
            if (!response.success) {
              alert(response.error || "Помилка при обробці лайку/дизлайку");
            }
          },
          error: function () {
            alert("Сталася помилка при обробці лайку/дизлайку");
          },
        });
        pendingLikeDisAction = null;
      }
    };

    widgetIdLikeDis = grecaptcha.render("recap-rat-popup-g-recaptcha", {
      sitekey: "<REPLACE_ME>",
      callback: recaptchaSuccessCallbackPopLikeDis,
    });
  }

  document
    .querySelectorAll('[id^="required-field-quean-g-recaptcha_"]')
    .forEach((emptyGRecaptchaProdQuean) => {
      const opticId = emptyGRecaptchaProdQuean.id.split("_").pop();
      const containerId = `quean-g-recaptcha_${opticId}`;
      const gRecaptchaContainer = document.getElementById(containerId);

      if (!gRecaptchaContainer) return;

      widgetIdQuestAnswer[opticId] = grecaptcha.render(containerId, {
        sitekey: "<REPLACE_ME>",
        callback: function () {
          if (
            isVisible(gRecaptchaContainer) &&
            isVisible(emptyGRecaptchaProdQuean)
          ) {
            hideMessageQuean(emptyGRecaptchaProdQuean);
          }
        },
      });
    });

  document
    .querySelectorAll('[id^="required-field-m-rating-g-recaptcha_"]')
    .forEach((emptyGRecaptchaProdMRat) => {
      const opticId = emptyGRecaptchaProdMRat.id.split("_").pop();
      const containerId = `m-rating-g-recaptcha_${opticId}`;
      const gRecaptchaContainer = document.getElementById(containerId);

      if (!gRecaptchaContainer) return;

      widgetIdProductRating[opticId] = grecaptcha.render(containerId, {
        sitekey: "<REPLACE_ME>",
        callback: function () {
          if (
            isVisible(gRecaptchaContainer) &&
            isVisible(emptyGRecaptchaProdMRat)
          ) {
            hideMessageProductMRaring(emptyGRecaptchaProdMRat);
          }
        },
      });
    });
}

window.addEventListener("load", function () {
  grecaptcha.ready(function () {
    grecaptcha.execute("<REPLACE_ME>", {
      action: "footer",
    });
  });

  var badge = document.querySelector(".grecaptcha-badge");
  var container = document.getElementById("recaptcha-container");
  if (badge && container) {
    container.appendChild(badge);

    badge.style.position = "absolute";
    badge.style.bottom = "0";
    badge.style.left = "0";
    badge.style.margin = "0";
    badge.style.opacity = "1";
  }
});

function isVisible(el) {
  if (!el) return false;
  return window.getComputedStyle(el).display !== "none";
}

function animateShow(element, col) {
  if (!element) return;

  let card;
  let cloneTransparent;

  if (col) {
    card = col.querySelector(".card");
    cloneTransparent = col.querySelector(".clone-transparent");
  }

  element.classList.add("dropdown-animation-capha");
  element.style.display = "flow-root";
  element.style.overflow = "hidden";
  element.style.height = "0px";
  element.style.opacity = "0";

  const clone = element.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.width = element.getBoundingClientRect().width + "px";
  document.body.appendChild(clone);

  const targetHeight = clone.getBoundingClientRect().height;
  document.body.removeChild(clone);

  requestAnimationFrame(() => {
    element.style.height = `${targetHeight}px`;
    element.style.opacity = "1";

    if (card && cloneTransparent) {
      const cloneTransparentHeight =
        cloneTransparent.getBoundingClientRect().height;
      const currentH =
        parseFloat(card.style.height) || card.getBoundingClientRect().height;

      const additionalHeight = (window.innerWidth * 40) / 1366;
      const transperTargetHeight =
        cloneTransparentHeight + targetHeight + additionalHeight;
      const heightDiff = transperTargetHeight - currentH;

      if (heightDiff > 0) {
        card.style.height = `${currentH + heightDiff}px`;
      }
    }
  });

  element.addEventListener("transitionend", function cb(e) {
    if (e.propertyName === "height") {
      element.style.height = "auto";
      element.style.overflow = "";
      element.removeEventListener("transitionend", cb);
    }
  });
}

function animateHide(element) {
  const clone = element.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.width = element.getBoundingClientRect().width + "px";
  document.body.appendChild(clone);

  const startHeight = clone.getBoundingClientRect().height;
  document.body.removeChild(clone);

  element.style.display = "flow-root";
  element.style.overflow = "hidden";
  element.style.height = startHeight + "px";
  element.style.opacity = "1";
  element.classList.add("dropdown-animation-capha");

  requestAnimationFrame(() => {
    element.style.height = "0px";
    element.style.opacity = "0";
  });

  element.addEventListener("transitionend", function cb(e) {
    if (e.propertyName === "height") {
      element.style.display = "none";
      element.style.height = "";
      element.style.overflow = "";
      element.classList.remove("dropdown-animation-capha");
      element.removeEventListener("transitionend", cb);
    }
  });
}

// Edit & Delete Feedback

function measureAutoHeight(el) {
  const clone = el.cloneNode(true);
  clone.style.height = "auto";
  clone.style.visibility = "hidden";
  clone.style.position = "absolute";
  clone.style.zIndex = "-1";
  el.parentElement.appendChild(clone);

  const height = clone.getBoundingClientRect().height;
  clone.remove();
  return height;
}

function handleCancel(
  buttonEl,
  cloneContainer,
  origCard,
  actionButton,
  cloneCard,
  cancelMs,
) {
  buttonEl.disabled = true;

  if (origCard) {
    origCard.style.pointerEvents = "none";
  }
  if (cloneCard) {
    cloneCard.style.pointerEvents = "none";
  }

  const targetCol = buttonEl.closest(".col");
  const transitionSpec = `height ${cancelMs}ms ease, opacity ${cancelMs}ms ease`;

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;

    if (origCard) {
      origCard.style.transition = "";
      origCard.style.height = "";
      origCard.style.pointerEvents = "auto";
      origCard.style.opacity = "1";
    }
    if (cloneCard && cloneCard.parentNode) {
      cloneCard.remove();
    }
    if (actionButton) {
      actionButton.disabled = false;
    }
  };

  const safetyTimer = setTimeout(cleanup, (cancelMs || 300) + 600);

  const onWrapperFade = (e) => {
    if (e.target !== cloneContainer) return;
    cloneContainer.removeEventListener("transitionend", onWrapperFade);

    if (origCard) {
      origCard.style.transition = transitionSpec;
      origCard.style.opacity = "1";
      origCard.style.height = `${measureAutoHeight(origCard)}px`;

      const ended = new Set();
      const onShrink = (ev) => {
        if (ev.target !== origCard) return;
        const p = ev.propertyName;
        if (p !== "height" && p !== "opacity") return;

        ended.add(p);
        if (ended.has("height") && ended.has("opacity")) {
          origCard.removeEventListener("transitionend", onShrink);

          origCard.style.transition = "";
          origCard.style.height = "";
          origCard.style.pointerEvents = "auto";

          const finish = () => {
            clearTimeout(safetyTimer);
            cleanup();
          };

          if (targetCol) {
            const onOutEnd = (animEv) => {
              if (animEv.target !== targetCol) return;
              targetCol.removeEventListener("animationend", onOutEnd);
              finish();
            };
            targetCol.addEventListener("animationend", onOutEnd);
            setTimeout(finish, 400);
          } else {
            finish();
          }
        }
      };

      origCard.addEventListener("transitionend", onShrink);
    } else {
      clearTimeout(safetyTimer);
      cleanup();
    }
  };

  cloneContainer.addEventListener("transitionend", onWrapperFade);
  cloneContainer.classList.remove("show");
}

function getSmallestColIndex(scopeOrSelector, prefix) {
  const root =
    typeof scopeOrSelector === "string"
      ? document.getElementById(scopeOrSelector) ||
        document.querySelector(scopeOrSelector) ||
        document
      : scopeOrSelector || document;

  const allCols = Array.from(root.querySelectorAll(`[id^="${prefix}"]`));
  let minNum = Infinity;
  let minId = null;
  const regex = new RegExp(`^${prefix}(-?\\d+)$`);

  for (const col of allCols) {
    const id = col.id;
    const match = id.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num < minNum) {
        minNum = num;
        minId = id;
      }
    }
  }
  return minId;
}
window.getSmallestColIndex = getSmallestColIndex;

// More Content

function toggleMoreForElement(el) {
  const card = el.closest(".card-container");
  if (!card) return false;

  const feedbackContainer =
    el.closest(".feedback-container") ||
    el.closest(".ratStarPrdctFeed-feedback-container");
  const feedbackButtons = feedbackContainer?.querySelector(".feedback-buttons");

  const moreMax = card.querySelector(".more-content-feedback-container-MAX");

  moreMax.style.display = "";

  if (el.scrollHeight > el.clientHeight) {
    moreMax.style.display = "block";
    if (feedbackContainer && feedbackButtons) {
      feedbackContainer.style.marginBottom = "calc(100vw * 13 / 1366)";

      if (
        feedbackContainer.classList.contains(
          "ratStarPrdctFeed-feedback-container",
        )
      ) {
        feedbackButtons.style.marginBottom = "3.25%";
      } else {
        feedbackButtons.style.marginBottom = "3.1%";
      }
    }
    return true;
  }

  return false;
}

function toggleMoreBySelector(selector) {
  const list = document.querySelectorAll(selector);
  let anyShown = false;

  list.forEach((el) => {
    if (toggleMoreForElement(el)) {
      anyShown = true;
    }
  });

  return anyShown;
}

function toggleMoreButton() {
  return toggleMoreBySelector(
    ".feedback-text-global, .ratStarPrdctFeed-feedback-text, .questAnswFeed-feedback-text",
  );
}

function createMoreMax(newId) {
  const moreMax = document.createElement("div");
  moreMax.className = "more-content-feedback-container-MAX";

  const moreInner = document.createElement("div");
  moreInner.className = "more-content-feedback-container";
  moreInner.style.background = `
        linear-gradient(
            to top,
            rgba(244, 245, 247, 1)   0%,
            rgba(244, 245, 247, 0.8) 50%,
            rgba(244, 245, 247, 0)   100%
        )
    `;

  const moreBtn = document.createElement("button");
  moreBtn.className = "more-content-feedback-button";
  moreBtn.id = `more-content-feedback-button_${newId}`;
  moreBtn.innerHTML = `
        <img
            src="/images/System_Interface/feedback_control/more_content.svg"
            alt="More Content Feedback Button"
        >
        <span class="gradient-hover"></span>
        <span class="gradient-active"></span>
    `;

  moreBtn.addEventListener("click", function () {
    toggleMoreContentFeedback(this);
  });

  moreInner.appendChild(moreBtn);
  moreMax.appendChild(moreInner);

  return moreMax;
}

function toggleMoreContentFeedback(btn) {
  const col = btn.closest(".col");
  if (!col) {
    console.warn("Не знайдено .col для кнопки", btn);
    return;
  }

  const card = col.querySelector(".card");
  if (!card) {
    console.warn("Не знайдено .card всередині .col", col);
    return;
  }

  const suffix = btn.id.split("_")[1];
  const idGlobal = `feedback-text-global_${suffix}`;
  const idAlt = `ratStarPrdctFeed-feedback-text_${suffix}`;
  const idQuest = `questAnswFeed-feedback-text_${suffix}`;

  const textEl =
    document.getElementById(idGlobal) ||
    document.getElementById(idAlt) ||
    document.getElementById(idQuest);
  const img = btn.querySelector("img");
  if (!textEl || !img) return;

  const willExpand = !textEl.classList.contains("more-content");
  const startHeight = textEl.getBoundingClientRect().height;

  textEl.classList.toggle("more-content", willExpand);
  img.classList.toggle("mirror-vertical", willExpand);

  const targetTextHeight = measureAutoHeight(textEl);
  const targetCardHeight = measureAutoHeight(card);

  textEl.style.overflow = "hidden";
  textEl.style.height = `${startHeight}px`;
  textEl.style.transition = `height 300ms ease`;

  card.style.overflow = "hidden";

  requestAnimationFrame(() => {
    textEl.style.height = `${targetTextHeight}px`;
  });

  const onEnd = (e) => {
    if (e.propertyName === "height") {
      textEl.style.height = "";
      textEl.style.transition = "";
      textEl.style.overflow = "";
      card.style.overflow = "";
      textEl.removeEventListener("transitionend", onEnd);
    }
  };
  textEl.addEventListener("transitionend", onEnd);

  return targetCardHeight;
}

function toggleMoreContentFeedbackInstant(btn) {
  const col = btn.closest(".col");
  if (!col) {
    console.warn("Не знайдено .col для кнопки", btn);
    return;
  }

  const card = col.querySelector(".card");
  if (!card) {
    console.warn("Не знайдено .card всередині .col", col);
    return;
  }

  const suffix = btn.id.split("_")[1];
  const idGlobal = `feedback-text-global_${suffix}`;
  const idAlt = `ratStarPrdctFeed-feedback-text_${suffix}`;
  const idQuest = `questAnswFeed-feedback-text_${suffix}`;

  const textEl =
    document.getElementById(idGlobal) ||
    document.getElementById(idAlt) ||
    document.getElementById(idQuest);
  const img = btn.querySelector("img");
  if (!textEl || !img) return;

  const willExpand = !textEl.classList.contains("more-content");

  textEl.classList.toggle("more-content", willExpand);
  img.classList.toggle("mirror-vertical", willExpand);

  textEl.style.transition = "none";
  textEl.style.height = "";
  textEl.style.overflow = "";
  card.style.overflow = "";

  return card.getBoundingClientRect().height;
}
