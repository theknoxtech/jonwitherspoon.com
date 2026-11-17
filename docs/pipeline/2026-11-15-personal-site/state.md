# Pipeline run state

Re-read at the start of every stage; update at the end of every stage.

| Field | Value |
|---|---|
| Request | New jonwitherspoon.com Astro site: career pages moved from old site, GitHub avatar, current role, projects, hosts cert apps (md-102 first), Azure SWA + GitHub Actions |
| Size | Normal (multi-file new site; not Large because it does not handle secrets or many systems) |
| Exposure | Public (internet-facing personal site) |
| Stage | 5 Harden (prototype approved by Jon 2026-11-17; blog, tag colours, theme toggle and footer changes included) |
| Design round | 2 |
| Prompt 1 (prototype review) | APPROVED 2026-11-17 |
| Plan | `docs/plans/in-progress/2026-11-15-personal-site.md` (moved to in-progress 2026-11-17, prototype approved for hardening) |
| Branch | `plan/personal-site` (cut from `dev`) |
| Work split | Front-end: src/pages, layouts, styles, site.json, avatar, fonts. Back-end: package/config/workflow/headers/md-102 move/setup guide |
| QC failed rounds | 0 of 3 |
| Security review | Not yet |
| Logged for later | 0 (Critical 0, High 0, Medium 0, Low 0, Info 0) |
| Waiting on Jon for | Safety stop: OK for local npm install (Astro) and network downloads (avatar, IBM Plex fonts) |

## Decided for Jon

- Framework: Astro, static output (Jon prefers Astro; old site already uses it; fits Azure Static Web Apps).
- Repo: `git init`, `main` + `dev` created, run branch `plan/personal-site` (Jon said yes).
- Old site read-only access granted by Jon (career content in `src/pages/portfolio/index.astro`, project notes, deploy workflow).
- Blog, KB, codebase, resources, legal pages are NOT moved (Jon's request).
- Size Normal: 3 specialists on Opus, 2 rounds.

- Canonical domain: apex; per-exam lab CSP routes (`/md-102*`); cards not project pages; fonts self-hosted; no JS; production deploy fails while placeholders remain.
- md-102 committed unchanged as its own commit so `git mv` works.
- Rewritten About text is a draft for Jon's review.

- Jon (mid-build): all exam labs go in one folder `exam_apps`, one subfolder per app. Decided: sources in repo-root `exam_apps/<code>/` (not deployed), built output in `public/exam_apps/<code>/`, so MD-102 URL becomes `/exam_apps/md-102/` (not yet published, no saved progress moves). Because every lab sits under one prefix, a single CSP route `/exam_apps*` replaces per-exam routes (the fail-safe-per-exam idea from the council is dropped; a test checks the folder only holds lab folders). Developers were told by message; plan text in section 4 item 6 partly updated, sections 3, 5, 6, 7 still name `/md-102/` and `apps/` and need a sweep before the review.

- HARD RULE from Jon (2026-11-15): do not change his apps unless he says so. The md-102 and KQL apps are NOT rebuilt, edited, or given back links or font changes. They are only moved (his request: everything under `exam_apps/`). The plan's back-link, font swap, import-path fix, and personal-data fix steps are cancelled; the personal-data audit becomes a read-only report to Jon. Verify at the end that the files are byte-identical to commit c1d1619.

- Astro: stay on 6.4.8 with a written exception (CVE follow-up, `cve/report-2.md`: audit findings do not apply to a static build, fixes only in Astro 7); plan the Astro 7 upgrade on its own branch later. `npm audit` is not a CI gate until then.
- Test command for Jon: `npm run build && npm run preview` (the `lab-copy` step runs only at build, so the dev server does not serve the labs).

- Jon's feedback overrides earlier choices: rounded cards, more colour, coloured buttons, modern look similar to the old site but not overkill, contrasting with the lab pages (fonts stay IBM Plex); Budgetry removed; search for projects and labs. The earlier decision "no JavaScript on the site" is reversed for search only: one small external script file, no inline script, content fully visible without JS.

## RESUME NOTE (written 2026-11-16 before Jon restarted the chat to update the plugin)

- Branch `plan/personal-site`, last commit 612aba4. Stage 3 (prototype revision 3). Prompt 1 (prototype review) is still open: Jon keeps sending change requests; he has not approved hardening yet.
- UNCOMMITTED and UNVERIFIED work in the tree (a front-end developer was mid-way): batch 5 from Jon's latest feedback: hero buttons "View projects" + "Portfolio" in one row; Systems Engineer II title; plain text links on Home project cards; every GitHub link labelled "See it on GitHub" (Winnow also "Latest release"); buttons on /projects/; Study labs strip buttons that are the links, planned labs as non-link pills; /labs/ KQL Lab as a button; new planned lab AZ-104; MD-102 `currentFor` = "Current for the October 2026 exam update" (Recon 04: study guide says skills measured as of October 27, 2026); data restructured so every button is an entry in a `links` list; docs/editing-guide.md (plain-language editing documentation) was requested. Also docs/setup-guide.md was rewritten for Cloudflare DNS (apex only in Azure, DNS only grey cloud, proxied placeholder www with a redirect rule). To resume: run `ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test` three times, read `build/frontend-dev-5.md` if it exists, check the editing guide exists, then commit and show Jon.
- Jon's answers so far for the prototype review: registrar = Cloudflare (answered). Still open: approve/change/stop; his app's preset exam date (2026-11-21) and unvalidated backup restore (he decides); GitHub repo name and visibility (recommended `jonwitherspoon.com`, public); blog build (not authorized yet; Home has an empty Articles section driven by `articles` in site.json).
- Open content from Jon: Critical Network Solutions start month, location, bullets, technologies (title is Systems Engineer II); repo URLs for Teams, OneDrive and other projects that only link to his GitHub profile; draft About text review.
- HARD RULES: never modify, rebuild or edit anything under `exam_apps/`; "move" means move or copy only; commit his app edits when he asks (he asks each time); do not run fix scripts against his files.

## Log

- 2026-11-16: Jon approved the blog plan `docs/plans/in-progress/2026-11-16-blog.md` (nav "Articles", inline images and optional banner image in v1). Build runs on this branch as prototype revision 4. Prototype approval for hardening is still NOT given.

- 2026-11-16: resumed. Uncommitted batch 5 built and tested 3 times: 130 of 130 pass, no failures. Added docs/editing-guide.md, fixed setup-guide section 10 (links list) and the "Work" page name. exam_apps/ verified identical to 612aba4 (read-only check). Prompt 1 still open.

- 2026-11-15: an orchestrator restore command emptied 44 md-102 files (PATH lost, shell truncated targets). All restored from c1d1619 and verified identical (0 differing, 0 empty). Backend dev had rebuilt md-102 without Jon asking; that work was discarded and the dev stopped.

- 2026-11-15: 1 Design: round 1 and 2 done, Recon 01 and 02, CVE report saved. 2 Plan: written, advisor consulted, plan fixed (route pattern, 404, fonts, repo visibility).
- 2026-11-15: 0 Size: project CLAUDE.md created from template and Project Context filled; repo initialized; run branch cut.

- 2026-11-16 rule change (Jon, "relax it"): developers may update existing tests broken by an approved plan change, to match the new behavior only, and list each in their report. Other failing tests, and security scans or reviews, still stop and ask Jon.

- 2026-11-16: blog build (frontend-dev-6) done: 142 of 142 tests, 3 clean runs by orchestrator. Two existing tests updated per the relaxed rule (footer nav 3 to 4; articles section). Dev ran git stash and pop by mistake (restored cleanly). exam_apps/md-102/index.html and source/q28.js show uncommitted wording edits (written 19:37, not by the build; they were clean earlier) -- NOT committed, NOT touched; Jon asked whether they are his. Dev reported 3 of 8 early full runs had one random test failure; not reproduced in 6 later runs. QC (prototype scope) not yet run on the blog.

- 2026-11-17 Decided by Jon: repo `jonwitherspoon.com`, PUBLIC (not yet created or pushed; creating and pushing still needs his go-ahead after the security review). MD-102 app issues: Jon handles in another chat. Theme button wording: open.
