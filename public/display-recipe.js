
//SAVE/UNSAVE
const savebutton = document.querySelector('#save');
const unsavebutton = document.querySelector('#unsave');

const saveRecipe = async (url, page) => {

    await fetch(url);

    if( savebutton.getAttribute("display") == "false"){
        savebutton.setAttribute("display", true);
        unsavebutton.setAttribute("display", false);
    } else {
        savebutton.setAttribute("display", false);
        unsavebutton.setAttribute("display", true);
    }

}