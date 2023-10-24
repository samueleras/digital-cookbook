"use strict";

//Get Formular
const formsignup = document.querySelector('#formsignup');

//------------------------//
//---------SIGNUP---------//
//------------------------//
const newuser = document.querySelector('#newuser');
const newpassword = document.querySelector('#newpassword');
const newpassword2 = document.querySelector('#newpassword2');
const signup_successful = document.querySelector('#signup-successful');
let newusernameValue = "";
let newpasswordValue = "";
let newpasswordValue2 = "";

formsignup.addEventListener("submit", async (e) => {

    e.preventDefault();
    console.log("frei");

/*     let response = await fetch('/signup-submit', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": newusernameValue, "password": newpasswordValue })
    })

    console.log("test");
    console.log(response);

    if (response.success == "false") {
        validateInputsSignUp(response.user, response.password)
    } else {
        signup_successful.setAttribute("data-visible", true);
    } */

});

//Prüfe INPUTS Signup
const validateInputsSignUp = (user) => {

    newusernameValue = newuser.value.trim();
    newpasswordValue = newpassword.value.trim();
    newpasswordValue2 = newpassword2.value.trim();
    let state = { wrongInputs: false };

    if (newusernameValue === "") {
        formError('Username is missing', newuser);
        state = { wrongInputs: true };
    } else {
        if (user === "taken") {
            formError('Username is already taken', newuser);
            state = { wrongInputs: true };
        } else {
            formSucess(newuser);
        }
    }

    if (newpasswordValue === "") {
        formError('Password is missing', newpassword);
        state = { wrongInputs: true };
    } else if (newpasswordValue.length < 8) {
        formError('Password is too short', newpassword);
        state = { wrongInputs: true };
    }
    else {
        formSucess(newpassword);
    }

    if (newpasswordValue2 === "") {
        formError('Password is missing', newpassword2);
        state = { wrongInputs: true };
    } else if (newpasswordValue !== newpasswordValue2) {
        formError('Passwords don´t match', newpassword2);
        state = { wrongInputs: true };
    }
    else {
        formSucess(newpassword2);
    }

}

//Prüfe Name bei Signup
/* async function checkNameSignup() {

    let response = await fetch('/signup-checkname', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": newusernameValue })
    })

    response = await response.json();

    if (response.user == "false") {
        return false;
    }
    return true;
} */

//Error/Success Functions
function formError(message, element) {
    element.parentElement.classList.add("error");
    element.parentElement.classList.remove("success");
    element.parentElement.querySelector('.errormessage').innerHTML = message;
}
function formSucess(element) {
    element.parentElement.classList.add("success");
    element.parentElement.classList.remove("error");
    element.parentElement.querySelector('.errormessage').innerHTML = "";
}



