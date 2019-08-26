import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import './styles/main.css';
import './styles/loader-min.css';
import './datalist-polyfill.min';
import Picker from 'vanilla-picker';
import { createTimetable } from './timetable';
import { fetchCourseCodes, getSelectedValue, alertCheck, displayElement } from './utils';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const $timetableWindow = document.getElementById('timetable-window');
    const $selectWindow = document.getElementById('select-window');
    const $courseInput = document.getElementById('courses');
    const $searchBtn = document.getElementById('searchBtn');
    const $toggleBtn = document.getElementById('toggleBtn');
    const $timetable = document.getElementById('timetable');
    const $footer = document.getElementById('footer');
    const $colleges = document.getElementById('colleges');
    const $colorPicker = document.getElementById('colorPicker');
    const $collegeSelect = document.getElementById('colleges');
    // const $colorPickerBg = document.getElementById('colorPickerBg');

    const searchParams = new URLSearchParams(window.location.search);

    let collegeIndex = $colleges.options[$colleges.selectedIndex].value;

    document.documentElement.style.setProperty('--accent', localStorage.getItem('accentColor'));
    document.documentElement.style.setProperty(
      '--accent-rgba',
      localStorage.getItem('accentColorRgba')
    );
    $colorPicker.selectedIndex = localStorage.getItem('colorPickerIndex');

    const parent = document.querySelector('#parent');
    const picker = new Picker(parent);
    picker.setColor(localStorage.getItem('accentColor'));
    picker.setOptions({ popup: 'left' });

    if (!localStorage.getItem('visited')) {
      window.location.reload(true);
      localStorage.setItem('visited', 1);
    }

    picker.onChange = c => {
      document.documentElement.style.setProperty('--accent', c.hex);
      localStorage.setItem('accentColor', c.hex);

      const rgbaAccent = c.rgbaString.split('(')[1].split(')')[0];
      document.documentElement.style.setProperty('--accent-rgba', rgbaAccent);
      localStorage.setItem('accentColorRgba', rgbaAccent);
    };

    if (searchParams.has('code')) {
      $selectWindow.style.display = 'none';
      displayElement($footer, false);

      createTimetable(
        searchParams.get('code'),
        searchParams.get('college') || '0',
        searchParams.get('sem'),
        () => {
          displayElement($timetableWindow, true);
          alertCheck();
        }
      );
      fetchCourseCodes(collegeIndex);
      displayElement($footer, false);
    } else {
      fetchCourseCodes(collegeIndex, () => {
        displayElement($selectWindow, true);
      });
      displayElement($footer, true);
    }

    const searchButtonClick = semester => {
      while ($timetable.firstChild) {
        $timetable.removeChild($timetable.firstChild);
      }

      displayElement($selectWindow, false);
      displayElement($timetableWindow, true);
      displayElement($footer, false);
      collegeIndex = $collegeSelect.options[$collegeSelect.selectedIndex].value;
      console.log(collegeIndex);
      const courseCode = getSelectedValue();
      window.history.pushState(
        '',
        document.title,
        `?code=${courseCode}&college=${collegeIndex}${semester ? `&sem=${semester}` : ''}`
      );

      createTimetable(courseCode, collegeIndex, semester || '');
    };

    const BackButtonClick = () => {
      document.title = `MyTerm`;
      displayElement($timetableWindow, false);
      displayElement($selectWindow, true);
      displayElement($footer, true);

      window.history.pushState('', document.title, `${window.location.pathname}`);
    };

    $colleges.addEventListener('change', () => {
      $courseInput.value = '';
      const index = $colleges.options[$colleges.selectedIndex].value;
      fetchCourseCodes(index);
    });

    function hexToRgbA(hex) {
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
    }

    $colorPicker.addEventListener('change', e => {
      document.documentElement.style.setProperty('--accent', e.target.value);
      localStorage.setItem('accentColor', e.target.value);
      localStorage.setItem('colorPickerIndex', $colorPicker.selectedIndex);

      const rgbaAccent = hexToRgbA(e.target.value);
      document.documentElement.style.setProperty('--accent-rgba', rgbaAccent);
      localStorage.setItem('accentColorRgba', rgbaAccent);
    });

    // $colorPickerBg.addEventListener('change', e => {
    //   document.documentElement.style.setProperty('--dark-background-color', e.target.value);
    //   localStorage.setItem('bgColor', e.target.value);
    //   localStorage.setItem('colorPickerBgIndex', $colorPicker.selectedIndex);
    // });

    $courseInput.addEventListener('keyup', e => {
      if ($courseInput.value.trim().length < 1) {
        $searchBtn.disabled = true;
        $toggleBtn.disabled = true;
      } else {
        $searchBtn.disabled = false;
        $toggleBtn.disabled = false;
      }

      if (e.keyCode === 13 && !$searchBtn.disabled && $timetableWindow.style.display === 'none') {
        searchButtonClick();
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
        searchButtonClick();
        alertCheck();
      },
      false
    );

    document.getElementById('semOneBtn').addEventListener(
      'click',
      () => {
        searchButtonClick('0');
        alertCheck();
      },
      false
    );

    document.getElementById('semTwoBtn').addEventListener(
      'click',
      () => {
        searchButtonClick('1');
        alertCheck();
      },
      false
    );

    document.getElementById('backBtn').addEventListener('click', () => BackButtonClick(), false);
  },
  false
);
