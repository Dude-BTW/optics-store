// Feedback MainRating Star

let verticalDistance = 0;
let distanceCard1_2 = 0;

function logVerticalDistance() {
  const feedbackMainRatingStar = document.getElementById(
    "feedback-mainRating-star",
  );
  const marginBody = document.querySelector(".margin-body");

  if (feedbackMainRatingStar && marginBody) {
    const cards = feedbackMainRatingStar.querySelectorAll(".card");
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      const lastCardRect = lastCard.getBoundingClientRect();
      const marginBodyRect = marginBody.getBoundingClientRect();

      verticalDistance =
        marginBodyRect.bottom -
        lastCardRect.bottom +
        (marginBodyRect.bottom - lastCardRect.bottom) / 3;
    }
  }
}

function updateShowMoreFeedbackButtonPosition() {
  const card1 = document.querySelector("#main-rating-star-Card_1");
  const card2 = document.querySelector("#main-rating-star-Card_2");
  const button = $("#show-more-feedback");
  const feedbackMainRatingStar = document.querySelector(
    "#feedback-mainRating-star",
  );

  if (card1 && card2 && button.length > 0) {
    const card1Right = card1.getBoundingClientRect().right;
    const card2Left = card2.getBoundingClientRect().left;
    distanceCard1_2 = card2Left - card1Right;
    const cardHeight = document.querySelector(
      "#feedback-mainRating-star .card",
    ).offsetHeight;

    button.css("top", cardHeight + verticalDistance + "px");

    if (feedbackMainRatingStar) {
      feedbackMainRatingStar.style.marginBottom =
        verticalDistance * 4.1 - distanceCard1_2 + "px";
    }
  }
}

logVerticalDistance();
updateShowMoreFeedbackButtonPosition();

$("#show-more-feedback").on("click", function () {
  const moreIcon = $(".more-icon");
  const button = $(this);
  const feedbackMainRatingStar = document.querySelector(
    "#feedback-mainRating-star",
  );

  moreIcon.css({
    transition: "transform 1s ease-in-out",
    transform: "rotate(360deg)",
  });

  if (feedbackMainRatingStar) {
    const cardHeight = document.querySelector(
      "#feedback-mainRating-star .card",
    ).offsetHeight;
    const buttonHeight = button.outerHeight();

    feedbackMainRatingStar.style.marginBottom =
      "-" + (cardHeight - buttonHeight - verticalDistance * 2) + "px";
    $(feedbackMainRatingStar).animate(
      {
        marginBottom: verticalDistance * 1.6 - distanceCard1_2 + "px",
      },
      300,
    );
  }

  const hiddenCols = document.querySelectorAll(
    ".main-rating-star .col.hidden-col-MratingStar",
  );
  hiddenCols.forEach((col) => {
    col.classList.remove("hidden-col-MratingStar");

    button.fadeOut(1000, function () {});

    col.classList.add("fade-in-mainRating-star");
  });
});
