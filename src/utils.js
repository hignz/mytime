module.exports = {
  getPlural: number => (number > 1 ? 's' : ''),

  isClassNow: (currTime, classStart, classEnd, isToday) => (Date.parse(`01/01/1990 ${currTime}`) >= Date.parse(`01/01/1990 ${classStart}`)
    && Date.parse(`01/01/1990 ${currTime}`) <= Date.parse(`01/01/1990 ${classEnd}`) && isToday),

  isClassApporaching: (currTime, classStart, isToday) => {
    const threshold = 20;
    const mins = Math.floor((Date.parse(`01/01/1990 ${classStart}`) - Date.parse(`01/01/1990 ${currTime}`)) / 60000);
    return ((mins <= threshold && mins > 0) && isToday);
  },

  getCourses: async (callback) => {
    fetch('https://itsligo-utils.herokuapp.com/api/allcourses')
      .then(response => response.json())
      .then((json) => {
        document.querySelector('#loader').style.display = 'none';
        for (let i = 0; i < json.length; i += 1) {
          const opt = document.createElement('option');
          opt.text = json[i].title || json[i].course;
          opt.value = json[i].course;
          const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
          if (iOS) {
            const select = document.querySelector('#courses-select');
            select.append(opt.cloneNode(true));
          } else {
            const dataList = document.querySelector('#courses-datalist');
            dataList.append(opt);
          }
        }
        if (callback) callback();
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
