# How the certification practice apps are built

A guide to the pattern behind the MD-102 Practice Lab and the KQL Query Lab, so you can build the next one (SC-300, MS-102, SC-100 and so on) quickly.

## 1. What you get

Each app is **one self-contained HTML file**: no framework, no build tools needed to run it, no server, no network calls. It works by double-clicking the file, or published as a claude.ai Artifact.

- Questions are plain JavaScript data. The app code is separate from the content.
- Progress is stored in the browser (`localStorage`) and can be exported to a backup file and restored.
- The look follows the viewer's light or dark theme.

Files in this folder (`md-102/` on the website):

```
md-102/
  index.html                  the MD-102 Practice Lab, ready to serve (standalone build)
  kql-lab.html                the KQL Query Lab, a companion app for the MD-102 device query objective
  HOW-THESE-APPS-ARE-BUILT.md this guide
  source/                     app shell (app.html), question files, build script, checks, tests
  kql-source/                 KQL app shell, scenario data, test
```

For a new exam, add a sibling folder (for example `sc-300/`) with the same layout, so each app is its own page: `/md-102/`, `/sc-300/` and so on.

## 2. The build pipeline (MD-102)

```
h.js  q1.js … q15.js  labs.js  q16.js … q19.js  q21.js  q20.js   ──concatenate──►  all.js
app.html  (contains the text /*__DATA__*/)  +  all.js  ──replace placeholder──►  index.html
index.html  ──wrap in a full HTML page + download shim──►  standalone.html
```

`assemble.sh` does exactly this (cat, then a small Python replace). Run it from the source folder: `bash assemble.sh`. The result, `index.html`, is the build for publishing as a Claude Artifact (the Artifact tool adds the page wrapper). The last step also writes `standalone.html`, a complete page with doctype, viewport and a small shim, and that is the file to use on your own website (copy it to `md-102/index.html`).

**Order matters.** Question ids are positions in the final list, so append new question files after the existing ones and never reorder. One exception: `q20.js` removes every question whose topic starts with `Lab ` (quiz questions must come from Microsoft Learn, not the lab setup), so it stays last, and any new question file goes just before it (`q21.js` is before `q20.js`). Add the new file name to `assemble.sh`, `chk.js` and `dump.js`.

Why split it up: each `qN.js` file holds one domain or batch of questions, so you can edit content without touching the app code, and the app shell (`app.html`) stays readable.

## 3. Question data format

`h.js` starts the data file. It defines the Learn link table and the helpers:

```js
const ML = 'https://learn.microsoft.com/';
const L = { remediations: ML + 'intune/device-management/tools/deploy-remediations', ... };
const D1 = 1, D2 = 2, D3 = 3, D4 = 4, D5 = 5;   // exam domains
const Q = [];
function add(d, t, q, c, w, e, l) { Q.push({ id: Q.length + 1, d, t, q, c, w, e, l }); }
```

A question:

```js
add(D5, 'Endpoint analytics and Remediations',        // domain, topic (a drill group)
  "A detection script returns exit code 1. What does the Remediation package do?",
  ["It runs the remediation script, because 1 means the issue was detected"],   // correct answer(s)
  ["It marks the device compliant", "It skips the remediation script", "It retires the device"],  // wrong answers
  "Detection scripts return 0 for 'without issue' and 1 for 'with issue'. ...",  // explanation
  L.remediations);                                  // Learn link
```

- **Multi-select** is automatic: if the correct array has more than one item the app shows checkboxes and says how many to pick ("Select three").
- **Ordering questions** use `addo(domain, topic, question, steps, extra, notes, explanation, link)`. `steps` is the correct order, `extra` are distractor steps that do not belong, and `notes` flags steps whose order is interchangeable.
- **Ids** are the position in the array. Never reorder or delete a question once people have progress saved; replace it in place or append. Progress is keyed by id.
- `fix(id, correct, wrong)` and similar helpers patch a question after the fact. Prefer editing the question directly.

Write wrong answers that are plausible, from the same family as the right one, and similar in length. A correct answer that is always the longest option teaches test-taking, not the subject. `chk.js` flags those cases (many older questions still do).


### Override layers (restyling without changing ids)

`q15.js` rewrites question wording after the fact, so the older files stay untouched:

- `RW(id, oldStart, newStem)` replaces a question stem. `oldStart` is the first words of the old stem, and the build throws if they do not match, so a wrong id cannot slip through.
- `RM(id, oldStart, newStem, [correct], [wrong])` also replaces the answer options. Use it to turn a single-answer question into a "select two" one.
- Multi-select is automatic: if a question has more than one correct answer the app adds "Select N" itself, so do not type it into the stem.

The Microsoft exam style used here: a short Contoso-type scenario, then "You need to… What should you…?", and for multiple answers "Each correct answer presents part of the solution." Mix direct questions, short scenarios and select-N questions; not every item should be a case study.

### Targeted drills

`q21.js` is the "Exam notes drill": 64 questions written from a list of exam notes after checking every claim on Learn. Several claims were wrong or out of date and were corrected or dropped. Do the same for the next exam: verify first, then write.

`q16.js` holds the "Exam gaps" drills. When a practice exam shows a weak spot, write 10 to 15 questions on it under one topic name (the `t` field) and put them in one domain. The topic then appears in the Topic dropdown and in the Progress tab automatically. Check each fact on Learn first and put the URL in `l`.

## 4. App shell (`app.html`)

One file with `<title>`, `<style>`, markup and a script. Main parts:

- **Design tokens.** All colors are CSS variables on `:root`, redefined for dark mode with `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`, so both themes work.
- **Tabs with hash routing.** `Practice`, `Labs`, `Study plan`, `Progress`, set with `location.hash`.
- **Modes** are chosen in `start(mode, opt)`:
  - `diagnostic`: 60 questions picked evenly across every topic, answers shown at the end.
  - `mock`: 50 questions weighted by the exam's domain percentages, with a 100-minute timer.
  - `weak`: picks questions you got wrong or have not seen.
  - `weak14`: the two weakest domains (computed from your own scores).
  - `seq`: only ordering questions.
  - `missed`: replay everything last answered wrong.
  - `drill`: one domain or topic.
- **State.** `store = {attempts, q, plan, lab}` saved under one key (`md102.lab.v1`). `q[id]` holds seen/correct counts and the last result. Every read and write is wrapped in try/catch because storage can be blocked.
- **Weights.** The `DOM` table holds each domain's name and exam percentage. Change it per exam.
- **Study plan.** `WEEKS` is nine phase templates. The app takes the plan start date and the exam date and spreads the phases across the days in between. Ticks are stored by phase id so they survive a date change.
- **Labs.** `labs.js` holds checklists, "break it on purpose" lists, exam notes and small question sets for each lab. Delete it if the exam has no labs.
- **Backup.** The Progress tab exports the `store` as JSON and restores from a file. On claude.ai the file goes through the `downloads` capability: `const dl = await claude.use('downloads'); await dl.save({filename, data})`. Outside claude.ai it returns null, so the app hides the button and offers copy and paste instead.

## 5. The KQL app

Same idea, simpler: `data.js` builds an array `K` with `SC1(obj, cat, lvl, title, schema, task, a, e, w)`. Each scenario shows a table schema and a task, then you pick the correct query from several options. After you submit it explains why the right one works and why each wrong one fails. `schema` strings use the real table names and columns (IntuneDevices, InstalledApplication, SigninLogs and so on), which is what makes it feel like the exam.

## 6. Checking and testing

- `node chk.js`: loads all question files, prints the count per domain, and flags a correct answer that is the longest option or a question with no Learn link.
- Lint-style checks in the build: the shortening step at the end of `q8.js` throws if the text it expects is not found, so a rewrite cannot silently skip.
- `t5.js` tests save and resume of a quiz in progress, `t6.js` the step-count line on ordering questions, `t7.js` the standalone build and its download button.
- `t3.js`, `t4.js`, `test.js` use Playwright (Chromium) to load the page, click through a quiz, and report JavaScript errors and horizontal scrolling at phone width (390 px).
- Before publishing: run `assemble.sh`, run the checks, open the HTML once in a browser.

## 7. Recipe for a new exam app

1. **Get the official skills outline.** Copy the domains and percentages from the exam's Learn page. Note the "last updated" date and anything retired.
2. **Make the question files.** Aim for about 5 to 6 questions per outline bullet, covering every bullet. Add ordering questions for any multi-step setup (these are the hardest to memorize).
3. **Write each question from a Learn page.** Fetch the page, take the facts from it, and put the URL in `l`. Do not write facts from memory; check numbers, limits and defaults against Learn.
4. **Copy `app.html`.** Change the title, the `KEY` string (it must be unique per app so progress does not collide), the `DOM` table, the `WEEKS` plan wording and the cheat sheet.
5. **Assemble, check, test** (section 6).
6. **Publish** as an Artifact with the `downloads` capability (for the backup file), or just keep the HTML file.
7. **Re-check against Learn** every few weeks. Exams update their outlines.

## 8. Using Claude to build the next one

Give Claude the exam page URL and ask it to follow this guide. A prompt that works well:

> Build a practice app for SC-300 using the pattern in HOW-THESE-APPS-ARE-BUILT.md. Pull the skills outline from Learn, write questions from the Learn pages (with links), include setup-sequence questions, a 60-question baseline, a weighted mock, a study plan tied to the exam date, and a backup download. Keep it generic so anyone can use it.

Hand Claude the `md-102/source/` folder so it can copy `app.html`, `h.js` and `assemble.sh` as the starting point.

## 9. Saved progress and resume

The app keeps everything in one `store` object under a localStorage key (`md102.lab.v1`): attempts, per-question stats, the plan, lab ticks, the last exam, and `store.run`, the quiz in progress (question ids, option order, picks, position, time left). `persistRun()` saves it on every answer, every 15 seconds on the timer, and when the tab is hidden or closed. The home screen shows a Resume card while `store.run` exists, and `finish()` deletes it. If you add a new mode, save its state the same way or it will be lost on reload.

## 10. Putting the apps on your website

1. Copy the folder (`md-102/`) into the site. `index.html` is a single file with no dependencies, so it works from any static host or a plain `<a href="/md-102/">` link.
2. The page loads one Google Fonts stylesheet if you kept the font link; the app falls back to system fonts if it is blocked.
3. Progress lives in the visitor's browser for that exact address. Moving the app to a new URL starts everyone from zero, so decide the final path before sharing it. The Progress tab has a backup file (works on your own site because of the shim) and a restore.
4. To rebuild after changing questions: `cd md-102/source && bash assemble.sh && node chk.js`, then copy `standalone.html` over `../index.html`.

## 11. Gotchas learned

- Claude artifact pages cannot start downloads themselves; use the `downloads` capability or copy/paste. The standalone build adds a shim that does a normal browser download.
- Republishing an Artifact reloads any open copy, so an unfinished quiz relies on the saved-progress feature to survive.
- localStorage is per browser and per URL. Changing the artifact's URL, or moving the HTML to a different folder as a file, starts progress from zero. Use the backup file to move it.
- Question ids must stay stable once published (see section 3).
- No external libraries are needed; everything is inline. Only cdnjs, jsDelivr, unpkg and Google Fonts are allowed by the artifact sandbox if you ever need one.
- Keep content free of personal data and of any vendor's practice-exam wording. Write your own questions from Learn.
