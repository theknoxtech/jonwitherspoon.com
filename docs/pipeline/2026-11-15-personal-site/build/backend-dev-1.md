Untrusted content: none.

# Back-end build report 1

## Layout change applied
Per the coordinator message, labs live under `exam_apps/` (sources, not deployed) and `public/exam_apps/md-102/` (built). One CSP route `/exam_apps*` (first in routes) replaces `/md-102*`. KQL lab back link goes to `/exam_apps/md-102/`; md-102 back link goes to `/labs/`. Plan text (`/md-102*`, `apps/`) is superseded in: .gitignore (`exam_apps/**/{all.js,index.html,standalone.html}`), guide, setup guide, tests.

## Built
- `package.json` (only dependency astro ^6.4.8, engines >=22.12, scripts dev/build/preview/test), `package-lock.json`, `.node-version` (22), `astro.config.mjs` (static, site, `inlineStylesheets: 'never'`, inline `placeholder-guard` integration on `astro:build:done`: warns with count and file names; `FAIL_ON_PLACEHOLDER=1` throws). Verified: build warns on index.html and work/index.html; with the env var the build errors.
- `.gitattributes`, `.gitignore` additions, `public/staticwebapp.config.json` (global headers per plan, `/exam_apps*` first route with lab CSP, 404 rewrite, no navigationFallback, no X-XSS-Protection; valid JSON, well under 20 KB).
- `.github/workflows/deploy.yml`, `.github/dependabot.yml` (github-actions and npm, weekly, target-branch dev, npm cooldown 7 days).
- `docs/setup-guide.md` (checkboxes, plain language, public vs private, Azure, secret, domains, curl checks, rollback, token reset).
- md-102 move, guide updates (tree, section 10, new "Add a new lab" section, Playwright note, known-issue note), back links, local fonts, rebuilt output.
- `tests/infra.test.mjs`.
- Extra file: `exam_apps/package.json` (`{"type":"commonjs"}`). Needed because the root package is `"type": "module"` and the lab scripts (`chk.js`, `t*.js`, `test.js`) use `require`; without it `node chk.js` fails (criterion 11).

## Tests
- `npm test` (`node --test tests/`, includes the front-end's tests/site.test.mjs): tests 38, pass 38, fail 0 (run after `npm run build`, so dist hygiene checks ran).
- `npm run build`: exit OK, 5 pages, 2 placeholder warnings (front-end content).
- `npm ls astro vite`: astro@6.4.8, vite@7.3.8 (floor 7.3.5 met).
- `npm audit --omit=dev --audit-level=high`: FAILS (criterion 9). 3 findings: astro <=7.4.6 (critical, many advisories: XSS in spread attributes/transition directives/JSX, AVIF image RCE, base-path auth bypass, @astrojs/node file read), esbuild 0.27.3-0.28.0 (Windows dev server file read), sharp (libvips/libheif/librsvg CVEs). Fix offered by npm is astro@7.4.12 (breaking). Most advisories concern features this site does not use (image optimisation, MDX, node adapter, view transitions), but the gate fails. Decision needed from Jon/orchestrator: stay on Astro 6.4.8 and accept/document, or move to Astro 7 (outside the approved scope; I did not do it).
- TDD note: tests were written after the config and workflow files, not before (config files). I did check the key regexes against the pre-change built file: they flag the old preset exam date and Google Fonts link.

## Environment notes
- `npm install` needed `--cache $TMPDIR/npm-cache` because `~/.npm` is root-owned (npm EPERM). Network only to registry.npmjs.org. npm warned about install scripts for esbuild and sharp (npm 11 `allowScripts`); build works anyway.
- `astro build` needs `ASTRO_TELEMETRY_DISABLED=1` in this sandbox (it writes to ~/Library/Preferences).
- `git mv` is blocked by the sandbox (`.git/index.lock`), so I used plain `mv`; git will show deletes plus adds, rename detection should pick them up. Leftover: `md-102/.DS_Store` (untracked junk) keeps the old `md-102/` folder alive; delete needs your approval. Generated, git-ignored build files exist in `exam_apps/md-102/source/` (`all.js`, `index.html`, `standalone.html`); also deletable.
- `chk.js` hardcodes `/tmp/_q.js` (blocked in the sandbox); I ran a scratch copy with the path changed. The script itself fails for another reason (below).

## IMPORTANT: md-102 source is out of date vs the committed built file
The committed `md-102/source/` cannot rebuild the committed `index.html`. `h.js` lacks the `addv` helper that q23 to q26 call (rebuilt app would throw `addv is not defined` and not run), `app.html` lacks the `.mock` styles and render code, `q22.js` lacks the "Managed apps: profiles, quiet time" block, and a few q-file rewordings differ (about 130 diff lines). Probably newer h.js, app.html and q22.js exist elsewhere (artifact edits).
What I did: I did NOT ship a source rebuild. I applied the same edits (fonts, back link, import clean-up, blank exam date) as scripted string replacements to the committed built `index.html`, then wrapped it with the standalone wrapper from `assemble.sh` (doctype, viewport, download shim). I also made the same edits in `source/app.html` so they are not lost. `kql-lab.html` was rebuilt from `kql-source` (rebuilding the original reproduced the committed file byte for byte, so the KQL build step is: replace `/*__DATA__*/` in app.html with data.js). Action for Jon: supply current `h.js`, `app.html`, `q22.js` (and any other drifted files), then rebuild with the guide steps. Documented in the guide as a known issue. Question files untouched.
Behaviour change to note: the wrapped page now has a doctype and `color-scheme:light` on `:root` from the wrapper (the guide's intended standalone output); the old committed file had no doctype.

## md-102 findings
- Storage keys unchanged: `md102.lab.v1` (index.html) and `kql.md102.lab.v1` (kql-lab.html); test asserts both.
- Import path (criterion 16): `importFile` (file) and the `import` action (pasted text) did `store = Object.assign({...defaults}, JSON.parse(...))`. Imported `attempts[].right/total` and, through the sums, `q[id].seen/right` reached `innerHTML` unescaped (progress table, topic table), so a crafted backup could inject markup (self-XSS only; the CSP for labs allows inline script, so it would have run). Everything else (labels, option text) goes through `esc`; `exam` is escaped. Fix: added `cleanBackup(d)` used by both paths: coerces counters to finite numbers, labels/mode to strings, keeps `last` boolean/null, drops `exam`/`planStart` unless `YYYY-MM-DD`, forces `plan`/`lab` to objects. A valid exported backup round-trips unchanged (verified in node via vm: output equals input, including `run`). Test covers a hostile payload.
- Export/restore drive: Playwright not installed, so I could not click through the browser. Covered by vm test of `cleanBackup` plus round trip. QC should, in a browser: answer a few questions, Progress tab > Download backup (file download), Reset, then restore from the file and from pasted text; confirm progress returns; then restore a file whose `attempts[0].right` is `"<img src=x onerror=alert(1)>"` and confirm no alert and the row shows 0.
- Network calls: none (no fetch, XMLHttpRequest, sendBeacon, WebSocket, EventSource in either app; test asserts). External hosts left are only `learn.microsoft.com`, `aka.ms` links (user-clickable, `rel=noopener`) and a contoso sample string. No Google hosts. No iframe, eval or `new Function`. `blob:` only in the download shim.

## Personal data audit
Scope: `exam_apps/md-102/source`, `kql-source`, guide, and built `index.html`, `kql-lab.html`.
- Name, email, employer, local file paths: nothing found (searched witherspoon, knoxtech, any email pattern, /Users/, Silicon, employer names). `C:\...` hits are Windows example paths in exam content, not personal.
- Seeded progress, attempts, ticks, sample backup JSON: nothing found. Store starts `{attempts:[], q:{}, plan:{}, lab:{}}`; no sample backup anywhere.
- Notes about his own weak spots: nothing found.
- FOUND and FIXED: preset exam date `2026-11-21` (default for `store.exam`; drove the header countdown, the plan range and the date input value). Now there is no default: the countdown reads "Set your exam date under Study plan", the plan shows "Pick your exam date above to build a plan" and the date input is blank until the visitor chooses. The plan start date already defaulted to the visitor's current day (not personal). Fixed in source and built file; test asserts no `2026-11-21` and no `store.exam || 'date'`.
- Left as is (not personal): "outline of Oct 27, 2026" is Microsoft's skills outline date; fixed week labels in the unused `WEEKS[].when` template; KQL example dates `datetime(2026-11-01)` in sample queries.
- Everything stays in the visitor's browser localStorage; Backup/Restore is client-side (Blob download, FileReader, textarea paste).
- Fresh-load empty store: tested at source-default level only (literal initial store plus no seeded values, via regex); no browser to run a true fresh load.
- Tests added: no `theknoxtech`/`witherspoon` (case-insensitive), no email address, no `/Users/`, no preset exam date, initial store empty, hostile backup neutralised.

## Interface / front-end notes
- Main CSP has `font-src` unset beyond `default-src 'self'`, so fonts must come from `/fonts/`. Lab pages request `/fonts/IBMPlexSans-Regular.woff2`, `-SemiBold`, `IBMPlexMono-Regular`, `-Medium` (present in `public/fonts`, front-end provided).
- Front-end `labs[]` links must use `/exam_apps/md-102/` and `/exam_apps/md-102/kql-lab.html`.

## Deviations / not done
- Astro 7 upgrade not done (see audit). Audit criterion 9 not met.
- Workflow: placeholders fail the build only on push to main (build guard) plus a production-only grep step; phone/address grep runs on all builds and also scans lab pages (passes).
- Setup-guide steps could not be exercised (no GitHub/Azure).
- Action SHAs were used as given in the plan; I could not re-check the tags API (no web).

## Recon requests
1. Do tags `actions/checkout` v7.0.1 (3d3c42e5...), `actions/setup-node` v7.1.0 (949feb24...) and `Azure/static-web-apps-deploy` v1 (1a947af9...) still resolve to those SHAs?
2. Is Astro 7.4.12 acceptable (or is there an Astro 6.x release that clears the audit)? Which `astro` version first fixes the critical advisories in the 6.x line?
3. Where are the current `h.js`, `app.html`, `q22.js` for md-102?
