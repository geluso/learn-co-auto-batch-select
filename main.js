// ==UserScript==
// @name         Learn Deploy Automatic Batch Select
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://learn.co/curriculum/tracks/25054
// @grant        none
// ==/UserScript==

(function() {
    const cohort = window.location.search.split('cohort=')[1]
    const loadTimer = setInterval(() => {
        let dropdown = document.querySelectorAll('select.batches')[0]
        if (dropdown) {
            console.log('found dropdown.')
            attachSelectListener(dropdown)
            selectCohort(dropdown)
            clearInterval(loadTimer)
        } else {
            console.log('waiting for dropdown to load...')
        }
    }, 100)

    function attachSelectListener(dropdown) {
        addEventListener('change', (ev) => {
            console.log('changed:', ev.target)
            const selectedCohortBatchNumber = ev.target.value

            // iterate through each <option> to find the one that's selected
            // with a matching value and grab it's name.
            for (let i = 0; i < dropdown.length; i++) {
                const option = dropdown.children[i]
                if (option.value === selectedCohortBatchNumber) {
                    isFound = true
                    let selectedCohortName = option.textContent;
                    window.history.pushState({}, '', '?cohort=' + selectedCohortName)
                }
            }
        })
    }

    function selectCohort(dropdown) {
        // was their a cohort in the dropdown that matches?
        let isFound = false
        for (let i = 0; i < dropdown.length; i++) {
            const option = dropdown.children[i]
            if (option.textContent === cohort) {
                isFound = true
                dropdown.value = option.value
                console.log('matched:', option)
            }
        }

        if (!isFound) {
          const firstCohortName = dropdown.children[0].textContent
          window.history.pushState({}, '', '?cohort=' + firstCohortName)
        }
    }
})();
