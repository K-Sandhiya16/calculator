const displayInput = document.getElementById("display-input");
const displayResult = document.getElementById("display-result");
const buttonsContainer = document.getElementById("buttons");

let currentExpression = "";
let result = "0";
let awaitingNewInput = false;

function updateDisplay() {
  displayInput.textContent = currentExpression || "0";
  displayResult.textContent = result;
}

const isOperator = (char) => ["+", "-", "*", "/", "%"].includes(char);

function appendToExpression(value) {
  if (awaitingNewInput) {
    ed;
    if (/[0-9.]/.test(value)) {
      currentExpression = value;
      result = value;
    } else {
      currentExpression = result + value;
    }
    awaitingNewInput = false;
  } else {
    const lastChar = currentExpression.slice(-1);

    if (isOperator(lastChar) && isOperator(value)) {
      if (value !== "-") {
        currentExpression = currentExpression.slice(0, -1) + value;
      }
    } else if (value === "." && currentExpression.endsWith(".")) {
      return;
    } else {
      currentExpression += value;
    }
  }

  try {
    let safeExpression = currentExpression.replace(/%/g, "/100*");

    if (isOperator(safeExpression.slice(-1))) {
      safeExpression = safeExpression.slice(0, -1);
    }

    const currentPreview = eval(safeExpression);
    if (currentPreview !== undefined && !isNaN(currentPreview)) {
      result = parseFloat(currentPreview.toFixed(10)).toString();
    }
  } catch (e) {
    console.log(e);
  }

  updateDisplay();
}

function handleClear() {
  currentExpression = "";
  result = "0";
  awaitingNewInput = false;
  updateDisplay();
}

function handleDelete() {
  if (awaitingNewInput) {
    handleClear();
    return;
  }
  currentExpression = currentExpression.slice(0, -1);

  if (currentExpression.length > 0) {
    try {
      let safeExpression = currentExpression.replace(/%/g, "/100*");
      if (isOperator(safeExpression.slice(-1))) {
        safeExpression = safeExpression.slice(0, -1);
      }

      const currentPreview = eval(safeExpression);
      if (currentPreview !== undefined && !isNaN(currentPreview)) {
        result = parseFloat(currentPreview.toFixed(10)).toString();
      }
    } catch (e) {
      result = "0";
    }
  } else {
    result = "0";
  }

  updateDisplay();
}

function handleEquals() {
  if (currentExpression === "" || awaitingNewInput) return;

  try {
    let finalExpression = currentExpression.replace(/%/g, "/100*");

    let finalResult = eval(finalExpression);

    if (
      finalResult === Infinity ||
      finalResult === -Infinity ||
      isNaN(finalResult)
    ) {
      result = "Error";
      currentExpression = "";
    } else {
      result = parseFloat(finalResult.toFixed(10)).toString();
      currentExpression = currentExpression + " =";
    }

    awaitingNewInput = true;
  } catch (e) {
    result = "Error";
    currentExpression = "";
    awaitingNewInput = true;
  }
  updateDisplay();
}

buttonsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".calc-button");
  if (!button) return;

  const value = button.getAttribute("data-value");

  switch (value) {
    case "AC":
      handleClear();
      break;
    case "DEL":
      handleDelete();
      break;
    case "=":
      handleEquals();
      break;
    default:
      appendToExpression(value);
      break;
  }
});

window.onload = updateDisplay;
