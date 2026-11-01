const display = document.getElementById("display");

let expression = "";

function updateDisplay() {
    display.textContent = expression || "0";
}

function append(value) {

    const operators = ["+", "-", "*", "/"];

    // Prevent two operators being entered consecutively
    if (operators.includes(value)) {
        if (expression === "" && value !== "-") return;

        if (operators.includes(expression.slice(-1))) {
            expression = expression.slice(0, -1);
        }
    }

    // Prevent multiple decimal points in one number
    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) return;
    }

    expression += value;
    updateDisplay();
}

function clearDisplay() {
    expression = "";
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculator() {
    try {
        if (!expression) return;

        // Convert percentages into decimal values
        let calculation = expression.replace(
            /(\d+\.?\d*)%/g,
            "($1/100)"
        );

        // Allow only mathematical characters
        if (!/^[0-9+\-*/(). ]+$/.test(calculation)) {
            throw new Error("Invalid expression");
        }

        // Calculate the result
        let result = Function(
            '"use strict"; return (' + calculation + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Math error");
        }

        expression = String(
            Number(result.toPrecision(12))
        );

        updateDisplay();

    } catch (error) {
        display.textContent = "Error";
        expression = "";
    }
}