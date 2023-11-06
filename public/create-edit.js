"use strict";

//Get Formular
const form = document.querySelector('#form-new-recipe');

//-----------------------//
//-----Create Recipe-----//
//-----------------------//
const recipename = document.querySelector('#name');
const preparation_time = document.querySelector('#preparation_time');
const full_recipe = document.querySelector('#full_recipe');
const submit_button = document.querySelector('button[type=submit]');


form.addEventListener("submit", (e) => {

    submit_button.disabled = true;
    console.log("test");

    if (inputError()) {
        e.preventDefault();
        submit_button.disabled = false;
    }

});

// Check and indicate wrong inputs
const inputError = () => {

    let error = false;
    const nameValue = recipename.value;
    const preptimeValue = preparation_time.value;
    const fullrecipeValue = full_recipe.value;

    if (nameValue === "") {
        formError('Name of recipe is missing', recipename);
        error = true;
    } else {
        formSucess(recipename);
    }

    if (preptimeValue === "") {
        formError('Preperation Time is missing', preparation_time);
        error = true;
    } else if (isNaN(preptimeValue)) {
        formError('Preperation time has to be numeric', preparation_time);
        error = true;
    } else {
        formSucess(preparation_time);
    }

    if (fullrecipeValue === "") {
        formError('Recipe body is missing', full_recipe);
        error = true;
    } else {
        formSucess(full_recipe);
    }

    return error;
}

//Error/Success Functions
function formError(message, element) {
    element.parentElement.classList.add("error");
    element.parentElement.querySelector('.errormessage').innerHTML = message;
}
function formSucess(element) {
    element.parentElement.classList.remove("error");
    element.parentElement.querySelector('.errormessage').innerHTML = "";
}


// Check file upload
let input = document.querySelectorAll("input[type=file]");

input[0].addEventListener('change', function (e) {

    let statusmessage = this.nextElementSibling;

    let fileExtension = this.files[0].name.split('.').pop();

    const allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    let allowedFormatsRegex = new RegExp(allowedFormats.join("|"), "i");

    if (allowedFormatsRegex.test(fileExtension)) {
        statusmessage.innerHTML = this.files[0].name + " uploaded";
        statusmessage.setAttribute('upload-status', 'success');
    } else {
        statusmessage.innerHTML = "Files of type " + fileExtension + " are not supported";
        statusmessage.setAttribute('upload-status', 'error');
    }
});

