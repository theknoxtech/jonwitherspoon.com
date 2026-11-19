Untrusted content: none

# backend-dev-9

Changes:
- tests/qc-static.test.mjs: both `docs/plans/in-progress/2026-11-15-personal-site.md` paths (lines 548, 693) now point to `docs/plans/done-with-open-items/2026-11-15-personal-site.md`. No other test touched.
- Line 1 Status replaced in the three done-with-open-items plans and the done theme-toggle plan, with the wording given. Open items line added under Status in the three done-with-open-items plans (relative links). None in theme-toggle. Status lines in the three plans end with two spaces so the Open items line renders on its own line.
- Main plan: the two plan mentions (lines 13, 36) now use `docs/plans/done/2026-11-17-theme-toggle.md` and `docs/plans/done-with-open-items/2026-11-16-blog.md`. A grep for `plans/in-progress` and `plans/proposed` in docs/plans/done and docs/plans/done-with-open-items finds nothing left.
- No run records, state.md, or other files edited. Plan moves left staged.

Test: `node --test tests/qc-static.test.mjs` -> 43 pass, 0 fail. I ran only this file, as instructed, not the full suite.
