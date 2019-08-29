import { getPlural, isClassApporaching, isClassNow, isClassOver, isToday } from './utils';

const a = document.createElement('a');
const p = document.createElement('p');

const checkForBreak = (startTime, lastEndTime, currentCollapse, currentTime, i, collegeIndex) => {
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
      const freePeriod = a.cloneNode(true);
      freePeriod.innerHTML = message;
      freePeriod.className = `list-group-item item freePeriod font-weight-bold bg-dark ${
        isToday(i) && isClassOver(startTime, currentTime) ? 'text-muted' : 'text--green'
      }`;
      if (collegeIndex === '0') {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-outline', 'btn-sm', 'float-right');
        btn.innerHTML = 'Rooms';
        btn.value = `${lastEndTime}-${startTime}`;
        btn.addEventListener('click', e => {
          console.log(e.target.value);
        });
        freePeriod.append(btn);
      }
      currentCollapse.append(freePeriod);
    }
  }
};

export function createTimetable(courseCode, collegeIndex, semester, callback) {
  fetch(
    `https://itsligo-utils.herokuapp.com/api/timetable/?code=${courseCode}&college=${collegeIndex}&sem=${semester}`
  )
    .then(response => response.json())
    .then(json => {
      console.time('timetable');
      document.getElementById('loader').style.display = 'none';
      if (json.empty || !json.data) {
        document.getElementById('timetable-window').style.display = 'block';
        document.getElementById('course-title').textContent = 'No timetable found';
        document.getElementById('courseinfo-direct-link').href = json.url;
        return;
      }
      document.getElementById('courseinfo-direct-link').href = json.url;
      document.getElementById('courseinfo-college').innerHTML = json.college;
      document.getElementById('courseinfo-semester').innerHTML = `Semester: ${parseInt(
        json.semester,
        0
      ) + 1}`;

      document.title = `${decodeURIComponent(json.courseCode)}`;
      const timetable = document.getElementById('timetable');
      document.getElementById('timetable-window').append(timetable);
      document.getElementById('course-title').textContent = `${decodeURIComponent(
        json.courseCode
      )}`;
      const frag = document.createDocumentFragment();
      let classEntry;
      let currentCollapse;
      const mainCard = document.querySelector('#temp-main');
      const currentTime = new Date().toLocaleTimeString('en-GB');
      let clone;
      let currentClass;
      let summary;

      // Create headers and badges
      for (let i = 0; i < json.data.length - 2; i += 1) {
        if (json.data[i].length) {
          let lastClassTime = 0;
          clone = document.importNode(mainCard.content, true);
          const card = clone.getElementById('card-main');
          card.id += i;
          const heading = clone.getElementById('heading');
          heading.id += i;
          const header = clone.getElementById('header');
          header.id += i;
          header.setAttribute('data-target', `#collapse${i}`);
          header.setAttribute('aria-controls', `collapse${i}`);
          header.className += ` ${isToday(i) ? 'text--accent font-weight-bold' : 'text-white'}`;
          header.innerHTML += json.data[i][0].day;
          currentCollapse = clone.getElementById('collapse');
          currentCollapse.id += i;

          frag.append(card);
          currentCollapse = frag.getElementById(`collapse${i}`);

          if (isToday(i)) currentCollapse.classList.add('show');

          // Create class entries
          for (let j = 0; j < json.data[i].length; j += 1) {
            const currClass = json.data[i][j];
            checkForBreak(
              currClass.startTime,
              lastClassTime,
              currentCollapse,
              currentTime,
              i,
              collegeIndex
            );
            classEntry = a.cloneNode(true);
            const className = currClass.name.split('/')[0];
            const room = currClass.room.split(' (')[0];
            const pClone = p.cloneNode(true);
            pClone.innerHTML = `${currClass.startTime} - ${currClass.endTime}<br>${className}<br>
              ${room.split('-')[0]}${room.split('-')[1] ? ` - ${room.split('-')[1]}` : ''}<br>
              ${currClass.teacher}`;
            pClone.classList.add('mb-0');
            classEntry.className = `list-group-item item bg-dark text-white`;
            if (isToday(i)) {
              classEntry.className += ` ${
                isClassNow(currClass.startTime, currClass.endTime, currentTime)
                  ? 'text-danger animated flash slow'
                  : isClassApporaching(currClass.startTime, currentTime)
                  ? 'text-warning'
                  : isClassOver(currClass.endTime, currentTime)
                  ? 'text-muted'
                  : 'text-white'
              }`;
            }

            lastClassTime = currClass.endTime;

            summary = a.cloneNode(true);
            summary.innerText = `Classes: ${json.data[i].length}`;
            summary.classList.add('text-muted', 'list-group-item', 'item', 'bg-dark');

            classEntry.appendChild(pClone);
            currentCollapse.appendChild(classEntry);
            // if (isToday(i) && isClassNow(currClass.startTime, currClass.endTime, currentTime)) {
            //   currentClass = currClass;
            // }
          }
          currentCollapse.appendChild(summary);

          if (typeof callback === 'function') callback();
        }
      }
      // if (currentClass) {
      //   const card = document.querySelector('#temp-next-class');
      //   const currentClassClone = document.importNode(card.content, true);
      //   currentClassClone.querySelector('#card-header span').innerHTML = `You have class now!`;
      //   currentClassClone.querySelector('#card-title').innerHTML = `${currentClass.name}`;
      //   currentClassClone.querySelector('#card-text').innerHTML = `From ${
      //     currentClass.startTime
      //   } to ${currentClass.endTime} in room ${currentClass.room}`;
      //   timetable.append(currentClassClone);
      // }
      timetable.append(frag);
      console.timeEnd('timetable');
    })
    .catch(error => {
      document.getElementById('timetable-window').style.display = 'block';
      document.getElementById('course-title').text = 'Invalid course entered';
      console.error(error);
    });
}
