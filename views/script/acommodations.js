
const accomodations = document.querySelector('.accomodations');
const rooms = document.querySelector('.rooms');
const title = document.getElementById('title');
const description = document.getElementById('description');

function set(element, event) {
    event.preventDefault();
    title.textContent = element.getAttribute('title');
    description.textContent = element.getAttribute('description');
    history.pushState({}, '', element.getAttribute('href'));

    const activeAcc = element.getAttribute('href').split('/')[2];
    if (activeAcc) {
        rooms.className = 'rooms ' + activeAcc;
        accomodations.className = 'accomodations ' + activeAcc;
    } else {
        rooms.className = 'rooms';
        accomodations.className = 'accomodations';
    }
}