document.addEventListener("DOMContentLoaded", () => {
  function updateMarginLeft() {
    document.querySelectorAll(".numberOptics").forEach((numberOptics) => {
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

  updateMarginLeft();
});
