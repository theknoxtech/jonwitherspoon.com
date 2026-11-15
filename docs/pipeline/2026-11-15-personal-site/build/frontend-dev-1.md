Untrusted content: none (old-site files and downloaded font LICENSE/API output contained no instructions).

# Front-end developer report 1

## Built
- `src/data/site.json`: profile (with DRAFT About marked `[DRAFT: Jon to review]`, typos fixed, Silicon Scripted dropped), experience (new current role first, all fields `[TO SUPPLY: ...]`, then the four old roles), 5 projects, 6 certifications, 2 past exams, 5 skill groups, education, labs (MD-102 live at `/exam_apps/md-102/` with KQL Lab companion `/exam_apps/md-102/kql-lab.html`; SC-300 planned, no path). Layout change from the coordinator (`/exam_apps/<code>/`) applied in the data and the tests.
- `src/layouts/Base.astro`: nav, skip link, canonical, title/description, footer `built <UTC date> · <7 of GITHUB_SHA or local>`, small link to siliconscripted.com. Imports `site.css` (emitted as `/_astro/Base.*.css`, external).
- Pages: `index` (avatar 96px, name, role line, intro, collapsed About draft, Now block linking to the MD-102 lab, 3 featured projects: Winnow, Dell BitLocker, OneDrive), `work` (01 Experience, 02 Skills, 03 Certifications + Past exams, 04 Education), `projects` (5 cards), `labs`, `404`.
- `src/styles/site.css`: self-hosted Plex @font-face (swap, system fallbacks), light/dark via prefers-color-scheme only, amber accent, mobile-first (one column below 640px), 44px tap targets, focus rings, skip link, `.placeholder` class (dashed amber outline). No `!important`, shadows, gradients, animation.
- No inline script/style/style= and no client JS.
- Fonts and `LICENSE.txt` in `public/fonts/`; `public/avatar.jpg`.
- `tests/site.test.mjs`: 14 node:test tests; fail clearly if `dist/` is missing.

## Tests
Red first: before the build existed, the suite failed with "dist/ is missing: run npm run build". Then:
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: exit 0, 5 pages, warning lists `index.html, work/index.html` ([TO SUPPLY] guard works).
- `node --test tests/site.test.mjs`: tests 14, pass 14, fail 0. `npm test` (back-end's `node --test tests/`): 14 pass, 0 fail.
- Note: the sandbox blocks Astro telemetry writing to `~/Library/Preferences/astro`, so the build needs `ASTRO_TELEMETRY_DISABLED=1` here (CI is unaffected).
- Not verified: visual rendering and 390px no-scroll (no browser available); done by construction (one column, `overflow-wrap:anywhere`, no fixed widths).

## Files changed
src/data/site.json, src/layouts/Base.astro, src/pages/{index,work,projects,labs,404}.astro, src/styles/site.css, public/avatar.jpg, public/fonts/{IBMPlexSans-Regular,IBMPlexSans-SemiBold,IBMPlexMono-Regular,IBMPlexMono-Medium}.woff2, public/fonts/LICENSE.txt, tests/site.test.mjs, this report.

## Avatar / EXIF
GitHub's download was actually PNG data (460x460) despite the `avatar_url`, so I converted it with `sips` to a real JPEG (460x460, 91 KB). `mdls` cannot see the file (Spotlight does not index it: "could not find"), so I parsed the JPEG segments directly: JFIF, one tiny Exif segment (76 bytes, 1 directory entry), a 56-byte APP13 segment, no "GPS" bytes anywhere. No GPS or camera fields.

## Font coverage
All four Latin1 split files downloaded from IBM/plex (no 404s, no fallback to complete/). Checked cmap by decoding the woff2: curly quotes, en/em dash, euro, ellipsis, middle dot, bullet are present in all four. Arrows (U+2190, U+2192) are NOT present, so the site uses none. The only non-ASCII character in rendered pages is the middle dot.

## Deviations / notes
- Accent: `#B26B00` gives only 3.93:1 on the off-white, so it is used for borders/outlines only; text uses `#8C5400` (5.81:1; 5.28:1 on surface). Dark `#E8A33D` is 8.06:1.
- Canonical on the 404 page is `https://jonwitherspoon.com/404.html`.
- The old site's Budgetry, OneDrive and Teams `repoUrl` is just the GitHub profile; kept as is (labelled "GitHub profile"). The CompTIA verify link is `http://verify.CompTIA.org` as on the old site.
- MD-102 "updated" date `2026-11-15` is the app file's modification date; the lab name "Endpoint Administrator practice app" and SC-300 name are my wording. Jon may change them.
- Old site had no start or end day for roles; the page shows `Aug 2022 to Aug 2025` as month/year.
- A stray write attempt to a wrong path outside the repo was denied by the permission system; nothing was written outside the repo.
- Four heredoc files were briefly created in the repo root by a failed `cd` and moved into `src/pages/` (no deletions).

## Interface assumptions
Back-end build config as found (`inlineStylesheets: never`, placeholder guard). The md-102 apps are expected at `/exam_apps/md-102/` and should reference `/fonts/IBMPlex*.woff2`.

## Recon requests
none

## Not done
Nothing outstanding from the assignment, except the visual check noted above.
