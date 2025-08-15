
const accomodations = document.querySelector('.accomodations');
const rooms = accomodations.querySelectorAll('.accomodations a');
const singleRooms = document.querySelectorAll('.rooms a');
const showAllButton = document.getElementById('show-all');
const title = document.getElementById('title');
const description = document.getElementById('description');

rooms.forEach(room => {
    room.addEventListener('click', (event) => {
        event.preventDefault();
        const roomElements = Array.from(accomodations.children);
        const clickedIndex = roomElements.indexOf(room);
        const centerIndex = Math.floor(roomElements.length / 2);

        // Rearrange the clicked room to the center
        if (clickedIndex !== centerIndex) {
            accomodations.removeChild(room);
            accomodations.insertBefore(room, roomElements[clickedIndex < centerIndex ? centerIndex + 1 : centerIndex]);
        }

        // Update the title and description
        title.textContent = room.getAttribute('title');
        description.textContent = room.getAttribute('description');

        //push to url accomodation code
        history.pushState({}, '', room.getAttribute('href'));


        accomodations.classList.add('active');

        singleRooms.forEach(singleRoom => {
            singleRoom.style.display = singleRoom.getAttribute('acc') === room.id ? 'block' : 'none';
        });
    });
    if (room.getAttribute('href') === window.location.pathname) room.click();
});

showAllButton.addEventListener('click', (event) => {
    event.preventDefault();
    accomodations.classList.remove('active');
    title.textContent = showAllButton.getAttribute('title');
    description.textContent = showAllButton.getAttribute('description');
    history.pushState({}, '', showAllButton.getAttribute('href'));
    singleRooms.forEach(room => room.style.display = 'block');
});