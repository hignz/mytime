!function(e){var t={};function n(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports={getPlural:e=>e>1?"s":"",isClassNow:(e,t,n,o)=>Date.parse(`01/01/1990 ${e}`)>=Date.parse(`01/01/1990 ${t}`)&&Date.parse(`01/01/1990 ${e}`)<=Date.parse(`01/01/1990 ${n}`)&&o,isClassApporaching:(e,t,n)=>{const o=Math.floor((Date.parse(`01/01/1990 ${t}`)-Date.parse(`01/01/1990 ${e}`))/6e4);return o<=20&&o>0&&n},fetchCourseCodes:async e=>{fetch("https://itsligo-utils.herokuapp.com/api/allcourses").then(e=>e.json()).then(t=>{console.time("getCourses()"),document.getElementById("loader").style.display="none";const n=document.getElementById("courses-datalist"),o=document.createDocumentFragment();let a;for(let e=0;e<t.length;e+=1)(a=document.createElement("option")).text=t[e].title||t[e].course,a.value=t[e].course,o.append(a);n.append(o),e&&e(),console.timeEnd("getCourses()")}).catch(e=>{console.error(e)})},getSelectedValue:()=>{return document.getElementById("courses").value}}},function(e,t,n){"use strict";n.r(t);var o=n(0);const a=(e,t,n)=>{if(e>t){const a=Math.abs(new Date(`01/01/1990 ${e}`).getTime()-new Date(`01/01/1990 ${t}`).getTime())/6e4;if(a>0){const e=a>=60?`Break: ${a/60} hour${Object(o.getPlural)(a/60)}`:`Break: ${a} minutes`,t=document.createElement("a");t.innerHTML=e,t.className="list-group-item item font-weight-bold text-success",n.append(t)}}};function l(e,t){fetch(`https://itsligo-utils.herokuapp.com/api/timetable/${e}`).then(e=>e.json()).then(n=>{if(console.time("timetable"),document.getElementById("loader").style.display="none",n.empty)return document.getElementById("timetable-window").style.display="block",void(document.getElementById("course-title").textContent="No timetable data found");document.title=`MyTerm | ${decodeURIComponent(e)}`,document.getElementById("courseinfo-direct-link").href=n.url;const l=(new Date).toLocaleTimeString("en-GB"),d=document.getElementById("timetable");document.getElementById("timetable-window").append(d),document.getElementById("course-title").textContent=decodeURIComponent(e);const s=document.createDocumentFragment();let i,c;for(let e=0;e<n.data.length-2;e+=1)if(n.data[e].length){let r=0;const m=document.createElement("div");m.className="card-container mb-2",m.innerHTML=`<div class="card" id="card${e}">\n          <div class="card-header" id="heading${e}">\n            <h5 class="mb-0">\n            <button type="button" class="btn btn-lg heading font-weight-bold ml-1 text-left" id="header${e}" style="width: 100%" data-toggle="collapse" data-target="#collapse${e}"\n              aria-expanded="true" aria-controls="collapse${e}">\n                ${n.data[e][0].day}\n                <span class="badge float-right badge-pill mt-1" id="class-total-badge${e}">${n.data[e].length}\n          </span>\n            </button>\n            </h5>\n            <div id="collapse${e}" class="collapse show" aria-labelledby="heading${e}"></div>\n          </div>`,s.append(m);const u=(new Date).getDay()-1===e;s.getElementById(`header${e}`).classList.add(u?"text-danger":"text-white"),u&&document.getElementById(`class-total-badge${e}`).classList.add("badge-danger"),c=s.getElementById(`collapse${e}`);for(let t=0;t<n.data[e].length;t+=1){const d=n.data[e][t];a(d.startTime,r,c),i=document.createElement("a");const s=d.name.split("/")[0].replace(/ GD & SD/,""),m=d.room.split(" (")[0];i.innerHTML=`${d.startTime} - ${d.endTime}<br>${s}<br>${m.split("-")[0]} - ${d.type}<br>${d.teacher.replace(",",", ")}`,i.className="list-group-item item animated fadeIn",i.classList.add(Object(o.isClassNow)(l,d.startTime,d.endTime,u)?"text-danger":Object(o.isClassApporaching)(l,d.startTime,u)?"text-warning":"a"),r=d.endTime,Object(o.isClassNow)(l,d.startTime,d.endTime,u)&&i.classList.add("font-weight-bold"),c.appendChild(i)}t&&t(),d.append(s)}console.timeEnd("timetable")}).catch(e=>{document.getElementById("timetable-window").style.display="block",document.getElementById("course-title").text="Invalid course entered",console.error(e)})}document.addEventListener("DOMContentLoaded",async()=>{window.history&&window.history.pushState&&(window.onpopstate=(()=>{const{hash:e}=window.location;""===e&&window.location.reload()}));!!navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform);navigator.userAgent.includes("Snapchat")&&document.querySelector("#courseinfo-modal").modal("show");const e=document.getElementById("timetable-window"),t=document.getElementById("select-window");window.location.hash?(document.getElementById("select-window").style.display="none",await l(encodeURIComponent(window.location.hash.substring(1)),()=>{e.style.display="block"}),await Object(o.fetchCourseCodes)()):await Object(o.fetchCourseCodes)(()=>{t.style.display="block"}),document.getElementById("searchBtn").addEventListener("click",async()=>{const n=document.getElementById("timetable");for(;n.firstChild;)n.removeChild(n.firstChild);t.style.display="none",e.style.display="block";const a=Object(o.getSelectedValue)();window.location.hash="#"===a[0]?`#${a}`:a,await l(encodeURIComponent(a))},!1),document.getElementById("backBtn").addEventListener("click",async()=>{document.title="MyTerm",e.style.display="none",t.style.display="block",window.history.pushState("",document.title,`${window.location.pathname}`)},!1)},!1)}]);