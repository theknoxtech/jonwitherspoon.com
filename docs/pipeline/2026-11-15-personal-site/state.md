# Pipeline run state

Re-read at the start of every stage; update at the end of every stage.

| Field | Value |
|---|---|
| Request | New jonwitherspoon.com Astro site: career pages moved from old site, GitHub avatar, current role, projects, hosts cert apps (md-102 first), Azure SWA + GitHub Actions |
| Size | Normal (multi-file new site; not Large because it does not handle secrets or many systems) |
| Exposure | Public (internet-facing personal site) |
| Stage | 2 Plan done; stopped at safety check before 3 Prototype |
| Design round | 2 |
| Prompt 1 (prototype review) | Not yet |
| Plan | `docs/plans/proposed/2026-11-15-personal-site.md` (written, advisor consulted) |
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

## Log

- 2026-11-15: an orchestrator restore command emptied 44 md-102 files (PATH lost, shell truncated targets). All restored from c1d1619 and verified identical (0 differing, 0 empty). Backend dev had rebuilt md-102 without Jon asking; that work was discarded and the dev stopped.

- 2026-11-15: 1 Design: round 1 and 2 done, Recon 01 and 02, CVE report saved. 2 Plan: written, advisor consulted, plan fixed (route pattern, 404, fonts, repo visibility).
- 2026-11-15: 0 Size: project CLAUDE.md created from template and Project Context filled; repo initialized; run branch cut.
