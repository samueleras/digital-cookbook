const nav = document.querySelector(".flexcontainer-navbar")
const toggleBtn = document.querySelector("#toggle-nav");

toggleBtn.addEventListener("click", () => {
    const visibility = nav.getAttribute("data-visible");

    if(visibility === "false"){
        nav.setAttribute("data-visible", true);
        toggleBtn.setAttribute("menu-openend", true);
    } else {
        nav.setAttribute("data-visible", false);
        toggleBtn.setAttribute("menu-openend", false);
    }
});