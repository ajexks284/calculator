const display = document.getElementById('display');
const numberKeys = document.querySelectorAll('.number');
const operatorKeys = document.querySelectorAll('.operator');
const equalKey = document.querySelector('.equal');
const dotKey = document.querySelector('.dot');
const clearKey = document.querySelector('.clear');
const deleteKey = document.querySelector('.delete');
const toggleKey = document.querySelector('.toggle-neg-pos');

let executed = false;
let clickedEqual = false;

const calculator = {
    firstNum: null,
    operator: null,
    secondNum: null
}

// Event Listeners
Array.from(numberKeys).forEach(numberKey => {
    numberKey.addEventListener('click', (e) => {
        if (clickedEqual) {
            clearCalculator();
            display.innerText = '';
            clickedEqual = false;
        }
        checkForOperator();
        if (e.target.innerText === '0') {
            if (!calculator.firstName && !calculator.operator ||
                calculator.operator && !calculator.secondNum) {
                // no 0 first on first number or after an operator
                if (display.innerText == '') {
                    deleteDigit();
                } else {
                    updateDisplay(e);
                }
            } else {
                updateDisplay(e);
            }
        } else {
            updateDisplay(e);
        }
        storeNumber();
    })
});

Array.from(operatorKeys).forEach(operatorKey => {
    operatorKey.addEventListener('click', (e) => {
        if (calculator.operator && calculator.secondNum) {
            display.innerText = tryRoundNumber(operate(calculator.firstNum, calculator.secondNum, calculator.operator));
            clearCalculator();
            calculator.firstNum = +display.innerText;
            calculator.operator = e.target.innerText;
            clickedEqual = false;
            executed = false;
        } else if (!calculator.firstNum) {
            return;
        } else {
            storeOperator(e);
            clickedEqual = false;
        }
    })
});

equalKey.addEventListener('click', () => {
    if (!calculator.firstNum || !calculator.secondNum || !calculator.operator) {
        return;
    } else {
        display.innerText = tryRoundNumber(operate(calculator.firstNum, calculator.secondNum, calculator.operator));
        clearCalculator();
        calculator.firstNum = +display.innerText;
        clickedEqual = true;
        executed = false;
    }
});

clearKey.addEventListener('click', () => {
    clearCalculator();
    display.innerText = '';
    executed = false;
    clickedEqual = false;
});

dotKey.addEventListener('click', () => {
    if (!display.innerText.includes('.')) {
        display.innerText += '.';
        clickedEqual = false;
    }
});

deleteKey.addEventListener('click', deleteDigit);
toggleKey.addEventListener('click', toggleNumberSign);

// FUNCTIONS
function operate(a, b, sign) {
  switch (sign) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
  }
}

function updateDisplay(e) {
    display.innerText += e.target.innerText;
}

// if operator has not been pressed, store the number as the first one. Else as the second number.
function storeNumber() {
    if (!calculator.operator) {
        calculator.firstNum = +display.innerText;
    } else {
        calculator.secondNum = +display.innerText;
    }
}

function deleteDigit() {
    if (display.innerText) {
        if (!calculator.operator) {
            calculator.firstNum = Number(calculator.firstNum.toString().slice(0, -1));
            if (calculator.firstNum === 0) {
                display.innerText = '';
            } else {
                display.innerText = calculator.firstNum;
            }
        } else if (calculator.operator && calculator.secondNum != null) {
            calculator.secondNum = Number(calculator.secondNum.toString().slice(0, -1));
            if (calculator.secondNum === 0) {
                display.innerText = '';
            } else {
                display.innerText = calculator.secondNum;
            }
        }
    }
}

function toggleNumberSign() {
    if (display.innerText) {
        if (!calculator.operator) {
            calculator.firstNum = -calculator.firstNum;
            if (calculator.firstNum === 0) {
                display.innerText = '0';
            } else {
                display.innerText = calculator.firstNum;
            }
        } else if (calculator.operator && calculator.secondNum != null) {
            calculator.secondNum = -calculator.secondNum;
            if (calculator.secondNum === 0) {
                display.innerText = '0';
            } else {
                display.innerText = calculator.secondNum;
            }
        }
    }
}

function storeOperator(e) {
    calculator.operator = e.target.innerText;
}

// if an operator has been pressed, the next number will clear the display first
function checkForOperator() {
    if (calculator.operator && executed === false) {
        display.innerText = '';
        executed = true;
    }
}

function clearCalculator() {
    calculator.firstNum = null;
    calculator.operator = null;
    calculator.secondNum = null;
}

function tryRoundNumber(num) {
    if (num.toString().length > 9) {
        return Math.round((num + Number.EPSILON) * 100000) / 100000;
    } else {
        return num;
    }
}

// Keyboard support
// use click() to simmulate mouse click
window.addEventListener('keydown', (e) => {
    if (!isNaN(e.key) && e.key !== ' ') {
        document.getElementById(`digit-${e.key}`).click();
    }

    const operations = {
        '+': 'add',
        '-': 'substract',
        '*': 'multiply',
        '/': 'divide'
    }

    if (Object.keys(operations).includes(e.key)) {
        document.getElementById(`operator-${operations[e.key]}`).click();
    }

    if (e.key === '.') {
        document.getElementById('dot').click();
    }

    if (e.key === '=' || e.key === 'Enter') {
        document.getElementById('equal').click();
    }

    if (e.key === 'c' || e.key === 'C') {
        document.getElementById('clear').click();
    }

    if (e.key === 'Backspace') {
        document.getElementById('delete').click();
    }

    if (e.key === 'Control') {
        document.getElementById('toggle').click();
    }
})