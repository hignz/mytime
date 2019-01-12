/* eslint-disable no-nested-ternary */
function isClassNow(currTime, classStart, classEnd, isToday) {
  return (Date.parse(`01/01/1990 ${currTime}`) >= Date.parse(`01/01/1990 ${classStart}`)
    && Date.parse(`01/01/1990 ${currTime}`) <= Date.parse(`01/01/1990 ${classEnd}`) && isToday);
}

function isClassApporaching(currTime, classStart, isToday) {
  const threshold = 20;
  const mins = Math.floor((Date.parse(`01/01/1990 ${classStart}`) - Date.parse(`01/01/1990 ${currTime}`)) / 60000);
  return ((mins <= threshold && mins > 0) && isToday);
}

async function fillDropDown(callback) {
  fetch('https://itsligo-utils.herokuapp.com/api/allcourses')
    .then(response => response.json())
    .then((json) => {
      document.getElementById('loader').style.display = 'none';
      for (let i = 0; i < json.length; i += 1) {
        const opt = document.createElement('option');
        opt.text = json[i].title || json[i].course;
        opt.value = json[i].course;
        const dataList = document.getElementById('courseData');
        const select = document.getElementById('courseDataSel');
        dataList.append(opt);
        select.append(opt.cloneNode(true));
      }
      if (callback) callback();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function makeTimetable(courseCode, callback) {
  fetch(`https://itsligo-utils.herokuapp.com/api/timetable/${courseCode}`)
    .then(response => response.json())
    .then((json) => {
      document.getElementById('loader').style.display = 'none';
      if (json.empty) {
        document.getElementById('timetable-window').style.display = 'block';

        document.getElementById('course-title').textContent = 'No timetable data found';
        return;
      }
      document.getElementById('course-direct-link').href = json.url;
      const currTime = new Date().toLocaleTimeString('en-GB');
      const timetable = document.createElement('div');
      timetable.classList.add('accordion');
      timetable.id = 'timetable';
      document.getElementById('timetable-window').append(timetable);
      document.getElementById('course-title').textContent = decodeURIComponent(courseCode);

      for (let i = 0; i < json.data.length; i += 1) { // Create headers and badges
        if (!json.data[i].length) continue;
        let lastClassTime = 0;

        timetable.insertAdjacentHTML('beforeend', `<div class="card bg-success" id="card${i}">
        <div class="card-header" id="heading${i}">
          <h5 class="mb-0">
            <button class="btn btn-lg heading font-weight-bold ml-1 text-left" id="header${i}"  style="width: 100%" type="button" data-toggle="collapse" data-target="#collapse${i}"
              aria-expanded="true" aria-controls="collapse${i}">
              ${json.data[i][0].day}
            </button>
          </h5>
          <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}"></div>  
        </div>`);

        const isToday = new Date().getDay() - 1 === i;

        document.getElementById(`header${i}`).classList.add(isToday ? 'text-danger' : 'text-secondary');

        // const badge = document.createElement('span');
        // badge.innerHTML = json.data[i].length;
        // badge.className = 'badge float-right badge-pill animated fadeIn';
        // badge.classList.add(isToday ? 'badge-danger' : 'badge-secondary');

        const currentCollapse = document.getElementById(`collapse${i}`);

        for (let j = 0; j < json.data[i].length; j += 1) { // Create class entries
          const currClass = json.data[i][j];
          checkForBreak(currClass.startTime, lastClassTime, currentCollapse);
          const a = document.createElement('a');
          const className = currClass.name
            .split('/')[0]
            .replace(/ GD & SD/, '');
          const room = currClass.room.split(' (')[0];
          a.innerHTML = `${currClass.startTime} - ${currClass.endTime}<br>${className}<br>${room.split('-')[0]} - ${currClass.type}<br>${currClass.teacher.replace(',', ', ')}`;
          a.className = 'list-group-item item animated fadeIn';
          a.classList.add(
            (isClassNow(currTime, currClass.startTime, currClass.endTime, isToday)) ? 'text-danger'
              : (isClassApporaching(currTime, currClass.startTime, isToday))
                ? 'text-warning'
                : 'a',
          );
          lastClassTime = currClass.endTime;
          if ((isClassNow(currTime, currClass.startTime, currClass.endTime, isToday))) a.classList.add('font-weight-bold');
          document.getElementById(`collapse${i}`).appendChild(a);
        }

        if (callback) callback();
      }
    })
    .catch((error) => {
      document.getElementById('course-title').text = 'Invalid course entered';
      console.error(error);
    });
}

function checkForBreak(startTime, lastEndTime, timetable) {
  if (startTime > lastEndTime) {
    const difference = new Date('01/01/1990 ' + startTime).getHours() - new Date('01/01/1990 ' + lastEndTime).getHours();
    if (difference < 0)
      return; // fix for courses which have multiple classes on same time, i.e different groups
    const freePeriod = document.createElement('a');
    freePeriod.innerHTML = `Break: ${difference} hour${plural(difference)}`;
    freePeriod.className = ('list-group-item item font-weight-bold text-success');
    timetable.append(freePeriod);
  }
}

function plural(number) {
  return number === 1 ? '' : 's';
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function () {
      location.reload();
    });
  }

  const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  if (iOS) {
    document.getElementById('courseDropDown').style.display = 'none';
    document.getElementById('courseDataSel').style.display = 'block';
  }

  if (window.location.hash) {
    document.getElementById('select-window').style.display = 'none';
    await makeTimetable(encodeURIComponent(window.location.hash.substring(1)), () => {
      document.getElementById('timetable-window').style.display = 'block';
    });
    await fillDropDown();
  } else {
    await fillDropDown(() => {
      document.getElementById('select-window').style.display = 'block';
    });
  }

  document.getElementById('searchBtn').addEventListener('click', async () => {
    if (document.getElementById('timetable')) document.getElementById('timetable').remove();
    document.getElementById('select-window').style.display = 'none';
    document.getElementById('timetable-window').style.display = 'block';
    const select = document.getElementById('courseDropDown');
    let courseCode = select.value;
    if (iOS) {
      let iosSelect = document.getElementById('courseDataSel');
      courseCode = iosSelect.options[iosSelect.selectedIndex].value;
    }
    window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
    await makeTimetable(encodeURIComponent(courseCode));
  }, false);

  document.getElementById('backBtn').addEventListener('click', async () => {
    document.getElementById('timetable-window').style.display = 'none';
    document.getElementById('select-window').style.display = 'block';
    // eslint-disable-next-line no-restricted-globals
    history.pushState('', document.title, `${window.location.pathname}`);
  }, false);
}, false);
