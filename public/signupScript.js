/* "use strict"; */

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

    newusernameValue = newuser.value.trim();
    newpasswordValue = newpassword.value.trim();
    newpasswordValue2 = newpassword2.value.trim();

    let response = await fetch('/signup-submit', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": newusernameValue, "password": newpasswordValue, "password2": newpasswordValue2 })
    })

    response = await response.json();

    if (response.success) {
        signup_successful.setAttribute("data-visible", true);
        setTimeout(() => location.href = '/login', 2000);
    }

    validateInputsSignUp(response.user_available, response.password, response.password2)
});

//Prüfe INPUTS Signup
const validateInputsSignUp = (user_available, password, password2) => {

    let state = { wrongInputs: false };

    if (newusernameValue === "") {
        formError('Username is missing', newuser);
        state = { wrongInputs: true };
    } else {
        if (user_available) {
            formSucess(newuser);
        } else {
            formError('Username is already taken', newuser);
            state = { wrongInputs: true };
        }
    }

    if (password == "missing") {
        formError('Password is missing', newpassword);
        state = { wrongInputs: true };
    } else if (password == "tooshort") {
        formError('Password is too short', newpassword);
        state = { wrongInputs: true };
    }
    else {
        formSucess(newpassword);
    }

    if (password2 == "missing") {
        formError('Password is missing', newpassword2);
        state = { wrongInputs: true };
    } else if (password2 == "notmatching") {
        formError('Passwords don´t match', newpassword2);
        state = { wrongInputs: true };
    }
    else {
        formSucess(newpassword2);
    }

}

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



