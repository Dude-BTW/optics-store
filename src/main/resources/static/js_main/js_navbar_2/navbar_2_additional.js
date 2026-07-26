/**
 * ============================================================================
 * FEATURE: Responsive Navigation & Mega-Menu Logic
 * ============================================================================
 * Controls the complex hover states, dynamic dimensional calculations, and rendering
 * logic for the multi-column mega-menu catalog structure. Ensures responsive behavior.
 */
document.addEventListener("DOMContentLoaded", () => {
  const sunglassesHover = document.getElementById("sunglasses-hover");
  const framesHover = document.getElementById("frames");
  const additionalNavbar1 = document.querySelector(".additional-navbar1");
  const dropdown1Content = document.querySelector("#dropCon1");
  const sunglassesDropdown = document.querySelector("#sunglasses-dropdown");
  const framesDropdown = document.querySelector("#frames-dropdown");
  const dropdown1 = document.querySelector("#drop1");
  const dropTriggerIcon = dropdown1.querySelector(
    ".larger-click-area-nav2 .dropdown2-icon",
  );

  let isHoveringTrigger = false;
  let isAdditionalNavbar1Hovered = false;
  let isDropdownContentHovered = false;
  let priceTextWidthBoolean = false;

  const showAdditionalNavbar1 = () => {
    const dropdown1ContentRect = dropdown1Content.getBoundingClientRect();
    additionalNavbar1.style.left = dropdown1ContentRect.right + "px";
    additionalNavbar1.style.width =
      window.innerWidth - dropdown1ContentRect.right - 15 + "px";
    additionalNavbar1.style.display = "flex";

    additionalNavbar1.style.transition =
      "opacity 0.3s ease-in-out, height 0.3s ease-in-out";

    setTimeout(() => {
      additionalNavbar1.style.opacity = "1";
      additionalNavbar1.style.height = additionalNavbar1.scrollHeight + "px";
    }, 10);

    updateHeights();
  };

  const hideAdditionalNavbar1 = () => {
    additionalNavbar1.style.transition = "opacity 0.3s ease-in-out";
    additionalNavbar1.style.opacity = "0";
    additionalNavbar1.style.height = "0";

    dropdown1Content.style.opacity = "0";
    dropdown1Content.style.visibility = "hidden";
    dropdown1Content.style.transform = "scaleY(0.4)";
    dropdown1Content.style.maxHeight = "0";
  };

  const handleMouseEnterTrigger = () => {
    isHoveringTrigger = true;
    showAdditionalNavbar1();
    dropdown1Content.style.opacity = "1";
    dropdown1Content.style.visibility = "visible";
    dropdown1Content.style.transform = "scaleY(1)";
    dropdown1Content.style.maxHeight = "calc(100vw * 200 / 1366)";
  };

  const handleMouseLeaveTrigger = () => {
    isHoveringTrigger = false;
    setTimeout(() => {
      if (
        !isHoveringTrigger &&
        !isAdditionalNavbar1Hovered &&
        !isDropdownContentHovered
      )
        hideAdditionalNavbar1();
    }, 100);
  };

  sunglassesHover.addEventListener("mouseenter", handleMouseEnterTrigger);
  sunglassesHover.addEventListener("mouseleave", handleMouseLeaveTrigger);
  framesHover.addEventListener("mouseenter", handleMouseEnterTrigger);
  framesHover.addEventListener("mouseleave", handleMouseLeaveTrigger);

  additionalNavbar1.addEventListener("mouseenter", () => {
    isAdditionalNavbar1Hovered = true;
    showAdditionalNavbar1();
  });

  additionalNavbar1.addEventListener("mouseleave", () => {
    isAdditionalNavbar1Hovered = false;
    setTimeout(() => {
      if (
        !isHoveringTrigger &&
        !isAdditionalNavbar1Hovered &&
        !isDropdownContentHovered
      )
        hideAdditionalNavbar1();
    }, 100);
  });

  dropdown1Content.addEventListener("mouseenter", () => {
    isDropdownContentHovered = true;
  });

  dropdown1Content.addEventListener("mouseleave", () => {
    isDropdownContentHovered = false;
    setTimeout(() => {
      if (
        !isHoveringTrigger &&
        !isAdditionalNavbar1Hovered &&
        !isDropdownContentHovered
      )
        hideAdditionalNavbar1();
    }, 100);
  });

  const additNavbar1 = document.querySelector(".additNavbar1");
  const additNavbar2 = document.querySelector(".additNavbar2");

  function showAdditNavbar(navbarToShow, navbarToHide) {
    navbarToShow.classList.add("show-navbar");
    navbarToShow.classList.remove("hide-navbar");

    navbarToHide.classList.add("hide-navbar");
    navbarToHide.classList.remove("show-navbar");
  }

  sunglassesHover.addEventListener("mouseenter", function () {
    showAdditNavbar(additNavbar1, additNavbar2);
  });

  framesHover.addEventListener("mouseenter", function () {
    showAdditNavbar(additNavbar2, additNavbar1);
  });

  const optics3Nav1 = document.getElementById("optics3-nav1");
  const optics3Nav2 = document.getElementById("optics3-nav2");

  function isElementVisible(element) {
    return element && element.offsetParent !== null;
  }

  function updateHeights() {
    let heightNav1 = 0;
    let heightNav2 = 0;

    if (isElementVisible(optics3Nav1)) {
      heightNav1 = optics3Nav1.getBoundingClientRect().height;
    }

    if (isElementVisible(optics3Nav2)) {
      heightNav2 = optics3Nav2.getBoundingClientRect().height;
    }

    const maxHeight = Math.max(heightNav1, heightNav2);

    if (isElementVisible(optics3Nav1)) {
      optics3Nav1.style.height = maxHeight + "px";
    }

    if (isElementVisible(optics3Nav2)) {
      optics3Nav2.style.height = maxHeight + "px";
    }

    const cards = document.querySelectorAll("#rowNav .col");
    if (!priceTextWidthBoolean) {
      cards.forEach((card) => {
        const cardImgTop = card.querySelector(".card-img-top");
        const cardElement = card.querySelector(".cardNav");
        const triangleTop = card.querySelector(".rowNav-triangle-top");
        const squareRight = card.querySelector(".rowNav-square-right");
        const triangleContainer = card.querySelector(
          ".rowNav-triangle-container",
        );

        const currencyText = card.querySelector(".rowNav-currency-text");
        const priceText = card.querySelector(".rowNav-price-text");

        if (priceText && squareRight) {
          const priceTextWidth = priceText.offsetWidth;
          const newSquareRightWidth =
            priceTextWidth / ((window.innerWidth * 12.1) / 1366);

          squareRight.style.width =
            `calc(var(--rowNav-triangle-size) * ` + newSquareRightWidth + `)`;
          squareRight.style.marginLeft =
            `calc(var(--rowNav-triangle-size) * (` +
            newSquareRightWidth +
            ` - 0.2))`;
          const priceFontSize = squareRight.offsetHeight / 1.955555555555556;

          priceText.style.fontSize = priceFontSize - 5 + `px`;
          currencyText.style.fontSize = priceFontSize + `px`;
        }

        if (cardImgTop && cardElement && triangleContainer) {
          const cardWidth = cardElement.offsetWidth;
          const imgWidth = cardImgTop.offsetWidth;
          const triangleTopWidth = parseFloat(
            getComputedStyle(triangleTop).width,
          );
          const squareRightMarginLeft = parseFloat(
            getComputedStyle(squareRight).marginLeft,
          );
          const newRightMarginLeft = triangleTopWidth + squareRightMarginLeft;

          triangleContainer.style.top = (cardWidth - imgWidth) / 1.2 + `px`;
          triangleContainer.style.left = imgWidth - newRightMarginLeft + `px`;
        }

        priceTextWidthBoolean = true;
      });
    }
  }

  // Dropdown1

  const handleMouseEnter1 = () => {
    dropTriggerIcon.style.transform = "scaleY(-1)";

    dropdown1Content.style.opacity = "1";
    dropdown1Content.style.visibility = "visible";
    dropdown1Content.style.transform = "scaleY(1)";
    dropdown1Content.style.maxHeight = "calc(100vw * 200 / 1366)";

    if (additNavbar1.classList.contains("show-navbar")) {
      framesHover.classList.remove("hover-effect");
      framesDropdown.classList.remove("dropdown2-effect");
      sunglassesHover.classList.add("hover-effect");
      sunglassesDropdown.classList.add("dropdown2-effect");
    }

    if (additNavbar2.classList.contains("show-navbar")) {
      sunglassesHover.classList.remove("hover-effect");
      sunglassesDropdown.classList.remove("dropdown2-effect");
      framesHover.classList.add("hover-effect");
      framesDropdown.classList.add("dropdown2-effect");
    }

    if (
      additNavbar1.classList.contains("show-navbar") &&
      additionalNavbar1.style.opacity === "0"
    ) {
      sunglassesHover.classList.remove("hover-effect");
      sunglassesDropdown.classList.remove("dropdown2-effect");
      framesHover.classList.remove("hover-effect");
      framesDropdown.classList.remove("dropdown2-effect");
    }

    if (
      additNavbar2.classList.contains("show-navbar") &&
      additionalNavbar1.style.opacity === "0"
    ) {
      sunglassesHover.classList.remove("hover-effect");
      sunglassesDropdown.classList.remove("dropdown2-effect");
      framesHover.classList.remove("hover-effect");
      framesDropdown.classList.remove("dropdown2-effect");
    }
  };

  const handleMouseLeave1 = () => {
    dropTriggerIcon.style.transform = "";

    dropdown1Content.style.opacity = "0";
    dropdown1Content.style.visibility = "hidden";
    dropdown1Content.style.transform = "scaleY(0.4)";
    dropdown1Content.style.maxHeight = "0";
  };

  additionalNavbar1.addEventListener("mouseenter", handleMouseEnter1);
  additionalNavbar1.addEventListener("mouseleave", handleMouseLeave1);

  dropdown1.addEventListener("mouseenter", handleMouseEnter1);
  dropdown1.addEventListener("mouseleave", handleMouseLeave1);

  sunglassesHover.addEventListener("mouseenter", handleMouseEnter1);
  sunglassesHover.addEventListener("mouseleave", handleMouseLeave1);
  framesHover.addEventListener("mouseenter", handleMouseEnter1);
  framesHover.addEventListener("mouseleave", handleMouseLeave1);
});
