// Open Popup Cart

$(".bottom-right-icon-wrapper").click(function () {
  if ($(this).hasClass("bottom-icon-non-availability")) {
    return;
  }

  $(".popup-bg-cart").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-cart").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Cart

$(".close-popup-cart, .popup-bg-cart, .close-icon ").click(function (event) {
  if (
    $(event.target).closest(".popup-cart").length === 0 ||
    $(event.target).hasClass("close-popup-cart") ||
    $(event.target).hasClass("close-icon")
  ) {
    $(".popup-bg-cart").fadeOut(300);
    $("body").css("overflow", "auto");
    $(".popup-cart").css({ left: `calc(50% + ${scrollbarWidth / 2}px)` });
    $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
  }
});

// Close Popup Rating

$(".close-popup-rating, .popup-bg-rating, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-rating").length === 0 ||
      $(event.target).hasClass("close-popup-rating") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-rating").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-rating").css({ left: `calc(50% + ${scrollbarWidth / 2}px)` });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);

// Close Popup Global Reaptcha

$(
  ".close-popup-global-recap-rat, .popup-bg-global-recap-rat, .close-icon",
).click(function (event) {
  if (
    $(event.target).closest(".popup-global-recap-rat").length === 0 ||
    $(event.target).hasClass("close-popup-global-recap-rat") ||
    $(event.target).hasClass("close-icon")
  ) {
    $(".popup-bg-global-recap-rat").fadeOut(300);
    $("body").css("overflow", "auto");
    $(".popup-global-recap-rat").css({
      left: `calc(50% + ${scrollbarWidth / 2}px)`,
    });
    $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");

    if (pendingLikeDisGlobSnapshot) {
      const {
        ratingGlobalId,
        prevLikeState,
        prevLikeCount,
        prevLikeImage,
        prevDislikeState,
        prevDislikeCount,
        prevDislikeImage,
      } = pendingLikeDisGlobSnapshot;

      likeGlobalStates[ratingGlobalId] = prevLikeState;
      likeGlobalCounts[ratingGlobalId] = prevLikeCount;
      likeGlobalImages[ratingGlobalId] = prevLikeImage;
      dislikeGlobalStates[ratingGlobalId] = prevDislikeState;
      dislikeGlobalCounts[ratingGlobalId] = prevDislikeCount;
      dislikeGlobalImages[ratingGlobalId] = prevDislikeImage;

      updateLikeGlobalNum(ratingGlobalId, prevLikeCount);
      updateLikeGlobalIcons(ratingGlobalId);
      updateDislikeGlobalNum(ratingGlobalId, prevDislikeCount);
      updateDislikeGlobalIcons(ratingGlobalId);

      pendingLikeDisGlobAction = null;
      pendingLikeDisGlobSnapshot = null;
    }
  }
});

// Close Popup Reaptcha

$(".close-popup-recap-rat, .popup-bg-recap-rat, .close-icon").click(
  function (event) {
    if (
      $(event.target).closest(".popup-recap-rat").length === 0 ||
      $(event.target).hasClass("close-popup-recap-rat") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-recap-rat").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-recap-rat").css({
        left: `calc(50% + ${scrollbarWidth / 2}px)`,
      });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");

      if (pendingLikeDisSnapshot) {
        const {
          ratingId,
          prevLikeState,
          prevLikeCount,
          prevLikeImage,
          prevDislikeState,
          prevDislikeCount,
          prevDislikeImage,
        } = pendingLikeDisSnapshot;

        likeStates[ratingId] = prevLikeState;
        likeCounts[ratingId] = prevLikeCount;
        likeImages[ratingId] = prevLikeImage;
        dislikeStates[ratingId] = prevDislikeState;
        dislikeCounts[ratingId] = prevDislikeCount;
        dislikeImages[ratingId] = prevDislikeImage;

        updateLikeNum(ratingId, prevLikeCount);
        updateLikeIcons(ratingId);
        updateDislikeNum(ratingId, prevDislikeCount);
        updateDislikeIcons(ratingId);

        pendingLikeDisAction = null;
        pendingLikeDisSnapshot = null;
      }
    }
  },
);

// Open Popup Main Top 1

$("#container-main-top_1").click(function () {
  $(".popup-bg-main-top_1").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-main-top_1").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Main Top 1

$(".close-popup-main-top_1, .popup-bg-main-top_1, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-main-top_1").length === 0 ||
      $(event.target).hasClass("close-popup-main-top_1") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-main-top_1").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-main-top_1").css({
        left: `calc(50% + ${scrollbarWidth / 2}px)`,
      });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);

// Open Popup Main Top 2

$("#container-main-top_2").click(function () {
  $(".popup-bg-main-top_2").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-main-top_2").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Main Top 2

$(".close-popup-main-top_2, .popup-bg-main-top_2, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-main-top_2").length === 0 ||
      $(event.target).hasClass("close-popup-main-top_2") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-main-top_2").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-main-top_2").css({
        left: `calc(50% + ${scrollbarWidth / 2}px)`,
      });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);

// Open Popup Main Top 3

$("#container-main-top_3").click(function () {
  $(".popup-bg-main-top_3").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-main-top_3").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Main Top 3

$(".close-popup-main-top_3, .popup-bg-main-top_3, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-main-top_3").length === 0 ||
      $(event.target).hasClass("close-popup-main-top_3") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-main-top_3").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-main-top_3").css({
        left: `calc(50% + ${scrollbarWidth / 2}px)`,
      });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);

// Open Popup Main Top 4

$("#container-main-top_4").click(function () {
  $(".popup-bg-main-top_4").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-main-top_4").css({ left: `50%` });
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Main Top 4

$(".close-popup-main-top_4, .popup-bg-main-top_4, .close-icon ").click(
  function (event) {
    if (
      $(event.target).closest(".popup-main-top_4").length === 0 ||
      $(event.target).hasClass("close-popup-main-top_4") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-main-top_4").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".popup-main-top_4").css({
        left: `calc(50% + ${scrollbarWidth / 2}px)`,
      });
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);

// Open Popup Filter1

$(".open-popup-filter1").click(function () {
  $(".popup-bg-filter1").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-filter1-body").css("overflow-y", "auto");
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Filter1

$(".close-popup-filter1, .popup-bg-filter1, .close-icon").click(
  function (event) {
    if (
      $(event.target).closest(".popup-filter1").length === 0 ||
      $(event.target).hasClass("close-popup-filter1") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-filter1").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);

// Open Popup Filter2

$(".open-popup-filter2").click(function () {
  $(".popup-bg-filter2").fadeIn(300);
  $("body").css("overflow", "hidden");
  $(".popup-filter2-body").css("overflow-y", "auto");
  $(".margin-body").css("margin-right", scrollbarWidth + "px");
});

// Close Popup Filter2

$(".close-popup-filter2, .popup-bg-filter2, .close-icon").click(
  function (event) {
    if (
      $(event.target).closest(".popup-filter2").length === 0 ||
      $(event.target).hasClass("close-popup-filter2") ||
      $(event.target).hasClass("close-icon")
    ) {
      $(".popup-bg-filter2").fadeOut(300);
      $("body").css("overflow", "auto");
      $(".margin-body").css("margin-right", "calc(100vw * 0 / 1366)");
    }
  },
);
