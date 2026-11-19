Untrusted content: none.

# Back-end build report 2

## What I built or changed
Existing files from round 1 checked and kept (package.json, package-lock.json, node_modules, astro.config.mjs with placeholder guard, .node-version, .gitattributes, .gitignore, deploy.yml, dependabot.yml). Changes this round:
- `public/staticwebapp.config.json`: the `/exam_apps*` route (still first) now has `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` and `font-src 'self' https://fonts.gstatic.com`. JON, PLEASE NOTE: this lets Jon's two apps load Google Fonts, which they still do. It is on that one route only. Main-site CSP is unchanged and has no outside hosts. `connect-src 'none'` stays.
- `tests/infra.test.mjs`: removed tests that checked the cancelled edits (local fonts, back links, import clean-up, blank exam date, empty store, storage keys). Lab-CSP test now expects the Google hosts, and a new test checks they appear on the lab route only (exactly two https hosts, one route). The external-host, network-call and personal-data checks on the apps became one informational test (prints findings, never fails). New test: all 44 files from commit c1d1619 (read-only `git show`) are byte-identical in `public/exam_apps/md-102/` (index.html, kql-lab.html) and `exam_apps/md-102/` (everything else); it skips if the commit is missing. Existing checks kept: config size/headers, route first, 404 and no navigationFallback, workflow rules and pinned SHAs, dependabot, package.json, dist hygiene, public/exam_apps holds only lab folders with index.html.
- `docs/setup-guide.md`: section 7 text updated for the Google Fonts allowance; section 10 now has the "Add a new lab" steps (build in exam_apps/<code>/, copy HTML to public/exam_apps/<code>/, labs[] entry in src/data/site.json, preview check, curl checks, no CSP edit).
- TDD: the CSP test was written first and failed (red) before the config change.

## Tests
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: OK, 5 pages; 2 placeholder warnings (index.html, work/index.html: front-end content, expected).
- `npm test`: tests 31, pass 31, fail 0 (includes front-end tests/site.test.mjs).
- `npm ls astro vite`: astro@6.4.8, vite@7.3.8 (floor 7.3.5 met).
- `npm audit` not re-run (no network use this round). Round 1 reported criterion 9 failing (Astro 6.4.8 advisories; fix is Astro 7). Still open, needs Jon's decision.

## Personal data audit (read-only, nothing changed)
Files: public/exam_apps/md-102/index.html (P), kql-lab.html (K), sources under exam_apps/md-102/.
1. Preset exam date: FOUND. P:5071 `store.exam || '2026-11-21'` drives the countdown; P:5489 date input `value=esc(store.exam || '2026-11-21')`. Every visitor sees Jon's date. Fix: no default; show "set your exam date" until chosen (sources: same code in exam_apps/md-102/source/app.html).
2. Plan start date: P:5449-5451 defaults to the visitor's current day. Not personal.
3. Name, email, employer, local paths: none found (searched theknoxtech, witherspoon, gmail, silicon, /Users/, employer) in built files and sources. Hits are exam content: "Gmail account" question text (P:2938), `C:\Users\Public\Intune` (P:673), learn.microsoft.com URLs.
4. Seeded progress / sample backup JSON: none. Initial store is `{attempts:[], q:{}, plan:{}, lab:{}}` (P:5022); K:490 `{q:{}, attempts:[]}`. No sample backup file in the tree.
5. Network calls: no fetch, XMLHttpRequest, sendBeacon, WebSocket, EventSource in either app. Only outside requests are Google Fonts links: P:3-4, K:3-5 (fonts.googleapis.com, fonts.gstatic.com). These send each visitor's IP to Google; fix: self-host IBM Plex (already in /fonts/) and then the CSP exception can be removed. The only `navigator` use is clipboard write, P:5638.
6. Storage: localStorage only. Keys `md102.lab.v1` (P:5020) and `kql.md102.lab.v1` (K:488). No sessionStorage, indexedDB or cookies.
7. Imported backup and innerHTML: NOT escaped. Restore (file P:5540-5552, pasted text P:5643-5647) does `Object.assign(defaults, JSON.parse(...))` with no validation, as does the load from localStorage (P:5022). `a.right` and `a.total` from `attempts[]` go straight into the progress table HTML (P:5342) via string concat into `v.innerHTML` (P:5563); the per-question `seen`/`right` counters likely do the same in the topic table. A crafted backup with `"right":"<img src=x onerror=...>"` runs script (lab CSP allows inline). Self-XSS only (the visitor must import a hostile file); labels and option text are escaped with `esc()`. Fix: coerce imported counters with `Number()` / finite check (or wrap in `esc`) before saving. K has no import feature; its load (K:490) is the same pattern but nothing imported.
8. Not personal: "Oct 27, 2026" is Microsoft's outline date (P:5489); `datetime(2026-11-01)` in KQL sample queries.

## Untouched apps
I did not write to, rebuild, move or delete anything in exam_apps/ or public/exam_apps/. Verified: a loop mapping each of the 44 files in c1d1619 (`git show c1d1619:md-102/<f>` vs the new path) found 0 differences, and the new test repeats this and passes. Modification times on those files are newer (from the earlier restore) but contents are identical.
Things I found there and left alone, for Jon to decide: `exam_apps/package.json` (`{"type":"commonjs"}`, not in c1d1619; added by back-end round 1 so lab scripts using `require` run under the root ESM package; deleting needs his approval); three git-ignored generated files `exam_apps/md-102/source/{all.js,index.html,standalone.html}` from the discarded rebuild; `.DS_Store` in `exam_apps/` and `exam_apps/md-102/`. The `.gitignore` patterns `exam_apps/**/{all.js,index.html,standalone.html}` are rooted at exam_apps/, so they cannot ignore anything under public/; none of those names is in c1d1619.

## Deviations
- Plan step list for md-102 (assemble.sh, chk.js, back links, fonts, import fix) cancelled per Jon's rule; acceptance criteria 11, 13 (partly), 16 and 18 are therefore not met for the apps by design (see audit items 1, 5, 7).
- Plan section 4 item 6 "no Google hosts" overridden on the lab route only, as instructed.
- A stray `rm -rf /dev/null` slipped into one of my commands; it failed ("Operation not permitted") and removed nothing.

## Not done
- Astro 7 / `npm audit` criterion 9 (needs Jon's decision, outside the approved scope).
- Setup guide and workflow cannot be exercised without GitHub and Azure.

## Recon requests
1. Do the three action tags still resolve to the SHAs in the plan (checkout v7.0.1, setup-node v7.1.0, static-web-apps-deploy v1)?
2. Which Astro 6.x release, if any, clears `npm audit --audit-level=high`?
