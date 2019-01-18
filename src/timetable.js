import {
  getPlural,
  isClassApporaching,
  isClassNow,
} from './utils';

const checkForBreak = (startTime, lastEndTime, timetable) => {
  if (startTime > lastEndTime) {
    const difference = (Math.abs(new Date(`01/01/1990 ${startTime}`).getTime() - new Date(`01/01/1990 ${lastEndTime}`).getTime()) / 60000);
    if (difference > 0) {
      const message = difference >= 60 ? `Break: ${difference / 60} hour${getPlural(difference / 60)}` : `Break: ${difference} minutes`;
      const freePeriod = document.createElement('a');
      freePeriod.innerHTML = message;
      freePeriod.className = ('list-group-item item font-weight-bold text-success');
      timetable.append(freePeriod);
    }
  }
};

export function createTimetable (courseCode, callback) {
  fetch(`https://itsligo-utils.herokuapp.com/api/timetable/${courseCode}`)
    .then(response => response.json())
    .then((json) => {
      document.querySelector('#loader').style.display = 'none';
      if (json.empty) {
        document.querySelector('#timetable-window').style.display = 'block';
        document.querySelector('#course-title').textContent = 'No timetable data found';
        return;
      }

      document.querySelector('#courseinfo-direct-link').href = json.url;
      const currTime = new Date().toLocaleTimeString('en-GB');
      const timetable = document.createElement('div');
      timetable.classList.add('accordion');
      timetable.id = 'timetable';
      document.querySelector('#timetable-window').append(timetable);
      document.querySelector('#course-title').textContent = decodeURIComponent(courseCode);

      for (let i = 0; i < json.data.length - 2; i += 1) { // Create headers and badges
        if (json.data[i].length) {
          let lastClassTime = 0;

          timetable.insertAdjacentHTML('beforeend', `<div class="card bg-success" id="card${i}">
          <div class="card-header" id="heading${i}">
            <h5 class="mb-0">
            <button type="button" class="btn btn-lg heading font-weight-bold ml-1 text-left" id="header${i}" style="width: 100%" data-toggle="collapse" data-target="#collapse${i}"
              aria-expanded="true" aria-controls="collapse${i}">
                ${json.data[i][0].day}
                <span class="badge float-right badge-pill animated fadeIn mt-1" id="class-total-badge${i}">${json.data[i].length}</span>
            </button>
            </h5>
            <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}"></div>
          </div>`);

          const isToday = new Date().getDay() - 1 === i;

          document.querySelector(`#header${i}`).classList.add(isToday ? 'text-danger' : 'text-white');

          if (isToday) { document.querySelector(`#class-total-badge${i}`).classList.add('badge-danger'); }

          const currentCollapse = document.querySelector(`#collapse${i}`);

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
            document.querySelector(`#collapse${i}`).appendChild(a);
          }

          if (callback) callback();
        }
      }
    })
    .catch((error) => {
      document.querySelector('#timetable-window').style.display = 'block';

      document.querySelector('#course-title').text = 'Invalid course entered';
      console.error(error);
    });
}
