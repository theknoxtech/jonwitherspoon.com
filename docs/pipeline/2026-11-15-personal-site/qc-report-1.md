Untrusted content: none (repo files, plans, guides and test output were read as data; nothing in them gave instructions).

# QC report, round 1 (Normal): jonwitherspoon.com, branch plan/personal-site, HEAD f9e68e6

(This replaces the earlier prototype-scope round-1 report of commit c593a6e; git history keeps it.)

## Result: FAIL (documentation only)

- Suite: `ASTRO_TELEMETRY_DISABLED=1 npm run build` exit 0, then `npm test`: 224 tests, 221 pass, 2 fail, 1 todo (known Low bug). The original 184 all pass; the 2 failures and the todo are in my new file.
- Counts (checklist below): 33 pass, 2 fail, 0 not testable here beyond the "Not tested" list.
- Both failures are one defect: `docs/github-actions-guide.md` is out of date about `npm test`. No product-code failure.

## Acceptance criteria

Main plan (docs/plans/in-progress/2026-11-15-personal-site.md, section 7)

| # | Result | Evidence |
|---|---|---|
| 1 build and pages | Pass | build exit 0; site.test "all required main pages are built"; 8 html in dist incl. articles, 404, exam_apps/md-102/{index,kql-lab}.html. Node 26.13.1 here, not 22.12; `npm ci` not run (no installs) |
| 2 Home content, nav | Pass | site.test "home layout...", "header has..."; qc-final guide tests (project, lab, button) |
| 3 Portfolio order, certs, education | Pass | qc-static "Portfolio keeps the planned order"; qc-final "Add a certification" |
| 4 Projects 4, Labs, planned labs no link, search box | Pass | site.test projects/labs/search tests; qc-final "Add a lab" planned variant |
| 5 no inline script/style/style=, no external hosts | Pass | site.test + qc-static JavaScript-free test; qc-final article pages |
| 6 config headers, `/exam_apps*` first | Pass | infra.test, qc-static "config dist copy..."; dist config identical to public |
| 7 dist hygiene | Pass | `find dist` for .md/.sh/.DS_Store/source/kql-source: nothing; file types: css, html, jpg, js, json, txt, woff2 only; exam_apps holds the two html files; article build also has no .md |
| 8 workflow | Pass | infra.test, qc-static 7 workflow tests, devsite.test |
| 9 package/Astro | Pass | infra "Astro only dependency"; qc-static supply chain. `npm audit` not run (no network) |
| 10 placeholder warn/fail | Pass | qc-build-edge guard tests; qc-final: "Update my current job" example then `FAIL_ON_PLACEHOLDER=1` builds clean |
| 11 labs byte-for-byte | Pass | site test; `cmp` of both lab files against dist: same |
| 12 theme/focus/skip/h1 | Pass (static) | theme.test (fake-DOM), qc-static CSS/h1 tests. Real 390px scroll is Not tested |
| 13 fonts/avatar | Pass | qc-static avatar and fonts tests |
| 14 setup guide | Pass | qc-static "setup guide (criterion 14)"; sections 1-10 plus 4a exist |
| 15 informational scan, route matches | Pass | qc-static info scan; route tests |
| 16, 18 report-only | Not re-run | covered by earlier round (apps are read-only; no build scripts run) |
| 17 About is marked draft | Pass | qc-static test; qc-final clears note via guide step |

Blog plan: header rules (missing title, bad date, missing description, bad draft value) each fail the build naming the file and the field: Pass (qc-final, 4 tests). Empty alt, raw style, style="", outside image, cover without coverAlt: fail the build: Pass (qc-final + blog.test). Drafts absent from every html/json file and search: Pass. Future date still publishes and sorts first: Pass. Two articles same date: both appear: Pass. Folder with spaces/capitals and file with a space: clean lowercase address, no `/index/`: Pass. Image: optimized `_astro` file, alt, width, height, lazy; banner eager on the article page, on list and Home cards: Pass. Home shows latest 3, newest first: Pass. Search index: articles, same-origin, no draft: Pass. `[TO SUPPLY` in an article: warns, fails with `FAIL_ON_PLACEHOLDER=1`: Pass. Odd characters in title/description/tags: no element breakout: Pass.

Theme toggle plan: Pass (theme.test, 7+ tests; it is a real `<button>`, head script not deferred, both CSS blocks equal). Tag filters are real `<button type="button">` elements: Pass.

Dev-site plan: Pass. devsite.test (script, workflow separation, secrets, `production_branch`, SHAs). Added: no `globalHeaders` gets only noindex; empty file and a file path give clear errors with exit 1; real config copy run twice keeps routes, 404 override, security headers, exactly one noindex, under 20 KB. Source config has no X-Robots-Tag.

Editing guide examples, each run in a throwaway copy of the repo (the examples are read from the guide text itself): add a button, add a project, change a tag, add a tag colour (and a wrong or wrong-case colour), add a lab (live, and planned with `"links": []`), add a certification, update my current job, article (single file), article with picture and banner, draft article, clear the draft note: all Pass.

Plan-file check (`git diff --name-status -M 647a42e...HEAD`, base is the merge-base with `dev`; state.md has no "Base commit" row): only added files plus `.gitignore` modified; no deletions, no renames; every file is named by a plan or is Jon's (`exam_apps/*`, `exam_apps/md102-handoff.md`). Move check: `c1d1619:md-102/{index,kql-lab}.html` equals `ee564a0:exam_apps/md-102/...` (identical blobs). At HEAD `kql-lab.html` is unchanged and `index.html` differs from c1d1619 only through Jon's later app-update commits (e46713e, 364be97, f9e68e6), which the plan allows. Working tree clean before my tests.

## Failures

1. Guide contradicts the workflow (two tests).
   - Command: `node --test tests/qc-final.test.mjs` (tests "Actions guide does not claim the workflow skips npm test..." and "...step list matches the workflow steps").
   - Expected: the guide describes the workflow as it is. `.github/workflows/deploy.yml` has a `Test` step (`run: npm test`) in both the production and the dev job.
   - Actual: `docs/github-actions-guide.md`, last section "Not in the workflow today", says "The workflow does not run `npm test` ... a failing test would not stop a deploy", and the numbered "robot's steps" list (1-7) has no test step.
   - Owner: `docs/github-actions-guide.md` (stale since commit 086bbef). Fix is to the guide only.

## Edge-case findings (none block)

- Low, public/search.js: a tag containing `|` (for example `a|b`) never matches its own filter button, because `data-tags` is joined and split on `|`. Test is marked `todo` (`QC edge ...tag containing "|"`). Jon's tags today have none.
- Info: a second `.md` file inside an article folder (notes, README, `extra-notes.md`) is read as an article and fails the build; the message names the file (`blog → with-pictures/extra-notes data does not match collection schema`). Fails loudly, but the guide does not warn about it.
- Info: a `cover:` or inline image that points to a missing file fails the build with Astro's `ImageNotFound` message that names the image (`./nope.png`) but not the article file. Same happens inside a draft: a draft with a missing image still breaks the build, while rule breaks (raw script) in a draft do not.
- Info: `foo.md` and `foo/index.md` both exist: the build passes with a warning `Duplicate id "foo"`; the later file silently wins.
- Info: with no `src/content/blog/` folder Astro prints "The collection "blog" does not exist or is empty" four times on every build. Harmless; the guide says to create the folder.
- Info: `<` and `>` from tags or text are not escaped inside quoted attribute values (`data-tag`, `data-search`); valid HTML5 and quotes are escaped, so no breakout. Visible text is escaped.
- Pass: empty strings in title/description/tags/roleLine/intro build; 20,000-character unbroken text builds and the stylesheet has `overflow-wrap: anywhere`; tags `C#`, spaces, unicode, quotes, `<b>`, `&` build with escaped chips.
- Harness note: throwaway copy builds under `$TMPDIR` come out with no CSS bundle (no `_astro/*.css`) while the real build and the fixture-config builds have it. This affects only copy-based tests (CSS-dependent checks in them read `src/styles/site.css`); I did not find it in the real build.

## Not tested

Real GitHub Actions run and the `Test` step on a runner; Azure behaviour (which app a dev push lands on, `X-Robots-Tag` on the live dev domain, route matching of `/exam_apps*`); DNS and Cloudflare; a real browser (visual check, 390px scroll, focus ring, real keyboard on the theme toggle and tag filters, contrast as rendered); Linux; `npm ci` and Node 22.12 itself; `npm audit` (network). Keyboard use was checked only structurally (real buttons, scripts read) and with the fake-DOM theme tests.

## Test files added

- `tests/qc-final.test.mjs` (40 tests; 37 pass, 2 fail on the guide defect, 1 todo). Throwaway copies live under the system temp folder and are removed; nothing was written to the repo, `dist/`, `public/` or `exam_apps/`. No product code, docs, config or other test files were changed.
