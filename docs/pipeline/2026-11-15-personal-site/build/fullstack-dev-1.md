Untrusted content: none

# Full-stack dev 1: hardening sweep

## Changed
- `tests/qc-static.test.mjs`: two plan-path edits (below).
- `docs/plans/in-progress/2026-11-15-personal-site.md`: stale statements fixed, changed criteria marked "(Updated 2026-11-17)". Decisions, security requirements (section 4), SHAs, CSP strings, section 8 untouched.
  - Summary: pages (Portfolio, Articles, search); "no JavaScript, no theme toggle" now three script files + toggle; footer link to old site removed; www forwarding now a Cloudflare redirect rule.
  - Section 3: pages list and nav; Home (hero, profile card 80px, articles, featured projects, Study labs strip; "Now" block removed); Portfolio (tabbed); four projects; Labs (buttons, search, SC-300/AZ-104 planned); Look (indigo/cyan/violet, gradients, rounded cards, shadows, per Jon's review); footer; JS-off wording.
  - Section 5: domains (apex only in Azure, TXT, DNS only; www proxied placeholder with 301), post-deploy `/work/` to `/portfolio/` and www check, guide contents list. Section 5 checklist items kept; the setup-guide test only reads the guide.
  - Section 6: front-end file list. Section 7: criteria 1, 2, 3 (seven certs), 4 (four projects), 5 (only the three `<script src>` files), 12 (toggle). Section 9: Budgetry note.
- `docs/setup-guide.md`: removed one stray double blank line only.

## Test edits (before / after)
1. Line 548 (workflow SHA test): `read('docs/plans/proposed/2026-11-15-personal-site.md')` -> `read('docs/plans/in-progress/2026-11-15-personal-site.md')`
2. Line 693 (long opaque strings test): same change.

## Ambiguous, not edited
- Summary "Code-size target" (250 lines .astro, 150 CSS, "20 lines JS (build guard)") is far below actual size (CSS ~1100+ lines, 3 public JS files). Target or history?
- Section 9 questions 1 to 3 and the "Hardening items already known" paragraph are review-time history. Left as is.
- Section 3 "Look" rewrite is a design wording change driven by Jon's review; check you agree with the wording.
- Plan status line and decision "no JavaScript" in section 8: no entry there, so none edited.

## Setup guide vs plan and workflow
Matches: secret name `AZURE_STATIC_WEB_APPS_API_TOKEN`; branches `main`/`dev`; Dependabot targets `dev`; section cross-references (section 7 checks, section 10 add a lab); route `/exam_apps*`; `/portfolio/` checks; apex-only Azure domain. No section-number mismatch.
Judgement calls (not changed):
- Section 1 pushes `main` before the secret exists (section 4). The first push to `main` triggers the workflow, which will fail (no token, and `[TO SUPPLY]` still in site.json). Suggest a note, or push `dev` first / add the secret before pushing `main`.
- Guide section 5 says previews come from a `dev` to `main` PR: correct. Guide does not say production fails now because placeholders remain; it does say fill them first.
- Untracked `docs/github-actions-guide.md` exists; not mine, not reviewed.

## GitHub Actions gaps (report only)
- Workflow never runs `npm test` (tests need a prior build; add after build).
- Triggers only `main` push and PRs to `main`: no CI on `dev` pushes or on Dependabot PRs targeting `dev`.
- Production build fails while `[TO SUPPLY]` placeholders remain (by design); content from Jon still outstanding (Critical Network Solutions details, project repo URLs).
- Secret must exist before first push to `main`; the first deploy needs the Azure app created first.
- `npm ci` runs install scripts (no `--ignore-scripts`; listed as optional hardening).
- Node comes from `.node-version` (22); package `engines >=22.12`: ok, but `22` is not guaranteed >= 22.12 in theory (fine in practice).
- `concurrency` with `cancel-in-progress` could cancel a production deploy mid-run if two pushes land on `main` close together.
- No artifact upload of `dist/` for debugging; no `npm audit` step (intended until Astro 7).
- Tests that run `git ls-files` need a git checkout (`actions/checkout` provides it).

## Results
`ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`: 167 tests. Build always exit 0. Over 9 runs, 6 had 167/167 pass. Three runs each had one different failure, always in the throwaway-build tests in `tests/qc-build-edge.test.mjs`, all passing on the next run:
- "QC edge: a lab folder with no index.html builds, copies no notes or scripts, and publishes only an empty folder"
- "QC edge: a lab folder copies only its top-level .html files (not .md, .sh, .js, sub-folders, dotfiles)"
- "QC edge site.json: lab with an empty links list still builds"
Three consecutive all-pass runs (167/167 each) occurred in the second batch of three runs only partly: the batches were pass/pass/pass, pass/fail/pass, pass/pass/fail. Every failure passed on immediate rerun. Cause not investigated (likely throwaway builds interfering in parallel); not fixed.
