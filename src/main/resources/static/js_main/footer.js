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

document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".footer-enter-container");

  containers.forEach((container) => {
    const button = container.querySelector(".footer-enter-button");
    const input = container.querySelector(".footer-enter-input");

    if (button && input) {
      button.addEventListener("mouseover", () => {
        input.style.borderBottom = "calc(100vw * 1 / 1366) solid #d8d8d8";
      });

      button.addEventListener("mouseout", () => {
        input.style.borderBottom =
          "calc(100vw * 1 / 1366) solid rgba(255, 255, 255, 0.500)";
      });

      button.addEventListener("mousedown", () => {
        input.style.borderBottom = "calc(100vw * 1 / 1366) solid white";
      });

      button.addEventListener("mouseup", () => {
        input.style.borderBottom =
          "calc(100vw * 1 / 1366) solid rgba(255, 255, 255, 0.500)";
      });
    }
  });
});

document
  .getElementById("subscription-button")
  .addEventListener("click", function () {
    const inputField = document.getElementById("subscription-input");
    const email = inputField.value.trim();
    const correctlyMessage = document.getElementById("correctly-message");
    const notCorrectMessage = document.getElementById("not-correct-message");
    const emptyMessage = document.getElementById("empty-message");

    function showMessage(element) {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      setTimeout(() => {
        element.style.opacity = "0";
        element.style.visibility = "hidden";
      }, 2000);
    }

    correctlyMessage.style.opacity = "0";
    correctlyMessage.style.visibility = "hidden";
    notCorrectMessage.style.opacity = "0";
    notCorrectMessage.style.visibility = "hidden";
    emptyMessage.style.opacity = "0";
    emptyMessage.style.visibility = "hidden";

    if (email === "") {
      showMessage(emptyMessage);
    } else if (
      validator.isEmail(email) &&
      email.length >= 3 &&
      email.length <= 255
    ) {
      showMessage(correctlyMessage);
    } else {
      showMessage(notCorrectMessage);
    }

    inputField.value = "";
  });
