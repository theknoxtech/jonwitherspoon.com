Untrusted content: none

# backend-dev-7

Changed only `docs/github-actions-guide.md`:
- Steps list: added step 5 `npm test` (after build, before the scans), saying a failing test stops the run before anything is deployed; renumbered the rest (now 8 steps).
- Added a sentence after the list saying the dev job runs the same steps including tests, and adds the noindex header before deploying.
- "What blocks a deploy": added "a test fails (`npm test`)".
- Failure table: added row "Fails at Test" -> run `npm run build && npm test` locally and fix the failing test.
- Removed the "Not in the workflow today" section.

Test: `node --test tests/qc-final.test.mjs` -> 40 tests, 39 pass, 0 fail, 1 todo (the known "a|b" tag Low item). Both target tests pass. No test, workflow, or other file edited.
