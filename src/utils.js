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

  fetchCourseCodes: async callback => {
    fetch('https://itsligo-utils.herokuapp.com/api/allcourses')
      .then(response => response.json())
      .then(json => {
        console.time('getCourses()');
        document.getElementById('loader').style.display = 'none';
        const dataList = document.getElementById('courses-datalist');
        const frag = document.createDocumentFragment();
        let opt;
        for (let i = 0; i < json.length; i += 1) {
          opt = document.createElement('option');
          opt.text = json[i].title || json[i].course;
          opt.value = json[i].course;
          frag.append(opt);
        }
        dataList.append(frag);

        if (typeof callback === 'function') callback();
        console.timeEnd('getCourses()');
      })
      .catch(error => {
        console.error(error);
      });
  },

  getSelectedValue: () => {
    const input = document.getElementById('courses');
    const courseCode = input.value;
    return courseCode;
  },

  alertCheck: () => {
    if (!localStorage.getItem('visted') && window.location.hash !== '') {
      localStorage.setItem('visted', true);
      document.getElementById('alert').style.display = 'block';
    }
  }
};
