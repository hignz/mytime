function isClassNow (currTime, classStart, classEnd) {
  return Date.parse(`01/01/1990 ${currTime}`) >= Date.parse(`01/01/1990 ${classStart}`)
      && Date.parse(`01/01/1990 ${currTime}`) <= Date.parse(`01/01/1990 ${classEnd}`);
}

document.getElementById('searchBtn').addEventListener('click', async () => {
  document.getElementById('selectWindow').style.display = 'none';
  const select = document.getElementById('courseDropDown');
  const courseCode = select.options[select.selectedIndex].text;
  console.log(courseCode);
  await makeTimetable(courseCode);
});

async function fillDropDown () {
  fetch('https://itsligo-utils.herokuapp.com/api/allCodes')
    .then(response => response.json())
    .then((json) => {
      for (let i = 0; i < json.length; i += 1) {
        console.log(json[i].course);
        const opt = document.createElement('option');
        opt.text = json[i].course.replace(/\//g, '-');
        const select = document.getElementById('courseDropDown');
        select.append(opt);
      }
    });
}

fillDropDown();

async function makeTimetable (courseCode) {
  try {
    const response = await fetch(`https://itsligo-utils.herokuapp.com/api/timetable/${courseCode}`);
    const json = await response.json();
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timetable = document.getElementById('timetable');

    const currTime = new Date().toLocaleTimeString('en-GB');

    for (let i = 0; i < json.data.length; i += 1) { // Create headers and badges
      const header = document.createElement('a');
      const isToday = new Date().getDay() - 1 === i;
      header.innerHTML = weekDays[i];
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
        a.classList.add(isClassNow(currTime, currClass.startTime, currClass.endTime) && isToday
          ? 'text-danger'
          : 'text-light');
        timetable.appendChild(a);
      }

      // document.getElementById('loader').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
  }
}
