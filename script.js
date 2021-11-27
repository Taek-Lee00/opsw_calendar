const Weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
const calendar = document.getElementById('calendar');
const dayList = document.getElementById('dayList');

let moveMonth = 0;

function openList(eventDay) {
    const event = eventDay;
    const eventList = document.createElement('div');
    eventList.classList.add('List');
    const eventtitle = document.createElement('h2');
    eventtitle.classList.add('List-title')
    eventtitle.innerText = eventDay.date;
    dayList.append(eventtitle);
    for (let k = 0 ; k<eventDay.lists.length; k++){
        const oneList = document.createElement('div');
        oneList.createElement('input',{type : "checkbox",id:"checkbox",})
        oneList.createElement('label',{for : "cb",})
        oneList.innerText = eventDay.lists[k];
        eventList.appendChild(oneList);
    }
        dayList.appendChild(eventList);
}

function setDate() {
    const date = new Date();
    date.setMonth(new Date().getMonth() + moveMonth);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysTotal = new Date(year, month + 1, 0).getDate();
    const dayStart = new Date(year, month, 1);
    const daysEmpty = weekdays.indexOf(dayStart.toLocaleDateString('en-us', { weekday: 'long' }).split(', ')[0]);
    document.getElementById('monthReset').innerText = `${year}.${month}`

    for (let i = 0; i < daysEmpty; i++) {
        const dayContent = document.createElement('div');
        dayContent.classList.add('dayEmpty');
        dayContent.classList.add('day');
        calendar.appendChild(dayContent);
    }

    for (let i = 0; i < daysTotal; i++) {
        const dayContent = document.createElement('div');
        dayContent.classList.add('day');
        if (i + 1 === day && moveMonth === 0)
            dayContent.id = 'currentDay';
        dayContent.innerText = i + 1;
        if (i + 1 === day && moveMonth === 0)
            dayContent.classList.add('currentDay');
        const eventCheck = `${year}-${month}-${i + 1}`
        const eventDay = events.find(e => e.date === eventCheck)
        if(eventDay !== null){
            const eventList = document.createElement('div');
            eventList.classList.add('List');
            for (let k = 0 ; k<eventDay.lists.length; k++){
               const oneList = document.createElement('div');
               //oneList.createElement('input',{type : "checkbox",id:"checkbox",})
               //oneList.createElement('label',{for : "cb",})
               oneList.innerText = eventDay.lists[k];

                eventList.appendChild(oneList);
            }
             dayContent.appendChild(eventList);
        }
        dayContent.addEventListener('click',() => openList(eventDay))
        calendar.appendChild(dayContent);
    }


}