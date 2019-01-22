import {
  getPlural,
  isClassApporaching,
  isClassNow,
  isClassOver,
  isToday,
  alertCheck
} from './utils';

const checkForBreak = (startTime, lastEndTime, currentCollapse, currentTime, i) => {
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
      freePeriod.className = `list-group-item item font-weight-bold ${
        isToday(i) && isClassOver(lastEndTime, currentTime) ? 'text-muted' : 'text-success'
      }`;
      currentCollapse.append(freePeriod);
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

      alertCheck();
      document.title = `MyTerm | ${decodeURIComponent(courseCode)}`;
      document.getElementById('courseinfo-direct-link').href = json.url;
      const timetable = document.getElementById('timetable');
      document.getElementById('timetable-window').append(timetable);
      document.getElementById('course-title').textContent = decodeURIComponent(courseCode);
      const frag = document.createDocumentFragment();
      let classEntry;
      let currentCollapse;
      const mainCard = document.querySelector('#temp-main');
      const currentTime = new Date().toLocaleTimeString('en-GB');
      let clone = document.importNode(mainCard.content, true);

      // Create headers and badges
      for (let i = 0; i < json.data.length - 2; i += 1) {
        if (json.data[i].length) {
          let lastClassTime = 0;
          clone = document.importNode(mainCard.content, true);
          const card = clone.querySelector('#card-main');
          card.id += i;
          const heading = clone.querySelector('#heading');
          heading.id += i;
          const header = clone.querySelector('#header');
          header.id += i;
          header.setAttribute('data-target', `#collapse${i}`);
          header.setAttribute('aria-controls', `collapse${i}`);
          header.className += ` ${isToday(i) ? 'text-danger font-weight-bold' : 'text-white'}`;
          header.innerHTML += json.data[i][0].day;
          currentCollapse = clone.querySelector('#collapse');
          currentCollapse.id += i;
          const badge = clone.querySelector(`#class-total-badge`);
          badge.id += i;
          badge.innerHTML = json.data[i].length;
          badge.className += isToday(i) ? ' badge-danger' : '';

          frag.append(card);
          currentCollapse = frag.getElementById(`collapse${i}`);

          if (isToday(i)) currentCollapse.classList.add('show');

          // Create class entries
          for (let j = 0; j < json.data[i].length; j += 1) {
            const currClass = json.data[i][j];
            checkForBreak(currClass.startTime, lastClassTime, currentCollapse, currentTime, i);
            classEntry = document.createElement('a');
            const className = currClass.name.split('/')[0].replace(/ GD & SD/, '');
            const room = currClass.room.split(' (')[0];
            const p = document.createElement('p');
            p.innerHTML = `${currClass.startTime} - ${currClass.endTime}<br>${className}<br>
              ${room.split('-')[0]} - ${room.split('-')[1]}<br>
              ${currClass.teacher.replace(',', ', ')}`;
            p.classList.add('mb-0');
            classEntry.className = `list-group-item item`;
            if (isToday(i)) {
              classEntry.className += ` ${
                isClassNow(currClass.startTime, currClass.endTime, currentTime)
                  ? 'text-danger font-weight-bold'
                  : isClassApporaching(currClass.startTime, currentTime)
                  ? 'text-warning'
                  : isClassOver(currClass.endTime, currentTime)
                  ? 'text-muted'
                  : ''
              }`;
            }

            lastClassTime = currClass.endTime;
            classEntry.append(p);
            currentCollapse.appendChild(classEntry);
          }

          if (typeof callback === 'function') callback();
        }
      }
      // const card = document.querySelector('#temp-next-class');
      // const currentClassClone = document.importNode(card.content, true);
      // currentClassClone.querySelector('#card-header span').innerHTML = 'currClass.room';
      // timetable.append(currentClassClone);
      timetable.append(frag);
      console.timeEnd('timetable');
    })
    .catch(error => {
      document.getElementById('timetable-window').style.display = 'block';
      document.getElementById('course-title').text = 'Invalid course entered';
      console.error(error);
    });
}
