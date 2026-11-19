Untrusted content: none. No file or tool output asked me to do anything.

# Front-end dev 6: Articles (blog)

## Summary
Built the Articles feature per `docs/plans/in-progress/2026-11-16-blog.md`: `blog` content collection (title, date, description, optional `cover` + `coverAlt`, tags, draft), `/articles/` list (search panel, tag chips, empty state), `/articles/<slug>/` pages (folder articles `my-title/index.md` give `/articles/my-title/`), Home block reads the latest 3, search index gets `kind: 'article'`, "Articles" added to `navLinks` (nav and footer), `markdown.syntaxHighlight: false`, `articles` list removed from `site.json`, "Add an article" rewritten in the editing guide. Images are optimized by Astro (sharp already present; no install).

Decisions beyond the plan (please check):
- Raw `<script>`/`<style>`, `style=` attributes and outside image URLs (`http:`, `https:`, `//`) in an article fail the build with the file name (`findUnsafeMarkup` in `src/lib/articles.js`). Missing alt fails the same way (`findImagesWithoutAlt`). Both run from `getStaticPaths` on published articles only (drafts are not checked).
- Nav order: Portfolio, Projects, Labs, Articles.
- Code blocks use `white-space: pre-wrap` (no horizontal scroll), because the existing QC CSS test forbids `overflow-x: auto` outside the tab bar.
- Article cards are duplicated markup on Home and `/articles/` (a shared component would be a new file outside the plan's table). `chipTint` is exported from `src/lib/articles.js` for the new pages; `index.astro` and `projects.astro` keep their own copies.
- `.astro` files use 2-space indent (matching the existing `.astro` files); JS/TS/tests use 4.
- Did not rename the quick-search dialog label "Search projects and labs" (pinned by an existing test); idea: rename to include articles later.
- Code size: far over the plan's 80-line test target (8 fixture builds, about 200 lines); coverage was not trimmed.

## Fixtures and isolation
- Fixtures live in `tests/fixtures/blog/<case>/` (empty, normal, draft, image, banner, script, missing-alt, cover-no-alt, external-image); nothing was written to `src/content/blog/`.
- lab-copy and placeholder-guard already write under the build's `outDir`, so **no change to those hooks was needed**; `astro.config.mjs` only gained `markdown.syntaxHighlight: false`.
- Real finding: Astro's content data store lives in `node_modules/.astro` (shared, persists between builds). A first version of the fixture builds left fixture entries in it. Fix: `tests/fixtures/astro.fixture.config.mjs` (test-only) re-exports the real config with `cacheDir` set to a temp folder from env `BLOG_CACHE_DIR`; tests pass it with `--config`. Fixture builds therefore write only to the OS temp folder. I verified `git status` shows nothing new in `dist/`, `public/`, `exam_apps/`, `src/content/` after the tests.
- Residual: if Jon deletes his last article but keeps an empty `src/content/blog/` folder, a local build may keep showing the old article from the cache (Astro behavior; CI builds are clean). Not fixed (config scope).
- Temp folders (`blog-*` in the OS temp dir) are left for the OS to clear (no deletes).

## Files changed
- `src/content.config.ts` (new): collection; `BLOG_DIR` env with default `src/content/blog`; `cover` + `coverAlt` rule.
- `src/lib/articles.js` (new): `publishedArticles`, `findImagesWithoutAlt`, `findUnsafeMarkup`, `chipTint`, `assertArticleIsAllowed`.
- `src/pages/articles/index.astro`, `src/pages/articles/[slug].astro` (new).
- `src/pages/index.astro`, `src/pages/search-index.json.js`, `src/layouts/Base.astro` (nav + `section` type), `src/styles/site.css` (rules appended at the end), `src/data/site.json` (removed `"articles": []`), `astro.config.mjs` (syntaxHighlight), `docs/editing-guide.md`.
- `tests/blog.test.mjs`, `tests/fixtures/**`, `tests/fixtures/astro.fixture.config.mjs` (new); `tests/site.test.mjs` (two existing tests changed, below).

## Existing tests I changed (both broken by the approved plan)
1. Name before: `articles section is driven by site.json articles (empty array in this build)`; body before: `assert.deepEqual(site.articles, []);`
   After: name `articles section is driven by the blog collection (no articles in this build), and site.json has no articles list`; asserts `!('articles' in site)`, Home still shows `<p class="empty-state">Articles are on the way.</p>`, and `/articles/` shows an `empty-state`.
2. Name before: `footer is one compact row: brand, three nav links, ...`; loop before: `['Portfolio', 'Projects', 'Labs']`.
   After: `... brand, four nav links, ...`; loop `['Portfolio', 'Projects', 'Labs', 'Articles']`.
No other existing test was edited. No security scan or `docs/security/*` touched.

## Build and tests
- `ASTRO_TELEMETRY_DISABLED=1 npm run build` exit 0; real site builds with the empty-state Articles section on Home and `/articles/`.
- `npm test`: 142 tests, 142 pass, 0 fail (three consecutive clean runs after the final build; 12 of the 142 are the new `tests/blog.test.mjs`). The red step was seen first (module missing, then builds failing, then stale cache and `style=` from the default highlighter).
- Flake note: in an earlier stretch, about 3 of 8 full runs had one failure in a different test each time (one was my "no articles" test, others in `qc-build-edge`). I could not reproduce it standalone (4 clean runs of each file) or in the last 3 full runs. Possible cause: concurrent builds sharing `node_modules/.astro` or other activity in the tree. Watch for it.

## Things to know (my mistakes, no damage found)
- A first fixture config wrote a folder named `file:` in the repo root (bad `cacheDir` value). I moved it (not deleted) to the session scratchpad: `/private/tmp/claude-501/-Users-jonwitherspoon-Personal-Src-jonwitherspoon-com/b4cbc389-b334-4532-b6f9-63e0ce8a8906/scratchpad/stray-file-colon`.
- I ran `git stash` and `git stash pop` by mistake (seconds apart, popped cleanly, stash list empty). It rewrote the mtimes of all tracked modified files, including `exam_apps/md-102/index.html` and `exam_apps/md-102/source/q28.js`, which now show as modified in `git status`. I did not edit them; the diff is wording edits ("Apps, Monitor" changed to "Apps > Monitor") that someone else made (they were not in the status at the start of my session, and the first scan after my changes showed none). Please check that those two edits are Jon's own, and confirm against 612aba4 if not. Because the pop touched `src/`, I re-ran `npm run build` afterwards (the "dist is not older" test needs it).

## Recon requests
none
