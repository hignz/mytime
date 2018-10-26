const intToDay = i => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i];

(async () => {
  try {
    const response = await fetch('https://itsligo-utils.herokuapp.com/timetable/Sg_KSDEV_B07-F-Y2-1-(A)');
    const res = await response.json();
    const group = document.getElementById('group');

    for (let i = 0; i < res.data.length; i += 1) { // Create headers and badges
      const header = document.createElement('a');
      const isToday = new Date().getDay() - 1 === i;
      header.innerHTML = intToDay(i);
      header.className = 'list-group-item list-group-item-action mt-1 font-weight-bold';
      if (isToday) header.classList += ' text-danger';
      const badge = document.createElement('span');
      badge.innerHTML = res.data[i].length;
      badge.className = isToday
        ? 'badge badge-info float-right badge-danger'
        : 'badge badge-info float-right badge-dark';
      header.append(badge);
      group.appendChild(header);

      for (let j = 0; j < res.data[i].length; j += 1) { // Create classes
        const a = document.createElement('a');
        const currClass = res.data[i][j];
        const splitClassName = currClass.name.split('/');
        if (splitClassName[0].includes(' GD & SD')) splitClassName[0] = splitClassName[0].replace(/ GD & SD/, '');
        const splitRoom = currClass.room.split('(');
        a.innerHTML = `${currClass.startTime}<br>${splitClassName[0]}<br>${splitRoom[0]}`;
        a.className = 'list-group-item list-group-item-action text-light item';
        group.appendChild(a);
      }

      document.getElementById('loader').style.display = 'none';
    }
  } catch (e) {
    console.log(e);
  }
})();
