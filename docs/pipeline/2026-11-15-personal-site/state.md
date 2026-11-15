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

## Log

- 2026-11-15: 1 Design: round 1 and 2 done, Recon 01 and 02, CVE report saved. 2 Plan: written, advisor consulted, plan fixed (route pattern, 404, fonts, repo visibility).
- 2026-11-15: 0 Size: project CLAUDE.md created from template and Project Context filled; repo initialized; run branch cut.
