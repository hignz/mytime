import { createTimetable } from './timetable';
import { fetchCourseCodes, getSelectedValue, alertCheck } from './utils';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    if (window.history && window.history.pushState) {
      window.onpopstate = () => {
        const { hash } = window.location;

        if (hash === '') {
          window.location.reload();
        }
      };
    }

    if (navigator.userAgent.includes('Snapchat')) {
      document.querySelector('#courseinfo-modal').modal('show');
    }

    const timetableWindow = document.getElementById('timetable-window');
    const selectWindow = document.getElementById('select-window');
    const courseInput = document.getElementById('courses');
    const searchBtn = document.getElementById('searchBtn');
    courseInput.addEventListener('keyup', () => {
      console.log(searchBtn);
      if (courseInput.value.length === 0) {
        searchBtn.disabled = true;
      } else {
        searchBtn.disabled = false;
      }
    });

    if (window.location.hash) {
      document.getElementById('select-window').style.display = 'none';
      createTimetable(encodeURIComponent(window.location.hash.substring(1)), () => {
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
        const timetable = document.getElementById('timetable');
        while (timetable.firstChild) {
          timetable.removeChild(timetable.firstChild);
        }
        selectWindow.style.display = 'none';
        timetableWindow.style.display = 'block';
        const courseCode = getSelectedValue();
        window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
        createTimetable(encodeURIComponent(courseCode));
        alertCheck();
      },
      false
    );

    document.getElementById('backBtn').addEventListener(
      'click',
      () => {
        document.title = `MyTerm`;
        timetableWindow.style.display = 'none';
        selectWindow.style.display = 'block';
        window.history.pushState('', document.title, `${window.location.pathname}`);
      },
      false
    );
  },
  false
);
