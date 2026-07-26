// Interactive UI components for the Product Details Page (image gallery, quantity selectors, color options).
// Matches the dynamic interface state changes described in the project architecture.
document.addEventListener("DOMContentLoaded", () => {
  // Handles switching the main product image when a thumbnail (mini-image) is clicked.
  const miniImages = document.querySelectorAll(".mini-imgTop");
  miniImages.forEach((miniImg) => {
    miniImg.addEventListener("click", () => {
      const idMatch = miniImg.id.match(/mini-imgTop-\d+_(\d+)/);
      if (!idMatch) return;

      const opticId = idMatch[1];
      const mainImg = document.getElementById(`opticImage_${opticId}`);
      const wrapper = mainImg?.parentElement;

      if (!mainImg || !wrapper.classList.contains("image-wrapper")) return;

      const allRelatedMiniImgs = document.querySelectorAll(
        `.mini-imgTop[id*="_${opticId}"]`,
      );
      allRelatedMiniImgs.forEach((img) =>
        img.classList.remove("active-mini-img"),
      );

      miniImg.classList.add("active-mini-img");

      if (mainImg.src === miniImg.src) {
        return;
      }

      const newImg = document.createElement("img");
      newImg.src = miniImg.src;
      newImg.alt = mainImg.alt;
      newImg.className = `${mainImg.className} image-transition`;

      wrapper.appendChild(newImg);

      requestAnimationFrame(() => {
        newImg.style.opacity = "1";
        mainImg.style.opacity = "0";
      });

      setTimeout(() => {
        mainImg.src = miniImg.src;
        mainImg.style.opacity = "1";
        wrapper.removeChild(newImg);
      }, 400);
    });
  });

  // Minus Plus Buttons & Quantity Inputs

  // Logic for quantity input controls (plus/minus buttons) ensuring values stay within allowed inventory limits.
  const minusButtons = document.querySelectorAll(".optics-productMinus-button");
  const plusButtons = document.querySelectorAll(".optics-productPlus-button");
  const quantityInputs = document.querySelectorAll(
    ".optics-productQuantity-input",
  );

  minusButtons.forEach((minusButton, index) => {
    const plusButton = plusButtons[index];
    const quantityInput = quantityInputs[index];
    const topQuantity = parseInt(
      minusButton.closest(".card-byCategory").dataset.topQuantity,
      10,
    );
    const maxQuantity = topQuantity > 16 ? 16 : topQuantity || 1;
    function updateButtonState() {
      const currentValue = parseInt(quantityInput.value, 10);

      minusButton.disabled = currentValue <= 1;
      plusButton.disabled = currentValue >= maxQuantity;
    }

    updateButtonState();

    minusButton.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        updateButtonState();
      }
    });

    plusButton.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value, 10);
      if (currentValue < maxQuantity) {
        quantityInput.value = currentValue + 1;
        updateButtonState();
      }
    });

    quantityInput.addEventListener("input", function () {
      let currentValue = parseInt(quantityInput.value, 10);
      if (isNaN(currentValue) || currentValue < 1) {
        currentValue = 1;
      } else if (currentValue > maxQuantity) {
        currentValue = maxQuantity;
      }
      quantityInput.value = currentValue;
      updateButtonState();
    });
  });

  $(".optics-productPlus-button").on("mouseover", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });
  $(".optics-productPlus-button").on("mouseout", function () {
    $(this).removeClass("hovered clicked");
  });
  $(".optics-productPlus-button").on("mousedown", function () {
    $(this).addClass("clicked");
  });
  $(".optics-productPlus-button").on("mouseup", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });

  $(".optics-productMinus-button").on("mouseover", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });
  $(".optics-productMinus-button").on("mouseout", function () {
    $(this).removeClass("hovered clicked");
  });
  $(".optics-productMinus-button").on("mousedown", function () {
    $(this).addClass("clicked");
  });
  $(".optics-productMinus-button").on("mouseup", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });

  // Color Buttons

  // Dynamic interface state updates based on selected configurations (e.g., color).
  // Changes UI elements and updates the URL via History API without full page reload.
  const colorButtons = document.querySelectorAll("[id^='optic-colors_']");
  colorButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.id.split("_")[1];
      const ids = [
        "optic-identical-1_",
        "optic-identical-2_",
        "optic-characteristic_",
        "optic-question-answer_",
        "optic-main-rating_",
      ];

      ids.forEach((prefix) => {
        const allElements = document.querySelectorAll(`[id^='${prefix}']`);
        allElements.forEach((el) => (el.style.display = "none"));

        const target = document.getElementById(`${prefix}${id}`);
        if (target) target.style.display = "";
      });

      const category = this.dataset.opticCategory;
      const gender = this.dataset.opticGender;
      const translitGender = this.dataset.opticTranslitGender;
      const fullName = this.dataset.opticFullName;
      const translitName = this.dataset.opticTranslitFullName;

      const genderElem = document.getElementById("switch-gender");
      if (genderElem) {
        genderElem.textContent = gender;

        const href = genderElem.getAttribute("href");
        if (href) {
          const newHref = href.replace(/\/[^/]*$/, `/${translitGender}`);
          genderElem.setAttribute("href", newHref);
        }
      }

      const categoryNameElem = document.getElementById("switch-category-name");
      if (categoryNameElem) {
        categoryNameElem.textContent = `${category} ${fullName}`;
      }

      const currentURL = window.location.href;
      const newURL = currentURL.replace(
        /\/products\/[^/]+/,
        `/products/${translitName}`,
      );
      window.history.replaceState({}, "", newURL);
    });
  });

  // Quick Transition

  const getHeaderOffset = () => (window.innerWidth * 90) / 1366;

  const scrollToVisibleCard = (prefix) => {
    const target = Array.from(
      document.querySelectorAll(`[id^="${prefix}"]`),
    ).find((el) => getComputedStyle(el).display !== "none");

    if (target) {
      const card = target.querySelector(".card");
      if (card) {
        const cardTop = card.getBoundingClientRect().top + window.scrollY;
        const scrollTarget = cardTop - getHeaderOffset();

        window.scrollTo({
          top: scrollTarget,
          behavior: "smooth",
        });
      }
    }
  };

  document
    .getElementById("quick-transition_1")
    ?.addEventListener("click", () => {
      scrollToVisibleCard("optic-characteristic_");
    });

  document
    .getElementById("quick-transition_2")
    ?.addEventListener("click", () => {
      scrollToVisibleCard("optic-description_");
    });

  document
    .getElementById("quick-transition_3")
    ?.addEventListener("click", () => {
      scrollToVisibleCard("optic-question-answer_");
    });

  document
    .getElementById("quick-transition_4")
    ?.addEventListener("click", () => {
      scrollToVisibleCard("optic-main-rating_");
    });

  // More Content

  toggleMoreButton();
  window.addEventListener("resize", toggleMoreButton);
});

$(document).ready(function () {
  const syncHoverAndActiveStates = () => {
    const buttonSelector = "#optics-product-button";
    const iconWrapperSelector = ".bottom-right-iconProduct-wrapper";
    let isMouseDown = false;

    $(buttonSelector)
      .on("mouseenter", function () {
        $(iconWrapperSelector).addClass("hovered");
        $(buttonSelector).addClass("hovered");
      })
      .on("mouseleave", function () {
        $(iconWrapperSelector).removeClass("hovered");
        $(buttonSelector).removeClass("hovered");

        if (!isMouseDown) {
          $(iconWrapperSelector).removeClass("clicked");
          $(buttonSelector).removeClass("clicked");
        }
      });

    $(iconWrapperSelector)
      .on("mouseenter", function () {
        $(iconWrapperSelector).addClass("hovered");
        $(buttonSelector).addClass("hovered");
      })
      .on("mouseleave", function () {
        $(iconWrapperSelector).removeClass("hovered");
        $(buttonSelector).removeClass("hovered");

        if (!isMouseDown) {
          $(iconWrapperSelector).removeClass("clicked");
          $(buttonSelector).removeClass("clicked");
        }
      });

    $(buttonSelector)
      .on("mousedown", function () {
        isMouseDown = true;
        $(iconWrapperSelector).addClass("clicked");
        $(buttonSelector).addClass("clicked");
      })
      .on("mouseup", function () {
        isMouseDown = false;
        $(iconWrapperSelector).removeClass("clicked");
        $(buttonSelector).removeClass("clicked");
      });

    $(iconWrapperSelector)
      .on("mousedown", function () {
        isMouseDown = true;
        $(iconWrapperSelector).addClass("clicked");
        $(buttonSelector).addClass("clicked");
      })
      .on("mouseup", function () {
        isMouseDown = false;
        $(iconWrapperSelector).removeClass("clicked");
        $(buttonSelector).removeClass("clicked");
      });

    $(document).on("mouseup", function () {
      if (isMouseDown) {
        isMouseDown = false;
        $(iconWrapperSelector).removeClass("clicked");
        $(buttonSelector).removeClass("clicked");
      }
    });
  };

  syncHoverAndActiveStates();
});

// Shared dropdown toggler extracted to avoid duplication across Q&A and Rating modules.
// Reusable function to manage the open/close state and animations of dropdown panels (Q&A, Ratings).
window.toggleSharedDropdownGeneric = function (id, options) {
  try {
    const {
      dropdownIdPrefix,
      containerIdPrefix,
      panelSelector,
      closeBtnSelector,
      plusIconUrl = "/images/System_Interface/plus/plus_white.svg",
      closeIconUrl = "/images/System_Interface/close/close_white.svg",
      blurInputIdPrefix = null,
      // one-time initializer settings: { datasetKey: 'queanInitDone', fn: initAllQuestionAnswer, argsBuilder: (id) => [...] }
      initOnce = null,
    } = options || {};

    if (
      !dropdownIdPrefix ||
      !containerIdPrefix ||
      !panelSelector ||
      !closeBtnSelector
    )
      return;

    const dropdown = document.getElementById(`${dropdownIdPrefix}${id}`);
    if (!dropdown) return;

    const container = document.getElementById(`${containerIdPrefix}${id}`);
    const panel = container?.querySelector(panelSelector);
    const closeButton = container?.querySelector(closeBtnSelector);
    const closeIcon = closeButton?.querySelector("img");

    // ensure reveal mask exists and is on top
    let mask = dropdown.querySelector(":scope > .reveal-mask");
    if (!mask) {
      mask = document.createElement("div");
      mask.className = "reveal-mask";
      dropdown.appendChild(mask);
    } else if (mask !== dropdown.lastElementChild) {
      dropdown.appendChild(mask);
    }

    if (dropdown.dataset.animating === "1") return;

    const isOpen = dropdown.classList.contains("visible");

    const setRounded = () => {
      if (panel) {
        panel.style.borderBottomLeftRadius = "calc(100vw * 5 / 1366)";
        panel.style.borderBottomRightRadius = "calc(100vw * 5 / 1366)";
      }
      if (closeButton && closeIcon) {
        closeButton.style.borderBottomRightRadius = "calc(100vw * 5 / 1366)";
        closeIcon.src = plusIconUrl;
      }
    };

    const setFlat = () => {
      if (panel) {
        panel.style.borderBottomLeftRadius = "0";
        panel.style.borderBottomRightRadius = "0";
      }
      if (closeButton && closeIcon) {
        closeButton.style.borderBottomRightRadius = "0";
        closeIcon.src = closeIconUrl;
      }
    };

    if (!isOpen) {
      dropdown.dataset.animating = "1";

      dropdown.style.visibility = "visible";
      dropdown.style.pointerEvents = "auto";
      dropdown.classList.remove("closing");

      let targetH = parseInt(dropdown.dataset.hCache || "0", 10);
      if (!targetH) {
        targetH = Math.round(dropdown.scrollHeight || 0);
        dropdown.dataset.hCache = targetH > 0 ? String(targetH) : "";
      }

      dropdown.style.height = "0px";

      requestAnimationFrame(() => {
        dropdown.classList.add("visible");
        dropdown.style.transition = "height 0.4s ease";
        dropdown.style.height =
          (targetH || Math.round(dropdown.scrollHeight || 0)) + "px";
      });

      const onOpenEnd = (e) => {
        if (e.propertyName !== "height") return;
        dropdown.style.height = "auto";
        dropdown.style.transition = "";
        dropdown.dataset.animating = "";
        dropdown.removeEventListener("transitionend", onOpenEnd);

        if (blurInputIdPrefix) {
          const toBlur = document.getElementById(`${blurInputIdPrefix}${id}`);
          if (toBlur) toBlur.blur();
        }
      };
      dropdown.addEventListener("transitionend", onOpenEnd);

      setFlat();

      // one-time initializer
      if (
        initOnce &&
        initOnce.datasetKey &&
        typeof initOnce.fn === "function" &&
        !dropdown.dataset[initOnce.datasetKey]
      ) {
        try {
          const args =
            typeof initOnce.argsBuilder === "function"
              ? initOnce.argsBuilder(id)
              : [];
          initOnce.fn.apply(null, args);
        } catch (e) {
          /* swallow */
        }
        dropdown.dataset[initOnce.datasetKey] = "1";
      }
    } else {
      dropdown.dataset.animating = "1";

      const currentH = Math.round(
        dropdown.getBoundingClientRect().height || dropdown.scrollHeight || 0,
      );
      dropdown.style.height = currentH + "px";

      dropdown.classList.add("closing");
      requestAnimationFrame(() => {
        dropdown.style.transition = "height 0.2s ease";
        dropdown.style.height = "0px";
      });

      const onCloseEnd = (e) => {
        if (e.propertyName !== "height") return;
        dropdown.classList.remove("visible", "closing");
        dropdown.style.visibility = "hidden";
        dropdown.style.pointerEvents = "none";
        dropdown.style.transition = "";
        dropdown.dataset.animating = "";
        dropdown.removeEventListener("transitionend", onCloseEnd);

        if (blurInputIdPrefix) {
          const toBlur = document.getElementById(`${blurInputIdPrefix}${id}`);
          if (toBlur) toBlur.blur();
        }
      };
      dropdown.addEventListener("transitionend", onCloseEnd);

      setRounded();
    }
  } catch (err) {
    // fail-safe: never throw from UI toggler
    console &&
      console.warn &&
      console.warn("toggleSharedDropdownGeneric error:", err);
  }
};
