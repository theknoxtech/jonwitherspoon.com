Untrusted content: none (repo files and test output read as data only).

# backend-dev-4: Portfolio button colour, remove "Previous site" link

## Source changes
- `src/pages/index.astro` line 38: Portfolio link class `button button-secondary` -> `button button-primary`.
- `src/layouts/Base.astro`: deleted the `<p class="footer-meta">` line with the siliconscripted.com "Previous site" link. The two other `footer-meta mono` paragraphs remain and use the same class, so no CSS change was needed (`site.css` untouched; there is no `.footer-meta` rule in it).

## Test edits (tests/site.test.mjs), before -> after
1. Line 208 (hero row): `<a class="button button-secondary" href="/portfolio/">Portfolio</a>` -> `<a class="button button-primary" ...>`.
2. Line 341 (footer title): "...build stamp, old-site link; no Topics column" -> "...build stamp, no old-site link; no Topics column".
3. Line 353: `assert.match(footer, /href="https:\/\/siliconscripted\.com"/)` -> `assert.doesNotMatch(footer, /siliconscripted\.com|Previous site/)`.
4. Line 467 title: "footer has build stamp and old-site link; skip link and nav exist" -> "...build stamp and no old-site link; ...".
5. Line 470: `assert.match(html, /href="https:\/\/siliconscripted\.com"/)` -> `assert.doesNotMatch(html, /siliconscripted\.com|Previous site/)`. Build-stamp assertions kept.

## TDD
Red (tests edited, source not yet changed): the 3 expected tests failed (hero, both footer tests).
Green after source change: all pass.

## Docs check
Searched docs/ (excluding docs/security). setup-guide.md and editing-guide.md do not mention the old-site footer link. Statements that do, not edited (plan/pipeline files):
- `docs/pipeline/2026-11-15-personal-site/council/round-1-ux-specialist.md:45` (recommended a small footer link to the old site)
- `docs/pipeline/2026-11-15-personal-site/build/frontend-dev-1.md:7` (Base.astro footer description)
- `docs/pipeline/2026-11-15-personal-site/build/frontend-dev-4.md:7` (footer row description, mentions links)
Also check `docs/plans/proposed/2026-11-15-personal-site.md` (mentions old-site content only, not clearly the footer link).

## Flaky tests (not caused by this change)
During repeated runs, one of the "QC edge" tests (throwaway-build tests: empty links list, lab folder with no index.html, throwaway builds left real dist untouched) failed intermittently, a different one each time, and some runs passed 142/142. Likely the throwaway builds colliding with another build or an overlapping test run (I had an overlapping run at times). I did not edit them. Worth a look.

## Final run
`ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`: build complete (6 pages); tests 142, pass 142, fail 0. exam_apps/ untouched by me (git status shows only Jon's existing edits there).
