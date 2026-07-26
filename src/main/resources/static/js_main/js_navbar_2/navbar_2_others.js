document.querySelectorAll(".button-like").forEach(function (element) {
  element.addEventListener("mousedown", function () {
    element.style.color = "#ef233c";
  });

  element.addEventListener("mouseup", function () {
    setTimeout(function () {
      element.style.color = "";
    }, 200);
  });

  element.addEventListener("mouseleave", function () {
    element.style.color = "#be303b";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Search
  const searchButton = document.getElementById("search-button");
  const searchContainer = document.getElementById("search-container");
  const cancelButton = document.getElementById("cancel-button");
  const searchInput = document.getElementById("search-input");
  const searchIcon = document.getElementById("search-icon");
  let searchReady = false;

  function animateErase() {
    const text = searchInput.value;
    let length = text.length;

    const eraseText = () => {
      if (length > 0) {
        searchInput.value = text.substring(0, --length);
      } else {
        clearInterval(interval);
      }
    };

    const interval = setInterval(eraseText, 15);

    hideSearchContainer(() => {
      clearInterval(interval);
      searchInput.value = "";
    });
  }

  function hideSearchContainer(callback) {
    searchReady = false;
    searchButton.style.transform = "translateX(0)";
    searchButton.style.borderTopRightRadius = "";
    searchButton.style.borderBottomRightRadius = "";
    searchContainer.classList.add("hide");

    searchContainer.addEventListener("transitionend", function handler() {
      searchContainer.classList.remove("visible");
      searchResultsContainer.innerHTML = "";
      searchResultsContainer.style.opacity = "0";

      searchContainer.removeEventListener("transitionend", handler);

      if (typeof callback === "function") {
        callback();
      }
    });
  }

  searchButton.addEventListener("click", function () {
    const searchInputValue = searchInput.value.trim();

    if (searchContainer.classList.contains("visible")) {
      if (searchReady && searchInputValue) {
        window.location.href = `/search/${encodeURIComponent(searchInputValue)}`;
      }
      return;
    }

    const searchButtonHeight = $("#search-button").outerHeight();
    const searchButtonWidth = $("#search-button").outerWidth();
    $("#search-container").css("height", searchButtonHeight + 0.5 + "px");

    const searchContainerWidth = searchContainer.offsetWidth;
    const searchButtonRect = searchButton.getBoundingClientRect();
    const cartButtonRect = document
      .getElementById("cart-button")
      .getBoundingClientRect();
    const distanceButtons = cartButtonRect.right - searchButtonRect.left;
    const translateX =
      searchContainerWidth - distanceButtons + searchButtonWidth;

    searchContainer.classList.remove("hide");
    searchContainer.classList.add("visible");
    searchContainer.style.borderTopLeftRadius = "calc(100vw * 0 / 1366)";
    searchContainer.style.borderBottomLeftRadius = "calc(100vw * 0 / 1366)";
    searchButton.style.transform = "translateX(-" + translateX + "px)";
    searchButton.style.borderTopRightRadius = "calc(100vw * 0 / 1366)";
    searchButton.style.borderBottomRightRadius = "calc(100vw * 0 / 1366)";

    const handler = () => {
      searchReady = true;
      searchContainer.removeEventListener("transitionend", handler);
    };
    searchContainer.addEventListener("transitionend", handler);
  });

  document
    .getElementById("search-input")
    .addEventListener("keypress", function (event) {
      const searchInputValue = event.target.value.trim();
      if (event.key === "Enter" && searchReady && searchInputValue) {
        window.location.href = `/search/${encodeURIComponent(searchInputValue)}`;
      }
    });

  cancelButton.addEventListener("click", function () {
    animateErase();
  });

  document.addEventListener("mousedown", function (event) {
    if (searchContainer.classList.contains("visible")) {
      if (
        !searchContainer.contains(event.target) &&
        event.target !== searchButton &&
        event.target !== searchIcon &&
        event.target !== searchButton.querySelector("img")
      ) {
        hideSearchContainer(() => {});
      }
    }
  });

  /**
   * ============================================================================
   * FEATURE: Live Search & E-Commerce Interactive State
   * ============================================================================
   * 1. Live Search: Intercepts text input to filter the product catalog in real-time
   *    and dynamically renders a dropdown list of matching results.
   * 2. Cart/Favorites State: Manages product arrays in Local Storage and updates
   *    header UI counters without page reloads.
   */
  const allOptics = window.allOptics || [];
  const searchResultsContainer = document.getElementById("search-results");
  /**
   * Event handler for Live Search. Implements transliteration mapping to process
   * localized queries, filters the dataset, and builds DOM nodes for the results.
   */
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();
    searchResultsContainer.innerHTML = "";

    if (query.length === 0) {
      searchResultsContainer.style.opacity = "0";
      return;
    }

    const filtered = allOptics.filter((optic) =>
      optic.fullName.toLowerCase().includes(query),
    );

    if (filtered.length === 0) {
      searchResultsContainer.style.opacity = "0";
    } else {
      searchResultsContainer.style.opacity = "1";
    }

    filtered.slice(0, 20).forEach((optic) => {
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

      const matchLatinPart = optic.fullName.match(/[A-Za-z].*$/);
      const latinPart = matchLatinPart ? matchLatinPart[0] : "";

      const div = document.createElement("div");
      div.classList.add("search-result-item");

      const img = document.createElement("img");
      img.src = optic.fullPathImage1;
      img.alt = optic.fullName;
      img.classList.add("search-result-img");

      const textBlock = document.createElement("div");
      textBlock.innerHTML = `${optic.category}<br>${latinPart}`;

      div.appendChild(img);
      div.appendChild(textBlock);

      div.addEventListener("click", () => {
        let viewed = JSON.parse(localStorage.getItem("viewedOptics")) || [];

        const opticId = String(optic.id);

        viewed = viewed.filter((id) => id !== opticId);
        viewed.unshift(opticId);

        if (viewed.length > 10) {
          viewed = viewed.slice(0, 10);
        }

        localStorage.setItem("viewedOptics", JSON.stringify(viewed));

        window.location.href =
          "/products/" + transliterateUkrainianToEnglish(optic.fullName);
      });
      searchResultsContainer.appendChild(div);
    });
  });

  // Heart Button Logic
  /**
   * Favorites (Wishlist) Manager: Iterates over product cards, syncs active states
   * from Local Storage, and attaches event listeners for toggle operations.
   */
  const heartButtons = document.querySelectorAll('[id^="heartButton_"]');
  let heartNum = document.querySelector(".heart-num");

  let heartOpticIds = JSON.parse(localStorage.getItem("heartOpticIds")) || [];

  let heartCount = heartOpticIds.length;
  let heartStates = {};
  let heartImages = {};

  heartOpticIds.forEach((id) => {
    heartStates[id] = true;
    heartImages[id] = "/images/System_Interface/card/heart/heart_red.svg";
  });

  heartButtons.forEach((button) => {
    const opticId = button.getAttribute("data-optic-heart-id");
    const icon = button.querySelector(".heart-icon");

    if (heartStates[opticId]) {
      icon.src = heartImages[opticId];
    }

    button.addEventListener("click", function () {
      const isActive = heartOpticIds.includes(opticId);

      if (isActive) {
        heartOpticIds = heartOpticIds.filter((id) => id !== opticId);
        updateAllButtons(opticId, false);
      } else {
        heartOpticIds.push(opticId);
        updateAllButtons(opticId, true);
      }

      localStorage.setItem("heartOpticIds", JSON.stringify(heartOpticIds));
      updateHeartNum(heartOpticIds.length);

      const colElement = document.getElementById(
        `optic-favorites-col_${opticId}`,
      );

      if (colElement) {
        colElement.classList.add("fade-out-favorites");

        colElement.addEventListener("animationend", function handler() {
          colElement.style.display = "none";
          colElement.classList.remove("fade-out-favorites");
          colElement.removeEventListener("animationend", handler);
        });
      }
    });
  });

  function updateAllButtons(opticId, isActive) {
    const allMatchingButtons = document.querySelectorAll(
      `[data-optic-heart-id="${opticId}"]`,
    );
    allMatchingButtons.forEach((btn) => {
      const icon = btn.querySelector(".heart-icon");
      icon.src = isActive
        ? "/images/System_Interface/card/heart/heart_red.svg"
        : "/images/System_Interface/card/heart/heart.svg";
    });
  }

  function updateHeartNum(count) {
    heartNum.textContent = count;
    if (count === 0) {
      heartNum.classList.remove("show");
      heartNum.classList.add("hide");
    } else {
      heartNum.classList.remove("hide");
      heartNum.classList.add("show");
    }
  }

  updateHeartNum(heartCount);
  heartOpticIds.forEach((id) => {
    const favCol = document.getElementById(`optic-favorites-col_${id}`);
    if (favCol) {
      favCol.style.display = "block";
    }
  });

  // Cart Button Logic
  const cartButtons = document.querySelectorAll('[id^="cart-card_"]');
  let cartNum = document.querySelector(".cart-card-num");

  let cartOpticIds = JSON.parse(localStorage.getItem("cartOpticIds")) || [];

  let uniqueIds = [...new Set(cartOpticIds)];
  let cartCount = uniqueIds.length;

  cartButtons.forEach((button) => {
    if (button.classList.contains("bottom-icon-non-availability")) {
      return;
    }

    const opticId = button.getAttribute("data-optic-cart-id");

    if (cartOpticIds.includes(opticId)) {
      button.classList.add("active");
    }

    button.addEventListener("click", function () {
      const itemCount = cartOpticIds.filter((id) => id === opticId).length;

      if (itemCount < 16) {
        cartOpticIds.push(opticId);
        button.classList.add("active");

        cartCount = [...new Set(cartOpticIds)].length;

        updateCartNum(cartCount);
        localStorage.setItem("cartOpticIds", JSON.stringify(cartOpticIds));
      }
    });
  });

  function updateCartNum(count) {
    cartNum.textContent = count;
    if (count === 0) {
      cartNum.classList.remove("show");
      cartNum.classList.add("hide");
    } else {
      cartNum.classList.remove("hide");
      cartNum.classList.add("show");
    }
  }

  const idCounts = {};
  cartOpticIds.forEach((id) => {
    idCounts[id] = (idCounts[id] || 0) + 1;
  });

  Object.entries(idCounts).forEach(([id, count]) => {
    const colElement = document.getElementById(`col-byCart_${id}`);
    if (colElement) {
      colElement.style.display = "block";
    }

    const inputElement = document.getElementById(
      `main-cart-productQuantity-input_${id}`,
    );
    if (inputElement) {
      inputElement.value = count;
    }
  });

  updateCartNum(cartCount);
});
