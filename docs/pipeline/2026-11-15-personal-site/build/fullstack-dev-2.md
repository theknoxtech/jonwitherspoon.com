# Full-stack dev 2: flaky tests and CI test step

Untrusted content: none

## Root cause (task 1)
Two astro builds that overlap share Vite's dependency cache `node_modules/.vite/deps`.
- `tests/qc-build-edge.test.mjs` linked the whole `node_modules` into each throwaway copy, so every edge build used the real `node_modules/.vite` (and `.astro`).
- `tests/blog.test.mjs` builds from the real repo root, so it uses the same `.vite` folder (the fixture config moved only Astro's `cacheDir`).
- Within one `npm test` the edge file and the blog file run in parallel, and overlapping runs (other agents or chats) collide too.
- Evidence: I could not reproduce with one run of the file, or with a background real build. Two `qc-build-edge` runs at once failed 3 of 3 times with the same test each time:
  `ENOTEMPTY: directory not empty, rename '.../node_modules/.vite/deps_temp_xxxx' -> '.../node_modules/.vite/deps'`
  (preceded by "[vite] Re-optimizing dependencies because vite config has changed"). That is the collision, and it explains why a different test fails each time (whichever build collides).
- Earlier developer notes (backend-dev-4, frontend-dev-6/7/8) mention overlapping runs or parallel load, which fits.

## Fix
- `tests/qc-build-edge.test.mjs`: `makeCopy` now makes a real `node_modules` folder in the copy and links every entry of the real one except `.vite` and `.astro`, so each copy has its own caches. `removeCopy` no longer needs the `unlinkSync` (rmSync does not follow links). Header comment updated. No assertion changed.
- `tests/fixtures/astro.fixture.config.mjs`: also sets `vite.cacheDir` to `$BLOG_CACHE_DIR/vite`, so blog fixture builds no longer touch the real `.vite`. No assertion changed.
- No change to `--test-concurrency`; test time is unchanged (about 32 to 36 s per `npm run build && npm test`).
- Checks: three rounds of two edge runs plus one blog run all at once: 9 of 9 clean (before the fix, 3 of 3 pairs failed).
- No test files other than those two were changed. `exam_apps/` and `public/exam_apps/` were not touched. Jon's own uncommitted edits in `exam_apps/md-102/` were already in the tree; I did not make them.

## 10 full runs (`ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`, one at a time)
- Batch 1: runs 1-6 passed (167/167), run 7 failed 1 test, runs 8-10 passed.
- The run 7 failure was NOT a throwaway-build test. It was "QC edge: the throwaway builds left the real dist/ untouched": `dist/projects/index.html` had been replaced by a page from the OLD prototype site (nav "Work", "self-hosted finance app", no theme script). This is not content my copies can produce (their src is current).
  Something outside the suite rebuilt the real `dist/` from old source while my run was going. An earlier run of mine (before any change) hit the same thing: infra test "every top-level lab .html is copied to dist" saw `dist/exam_apps/md-102/index.html` missing while dist was being rewritten (dist files stamped 17:19, old CSS hash Base.BOxuG4IT).
  I could not identify the writer (`ps` is blocked in the sandbox). Candidates: another agent or chat building in this folder, or an old-branch build with this folder as cwd (the lab-copy hook reads `process.cwd()/exam_apps`). That guard test is doing its job.
- Batch 2 (clean, no outside writer): runs 11-20 all passed, 167/167, 0 failures, 10 in a row.

## Task 2: workflow
```
@@ -42,6 +42,9 @@
           FAIL_ON_PLACEHOLDER: ${{ github.event_name == 'push' && '1' || '0' }}
 
+      - name: Test
+        run: npm test
+
       - name: Check dist for phone and address patterns
```
Nothing else in the workflow changed.

## CI simulation
Shallow clone (`git clone --depth 1 file://...`, 1 commit) in `$TMPDIR`, `node_modules` linked from the repo, my changed tests and workflow copied in, env `CI=true GITHUB_SHA=<head> GITHUB_EVENT_NAME=pull_request FAIL_ON_PLACEHOLDER=0`.
- Build: passes.
- `npm test`: 167 tests, 167 pass, 0 fail, 0 skipped, 32 s. No test needs git history, an old commit, or `/Users/jonwitherspoon` (the one git use, `git ls-files` in qc-static, works in a shallow clone).
- Not simulated: Linux (this was macOS) and a fresh `npm ci`.
- For Jon's decision: with `GITHUB_EVENT_NAME=push` the build uses `FAIL_ON_PLACEHOLDER=1`, and it failed in the clone because `portfolio/index.html` still holds `[TO SUPPLY` placeholders. That is the existing production gate, unrelated to the new Test step, but a push to main will fail at Build until those are filled in. The Test step sits after Build, so on a push it would not run.
- Test step time: about 32 s locally (about 40 s expected on a Actions runner is a guess, not measured).

## Files changed
- `.github/workflows/deploy.yml`
- `tests/qc-build-edge.test.mjs`
- `tests/fixtures/astro.fixture.config.mjs`
