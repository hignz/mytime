import { createTimetable } from './timetable';
import { getCourses } from './utils';

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

    const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    if (iOS) {
      document.getElementById('courses').style.display = 'none';
      document.getElementById('courses-select').style.display = 'block';
    }

    if (window.location.hash) {
      document.getElementById('select-window').style.display = 'none';
      await createTimetable(encodeURIComponent(window.location.hash.substring(1)), () => {
        document.getElementById('timetable-window').style.display = 'block';
      });
      await getCourses();
    } else {
      await getCourses(() => {
        document.getElementById('select-window').style.display = 'block';
      });
    }

    document.getElementById('searchBtn').addEventListener(
      'click',
      async () => {
        if (document.getElementById('timetable')) document.getElementById('timetable').remove();
        document.getElementById('select-window').style.display = 'none';
        document.getElementById('timetable-window').style.display = 'block';
        const select = document.getElementById('courses');
        let courseCode = select.value;
        if (iOS) {
          const iosSelect = document.getElementById('courses-select');
          courseCode = iosSelect.options[iosSelect.selectedIndex].value;
        }
        window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
        await createTimetable(encodeURIComponent(courseCode));
      },
      false
    );

    document.getElementById('backBtn').addEventListener(
      'click',
      async () => {
        document.title = `MyTerm`;
        document.getElementById('timetable-window').style.display = 'none';
        document.getElementById('select-window').style.display = 'block';
        window.history.pushState('', document.title, `${window.location.pathname}`);
      },
      false
    );
  },
  false
);
