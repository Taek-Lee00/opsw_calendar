let moveMonth = 0;
let clickdate = null;
let checklists = [];
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let alarmt = null;
let today = null;

const calendar = document.getElementById('calendar');
const dayList = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const alarmContainer = document.getElementById('alarmModal');
const currentTime = alarmContainer.querySelector('h3');
const setTime = alarmContainer.querySelector('input');

function getAlarm() {
  const setValue = setTime.value;
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const current = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  let eventa = events.filter(e => e.date === today);

  if (eventa.length !== 0) {
    var alist = eventa[0].lists;
    alist = alist.map(e => {
      if (e.indexOf('*/*At:') > 0)
        return e.split("*/*At:")[1]
    })

    alist.forEach(e => {
      if (current === e) {
        console.log("allarm");
        alarmContainer.classList.add('alarmOn');
      }
      else {
        alarmContainer.classList.remove('alarmOn');
      }
    })
  }
}

function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  currentTime.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function init() {
  getTime();
  setInterval(getTime, 1000);
  setInterval(getAlarm, 1000);
}

function openList(date) {
  clickdate = date;
  if (date === null)
    return
  backDrop.style.display = 'block';
  dayList.style.display = 'block';
  const event = events.find(e => e.date === clickdate);
  if (event) {
    if (event.lists.length !== 0) {
      const eventList = document.createElement('div');
      eventList.classList.add('List');
      eventList.id = 'List';
      const eventtitle = document.createElement('h2');
      eventtitle.id = 'List-title';
      eventtitle.innerText = "What I have to Do";
      if (event.lists) {
        for (let k = 0; k < event.lists.length; k++) {
          let container = document.createElement('div');
          let ckbox = document.createElement('input');
          ckbox.type = "checkbox";
          ckbox.id = 'ckid';
          ckbox.value = event.lists[k];
          // console.log(event.lists[k])
          let label = document.createElement('label')
          label.htmlFor = 'ckid';
          label.appendChild(document.createTextNode(event.lists[k]));
          container.appendChild(ckbox);
          container.appendChild(label);
          eventtitle.appendChild(container);
        }
        eventList.appendChild(eventtitle);
        dayList.appendChild(eventList);
      }
    }
    //document.getElementById('eventText').innerText = event.title;
    //document.getElementById('eventText').innerText = "IN WHERE";
    //deleteEventModal.style.display = 'block';
  } else {
    //dayList.style.display = 'block';
  }
  var checkbox = document.querySelectorAll("input");
  checkbox.forEach(e => e.addEventListener('change', function () {
    if (this.checked) {
      checklists.push(e.value);
      //console.log("chekced")
    }

    else {
      checklists.pop(e.value);
      //console.log("unchekced")
    }
  }

  ))
}

function setDate() {
  const dt = new Date();
  dt.setMonth(new Date().getMonth() + moveMonth);
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const dayStart = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const dateString = dayStart.toLocaleDateString('en-us', {
    weekday: 'long',
  });
  const daysEmpty = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  let dayNum = 35;
  if (daysEmpty + daysInMonth > 35) {
    dayNum = 42;
  }

  for (let i = 1; i <= dayNum; i++) {
    const dayContent = document.createElement('div');
    dayContent.classList.add('day');
    if (i <= daysEmpty) {
      dayContent.classList.add('prevday');
      const dayString = `${month}/${prevDaysInMonth - i + daysEmpty}/${year}`;
      dayContent.innerText = prevDaysInMonth + i - daysEmpty

      const eventForDay = events.find(e => e.date === dayString);

      if (i - daysEmpty === day && moveMonth === 0) {
        dayContent.id = 'currentDay';
      }
      if (eventForDay) {
        for (let k = 0; k < eventForDay.lists.length; k++) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.lists[k];
          dayContent.appendChild(eventDiv);
        }
      }

      dayContent.addEventListener('click', () => openList(dayString));
    }
    else if (i > daysEmpty && i <= daysInMonth + daysEmpty) {
      dayContent.classList.add('day');
      const dayString = `${month + 1}/${i - daysEmpty}/${year}`;
      dayContent.innerText = i - daysEmpty;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - daysEmpty === day && moveMonth === 0) {
        dayContent.id = 'currentDay';
        today = dayString;
      }


      if (eventForDay) {
        for (let k = 0; k < eventForDay.lists.length; k++) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.lists[k];
          dayContent.appendChild(eventDiv);
        }
      }

      dayContent.addEventListener('click', () => openList(dayString));
    }
    else {

      dayContent.classList.add('nextday');
      const dayString = `${month + 2}/${i - daysInMonth - daysEmpty}/${year}`;

      dayContent.innerText = i - daysInMonth - daysEmpty;

      const eventForDay = events.find(e => e.date === dayString);

      if (i - daysEmpty === day && moveMonth === 0) {
        dayContent.id = 'currentDay';
      }


      if (eventForDay) {
        for (let k = 0; k < eventForDay.lists.length; k++) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.lists[k];
          dayContent.appendChild(eventDiv);
        }
        
      }

      dayContent.addEventListener('click', () => openList(dayString));
    }

    calendar.appendChild(dayContent);
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  dayList.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clickdate = null;
  var element = null;
  var elements = document.querySelectorAll('[id]');
  //console.log(elements)
  elements.forEach(e => {
    if (e.id === 'List')
      return e.parentNode.removeChild(e)
  });
  setDate();
}

function rewriteModal() {
  events = events.filter(e => e.date !== clickdate);
  localStorage.setItem('events', JSON.stringify(events));
  eventTitleInput.classList.remove('error');
  dayList.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  setDate();
  openList(clickdate);
  setDate();
}

function saveList() {
  if (eventTitleInput.value) {
    let event = events.find(e => e.date === clickdate);
    events = events.filter(e => e.date !== clickdate);
    let newlist = [];
    if (event) {
      newlist = event.lists;
    }
    if (alarmt === null)
      newlist.push(eventTitleInput.value);
    else
      newlist.push(eventTitleInput.value + "*/*At:" + alarmt);
    eventTitleInput.value = null;
    events.push({
      date: clickdate,
      lists: newlist,
    });
    alarmt = null;
    localStorage.setItem('events', JSON.stringify(events));
    //console.log("events:"+events.forEach(e => console.log(e.lists)));

    var element = null;
    var elements = document.querySelectorAll('[id]');
    //console.log(elements)
    elements.forEach(e => {
      if (e.id === 'List')
        return e.parentNode.removeChild(e)
    });

    openList(clickdate);
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  if (checklists.length !== 0) {
    let event = events.find(e => e.date === clickdate);
    for (let i = 0; i < checklists.length; i++) {
      event.lists = event.lists.filter(e => e !== checklists[i]);
    }
    events = events.filter(e => e.date !== clickdate);
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
    var element = null;
    var elements = document.querySelectorAll('[id]');
    elements.forEach(e => {
      if (e.id === 'List')
        return e.parentNode.removeChild(e)
    });
    openList(clickdate);

  }
}

function alarmModal() {
  alarmContainer.style.display = 'block';
}

function alarmSaveList() {
  alarmt = setTime.value;
  saveList();

  alarmContainer.style.display = 'none';
}


function alarmCloseModal() {
  alarmContainer.style.display = 'none';
}

let monthClick = 0;

function initButtons() {
  document.getElementById('monthlySchedule').addEventListener('click', () => {
    //monthlyCheck = 1;
    openList();
    //localStorage.clear();
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    moveMonth++;
    setDate();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    moveMonth--;
    setDate();
  });

  document.getElementById('saveButton').addEventListener('click', saveList);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
  document.getElementById('rewriteButton').addEventListener('click', rewriteModal);

  document.getElementById('alarmButton').addEventListener('click', alarmModal);
  document.getElementById('alarmSaveButton').addEventListener('click', alarmSaveList);
  document.getElementById('alarmCloseButton').addEventListener('click', alarmCloseModal);
}
init();
initButtons();
setDate();
