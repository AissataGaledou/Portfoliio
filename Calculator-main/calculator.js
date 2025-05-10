// Select elements
const display = document.getElementById('display');
const keys = document.getElementById('keys');

// Variables to track calculator state
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Initialize display
display.value = '0';

// Add event listener to calculator keys container (event delegation)
keys.addEventListener('click', (event) => {
  const target = event.target;
  
  // Ensure we only process button clicks
  if (!target.matches('button')) {
    return;
  }

  const { type, value } = target.dataset;

  // Handle different button types
  switch (type) {
    case 'number':
      inputNumber(value);
      break;
    case 'operator':
      inputOperator(value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'equals':
      performCalculation();
      break;
    case 'clear':
      clearDisplay();
      break;
  }
  
  updateDisplay();
});

// Handle number input
function inputNumber(num) {
  if (waitingForSecondOperand) {
    display.value = num;
    waitingForSecondOperand = false;
  } else {
    // Replace display if it's just '0', otherwise append
    display.value = display.value === '0' ? num : display.value + num;
  }
}

// Handle operator input
function inputOperator(op) {
  const inputValue = parseFloat(display.value);
  
  // If we already have an operator and we're waiting for second operand,
  // simply update the operator
  if (operator && waitingForSecondOperand) {
    operator = op;
    return;
  }
  
  // If first operand is null, set it and prepare for second operand
  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    // We have first operand and operator, perform calculation
    const result = calculate(firstOperand, inputValue, operator);
    display.value = result;
    firstOperand = result;
  }
  
  waitingForSecondOperand = true;
  operator = op;
}

// Handle decimal input
function inputDecimal() {
  // If we're waiting for second operand, start with '0.'
  if (waitingForSecondOperand) {
    display.value = '0.';
    waitingForSecondOperand = false;
    return;
  }
  
  // Add decimal point if it doesn't exist already
  if (!display.value.includes('.')) {
    display.value += '.';
  }
}

// Perform calculation based on operator
function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return first / second;
    default:
      return second;
  }
}

// Perform calculation when equals is pressed
function performCalculation() {
  const inputValue = parseFloat(display.value);
  
  if (operator && !waitingForSecondOperand) {
    const result = calculate(firstOperand, inputValue, operator);
    // Format result to avoid excessive decimal places
    display.value = parseFloat(result.toFixed(10));
    firstOperand = result;
    operator = null;
  }
}

// Clear display and reset calculator state
function clearDisplay() {
  display.value = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
}

// Update display function (for potential formatting)
function updateDisplay() {
  // Limit display length to avoid overflow
  if (display.value.length > 12) {
    display.value = parseFloat(display.value).toExponential(8);
  }
}