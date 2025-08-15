
const gallery = document.querySelector('.gallery');
const slider = document.querySelector(`.slider`);
const plusImg = document.querySelector('.plus-img');

function moveGallery(direction) {
    if (direction === 1) {
        const firstImg = slider.querySelector('img:first-child');
        plusImg.appendChild(firstImg);
        const firstplusImg = plusImg.querySelector('img:first-child');
        slider.insertBefore(firstplusImg, plusImg);

    } else if (direction === -1) {
        const thirdImg = slider.querySelector('img:nth-child(3)');
        plusImg.insertBefore(thirdImg, plusImg.firstChild);
        const lastImg = plusImg.querySelector('img:last-child');
        slider.insertBefore(lastImg, slider.firstChild);
    }

    const currentFirstImage = slider.querySelector('img:first-child');
    gallery.style.backgroundImage = `url('${currentFirstImage.src}')`;
}

const showenImages = document.querySelectorAll('.slider img');
showenImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        gallery.style.backgroundImage = `url('${img.src}')`;
        //put current image at the first position
        const firstImg = slider.querySelector('img:first-child');
        if (img !== firstImg) {
            slider.insertBefore(img, firstImg);
        }
        stopGalleryInterval();
    });
});

// moveGallery(1) every 5 seconds until i click the button for the first time then stop
let interval = setInterval(() => {
    moveGallery(1);
}, 5000);

function stopGalleryInterval() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

document.querySelectorAll('.controller svg').forEach(btn => {
    btn.addEventListener('click', stopGalleryInterval);
});
