document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('[id^="enter-quest-answ-dropdown_"]')
    .forEach((dd) => {
      dd.classList.remove("visible", "closing");
      dd.style.height = "0px";
      dd.style.visibility = "hidden";
      dd.style.pointerEvents = "none";
      dd.dataset.animating = "";

      let mask = dd.querySelector(":scope > .reveal-mask");
      if (!mask) {
        mask = document.createElement("div");
        mask.className = "reveal-mask";
        dd.appendChild(mask);
      }

      const h = Math.round(dd.scrollHeight || 0);
      dd.dataset.hCache = h > 0 ? String(h) : "";
    });

  function toggleDropdownQuestAnsw(id) {
    window.toggleSharedDropdownGeneric(id, {
      dropdownIdPrefix: "enter-quest-answ-dropdown_",
      containerIdPrefix: "quean-maximus-container_",
      panelSelector: ".questions-answers",
      closeBtnSelector: ".close-questions-answers-button",
      plusIconUrl: "/images/System_Interface/plus/plus_white.svg",
      closeIconUrl: "/images/System_Interface/close/close_white.svg",
      blurInputIdPrefix: "enter-quean-phone-input_",
      initOnce: {
        datasetKey: "queanInitDone",
        fn:
          typeof initAllQuestionAnswer === "function"
            ? initAllQuestionAnswer
            : null,
        argsBuilder: (id) => [
          "",
          "",
          ".enter-quest-answ-container",
          `#enter-quest-answ-form_${id}`,
          '[id^="report-familrul-button_"]',
          '[id^="questionAnswerForm_"]',
          "question_answer",
          "Надсилання запитання",
          "Питання надіслано",
          "Під час відправлення запитання сталася помилка",
          false,
        ],
      },
    });
  }

  const questionsAnswersList = document.querySelectorAll(".questions-answers");
  const closeQuestionsButtonList = document.querySelectorAll(
    ".close-questions-answers-button",
  );
  const closeQuestionsPList = document.querySelectorAll(
    ".close-questions-answers-p",
  );
  questionsAnswersList.forEach((questionsAnswers, index) => {
    const closeQuestionsButton = closeQuestionsButtonList[index];
    const closeQuestionsP = closeQuestionsPList[index];

    const addHoverClass = () => {
      questionsAnswers.classList.add("questions-answersHover");
      closeQuestionsButton?.classList.add("close-que-answ-buttonHover");
      closeQuestionsP?.classList.add("close-que-answ-pHover");
    };

    const removeHoverClass = () => {
      questionsAnswers.classList.remove("questions-answersHover");
      closeQuestionsButton?.classList.remove("close-que-answ-buttonHover");
      closeQuestionsP?.classList.remove("close-que-answ-pHover");
    };

    const addActiveClass = () => {
      questionsAnswers.classList.add("questions-answersActive");
      closeQuestionsButton?.classList.add("close-que-answ-buttonActive");
      closeQuestionsP?.classList.add("close-que-answ-pActive");
    };

    const removeActiveClass = () => {
      questionsAnswers.classList.remove("questions-answersActive");
      closeQuestionsButton?.classList.remove("close-que-answ-buttonActive");
      closeQuestionsP?.classList.remove("close-que-answ-pActive");
    };

    [questionsAnswers, closeQuestionsButton, closeQuestionsP].forEach(
      (element) => {
        if (element) {
          element.addEventListener("mouseenter", addHoverClass);
          element.addEventListener("mouseleave", removeHoverClass);
        }
      },
    );

    [questionsAnswers, closeQuestionsButton, closeQuestionsP].forEach(
      (element) => {
        if (element) {
          element.addEventListener("mousedown", addActiveClass);
          element.addEventListener("mouseup", removeActiveClass);
          element.addEventListener("mouseleave", removeActiveClass);
        }
      },
    );
  });

  window.toggleDropdownQuestAnsw = toggleDropdownQuestAnsw;
});
