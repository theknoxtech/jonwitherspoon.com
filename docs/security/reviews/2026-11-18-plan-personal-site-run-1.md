# Security review run 1: plan/personal-site

| Field | Value |
|---|---|
| Date | 2026-11-18 |
| Branch | plan/personal-site |
| Commits reviewed | 647a42e (dev) .. b0f4b9a (HEAD), 33 commits: whole site, workflow, scripts, tests, docs |
| Plan | docs/plans/in-progress/2026-11-15-personal-site.md (security requirements = section 4), plus 2026-11-16-blog.md, 2026-11-17-theme-toggle.md, 2026-11-17-dev-site.md |
| Reviewer | Independent security reviewer agent (read-only); text recorded by the orchestrator |
| Exposure class | Public (Critical, High and Medium block the merge) |
| Test count | 224 pass, 1 todo (QC report 1) |
| Overall result | PASS for the Public rule. 0 Critical, 0 High, 0 Medium. 11 findings (4 Low, 7 Info), all logged for later. No blocking issue; the merge gate is clear on security grounds. |

## 1. What was implemented or changed before this run

- Astro 6.4.8 static site (Home, Portfolio, Projects, Labs, Articles, 404) driven by src/data/site.json.
- Browser scripts: public/theme.js, search.js and tabs.js. All three are external files; the pages have no inline script or style.
- A blog built from Markdown (content collection, with a build-time guard in src/lib/articles.js).
- Hosting config: public/staticwebapp.config.json, with security headers, a strict CSP, and a separate lab CSP on `/exam_apps*`.
- astro.config.mjs holds two build hooks: a placeholder guard and `lab-copy`, which copies only the top-level `.html` files of each exam_apps/<code>/ folder into dist.
- .github/workflows/deploy.yml has three jobs: production build/deploy, a dev-site job (`deploy_dev`, with its own token) and a close-preview job. Actions are pinned by SHA. .github/dependabot.yml targets `dev`.
- scripts/make-dev-config.mjs adds `X-Robots-Tag: noindex, nofollow` to the dev site's config.
- exam_apps/ (the MD-102 and KQL study apps) was moved in unchanged.
- Docs: setup guide, GitHub Actions guide, editing guide, plans, and the pipeline run record.
- 224 tests. CVE reports 1 and 2 were written. QC round 1 passed.

## 2. Findings

None of the findings below is Critical, High or Medium. Under the Public rule none blocks the merge. All 11 are LOGGED FOR LATER.

| ID | Severity | Where | What | Verified how | Disposition |
|---|---|---|---|---|---|
| SEC-001 | Low | exam_apps/md102-handoff.md:30 and throughout | The file will be public in the repo, though it is not deployed. It holds personal study notes. No credentials. | Read the file. `git grep "/Users/" HEAD` shows the path. Built a throwaway copy: lab-copy ships only index.html and kql-lab.html, so the file is not on the site. | Logged for later |
| SEC-002 | Info | docs/pipeline/2026-11-15-personal-site/build/backend-dev-1.md:43,50; backend-dev-2.md:22; fullstack-dev-2.md:44; qc-report-1.md:78-79 (and history) | Agent run records mention `/Users/jonwitherspoon` and other local paths as search terms or notes. Reveals the macOS account name and folder layout. No customer data, tokens or contact data. | `git grep` of HEAD and `git rev-list --all`. | Logged for later |
| SEC-003 | Low | docs/pipeline/.../cve/report-2.md; src/pages/articles/[slug].astro:2,36 (`astro:assets` Image); src/content.config.ts:15 (`cover: image()`) | The documented exception says "no image pipeline here". That is out of date: article covers and Markdown images now go through Astro/sharp at build time. The sharp/libheif advisory (GHSA-26w7-cxv4-gfx2) needs an untrusted AVIF. Only owner-committed images are processed, so the realistic risk is negligible, but the exception's wording is wrong. Astro 6.4.8, Vite 7.3.8 (above the 7.3.5 floor) and esbuild 0.27.7 confirmed in the lockfile. | Read report-2.md and the code. Checked package-lock.json versions. | Logged for later |
| SEC-004 | Low | src/lib/articles.js:25-47 (`findUnsafeMarkup`, `findImagesWithoutAlt`); Markdown allows raw HTML | The article build guard is a regex check with gaps. Verified in node: `<img src=https://evil.example/x.png alt="a">` (unquoted src), `<a href="javascript:...">` and `<iframe src="https://evil.example">` all pass with 0 problems. Only the owner writes articles, and the site CSP blocks the runtime effect of all of these. A hardening gap, not an exploitable hole. | Ran both functions on those strings in node. | Logged for later |
| SEC-005 | Low | src/data/site.json:180,187 | Two certification verify links use `http://verify.CompTIA.org`: a cleartext hop that depends on the destination redirecting. | grep of site.json; also in the built portfolio HTML. | Logged for later |
| SEC-006 | Info | .github/workflows/deploy.yml (PR job, dev job); public/staticwebapp.config.json | Pull request previews (on the production app) and the dev site are unauthenticated public URLs carrying `[TO SUPPLY ...]` placeholders and "[DRAFT: Jon to review]" text. Previews have no noindex header, because only `deploy_dev` runs make-dev-config.mjs. The setup guide already says previews are public. | Read the workflow and guides; built a copy. | Logged for later |
| SEC-007 | Info | exam_apps/md-102/index.html:5410 (preset exam date 2026-11-21); backup restore on the Progress tab; route `/exam_apps*` | Owner-known items, Info only. (a) Preset exam date. (b) JSON backup restore is not validated. (c) The lab pages need `'unsafe-inline'` scripts and share the origin of the main site. Mitigations are real: `connect-src 'none'`, `object-src 'none'`, `form-action 'none'`, `frame-ancestors 'none'`, and the main site stores nothing but `theme`. Apart from the exam date, no personal data found in the two built lab files. Live behaviour of the route-level CSP replacing the global header was not tested against Azure. | Read the app source, config and guide. | Logged for later (owner decides) |
| SEC-008 | Info | public/tabs.js:~33 (`decodeURIComponent(window.location.hash.slice(1))`) | A malformed hash such as `#%E0%A4%A` throws `URIError`; the tab bar shows but no panel is selected. Self-inflicted; no data or script impact. | `decodeURIComponent('%E0%A4%A')` throws in node (code read, not browser-tested). | Logged for later |
| SEC-009 | Info | public/staticwebapp.config.json (HSTS `includeSubDomains`); docs/setup-guide.md section 4a | `includeSubDomains` applies to every subdomain for a year. Fine today; a future HTTP-only subdomain would break. The guide does not warn that the `dev` CNAME must be removed if the dev Static Web App is deleted, or the name could be taken over. | Read config and guide. | Logged for later |
| SEC-010 | Info | .github/workflows/deploy.yml; .github/dependabot.yml; docs/setup-guide.md section 2 | Hardening notes. (a) `pull_request` runs only for PRs into `main`, so Dependabot PRs and PRs into `dev` get no CI. (b) `cancel-in-progress: true` on the production group can cancel a running deploy. (c) Deploy tokens are plain repository secrets, with no GitHub Environment or required reviewer. (d) The guide does not mention the fork pull request approval policy. `github-actions` Dependabot has no cooldown (npm has 7 days). | Read workflow and guides. | Logged for later |
| SEC-011 | Info | src/data/site.json (experience bullets) | The public portfolio names a client of a past employer (Georgia Cyber Academy) with fleet size, plus employer names and client sector counts. Normal resume content and the owner's decision; flagged because the repo and history go public. No private client data, ticket content or credentials. | Read site.json; `git grep` for client terms found only employer names used as test strings. | Logged for later (owner decides) |

### Plan section 4 "must" controls: confirmed built and tested

1. Token only as repo secrets. `AZURE_STATIC_WEB_APPS_API_TOKEN` is used only in the production deploy and close steps; `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` only in `deploy_dev`. No `.env*`, `swa-cli.config.json` or token strings in the tree or in `git rev-list --all`. `.gitignore` covers `.env`, `.env.*`, `.claude/`, `dist/`, `node_modules/`.
2. Workflow: top-level `permissions: contents: read`; `pull-requests: write` only on `build_and_deploy`; `deploy_dev` has `contents: read` only; no `id-token`; no `pull_request_target`. No `${{ github.event.* }}` in any `run:` step (the one `env:` value comes from `github.event_name`, a fixed value). Guards on `build_and_deploy` and `close_pull_request` require same-repo head and `github.actor != 'dependabot[bot]'`. On a push to `dev` neither production clause is true; `deploy_dev` runs only on a push to `dev` and uses only the dev token. Build and test run before deploy; the token is only an input of the deploy step.
3. SHA pins: checkout `3d3c42e…`, setup-node `949feb2…`, deploy action `1a947af9…`, in all three jobs. `persist-credentials: false` on both checkouts. `npm ci` only.
4. Supply chain: one dependency (`astro ^6.4.8`); lockfile v3, 329 packages, all with `integrity` and `resolved` on registry.npmjs.org, none from git or tarballs. Install scripts only for esbuild, sharp (optional), fsevents. Vite 7.3.8 above the floor. The three npm audit advisories in report-2.md are accepted per the documented exception (see SEC-003 for the stale premise).
5. Headers: HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options DENY and CSP in `globalHeaders`. A built copy has zero inline `<script>`, `<style>` or `style=` on the main pages (only the two lab files have inline script, as intended); `inlineStylesheets: 'never'`.
6. Lab route `/exam_apps*` is first and carries a full replacement CSP adding only fonts.googleapis.com (style) and fonts.gstatic.com (font). 404 uses `responseOverrides`; no `navigationFallback`. Config is 1024 bytes.
7. Only `dist/` deploys. In a throwaway build, `dist/exam_apps/md-102/` held just `index.html` and `kql-lab.html`; no `.md`, `.sh`, `.map`, `.DS_Store`, `source/` or `kql-source/`.
8. No phone, address or date of birth patterns in the built main pages. External links: GitHub, LinkedIn, Credly, Microsoft Learn, CompTIA (SEC-005). Built avatar.jpg has EXIF with one directory entry and no GPS. Fonts self-hosted.
9. Placeholder guard warns locally; `FAIL_ON_PLACEHOLDER=1` makes the production push build fail; an extra grep step on `dist/` is a second line of defence.

### Checked and found sound

- **Workflow and Dependabot.** No attacker-controlled text in any `run:`. `GITHUB_TOKEN` is passed as `repo_token` to the deploy action only. dependabot.yml: actions and npm, weekly, `target-branch: dev`, npm cooldown 7 days.
- **Static Web Apps config and dev config script.** Route order is right. The main CSP has no `unsafe-inline` or `unsafe-eval`, with `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `frame-ancestors 'none'`. make-dev-config.mjs reads and writes only `<dist>/staticwebapp.config.json`, is idempotent, and exits non-zero on bad JSON.
- **Browser code.** search.js builds results with `createElement` and `textContent` only (no `innerHTML`, `eval`, `document.write`); result URLs are filtered by `SAFE_URL = /^(\/(?!\/)|https:\/\/)/`; the `?tag=` value is only compared with button tags. theme.js accepts only `light` and `dark`, with every storage call in try/catch. tabs.js writes only `location.hash` and `aria` attributes (apart from SEC-008). `set:html` is used only with static `icons.*` strings. Every external link has `rel="noopener noreferrer"`; no `target="_blank"` on main pages. The astro.config.mjs hooks use fixed paths with no user input or traversal.
- **Public repo readiness.** 34 commits on all refs, one author identity, a GitHub `noreply` address. Pattern scans of the whole tree and all revisions found no AWS, GitHub, Slack or OpenAI-style keys, PEM blocks, JWTs, Azure connection strings or SAS tokens, no `.env` or key files tracked, no email address, and no phone number (only obviously fake numbers used as test data). Commit messages scanned for token/password/secret: nothing. docs/pipeline holds no personal or client data beyond SEC-002. Setup and Actions guides give sound advice.
- **Pre-existing issues.** exam_apps/ is owner-authored and is reported only in SEC-001 and SEC-007. No other pre-existing problem found.

### Not proven

- Azure's live handling of the `/exam_apps*` route header over the global header, HSTS, and dev-versus-preview environment behaviour were not tested (no network, no Azure). The guide's section 7 curl checks cover this once deployed.
- The reviewer did not re-run the 224-test suite; it relied on the QC report plus its own build and static checks.

## 3. Mitigation steps

The owner decides when to act on these; none is to be done now.

| ID | Fix | Test that will prove it |
|---|---|---|
| SEC-001 | Remove the personal parts from md102-handoff.md (or move the file outside the public repo), and drop the local path. Decide whether claude.ai artifact URLs may stay. | `git grep -n "/Users/\|claude.ai/artifact" HEAD` returns nothing; read the file once. History keeps old versions unless rewritten. |
| SEC-002 | Replace literal local paths in the pipeline docs with `<home>/...` placeholders, or accept as is. | `git grep -n "/Users/" HEAD` returns nothing. |
| SEC-003 | Rewrite the exception in report-2.md: sharp runs only on owner-committed images, so keep only PNG/JPEG covers; move to Astro 7 when ready. | A test (or doc check) that committed cover images are PNG/JPEG/WebP and not AVIF/HEIF. |
| SEC-004 | In `findUnsafeMarkup`, also reject `<iframe`, `<object`, `<embed`, `<form`, `<meta http-equiv`, `javascript:` URLs and unquoted or single-quoted image `src`. | New cases in tests/blog.test.mjs for each string in the finding that expect a build error. |
| SEC-005 | Change both URLs to `https://verify.comptia.org` (check it works first). | grep: no `http://` in site.json; a test that all `verifyUrl` values start with `https://`. |
| SEC-006 | Optional: add a noindex header and a visible "preview" notice to PR previews, or protect the dev site with Azure auth. | curl -sI on a preview shows `x-robots-tag`. |
| SEC-007 | Owner's decision: validate the restored backup (shape and types) in the app, and decide on the preset date. | A test restoring a hostile JSON backup shows nothing injected. |
| SEC-008 | Wrap the `decodeURIComponent` in try/catch and fall back to the first tab. | Test the hash `#%E0%A4%A` and expect tab 1 selected, no error. |
| SEC-009 | Add a note to the setup guide to remove the `dev` CNAME before deleting the dev Static Web App. Re-evaluate `includeSubDomains` when adding subdomains. | Guide text check; `curl -sI` after any new subdomain. |
| SEC-010 | Optionally add `pull_request` coverage for `dev`, a deploy Environment with a reviewer, `cancel-in-progress: false` for production, a fork-approval step in the guide, and a Dependabot cooldown for actions. | Workflow tests in tests/infra.test.mjs asserting the chosen settings. |
| SEC-011 | Owner confirms the client name and figures may be published; otherwise generalise the wording. | Read the built portfolio page. |
