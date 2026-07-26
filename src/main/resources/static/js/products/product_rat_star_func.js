// Handles asynchronous Like/Dislike voting functionality for product reviews.
// Integrates Google reCAPTCHA V3 to protect infrastructure against automated spam attacks.
import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";

// Like Dislike

Object.assign(window, {
  likeStates: {},
  likeImages: {},
  dislikeStates: {},
  dislikeImages: {},
  pendingLikeDisSnapshot: null,

  updateLikeNum,
  updateDislikeNum,
  updateLikeIcons,
  updateDislikeIcons,
});

// UI helper functions to dynamically update the counters and icons for likes and dislikes without page reload.
function updateLikeNum(ratingId, count) {
  const likeNum = document.querySelector(`#like-num_${ratingId}`);
  if (likeNum) {
    likeNum.textContent = count;
  }
}

function updateDislikeNum(ratingId, count) {
  const dislikeNum = document.querySelector(`#dislike-num_${ratingId}`);
  if (dislikeNum) {
    dislikeNum.textContent = count;
  }
}

function updateLikeIcons(ratingId) {
  document
    .querySelectorAll(`#likeButton_${ratingId} .like-icon`)
    .forEach((icon) => {
      icon.src = likeImages[ratingId];
    });
}

function updateDislikeIcons(ratingId) {
  document
    .querySelectorAll(`#dislikeButton_${ratingId} .dislike-icon`)
    .forEach((icon) => {
      icon.src = dislikeImages[ratingId];
    });
}

let debounceLikeDisTimer = null;
let pendingLikeDisAction = null;

const recaptchaRatingV3 = initRecaptchaV3({
  siteKey: "<REPLACE_ME>",
  action: "add_like_dislike",
  container: document.body,
  tokenInputSelector: null,
  versionInputSelector: null,
  trackedElements: Array.from(
    document.querySelectorAll(".card, .feedback-container"),
  ),
  globalEvents: ["keydown", "scroll"],
});

// Asynchronous AJAX request to submit a user's vote (like/dislike).
// Handles server responses including 403 Forbidden for bot detection.
function sendLikeDislikeRequest({ ratingId, like, dislike }) {
  recaptchaRatingV3
    .generateToken()
    .then((token) => {
      const jqxhr = $.ajax({
        url: "/add_like_dislike",
        method: "POST",
        data: {
          ratingId,
          like,
          dislike,
          "g-recaptcha-response": token,
          version: "v3",
        },
      });

      jqxhr.done((resp) => {
        if (!resp.success) {
          alert(resp.error || "Помилка при обробці лайку/дизлайку");
        }
      });

      jqxhr.fail((xhr) => {
        if (xhr.status === 403) {
          pendingLikeDisAction = { ratingId, like, dislike };
          $(".popup-bg-recap-rat").fadeIn(300);
          $("body").css("overflow", "hidden");
          $(".popup-recap-rat").css({ left: "50%" });
          $(".margin-body").css("margin-right", scrollbarWidth + "px");
        } else {
          alert("Сталася помилка на сервері, спробуйте пізніше");
        }
      });
    })
    .catch((err) => {
      console.error("Recaptcha token error:", err);
      alert("Не вдалося отримати Recaptcha токен. Спробуйте ще раз.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('[id^="enter-rat-strProdct-dropdown_"]')
    .forEach((dd) => {
      dd.classList.remove("visible", "closing");
      dd.style.height = "0px";
      dd.style.visibility = "hidden";
      dd.style.pointerEvents = "none";
      dd.dataset.animating = "";

      let mask = dd.querySelector(":scope > .reveal-mask");
      if (!mask) {
        mask = document.createElement("div");
        mask.className = "reveal-mask";
        dd.appendChild(mask);
      }

      dd.dataset.hCache = String(Math.round(dd.scrollHeight || 0));
    });

  function updateFeedbackButtonWidth() {
    const feedbackButtons = document.querySelectorAll(
      ".ratStarPrdctFeed-feedback-container .feedback-buttons td",
    );
    feedbackButtons.forEach((button) => {
      const ratingId = button
        .querySelector(".like-button, .dislike-button")
        ?.getAttribute("data-rating-id");
      if (!ratingId) return;

      const likeNumLength = String(likeCounts[ratingId] || 0).length;
      const dislikeNumLength = String(dislikeCounts[ratingId] || 0).length;
      const maxLength = Math.max(likeNumLength, dislikeNumLength);

      const baseWidth = 55;
      const additionalWidth = (maxLength - 1) * 9;
      const newWidth = baseWidth + additionalWidth;

      button.style.width = newWidth + "px";
    });

    document.querySelectorAll(".card").forEach((container) => {
      const dateElem = container.querySelector(".data-feedback");
      const buttonsTbl = container.querySelector(".feedback-buttons");
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
  }

  function initializeLikeDislikeStates() {
    document.querySelectorAll('button[id^="likeButton_"]').forEach((btn) => {
      const id = btn.getAttribute("data-rating-id");
      const icon = btn.querySelector(".like-icon");
      const src = icon.getAttribute("src");
      if (src.endsWith("/like_fill.svg")) {
        likeStates[id] = true;
        likeImages[id] = src;
      } else {
        likeStates[id] = false;
        likeImages[id] =
          "/images/System_Interface/feedback_control/like/like.svg";
      }
    });
    document.querySelectorAll('button[id^="dislikeButton_"]').forEach((btn) => {
      const id = btn.getAttribute("data-rating-id");
      const icon = btn.querySelector(".dislike-icon");
      const src = icon.getAttribute("src");
      if (src.endsWith("/dislike_fill.svg")) {
        dislikeStates[id] = true;
        dislikeImages[id] = src;
      } else {
        dislikeStates[id] = false;
        dislikeImages[id] =
          "/images/System_Interface/feedback_control/dislike/dislike.svg";
      }
    });

    Object.keys(likeStates).forEach((id) => updateLikeIcons(id));
    Object.keys(dislikeStates).forEach((id) => updateDislikeIcons(id));
  }

  function handleLikeClick(button) {
    const ratingId = button.getAttribute("data-rating-id");

    if (!(ratingId in likeCounts)) likeCounts[ratingId] = 0;
    if (!(ratingId in dislikeCounts)) dislikeCounts[ratingId] = 0;

    if (dislikeStates[ratingId]) {
      dislikeCounts[ratingId]--;
      dislikeStates[ratingId] = false;
      dislikeImages[ratingId] =
        "/images/System_Interface/feedback_control/dislike/dislike.svg";
      updateDislikeNum(ratingId, dislikeCounts[ratingId]);
      updateDislikeIcons(ratingId);
    }

    if (likeStates[ratingId]) {
      likeCounts[ratingId]--;
      likeStates[ratingId] = false;
      likeImages[ratingId] =
        "/images/System_Interface/feedback_control/like/like.svg";
    } else {
      likeCounts[ratingId]++;
      likeStates[ratingId] = true;
      likeImages[ratingId] =
        "/images/System_Interface/feedback_control/like/like_fill.svg";
    }

    updateLikeIcons(ratingId);
    updateLikeNum(ratingId, likeCounts[ratingId]);
  }

  function handleDislikeClick(button) {
    const ratingId = button.getAttribute("data-rating-id");

    if (!(ratingId in likeCounts)) likeCounts[ratingId] = 0;
    if (!(ratingId in dislikeCounts)) dislikeCounts[ratingId] = 0;

    if (likeStates[ratingId]) {
      likeCounts[ratingId]--;
      likeStates[ratingId] = false;
      likeImages[ratingId] =
        "/images/System_Interface/feedback_control/like/like.svg";
      updateLikeNum(ratingId, likeCounts[ratingId]);
      updateLikeIcons(ratingId);
    }

    if (dislikeStates[ratingId]) {
      dislikeCounts[ratingId]--;
      dislikeStates[ratingId] = false;
      dislikeImages[ratingId] =
        "/images/System_Interface/feedback_control/dislike/dislike.svg";
    } else {
      dislikeCounts[ratingId]++;
      dislikeStates[ratingId] = true;
      dislikeImages[ratingId] =
        "/images/System_Interface/feedback_control/dislike/dislike_fill.svg";
    }

    updateDislikeIcons(ratingId);
    updateDislikeNum(ratingId, dislikeCounts[ratingId]);
  }

  document.body.addEventListener("click", (event) => {
    const likeButton = event.target.closest('button[id^="likeButton_"]');
    const dislikeButton = event.target.closest('button[id^="dislikeButton_"]');
    const button = likeButton || dislikeButton;
    if (!button) return;

    const ratingId = button.getAttribute("data-rating-id");

    pendingLikeDisSnapshot = {
      ratingId,
      prevLikeState: !!likeStates[ratingId],
      prevLikeCount: likeCounts[ratingId] || 0,
      prevLikeImage:
        likeImages[ratingId] ||
        "/images/System_Interface/feedback_control/like/like.svg",
      prevDislikeState: !!dislikeStates[ratingId],
      prevDislikeCount: dislikeCounts[ratingId] || 0,
      prevDislikeImage:
        dislikeImages[ratingId] ||
        "/images/System_Interface/feedback_control/dislike/dislike.svg",
    };

    if (pendingLikeDisAction && pendingLikeDisAction.ratingId !== ratingId) {
      clearTimeout(debounceLikeDisTimer);
      sendLikeDislikeRequest(pendingLikeDisAction);
      pendingLikeDisAction = null;
    }

    if (button === likeButton) {
      handleLikeClick(button);
    } else {
      handleDislikeClick(button);
    }

    pendingLikeDisAction = {
      ratingId: ratingId,
      like: !!likeStates[ratingId],
      dislike: !!dislikeStates[ratingId],
    };

    clearTimeout(debounceLikeDisTimer);
    debounceLikeDisTimer = setTimeout(() => {
      sendLikeDislikeRequest(pendingLikeDisAction);
      pendingLikeDisAction = null;
    }, 800);
  });

  document
    .querySelectorAll(".ratStarPrdctFeed-feedback-container .feedback-buttons")
    .forEach((table) => {
      table.addEventListener("mouseleave", () => {
        if (debounceLikeDisTimer) {
          clearTimeout(debounceLikeDisTimer);
          if (pendingLikeDisAction) {
            sendLikeDislikeRequest(pendingLikeDisAction);
            pendingLikeDisAction = null;
          }
        }
      });
    });

  function toggleDropdownRatStProd(id) {
    window.toggleSharedDropdownGeneric(id, {
      dropdownIdPrefix: "enter-rat-strProdct-dropdown_",
      containerIdPrefix: "ratStrPrdct-maximus-container_",
      panelSelector: ".rating-starProduct",
      closeBtnSelector: ".close-rating-starProduct-button",
      plusIconUrl: "/images/System_Interface/plus/plus_white.svg",
      closeIconUrl: "/images/System_Interface/close/close_white.svg",
      initOnce: {
        datasetKey: "ratInitDone",
        fn:
          typeof initAllRatingProduct === "function"
            ? initAllRatingProduct
            : null,
        argsBuilder: (id) => [
          "",
          "",
          ".enter-rat-strProdct-container",
          `#enter-rat-strProdct-form_${id}`,
          '[id^="report-m-rating-button_"]',
          '[id^="ratingStarPrdctForm_"]',
          "rating",
          "Надсилання відгуку",
          "Відгук надіслано",
          "Під час відправлення відгуку сталася помилка",
          false,
        ],
      },
    });
  }

  const ratingsStarsList = document.querySelectorAll(".rating-starProduct");
  const closeRatStarProdButtonList = document.querySelectorAll(
    ".close-rating-starProduct-button",
  );
  const closeRatStarProdList = document.querySelectorAll(
    ".close-rating-starProduct-p",
  );

  ratingsStarsList.forEach((ratingsStars, index) => {
    const closeRatStarProdsButton = closeRatStarProdButtonList[index];
    const closeRatStarProdsP = closeRatStarProdList[index];

    const addHoverClass = () => {
      ratingsStars.classList.add("rating-starProductHover");
      closeRatStarProdsButton?.classList.add("close-ra-sta-buttonHover");
      closeRatStarProdsP?.classList.add("close-ra-sta-pHover");
    };

    const removeHoverClass = () => {
      ratingsStars.classList.remove("rating-starProductHover");
      closeRatStarProdsButton?.classList.remove("close-ra-sta-buttonHover");
      closeRatStarProdsP?.classList.remove("close-ra-sta-pHover");
    };

    const addActiveClass = () => {
      ratingsStars.classList.add("rating-starProductActive");
      closeRatStarProdsButton?.classList.add("close-ra-sta-buttonActive");
      closeRatStarProdsP?.classList.add("close-ra-sta-pActive");
    };

    const removeActiveClass = () => {
      ratingsStars.classList.remove("rating-starProductActive");
      closeRatStarProdsButton?.classList.remove("close-ra-sta-buttonActive");
      closeRatStarProdsP?.classList.remove("close-ra-sta-pActive");
    };

    [ratingsStars, closeRatStarProdsButton, closeRatStarProdsP].forEach(
      (element) => {
        if (element) {
          element.addEventListener("mouseenter", addHoverClass);
          element.addEventListener("mouseleave", removeHoverClass);
        }
      },
    );

    [ratingsStars, closeRatStarProdsButton, closeRatStarProdsP].forEach(
      (element) => {
        if (element) {
          element.addEventListener("mousedown", addActiveClass);
          element.addEventListener("mouseup", removeActiveClass);
          element.addEventListener("mouseleave", removeActiveClass);
        }
      },
    );
  });

  window.toggleDropdownRatStProd = toggleDropdownRatStProd;
  updateFeedbackButtonWidth();
  initializeLikeDislikeStates();
});
