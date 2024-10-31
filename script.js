"use strict";
// ==UserScript==
// @name         ShowHiddenScores
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Displays hidden scores on CollegeBoard assessments
// @author       Krumbit
// @match        https://apclassroom.collegeboard.org/*
// @updateURL    https://raw.githubusercontent.com/Krumbit/ShowHiddenScores/main/script.js
// @downloadURL  https://raw.githubusercontent.com/Krumbit/ShowHiddenScores/main/script.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function (open) {
  // Listen to incoming XML HTTP requests
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      // Check if response URL contains student assignment data
      if (this.responseURL.includes("chameleon/student_assignments/" + getCourseId() + "/?status=completed")) {
        // Parse the response to get the assignments data
        const assignments = JSON.parse(this.response).assignments;
        // Get the table element that contains the student assignments
        const assignmentsTable = document.getElementsByClassName("student_assignments_table")[0];
        // Iterate through each assignment
        for (const index in assignments) {
          const assignment = assignments[index];
          // Skip assignments that already display results or are awaiting scoring
          if (assignment.display_results || assignment.awaiting_scoring) continue;

          // Find the table row corresponding to the current assignment
          const tableRow = assignmentsTable.querySelector(`[aria-label="${assignment.title}"]`);
          // Get the cell that will contain the results
          const resultsCell = tableRow.getElementsByClassName("results-cell")[0].firstElementChild.firstElementChild.firstElementChild;

          // Create a new anchor element for the results link
          const a = document.createElement("a");
          a.href = `https://apclassroom.collegeboard.org/${getCourseId()}/assessments/results/${assignment.id}`;
          a.innerHTML = `(${assignment.score}/${assignment.max_score})`;

          // Add a space before the new link
          resultsCell.innerHTML += " ";
          // Append the new link to the results cell
          resultsCell.appendChild(a);
        }
      }
    }, false);
    open.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.open);

function getCourseId() {
  return document.URL.match(/https:\/\/apclassroom\.collegeboard\.org\/(\d+)\/assignments\?status=completed/)[1];
}
