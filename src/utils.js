module.exports = {
  getPlural: number => (number > 1 ? 's' : ''),

  isClassNow: (currTime, classStart, classEnd, isToday) =>
    Date.parse(`01/01/1990 ${currTime}`) >= Date.parse(`01/01/1990 ${classStart}`) &&
    Date.parse(`01/01/1990 ${currTime}`) <= Date.parse(`01/01/1990 ${classEnd}`) &&
    isToday,

  isClassApporaching: (currTime, classStart, isToday) => {
    const threshold = 20;
    const mins = Math.floor(
      (Date.parse(`01/01/1990 ${classStart}`) - Date.parse(`01/01/1990 ${currTime}`)) / 60000
    );
    return mins <= threshold && mins > 0 && isToday;
  },

  fetchCourseCodes: async callback => {
    fetch('https://itsligo-utils.herokuapp.com/api/allcourses')
      .then(response => response.json())
      .then(json => {
        console.time('getCourses()');
        document.getElementById('loader').style.display = 'none';
        // const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        // const select = document.getElementById('courses-select');
        const dataList = document.getElementById('courses-datalist');
        const frag = document.createDocumentFragment();
        let opt;
        for (let i = 0; i < json.length; i += 1) {
          opt = document.createElement('option');
          opt.text = json[i].title || json[i].course;
          opt.value = json[i].course;
          frag.append(opt);
        }
        // if (iOS) {
        //   select.append(frag);
        // } else {
        dataList.append(frag);
        // }
        if (callback) callback();
        console.timeEnd('getCourses()');
      })
      .catch(error => {
        console.error(error);
      });
  },

  getSelectedValue: () => {
    // let courseCode;
    // if (isIOS) {
    //   const iosSelect = document.getElementById('courses-select');
    //   courseCode = iosSelect.options[iosSelect.selectedIndex].value;
    // } else {
    //   const input = document.getElementById('courses');
    //   courseCode = input.value;
    // }
    const input = document.getElementById('courses');
    const courseCode = input.value;
    return courseCode;
  }
};
