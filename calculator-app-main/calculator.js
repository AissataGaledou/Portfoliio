// DOM Elements
const display = document.getElementById('display');
const keys = document.getElementById('keys');

// Calculator state
let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Initialize display
display.value = '0';

// Event delegation for buttons
keys.addEventListener('click', (event) => {
  if (!event.target.matches('button')) return;
  
  const key = event.target;
  const keyType = key.dataset.type;
  const keyValue = key.dataset.value;
  
  // Handle different button types
  switch(keyType) {
    case 'number':
      handleNumberInput(keyValue);
      break;
    case 'decimal':
      handleDecimalInput();
      break;
    case 'operator':
      handleOperatorInput(keyValue);
      break;
    case 'equals':
      handleEqualsInput();
      break;
    case 'clear':
      clearCalculator();
      break;
  }
  
  updateDisplay();
});

// Handle keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;
  
  if (/[0-9]/.test(key)) {
    handleNumberInput(key);
  } else if (key === '.') {
    handleDecimalInput();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperatorInput(key);
  } else if (key === 'Enter' || key === '=') {
    handleEqualsInput();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearCalculator();
  }
  
  updateDisplay();
});

function handleNumberInput(number) {
  if (waitingForSecondOperand) {
    currentInput = number;
    waitingForSecondOperand = false;
  } else {
    // Replace initial 0 with the number unless it's a decimal
    currentInput = currentInput === '0' ? number : currentInput + number;
  }
}

function handleDecimalInput() {
  if (waitingForSecondOperand) {
    currentInput = '0.';
    waitingForSecondOperand = false;
    return;
  }
  
  // Only add decimal if one doesn't exist in current input
  if (!currentInput.includes('.')) {
    currentInput = currentInput === '' ? '0.' : currentInput + '.';
  }
}

function handleOperatorInput(nextOperator) {
  const inputValue = parseFloat(currentInput);
  
  // If we already have an operator and user inputs another,
  // update the operator without calculating
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }
  
  // Set first operand if it doesn't exist
  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    // If we have an operator, perform the calculation
    const result = calculate(firstOperand, inputValue, operator);
    currentInput = String(result);
    firstOperand = result;
  }
  
  waitingForSecondOperand = true;
  operator = nextOperator;
}

function handleEqualsInput() {
  // If we're waiting for second operand, don't do anything
  if (waitingForSecondOperand) return;
  
  const inputValue = parseFloat(currentInput);
  
  if (firstOperand === null) {
    // If there's no first operand, just use current input
    return;
  }
  
  if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    currentInput = String(result);
    
    // Reset the calculator state but keep the result
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
  }
}

function calculate(firstNum, secondNum, op) {
  switch(op) {
    case '+':
      return firstNum + secondNum;
    case '-':
      return firstNum - secondNum;
    case '*':
      return firstNum * secondNum;
    case '/':
      // Handle division by zero
      return secondNum === 0 ? 'Error' : firstNum / secondNum;
    default:
      return secondNum;
  }
}

function clearCalculator() {
  currentInput = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
}

function updateDisplay() {
  // Format the display for readability
  let displayValue = currentInput;
  
  // Handle error message
  if (displayValue === 'Error') {
    display.value = 'Error';
    return;
  }
  
  // Convert to a number to handle trailing zeros
  const numValue = parseFloat(displayValue);
  
  // Check if the value is a valid number
  if (!isNaN(numValue)) {
    // Format large numbers with commas and preserve decimals
    if (displayValue.includes('.')) {
      const parts = displayValue.split('.');
      displayValue = parseFloat(parts[0]).toLocaleString() + '.' + parts[1];
    } else {
      displayValue = parseFloat(displayValue).toLocaleString();
    }
  }
  
  display.value = displayValue;
}