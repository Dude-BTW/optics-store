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
    element.style.color = "";
  });
});

document.querySelectorAll(".dropdown1").forEach(function (dropdown) {
  const content = dropdown.querySelector(".dropdown1-content");

  dropdown.addEventListener("mouseover", function () {
    content.classList.remove("hide");
  });

  dropdown.addEventListener("mouseleave", function () {
    content.classList.add("hide");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Dropdown 1 Elements
  const dropdownContentFeedback1 = document.getElementById(
    "dropdown1-content-feedback",
  );
  const dropdownSpanFeedback1 = document.getElementById(
    "dropdown1-span-feedback",
  );

  // Dropdown 2 Elements
  const dropdownContentFeedback2 = document.getElementById(
    "dropdown2-content-feedback",
  );
  const dropdownSpanFeedback2 = document.getElementById(
    "dropdown2-span-feedback",
  );

  // Function to add hover styles
  function addHoverStyles(dropdownSpan) {
    dropdownSpan.style.backgroundColor = "#e9ecef";
    dropdownSpan.style.color = "#e6746d";
  }

  // Function to remove hover styles
  function removeHoverStyles(dropdownSpan) {
    dropdownSpan.style.backgroundColor = "";
    dropdownSpan.style.color = "";
  }

  // Hover for dropdownContentFeedback1
  if (dropdownContentFeedback1 && dropdownSpanFeedback1) {
    dropdownContentFeedback1.addEventListener("mouseenter", function () {
      dropdownSpanFeedback1.style.borderBottomLeftRadius =
        "calc(100vw * 0 / 1366)";
      dropdownSpanFeedback1.style.borderBottomRightRadius =
        "calc(100vw * 0 / 1366)";
      addHoverStyles(dropdownSpanFeedback1);
    });

    dropdownContentFeedback1.addEventListener("mouseleave", function () {
      dropdownSpanFeedback1.style.borderBottomLeftRadius =
        "calc(100vw * 5 / 1366)";
      dropdownSpanFeedback1.style.borderBottomRightRadius =
        "calc(100vw * 5 / 1366)";
      removeHoverStyles(dropdownSpanFeedback1);
    });

    // DopdownSpanFeedback1
    dropdownSpanFeedback1.addEventListener("mouseenter", function () {
      dropdownSpanFeedback1.style.borderBottomLeftRadius =
        "calc(100vw * 0 / 1366)";
      dropdownSpanFeedback1.style.borderBottomRightRadius =
        "calc(100vw * 0 / 1366)";
      addHoverStyles(dropdownSpanFeedback1);
    });

    dropdownSpanFeedback1.addEventListener("mouseleave", function () {
      dropdownSpanFeedback1.style.borderBottomLeftRadius =
        "calc(100vw * 5 / 1366)";
      dropdownSpanFeedback1.style.borderBottomRightRadius =
        "calc(100vw * 5 / 1366)";
      removeHoverStyles(dropdownSpanFeedback1);
    });
  }

  // Hover for dropdownContentFeedback2
  if (dropdownContentFeedback2 && dropdownSpanFeedback2) {
    dropdownContentFeedback2.addEventListener("mouseenter", function () {
      dropdownSpanFeedback2.style.borderBottomLeftRadius =
        "calc(100vw * 0 / 1366)";
      dropdownSpanFeedback2.style.borderBottomRightRadius =
        "calc(100vw * 0 / 1366)";
      addHoverStyles(dropdownSpanFeedback2);
    });

    dropdownContentFeedback2.addEventListener("mouseleave", function () {
      dropdownSpanFeedback2.style.borderBottomLeftRadius =
        "calc(100vw * 5 / 1366)";
      dropdownSpanFeedback2.style.borderBottomRightRadius =
        "calc(100vw * 5 / 1366)";
      removeHoverStyles(dropdownSpanFeedback2);
    });

    // DopdownSpanFeedback2
    dropdownSpanFeedback2.addEventListener("mouseenter", function () {
      dropdownSpanFeedback2.style.borderBottomLeftRadius =
        "calc(100vw * 0 / 1366)";
      dropdownSpanFeedback2.style.borderBottomRightRadius =
        "calc(100vw * 0 / 1366)";
      addHoverStyles(dropdownSpanFeedback2);
    });

    dropdownSpanFeedback2.addEventListener("mouseleave", function () {
      dropdownSpanFeedback2.style.borderBottomLeftRadius =
        "calc(100vw * 5 / 1366)";
      dropdownSpanFeedback2.style.borderBottomRightRadius =
        "calc(100vw * 5 / 1366)";
      removeHoverStyles(dropdownSpanFeedback2);
    });
  }
});
