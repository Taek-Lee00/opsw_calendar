let moveMonth = 0;
let clickdate = null;
let checklists = [];
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const dayList = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openList(date) {
  clickdate = date;
  backDrop.style.display = 'block';
  dayList.style.display = 'block';
  const event = events.find(e => e.date === clickdate);
    if (event) {
      const eventList = document.createElement('div');
      eventList.classList.add('List');
      const eventtitle = document.createElement('h2');
      eventtitle.id = 'List-title';
      eventtitle.innerText = "What I have to Do";
      if(event.lists){
        for (let k = 0; k < event.lists.length; k++) {
          let container = document.createElement('div');
          let ckbox = document.createElement('input');
          ckbox.type = "checkbox";
          ckbox.id = 'ckid';
          ckbox.value = event.lists[k];
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
      //document.getElementById('eventText').innerText = event.title;
      //document.getElementById('eventText').innerText = "IN WHERE";
      //deleteEventModal.style.display = 'block';
    } else {
      //dayList.style.display = 'block';
    }
    var checkbox = document.querySelector("input[id=ckid]");
  checkbox.addEventListener('change', function() {
    if(this.checked)
      checklists.push(checkbox.value);
    else
      checklists.pop(checkbox.value);
  }
  );
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
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.lists[0];
        //추가
        dayContent.appendChild(eventDiv);
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
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        dayContent.appendChild(eventDiv);
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
    console.log(elements)
    elements.forEach(e => {
        if (e.id === 'List-title')
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
    newlist.push(eventTitleInput.value);
    eventTitleInput.value =null;    
    events.push({
        date: clickdate,
        lists: newlist,
    });
    localStorage.setItem('events', JSON.stringify(events));
    console.log(events);

    var element = null;
    var elements = document.querySelectorAll('[id]');
    console.log(elements)
    elements.forEach(e => {
        if (e.id === 'List-title')
            return e.parentNode.removeChild(e)
    });

    openList(clickdate);
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  let event = events.find(e => e.date === clickdate);
  for(let i = 0 ; i < checklists.length ; i++){
    event.lists = event.lists.filter(e => e !== checklists[i]);
  }
  events = events.filter(e => e.date !== clickdate);
  events.push(event);
  localStorage.setItem('events', JSON.stringify(events));
  openList();
  //closeModal();
}

let monthClick = 0;

function initButtons() {
  document.getElementById('monthlySchedule').addEventListener('click', () => {
    monthlyCheck = 1;
    openList();
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
  
  
}

initButtons();
setDate();
