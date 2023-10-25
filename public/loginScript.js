"use strict";

//Get Formular
const formlogin = document.querySelector('#formlogin');

//-----------------------//
//---------LOGIN---------//
//-----------------------//
const user = document.querySelector('#user');
const password = document.querySelector('#password');
const login_successful = document.querySelector('#successful');

formlogin.addEventListener("submit", async (e) => {

    let usernameValue = user.value.trim();
    let passwordValue = password.value.trim();
    e.preventDefault();

    await checkLogin(usernameValue, passwordValue);

});

// login & redirect intialized by server if credentials are correct
async function checkLogin(usernameValue, passwordValue) {

    let response = await fetch('/login-submit', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": usernameValue, "password": passwordValue })
    })

    response = await response.json();

    if (response.success) {
        login_successful.setAttribute("data-visible", true);
        setTimeout(() => location.href = '/my-recipes', 2000);
    }

    validateInputsLogin(usernameValue, passwordValue, response.success);
}

// Check and indicate wrong inputs
const validateInputsLogin = (usernameValue, passwordValue, success) => {
    console.log("test");
    console.log(success);
    //Login
    if (usernameValue === "") {
        formError('Username is missing', user);
    } else {
        formSucess(user);
    }

    if (passwordValue === "") {
        formError('Password is missing', password);
    } else if (success) {
        formSucess(password);
    } else {
        formError('Password or Username is wrong', password);
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



