/**
 * ============================================================================
 * FEATURE: User Viewing History & State Management
 * ============================================================================
 * This module implements the "Products you have viewed" tracking system described
 * in the architectural overview. It persists the user's interaction history across
 * sessions using Local Storage and dynamically renders the UI block without
 * requiring server-side calls, optimizing client-side performance.
 */
document.addEventListener("DOMContentLoaded", function () {
  const MAX_ITEMS = 10;
  const VIEWED_KEY = "viewedOptics";

  // const viewedData = JSON.parse(localStorage.getItem(VIEWED_KEY));

  /**
   * Core State Evaluator: Reads Local Storage to conditionally toggle
   * the visibility of the viewing history UI container based on available data.
   */
  function updateViewedOpticsContainerDisplay() {
    const viewedOpticsContainer = document.getElementById(
      `${prefix}_viewed-optics-container`,
    );
    if (!viewedOpticsContainer) return;

    const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY));
    if (viewed && viewed.length > 0) {
      viewedOpticsContainer.style.display = "flow-root";
    } else {
      viewedOpticsContainer.style.display = "none";
    }
  }

  function saveViewedOpticId(opticId) {
    let viewed = JSON.parse(localStorage.getItem(VIEWED_KEY)) || [];

    viewed = viewed.filter((id) => id !== opticId);
    viewed.unshift(opticId);

    if (viewed.length > MAX_ITEMS) {
      viewed = viewed.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
  }

  function loadViewedOpticsById() {
    const viewed = JSON.parse(localStorage.getItem(VIEWED_KEY)) || [];

    const allCols = document.querySelectorAll('.col[id^="optic-a-col_"]');
    allCols.forEach((col) => {
      const id = col.id.replace("optic-a-col_", "");
      if (viewed.includes(id)) {
        col.style.display = "block";
      } else {
        col.style.display = "none";
      }
    });

    document
      .querySelectorAll(".all-optics-viewed .numberOptics")
      .forEach((numberOptics) => {
        const idParts = numberOptics.id.split("_");
        const prefix = idParts[0];
        const opticId = idParts.slice(2).join("_");

        const priceWithAction = document.getElementById(
          prefix + `_price-with-action-info_` + opticId,
        );
        const productSkills = document.getElementById(
          prefix + `_productSkills_` + opticId,
        );
        const numberOpticsElement = document.getElementById(
          prefix + `_numberOptics_` + opticId,
        );

        if (productSkills && numberOpticsElement) {
          const productSkillsWidth = productSkills.offsetWidth;
          const numberOpticsWidth = numberOpticsElement.offsetWidth;
          let marginLeftValue = 0;

          if (priceWithAction) {
            const priceWithActionWidth = priceWithAction.offsetWidth;
            marginLeftValue =
              priceWithActionWidth - productSkillsWidth - numberOpticsWidth + 2;
          }

          if (marginLeftValue !== 0) {
            numberOpticsElement.style.marginLeft = marginLeftValue + `px`;
          }
        }
      });
  }

  function setupProductLinks() {
    document.querySelectorAll(".col a[data-optic-a]").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        const opticId = link.getAttribute("data-optic-a");
        const href = link.getAttribute("href");

        if (opticId) {
          saveViewedOpticId(opticId);
        }

        setTimeout(() => {
          window.location.href = href;
        }, 50);
      });
    });
  }

  function checkAndSaveFromReferrer() {
    const referrer = document.referrer;
    const match = referrer.match(/\/products\/([^\/?#]+)/);

    if (match && match[1]) {
      const productName = match[1];
      const productLinks = Array.from(
        document.querySelectorAll(".col a[data-optic-a]"),
      );

      const matchingLink = productLinks.find((link) =>
        link.getAttribute("href").includes(productName),
      );
      if (matchingLink) {
        const opticId = matchingLink.getAttribute("data-optic-a");
        if (opticId) {
          saveViewedOpticId(opticId);
          loadViewedOpticsById();
        }
      }
    }
  }

  const container = document.querySelector(".all-optics-viewed");
  if (!container || !container.id) return;

  const idParts = container.id.split("_");
  if (idParts.length < 2) return;

  const prefix = idParts[0];

  function checkCarouselButtonsVisibility() {
    const carouselСontrols = document.getElementById(
      `${prefix}_carouselСontrols`,
    );
    const noWrapRowControls = document.getElementById(
      `${prefix}_no-wrap-row-controls`,
    );

    const clearButton = document.getElementById("clear-viewed-optics");

    const cols = container.querySelectorAll(".col");
    if (cols.length != 0 && cols.length <= 5) {
      if (carouselСontrols) {
        carouselСontrols.style.opacity = "0";
        carouselСontrols.style.pointerEvents = "none";
      }
    }
    if (cols.length == 0) {
      if (container) {
        container.style.display = "none";
      }
      if (carouselСontrols) {
        carouselСontrols.style.display = "none";
      }
      if (noWrapRowControls) {
        noWrapRowControls.style.display = "none";
      }
      if (clearButton) {
        clearButton.style.display = "none";
      }
    }
  }

  /**
   * State Reset Handler: Purges saved viewing history from Local Storage and
   * executes asynchronous CSS/DOM transitions to collapse the component visually.
   */
  function setupClearViewedOpticsButton() {
    const viewedOpticsContainer = document.getElementById(
      `${prefix}_viewed-optics-container`,
    );
    const clearButton = document.getElementById("clear-viewed-optics");
    const container = document.querySelector(".all-optics-viewed");
    const noWrapRowControls = document.getElementById(
      `${prefix}_no-wrap-row-controls`,
    );
    const viewedOptics = document.getElementById(`${prefix}_viewed-optics`);

    if (
      !clearButton ||
      !container ||
      !noWrapRowControls ||
      !viewedOptics ||
      !viewedOpticsContainer
    )
      return;

    clearButton.addEventListener("click", function () {
      container.style.transition = "opacity 0.8s ease, max-height 0.8s ease";
      clearButton.style.transition = "opacity 0.8s ease, max-height 0.8s ease";
      noWrapRowControls.style.transition =
        "opacity 0.8s ease, max-height 0.8s ease";
      viewedOptics.style.transition = "opacity 0.8s ease, max-height 0.8s ease";
      viewedOpticsContainer.style.transition =
        "opacity 0.8s ease, max-height 0.8s ease";

      container.style.opacity = "0";
      clearButton.style.opacity = "0";
      noWrapRowControls.style.opacity = "0";
      viewedOptics.style.opacity = "0";
      viewedOpticsContainer.style.opacity = "0";

      container.style.maxHeight = container.scrollHeight + "px";
      clearButton.style.maxHeight = clearButton.scrollHeight + "px";
      noWrapRowControls.style.maxHeight = noWrapRowControls.scrollHeight + "px";
      viewedOpticsContainer.style.maxHeight =
        viewedOpticsContainer.scrollHeight + "px";

      requestAnimationFrame(() => {
        container.style.maxHeight = "0px";
        clearButton.style.maxHeight = "0px";
        noWrapRowControls.style.maxHeight = "0px";
        viewedOpticsContainer.style.maxHeight = "0px";
      });

      setTimeout(() => {
        localStorage.removeItem("viewedOptics");
        viewedOpticsContainer.innerHTML = "";
        viewedOpticsContainer.style.display = "none";
      }, 800);
    });
  }

  function hideViewedDuplicatesIfVisible() {
    const viewed = JSON.parse(localStorage.getItem("viewedOptics")) || [];
    const viewedOpticsContainer = document.getElementById(
      `${prefix}_viewed-optics-container`,
    );

    let visibleCount = 0;

    viewed.forEach((id) => {
      const mainOpticEl = document.getElementById(`optic-identical-1_${id}`);
      const viewedOpticEl = document.getElementById(`optic-a-col_${id}`);

      if (mainOpticEl && viewedOpticEl) {
        const style = window.getComputedStyle(mainOpticEl);
        if (style.display !== "none") {
          viewedOpticEl.style.display = "none";
        } else {
          viewedOpticEl.style.display = "block";
          visibleCount++;
        }
      }
    });

    if (viewed.length === 1 && visibleCount === 0 && viewedOpticsContainer) {
      viewedOpticsContainer.style.display = "none";
    }
  }

  loadViewedOpticsById();
  updateViewedOpticsContainerDisplay();
  setupProductLinks();
  checkAndSaveFromReferrer();
  checkCarouselButtonsVisibility();
  setupClearViewedOpticsButton();
  hideViewedDuplicatesIfVisible();
});
