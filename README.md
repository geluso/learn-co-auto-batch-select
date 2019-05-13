# Learn Curriculum Automatic Batch Select

[Watch Example Video](./example.mp4)

Append `?cohort=seattle-web-career-012819`
to <learn.co/curriculum/tracks/25055> URL
to have the page automatically select your
proper cohort!

The URL is updated when you change `<select>`
Save the URL as a bookmark to auto-load!


## Requirements:
* install tampermonkey chrome extension
* configure tampermonkey script

## TODO
* integrate with <learn.co> proper!

## Installation
1. Install [tampermonkey from the Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo//Open)
2. Navigate to <https://learn.co/curriculum> and choose the track you're interested
3. Click the Tampermonkey icon and choose "Create a new script..."
4. Edit line 7 to replace the specific track number from the `@match`
   definition with an asterisk so it matches any track.
5. Paste the code from [main.js](./main.js) in the script editor.
6. Choose File > Save
7. Navigate to a track in Learn.
8. Verify the URL is updated with a `?cohort=` query parameter once the dropdown menu loads.
9. Verify the URL is updated when you choose another cohort from the dropdown menu.
10. Save a bookmark with your preferred cohort in the URL.
11. Verify the dropdown automatically selects your preferred cohort when you visit your saved bookmark.

```
// @match        https://learn.co/curriculum/tracks/*
```

**main.js**
```js
// ==UserScript==
// @name         Learn Deploy Automatic Batch Select
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://learn.co/curriculum/tracks/*
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
```

