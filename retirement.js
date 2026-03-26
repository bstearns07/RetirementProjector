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

const nameIn    = $("#client_name");
const emailIn   = $("#email");
const investIn  = $("#investment");
const addIn     = $("#monthly_add");
const rateIn    = $("#rate");
const dateIn    = $("#retirement_date");

const nameErr = $("#name_error");
const emailErr = $("#email_error");
const investErr = $("#investment_error");
const addErr = $("#add_error");
const rateErr = $("#rate_error");
const dateErr = $("#retire_date_error");

const errBox    = $("#error_message");
const statusMsg = $("#status_message");
const output    = $("#projection_output");
const form      = $("#projection_form");
const testData  = $("#test_data");

let projectionTimer = null;

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
    let isValid = true;
    let years = 0;

    evt.preventDefault();
    // resetForm();

    // Validate Name
    if (nameIn.value.trim() === "") {
        isValid = false;
        nameErr.textContent = nameIn.title; // Pull error message from title attribute
    }
    // TODO: Validate Email
    const emailPattern = /^[\w\.\-]+@[\w\.\-]+\.[a-zA-Z]+$/;
    if (emailIn.value.trim() === "") {
        isValid = false;
        emailErr.textContent = emailIn.title; // Pull error message from title attribute
    
    }
    else if (!emailPattern.test(emailIn.value.trim())) {
        isValid = false;
        emailErr.textContent = "Please enter a valid email address.";
    }

    if (investIn.value.trim() === "") {
        isValid = false;
        investErr.textContent = investIn.title; // Pull error message from title attribute
    }

    if (rateIn.value.trim() === "" || rateIn.value.trim() < 0 || rateIn.value.trim() > 20) {
        isValid = false;
        rateErr.textContent = rateIn.title; // Pull error message from title attribute
    }
    // TO DO: Make sure date is within 75 DOES NOT WORKKK
    if (retirement_date.value.trim() === "" || retirement_date.value < 0 || retirement_date.value > 75) {
        isValid = false;
        dateErr.textContent = dateIn.title; // Pull error message from title attribute
    }

    if (addIn.value.trim() === "") {
        isValid = false;
        addErr.textContent = addIn.title; // Pull error message from title attribute
    }else if(addIn.value.trim() < 0){
        isValid = false;
        addErr.textContent = "How much you add each month, not less than 0.";
    }

    // TODO: Validate Date

    // TODO: Numeric Validations

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
    investIn.value = "10000";
    addIn.value = "500";
    rateIn.value = "5";
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
    document.querySelectorAll(".error").forEach(s => s.textContent = "*");
    clearTimeout(projectionTimer);
    document.querySelectorAll("input").forEach(s => s.value = "");
    document.body.style.width = "350px";
    statusMsg.style.color = "red";
    nameIn.focus();
};

// add DOMContentLoaded listener's for buttons and ENTER button functionality
document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);
});