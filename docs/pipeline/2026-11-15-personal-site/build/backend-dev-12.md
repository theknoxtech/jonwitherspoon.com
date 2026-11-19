Untrusted content: none

# Backend dev 12: current job placeholders removed

## Change
`src/data/site.json`, experience[0] (Critical Network Solutions): `start` is now `"2026-06"`; `technologies` is now exactly the 13-item list given. Nothing else touched. JSON valid. `grep -rn "TO SUPPLY" src public` leaves only two code lines, which are the guard logic and not content: `src/pages/labs.astro:50` and `src/pages/portfolio.astro:17`.

## Test edits (before -> after)
1. `tests/site.test.mjs`, "portfolio page lists the current role first, with a visible placeholder":
   - Before: the last line asserted `class="placeholder"...[TO SUPPLY:`.
   - After: renamed "...with its real start, location, bullets and technologies". It asserts that the current role's block contains `Jun 2026`, `Remote`, the 3 bullets and all 13 technologies, and that the page has no `TO SUPPLY`. The order checks are unchanged.
2. `tests/site.test.mjs`, NEW: "no built page contains "[TO SUPPLY" (production deploys with FAIL_ON_PLACEHOLDER=1)". It walks every `.html` file in `dist/`.
3. `tests/qc-build-edge.test.mjs`, three guard tests: "warns and exits 0 by default", "FAIL_ON_PLACEHOLDER=1 fails the build...", and "FAIL_ON_PLACEHOLDER=0 only warns".
   - Before: they relied on the real placeholder.
   - After: each passes `siteChange: site.experience[0].start = '[TO SUPPLY: start month, YYYY-MM]'` to the throwaway copy. Assertions are unchanged, so they still name `portfolio/index.html`.
4. `tests/qc-build-edge.test.mjs`, NEW: "an injected placeholder renders in the .placeholder class span with no inline style". It uses the same injection and covers the line removed from qc-static.
5. `tests/qc-static.test.mjs`, "placeholders use the CSS class, never an inline style":
   - Before: it also asserted `<span class="placeholder">[TO SUPPLY` in the real dist.
   - After: that one line is removed because it needs a real placeholder. The inline-style loop and the CSS `.placeholder` dashed check stay. The removed check is covered by new test 4.
- Unchanged and still passing:
  - "with every placeholder filled in..." now checks the real data directly, which is the production condition.
  - The "new placeholder" (projects title) test.
  - The `qc-static` CI workflow grep check.
  - `qc-final`'s guide-job and article placeholder tests.
  - `infra.test.mjs` had nothing to change.

## Results
- Red first: with only the JSON change, 5 tests failed (the 3 guard tests, the qc-static CSS test, the site.test.mjs current-role test).
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: exit 0, no warning, no "SUPPLY".
- `npm test`: 227 tests, 226 pass, 0 fail, 0 cancelled, 1 todo (a pre-existing expected-failure diagnostic that prints a stack trace and is not a failure).
- `FAIL_ON_PLACEHOLDER=1 ASTRO_TELEMETRY_DISABLED=1 npm run build`: exit 0, no warning (the production condition holds).
- The normal build was re-run last, so `dist/` is current.
- Files changed: `src/data/site.json`, `tests/site.test.mjs`, `tests/qc-build-edge.test.mjs`, `tests/qc-static.test.mjs`. Nothing under `docs/security/` or `exam_apps/` was touched.
