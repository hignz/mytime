import { createTimetable } from './timetable';
import { fetchCourseCodes, getSelectedValue, alertCheck } from './utils';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const timetableWindow = document.getElementById('timetable-window');
    const selectWindow = document.getElementById('select-window');
    const courseInput = document.getElementById('courses');
    const searchBtn = document.getElementById('searchBtn');
    const toggleBtn = document.getElementById('toggleBtn');

    function SearchButtonClick(semester) {
      const timetable = document.getElementById('timetable');
      while (timetable.firstChild) {
        timetable.removeChild(timetable.firstChild);
      }
      selectWindow.style.display = 'none';
      timetableWindow.style.display = 'block';
      const courseCode = getSelectedValue();
      if (semester) {
        window.location.hash =
          courseCode[0] === '#' ? `#${courseCode}/${semester}` : `${courseCode}/${semester}`;
      } else {
        window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
      }
      createTimetable(encodeURIComponent(courseCode), semester);
    }

    function BackButtonClick() {
      document.title = `MyTerm`;
      timetableWindow.style.display = 'none';
      selectWindow.style.display = 'block';
      window.history.pushState('', document.title, `${window.location.pathname}`);
      courseInput.focus();
    }

    if (window.history && window.history.pushState) {
      window.onpopstate = () => {
        const { hash } = window.location;
        if (hash === '') {
          window.location.reload();
        }
      };
    }

    courseInput.addEventListener('keyup', e => {
      if (courseInput.value.length < 1) {
        searchBtn.disabled = true;
        toggleBtn.disabled = true;
      } else {
        searchBtn.disabled = false;
        toggleBtn.disabled = false;
      }

      if (e.keyCode === 13 && !searchBtn.disabled && timetableWindow.style.display === 'none') {
        SearchButtonClick();
      }
    });

    document.addEventListener('keyup', e => {
      if (e.keyCode === 8 && timetableWindow.style.display === 'block') {
        BackButtonClick();
      }
    });

    if (window.location.hash) {
      document.getElementById('select-window').style.display = 'none';
      let semester = '';
      let hash = window.location.hash.substring(1);
      const hasSemester = RegExp(/^.*([/]\d|\/)$/).test(hash);
      if (hasSemester) {
        semester = hash.slice(-1);
        if (semester !== '0' && semester !== '1') semester = '0';
        hash = hash.substring(0, hash.length - 2);
      }
      createTimetable(encodeURIComponent(hash), hasSemester ? semester : '', () => {
        timetableWindow.style.display = 'block';
        alertCheck();
      });
      fetchCourseCodes();
    } else {
      fetchCourseCodes(() => {
        selectWindow.style.display = 'block';
      });
    }

    document.getElementById('searchBtn').addEventListener(
      'click',
      () => {
        SearchButtonClick();
        alertCheck();
      },
      false
    );

    document.getElementById('semOneBtn').addEventListener(
      'click',
      () => {
        SearchButtonClick('0');
        alertCheck();
      },
      false
    );

    document.getElementById('semTwoBtn').addEventListener(
      'click',
      () => {
        SearchButtonClick('1');
        alertCheck();
      },
      false
    );

    document.getElementById('backBtn').addEventListener('click', () => BackButtonClick(), false);
  },
  false
);
