function isClassNow (currTime, classStart, classEnd) {
  return Date.parse(`01/01/1990 ${currTime}`) >= Date.parse(`01/01/1990 ${classStart}`)
      && Date.parse(`01/01/1990 ${currTime}`) <= Date.parse(`01/01/1990 ${classEnd}`);
}

(async () => {
  try {
    const response = await fetch('https://itsligo-utils.herokuapp.com/api/timetable/Sg_KSDEV_B07-F-Y2-1-(A)');
    const json = await response.json();
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timetable = document.getElementById('timetable');
    const currTime = new Date().toLocaleTimeString('en-GB');

    for (let i = 0; i < json.data.length; i += 1) { // Create headers and badges
      // if (json.data[i].length === 0) continue;
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

      document.getElementById('loader').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
  }
})();
