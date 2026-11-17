Untrusted content: none

# backend-dev-5: theme button, changing label, no aria-pressed

## What changed
- public/theme.js: sets `data-theme-state` ("light"/"dark" = theme shown) instead of `aria-pressed`, on load and every click. Label text logic untouched. Header comment updated.
- src/layouts/Base.astro: theme button markup `aria-pressed="false"` -> `data-theme-state="light"`.
- src/styles/site.css (icon rules only): `[aria-pressed="true"] .theme-icon-moon` / `[aria-pressed="false"] .theme-icon-sun` now `[data-theme-state="dark"]` / `[data-theme-state="light"]`. Same icons show in each state. Tag-chip aria-pressed uses left alone.
- Plan docs/plans/in-progress/2026-11-17-theme-toggle.md lines 49, 51, 64 reworded. docs/editing-guide.md has no aria-pressed text; unchanged.

## Tests (tests/theme.test.mjs; tests/site.test.mjs line 191 is tag chips, unchanged)
Red first: the new CSS test failed before the source change.
- Fake button start: `new Map([['aria-pressed','false']])` -> `new Map()`.
- Loading test: `aria-pressed == 'true'` -> label 'Light mode', `data-theme-state == 'dark'`, `aria-pressed == null`.
- Click test (renamed "...label and data-theme-state, never aria-pressed"): each `aria-pressed` 'false'/'true' assertion -> `data-theme-state` 'light'/'dark' plus `aria-pressed == null`; label assertions kept.
- Dark-device test: `aria-pressed 'true'` -> `data-theme-state 'dark'`, `aria-pressed null`; after first click also label 'Dark mode', state 'light'.
- Built-header test: markup regex `aria-pressed="false"` -> `data-theme-state="light"`, added assert that the button has no aria-pressed; title updated.
- New: "CSS: the theme icons swap on data-theme-state, not aria-pressed".

## Results
`ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test` x3 (one at a time): 167 tests; run 1 167 pass, run 2 166 pass / 1 fail, run 3 167 pass (plus an earlier green run).
Flaky: "QC edge: build with an EMPTY exam_apps folder succeeds" failed once, passed on re-run (not related to this change).

## Note
git status also shows exam_apps/md-102/HOW-THESE-APPS-ARE-BUILT.md deleted and exam_apps/HOW-THESE-APPS-ARE-BUILT.md untracked. I did not do this (the tree was clean at start); possibly another agent or the empty-exam_apps test. Please check.
