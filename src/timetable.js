import {
  getPlural,
  isClassApporaching,
  isClassNow,
  isClassOver,
  isToday,
  createLineChart
} from './utils';

const a = document.createElement('a');
const p = document.createElement('p');

const checkForBreak = options => {
  const { startTime, lastClassTime, currentCollapse, currentTime, i, collegeIndex } = options;
  if (startTime > lastClassTime) {
    const difference =
      (new Date(`01/01/1990 ${startTime}`).getTime() -
        new Date(`01/01/1990 ${lastClassTime}`).getTime()) /
      60000;
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
        btn.value = `${lastClassTime}-${startTime}`;
        btn.setAttribute('data-toggle', 'modal');
        btn.setAttribute('data-target', '#roominfo-modal');

        // btn.addEventListener('click', e => {
        //   const modal = document.getElementById('roominfo-modal');
        //   console.log(modal);
        // });
        freePeriod.append(btn);
      }
      currentCollapse.append(freePeriod);
    }
  }
};

export function createTimetable(options, callback) {
  fetch(
    `https://itsligo-utils.herokuapp.com/api/timetable/?code=${options.courseCode}&college=${
      options.collegeIndex
    }&sem=${options.semester}`
  )
    .then(response => response.json())
    .then(json => {
      // console.time('timetable');
      const { collegeIndex } = options;
      document.getElementById('loader').style.display = 'none';
      if (json.empty || !json.data) {
        document.getElementById('timetable-window').style.display = 'block';
        document.getElementById('course-title').textContent =
          'We can"t find any classes for this course';
        document.getElementById('courseinfo-direct-link').href = json.url;
        return;
      }
      document.title = `${json.title || json.courseCode}`;
      document.getElementById('courseinfo-direct-link').href = json.url;
      document.getElementById('courseinfo-college').innerHTML = json.college;
      document.getElementById('courseinfo-semester').innerHTML = `Semester: ${parseInt(
        json.semester,
        0
      ) + 1}`;

      const timetable = document.getElementById('timetable');
      document.getElementById('timetable-window').append(timetable);
      document.getElementById('course-title').textContent = `${json.title || json.courseCode}`;
      const frag = document.createDocumentFragment();
      let classEntry;
      let currentCollapse;
      let currentClass;
      let summary;
      let clone;
      const mainCard = document.querySelector('#temp-main');
      const currentTime = new Date().toLocaleTimeString('en-GB');
      let o = 0;
      json.data.forEach((element, index) => {
        if (index <= 4) {
          o += element.length;
        }
      });
      const length = o > 0 ? json.data.length - 2 : json.data.length;
      // Create headers and badges
      for (let i = 0; i < length; i += 1) {
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
            checkForBreak({
              startTime: currClass.startTime,
              lastClassTime,
              currentCollapse,
              currentTime,
              i,
              collegeIndex
            });
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

            classEntry.appendChild(pClone);
            currentCollapse.appendChild(classEntry);
            // if (isToday(i) && isClassNow(currClass.startTime, currClass.endTime, currentTime)) {
            //   currentClass = currClass;
            // }
          }

          summary = a.cloneNode(true);
          summary.innerHTML = `Classes: ${json.data[i].length} &emsp; Start: ${
            json.data[i][0].startTime
          } &emsp; Finish: ${json.data[i][json.data[i].length - 1].endTime}`;
          summary.classList.add('text-muted', 'list-group-item', 'item', 'bg-dark');
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
      createLineChart(json.data);
      // console.timeEnd('timetable');
    })
    .catch(error => {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('course-title').text = 'An error has occured';
      console.error(error);
    });
}
