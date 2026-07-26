// Global Store Rating functionality including pagination, sorting, and voting (Like/Dislike).
// Implements dynamic content loading and URL parameter updates.
import { initRecaptchaV3 } from "/js_main/js_global_func/global_form_seccap.js";

// Like Dislike

Object.assign(window, {
  likeGlobalStates: {},
  likeGlobalImages: {},
  dislikeGlobalStates: {},
  dislikeGlobalImages: {},
  pendingLikeDisGlobSnapshot: null,

  updateLikeGlobalNum,
  updateDislikeGlobalNum,
  updateLikeGlobalIcons,
  updateDislikeGlobalIcons,
});

function updateLikeGlobalNum(ratingGlobalId, count) {
  const likeGlobalNum = document.querySelector(
    `#likeGlobal-num_${ratingGlobalId}`,
  );
  if (likeGlobalNum) {
    likeGlobalNum.textContent = count;
  }
}

function updateDislikeGlobalNum(ratingGlobalId, count) {
  const dislikeGlobalNum = document.querySelector(
    `#dislikeGlobal-num_${ratingGlobalId}`,
  );
  if (dislikeGlobalNum) {
    dislikeGlobalNum.textContent = count;
  }
}

function updateLikeGlobalIcons(ratingGlobalId) {
  document
    .querySelectorAll(`#likeGlobalButton_${ratingGlobalId} .like-icon`)
    .forEach((icon) => {
      icon.src = likeGlobalImages[ratingGlobalId];
    });
}

function updateDislikeGlobalIcons(ratingGlobalId) {
  document
    .querySelectorAll(`#dislikeGlobalButton_${ratingGlobalId} .dislike-icon`)
    .forEach((icon) => {
      icon.src = dislikeGlobalImages[ratingGlobalId];
    });
}

let debounceLikeDisGlobTimer = null;
let pendingLikeDisGlobAction = null;

const recaptchaLikeDisGlobalV3 = initRecaptchaV3({
  siteKey: "<REPLACE_ME>",
  action: "add_like_dislike_global",
  container: document.body,
  tokenInputSelector: null,
  versionInputSelector: null,
  trackedElements: Array.from(
    document.querySelectorAll(".card, .feedback-container"),
  ),
  globalEvents: ["keydown", "scroll"],
});

function sendLikeDislikeGlobRequest({ ratingGlobalId, like, dislike }) {
  recaptchaLikeDisGlobalV3
    .generateToken()
    .then((token) => {
      const jqxhr = $.ajax({
        url: "/add_like_dislike_global",
        method: "POST",
        data: {
          ratingGlobalId,
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
          pendingLikeDisGlobAction = { ratingGlobalId, like, dislike };
          $(".popup-bg-global-recap-rat").fadeIn(300);
          $("body").css("overflow", "hidden");
          $(".popup-global-recap-rat").css({ left: "50%" });
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
  // Like Dislike Global

  function updateFeedbackButtonGlobalWidth() {
    const feedbackButtons = document.querySelectorAll(
      ".feedback-container .feedback-buttons td",
    );
    feedbackButtons.forEach((button) => {
      const ratingGlobalId = button
        .querySelector(".like-button, .dislike-button")
        ?.getAttribute("data-rating-global-id");
      if (!ratingGlobalId) return;

      const likeGlobalNumLength = String(
        likeGlobalCounts[ratingGlobalId] || 0,
      ).length;
      const dislikeGlobalNumLength = String(
        dislikeGlobalCounts[ratingGlobalId] || 0,
      ).length;
      const maxLength = Math.max(likeGlobalNumLength, dislikeGlobalNumLength);

      const baseWidth = 55;
      const additionalWidth = (maxLength - 1) * 9;
      const newWidth = baseWidth + additionalWidth;

      button.style.width = newWidth + "px";
    });

    document.querySelectorAll(".card").forEach((container) => {
      const dateElem = container.querySelector(".data-feedback");
      const buttonsTbl = container.querySelector(".feedback-buttons");
      const textTbl = container.querySelector(
        ".feedback-container .feedback-text",
      );
      if (!dateElem || !buttonsTbl || !textTbl) return;

      const dateW = dateElem.offsetWidth;
      const buttonsW = buttonsTbl.offsetWidth;
      const extra = buttonsW - (window.innerWidth * 9) / 1366;

      textTbl.style.paddingRight = extra + "px";
      dateElem.style.marginLeft = buttonsW - dateW + "px";
    });
  }

  function initializeLikeDislikeGlobalStates() {
    document
      .querySelectorAll('button[id^="likeGlobalButton_"]')
      .forEach((btn) => {
        const id = btn.getAttribute("data-rating-global-id");
        const icon = btn.querySelector(".like-icon");
        const src = icon.getAttribute("src");
        if (src.endsWith("/like_fill.svg")) {
          likeGlobalStates[id] = true;
          likeGlobalImages[id] = src;
        } else {
          likeGlobalStates[id] = false;
          likeGlobalImages[id] =
            "/images/System_Interface/feedback_control/like/like.svg";
        }
      });
    document
      .querySelectorAll('button[id^="dislikeGlobalButton_"]')
      .forEach((btn) => {
        const id = btn.getAttribute("data-rating-global-id");
        const icon = btn.querySelector(".dislike-icon");
        const src = icon.getAttribute("src");
        if (src.endsWith("/dislike_fill.svg")) {
          dislikeGlobalStates[id] = true;
          dislikeGlobalImages[id] = src;
        } else {
          dislikeGlobalStates[id] = false;
          dislikeGlobalImages[id] =
            "/images/System_Interface/feedback_control/dislike/dislike.svg";
        }
      });

    Object.keys(likeGlobalStates).forEach((id) => updateLikeGlobalIcons(id));
    Object.keys(dislikeGlobalStates).forEach((id) =>
      updateDislikeGlobalIcons(id),
    );
  }

  function handleLikeGlobalClick(button) {
    const ratingGlobalId = button.getAttribute("data-rating-global-id");

    if (!(ratingGlobalId in likeGlobalCounts))
      likeGlobalCounts[ratingGlobalId] = 0;
    if (!(ratingGlobalId in dislikeGlobalCounts))
      dislikeGlobalCounts[ratingGlobalId] = 0;

    if (dislikeGlobalStates[ratingGlobalId]) {
      dislikeGlobalCounts[ratingGlobalId]--;
      dislikeGlobalStates[ratingGlobalId] = false;
      dislikeGlobalImages[ratingGlobalId] =
        "/images/System_Interface/feedback_control/dislike/dislike.svg";
      updateDislikeGlobalNum(
        ratingGlobalId,
        dislikeGlobalCounts[ratingGlobalId],
      );
      updateDislikeGlobalIcons(ratingGlobalId);
    }

    if (likeGlobalStates[ratingGlobalId]) {
      likeGlobalCounts[ratingGlobalId]--;
      likeGlobalStates[ratingGlobalId] = false;
      likeGlobalImages[ratingGlobalId] =
        "/images/System_Interface/feedback_control/like/like.svg";
    } else {
      likeGlobalCounts[ratingGlobalId]++;
      likeGlobalStates[ratingGlobalId] = true;
      likeGlobalImages[ratingGlobalId] =
        "/images/System_Interface/feedback_control/like/like_fill.svg";
    }

    updateLikeGlobalIcons(ratingGlobalId);
    updateLikeGlobalNum(ratingGlobalId, likeGlobalCounts[ratingGlobalId]);
  }

  function handleDislikeGlobalClick(button) {
    const ratingGlobalId = button.getAttribute("data-rating-global-id");

    if (!(ratingGlobalId in likeGlobalCounts))
      likeGlobalCounts[ratingGlobalId] = 0;
    if (!(ratingGlobalId in dislikeGlobalCounts))
      dislikeGlobalCounts[ratingGlobalId] = 0;

    if (likeGlobalStates[ratingGlobalId]) {
      likeGlobalCounts[ratingGlobalId]--;
      likeGlobalStates[ratingGlobalId] = false;
      likeGlobalImages[ratingGlobalId] =
        "/images/System_Interface/feedback_control/like/like.svg";
      updateLikeGlobalNum(ratingGlobalId, likeGlobalCounts[ratingGlobalId]);
      updateLikeGlobalIcons(ratingGlobalId);
    }

    if (dislikeGlobalStates[ratingGlobalId]) {
      dislikeGlobalCounts[ratingGlobalId]--;
      dislikeGlobalStates[ratingGlobalId] = false;
      dislikeGlobalImages[ratingGlobalId] =
        "/images/System_Interface/feedback_control/dislike/dislike.svg";
    } else {
      dislikeGlobalCounts[ratingGlobalId]++;
      dislikeGlobalStates[ratingGlobalId] = true;
      dislikeGlobalImages[ratingGlobalId] =
        "/images/System_Interface/feedback_control/dislike/dislike_fill.svg";
    }

    updateDislikeGlobalIcons(ratingGlobalId);
    updateDislikeGlobalNum(ratingGlobalId, dislikeGlobalCounts[ratingGlobalId]);
  }

  document.body.addEventListener("click", (event) => {
    const likeButton = event.target.closest('button[id^="likeGlobalButton_"]');
    const dislikeButton = event.target.closest(
      'button[id^="dislikeGlobalButton_"]',
    );
    const button = likeButton || dislikeButton;
    if (!button) return;

    const ratingGlobalId = button.getAttribute("data-rating-global-id");

    pendingLikeDisGlobSnapshot = {
      ratingGlobalId,
      prevLikeState: !!likeGlobalStates[ratingGlobalId],
      prevLikeCount: likeGlobalCounts[ratingGlobalId] || 0,
      prevLikeImage:
        likeGlobalImages[ratingGlobalId] ||
        "/images/System_Interface/feedback_control/like/like.svg",
      prevDislikeState: !!dislikeGlobalStates[ratingGlobalId],
      prevDislikeCount: dislikeGlobalCounts[ratingGlobalId] || 0,
      prevDislikeImage:
        dislikeGlobalImages[ratingGlobalId] ||
        "/images/System_Interface/feedback_control/dislike/dislike.svg",
    };

    if (
      pendingLikeDisGlobAction &&
      pendingLikeDisGlobAction.ratingGlobalId !== ratingGlobalId
    ) {
      clearTimeout(debounceLikeDisGlobTimer);
      sendLikeDislikeGlobRequest(pendingLikeDisGlobAction);
      pendingLikeDisGlobAction = null;
    }

    if (button === likeButton) {
      handleLikeGlobalClick(button);
    } else {
      handleDislikeGlobalClick(button);
    }

    pendingLikeDisGlobAction = {
      ratingGlobalId,
      like: !!likeGlobalStates[ratingGlobalId],
      dislike: !!dislikeGlobalStates[ratingGlobalId],
    };

    clearTimeout(debounceLikeDisGlobTimer);
    debounceLikeDisGlobTimer = setTimeout(() => {
      sendLikeDislikeGlobRequest(pendingLikeDisGlobAction);
      pendingLikeDisGlobAction = null;
    }, 800);
  });

  document
    .querySelectorAll(".feedback-container .feedback-buttons")
    .forEach((table) => {
      table.addEventListener("mouseleave", () => {
        if (debounceLikeDisGlobTimer) {
          clearTimeout(debounceLikeDisGlobTimer);
          if (pendingLikeDisGlobAction) {
            sendLikeDislikeGlobRequest(pendingLikeDisGlobAction);
            pendingLikeDisGlobAction = null;
          }
        }
      });
    });

  updateFeedbackButtonGlobalWidth();
  initializeLikeDislikeGlobalStates();

  // Pages

  const cards = Array.from(document.querySelectorAll(".vertical-line"));

  cards.forEach((card) => card.classList.remove("hidden-line"));

  const ratingsContainer = document.getElementById("feedback-rating-star");
  const ratings = Array.from(
    ratingsContainer.querySelectorAll(".vertical-line"),
  );
  let itemsPerPage = 15;
  let currentPage = 1;
  let confirmPage = false;

  const dropdownSpan = document.getElementById("dropdown1-span-feedback");

  function updateDropdownSpanText() {
    dropdownSpan.innerHTML =
      itemsPerPage +
      '&nbsp;<img src="/images/System_Interface/dropdown_symbols/down_red.svg" alt="Dropdown" class="dropdown1-icon" style="margin-bottom: calc(100vw * 0 / 1366);">';
  }

  function renderCurrentPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    ratingsContainer.innerHTML = "";

    ratings.slice(start, end).forEach((rating) => {
      ratingsContainer.appendChild(rating);
    });
  }

  function updatePagesShown() {
    const startPage = (currentPage - 1) * itemsPerPage + 1;
    let endPage = currentPage * itemsPerPage;
    if (endPage > ratings.length) {
      endPage = ratings.length;
    }

    const totalRatings = ratings.length;
    const totalPages = Math.ceil(totalRatings / itemsPerPage);

    let pagesShown = document.querySelector(".pages-shown");
    if (!pagesShown) {
      pagesShown = document.createElement("div");
      pagesShown.className = "pages-shown";
      const paginationContainer = document.querySelector(
        ".page-number-iRatingClient",
      );
      paginationContainer.parentNode.insertBefore(
        pagesShown,
        paginationContainer.nextSibling,
      );
    }

    pagesShown.innerHTML =
      "Показано з " +
      startPage +
      " по " +
      endPage +
      " із " +
      totalRatings +
      " (всього сторінок: " +
      totalPages +
      ")";
  }

  // Dynamic pagination logic: calculates total pages, generates page buttons, and slices the review dataset.
  function createPagination() {
    const totalPages = Math.ceil(ratings.length / itemsPerPage);
    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("page-number-iRatingClient");
    paginationContainer.innerHTML = "";

    const prevMaxButton = document.createElement("button");
    prevMaxButton.classList.add("carousel-prev-max");
    prevMaxButton.innerHTML = `
            &nbsp;
            <img src="/images/System_Interface/feedback_control/feedback_prev/feedback_prev_max.svg" alt="Previous Feedback Max" class="feedback-control-icon">
            &nbsp;
        `;
    prevMaxButton.addEventListener("click", () => {
      switchPage(1);
      updateURLWithPage();
      scrollToTop();
    });

    const prevButton = document.createElement("button");
    prevButton.classList.add("carousel-prev");
    prevButton.innerHTML = `
            &nbsp;
            <img src="/images/System_Interface/feedback_control/feedback_prev/feedback_prev.svg" alt="Previous Feedback" class="feedback-control-icon">
            &nbsp;
        `;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) switchPage(currentPage - 1);
      updateURLWithPage();
      scrollToTop();
    });

    paginationContainer.appendChild(prevMaxButton);
    paginationContainer.appendChild(prevButton);

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        addPageButton(i, paginationContainer);
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        addPageButton(i, paginationContainer);
      }

      if (currentPage > 3 && currentPage <= totalPages - 6) {
        const ellipsis = createEllipsis();
        paginationContainer.appendChild(ellipsis);

        for (
          let i = currentPage;
          i < Math.min(currentPage + 4, totalPages - 2);
          i++
        ) {
          addPageButton(i, paginationContainer);
        }
      } else if (currentPage > totalPages - 6) {
        const ellipsis = createEllipsis();
        paginationContainer.appendChild(ellipsis);

        for (let i = Math.max(totalPages - 6, 4); i <= totalPages - 3; i++) {
          addPageButton(i, paginationContainer);
        }
      } else {
        for (let i = 4; i <= 7; i++) {
          addPageButton(i, paginationContainer);
        }
      }

      if (currentPage < totalPages - 2) {
        const ellipsis = createEllipsis();
        paginationContainer.appendChild(ellipsis);
      }

      for (let i = totalPages - 2; i <= totalPages; i++) {
        addPageButton(i, paginationContainer);
      }
    }

    const nextButton = document.createElement("button");
    nextButton.classList.add("carousel-next");
    nextButton.innerHTML = `
            &nbsp;
            <img src="/images/System_Interface/feedback_control/feedback_next/feedback_next.svg" alt="Next Feedback" class="feedback-control-icon">
            &nbsp;
        `;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) switchPage(currentPage + 1);
      updateURLWithPage();
      scrollToTop();
    });

    const nextMaxButton = document.createElement("button");
    nextMaxButton.classList.add("carousel-next-max");
    nextMaxButton.innerHTML = `
            &nbsp;
            <img src="/images/System_Interface/feedback_control/feedback_next/feedback_next_max.svg" alt="Next Feedback Max" class="feedback-control-icon">
            &nbsp;
        `;
    nextMaxButton.addEventListener("click", () => {
      switchPage(totalPages);
      updateURLWithPage();
      scrollToTop();
    });

    paginationContainer.appendChild(nextButton);
    paginationContainer.appendChild(nextMaxButton);

    const existingPagination = document.querySelector(
      ".page-number-iRatingClient",
    );
    if (existingPagination) {
      existingPagination.replaceWith(paginationContainer);
    } else {
      ratingsContainer.parentNode.appendChild(paginationContainer);
    }
  }

  function addPageButton(page, container) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page;
    pageButton.classList.add("page-number-feedback");
    if (page === currentPage) {
      pageButton.classList.add("page-number-active");
    }
    pageButton.addEventListener("click", () => {
      switchPage(page);
      updateURLWithPage();
      scrollToTop();
      confirmPage = true;
    });
    container.appendChild(pageButton);
  }

  function createEllipsis() {
    const ellipsis = document.createElement("button");
    ellipsis.textContent = "...";
    ellipsis.classList.add("three-dots");
    ellipsis.disabled = true;
    return ellipsis;
  }

  function switchPage(page) {
    currentPage = page;
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    ratings.forEach((rating, idx) => {
      if (idx >= startIdx && idx < endIdx) {
        rating.style.display = "block";
      } else {
        rating.style.display = "none";
      }
    });

    renderCurrentPage();
    createPagination();
    updatePagesShown();
    updatePaginationButtons();
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function updatePaginationButtons() {
    const paginationButtons = document.querySelectorAll(
      ".page-number-feedback",
    );
    const prevMaxButton = document.querySelector(".carousel-prev-max");
    const prevButton = document.querySelector(".carousel-prev");
    const nextButton = document.querySelector(".carousel-next");
    const nextMaxButton = document.querySelector(".carousel-next-max");
    paginationButtons.forEach((button) => {
      const pageNumber = parseInt(button.textContent, 10);
      if (pageNumber === currentPage) {
        button.classList.add("page-number-active");
      } else {
        button.classList.remove("page-number-active");
      }
    });

    if (currentPage === 1) {
      if (prevMaxButton) prevMaxButton.style.display = "none";
      if (prevButton) prevButton.style.display = "none";
    } else {
      if (prevMaxButton) prevMaxButton.style.display = "inline-flex";
      if (prevButton) prevButton.style.display = "inline-flex";
    }

    const totalPages = Math.ceil(ratings.length / itemsPerPage);
    if (currentPage === totalPages) {
      if (nextButton) nextButton.style.display = "none";
      if (nextMaxButton) nextMaxButton.style.display = "none";
    } else {
      if (nextButton) nextButton.style.display = "inline-flex";
      if (nextMaxButton) nextMaxButton.style.display = "inline-flex";
    }
  }

  function updateURLWithPage() {
    const url = new URL(window.location.href);
    url.searchParams.set("page", currentPage);
    window.history.pushState(null, "", url.toString());
  }

  function updateURLEmptyPage() {
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.pushState(null, "", url.toString());
  }

  function updateSortingParameter() {
    let currentUrl = new URL(window.location.href);
    let sortingValue = currentUrl.searchParams.get("sorting");
    if (sortingValue && sortingValue !== "new" && sortingValue !== "old") {
      currentUrl.searchParams.set("sorting", "new");
      window.history.replaceState({}, "", currentUrl.toString());
      updateURLEmptyPage();
    }
  }

  function getURLParameter(name) {
    const url = window.location.pathname + window.location.search;
    const regex = new RegExp("[/?&]" + name + "=([^/?&]*)");
    const match = url.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function updateLimitParameter(newLimit) {
    const currentUrl = new URL(window.location.href);
    let path = currentUrl.pathname;

    if (path.match(/\/limit=[^/?&]*/)) {
      path = path.replace(/\/limit=[^/?&]*/, "/limit=" + newLimit);
    } else {
      path += "/limit=" + newLimit;
    }

    currentUrl.pathname = path;
    window.history.replaceState({}, "", currentUrl.toString());
  }

  const urlLimit = getURLParameter("limit");
  const urlPage = getURLParameter("page");

  if (urlLimit) {
    if (parseInt(urlLimit, 10) <= 100) {
      itemsPerPage = parseInt(urlLimit, 10) || 15;
    } else {
      itemsPerPage = 15;
      currentPage = 1;
      switchPage(currentPage);
      updateURLEmptyPage();
    }
    confirmPage = true;
    updateLimitParameter(itemsPerPage);
    updateDropdownSpanText();
  }

  const totalRatingsURL = ratings.length;
  const totalPagesURL = Math.ceil(totalRatingsURL / itemsPerPage);

  if (urlPage) {
    if (urlPage <= totalPagesURL) {
      currentPage = parseInt(urlPage, 10) || 1;
    } else {
      currentPage = 1;
      switchPage(currentPage);
      updateURLEmptyPage();
    }
  }

  function initPagination() {
    ratings.forEach((rating) => (rating.style.display = "none"));
    switchPage(currentPage);
    createPagination();
    updatePaginationButtons();
    updatePagesShown();
    updateSortingParameter();
  }

  const dropdownButtons = document.querySelectorAll(
    "#dropdown1-content-feedback button",
  );
  dropdownButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      itemsPerPage = parseInt(button.value, 10);
      updateDropdownSpanText();
      initPagination();
    });
  });

  // Regroups DOM elements in the review list based on selected sorting criteria (e.g., newest or oldest first).
  function sortRatings(order) {
    ratings.sort((a, b) => {
      const dateA = new Date(a.getAttribute("data-date"));
      const dateB = new Date(b.getAttribute("data-date"));
      return order === "new" ? dateB - dateA : dateA - dateB;
    });

    ratings.forEach((rating) => {
      rating.style.display = "block";
    });

    initPagination();
  }

  document
    .getElementById("button-sort-new")
    .addEventListener("click", () => sortRatings("new"));
  document
    .getElementById("button-sort-old")
    .addEventListener("click", () => sortRatings("old"));

  dropdownSpan.addEventListener("click", function () {
    const dropdownContent = document.getElementById(
      "dropdown1-content-feedback",
    );
    dropdownContent.classList.toggle("show");
  });

  const dropdown1Buttons = document.querySelectorAll(
    "#dropdown1-content-feedback button",
  );
  const dropdown2Buttons = document.querySelectorAll(
    "#dropdown2-content-feedback button",
  );

  let selectedLimit = null;
  let selectedSort = null;

  function updateURL() {
    const url = new URL(window.location.href);

    if (selectedLimit) {
      const limitPath = "/limit=" + selectedLimit;
      if (!url.pathname.includes(limitPath)) {
        url.pathname = url.pathname.replace(/\/limit=\d+/, "");
        url.pathname += limitPath;
      }
    }

    if (selectedSort) {
      url.searchParams.set("sorting", selectedSort);
    }

    if (!url.searchParams.has("page") && confirmPage) {
      url.searchParams.set("page", currentPage);
    }

    window.history.pushState(null, "", url.toString());
  }

  dropdown1Buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      switchPage(1);
      event.preventDefault();
      selectedLimit = button.value;
      updateURL();
      updateURLEmptyPage();
    });
  });

  dropdown2Buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      switchPage(1);
      event.preventDefault();
      selectedSort = button.value;
      updateURL();
      updateURLEmptyPage();
    });
  });

  function updateDropdownActiveClasses() {
    const url = new URL(window.location.href);
    let limitParam = url.pathname.match(/\/limit=(\d+)/);
    let sortParam = url.searchParams.get("sorting");

    if (!limitParam || !limitParam[1]) {
      limitParam = ["", itemsPerPage];
    }

    if (!sortParam) {
      sortParam = "new";
    }

    document.querySelectorAll(".dropdown1-content button").forEach((button) => {
      button.style.backgroundColor = "";
      button.style.color = "";
    });

    if (limitParam && limitParam[1]) {
      const limitValue = limitParam[1];
      const limitButton = document.querySelector(
        "#list-feedback-" + limitValue,
      );
      if (limitButton) {
        limitButton.style.backgroundColor = "#e9ecef";
        limitButton.style.color = "#ef233c";
      }
    }

    if (sortParam) {
      const sortButton = document.querySelector("#button-sort-" + sortParam);
      if (sortButton) {
        sortButton.style.backgroundColor = "#e9ecef";
        sortButton.style.color = "#ef233c";
      }
    }
  }

  function observeURLChanges(callback) {
    let lastURL = window.location.href;

    const observer = new MutationObserver(() => {
      const currentURL = window.location.href;
      if (currentURL !== lastURL) {
        lastURL = currentURL;
        callback();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener("load", () => {
    updateDropdownActiveClasses();
    observeURLChanges(updateDropdownActiveClasses);
  });

  updateDropdownSpanText();
  initPagination();

  window.ratings = ratings;
  window.initPagination = initPagination;

  toggleMoreButton();
  window.addEventListener("resize", toggleMoreButton);
});
