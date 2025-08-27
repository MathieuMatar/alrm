document.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG") {
        e.target.remove();
    }
}, true);
document.currentScript.remove();

function move(direction) {
    const items = document.querySelectorAll(".items img");

    const active = document.querySelector(".items img.active");
    let newIndex = Array.from(items).indexOf(active);

    if (direction === "left") {
        newIndex = (newIndex - 1 + items.length) % items.length;
    } else {
        newIndex = (newIndex + 1) % items.length;
    }

    active.classList.remove("active");
    items[newIndex].classList.add("active");
    document.querySelector(".main").src = items[newIndex].src;

    //also scroll items by the width of .items img + 10px
    document.querySelector(".items").scrollLeft = items[newIndex].offsetLeft - 10;
}
const items = document.querySelectorAll(".items img");
//set onclick for items
items.forEach(item => {
    item.addEventListener("click", () => {
        const active = document.querySelector(".items img.active");
        if (active) active.classList.remove("active");
        item.classList.add("active");
        document.querySelector(".main").src = item.src;
        document.querySelector(".items").scrollLeft = item.offsetLeft - 10;
    });
});