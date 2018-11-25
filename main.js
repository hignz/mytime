/* eslint-disable no-nested-ternary */
function isClassNow (currTime, classStart, classEnd, isToday) {
  return (Date.parse(`01/01/1990 ${currTime}`) >= Date.parse(`01/01/1990 ${classStart}`)
    && Date.parse(`01/01/1990 ${currTime}`) <= Date.parse(`01/01/1990 ${classEnd}`) && isToday);
}

function isClassApporaching (currTime, classStart, isToday) {
  const mins = Math.floor((Date.parse(`01/01/1990 ${classStart}`) - Date.parse(`01/01/1990 ${currTime}`)) / 60000);
  return ((mins <= 15 && mins > 0) && isToday);
}

async function fillDropDown () {
  fetch('https://itsligo-utils.herokuapp.com/api/allcourses')
    .then(response => response.json())
    .then((json) => {
      document.getElementById('loader').style.display = 'none';
      for (let i = 0; i < json.length; i += 1) {
        const opt = document.createElement('option');
        opt.text = json[i].course.replace(/\//g, '-');
        const select = document.getElementById('courseDropDown');
        select.append(opt);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function makeTimetable (courseCode) {
  fetch(`https://itsligo-utils.herokuapp.com/api/timetable/${courseCode}`)
    .then(response => response.json())
    .then((json) => {
      document.getElementById('loader').style.display = 'none';
      if (document.getElementById('timetable')) document.getElementById('timetable').remove();

      if (json.empty) {
        document.getElementById('course-title').textContent = 'No timetable data found';
        return;
      }
      const currTime = new Date().toLocaleTimeString('en-GB');
      const timetable = document.createElement('div');
      timetable.classList.add('list-group', 'shadow-sm');
      timetable.id = 'timetable';
      document.getElementById('timetable-window').append(timetable);
      document.getElementById('course-title').textContent = decodeURIComponent(courseCode);

      for (let i = 0; i < json.data.length; i += 1) { // Create headers and badges
        if (!json.data[i].length) continue;
        const header = document.createElement('a');
        const isToday = new Date().getDay() - 1 === i;
        header.innerHTML = json.data[i][0].day;
        header.className = 'list-group-item list-group-item-action mt-1 font-weight-bold animated fadeIn';
        header.classList.add(isToday ? 'text-danger' : 'text-dark');

        const badge = document.createElement('span');
        badge.innerHTML = json.data[i].length;
        badge.className = 'badge badge-info float-right animated fadeIn';
        badge.classList.add(isToday ? 'badge-danger' : 'badge-dark');

        header.append(badge);
        timetable.appendChild(header);

        for (let j = 0; j < json.data[i].length; j += 1) { // Create class entries
          const a = document.createElement('a');
          const currClass = json.data[i][j];
          const className = currClass.name
            .split('/')[0]
            .replace(/ GD & SD/, '');
          const room = currClass.room.split(' (')[0];
          a.innerHTML = `${currClass.startTime} - ${currClass.endTime}<br>${className}<br>${room}`;
          a.className = 'list-group-item list-group-item-action item animated fadeIn';
          a.classList.add(
            (isClassNow(currTime, currClass.startTime, currClass.endTime, isToday)) ? 'text-danger'
              : (isClassApporaching(currTime, currClass.startTime, isToday))
                ? 'text-warning'
                : 'text-light',
          );
          if ((isClassNow(currTime, currClass.startTime, currClass.endTime, isToday))) a.classList.add('font-weight-bold');
          timetable.appendChild(a);
        }

        document.getElementById('footer').classList.remove('fixed-bottom');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.hash) {
    document.getElementById('select-window').style.display = 'none';
    makeTimetable(encodeURIComponent(window.location.hash.substring(1)));
    document.getElementById('timetable-window').style.display = 'block';
    fillDropDown();
  } else {
    await fillDropDown();
    document.getElementById('select-window').style.display = 'block';
  }

  document.getElementById('searchBtn').addEventListener('click', async () => {
    document.getElementById('select-window').style.display = 'none';
    document.getElementById('timetable-window').style.display = 'block';
    const select = document.getElementById('courseDropDown');
    const courseCode = select.options[select.selectedIndex].text;
    window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
    makeTimetable(encodeURIComponent(courseCode));
  }, false);

  document.getElementById('backBtn').addEventListener('click', async () => {
    document.getElementById('select-window').style.display = 'block';
    document.getElementById('timetable-window').style.display = 'none';
    // eslint-disable-next-line no-restricted-globals
    history.pushState('', document.title, `${window.location.pathname}`);
  }, false);
}, false);
