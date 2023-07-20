let nav = 0;
let clicked = null;
//if there are events then get them and parse json if not set empty
//events will be stored in this array
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

//calendar reference
const calendar = document.getElementById('calendar');
// new event div
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');

const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
//weekdays
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


function load() {
    // get current date
    const dt = new Date();

    //set variables to the date that is currently choosen
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    //extract data from current dates
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    //get first day of the month
    const firstDayOfTheMonth = new Date(year, month, 1);

    //get number of the last day of the month
    const daysInMonth = new Date(year, month +1, 0).getDate();
    
    //get string representation of first day of the month
    const dateString = firstDayOfTheMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    // reset calendar after each load so the function doesnt create another calendar after changing the month
    calendar.innerHTML = '';


    //populate header with name of the current month
    document.getElementById('monthDisplay').innerText = 
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`; //string interpolation
    //create padding days
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    
    for(let i = 1; i<= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month+1}/${i - paddingDays}/${year}`;
        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventForDay = events.find(e => e.date === dayString);

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }
}

function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
    } else {
        newEventModal.style.display = 'block';
    }
    backDrop.style.display = 'block';
}
function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
}

function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');
        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
}


function initButtons() {
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    })
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
    

}

initButtons();
load();