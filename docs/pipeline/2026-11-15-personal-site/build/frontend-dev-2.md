Untrusted content: none (old-site CSS was not needed; repo text, QC report and tests read as data, no instructions in them).

# Front-end developer report 2 (post-review revision)

## What changed
- **Theme**: new cool palette, rounded cards (16px) with a 3px accent top edge, pill chips, solid coloured buttons, tinted hero panel on Home (rounded panel inside the column, not full-bleed), accent section numbers, circular avatar. IBM Plex kept, self-hosted. Light and dark by `prefers-color-scheme` only. Contrasts with the labs (warm paper, amber, Plex): blue/teal on cool white or ink-navy.
- **Buttons**: `.button.button-primary` (filled) for View projects, All projects, Open lab on Labs; `.button.button-secondary` (outlined, tinted on hover) for GitHub, LinkedIn, Open MD-102 lab (Home), project Repo/Release links, lab companions. Primary hover is a darker solid fill.
- **Chips and badges**: tag chips in 4 tints (blue, teal, amber, rose), picked by a fixed build-time rule (sum of the tag's character codes mod 4), so a tag has the same colour on every page. Also used on Work (technologies, education areas). Lab and project status pills: live green, in progress amber, planned grey (text label always present).
- **Budgetry removed** from `site.json` and everywhere. Four projects; Home still shows three (Winnow, Dell BitLocker, OneDrive); Teams order set to 3. The Projects meta description no longer mentions a finance app.
- **Search** on /projects/ and /labs/: labelled `type=search` box, Clear button, Escape resets, live count "Showing N of M projects" (`aria-live="polite"`), "No matches. ..." message. Projects also have tag filter buttons (`aria-pressed`, one tag at a time, combined with the text search). Each item has a lowercase escaped `data-search` (projects also `data-tags`). `public/search.js` is one external same-origin file (no eval, no innerHTML, textContent and DOM only, no network, no storage). Base.astro adds `<script is:inline src="/search.js" defer></script>` only when a page passes `withSearch`. Built output is `<script src="/search.js" defer></script>`, no inline content, no `type=module`. Without JS: the panel is `display:none` in CSS and shows only when the script adds `has-search` to `<html>`; all items stay visible. `[hidden]{display:none}` is placed after the layout rules so it wins over `.lab{display:grid}`.
- **QC failures fixed**: pages tolerate missing `education.areas`, lab `companions`, experience `technologies` and `bullets`, project `tags`, `order`, `date`, `linkLabel`, lab `status`, `description`, `updated`, `path`. "All projects" is now a `.button` (44px rule). The six former failures now pass.
- **`[DRAFT: Jon to review]`** now shows above the (still collapsed) About section instead of inside it.
- Home Now block: "Open MD-102 lab" button. Project card titles are plain headings; the button is the link.

## Palette (hex) and contrast (light / dark)
| Token | Light | Dark |
|---|---|---|
| background / surface | #f4f8fc / #ffffff | #0b1220 / #141f33 |
| ink / ink-muted | #0f1b2d / #475569 | #e8eef8 / #9db0c9 |
| rule | #cfd9e6 | #2a3a55 |
| accent (focus, borders) / accent-text (links) | #2563eb / #1d4ed8 | #5b9dff / #8bbaff |
| accent-two (teal; section numbers, lab codes) | #0f766e | #2dd4bf |
| tint / hero-tint | #eaf1fd / #e3eefc | #172b4d / #12233f |
| button fill / text / hover | #2563eb / #ffffff / #1e4fc4 | #5b9dff / #0b1220 / #8bbaff |
| control-border (search box) | #64748b | #7b8fad |
| chips blue, teal, amber, rose (fill / text) | #dbeafe/#1e3a8a, #ccfbf1/#115e59, #fef3c7/#92400e, #ffe4e6/#9f1239 | #1e3a6e/#bfdbfe, #0f3d3a/#99f6e4, #422f0a/#fde68a, #4a1d2b/#fecdd3 |
| status live, progress, planned | #dcfce7/#166534, #fef3c7/#92400e, #e2e8f0/#334155 | #12372a/#86efac, #422f0a/#fde68a, #243247/#cbd5e1 |

Ratios (light / dark; text needs 4.5, non-text 3): ink on background 16.20 / 16.06; ink on surface 17.28 / 14.15; ink-muted on background 7.10 / 8.46, on surface 7.58 / 7.45; accent-text on background 6.28 / 9.42, on surface 6.70 / 8.30, on tint 5.90 / 7.09, on hero 5.71 / 7.90; accent-two on background 5.13 / 10.06, on surface 5.47 / 8.86, on hero 4.67 / 8.43; ink on hero 14.73 / 13.47; ink-muted on hero 6.46 / 7.09; button text on fill 5.17 / 6.88, on hover 7.07 / 9.42; chips blue 8.49 / 7.84, teal 6.73 / 9.52, amber 6.37 / 10.27, rose 6.68 / 9.91; status live 6.49 / 9.31, in progress 6.37 / 10.27, planned 8.40 / 8.72; search border on surface 4.76 / 5.01; accent (focus ring) on background 4.84 / 6.88, on surface 5.17 / 6.06. All asserted in `tests/site.test.mjs`.

## Tests
`ASTRO_TELEMETRY_DISABLED=1 npm run build`: exit 0, 5 pages (placeholder WARNING for index and work, as before). `npm test`: 106 tests, 104 pass, 2 fail. I wrote the new `tests/site.test.mjs` checks first and saw them fail (no search, no tokens), then built.

The 2 failures are NOT from this change and I could not fix them within my file list:
- `QC secrets: no token-looking strings ... in tracked files` flags `tests/qc-static.test.mjs` line 550, its own fake phone number `865-555-1234`.
- `QC secrets: long opaque strings ...` flags `tests/qc-build-edge.test.mjs`, the fake `GITHUB_SHA` `abcdef1234...`.
The QC files were untracked when QC ran; now that they are committed, their own fixtures trip the scans. Fix: have those two scans skip the QC test files (QC/back-end owner). All six formerly failing edge-case tests and the tap-target test pass.

New `site.test.mjs` checks: search box, label, live region, no-match message, clear button on both pages; data-search on every item; tag buttons; panel hidden by CSS; Budgetry/Plaid absent from dist; four projects; button classes on Home; `[DRAFT` outside `<details>`; only `/search.js` as script, no inline script/style/style=, search.js has no eval or innerHTML; full contrast table.

## Edits to tests I do not own (narrow)
- `tests/qc-static.test.mjs`: the "JavaScript-free" test now allows only the `/search.js` script tag and only `search.js` in dist; the allowed-file-types regex adds `^search\.js$`. These were script assertions.
- `tests/infra.test.mjs` line 152: `.js` allowed under `dist/_astro/` or exactly `dist/search.js`.
- `tests/qc-build-edge.test.mjs` (outside the two files you listed; one change): `site.projects[4]` became `[3]` in the "project without featured or order" test, because only four projects exist now (it would throw otherwise). Intent unchanged.

## Deviations
- **No box-shadow, transition or gradient.** Frozen QC assertions (`qc-static.test.mjs` lines 283 and 298) forbid `transition:`, `box-shadow` and `gradient(`, and I was only allowed to change script assertions. So the hover lift is `translateY(-2px)` plus a border colour shift, applied only under `prefers-reduced-motion: no-preference`, and it is instant (no easing). The hero wash is a solid tint and the primary hover is a darker solid. If Jon wants the eased lift or a gradient, QC lines 283 and 298 need relaxing; then add a `transition: transform ...` rule in the no-preference block.
- The first card on /projects/ (and Home) still spans two columns at 640px+ via `:first-child`; when a filter hides the first card, the layout reflows to the next one.
- Duplicate words in `data-search` (for example "live live") are harmless.
- `exam_apps/md-102/index.html` shows as modified in `git diff`; I did not touch it.

## Not checked (no browser)
Visual look, real 390px no-sideways-scroll (by construction: one column, `overflow-wrap:anywhere`, flex-wrap on buttons and chips, no fixed widths), the live filtering behaviour of `search.js` (not run in a browser; logic is small and was read through, not executed), focus ring appearance, CSP enforcement (the main CSP `default-src 'self'` allows same-origin `/search.js`; not exercised in a browser).

## For the back-end developer: the setup guide (`docs/setup-guide.md` step 10, line 107)
It says to add a `labs[]` entry with "title, link, short description". The real fields are:
- **Required: `code` (for example "AZ-104") and `name`.**
- Recommended: `path` (for example `/exam_apps/az-104/`) gives the Open button; without it the lab shows no link.
- Optional: `status` ("live", "in-progress" or "planned"; if missing, it is "live" when `path` exists, otherwise "planned"), `updated` (YYYY-MM-DD), `description` (one line, shown and searchable), `companions` (list of `{ "name": "...", "path": "..." }`).
Suggested wording: "Add an entry to `labs[]` in `src/data/site.json` with `code` and `name`, plus `path` (`/exam_apps/<code>/`), `status`, and optionally `description`." Also the setup guide has no mention of Budgetry (checked by grep). The `/exam_apps*` route and the main CSP are unchanged.

## Files changed
src/data/site.json, src/layouts/Base.astro, src/pages/{index,work,projects,labs}.astro (404 unchanged), src/styles/site.css, public/search.js (new), tests/site.test.mjs, tests/qc-static.test.mjs, tests/infra.test.mjs, tests/qc-build-edge.test.mjs (one index), this report.

## Recon requests
none

## Round 2b (Jon approved the test edits and overrode the no-shadow/transition/gradient rule)
- **site.css**: soft card shadow (`--shadow-soft: 0 1px 3px`, alpha 0.08 light / 0.25 dark), hover shadow (`--shadow-lift: 0 4px 12px`, alpha 0.12 / 0.25), neutral black-navy rgba only (no glow). Eased 150ms transitions (transform, border-color, box-shadow, background-color) on cards, certs, labs and buttons, only inside `@media (prefers-reduced-motion: no-preference)`. Hover: cards lift 2px with accent border and larger shadow; buttons lift 1px. One gradient: `.hero` background `linear-gradient(135deg, --hero-tint, --hero-tint-end)` (light #e3eefc to #edf4fd, dark #12233f to #162b4d, same hue).
- **qc-static.test.mjs**: CSS guards relaxed as agreed (still forbid keyframes, animation, text-shadow, backdrop-filter, filter, radial/conic/repeating gradients, `!important`; shadow blur at most 24px, alpha at most 0.25, neutral colour; transitions only in the no-preference block, at most 200ms, never `all`; exactly one `linear-gradient(`, on `.hero`). The two secrets scans skip `tests/qc-*.test.mjs` with a comment; all other tracked files are still scanned.
- **site.test.mjs**: contrast table adds `hero-tint-end` pairs. `site.projects[3]` change kept.
- **Result**: `ASTRO_TELEMETRY_DISABLED=1 npm run build` exit 0; `npm test`: 106 tests, 106 pass, 0 fail.
- **Minimum contrast**: 4.67:1 (accent-two teal on hero tint, light mode). On the new gradient end tone: ink 15.60 / 12.12, ink-muted 6.84 / 6.38, accent-text 6.05 / 7.11, accent-two 4.94 / 7.59 (light / dark). All other ratios unchanged and at or above 4.67 (text) / 4.76 (non-text).
- Note: `exam_apps/` has uncommitted edits by Jon; the lab-copy test compares dist to them, so run `npm run build` before `npm test` after any change there. Untouched by me.

## Round 2c
Superseded by `build/frontend-dev-3.md` (liquid-glass redesign, Portfolio tabs, quick search, and the test-root-cause investigation).
