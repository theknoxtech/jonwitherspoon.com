# Security findings logged for later

These findings do not block a merge under this project's exposure class (Public: Critical, High and Medium block). Jon reviews this file when convenient and decides per issue. Nothing here is fixed during a run unless Jon asks. Status for every entry: Logged for later. Source: [run 1](reviews/2026-11-18-plan-personal-site-run-1.md).

## Critical

None.

## High

None.

## Medium

None.

## Low

- **SEC-001** (2026-11-18). Where: `exam_apps/md102-handoff.md`. Flagged because the repo and its full history go public, and the file holds personal study notes. No secret. Not deployed to the site. No CVE (privacy hygiene). Resolved before the first public push: the file was removed from the history (rewritten 2026-11-18).
- **SEC-003** (2026-11-18). Where: `docs/pipeline/2026-11-15-personal-site/cve/report-2.md`; `src/pages/articles/[slug].astro`; `src/content.config.ts`. Flagged because the documented exception's premise ("no image pipeline") is stale. Related advisory: [GHSA-26w7-cxv4-gfx2](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2) (libheif AVIF heap overflow via sharp). Risk is negligible, since only owner-committed images are processed. Suggested fix: restate the exception, use only PNG/JPEG covers, upgrade to Astro 7.x as planned.
- **SEC-004** (2026-11-18). Where: `src/lib/articles.js`. Flagged because the regex guard lets through `<img src=https://...>` (unquoted), `<a href="javascript:...">` and `<iframe>`. The site CSP blocks the runtime effect and only the owner writes articles, so this only hardens against an unlikely threat. Suggested fix: extend the checks and add tests.
- **SEC-005** (2026-11-18). Where: `src/data/site.json:180,187`. Flagged because `http://` links send visitors over cleartext first. Suggested fix: use https URLs and add a test.

## Info

- **SEC-002** (2026-11-18). Where: `docs/pipeline` build notes. Flagged because absolute local paths reveal the Mac account name. Suggested fix: replace with placeholders.
- **SEC-006** (2026-11-18). Where: `deploy.yml` and the dev site. Flagged because previews and dev are public with placeholder text, and previews lack noindex; the guide already notes previews are public. Suggested fix: noindex for previews, or Azure auth on the dev site.
- **SEC-007** (2026-11-18). Where: `exam_apps/md-102`. Owner-known: preset exam date 2026-11-21, unvalidated backup restore, `'unsafe-inline'` scripts on a shared origin with strong limits (`connect-src 'none'`). Suggested fix: validate restored JSON; decide on the date. Jon decides (handled in the exam apps chat).
- **SEC-008** (2026-11-18). Where: `public/tabs.js`. Flagged because a malformed `#%` hash throws an error and leaves all panels stacked. Cosmetic and self-inflicted. Suggested fix: try/catch around the decode.
- **SEC-009** (2026-11-18). Where: HSTS `includeSubDomains`; setup guide section 4a. Flagged for possible future subdomain breakage and a dangling-CNAME takeover risk if the dev Static Web App is deleted. Suggested fix: add a guide note.
- **SEC-010** (2026-11-18). Where: workflow and Dependabot config. Flagged as CI hardening: no checks on PRs to `dev`, `cancel-in-progress` on production, repo-level secrets, no fork-approval advice. Suggested fix: see run file section 3.
- **SEC-011** (2026-11-18). Where: `src/data/site.json`. Flagged because a client name and fleet size appear on a public page. Normal resume content; Jon decides.
