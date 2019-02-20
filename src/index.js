import { createTimetable } from './timetable';
import { fetchCourseCodes, getSelectedValue, alertCheck } from './utils';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const $timetableWindow = document.getElementById('timetable-window');
    const $selectWindow = document.getElementById('select-window');
    const $courseInput = document.getElementById('courses');
    const $searchBtn = document.getElementById('searchBtn');
    const $toggleBtn = document.getElementById('toggleBtn');
    const $timetable = document.getElementById('timetable');
    // const $collegeSelect = document.getElementById('selectColleges');

    const SearchButtonClick = semester => {
      while ($timetable.firstChild) {
        $timetable.removeChild($timetable.firstChild);
      }
      $selectWindow.style.display = 'none';
      $timetableWindow.style.display = 'block';
      // const collegeIndex = $collegeSelect.options[$collegeSelect.selectedIndex].value;
      const courseCode = getSelectedValue();
      window.location.hash = `#${courseCode}-${0}${semester ? `-${semester}` : ''}`;
      createTimetable(encodeURIComponent(courseCode), 0, semester || '');
    };

    function BackButtonClick() {
      document.title = `MyTerm`;
      $timetableWindow.style.display = 'none';
      $selectWindow.style.display = 'block';
      window.history.pushState('', document.title, `${window.location.pathname}`);
    }

    if (window.location.hash) {
      $selectWindow.style.display = 'none';
      let hash = window.location.hash.substring(1);
      const hashSplit = hash.split('-');
      hash = hash.replace(/(-\d)/g, '');
      createTimetable(
        encodeURIComponent(hash),
        hashSplit[1] || '0',
        hashSplit[2] === undefined ? '' : hashSplit[2],
        () => {
          $timetableWindow.style.display = 'block';
          alertCheck();
        }
      );
      fetchCourseCodes();
    } else {
      fetchCourseCodes(() => {
        $selectWindow.style.display = 'block';
      });
    }

    if (window.history && window.history.pushState) {
      window.onpopstate = () => {
        const { hash } = window.location;
        if (hash === '') {
          window.location.reload();
        }
      };
    }

    $courseInput.addEventListener('keyup', e => {
      if ($courseInput.value.length < 1) {
        $searchBtn.disabled = true;
        $toggleBtn.disabled = true;
      } else {
        $searchBtn.disabled = false;
        $toggleBtn.disabled = false;
      }

      if (e.keyCode === 13 && !$searchBtn.disabled && $timetableWindow.style.display === 'none') {
        SearchButtonClick();
      }
    });

    document.addEventListener('keyup', e => {
      if (e.keyCode === 8 && $timetableWindow.style.display === 'block') {
        BackButtonClick();
      }
    });

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
