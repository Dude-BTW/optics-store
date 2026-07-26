/**
 * DOM Structural Normalizer:
 * Recursively analyzes dynamic content lengths (like varying localized product descriptions)
 * and enforces uniform height dimensions across grid rows to prevent layout fracturing.
 */
function normalizeCardTitleHeights() {
  const cards = document.querySelectorAll(".col");

  cards.forEach((card) => {
    const cardImgTop = card.querySelector(".card-img-top");
    const cardElement = card.querySelector(".card");
    const triangleTop = card.querySelector(".triangle-top");
    const squareRight = card.querySelector(".square-right");
    const triangleContainer = card.querySelector(".triangle-container");

    const currencyText = card.querySelector(".triangle-currency-text");
    const priceText = card.querySelector(".triangle-price-text");

    if (priceText && squareRight) {
      const priceTextWidth = priceText.offsetWidth;
      const newSquareRightWidth =
        priceTextWidth / ((window.innerWidth * 20.3) / 1366);

      squareRight.style.width =
        `calc(var(--triangle-size) * ` + newSquareRightWidth + `)`;
      squareRight.style.marginLeft =
        `calc(var(--triangle-size) * (` + newSquareRightWidth + ` - 0.2))`;
      const priceFontSize = squareRight.offsetHeight / 1.955555555555556;

      priceText.style.fontSize = priceFontSize - 5 + `px`;
      currencyText.style.fontSize = priceFontSize + `px`;
    }

    if (cardImgTop && cardElement && triangleContainer) {
      const cardWidth = cardElement.offsetWidth;
      const imgWidth = cardImgTop.offsetWidth;
      const triangleTopWidth = parseFloat(getComputedStyle(triangleTop).width);
      const triangleTopHeight = parseFloat(
        getComputedStyle(triangleTop).height,
      );
      const squareRightMarginLeft = parseFloat(
        getComputedStyle(squareRight).marginLeft,
      );
      const newRightMarginLeft = triangleTopWidth + squareRightMarginLeft;

      triangleContainer.style.top =
        ((cardWidth - imgWidth) / 1.23 - triangleTopHeight) * 2 + `px`;
      triangleContainer.style.left =
        imgWidth + (cardWidth - imgWidth) / 2.8 - newRightMarginLeft + `px`;
    }
  });

  let smallestMarginTop = Infinity;

  cards.forEach((card) => {
    const customBody = card.querySelector("#custom-body-optics3");
    const cardTitle = card.querySelector("#card-title-optics3");

    if (customBody && cardTitle) {
      const cardTitleBottom = cardTitle.getBoundingClientRect().bottom;
      const customBodyTop = customBody.getBoundingClientRect().top;
      const marginTop = customBodyTop - cardTitleBottom;

      if (marginTop < smallestMarginTop) {
        smallestMarginTop = marginTop;
      }
    }
  });

  if (smallestMarginTop !== Infinity) {
    cards.forEach((card) => {
      const customBody = card.querySelector("#custom-body-optics3");
      if (customBody) {
        customBody.style.marginTop = smallestMarginTop - 7 + "px";
      }
    });
  }

  const cardTitlesOptics3 = document.querySelectorAll("#card-title-optics3");

  let maxHeightOptics3 = 0;
  cardTitlesOptics3.forEach((title) => {
    const titleHeight = title.offsetHeight;
    if (titleHeight > maxHeightOptics3) {
      maxHeightOptics3 = titleHeight;
    }
  });

  cardTitlesOptics3.forEach((title) => {
    title.style.height = maxHeightOptics3 + "px";
  });

  const cardTitles = document.querySelectorAll(".card-title");

  let maxHeight = 0;
  cardTitles.forEach((title) => {
    const titleHeight = title.offsetHeight;
    if (titleHeight > maxHeight) {
      maxHeight = titleHeight;
    }
  });

  cardTitles.forEach((title) => {
    title.style.height = maxHeight - 6 + "px";
  });
}

/**
 * Global Interactive UI Subroutines:
 * Registers top-level event listeners for key E-commerce functionality:
 * - Mathematical horizontal viewport scrolling logic for nested product carousels.
 * - CSS/JS hover state interception mapping for dynamic product image preview swaps.
 */
$(document).ready(function () {
  function handleCarouselNext(rowSelector, scrollAmount, tolerance) {
    const row = $(rowSelector);
    if (row.scrollLeft() + row.width() + tolerance >= row[0].scrollWidth) {
      row.stop(true).animate({ scrollLeft: 0 }, 500);
    } else {
      row.stop(true).animate({ scrollLeft: "+=" + scrollAmount }, 300);
    }
  }

  function handleCarouselPrev(rowSelector, scrollAmount) {
    const row = $(rowSelector);
    if (row.scrollLeft() <= 0) {
      row.stop(true).animate({ scrollLeft: row[0].scrollWidth }, 1000);
    } else {
      row.stop(true).animate({ scrollLeft: "-=" + scrollAmount }, 300);
    }
  }

  $('[id$="_carouselNext1"]').on("click", function () {
    const prefix = this.id.split("_")[0];
    handleCarouselNext(
      `#` + prefix + `_all-optics1`,
      $(`#` + prefix + `_all-optics1 .col`).outerWidth(true),
      10,
    );
  });

  $('[id$="_carouselPrev1"]').on("click", function () {
    const prefix = this.id.split("_")[0];
    handleCarouselPrev(
      `#` + prefix + `_all-optics1`,
      $(`#` + prefix + `_all-optics1 .col`).outerWidth(true),
    );
  });

  $('[id$="_carouselNext2"]').on("click", function () {
    const prefix = this.id.split("_")[0];
    handleCarouselNext(
      `#` + prefix + `_all-optics2`,
      $(`#` + prefix + `_all-optics2 .col`).outerWidth(true),
      10,
    );
  });

  $('[id$="_carouselPrev2"]').on("click", function () {
    const prefix = this.id.split("_")[0];
    handleCarouselPrev(
      `#` + prefix + `_all-optics2`,
      $(`#` + prefix + `_all-optics2 .col`).outerWidth(true),
    );
  });

  $("#noWrapRowPrev").on("click", function () {
    $(".all-optics2")
      .stop(true, true)
      .animate({ scrollLeft: 0 }, 0, function () {
        $("#noWrapRow1").fadeIn(0);
        $("#noWrapRow2").fadeOut(0).removeClass("noWrapRowHidden");
      });
  });

  $("#noWrapRowNext").on("click", function () {
    $(".all-optics1")
      .stop(true, true)
      .animate({ scrollLeft: 0 }, 0, function () {
        $("#noWrapRow1").fadeOut(0);
        $("#noWrapRow2").fadeIn(0).removeClass("noWrapRowHidden");
      });
  });

  $(".card").on("mouseover", function () {
    const image = $(this).find(".card-img-top");
    const image1 = image.data("image1");
    const image2 = image.data("image2");
    image.attr("src", image2);
  });

  $(".card").on("mouseout", function () {
    const image = $(this).find(".card-img-top");
    const image1 = image.data("image1");
    image.attr("src", image1);
  });

  // Right Icon Wrapper & Icon Non Availability Bottom

  $(".bottom-right-icon-wrapper").on("mouseover", function () {
    if ($(this).hasClass("bottom-icon-non-availability")) {
      $(this).addClass("hovered-non-avail").removeClass("clicked-non-avail");
    } else {
      $(this).addClass("hovered").removeClass("clicked");
    }
  });
  $(".bottom-right-icon-wrapper").on("mouseout", function () {
    if ($(this).hasClass("bottom-icon-non-availability")) {
      $(this).removeClass("hovered-non-avail clicked-non-avail");
    } else {
      $(this).removeClass("hovered clicked");
    }
  });
  $(".bottom-right-icon-wrapper").on("mousedown", function () {
    if ($(this).hasClass("bottom-icon-non-availability")) {
      $(this).addClass("clicked-non-avail");
    } else {
      $(this).addClass("clicked");
    }
  });
  $(".bottom-right-icon-wrapper").on("mouseup", function () {
    if ($(this).hasClass("bottom-icon-non-availability")) {
      $(this).addClass("hovered-non-avail").removeClass("clicked-non-avail");
    } else {
      $(this).addClass("hovered").removeClass("clicked");
    }
  });
});

window.addEventListener("DOMContentLoaded", normalizeCardTitleHeights);
window.addEventListener("resize", normalizeCardTitleHeights);
