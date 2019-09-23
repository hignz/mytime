module.exports = {
  getPlural: number => (number > 1 ? 's' : ''),

  isToday: dayInt => new Date().getDay() - 1 === dayInt,

  isClassNow: (classStart, classEnd, currentTime) =>
    new Date(`01/01/1990 ${currentTime}`) >= new Date(`01/01/1990 ${classStart}`) &&
    new Date(`01/01/1990 ${currentTime}`) <= new Date(`01/01/1990 ${classEnd}`),

  isClassApporaching: (classStart, currentTime) => {
    const threshold = 20;
    const mins = Math.floor(
      (Date.parse(`01/01/1990 ${classStart}`) - Date.parse(`01/01/1990 ${currentTime}`)) / 60000
    );
    return mins <= threshold && mins > 0;
  },

  isClassOver: (classEnd, currentTime) =>
    new Date(`01/01/1990 ${classEnd}`) - new Date(`01/01/1990 ${currentTime}`) < 0,

  displayElement: (element, value) => {
    element.style.display = value === false ? 'none' : 'block';
  },

  fetchCourseCodes: async (index, callback) => {
    fetch(`https://itsligo-utils.herokuapp.com/api/courses?college=${index}`)
      .then(response => response.json())
      .then(json => {
        // console.time('getCourses()');
        document.getElementById('loader').style.display = 'none';
        const dataList = document.getElementById('courses-datalist');
        dataList.innerHTML = '';
        const frag = document.createDocumentFragment();
        const opt = document.createElement('option');
        for (let i = 0; i < json.length; i += 1) {
          const cloneOpt = opt.cloneNode(true);
          // cloneOpt.text = decodeURIComponent(json[i].course);
          cloneOpt.value = json[i].title || json[i].course;
          cloneOpt.setAttribute('data-value', json[i].course);
          frag.append(cloneOpt);
        }
        dataList.append(frag);

        if (typeof callback === 'function') callback();
        // console.timeEnd('getCourses()');
      })
      .catch(error => {
        console.error(error);
      });
  },

  getSelectedValue: () => {
    const input = document.getElementById('courses');
    const courseCode = input.value;
    const selectedOption = document.querySelector(
      `#courses-datalist option[value='${courseCode}']`
    );
    if (selectedOption === null) {
      return '';
    }
    return selectedOption.getAttribute('data-value');
  },

  alertCheck: () => {
    if (!localStorage.getItem('showAlert')) {
      localStorage.setItem('showAlert', true);
      document.getElementById('alert').style.display = 'block';
    }
  },

  hexToRgbA: hex => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = `0x${c.join('')}`;
      return `${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.75`;
    }
    throw new Error('Bad Hex');
  },
  animateCSS: (element, animationName, callback) => {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName, 'faster');

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName);
      node.removeEventListener('animationend', handleAnimationEnd);

      if (typeof callback === 'function') callback();
    }

    node.addEventListener('animationend', handleAnimationEnd);
  },
  createLineChart: (classes, chart) => {
    const classesPerDay = classes.map(c => c.length);

    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [classesPerDay.slice(0, 5)]
    };

    const options = {
      width: 400,
      height: 175,
      fullWidth: true,
      axisX: { showGrid: false },
      axisY: { showGrid: false },
      high: Math.max(...classesPerDay) + 3,
      low: 0
    };

    chart = new Chartist.Line('.ct-chart', data, options, [
      [
        'screen and (max-width: 480px)',
        {
          width: 275,
          chartPadding: {
            left: -10
          }
        }
      ]
    ]);
  },

  clearCourseInfoModal: () => {
    document.getElementById('courseinfo-college').innerHTML = '';
    document.getElementById('courseinfo-semester').innerHTML = '';
    document.getElementById('courseinfo-direct-link').innerHTML = '';
    document.querySelector('.ct-chart').innerHTML = '';
  }
};
