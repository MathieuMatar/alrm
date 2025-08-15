//banner
const images = document.querySelectorAll('.banner-images img');
const banner = document.querySelector('.banner');
let currentIndex = 0;
let interval;

function setActiveImage(index) {
    images[currentIndex].classList.remove('active');
    currentIndex = index;
    images[currentIndex].classList.add('active');
    banner.style.backgroundImage = `url('${images[currentIndex].src}')`;
}

function changeImage() {
    setActiveImage((currentIndex + 1) % images.length);
}

// Initialize first image
setActiveImage(currentIndex);

// Start slideshow
function start() {
    if (!interval) interval = setInterval(changeImage, 3000);
}

// Stop slideshow
function stop() {
    clearInterval(interval);
    interval = null;
}

// Click to change image manually
images.forEach((img, index) => {
    img.addEventListener('click', () => {
        setActiveImage(index);
        stop();
        start();
    });
});

// Observe banner visibility
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) start();
    else stop();
});

observer.observe(banner);







//accomodations

const galleryStates = {};

function moveGallery(className, direction) {
    const galleries = document.querySelectorAll(`.${className}`);
    const maxItems = Math.max(...[...galleries].map(g => g.children.length));
    const index = (galleryStates[className] ?? 0) + direction;
    galleryStates[className] = (index + maxItems) % maxItems;

    galleries.forEach(gallery => {
        const offset = gallery.offsetWidth;
        [...gallery.children].forEach((el, i) => {
            el.style.transform = `translateX(${(i - galleryStates[className]) * offset}px)`;
        });
    });
}

//moveGallery('gal1', 0);



//venues

//load all images first
const tabs = document.querySelectorAll('.venues-tabs div');

tabs.forEach(tab => {
    const imgUrl = tab.getAttribute('img');
    const img = new Image();
    img.src = imgUrl;
});
const venueInfos = document.querySelectorAll('.venue-info');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const infoId = tab.getAttribute('info');
        venueInfos.forEach(info => {
            info.classList.remove('active');
            if (info.id === infoId) {
                info.classList.add('active');
            }
        });

        const imgUrl = tab.getAttribute('img');
        const venueImage = document.querySelector('.venues-image');
        venueImage.style.backgroundImage = `url('${imgUrl}')`;
        venueImage.setAttribute('href', infoId);
    });
});





//activities


const acts = document.querySelectorAll('.activity');
// Preload images for the second column
acts.forEach(act => {
    const imgUrl = act.getAttribute('img');
    const img = new Image();
    img.src = imgUrl;
});

// Handle click events on activity items
acts.forEach(item => {
    item.addEventListener('click', () => {
        // Toggle active class
        item.classList.toggle('active');

        // Update background image of the second column
        const imgUrl = item.getAttribute('img');
        document.querySelector('.activities>div:nth-child(2)').style.backgroundImage = `url('${imgUrl}')`;

        // Close other items
        document.querySelectorAll('.activity').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
    });
});