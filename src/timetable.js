import { getPlural, isClassApporaching, isClassNow } from './utils';

const checkForBreak = (startTime, lastEndTime, timetable) => {
  if (startTime > lastEndTime) {
    const difference =
      Math.abs(
        new Date(`01/01/1990 ${startTime}`).getTime() -
          new Date(`01/01/1990 ${lastEndTime}`).getTime()
      ) / 60000;
    if (difference > 0) {
      const message =
        difference >= 60
          ? `Break: ${difference / 60} hour${getPlural(difference / 60)}`
          : `Break: ${difference} minutes`;
      const freePeriod = document.createElement('a');
      freePeriod.innerHTML = message;
      freePeriod.className = 'list-group-item item font-weight-bold text-success';
      timetable.append(freePeriod);
    }
  }
};

export function createTimetable(courseCode, callback) {
  fetch(`https://itsligo-utils.herokuapp.com/api/timetable/${courseCode}`)
    .then(response => response.json())
    .then(json => {
      console.time('timetable');
      document.getElementById('loader').style.display = 'none';
      if (json.empty) {
        document.getElementById('timetable-window').style.display = 'block';
        document.getElementById('course-title').textContent = 'No timetable data found';
        return;
      }

      document.title = `MyTerm | ${decodeURIComponent(courseCode)}`;
      document.getElementById('courseinfo-direct-link').href = json.url;
      const currTime = new Date().toLocaleTimeString('en-GB');
      const timetable = document.createElement('div');
      timetable.classList.add('accordion');
      timetable.id = 'timetable';
      document.getElementById('timetable-window').append(timetable);
      document.getElementById('course-title').textContent = decodeURIComponent(courseCode);
      const frag = document.createDocumentFragment();
      let classEntry;
      let currentCollapse;

      for (let i = 0; i < json.data.length - 2; i += 1) {
        // Create headers and badges
        if (json.data[i].length) {
          let lastClassTime = 0;

          const div = document.createElement('div');
          div.className = 'card-container mb-2';
          div.innerHTML = `<div class="card" id="card${i}">
          <div class="card-header" id="heading${i}">
            <h5 class="mb-0">
            <button type="button" class="btn btn-lg heading font-weight-bold ml-1 text-left" id="header${i}" style="width: 100%" data-toggle="collapse" data-target="#collapse${i}"
              aria-expanded="true" aria-controls="collapse${i}">
                ${json.data[i][0].day}
                <span class="badge float-right badge-pill mt-1" id="class-total-badge${i}">${
            json.data[i].length
          }
          </span>
            </button>
            </h5>
            <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}"></div>
          </div>`;

          frag.append(div);
          const isToday = new Date().getDay() - 1 === i;
          frag.getElementById(`header${i}`).classList.add(isToday ? 'text-danger' : 'text-white');

          if (isToday) {
            document.getElementById(`class-total-badge${i}`).classList.add('badge-danger');
          }

          currentCollapse = frag.getElementById(`collapse${i}`);

          for (let j = 0; j < json.data[i].length; j += 1) {
            // Create class entries
            const currClass = json.data[i][j];
            checkForBreak(currClass.startTime, lastClassTime, currentCollapse);
            classEntry = document.createElement('a');
            const className = currClass.name.split('/')[0].replace(/ GD & SD/, '');
            const room = currClass.room.split(' (')[0];
            classEntry.innerHTML = `${currClass.startTime} - ${
              currClass.endTime
            }<br>${className}<br>${room.split('-')[0]} - ${
              currClass.type
            }<br>${currClass.teacher.replace(',', ', ')}`;
            classEntry.className = 'list-group-item item animated fadeIn';
            classEntry.classList.add(
              isClassNow(currTime, currClass.startTime, currClass.endTime, isToday)
                ? 'text-danger'
                : isClassApporaching(currTime, currClass.startTime, isToday)
                ? 'text-warning'
                : 'a'
            );
            lastClassTime = currClass.endTime;
            if (isClassNow(currTime, currClass.startTime, currClass.endTime, isToday))
              classEntry.classList.add('font-weight-bold');
            currentCollapse.appendChild(classEntry);
          }

          if (callback) callback();
          timetable.append(frag);
        }
      }
      console.timeEnd('timetable');
    })
    .catch(error => {
      document.getElementById('timetable-window').style.display = 'block';
      document.getElementById('course-title').text = 'Invalid course entered';
      console.error(error);
    });
}
