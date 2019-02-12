/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _timetable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timetable */ \"./src/timetable.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\ndocument.addEventListener(\n  'DOMContentLoaded',\n  () => {\n    const $timetableWindow = document.getElementById('timetable-window');\n    const $selectWindow = document.getElementById('select-window');\n    const $courseInput = document.getElementById('courses');\n    const $searchBtn = document.getElementById('searchBtn');\n    const $toggleBtn = document.getElementById('toggleBtn');\n    const $timetable = document.getElementById('timetable');\n    const $collegeSelect = document.getElementById('selectColleges');\n\n    const SearchButtonClick = semester => {\n      while ($timetable.firstChild) {\n        $timetable.removeChild($timetable.firstChild);\n      }\n      $selectWindow.style.display = 'none';\n      $timetableWindow.style.display = 'block';\n      const collegeIndex = $collegeSelect.options[$collegeSelect.selectedIndex].value;\n      const courseCode = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"getSelectedValue\"])();\n      window.location.hash = `#${courseCode}-${collegeIndex}${semester ? `-${semester}` : ''}`;\n      Object(_timetable__WEBPACK_IMPORTED_MODULE_0__[\"createTimetable\"])(encodeURIComponent(courseCode), semester);\n    };\n\n    function BackButtonClick() {\n      document.title = `MyTerm`;\n      $timetableWindow.style.display = 'none';\n      $selectWindow.style.display = 'block';\n      window.history.pushState('', document.title, `${window.location.pathname}`);\n      $courseInput.focus();\n    }\n\n    if (window.location.hash) {\n      $selectWindow.style.display = 'none';\n      let hash = window.location.hash.substring(1);\n      const hashSplit = hash.split('-');\n      hash = hash.replace(/(-\\d)/g, '');\n      Object(_timetable__WEBPACK_IMPORTED_MODULE_0__[\"createTimetable\"])(\n        encodeURIComponent(hash),\n        hashSplit[1] === undefined ? '' : hashSplit[1],\n        hashSplit[2] === undefined ? '' : hashSplit[2],\n        () => {\n          $timetableWindow.style.display = 'block';\n          Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"alertCheck\"])();\n        }\n      );\n      Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"fetchCourseCodes\"])();\n    } else {\n      Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"fetchCourseCodes\"])(() => {\n        $selectWindow.style.display = 'block';\n      });\n    }\n\n    if (window.history && window.history.pushState) {\n      window.onpopstate = () => {\n        const { hash } = window.location;\n        if (hash === '') {\n          window.location.reload();\n        }\n      };\n    }\n\n    $courseInput.addEventListener('keyup', e => {\n      if ($courseInput.value.length < 1) {\n        $searchBtn.disabled = true;\n        $toggleBtn.disabled = true;\n      } else {\n        $searchBtn.disabled = false;\n        $toggleBtn.disabled = false;\n      }\n\n      if (e.keyCode === 13 && !$searchBtn.disabled && $timetableWindow.style.display === 'none') {\n        SearchButtonClick();\n      }\n    });\n\n    document.addEventListener('keyup', e => {\n      if (e.keyCode === 8 && $timetableWindow.style.display === 'block') {\n        BackButtonClick();\n      }\n    });\n\n    document.getElementById('searchBtn').addEventListener(\n      'click',\n      () => {\n        SearchButtonClick();\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"alertCheck\"])();\n      },\n      false\n    );\n\n    document.getElementById('semOneBtn').addEventListener(\n      'click',\n      () => {\n        SearchButtonClick('0');\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"alertCheck\"])();\n      },\n      false\n    );\n\n    document.getElementById('semTwoBtn').addEventListener(\n      'click',\n      () => {\n        SearchButtonClick('1');\n        Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"alertCheck\"])();\n      },\n      false\n    );\n\n    document.getElementById('backBtn').addEventListener('click', () => BackButtonClick(), false);\n  },\n  false\n);\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/timetable.js":
/*!**************************!*\
  !*** ./src/timetable.js ***!
  \**************************/
/*! exports provided: createTimetable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createTimetable\", function() { return createTimetable; });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst checkForBreak = (startTime, lastEndTime, currentCollapse, currentTime, i) => {\n  if (startTime > lastEndTime) {\n    const difference =\n      Math.abs(\n        new Date(`01/01/1990 ${startTime}`).getTime() -\n          new Date(`01/01/1990 ${lastEndTime}`).getTime()\n      ) / 60000;\n    if (difference > 0) {\n      const message =\n        difference >= 60\n          ? `Break: ${difference / 60} hour${Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getPlural\"])(difference / 60)}`\n          : `Break: ${difference} minutes`;\n      const freePeriod = document.createElement('a');\n      freePeriod.innerHTML = message;\n      freePeriod.className = `list-group-item item font-weight-bold ${\n        Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isToday\"])(i) && Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isClassOver\"])(lastEndTime, currentTime) ? 'text-muted' : 'text-success'\n      }`;\n      currentCollapse.append(freePeriod);\n    }\n  }\n};\n\nfunction createTimetable(courseCode, collegeIndex, semester, callback) {\n  fetch(\n    `https://itsligo-utils.herokuapp.com/api/timetable/${courseCode}/${collegeIndex}/${semester ||\n      ''}`\n  )\n    .then(response => response.json())\n    .then(json => {\n      console.time('timetable');\n      document.getElementById('loader').style.display = 'none';\n      if (json.empty) {\n        document.getElementById('timetable-window').style.display = 'block';\n        document.getElementById('course-title').textContent = 'No timetable found';\n        document.getElementById('courseinfo-direct-link').href = json.url;\n        return;\n      }\n      document.getElementById('courseinfo-direct-link').href = json.url;\n      document.title = `MyTerm | ${decodeURIComponent(courseCode)}`;\n      const timetable = document.getElementById('timetable');\n      document.getElementById('timetable-window').append(timetable);\n      document.getElementById('course-title').textContent = decodeURIComponent(courseCode);\n      const frag = document.createDocumentFragment();\n      let classEntry;\n      let currentCollapse;\n      const mainCard = document.querySelector('#temp-main');\n      const currentTime = new Date().toLocaleTimeString('en-GB');\n      let clone = document.importNode(mainCard.content, true);\n\n      // Create headers and badges\n      for (let i = 0; i < json.data.length - 2; i += 1) {\n        if (json.data[i].length) {\n          let lastClassTime = 0;\n          clone = document.importNode(mainCard.content, true);\n          const card = clone.querySelector('#card-main');\n          card.id += i;\n          const heading = clone.querySelector('#heading');\n          heading.id += i;\n          const header = clone.querySelector('#header');\n          header.id += i;\n          header.setAttribute('data-target', `#collapse${i}`);\n          header.setAttribute('aria-controls', `collapse${i}`);\n          header.className += ` ${Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isToday\"])(i) ? 'text-danger font-weight-bold' : 'text-white'}`;\n          header.innerHTML += json.data[i][0].day;\n          currentCollapse = clone.querySelector('#collapse');\n          currentCollapse.id += i;\n          const badge = clone.querySelector(`#class-total-badge`);\n          badge.id += i;\n          badge.innerHTML = json.data[i].length;\n          badge.className += Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isToday\"])(i) ? ' badge-danger' : '';\n\n          frag.append(card);\n          currentCollapse = frag.getElementById(`collapse${i}`);\n\n          if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isToday\"])(i)) currentCollapse.classList.add('show');\n\n          // Create class entries\n          for (let j = 0; j < json.data[i].length; j += 1) {\n            const currClass = json.data[i][j];\n            checkForBreak(currClass.startTime, lastClassTime, currentCollapse, currentTime, i);\n            classEntry = document.createElement('a');\n            const className = currClass.name.split('/')[0].replace(/ GD & SD/, '');\n            const room = currClass.room.split(' (')[0];\n            const p = document.createElement('p');\n            p.innerHTML = `${currClass.startTime} - ${currClass.endTime}<br>${className}<br>\n              ${room.split('-')[0]} - ${room.split('-')[1]}<br>\n              ${currClass.teacher.replace(',', ', ')}`;\n            p.classList.add('mb-0');\n            classEntry.className = `list-group-item item`;\n            if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isToday\"])(i)) {\n              classEntry.className += ` ${\n                Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isClassNow\"])(currClass.startTime, currClass.endTime, currentTime)\n                  ? 'text-danger font-weight-bold'\n                  : Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isClassApporaching\"])(currClass.startTime, currentTime)\n                  ? 'text-warning'\n                  : Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"isClassOver\"])(currClass.endTime, currentTime)\n                  ? 'text-muted'\n                  : ''\n              }`;\n            }\n\n            lastClassTime = currClass.endTime;\n            classEntry.append(p);\n            currentCollapse.appendChild(classEntry);\n          }\n\n          if (typeof callback === 'function') callback();\n        }\n      }\n      // const card = document.querySelector('#temp-next-class');\n      // const currentClassClone = document.importNode(card.content, true);\n      // currentClassClone.querySelector('#card-header span').innerHTML = 'currClass.room';\n      // timetable.append(currentClassClone);\n      timetable.append(frag);\n      console.timeEnd('timetable');\n    })\n    .catch(error => {\n      document.getElementById('timetable-window').style.display = 'block';\n      document.getElementById('course-title').text = 'Invalid course entered';\n      console.error(error);\n    });\n}\n\n\n//# sourceURL=webpack:///./src/timetable.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  getPlural: number => (number > 1 ? 's' : ''),\n\n  isToday: dayInt => new Date().getDay() - 1 === dayInt,\n\n  isClassNow: (classStart, classEnd, currentTime) =>\n    new Date(`01/01/1990 ${currentTime}`) >= new Date(`01/01/1990 ${classStart}`) &&\n    new Date(`01/01/1990 ${currentTime}`) <= new Date(`01/01/1990 ${classEnd}`),\n\n  isClassApporaching: (classStart, currentTime) => {\n    const threshold = 20;\n    const mins = Math.floor(\n      (Date.parse(`01/01/1990 ${classStart}`) - Date.parse(`01/01/1990 ${currentTime}`)) / 60000\n    );\n    return mins <= threshold && mins > 0;\n  },\n\n  isClassOver: (classEnd, currentTime) =>\n    new Date(`01/01/1990 ${classEnd}`) - new Date(`01/01/1990 ${currentTime}`) < 0,\n\n  fetchCourseCodes: async callback => {\n    fetch('https://itsligo-utils.herokuapp.com/api/allcourses')\n      .then(response => response.json())\n      .then(json => {\n        console.time('getCourses()');\n        document.getElementById('loader').style.display = 'none';\n        const dataList = document.getElementById('courses-datalist');\n        const frag = document.createDocumentFragment();\n        let opt;\n        for (let i = 0; i < json.length; i += 1) {\n          opt = document.createElement('option');\n          opt.text = json[i].course;\n          opt.value = json[i].title || json[i].course;\n          opt.setAttribute('data-value', json[i].course);\n          frag.append(opt);\n        }\n        dataList.append(frag);\n\n        if (typeof callback === 'function') callback();\n        console.timeEnd('getCourses()');\n      })\n      .catch(error => {\n        console.error(error);\n      });\n  },\n\n  getSelectedValue: () => {\n    const input = document.getElementById('courses');\n    const courseCode = input.value;\n    const selectedOption = document.querySelector(\n      `#courses-datalist option[value='${courseCode}']`\n    );\n    if (selectedOption === null) {\n      return '';\n    }\n    return selectedOption.dataset.value;\n  },\n\n  alertCheck: () => {\n    if (!localStorage.getItem('visted') && window.location.hash !== '') {\n      localStorage.setItem('visted', true);\n      document.getElementById('alert').style.display = 'block';\n    }\n  }\n};\n\n\n//# sourceURL=webpack:///./src/utils.js?");

/***/ })

/******/ });