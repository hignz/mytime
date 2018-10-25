const intToDay = (i) => {
  let day = '';

  switch (i) {
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    default:
      day = 'invalid';
      break;
  }

  return day;
};

(async () => {
  try {
    const response = await fetch('https://itsligo-utils.herokuapp.com/timetable/Sg_KSDEV_B07-F-Y2-1-(A)');
    const res = await response.json();
    const group = document.getElementById('group');

    for (let i = 0; i < res.data.length; i += 1) {
      const header = document.createElement('a');
      header.innerHTML = intToDay(i + 1);
      header.className = 'list-group-item list-group-item-action';
      const badge = document.createElement('span');
      badge.innerHTML = res.data[i].length;
      badge.className = 'badge badge-info badge-dark float-right';
      header.append(badge);
      group.appendChild(header);

      for (let j = 0; j < res.data[i].length; j += 1) {
        const a = document.createElement('a');
        const currClass = res.data[i][j];
        a.innerHTML = `${currClass.startTime}<br>${currClass.name}<br>${currClass.room}`;
        a.href = '#';
        a.style.backgroundColor = '#282C34';
        a.className = 'list-group-item list-group-item-action text-light';
        group.appendChild(a);
      }
    }
  } catch (e) {
    console.log(e);
  }
})();
