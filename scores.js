// ==UserScript==
// @name         Hidden Scores
// @namespace    http://tampermonkey.net/
// @version      2024-10-29
// @description  try to take over the world!
// @author       You
// @match        https://apclassroom.collegeboard.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  (function (open) {
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener("load", function () {
        if (this.responseURL.includes("chameleon/student_assignments/" + getCourseId() + "/?status=completed")) {
          const assignments = JSON.parse(this.response).assignments;
          const assignmentsTable = document.getElementsByClassName("student_assignments_table")[0];
          for (const index in assignments) {
            const assignment = assignments[index];
            if (assignment.display_results || assignment.awaiting_scoring) continue;

            const tableRow = assignmentsTable.querySelector(`[aria-label="${assignment.title}"]`);
            const resultsCell = tableRow.getElementsByClassName("results-cell")[0].firstElementChild.firstElementChild.firstElementChild;
            const a = document.createElement("a");
            a.href = `https://apclassroom.collegeboard.org/${getCourseId()}/assessments/results/${assignment.id}`
            a.innerHTML = `(${assignment.score}/${assignment.max_score})`
            resultsCell.innerHTML += " "
            resultsCell.appendChild(a);
          }
        }
      }, false);
      open.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype.open);

})();

function getCourseId() {
  return document.URL.match(/https:\/\/apclassroom\.collegeboard\.org\/(\d+)\/assignments\?status=completed/)[1];
}
