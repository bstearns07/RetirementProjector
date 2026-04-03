/**********************************************************************************************************************
 * Program............: Smartwatch FAQ
 * Programmers........: Ben Stearns and Isaiah Guilliatt
 * Date...............: 3-26-26
 * GitHub Repo........: https://github.com/bstearns07/RetirementProjector
 * Program Summary....: a JavaScript web application for calculating and simulating the growth of a retirement
 *                      account
 * File Description...: defines the JavaScript logic for handling image swaps and collapsing text on button clicks
 **********************************************************************************************************************/

"use strict";

/***********************************************************************************************************************
 * Shorthand utility for selecting the first DOM element that matches a CSS selector.
 *
 * @param {string} selector - A valid CSS selector string used to query the DOM.
 * @returns {Element|null} The first Element within the document that matches the selector,
 * or null if no matches are found.
 *
 * @example
 * const button = $('#submitBtn');
 * if (button) {
 *     button.textContent = 'Submitted';
 * }
 * ********************************************************************************************************************/
const $ = selector => document.querySelector(selector);

// cache DOM elements
const nameIn    = $("#client_name");        // input element for the user's name
const emailIn   = $("#email");              // input element for the user's email
const investIn  = $("#investment");         // input element for the user's initial investment
const addIn     = $("#monthly_add");        // input element for the user's monthly contribution
const rateIn    = $("#rate");               // input element for the user's yearly interest rate
const dateIn    = $("#retirement_date");    // input element for the user's retirement date

const nameErr = $("#name_error");           // span element displaying error msg's for user's name
const emailErr = $("#email_error");         // span element displaying error msg's for user's email
const investErr = $("#investment_error");   // span element displaying error msg's for user's initial invest
const addErr = $("#add_error");             // span element displaying error msg's for user's monthly contrib
const rateErr = $("#rate_error");           // span element displaying error msg's for user's interest rate
const dateErr = $("#retire_date_error");    // span element displaying error msg's for user's retire date

const errBox    = $("#error_message");      // div for displaying an error msg at top of screen
const statusMsg = $("#status_message");     // h3 displaying "Live projection: {user's name}"
const output    = $("#projection_output");  // div displaying projection calculations
const form      = $("#projection_form");    // DOM element for entire form
const testData  = $("#test_data");          // test data btn

let projectionTimer = null;                    // timer used to display calculation year by year

// define a number formatting object that formats numbers in the form of US currency
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

/**********************************************************************************************************************
 * Function that processes user entries for valid data and throws an error if invalid data is found
 *
 * @param {SubmitEvent} evt  The submit button event
 *
 * @returns {void}
 **********************************************************************************************************************/
const processEntries = (evt) => {
    let isValid = true; // defines whether data validation passed
    let years = 0;      // keeps count of num of years for date calculations

    // prevent form submission and clear any errors and timers that are present
    evt.preventDefault();
    clearErrors();
    clearInterval(projectionTimer);

    // Validate Name
    if (nameIn.value.trim() === "") {
        isValid = false;
        nameErr.textContent = nameIn.title; // Pull error message from title attribute
    }

    // Validate Email
    const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (!emailPattern.test(emailIn.value.trim())) {
        isValid = false;
        emailErr.textContent = emailIn.title;
    }

    //  Validate Date
    // get the user's retirement date, today's date, and the difference in years
    const retirementDate = new Date(dateIn.value);
    const today = new Date();
    years = retirementDate.getFullYear() - today.getFullYear();

    // if the user's date is invalid, in the past, or > 75 years away, count as invalid
    // getTime() is more accurate than years. Otherwise, setting the retirement date to yesterday would be valid
    if (retirementDate.toString() === "Invalid Date" || retirementDate.getTime() - today.getTime() < 0 || years > 75) {
        isValid = false;
        dateErr.textContent = dateIn.title; // Pull error message from title attribute
    }

    // TODO: Numeric Validations
    // ensure interest rate is > 0 and <= 20
    if (rateIn.value < 0 || rateIn.value > 20){
        isValid = false;
        rateErr.textContent = rateIn.title;
    }

    // validate that all numeric fields are not empty, are numeric, and aren't < 0
    document.querySelectorAll(".numericInput").forEach(numericInput => {
        if (numericInput.value.trim() === "" || isNaN(Number(numericInput.value.trim())) || numericInput.value.trim() < 0) {
            isValid = false;
            numericInput.nextElementSibling.textContent = numericInput.title;
        }
    })

    // ensure that starting investment and monthly contribution aren't 0 at the same time
    if (investIn.value === "0" && addIn.value === "0"){
        isValid = false;
        investErr.textContent = "Investment and Monthly Add can't both be 0.";
        addErr.textContent = "Investment and Monthly Add can't both be 0.";
    }

    // if any data is invalid, throw an error and display it at the top of the screen
    // otherwise, store user's data in local storage and use it to start their projection
    try{
        if (!isValid) {
            throw new Error("Please correct the entries highlighted below.");
        }
        //storage user's data in local storage
        localStorage.name = nameIn.value;
        localStorage.email = emailIn.value;
        localStorage.investment = investIn.value;
        localStorage.monthlyAdd = addIn.value;
        localStorage.rate = rateIn.value;
        localStorage.date = dateIn.value;

        document.body.style.width = "350px";
        nameIn.focus();
        startProjection(nameIn.value, Number(investIn.value), Number(addIn.value), Number(rateIn.value), years);
    }
    catch (e){
        document.body.style.width = "700px";
        errBox.innerText = e.message;
    }
}

/**********************************************************************************************************************
 * Function that calculates how much the user's account will grow per year up to their retirement year
 *
 * Displays this information as output using a timer
 *
 * @param name  User's name
 * @param bal The user's starting retirement account balance
 * @param add The amount per month user will add to the account
 * @param rate The interest rate of the account
 * @param years Keeps track of year iteration count
 *
 * @returns {void}
 **********************************************************************************************************************/
const startProjection = (name, bal, add, rate, years) => {
    document.querySelectorAll(".error").forEach(s => s.textContent = "");
    let count = 1;  // tracks loop interaction count

    //set status message to display the user's name, and it's default color to red
    statusMsg.textContent = `Live Projection: ${name}`;
    statusMsg.style.color = "red";

    // TO-DO: startYear = the current year
    let startYear = new Date().getFullYear();

    // formate the user's starting balance to us currency and display as output
    let formattedBal = formatter.format(bal);
    output.innerHTML = `Year ${startYear} = ${formattedBal}`;

    // set the projection timer to calculate investment growth year to year, format as US currency and display
    projectionTimer = setInterval(() => {
        for (let i = 1; i <= 12; i++) {
            bal = ((bal + add) * (1 + (rate / 12 / 100))).toFixed(2);
        }
        formattedBal = formatter.format(bal);
        startYear++;
        output.innerHTML = `Year ${startYear} = ${formattedBal}`;

        // once the retirement year has been reach, clear the timer and set the status color to green
        if (count >= years){ statusMsg.textContent = "Calculation Complete!";
            clearInterval(projectionTimer);
            statusMsg.style.color = "green";
        }
        count++;
    },1000)
};

/**********************************************************************************************************************
 * Function that clears the form and loads valid test data into all input fields for testing
 *
 * @returns {void}
 **********************************************************************************************************************/
const setTestData = () => {
    resetForm();
    /*  set default value for all input fields
        Set up the future date to 10 years from now:
        (1) create a const variable named future and set it to the current date (Ch 8)
        (2) add 10 years to the future date variable (Ch 8)
        (3) use toISOString().split('T')[0] to display the future date (Ch 8)
     */
    // set default values for all input fields
    nameIn.value = "John Doe";
    emailIn.value = "john.doe@example.com";
    investIn.value = "100000";
    addIn.value = "500";
    rateIn.value = "5.5";
    const retireDate = new Date();
    retireDate.setFullYear(retireDate.getFullYear() + 10);
    dateIn.value = retireDate.toISOString().split('T')[0];
};

/**********************************************************************************************************************
 * Function that clears all input data, status messages, and errors messages from the screen
 *
 * @returns {void}
 **********************************************************************************************************************/
const resetForm = () => {
    /*
        clears all input fields
        clears the interval
        clears all errors
        set the body width to 350px (like code above)
        set the focus to the name input field
     */

    errBox.textContent = "";
    output.innerHTML = "";
    statusMsg.textContent = "";
    clearInterval(projectionTimer);
    document.querySelectorAll(".error").forEach(s => s.textContent = "*");
    document.querySelectorAll("input").forEach(s => s.value = "");
    document.body.style.width = "350px";
    statusMsg.style.color = "red";
    nameIn.focus();
};

/**********************************************************************************************************************
 * Function that clears all error messages
 *
 * @returns {void}
 **********************************************************************************************************************/
const clearErrors = () => {
    document.querySelectorAll(".error").forEach(s => s.textContent = "*");
    statusMsg.textContent = "";
    output.innerHTML = "";
    errBox.textContent = "";
}

// add DOMContentLoaded listener's for button functionality
document.addEventListener("DOMContentLoaded", () => {
    // load any data in local storage to pre-fill the fields
    nameIn.value = localStorage.name ?? "";
    emailIn.value = localStorage.email ?? "";
    investIn.value = localStorage.investment ?? "";
    addIn.value = localStorage.monthlyAdd ?? "";
    rateIn.value = localStorage.rate ?? "";
    dateIn.value = localStorage.date ?? "";

    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);
});
