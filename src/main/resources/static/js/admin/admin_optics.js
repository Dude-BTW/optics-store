/**
 * Admin Image Management:
 * Dynamically handles image uploads and updates the DOM with the full physical path,
 * enabling real-time preview and data binding for product catalog administration.
 */
function updateFullPathImage(opticsId) {
  var fileInput = document.getElementById("fileInput_" + opticsId);
  var fullPathImage1Input = document.getElementById(
    "fullPathImage1_" + opticsId,
  );
  var label = document.querySelector(
    'label[for="fullPathImage1_' + opticsId + '"]',
  );

  if (fileInput.files.length > 0) {
    var filePath = "/images/Оптика/" + fileInput.files[0].name;
    fullPathImage1Input.value = filePath;

    var fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
    label.textContent = fileName;
  }
}

function toggleDisable(selectId, inputId) {
  const selectElement = document.getElementById(selectId);
  const inputElement = document.getElementById(inputId);
  if (selectElement.value !== "") {
    inputElement.disabled = true;
  } else {
    inputElement.disabled = false;
  }
  checkForm();
}

/**
 * Form State & Validation Module:
 * Continuously monitors DOM input states. Prevents incomplete data submission
 * by programmatically locking the submit button until all required entity fields are populated.
 */
function checkForm() {
  const selects = document.querySelectorAll('form[action="/add"] select');
  const inputs = document.querySelectorAll(
    'form[action="/add"] input[type="text"]',
  );
  let enableButton = false;

  selects.forEach((select) => {
    if (select.value !== "") {
      enableButton = true;
    }
  });

  inputs.forEach((input) => {
    if (input.value.trim() !== "") {
      enableButton = true;
    }
  });

  document.getElementById("addOpticsButton").disabled = !enableButton;
}

document.addEventListener("DOMContentLoaded", checkForm);
