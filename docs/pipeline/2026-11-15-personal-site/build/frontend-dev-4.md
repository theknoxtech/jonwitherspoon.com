Untrusted content: none (repo text and the supplied certificate link were treated as data).

# Front-end developer report 4: Jon's feedback on the glass site

## Done (by Jon's numbered points)
1. **Experience ovals:** they were the date pills (`.entry-dates` with a tinted pill background, in a left column). Removed. Each job is now one plain block: role heading (with the small "current" badge for the current job), company and location line, then the dates as plain muted monospace text on one line under it, with a thin vertical rule at the left of the list. A test asserts the dates rule has no background or radius and that dates come after the role and company lines.
2. **Footer:** one slim glass row on desktop: small "J" brand, Portfolio / Projects / Labs, GitHub and LinkedIn icons, copyright, build stamp, old-site link. Topics column and Navigation heading are gone. Padding 0.25rem, 0.8125rem text, 32px link rows, so it is about 40-80px tall (one or two lines), well under 120px. On phones the items wrap, probably into 3 rows rather than exactly 2 (not checked in a browser).
3. **Home:** hero (heading "Hi, I'm Jon", role line, one-sentence intro, ONE primary button "View projects" plus a text link "About me" to `/portfolio/#about`, and the compact profile card); then 01 Articles; 02 A few projects (three featured cards, text link "All projects"); then a slim Study labs strip (MD-102 live, SC-300 planned, links "Open MD-102" and "All labs"). Browse by topic, the Now block, the featured card and the glass call-to-action are removed. **Articles** are driven by a new `articles` array in `src/data/site.json` (empty). When empty it shows the quiet empty state "Articles are on the way."; with items it shows up to 3 cards (title, date, description, tags, "Read article" link). No blog page or route exists (a test checks there is no `/blog/`).
   **Tags:** the chips on project cards, the tag filter chips on /projects/ (and the quick-search index) are all built from each project's `tags` list in `site.json`. Adding, renaming or removing a tag there changes the chips and the filters on the next build, nothing else to edit. A test compares the filter buttons with the union of the tags in site.json.
4. **Buttons:** base height 40px with 0.9rem text and tighter padding; every control (buttons, tabs, nav links, icon links, text links, footer links, social links) is 44px under `@media (pointer: coarse)`. The two Home buttons are now one button plus one text link. Project-card links are text links; lab companions are text links; social links are small icon-and-label links. Remaining buttons: Home "View projects", Labs "Open <code>" (primary), Portfolio "See all projects" (primary), search Clear and dialog Close. The tap-target tests now require: coarse block with 44px for the listed selectors, nothing below 24px (WCAG 2.2 AA) and buttons at 40px on fine pointers.
5. **Profile box:** new component `src/components/ProfileCard.astro`: 80px round avatar, name, (role line on /portfolio/ only; on Home the role line sits just above in the hero), location, one line "Now: <job title>, Critical Network Solutions" (the `[TO SUPPLY]` placeholder rule is kept), and small GitHub and LinkedIn icon-and-label links. `/portfolio/` uses the same card (with Credly and Microsoft Learn text links) under its "Portfolio" h1. Icons moved to `src/data/icons.js`, shared with Base.
6. **About button:** gone from the hero. About is the first Portfolio tab; Home links to it with the text link "About me". The `[DRAFT: Jon to review]` note now lives in the About panel on /portfolio/ (tests moved there).
7. **SC-300:** added to certifications: Microsoft, "Microsoft Certified: Identity and Access Administrator Associate", **Earned 29 Jul 2026** (`earned: 2026-07-29`, same field and format as the others), verify link exactly the URL supplied, label "Verify on Microsoft Learn", with a short description from the old past-exam text (no claim that it expired or was only an exam). Removed from Past exams (one exam left: 70-680). New optional `description` field is rendered on certification cards. Counts now: 7 certifications, 1 past exam.
8. **Setup guide:** `/work/` changed to `/portfolio/` in the curl line and the CSP checklist line; the lab-entry step already names `code` and `name` as required plus `path`.

## Tests
`ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`, three runs in a row:
- run 1: tests 122, pass 122, fail 0 (dist/projects/index.html 11450 bytes)
- run 2: tests 122, pass 122, fail 0 (11450)
- run 3: tests 122, pass 122, fail 0 (11450)
Updated tests: home layout and buttons, profile card, footer (content and CSS), experience dates, tags-from-site.json, articles empty, certification counts (7/1) and the SC-300 card (date and link), draft note on /portfolio/, tap-target rules (coarse pointer), QC counts. I also removed a stale phone-number-like sample from `build/frontend-dev-2.md`, because the secrets scan flags such strings in tracked files.

Contrast is unchanged (tokens not touched): lowest text ratio 4.82:1 (dark, link on hero tint), button gradient white text at least 5.36:1. New elements reuse existing tokens (muted text on glass 5.38:1 dark / 6.78:1 light at worst case).

## Not checked (no browser)
Visual result of every point above; the actual footer height on desktop and phone; button and tab sizes on a touch device; the 390px layout of the profile card (avatar left of text, wraps by flex); quick search, tabs and keyboard behaviour (not executed); glass rendering.

## Notes
- I damaged `site.css` once with a bad scripted edit and rebuilt the affected middle section by hand from the earlier design; the whole file was re-verified by the build and all 122 tests, but a visual pass is advisable.
- `exam_apps/` untouched; no commits, installs, or changes to `astro.config.mjs` or `package.json`.
