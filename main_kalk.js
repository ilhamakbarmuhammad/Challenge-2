const displayNode = document.getElementById('display');
const btnNums = document.getElementsByClassName('btn-num');
const btnOperators = document.getElementsByClassName('btn-operator');
let inputStatus = 'i';  // 'i': input process, '=': calculation has been executed

function getValue(node) {
    return node.textContent;
}

function setInputStatus(keyInput) {
    if (keyInput === '=' || keyInput === 'Enter') {
        inputStatus = '=';
    } else {
        inputStatus = 'i';
    }
}

function getLastNum() {
    /**
     * get last number from display
     */
    const value = getValue(displayNode);
    let lastNum = value.split('+').pop();
    lastNum = lastNum.split('-').pop();
    lastNum = lastNum.split('x').pop();
    lastNum = lastNum.split('/').pop();

    return lastNum;
}

function backspace() {
    // will return string display that's been sliced by 1 character
    let displayValue = getValue(displayNode)
    if (displayValue.length === 1) return '0';

    return displayValue.slice(0,-1);
}

function validateKey(key) {
    /**  
     * It will check if the input is valid 
     * and will return the valid displayedValue
     */

    const displayedValue = getValue(displayNode);

    // only allowed key can proceed
    // "ye shall not pass if ye not qualified!" (No need to worry Gandalf will oversee this function)
    if (!(!isNaN(key) || key==='+' || key==='-' || key==='/' || key==='x' || key==='*' || key==='Backspace' || key==='.' || key==='Enter' || key==='=')) return displayedValue; 
    
    if (key === '=' || key === 'Enter') {
        return calc();
    }
    
    // if the input is a number then always valid
    if (!isNaN(key)) {
        if (displayedValue === '0' || inputStatus === '=') return key;
        return displayedValue + key;
    } 

    key = key === '*' ? 'x' : key;
    if (key === 'x' || key === '-' || key === '+' || key === '/') {
        const lastInput = displayedValue.slice(-1);
        // if the last input is not a number then not valid and will be replaced
        if (isNaN(lastInput)) {
            return displayedValue.slice(0, -1) + key;  
        } 
    }

    if (key === '.') {
        const lastNum = getLastNum();
        if (inputStatus === '=') return "0."
        if (lastNum.indexOf('.') >= 0) return displayedValue;
    }

    if (key === 'Backspace') {
        return backspace();
    }

    return displayedValue + key;
}

function calc() {
    /**
     * To do calculation when '=' is clicked
     */
    let value = getValue(displayNode);
    // validation
    // if the last char in displayed value is not a number then it will be removed
    const lastChar = value.slice(-1);
    if (isNaN(lastChar)) {
        value = value.slice(0, -1);
    } 

    const equation = value.replaceAll('x', '*');
    const result = eval(equation);
    displayNode.textContent = result;
    return result;
}

function inputButton() {
    /**
     * To display button inputs to screen
     */
    const keyInput = getValue(this);
    const validInput = validateKey(keyInput);

    displayNode.textContent = validInput;
    setInputStatus(keyInput);
}

const inputKey = (e) => {
    /**
     * to display keyboard input to screen
     */
    let validValue = validateKey(e.key);

    displayNode.textContent = validValue;
    setInputStatus(e.key);
}



// EventListener for keyboard input
document.addEventListener('keyup', inputKey);

// EventListener for button input
// numbers
for (let i=0; i<btnNums.length; i++) {
    btnNums[i].addEventListener('click', inputButton);
}
// operators
for (let i=0; i<btnOperators.length; i++) {
    btnOperators[i].addEventListener('click', inputButton);
}
// equal
document.getElementById('equal').addEventListener('click', inputButton);
// AC or reset
document.getElementById('ac').addEventListener('click', () => {
    displayNode.textContent = 0;
});
// backspace button
document.getElementById('backspace').addEventListener('click', () => {
    displayNode.textContent = backspace();
})