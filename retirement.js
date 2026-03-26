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

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const processEntries = (evt) => {
    let isValid = true;
    let years = 0;

    evt.preventDefault();
    // resetForm();

    // Validate Name
    if (!nameIn.value) {
        isValid = false;
        nameErr.textContent = "Please enter your name.";
    }
    // TODO: Validate Email
    if (!emailIn.value) {
        isValid = false;
        emailErr.textContent = "Please enter your email.";
    }
    // TODO: Validate Date
    if (!investIn.value) {
        isValid = false;
        investErr.textContent = "Please enter your investment.";
    }

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

const setTestData = () => {
    resetForm();
    /*  set default value for all input fields
        Setup the future date to 10 years from now:
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
    document.querySelectorAll("input").forEach(s => s.value = "");
    document.body.style.width = "350px";
};

document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);
});