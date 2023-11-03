"use strict";

//Get Formular
const form = document.querySelector('#form-new-recipe');

//-----------------------//
//-----Create Recipe-----//
//-----------------------//
const recipename = document.querySelector('#name');
const preparation_time = document.querySelector('#preparation_time');
const full_recipe = document.querySelector('#full_recipe');


form.addEventListener("submit", (e) => {

    console.log("submitted")

    if (inputError()) {
        e.preventDefault();
        console.log("prevent")
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



