//SORT

const sortform = document.querySelector('#form-sort');
const sort_dropdown = document.querySelector('#sort-dropdown');

const sortRecipes = async () => {

    const sort_mode = sort_dropdown.value;

    let sorting = null;

    switch (sort_mode) {
        case "cDesc":
            sorting = { "page": 1, sorting: { "createdAt": -1 } };
            break;
        case "cAsc":
            sorting = { "page": 1, sorting: { "createdAt": 1 } };
            break;
        case "rDesc":
            sorting = { "page": 1, sorting: { "rating": -1 } };
            break;
        case "rAsc":
            sorting = { "page": 1, sorting: { "rating": 1 } };
            break;
        case "nDesc":
            sorting = { "page": 1, sorting: { "name": -1 } };
            break;
        case "nAsc":
            sorting = { "page": 1, sorting: { "name": 1 } };
            break;
        default:
            sorting = { "page": 1, sorting: { "createdAt": -1 } };
    }

    location.href = `./${JSON.stringify(sorting)}`;

};

//SEARCH
const searchform = document.querySelector('#form-search');