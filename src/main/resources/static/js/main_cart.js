// Client-side cart management logic.
// Calculates total price dynamically based on item quantities, handles removal, and synchronizes state with localStorage.
// Iterates through visible cart items, extracts prices and quantities, and recalculates the total sum displayed.
function updateCartCurrencySum() {
  let total = 0;

  const visibleCartItems = document.querySelectorAll(
    ".col-byCart:not([style*='display: none'])",
  );

  visibleCartItems.forEach((cartItem) => {
    const currencyElement = cartItem.querySelector(
      '[id^="main-cart-currency_"] a',
    );

    if (currencyElement) {
      let priceText = currencyElement.textContent.trim();
      let price = parseFloat(priceText);

      if (!isNaN(price)) {
        const quantityInput = cartItem.querySelector(
          ".main-cart-productQuantity-input",
        );
        const quantity = parseInt(quantityInput.value, 10) || 1;

        total += price * quantity;
      }
    }
  });

  const sumElement = document.getElementById("cart-currency-sum");
  if (sumElement) {
    sumElement.textContent = total.toFixed(2);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Cart Optic Name & Price Text Width

  const cartNames = document.querySelectorAll(".cart-optic-name");
  const cartPriceText = document.querySelectorAll(".cart-price-text");
  let maxWidthName = 0;
  let maxWidthPriceText = 0;

  cartNames.forEach((el) => {
    const elWidth = el.offsetWidth;
    if (elWidth > maxWidthName) {
      maxWidthName = elWidth;
    }
  });

  cartPriceText.forEach((el) => {
    const elWidth = el.offsetWidth;
    if (elWidth > maxWidthPriceText) {
      maxWidthPriceText = elWidth;
    }
  });

  cartNames.forEach((el) => {
    el.style.width = `${maxWidthName}px`;
  });

  cartPriceText.forEach((el) => {
    el.style.width = `${maxWidthPriceText}px`;
  });

  // Minus - Plus - Delete Buttons & Quantity Inputs

  const minusCartButtons = document.querySelectorAll(
    ".main-cart-productMinus-button",
  );
  const plusCartButtons = document.querySelectorAll(
    ".main-cart-productPlus-button",
  );
  const quantityCartInputs = document.querySelectorAll(
    ".main-cart-productQuantity-input",
  );

  // Event listeners for quantity adjustment in the cart, recalculating totals on change.
  minusCartButtons.forEach((minusButton, index) => {
    const plusCartButton = plusCartButtons[index];
    const quantityCartInput = quantityCartInputs[index];
    const topCartQuantity = parseInt(
      minusButton.closest(".col-byCart").dataset.cartOpticQuantity,
      10,
    );
    const maxCartQuantity = topCartQuantity > 16 ? 16 : topCartQuantity || 1;
    function updateButtonCartState() {
      const currentValue = parseInt(quantityCartInput.value, 10);

      minusButton.disabled = currentValue <= 1;
      plusCartButton.disabled = currentValue >= maxCartQuantity;
    }

    updateButtonCartState();

    minusButton.addEventListener("click", function () {
      const currentValue = parseInt(quantityCartInput.value, 10);
      if (currentValue > 1) {
        quantityCartInput.value = currentValue - 1;
        updateButtonCartState();
      }
    });

    plusCartButton.addEventListener("click", function () {
      const currentValue = parseInt(quantityCartInput.value, 10);
      if (currentValue < maxCartQuantity) {
        quantityCartInput.value = currentValue + 1;
        updateButtonCartState();
      }
    });

    quantityCartInput.addEventListener("input", function () {
      let currentValue = parseInt(quantityCartInput.value, 10);
      if (isNaN(currentValue) || currentValue < 1) {
        currentValue = 1;
      } else if (currentValue > maxCartQuantity) {
        currentValue = maxCartQuantity;
      }
      quantityCartInput.value = currentValue;
      updateButtonCartState();
    });
  });

  $(".main-cart-productPlus-button").on("mouseover", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });
  $(".main-cart-productPlus-button").on("mouseout", function () {
    $(this).removeClass("hovered clicked");
  });
  $(".main-cart-productPlus-button").on("mousedown", function () {
    $(this).addClass("clicked");
  });
  $(".main-cart-productPlus-button").on("mouseup", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });

  $(".main-cart-productMinus-button").on("mouseover", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });
  $(".main-cart-productMinus-button").on("mouseout", function () {
    $(this).removeClass("hovered clicked");
  });
  $(".main-cart-productMinus-button").on("mousedown", function () {
    $(this).addClass("clicked");
  });
  $(".main-cart-productMinus-button").on("mouseup", function () {
    $(this).addClass("hovered").removeClass("clicked");
  });

  updateCartCurrencySum();

  document
    .querySelectorAll(".main-cart-productQuantity-input")
    .forEach((input) => {
      input.addEventListener("input", updateCartCurrencySum);
    });

  document
    .querySelectorAll(
      ".main-cart-productMinus-button, .main-cart-productPlus-button",
    )
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(updateCartCurrencySum, 50);
      });
    });

  // Synchronizes the current cart state (item IDs and quantities) with the browser's localStorage.
  function syncCartOpticIds(opticId, quantity) {
    let cartOpticIds = JSON.parse(localStorage.getItem("cartOpticIds")) || [];

    cartOpticIds = cartOpticIds.filter((id) => id !== opticId);

    for (let i = 0; i < quantity; i++) {
      cartOpticIds.push(opticId);
    }

    localStorage.setItem("cartOpticIds", JSON.stringify(cartOpticIds));
  }

  document
    .querySelectorAll(".main-cart-productQuantity-input")
    .forEach((input) => {
      input.addEventListener("input", () => {
        const opticId = input.id.split("_")[1];
        let quantity = parseInt(input.value, 10);

        if (isNaN(quantity)) quantity = 1;
        if (quantity < 1) quantity = 1;
        if (quantity > 16) quantity = 16;

        input.value = quantity;
        syncCartOpticIds(opticId, quantity);
      });
    });

  document
    .querySelectorAll(
      ".main-cart-productMinus-button, .main-cart-productPlus-button",
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        setTimeout(() => {
          const isPlus = button.classList.contains(
            "main-cart-productPlus-button",
          );
          const opticId = button.id.split("_")[1];
          const input = document.getElementById(
            `main-cart-productQuantity-input_${opticId}`,
          );
          let quantity = parseInt(input.value, 10);

          if (isNaN(quantity)) quantity = 1;
          if (quantity < 1) quantity = 1;
          if (quantity > 16) quantity = 16;

          input.value = quantity;
          syncCartOpticIds(opticId, quantity);
        }, 30);
      });
    });

  document.querySelectorAll(".delete-main-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const buttonId = button.id;
      const opticId = buttonId.split("_")[1];

      let cartOpticIds = JSON.parse(localStorage.getItem("cartOpticIds")) || [];
      cartOpticIds = cartOpticIds.filter((id) => id !== opticId);
      localStorage.setItem("cartOpticIds", JSON.stringify(cartOpticIds));

      const itemElement = document.getElementById(`col-byCart_${opticId}`);
      if (itemElement) {
        itemElement.style.transition =
          "opacity 0.5s ease, max-height 0.5s ease";
        itemElement.style.opacity = "0";
        itemElement.style.maxHeight = itemElement.scrollHeight + "px";

        requestAnimationFrame(() => {
          itemElement.style.maxHeight = "0px";
        });

        setTimeout(() => {
          itemElement.remove();
          updateCartCurrencySum();
        }, 500);
      }
    });
  });
});
