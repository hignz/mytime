import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/alert';
import './datalist-polyfill.min';
import './styles/main.css';
import Picker from 'vanilla-picker';
import { createTimetable } from './timetable';
import {
  fetchCourseCodes,
  getSelectedValue,
  displayElement,
  hexToRgbA,
  clearCourseInfoModal
} from './utils';

let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  deferredPrompt = e;
});

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const $loader = document.getElementById('loader');
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
    const $confirmationModal = document.getElementById('course-confirmation-modal');
    // const $colorPickerBg = document.getElementById('colorPickerBg');
    const parent = document.getElementById('parent');
    const picker = new Picker({
      parent,
      popup: 'left',
      alpha: false,
      color: localStorage.getItem('customAccentColor') || localStorage.getItem('accentColor')
    });

    const isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;

    const searchParams = new URLSearchParams(window.location.search);

    let collegeIndex = $colleges.options[$colleges.selectedIndex].value;

    document.documentElement.style.setProperty('--accent', localStorage.getItem('accentColor'));
    document.documentElement.style.setProperty(
      '--accent-rgba',
      localStorage.getItem('accentColorRgba')
    );
    $colorPicker.selectedIndex = localStorage.getItem('colorPickerIndex');

    const customOption = document.getElementById('customOption');
    customOption.value = localStorage.getItem('customAccentColor') || '#eeeeee';

    if (!localStorage.getItem('showConfirmationModal')) {
      localStorage.setItem('showConfirmationModal', true);
    }
    document.getElementById('showConfirmationModal').checked = JSON.parse(
      localStorage.getItem('showConfirmationModal')
    );

    picker.onChange = c => {
      document.documentElement.style.setProperty('--accent', c.hex);
      localStorage.setItem('accentColor', c.hex);

      const rgbaAccent = c.rgbaString.split('(')[1].split(')')[0];
      document.documentElement.style.setProperty('--accent-rgba', rgbaAccent);
      localStorage.setItem('accentColorRgba', rgbaAccent);
    };

    picker.onClose = c => {
      customOption.removeAttribute('hidden');
      customOption.value = c.hex.substring(0, c.hex.length - 2);
      $colorPicker.selectedIndex = $colorPicker.options.length - 1;
      localStorage.setItem('colorPickerIndex', $colorPicker.selectedIndex);
      localStorage.setItem('customAccentColor', c.hex.substring(0, c.hex.length - 2));

      if (c.hex.substring(0, c.hex.length - 2) === '#696969') {
        window.open('https://i.imgur.com/AnxcJSO.jpg');
      }
    };

    $courseInput.addEventListener('change', e => {
      if (isMobile && JSON.parse(localStorage.getItem('showConfirmationModal'))) {
        const selectedOption = document.querySelector(
          `#courses-datalist option[value='${$courseInput.value}']`
        );

        if (selectedOption !== null) {
          $confirmationModal.querySelector('#content').innerHTML = selectedOption.value;
          document.getElementById('btnOpenModal').click();
        }
      }
    });

    const brandLetters = Array.from(document.querySelectorAll('.brand'));

    document.querySelector('.brand-container').addEventListener('click', e => {
      const node = e.target;
      if (node.classList.contains('inline-block')) {
        if (node.classList.contains('vibrate-1')) {
          node.classList.remove('vibrate-1');
          return;
        }
        node.classList.add('vibrate-1');
        const allSelected = brandLetters.every(l => l.classList.contains('vibrate-1'));
        if (allSelected) {
          document.querySelector('.brand-container').classList.add('tracking-out-expand-fwd-top');
        }
      }
    });

    if (searchParams.has('code')) {
      displayElement($selectWindow, false);
      displayElement($footer, false);
      displayElement($timetableWindow, true);

      createTimetable(
        searchParams.get('code'),
        searchParams.get('college') || '0',
        searchParams.get('sem')
      );
    } else {
      displayElement($selectWindow, true);
      fetchCourseCodes(collegeIndex, () => {
        displayElement($loader, false);
        displayElement($footer, true);
      });
    }

    document.getElementById('showConfirmationModal').addEventListener('change', e => {
      localStorage.setItem('showConfirmationModal', e.target.checked);
    });

    const searchButtonClick = semester => {
      $timetable.innerHTML = '';

      displayElement($selectWindow, false);
      displayElement($timetableWindow, true);
      displayElement($footer, false);
      collegeIndex = $collegeSelect.options[$collegeSelect.selectedIndex].value;
      const courseCode = getSelectedValue();
      window.history.pushState(
        '',
        document.title,
        `?code=${decodeURIComponent(courseCode)}&college=${collegeIndex}${
          semester ? `&sem=${semester}` : ''
        }`
      );

      displayElement($loader, true);
      createTimetable(courseCode, collegeIndex, semester || '');
      document.querySelector('.brand-container').classList.remove('tracking-out-expand-fwd-top');
    };

    const BackButtonClick = () => {
      document.title = `MyTerm`;
      displayElement($timetableWindow, false);
      displayElement($selectWindow, true);
      displayElement($footer, true);
      fetchCourseCodes(collegeIndex);

      document.getElementById('course-title').innerHTML = '';

      clearCourseInfoModal();

      window.history.pushState('', document.title, `${window.location.pathname}`);
    };

    $colleges.addEventListener('change', () => {
      $courseInput.value = '';
      $searchBtn.disabled = true;
      const index = $colleges.options[$colleges.selectedIndex].value;
      fetchCourseCodes(index);
    });

    $colorPicker.addEventListener('change', e => {
      const selectedColor = e.target.value;
      // Set CSS variable, set local storage hex and selected index
      document.documentElement.style.setProperty('--accent', selectedColor);
      localStorage.setItem('accentColor', selectedColor);
      localStorage.setItem('colorPickerIndex', $colorPicker.selectedIndex);

      // Get RGBA of selected hex, set CSS variable and store in local storage
      const rgbaAccent = hexToRgbA(selectedColor);
      document.documentElement.style.setProperty('--accent-rgba', rgbaAccent);
      localStorage.setItem('accentColorRgba', rgbaAccent);

      // Set pickers color for next open
      picker.setColor(selectedColor);
    });

    // $colorPickerBg.addEventListener('change', e => {
    //   document.documentElement.style.setProperty('--dark-background-color', e.target.value);
    //   localStorage.setItem('bgColor', e.target.value);
    //   localStorage.setItem('colorPickerBgIndex', $colorPicker.selectedIndex);
    // });

    window.onpopstate = () => {
      // window.location.reload();
      BackButtonClick();
    };

    $courseInput.addEventListener('change', e => {
      if ($courseInput.value.trim().length < 1) {
        $searchBtn.disabled = true;
        $toggleBtn.disabled = true;
      } else {
        $searchBtn.disabled = false;
        $toggleBtn.disabled = false;
      }
    });

    document.addEventListener('keyup', e => {
      if (e.keyCode === 8 && $timetableWindow.style.display === 'block') {
        BackButtonClick();
      }
      if (e.keyCode === 13 && !$searchBtn.disabled && $timetableWindow.style.display === 'none') {
        searchButtonClick();
      }
    });

    document.getElementById('confirmationCloseBtn').addEventListener(
      'click',
      () => {
        $courseInput.value = '';
      },
      false
    );

    document.getElementById('confirmationSearchBtn').addEventListener(
      'click',
      () => {
        document.getElementById('btnOpenModal').click();
        searchButtonClick();
      },
      false
    );

    document.getElementById('searchBtn').addEventListener(
      'click',
      () => {
        searchButtonClick();
      },
      false
    );

    document.getElementById('semOneBtn').addEventListener(
      'click',
      () => {
        searchButtonClick('0');
      },
      false
    );

    document.getElementById('semTwoBtn').addEventListener(
      'click',
      () => {
        searchButtonClick('1');
      },
      false
    );

    document.getElementById('backBtn').addEventListener('click', () => BackButtonClick(), false);
  },
  false
);
