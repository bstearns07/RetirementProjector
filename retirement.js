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

// Defer in HTML allows us to grab these immediately at the top
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
 * @param evt  The submit button event
 *
 * @returns {void}
 **********************************************************************************************************************/
const processEntries = (evt) => {
    let isValid = true; // defines whether data validation passed
    let years = 0;      // keeps count of num of years for date calculations

    // prevent form submission and clear any errors displayed
    evt.preventDefault();
    clearErrors();

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
    // Make sure date is within 75 DOES NOT WORKKK
    const retireYear = new Date(dateIn.value).getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsUntilRetirement = retireYear - currentYear;
    
    if (dateIn.value.trim() === "" || yearsUntilRetirement < 0 || yearsUntilRetirement > 75) {
        isValid = false;
        dateErr.textContent = dateIn.title; // Pull error message from title attribute
    }

    // TODO: Numeric Validations
        document.querySelectorAll(".numericInput").forEach(numericInput => {
        if (numericInput.value.trim() === "" || isNaN(Number(numericInput.value.trim()))) {
            isValid = false;
            numericInput.nextElementSibling.textContent = numericInput.title;
        }
    })

    /* TODO: Code try-catch logic
        try
            if not valid then throw error "Please correct the entries highlighted below."
            document.body.style.width = "350px";
            startProjection(nameIn.value, invest, add, rate, years);
         catch(e)
            set the body width to 700px (like code above)
            errBox.innerText = e.message;
     */
    if (!isValid) {
        evt.preventDefault();
        document.body.style.width = "750px";
        nameIn.focus();
        output.innerHTML = "";
        statusMsg.textContent = "Please correct the entries highlighted below.";
    } else {
        startProjection(nameIn.value, investIn.value, addIn.value, rateIn.value, years);
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
    statusMsg.textContent = `Live Projection: ${name}`;
    statusMsg.style.color = "red";
    let count = 1;

    // TO-DO: startYear = the current year
    const startYear = new Date().getFullYear();

    let formattedBal = formatter.format(bal);
    output.innerHTML = `Year ${startYear} = ${formattedBal}`;

    /* TODO: setup an interval to do the following
        for (let i = 0; i < 12; i++) {
            bal = ((bal + add) * (1 + (rate / 12 / 100))).toFixed(2);
        }
        format the balance like the starting code above
        update the output like the starting code above
        if count is >= years
            clear interval
            update the statusMsg like the starting code above
            set the statusMsg color to green like the starting code above
        end if
        add one to the count
     */
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
 * Function that clears all input data and errors messages
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
    /* TODO:
        Using textContent clear the following error spans
            errBox (#error_message)
            output (#projection_output)
            statusMsg (#status_message)
        clear the interval projectionTimer (Ch 8)
        reset all the error spans back to *
            document.querySelectorAll(".error").forEach(s => s.textContent = "*");
        set the body width to 350px (see code example above)
        set the statusMsg to red (see code example above)
        set the focus to the name input field (Ch 9)
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
}

// add DOMContentLoaded listener's for button functionality
document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);
});
