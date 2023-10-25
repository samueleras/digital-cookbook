"use strict";

//Get Formular
const form = document.querySelector('#form-new-recipe');

//-----------------------//
//-----Create Recipe-----//
//-----------------------//
const name = document.querySelector('#recipe-name');
const image_link = document.querySelector('#image');
const onestar = document.querySelector('#1star');
const twostar = document.querySelector('#2star');
const threestar = document.querySelector('#3star');
const fourstar = document.querySelector('#4star');
const fivestar = document.querySelector('#5star');
const difficulty = document.querySelector('#difficulty');
const preparation_time = document.querySelector('#preparation-time');
const full_recipe = document.querySelector('#recipe');


form.addEventListener("submit", async (e) => {

/*     let usernameValue = user.value.trim();
    let passwordValue = password.value.trim(); */
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



