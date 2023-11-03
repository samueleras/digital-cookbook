//SORT

const sort_dropdown = document.querySelector('#sort-dropdown');
const searchparam = document.querySelector('#search-input');

const sortRecipes = () => {

    const sort_mode = sort_dropdown.value;
    let searchparamValue = searchparam.value;

    let sorting = null;

    switch (sort_mode) {
        case "cDesc":
            sorting = { "page": 1, sorting: { "createdAt": -1 }, searchparam: searchparamValue };
            break;
        case "cAsc":
            sorting = { "page": 1, sorting: { "createdAt": 1 }, searchparam: searchparamValue };
            break;
        case "rDesc":
            sorting = { "page": 1, sorting: { "rating": -1 }, searchparam: searchparamValue };
            break;
        case "rAsc":
            sorting = { "page": 1, sorting: { "rating": 1 }, searchparam: searchparamValue};
            break;
        case "nDesc":
            sorting = { "page": 1, sorting: { "name": -1 }, searchparam: searchparamValue };
            break;
        case "nAsc":
            sorting = { "page": 1, sorting: { "name": 1 }, searchparam: searchparamValue };
            break;
        default:
            sorting = { "page": 1, sorting: { "createdAt": -1 }, searchparam: searchparamValue};
    }

    location.href = `./${JSON.stringify(sorting)}`;

};

//SEARCH
const searchform = document.querySelector('#form-search');

searchform.addEventListener("submit", async (e) => {

    e.preventDefault();
    
    let searchparamValue = searchparam.value;

    const sorting = { "page": 1, sorting: { "createdAt": -1 }, searchparam: searchparamValue };
    location.href = `./${JSON.stringify(sorting)}`;

});

//SAVE/UNSAVE
const savebutton = document.querySelector('#save');
const unsavebutton = document.querySelector('#unsave');

const saveRecipe = async (url) => {

    await fetch(url);

    if( savebutton.getAttribute("display") == "false"){
        savebutton.setAttribute("display", true);
        unsavebutton.setAttribute("display", false);
    } else {
        savebutton.setAttribute("display", false);
        unsavebutton.setAttribute("display", true);
    }

}


//DELETE
const deleteRecipe = async (url, recipe) => {
    await fetch(url);
    recipe.setAttribute("style", "display:none;");
}