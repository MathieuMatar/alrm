//on page load remove hidden header after 2 seconds remove the class hidden header from the element
window.onload = function () {
    document.querySelector(".animating").classList.remove("animating");
    setTimeout(function () {
        const scroll = document.querySelector(".scroll");
        //make position relative
        scroll.style.height = "auto";
        scroll.style.position = "relative";
        document.querySelector(".hidden-header").classList.remove("hidden-header");
        document.querySelector("footer").classList.add("show");
        document.querySelector(".h3").style.opacity = 1;
        //document.querySelector(".animating").classList.remove("animating");
    }, 2000);
};

const WElements = document.querySelectorAll(".single");

function openGallery(text) {
    const link = `/gallery/${text}`;
    //open link
    window.location.href = link;
}