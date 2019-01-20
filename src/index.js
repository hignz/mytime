import { createTimetable } from './timetable';
import { fetchCourseCodes, getSelectedValue } from './utils';

document.addEventListener(
  'DOMContentLoaded',
  async () => {
    if (window.history && window.history.pushState) {
      window.onpopstate = () => {
        const { hash } = window.location;

        if (hash === '') {
          window.location.reload();
        }
      };
    }

    const isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    // if (isIOS) {
    //   document.getElementById('courses').style.display = 'none';
    //   document.getElementById('courses-select').style.display = 'block';
    // }

    if (navigator.userAgent.includes('Snapchat')) {
      document.querySelector('#courseinfo-modal').modal('show');
    }

    const timetableWindow = document.getElementById('timetable-window');
    const selectWindow = document.getElementById('select-window');

    if (window.location.hash) {
      document.getElementById('select-window').style.display = 'none';
      await createTimetable(encodeURIComponent(window.location.hash.substring(1)), () => {
        timetableWindow.style.display = 'block';
      });
      await fetchCourseCodes();
    } else {
      await fetchCourseCodes(() => {
        selectWindow.style.display = 'block';
      });
    }

    document.getElementById('searchBtn').addEventListener(
      'click',
      async () => {
        const timetable = document.getElementById('timetable');
        while (timetable.firstChild) {
          timetable.removeChild(timetable.firstChild);
        }
        selectWindow.style.display = 'none';
        timetableWindow.style.display = 'block';
        const courseCode = getSelectedValue(isIOS);
        window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
        await createTimetable(encodeURIComponent(courseCode));
      },
      false
    );

    document.getElementById('backBtn').addEventListener(
      'click',
      async () => {
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
