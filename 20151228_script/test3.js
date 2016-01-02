var menu = document.querySelector(".menu");
var state = false;
window.addEventListener("resize", function() {
    browserSize = window.innerWidth;
});
var menu_on = function() {
    menu.setAttribute("class", "menu on");
    if(brwoserSize > 720) {
        body.setAttribute("class", "menu on");
    }
    state = true;
};
var menu_off = function() {
    menu.setAttribute("class", "menu off");
    if(brwoserSize > 720) {
        body.setAttribute("class", "menu off");
    }
    state = false;
};
if(state === false) {
    menu_on();
} else {
    menu_off();
}