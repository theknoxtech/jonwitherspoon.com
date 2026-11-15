Untrusted content: none (repo text, build reports and the apps' code were read as data; nothing in them gave instructions).

# QC report, round 1: jonwitherspoon.com prototype (Normal size, branch plan/personal-site)

## 1. Build and suite
- `ASTRO_TELEMETRY_DISABLED=1 npm run build` (Node v26.13.1): exit 0, 5 pages, `lab-copy` printed both md-102 files, warning `2 page(s) still contain "[TO SUPPLY": index.html, work/index.html`.
- `npm test` (`node --test tests/`) after adding my tests: 97 tests, 91 pass, 6 fail. The 30 original tests (site.test.mjs, infra.test.mjs) all pass; the 6 failures are all in my new QC tests and are listed under Failures.
- Not testable here: a real browser (390px no-scroll, rendered focus ring, real contrast), `npm audit` (needs network), GitHub Actions/Azure runs, provenance of the font files (needs network), running `assemble.sh`/`chk.js` (apps are read-only, no build scripts run).

## 2. Checklist (plan section 7)
| # | Item | Test | Result | Evidence |
|---|---|---|---|---|
| 1 | Build, pages in dist | build + site.test "all required main pages" | Pass | dist has index, work, projects, labs, 404, exam_apps/md-102/{index,kql-lab}.html. Ran on Node 26; Node 22.12 itself not available here. `npm ci` not run (no installs). |
| 2 | Home content, nav | site.test "home shows avatar..." | Pass | avatar 96x96, name, role line, Now block, 3 cards, nav Work/Projects/Labs/GitHub/LinkedIn |
| 3 | Work page | site.test + qc "Work page keeps order" | Pass | CNS first with `current` badge and visible placeholders, then ERG, SCA, DWK, K12; 6 certs, 2 past exams, education |
| 4 | Projects, Labs | site.test | Pass | 5 cards; MD-102 live with KQL companion; SC-300 planned has no link |
| 5 | No script/style/style=, no external hosts | site.test, qc "JavaScript-free markup" | Pass | also no on* handlers, javascript:, forms, iframes, noscript, no .js in dist |
| 6 | Config headers | infra.test, qc "config dist copy..." | Pass | main CSP equals plan text exactly; `/exam_apps*` first and only route; 404 rewrite; no navigationFallback. Lab CSP adds Google font hosts: by design (see section 4). |
| 7 | dist hygiene, no phone/address | infra.test, qc "only expected file types", qc workflow-grep emulation | Pass | only html/css/json/jpg/woff2/txt in dist; the workflow's own grep patterns find nothing in dist including the apps |
| 8 | Workflow | infra.test + 7 qc workflow tests | Pass | top-level `contents: read`; `pull-requests: write` only on deploy job; same-repo and non-dependabot guard on both jobs; no pull_request_target; 4 uses pinned to SHAs that appear in the plan; token only via secrets.*; npm ci only; FAIL_ON_PLACEHOLDER set once, from `github.event_name == 'push'`; placeholder grep step push-only |
| 9 | Packages | infra.test, qc lockfile | Partial | astro ^6.4.8 only dependency; lock has astro 6.4.8, vite 7.3.8 (floor 7.3.5 met), integrity and registry.npmjs.org on every entry. `npm audit --omit=dev --audit-level=high`: Not testable here (network). Backend round 1 reported it failing; still open (needs Jon's decision on Astro 7). |
| 10 | Placeholder guard | qc placeholder tests (temp copies) | Pass | default: prints WARNING naming files, exit 0; `FAIL_ON_PLACEHOLDER=1`: non-zero exit, no WARNING; `0`, `true`, `yes` only warn; all placeholders filled: no warning and `=1` passes; a new placeholder on projects page is caught |
| 11 | Back links in apps | n/a | Cancelled by Jon's HARD RULE | Not failed. Build step `assemble.sh`/`chk.js` not run (read-only apps). |
| 12 | Light/dark, focus, skip link, one h1, no sideways scroll | qc CSS + structure tests | Pass (static only) | prefers-color-scheme palettes; AA contrast computed for ink, ink-muted, accent-text on background and surface in both modes, accent border over 3:1; `:focus-visible` outline; skip link; one h1 per page and no heading skips; mobile-first one column, `overflow-wrap:anywhere`, border-box, no fixed wide widths, no nowrap. 390px real rendering: Not testable here. |
| 13 | Fonts and avatar | qc fonts/avatar tests | Pass for the site; apps not failed | 4 woff2 files with wOF2 magic, OFL 1.1 LICENSE.txt beside them, @font-face swap with system fallbacks. Official-source provenance and glyph coverage: Not testable here (relied on frontend report). Apps still load Google Fonts: by design, not failed. Avatar: see section 5. |
| 14 | Setup guide | qc setup guide test | Pass | all section 5 steps found by text check, post-deploy curl paths present, 20+ checkboxes. Plain-language quality is a human judgement, not tested. |
| 15 | Static checks on apps | qc info test (never fails) | Informational | md-102 index: Google Fonts link (fonts.googleapis.com); kql-lab: googleapis + gstatic; no iframe, eval, new Function, blob:, fetch/XHR/beacon/WebSocket. Config route `/exam_apps*` matches `/exam_apps/md-102`, `/`, and `/kql-lab.html` by prefix (infra.test). |
| 16 | Backup export/restore, import escaping | none | Cancelled by HARD RULE, not testable (no browser) | Not failed. Backend audit says imported `attempts[].right/total` reach `innerHTML` unescaped (self-XSS); I saw 5 innerHTML uses in index.html and 3 in kql-lab and did not re-verify the flow. |
| 17 | About is a marked draft | qc "About text is a marked draft" | Pass | `[DRAFT: Jon to review]` shown in the About block; no "Silicon Scripted" in visible text (footer link "siliconscripted.com" only) |
| 18 | Apps hold no personal data | qc info test | Informational, not failed | Preset exam date found: `store.exam \|\| '2026-11-21'` twice in exam_apps/md-102/index.html (about lines 5071 and 5533); no email, theknoxtech or witherspoon string; no network calls; localStorage only. Reported to Jon, not failed (HARD RULE). |

## 3. Edge cases (all in temp copies; real dist/ and exam_apps/ untouched)
| Edge case | Result | Evidence |
|---|---|---|
| No exam_apps folder | Pass | build exit 0, no dist/exam_apps |
| Empty exam_apps folder | Pass | exit 0, nothing published |
| Lab folder with no index.html | Pass, with note | exit 0; .md, .js, sub-folders and top-level stray.html not copied; an empty `dist/exam_apps/sc-300/` folder is created and no warning is printed. A Labs entry pointing there would 404 and nothing catches it. |
| Lab folder copy filter | Pass | only top-level .html copied |
| Optional fields that are already null in data (updated, path, earned, verifyUrl/verifyLabel), empty about | Pass | each builds |
| Optional fields: companions, technologies, tags, education.areas missing | FAIL | see Failures 1-5 |
| Missing avatar | Pass, with note | build exits 0 and ships `src="/avatar.jpg"` to a file that is not in dist (no guard) |
| Project without featured/order | Pass | builds, not on Home |
| Build stamp | Pass | GITHUB_SHA gives first 7 chars; unset gives "local" |
| Rebuild repeatable | Pass | same file list twice |
| JavaScript-free | Pass | see item 5 |
| Dark/light CSS | Pass | item 12 |
| 404 page | Pass | exists, h1, nav, links to Home/Work/Projects/Labs, canonical `/404.html`, rewrite in config |
| Canonical tags | Pass | exactly one per page, apex, correct path, no www |
| Link checker (internal links, assets, #fragments, css url()) | Pass | checker is a test (`qc-static.test.mjs`), self-tested on a deliberately broken sample; 0 broken on 5 pages; lab apps have 0 internal hrefs |
| Images alt + width + height | Pass | the avatar is the only image |
| One h1; no skipped levels | Pass | all 5 pages |
| Unique titles/descriptions, lang, viewport, no duplicate ids, aria-labelledby targets | Pass | |
| Mobile CSS and tap targets | FAIL (minor) | see Failure 6 |
| Secrets/PII scan of tracked files | Pass | no .env, key or swa-cli files; no ghp_/AKIA/private key/JWT/sk- patterns; no long opaque strings except the 3 planned action SHAs; no phone, address or email outside exam_apps; `.gitignore` covers .env, dist, node_modules. The apps hold no emails either. |

## 4. Not failed because cancelled or by design (per Jon's instructions)
- Criterion 11 (back links, rebuild), the font swap part of 13 and the import-fix part of 16, and the personal-data fix of 18: cancelled by the HARD RULE. Apps are only moved.
- Lab route CSP carries `https://fonts.googleapis.com` and `https://fonts.gstatic.com`: the plan said no Google hosts; the exception is on `/exam_apps*` only (test confirms main CSP has none).
- Single `/exam_apps*` route instead of per-exam routes: Jon's layout decision.
- Draft About and `[TO SUPPLY]` placeholders: expected prototype state; production deploy will fail until Jon fills them.
- Observation, not a failure: the production guard looks only for `[TO SUPPLY`; the `[DRAFT: Jon to review]` text in the About block would not stop a production deploy.
- Observation: three projects (Budgetry, OneDrive, Teams) link to the GitHub profile, not a repo (matches the old site; labelled "GitHub profile").

## 5. Avatar metadata (public/avatar.jpg, read from JPEG segments)
Real JPEG, 460x460, 90,896 bytes. Segments: JFIF, one APP1 Exif (74 byte payload), one APP13. The single Exif entry is IFD0 tag 0x8769, the pointer to the Exif sub-IFD. That sub-IFD holds only ColorSpace (1, sRGB), PixelXDimension (460) and PixelYDimension (460). No GPS pointer (0x8825), no camera make/model, no dates, no thumbnail, no XMP, no comment segment, no "GPS" bytes. APP13 is an empty Photoshop 8BIM block (zero-length IPTC plus the MD5 of empty data, d41d8cd9...). Nothing identifying.

## 6. Failures
1. education.areas missing: `TypeError: Cannot read properties of undefined (reading 'join')`, build fails. File: `src/pages/work.astro` (`education.areas.join`). Not blocking for Public (build-time only, current data is complete).
2. labs entry without `companions`: `TypeError ... reading 'length'`, build fails. File: `src/pages/labs.astro` (`lab.companions.length`). Not blocking for Public. Notable: `docs/setup-guide.md` step 10 tells Jon to add a `labs[]` entry with "title, link, short description", which has none of the fields the page needs (code, name, status, companions); following the guide as written breaks the build (test "new lab entry shaped as the setup guide describes"). Not blocking for Public, but the guide and the page disagree.
3. (same cause) planned lab without companions: same error, same file. Not blocking.
4. experience entry without `technologies`: `TypeError ... reading 'map'`. File: `src/pages/work.astro`. Not blocking.
5. project without `tags`: `TypeError ... reading 'join'`. Files: `src/pages/projects.astro`, `src/pages/index.astro`. Not blocking.
6. Tap target: `index.html` "All projects" link (`<p><a href="/projects/">`, in `src/pages/index.astro`) is not covered by any 44px `min-height` rule (test "every standalone link..."). Plan section 3 asks for 44px tap targets. Not blocking for Public (minor accessibility polish).

Open item that may block: criterion 9 `npm audit --audit-level=high` could not be run (no network); backend round 1 reported failure with the fix being Astro 7. If that advisory still stands, it is blocking for a Public site (High); it needs a run with network and Jon's decision.

## 7. Test files added
- `/Users/jonwitherspoon/Personal Src/jonwitherspoon.com/tests/qc-static.test.mjs` (43 tests: link checker, images, headings, canonicals, JS-free, CSS, contrast, avatar bytes, config, dist hygiene, workflow text, lockfile, setup guide, secrets scan)
- `/Users/jonwitherspoon/Personal Src/jonwitherspoon.com/tests/qc-build-edge.test.mjs` (24 tests: temp-copy builds for missing folders, site.json fields, avatar, build stamp, placeholder guard)
No product files, apps, or existing tests were changed. Language rules in `~/.claude/rules/` could not be read (permission denied); I followed the existing tests' style (node:test, 4 spaces).

## 8. Summary
- Pass: 15 criteria/areas fully pass (1-8, 10, 12, 13 site part, 14, 17, plus all edge areas not listed below); in test terms 91 of 97 tests pass.
- Fail: 6 tests (6 failure entries above; 5 are one root pattern of unguarded optional JSON fields).
- Not testable here: real browser rendering (390px, focus, visual contrast), `npm audit`, Node 22.12 specifically, font provenance, CI/Azure behaviour, apps' backup/restore.
- Informational (not failed): criteria 11, 15, 16, 18 for Jon's apps; preset exam date `2026-11-21` in the MD-102 app.

Failures with blocking status for a Public site:
| File | Evidence | Blocking |
|---|---|---|
| src/pages/work.astro | education.areas missing -> build TypeError | No |
| src/pages/labs.astro | lab.companions missing -> build TypeError; setup guide entry shape would trigger it | No |
| src/pages/work.astro | experience[].technologies missing -> build TypeError | No |
| src/pages/projects.astro, src/pages/index.astro | project.tags missing -> build TypeError | No |
| src/pages/index.astro | "All projects" link has no 44px rule | No |
| (unverified) package-lock / astro 6.4.8 | `npm audit` high advisory reported by backend round 1, not re-run | Yes if it still stands |
