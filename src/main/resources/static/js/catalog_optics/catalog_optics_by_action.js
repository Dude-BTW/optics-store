/**
 * E-commerce Catalog Initialization:
 * Establishes DOM references and maps the initial product array for client-side state manipulation.
 * Forms the client-side foundation for the platform's Server-Side Rendering (SSR) hybrid approach.
 */
const opticsByGroupContainer = document.getElementById("all-optics-byGroup");
const opticsByGroup = Array.from(
  opticsByGroupContainer.querySelectorAll(".card-byGroup"),
);
let filteredOptics = [...opticsByGroup];
let itemsPerPage = 28;
let currentPage = 1;
let confirmPage = false;
let confirmPageURL = false;
let confirmSort = false;

const dropdownSpan = document.getElementById("dropdown1-span-feedback");

/**
 * Dynamic DOM Render Engine:
 * Executes high-performance UI updates by rendering only the exact slice of products
 * needed for the active page index, bypassing heavy full-page server reloads.
 */
function renderCurrentPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, filteredOptics.length);
  opticsByGroupContainer.innerHTML = "";

  filteredOptics.slice(start, end).forEach((optic) => {
    opticsByGroupContainer.appendChild(optic);
  });
  if (filteredOptics.slice(start, end).length === 0 && currentPage > 1) {
    switchPage(1);
  }
}

function switchPage(page) {
  const totalPages = Math.ceil(filteredOptics.length / itemsPerPage);
  if (page < 1) {
    currentPage = 1;
  } else if (page > totalPages) {
    currentPage = totalPages;
  } else {
    currentPage = page;
  }
  renderCurrentPage();
  updatePaginationButtons();
}

/**
 * Interactive Pagination Component Generator:
 * Programmatically constructs the navigation UI (buttons, dynamic ellipses) based on active data volume.
 * Scales dynamically whether the query yields 10 or 10,000 records.
 */
function createPagination() {
  const totalPages = Math.ceil(filteredOptics.length / itemsPerPage);
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
      paginationContainer.appendChild(createEllipsis());
      for (
        let i = currentPage;
        i < Math.min(currentPage + 4, totalPages - 2);
        i++
      ) {
        addPageButton(i, paginationContainer);
      }
    } else if (currentPage > totalPages - 6) {
      paginationContainer.appendChild(createEllipsis());
      for (let i = Math.max(totalPages - 6, 4); i <= totalPages - 3; i++) {
        addPageButton(i, paginationContainer);
      }
    } else {
      for (let i = 4; i <= 7; i++) {
        addPageButton(i, paginationContainer);
      }
    }
    if (currentPage < totalPages - 2) {
      paginationContainer.appendChild(createEllipsis());
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

  const paginationTarget = document.getElementById("pagination-container");
  paginationTarget.innerHTML = "";
  paginationTarget.appendChild(paginationContainer);
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

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function updatePaginationButtons() {
  const paginationButtons = document.querySelectorAll(".page-number-feedback");
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

  const totalPages = Math.ceil(filteredOptics.length / itemsPerPage);
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
  window.history.pushState(null, "", movePageToEnd(url));
}

function updateURLEmptyPage() {
  const url = new URL(window.location.href);
  url.searchParams.delete("page");
  window.history.pushState(null, "", url.toString());
}

function initPagination() {
  filteredOptics = [...opticsByGroup];
  recalculatePagination();
  renderCurrentPage();
}

/**
 * Faceted Search Control (Global Reset):
 * Purges all active filter states (brand, material, shape), resets UI checkboxes,
 * and triggers a complete DOM re-render of the unfiltered dataset.
 */
function clearAllFilters() {
  Object.keys(activeFilters).forEach((filterType) => {
    activeFilters[filterType].clear();
  });

  const allCheckboxes = document.querySelectorAll(
    ".check-custom .check-square",
  );
  allCheckboxes.forEach((square) => {
    square.classList.remove("active");
    square.style.backgroundColor = "";
    if (square.querySelector("img")) {
      square.querySelector("img").remove();
    }
  });

  updateURLWithFilters();
  updateGroupDisplay();
  filterOptics();
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card-byGroup"));

  cards.forEach((card) => card.classList.remove("hidden-line"));

  const totalPages = Math.ceil(filteredOptics.length / itemsPerPage);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("page")) {
    let page = parseInt(urlParams.get("page"), 10);
    if (!isNaN(page)) {
      if (page > totalPages) {
        page = 1;
        confirmPageURL = true;
        switchPage(page);
        updateURLEmptyPage();
      } else {
        confirmPageURL = true;
        switchPage(page);
      }
    }
  }

  const clearFilterButton = document.getElementById(
    "clear-filter-button-group",
  );
  clearFilterButton.addEventListener("click", clearAllFilters);

  function applySelectedStyle(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.backgroundColor = "#e9ecef";
      element.style.color = "#ef233c";
    }
  }

  const opticsSizes = [
    "new",
    "promotional",
    "top",
    "cheaper",
    "expensive",
    "alphabetical",
  ];
  const currentSorting = urlParams.get("sorting");

  if (currentSorting && !opticsSizes.includes(currentSorting)) {
    urlParams.set("sorting", "new");
    const newUrl = window.location.pathname + "?" + urlParams.toString();
    window.history.replaceState({}, "", newUrl);
    updateURLEmptyPage();
  }

  const dropdownContentSortingOptics = document.getElementById(
    "dropdown-content-sortingOptics",
  );
  const dropdownSpanSortingOptics = document.getElementById(
    "dropdown-span-sortingOptics",
  );

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

  const filters = document.querySelectorAll(".drop-down-filter2.show");
  filters.forEach((filter) => {
    filter.style.transition =
      "max-height 0.005s ease, opacity 0.005s ease, padding 0.005s ease, margin 0.005s ease";
  });

  const activators = document.querySelectorAll(".drop-down-activator");

  activators.forEach((activator) => {
    const filter = activator.nextElementSibling;
    const icon = activator.querySelector(".toggle-icon");
    activator.addEventListener("click", function () {
      const isOpen = filter.classList.contains("show");

      filter.style.transition =
        "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease, margin 0.3s ease";

      if (isOpen) {
        filter.classList.remove("show");
        icon.src = "/images/System_Interface/plus/plus.svg";
        filter.style.maxHeight = "0";
        filter.style.opacity = "0";
      } else {
        filter.classList.add("show");
        icon.src = "/images/System_Interface/minus/minus.svg";
        filter.style.maxHeight = filter.scrollHeight + "px";
        filter.style.opacity = "1";
      }
    });
  });

  const titleElement = document.querySelector(".title-clnOptics");

  if (titleElement) {
    const lineHeight = parseFloat(getComputedStyle(titleElement).lineHeight);

    function updateTextAlignment() {
      const elementHeight = titleElement.getBoundingClientRect().height;

      const computedStyle = getComputedStyle(titleElement);
      const lineHeight = parseFloat(computedStyle.lineHeight);

      if (elementHeight > lineHeight) {
        titleElement.style.textAlign = "center";
      } else {
        titleElement.style.textAlign = "left";
      }
    }

    updateTextAlignment();

    const resizeObserver = new ResizeObserver(updateTextAlignment);
    resizeObserver.observe(titleElement);
  }
  initPagination();
});

window.addEventListener("load", function () {
  var dropdownSorting = document.querySelectorAll(
    ".dropdown1-feedback .dropdown1",
  );
  dropdownSorting.forEach(function (dropdown) {
    var spanSorting = dropdown.querySelector("#dropdown-span-sortingOptics");
    var contentSorting = dropdown.querySelector(
      "#dropdown-content-sortingOptics",
    );
    if (spanSorting && contentSorting) {
      contentSorting.style.width = spanSorting.offsetWidth + "px";
    }
  });

  var dropdownContent = document.getElementById(
    "dropdown-content-sortingOptics",
  );
  var buttons = dropdownContent.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.scrollWidth > button.clientWidth) {
      var words = button.innerText.split(" ");
      var lastWord = words.pop();
      button.innerHTML = words.join(" ") + "<br>" + lastWord;
    }
  });
});

/**
 * Advanced Search State Management (Faceted Search):
 * Houses the complex multi-parameter tracking object core to the filtering system.
 * Accumulates concurrent arrays of selected parameters across multiple product categories.
 */
const activeFilters = {
  brand: new Set(),
  manufacturer: new Set(),
  gender: new Set(),
  country: new Set(),
  material: new Set(),
  eyeglass: new Set(),
  colorName1: new Set(),
  colorName2: new Set(),
  polarization: new Set(),
  frameShape: new Set(),
  faceShape: new Set(),
  frameType: new Set(),
  eyepieceSize: new Set(),
  earringSize: new Set(),
  bridgeSize: new Set(),
  photochrome: new Set(),
  collection: new Set(),
  properties: new Set(),
  clipOn: new Set(),
};

/**
 * Client-Side Filter Interception Handler:
 * Binds to UI element events, mutates the global activeFilters state in memory,
 * and cascades the delta down to the URL router and rendering engine.
 */
function toggleCheckbox(element) {
  event.stopPropagation();
  const square = element.querySelector(".check-square");
  const filterType = element
    .closest(".drop-down-filter2")
    .id.replace("filter-", "");
  const filterValue = element.getAttribute("data-originalByGroup-option");

  if (square.classList.contains("active")) {
    square.classList.remove("active");
    square.style.backgroundColor = "";
    if (square.querySelector("img")) {
      square.querySelector("img").remove();
    }
    activeFilters[filterType].delete(filterValue);
  } else {
    square.classList.add("active");
    square.style.backgroundColor = "#be303b";
    const checkImage = document.createElement("img");
    checkImage.src = "/images/System_Interface/check.svg";
    checkImage.alt = "Checked";
    square.appendChild(checkImage);
    activeFilters[filterType].add(filterValue);
  }

  updateURLWithFilters();
  updateGroupDisplay();
  filterOptics();
  updateURLEmptyPage();
}

/**
 * Transliteration & Routing Helper:
 * Parses Cyrillic characters to Latin formats to generate safe, clean, and SEO-optimized
 * URL parameters mapping to active filter states.
 */
function transliterateUkrainianToEnglish(text) {
  const transliterationMap = {
    А: "a",
    Б: "b",
    В: "v",
    Г: "h",
    Д: "d",
    Е: "e",
    Є: "ie",
    Ж: "zh",
    З: "z",
    И: "y",
    І: "i",
    Ї: "i",
    Й: "i",
    К: "k",
    Л: "l",
    М: "m",
    Н: "n",
    О: "o",
    П: "p",
    Р: "r",
    С: "s",
    Т: "t",
    У: "u",
    Ф: "f",
    Х: "kh",
    Ц: "ts",
    Ч: "ch",
    Ш: "sh",
    Щ: "shch",
    Ю: "iu",
    Я: "ia",
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    д: "d",
    е: "e",
    є: "ie",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ю: "iu",
    я: "ia",
  };

  const cleanedText = text.replace(/[ьъЬЪ]/g, "");
  return cleanedText
    .split("")
    .map((char) => transliterationMap[char] || char)
    .join("")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function updateURLWithFilters() {
  const currentPath = window.location.pathname;
  const basePath = "/aktsiini_tovary";
  const baseUrl = window.location.origin + basePath;

  const filters = [];
  Object.keys(activeFilters).forEach((filterType) => {
    if (activeFilters[filterType].size > 0) {
      filters.push(
        ...Array.from(activeFilters[filterType]).map((option) =>
          transliterateUkrainianToEnglish(option),
        ),
      );
    }
  });

  const filtersPath = filters.join("-");
  let newUrl = filtersPath ? `${baseUrl}/${filtersPath}` : baseUrl;
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("sorting")) {
    const sortingValue = urlParams.get("sorting");
    newUrl += newUrl.includes("?") ? "&" : "?" + "sorting=" + sortingValue;
  }

  if (urlParams.has("page")) {
    urlParams.delete("page");
    newUrl += newUrl.includes("?") ? "&" : "?" + "page=" + currentPage;
  }

  window.history.pushState({}, "", movePageToEnd(new URL(newUrl)));
}

function movePageToEnd(url) {
  const params = new URLSearchParams(url.search);
  if (params.has("page")) {
    const pageValue = params.get("page");
    params.delete("page");
    params.append("page", pageValue);
  }
  url.search = params.toString();
  return url.toString();
}

function updateDynamicQuantity() {
  let dynamicQuantity = filteredOptics.reduce((total, optic) => {
    const quantity = parseFloat(optic.dataset.topQuantity) || 0;
    return total + quantity;
  }, 0);
  document.getElementById("dynamicQuantity").textContent =
    dynamicQuantity.toLocaleString();
}

function recalculatePagination() {
  const totalPages = Math.ceil(filteredOptics.length / itemsPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages || 1;
  }
  createPagination();
  updatePaginationButtons();
}

function filterOptics() {
  filteredOptics = opticsByGroup.filter((optic) => {
    return Object.keys(activeFilters).every((filterType) => {
      if (activeFilters[filterType].size === 0) return true;
      const opticData = optic.dataset[filterType];
      return activeFilters[filterType].has(opticData);
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const currentSorting = urlParams.get("sorting") || "new";
  sortOptics(currentSorting);
  updateDynamicQuantity();
  recalculatePagination();
  if (confirmPageURL) {
    switchPage(currentPage);
  } else {
    switchPage(1);
  }
}

var filterDisplayNames = {
  brand: "Бренд",
  manufacturer: "Виробник",
  gender: "Гендер",
  country: "Країна",
  material: "Матеріал",
  eyeglass: "Лінза",
  colorName1: "Колір оправи",
  colorName2: "Колір лінз",
  polarization: "Поляризація",
  frameShape: "Форма оправи",
  faceShape: "Форма обличчя",
  frameType: "Вип оправи",
  eyepieceSize: "Розмір окуляра",
  earringSize: "Розмір завушника",
  bridgeSize: "Розмір мостика",
  photochrome: "Фотохром",
  collection: "Колекція",
  properties: "Властивості",
  clipOn: "CLIP-ON",
};

function updateGroupDisplay() {
  let displayText = "Акційні товари";
  const filters = [];

  const genderFilterElements = Array.from(
    document.querySelectorAll("#filter-gender .check-custom"),
  );
  const uniqueGenderValues = Array.from(
    new Set(
      genderFilterElements
        .map((el) => el.getAttribute("data-originalByGroup-option"))
        .filter((val) => val && val.trim() !== ""),
    ),
  );

  Object.keys(activeFilters).forEach((filterType) => {
    if (filterType === "gender") {
      if (uniqueGenderValues.length <= 1) return;
    }
    if (activeFilters[filterType].size > 0) {
      const filterTypeName = filterDisplayNames[filterType];
      const options = Array.from(activeFilters[filterType]).map(
        (option) =>
          document.getElementById(
            "filterType-" + filterTypeName + "&filter-" + option,
          ).textContent,
      );

      filters.push(
        filterTypeName +
          " - " +
          options.map((option) => option.trim()).join(", "),
      );
    }
  });

  if (filters.length > 0) {
    displayText += " " + filters.map((filter) => filter.trim()).join(", ");
  }
  const groupDisplayElement = document.getElementById("group-display");
  groupDisplayElement.textContent = displayText;
}

function activateCheckboxesFromURL() {
  const urlPath = window.location.pathname;
  const filtersSegment = urlPath.replace("/aktsiini_tovary/", "");
  const filters = filtersSegment.split("-");
  const unmatchedFilters = new Set(filters);

  document.querySelectorAll(".check-custom").forEach((checkbox) => {
    const transliterateOption = checkbox.getAttribute(
      "data-originalByGroup-transliterateOption",
    );
    const groupFilter = checkbox.getAttribute("data-group-filter");

    const genderFilterElements = Array.from(
      document.querySelectorAll("#filter-gender .check-custom"),
    );
    const uniqueGenderValues = Array.from(
      new Set(
        genderFilterElements
          .map((el) => el.getAttribute("data-originalByGroup-option"))
          .filter((val) => val && val.trim() !== ""),
      ),
    );

    if (filters.includes(transliterateOption)) {
      unmatchedFilters.delete(transliterateOption);
      const square = checkbox.querySelector(".check-square");
      if (!square.classList.contains("active")) {
        square.classList.add("active");
        square.style.backgroundColor = "#be303b";
        const checkImage = document.createElement("img");
        checkImage.src = "/images/System_Interface/check.svg";
        checkImage.alt = "Checked";
        square.appendChild(checkImage);
        const filterType = checkbox
          .closest(".drop-down-filter2")
          .id.replace("filter-", "");
        activeFilters[filterType].add(
          checkbox.getAttribute("data-originalByGroup-option"),
        );
        const dropDownFilter = checkbox.closest(".drop-down-filter2");

        if (groupFilter != "gender" && uniqueGenderValues.length >= 1) {
          if (!dropDownFilter.classList.contains("show")) {
            dropDownFilter.classList.add("show");
          }
        }
      }
    }
  });

  if (unmatchedFilters.size > 0) {
    clearAllFilters();
    updateURLEmptyPage();
  }
  updateGroupDisplay();
  filterOptics();
}

window.addEventListener("load", activateCheckboxesFromURL);
function setActiveSortingButton() {
  const urlParams = new URLSearchParams(window.location.search);
  const sorting = urlParams.get("sorting") || "new";

  function applyActiveStyle(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add("active");
      button.style.color = "#ef233c";
      button.style.backgroundColor = "#e9ecef";
    }
  }

  function clearActiveStyles() {
    document
      .querySelectorAll("#dropdown-content-sortingOptics button")
      .forEach((button) => {
        button.classList.remove("active");
        button.style.color = "";
        button.style.backgroundColor = "";
      });
  }

  clearActiveStyles();
  const buttonId = `button-sort-` + sorting;
  applyActiveStyle(buttonId);
}

function setConfirmSortAndSort(sortCriteria) {
  confirmSort = true;
  resetSorting();
  sortOptics(sortCriteria);
  updateURLEmptyPage();
}

function resetSorting() {
  filteredOptics = opticsByGroup.filter((optic) => {
    return Object.keys(activeFilters).every((filterType) => {
      if (activeFilters[filterType].size === 0) return true;
      const opticData = optic.dataset[filterType];
      return activeFilters[filterType].has(opticData);
    });
  });
}

/**
 * Client-Side Data Sorting Module:
 * Reorders active product layout in the DOM based on user-selected criteria
 * (promotional tags, price structures, top-rated) without executing asynchronous requests.
 */
function sortOptics(sortCriteria) {
  const baseUrl = window.location.pathname;
  let filtersPath = baseUrl.split("/aktsiini_tovary")[1] || "";
  let newUrl = window.location.origin + `/aktsiini_tovary` + filtersPath;

  if (confirmSort) {
    newUrl += `?sorting=` + sortCriteria;
    switchPage(1);
  }

  if (confirmPage) {
    const url = new URL(newUrl);
    url.searchParams.set("page", currentPage);
    newUrl = movePageToEnd(url);
  }

  if (confirmSort || confirmPage) {
    window.history.pushState({}, "", newUrl);
  }

  filteredOptics.sort((a, b) => {
    const opticA = a.querySelector(".card-title").textContent.trim();
    const opticB = b.querySelector(".card-title").textContent.trim();
    let valueA, valueB;
    switch (sortCriteria) {
      case "new":
        valueA = parseInt(a.dataset.id);
        valueB = parseInt(b.dataset.id);
        return valueB - valueA;
      case "promotional":
        valueA = parseFloat(a.dataset.action) || 0;
        valueB = parseFloat(b.dataset.action) || 0;
        return (valueB !== 0 ? 1 : 0) - (valueA !== 0 ? 1 : 0);
      case "top":
        valueA = a.dataset.top === "true" ? 0 : 1;
        valueB = b.dataset.top === "true" ? 0 : 1;
        return valueA - valueB;
      case "cheaper":
        const retailPriceA = parseFloat(a.dataset.price);
        const retailPriceB = parseFloat(b.dataset.price);
        const actionA = parseFloat(a.dataset.action) || 0;
        const actionB = parseFloat(b.dataset.action) || 0;
        valueA =
          actionA !== 0 ? retailPriceA * (1 - actionA / 100) : retailPriceA;
        valueB =
          actionB !== 0 ? retailPriceB * (1 - actionB / 100) : retailPriceB;
        return valueA - valueB;
      case "expensive":
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const actA = parseFloat(a.dataset.action) || 0;
        const actB = parseFloat(b.dataset.action) || 0;
        valueA = actA !== 0 ? priceA * (1 - actA / 100) : priceA;
        valueB = actB !== 0 ? priceB * (1 - actB / 100) : priceB;
        return valueB - valueA;
      case "alphabetical":
        return opticA.localeCompare(opticB);
    }
  });
  renderCurrentPage();
  recalculatePagination();
  setActiveSortingButton();
}
