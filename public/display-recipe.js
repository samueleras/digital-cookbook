
//SAVE/UNSAVE
const savebutton = document.querySelector('#save');
const unsavebutton = document.querySelector('#unsave');

const saveRecipe = async (id) => {

    const button = document.querySelector(`#savetoggle_${id}`);

    let url;

    if( button.getAttribute("class") == "save"){
        button.setAttribute("class", "unsave");
        url = `/recipe/save/${id}`;
    } else {
        button.setAttribute("class", "save");
        url = `/recipe/unsave/${id}`;
    }

    await fetch(url);
}
