const tabs = document.querySelectorAll('.tab');
const singleTabs = document.querySelectorAll('.single-tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        singleTabs.forEach(st => st.classList.remove('active'));
        const toshow = document.getElementById(tab.getAttribute('data-tab'));
        toshow.classList.add('active');
        tab.classList.add('active');
    });
});

const galleryImages = document.querySelectorAll('#gallery img');
galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        galleryImages.forEach(i => i.classList.remove('active'));
        img.classList.add('active');
        const backgroundStyle = document.getElementById('background-style');
        const styleContent = `html { background-image: url('${img.src}'); }`;
        backgroundStyle.innerHTML = styleContent;

    });
});

const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
let currentIndex = 0;
const totalImages = galleryImages.length;
function updateGallery() {
    galleryImages.forEach((img, index) => {
        img.classList.remove('active');
        if (index === currentIndex) {
            img.classList.add('active');
        }
    });
    const backgroundStyle = document.getElementById('background-style');
    const styleContent = `html { background-image: url('${galleryImages[currentIndex].src}'); }`;
    backgroundStyle.innerHTML = styleContent;
}
leftButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateGallery();
});
rightButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalImages;
    updateGallery();
});