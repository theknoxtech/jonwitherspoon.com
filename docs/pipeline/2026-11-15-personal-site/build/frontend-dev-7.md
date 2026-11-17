Untrusted content: none

# frontend-dev-7: per-tag colours

## Built
- New shared module `src/lib/tags.js`: `TAG_COLOR_NAMES` (ten), `AUTOMATIC_TAG_COLORS` (original four), `tagColorPicker(tagColors)`. It validates the map (bad value throws, naming the tag, the colour and the ten valid names) and returns a lookup: exact, case-sensitive, own-keys only (so "constructor" is not matched), otherwise the old letter-sum arithmetic over the original four.
- `chipTint` removed from `articles.js` and from the Home and Projects pages. All use `tagColorPicker(site.tagColors)`: Home (project and article cards), /projects/ (cards and filter chips), /articles/ (cards and filter chips), article page.
- `site.json`: `"tagColors": {}`. `site.css`: six new colours (light and dark variables plus `.chip-<name>` classes). No inline style or script.
- `docs/editing-guide.md`: new "Change the colour of a tag" section; "Change tags" now points to it.

## Files changed
docs/editing-guide.md, src/data/site.json, src/lib/articles.js, src/lib/tags.js (new), src/pages/index.astro, src/pages/projects.astro, src/pages/articles/index.astro, src/pages/articles/[slug].astro, src/styles/site.css, tests/site.test.mjs, tests/blog.test.mjs, tests/tags.test.mjs (new), tests/fixtures/astro.fixture.config.mjs.

## Test edits (existing tests)
- tests/site.test.mjs contrast test: the four listed chip pairs (`['chip-blue-text','chip-blue-fill'], ... rose`) became `...['blue','teal','amber','rose','green','purple','orange','pink','sky','slate'].map((name) => [`chip-${name}-text`, `chip-${name}-fill`])`. Extension, not a breakage fix.
- tests/blog.test.mjs: `buildFixture(name)` became `buildFixture(name, tagColorsJson)` (optional second argument sets env TAG_COLORS_JSON); two new tests appended; one import added.
- tests/fixtures/astro.fixture.config.mjs: added a Vite plugin that, only when TAG_COLORS_JSON is set, swaps tagColors in the in-memory site.json (file on disk never changed). Not a "breakage", needed to test the failing build.
- No other existing test was edited.

## Colours (text on fill, contrast light / dark; all pass 4.5:1)
Light fill/text, dark fill/text:
- green #d1fae5/#065f46, #0d3b2c/#a7f3d0: 6.78 / 9.75
- purple #f3e8ff/#6b21a8, #3b1d5e/#e9d5ff: 7.39 / 10.13
- orange #fed7aa/#7c2d12, #4d2208/#fed7aa: 6.92 / 10.02
- pink #fbcfe8/#831843, #6b1d4a/#fbcfe8: 6.98 / 8.00
- sky #e0f2fe/#075985, #0c3a5a/#bae6fd: 6.59 / 8.95
- slate #e2e8f0/#1e293b, #2b3345/#e2e8f0: 11.87 / 10.25
- Existing four unchanged (blue 8.06/9.09, teal 6.49/9.77, amber 6.37/10.47, rose 6.68/9.83).
Distinctness was judged by hue only, not rendered. Pink (stronger fill) and rose, and sky and teal, are the closest pairs: worth a look in a browser.

## Counts
Suite: 151 tests (7 new in tags.test.mjs, 2 new in blog.test.mjs). Final runs of `ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`: 3 of 3 pass (151/151). Earlier in the session, one run had a single failure, "QC edge site.json: lab without updated (null) still builds"; it passed alone and in the next 4 full runs. Likely load flake from test files running in parallel; not explained by this change, flagging it.

## Decisions and problems
- BLOCKED / needs your call: `src/pages/portfolio.astro` has its own copy of `chipTint` (project tags at line 133, plus skills, technologies and education chips). It is not in my file list, so I did not touch it. Until it uses `tagColorPicker`, a colour set in tagColors will not show on /portfolio/ project tags. A two-line fix per use; please assign it.
- The two build tests were put in blog.test.mjs rather than tags.test.mjs: separate files run in parallel under `node --test`, and overlapping builds made the normal-fixture tests fail.
- Red steps seen: tags.test.mjs failed (no module) and the extended contrast test failed (variables missing) before the code existed.
- Pinned colours for 13 existing tags (C#, WMI, OneDrive, Bash, etc.) are asserted in tags.test.mjs.
- docs/security/* untouched; nothing written to dist/ except by the normal build; no git commands run beyond status/diff.

## Follow-up: portfolio page
- `src/pages/portfolio.astro` now uses `tagColorPicker(site.tagColors)`; its own `chipTint` copy is removed. Project tags, skills, technologies and education chips all use the one picker, so a listed tag has one colour everywhere. No `chipTint` is left in src/ or tests/. Automatic colours for unlisted tags are unchanged (same arithmetic; pinned-colour tests cover it).
- Test first: I added `portfolio/index.html` to the file list of the existing build test in tests/blog.test.mjs ("a build with a chosen tag colour paints that tag the same on every page"). It failed (PowerShell stayed teal on /portfolio/) before the change and passes after. This is a new assertion, not an edit that changes an existing one; no existing test broke.
- Counts: still 151 tests. Final `ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`: 3 of 3 clean (151/151). One earlier run had a single failure ("a draft appears in no page, no search entry and no folder"), then 5 clean runs in a row. Together with the earlier QC edge failure, this looks like a parallel-load flake across test files that run builds at once. I did not capture the cause; the next run was green each time.
