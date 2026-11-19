Untrusted content: none

# frontend-dev-8: light/dark theme toggle

## What I built
- `public/theme.js`: IIFE, loaded in head without defer. Reads `localStorage["theme"]` in try/catch, accepts only exact "light"/"dark", sets `data-theme` on `<html>`. Wires `[data-theme-toggle]` (immediately, or on DOMContentLoaded while parsing), flips and saves the choice, updates `[data-theme-label]` ("Dark mode"/"Light mode") and `aria-pressed`, adds `has-theme-toggle` to `<html>`. With no saved choice the initial button state follows `matchMedia` (device).
- `Base.astro`: `<script is:inline src="/theme.js">` before search.js; header `<li class="nav-theme">` with a real `<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">`, moon and sun icons (aria-hidden), visible text label, placed just before Search.
- `icons.js`: `sun`, `moon`.
- `site.css`: order is `:root` (light), `:root[data-theme="light"]` (restores every variable dark changes, `color-scheme: light`), `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...} }`, `:root[data-theme="dark"]` (identical declarations, `color-scheme: dark`). Button styles (hidden until `.has-theme-toggle`, icon swap by `aria-pressed`, 44px on coarse pointers). There were no other dark-mode rules (no other media query, no images; the dialog backdrop is a fixed rgba that works in both themes).
- `docs/editing-guide.md`: "Light and dark mode" section.
- `tests/theme.test.mjs` (new, 15 tests): script behaviour in a vm with fake document/localStorage (saved dark, saved light, junk, none, throwing storage, wiring, loading state, flip and save, dark-device start); built-page tests (theme.js in head, no defer/async/module, before search.js; button markup, label, aria-pressed, icons, hidden-until-JS CSS; no eval/innerHTML/fetch/cookie in theme.js); CSS tests (device dark block == manual dark block, light block restores root values and matches dark's key set, only one prefers-color-scheme rule).

## Files changed
public/theme.js (new), src/layouts/Base.astro, src/data/icons.js, src/styles/site.css, tests/theme.test.mjs (new), docs/editing-guide.md, plus existing tests edited below.

## Existing test edits (each broken by this change)
1. tests/site.test.mjs "no inline script..." : regex `(search|tabs)\.js` -> `(search|tabs|theme)\.js`, message updated.
2. tests/site.test.mjs "every page loads /search.js (deferred)..." : renamed to "...and /theme.js (not deferred)...", added assert for non-deferred theme.js, and `existsSync(theme.js)` added to the final assert.
3. tests/blog.test.mjs `assertStrictCspClean`: `(search|tabs)` -> `(search|tabs|theme)`.
4. tests/qc-static.test.mjs JS-free markup test: strip regex and expected emitted-file list now include theme (`['search.js','tabs.js','theme.js']`).
5. tests/qc-static.test.mjs "only expected file types": `^(search|tabs)\.js$` -> `^(search|tabs|theme)\.js$`.
6. tests/qc-static.test.mjs "light and dark palettes ... (no toggle)": title changed; media regex now expects `:root:not([data-theme="light"])`; `data-theme` removed from the forbidden `doesNotMatch` (kept `.dark`/`.light`).
7. tests/infra.test.mjs line 152: allowed js list adds `theme\.js$`.
The two contrast tests were not edited: the light block sits before the media block and the manual dark block after it, so their existing slices already parse and check both manual blocks (merged over :root). The identical-blocks test guarantees they equal the device values.

## Counts
Full suite: 166 tests (15 new in theme.test.mjs), all pass. Final runs of `ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`: three consecutive full passes (166/166) at the end. Earlier, a first set of three runs had one flaky failure.

## Flaky failure
`QC edge site.json: lab without updated (null) still builds` failed once in the first 3-run loop (build 2). It passed in all other runs and 3 standalone runs of tests/qc-build-edge.test.mjs. Likely timing in that test's own temp build; not explained by this change, cause not investigated.

## Decisions / notes
- The button label says what a click does and also carries aria-pressed (as the plan specifies); aria-pressed="true" means dark is on. Some screen-reader guidance discourages changing the label and the pressed state together; Jon may want to pick one later.
- No reaction to live device-theme changes when no choice is saved (not in plan).
- `console.warn` in the save catch; the test supplies a stub console.
- A mistaken Write to a wrong path early on was denied by the permission system; nothing was created there.
- No git changes made, nothing in docs/security or exam_apps touched.
