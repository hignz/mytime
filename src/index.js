import { createTimetable } from './timetable';
import { getCourses } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
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
    document.querySelector('#courses').style.display = 'none';
    document.querySelector('#courses-select').style.display = 'block';
  }

  if (window.location.hash) {
    document.querySelector('#select-window').style.display = 'none';
    await createTimetable(encodeURIComponent(window.location.hash.substring(1)), () => {
      document.querySelector('#timetable-window').style.display = 'block';
    });
    await getCourses();
  } else {
    await getCourses(() => {
      document.querySelector('#select-window').style.display = 'block';
    });
  }

  document.querySelector('#searchBtn').addEventListener('click', async () => {
    if (document.querySelector('#timetable')) document.querySelector('#timetable').remove();
    document.querySelector('#select-window').style.display = 'none';
    document.querySelector('#timetable-window').style.display = 'block';
    const select = document.querySelector('#courses');
    let courseCode = select.value;
    if (iOS) {
      const iosSelect = document.querySelector('#courses-select');
      courseCode = iosSelect.options[iosSelect.selectedIndex].value;
    }
    window.location.hash = courseCode[0] === '#' ? `#${courseCode}` : courseCode;
    await createTimetable(encodeURIComponent(courseCode));
  }, false);

  document.querySelector('#backBtn').addEventListener('click', async () => {
    document.querySelector('#timetable-window').style.display = 'none';
    document.querySelector('#select-window').style.display = 'block';
    window.history.pushState('', document.title, `${window.location.pathname}`);
  }, false);
}, false);
