document.addEventListener("DOMContentLoaded", () => {
  const cardImages = document.querySelectorAll(".cardNav-img-top");
  const cardTitles = document.querySelectorAll(".cardNav-title");

  function handleMouseDown(card) {
    card.style.backgroundColor = "#e9ecef";
  }

  function handleMouseUp(card) {
    card.style.backgroundColor = "";
  }

  function handleMouseLeave(card) {
    setTimeout(function () {
      card.style.backgroundColor = "";
    }, 200);
  }

  cardImages.forEach(function (img) {
    const card = img.closest(".cardNav");
    img.addEventListener("mousedown", function () {
      handleMouseDown(card);
    });
    img.addEventListener("mouseup", function () {
      handleMouseUp(card);
    });
    img.addEventListener("mouseleave", function () {
      handleMouseLeave(card);
    });
  });

  cardTitles.forEach(function (title) {
    const card = title.closest(".cardNav");
    title.addEventListener("mousedown", function () {
      handleMouseDown(card);
    });
    title.addEventListener("mouseup", function () {
      handleMouseUp(card);
    });
    title.addEventListener("mouseleave", function () {
      handleMouseLeave(card);
    });
  });
});

document.addEventListener("click", function (event) {
  const dropdown = document.querySelector(".dropdown-content");
  if (dropdown) {
    if (!event.target.closest(".dropdown-trigger")) {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }
});
