# Round 2: security specialist

Untrusted content: none (read council proposals, recon and CVE files as information only; none contained instructions).

## UX specialist
- Agree: no client JavaScript, JS-off works, avatar saved in the repo. Allows the strictest CSP.
- Agree: "<- Labs" link in md-102 `app.html`. When rebuilt, point the fonts at `/fonts/`.
- Object (Low): `[TO SUPPLY]` placeholders only warn; risk is drafts going public. Fix: production build fails if placeholders remain; preview builds only warn.
- Improve (Medium): Budgetry is personal finance. Jon checks screenshots and text for real financial data before publishing.
- Fonts, decided: self-host IBM Plex as committed latin-subset `.woff2` under `public/fonts/` (OFL, no npm package). Keeps Google out of the CSP and visitor IPs away from Google.

## Ops specialist
- Agree: Astro only dependency, `apps/` outside `public/`, private repo, `skip_app_build: true` with our own `npm ci` and build steps (replaces my round-1 `skip_app_build: false`).
- Object (Low): `pull-requests: write` at the top of the workflow. Fix: top-level `contents: read`; `pull-requests: write` on the deploy job only.
- Object (Medium): `astro ^6` can lock in a version with known flaws. Fix: `"astro": "^6.4.8"`, and the lockfile must resolve Vite to 7.3.5 or later (or 8.0.16 or later).
- Improve: SWA cannot redirect www to apex itself; setup guide must say how (registrar forwarding).

## Revised proposal (changes only)

**1. Workflow (must; threat: stolen token, hijacked action)**
- `contents: read` at top. Not `id-token: write`. No github-script step.
- Steps in order: (1) checkout with `persist-credentials: false`; (2) setup-node with `node-version-file: .node-version`; (3) `npm ci`; (4) `npm run build`; (5) placeholder and personal-info grep on `dist/`; (6) deploy with `app_location: dist`, `output_location: ''`, `skip_app_build: true`; (7) a close job (`action: close`) when the PR closes.
- Deploy and close jobs run only if `github.event.pull_request.head.repo.full_name == github.repository` (no fork PRs) and the actor is not `dependabot[bot]`. Dependabot PRs build but do not deploy.
- Token stays a repository secret. Drop round-1 `production` environment (PR previews need the token too).
- should: try `npm ci --ignore-scripts`; drop only if the build breaks.

**2. Pinned actions (must; threat: tag hijack)**
- `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`
- `actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0`
- `Azure/static-web-apps-deploy@1a947af9992250f3bc2e68ad0754c0b0c11566c9 # v1`
- Re-check each SHA against the tags API when building.
- Dependabot: `.github/dependabot.yml` with `github-actions` and `npm`, weekly, `target-branch: dev`. Never swap a SHA back to a tag. Merge only after CI passes. should: `cooldown` 7 days for npm.

**3. Headers and CSP (must; threats: clickjacking, injected script)**
- Main site: no meta CSP from Astro `security.csp`. Use `build.inlineStylesheets: 'never'`, no inline scripts, one header CSP. Reasons: header can carry `frame-ancestors`; curl can check a header; meta plus header are both enforced and cause surprise blocks.
- `globalHeaders`:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (no `preload`)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-Frame-Options: DENY`
  - CSP: `default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`
- Lab apps: one route per exam, `/md-102/*` now and `/sc-300/*` later, added in the same commit as the app folder. Fails safe: a forgotten route leaves the app under the strict CSP (visibly breaks, nothing quietly loosened). A route CSP replaces the global CSP, so the lab CSP restates everything: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`. Add Google font hosts only if md-102 still loads Google Fonts.
- should: a QC script fails if a `public/<folder>/index.html` has no matching route.

**4. PR previews (acceptable):** public, but PR content is going public anyway. Previews only from same-repo PRs, and the step-5 grep runs before every deploy.

## Tests (added)
- `dist/` main pages contain no `<script`, `<style` or `style=`.
- `npm ls vite` meets the version floor; `npm audit --omit=dev --audit-level=high` passes.
- After deploy, Jon runs `curl -sI` on production and preview hosts for: `/`, `/work/`, `/md-102/`, `/md-102/kql-lab.html`, `/nope` (404), and `http://` on apex and www.
- Confirm: every security header present; main CSP has no `unsafe-inline`; lab CSP on lab paths; the 404 also carries headers (undocumented); HTTP redirects to HTTPS.
- No CSP errors in browser console for either cert app. If md-102 frames kql-lab, change lab CSP to `frame-ancestors 'self'`.

## Setup-guide checkboxes for Jon
GitHub:
- [ ] Repo private; 2FA on the account.
- [ ] Ruleset on `main`: PR required, build check required, no force push or deletion.
- [ ] Actions: default workflow token read-only; "allow Actions to create/approve PRs" off; allowed actions limited to GitHub-made and `Azure/static-web-apps-deploy`; "require full-length SHA" if offered.
- [ ] Secret `AZURE_STATIC_WEB_APPS_API_TOKEN` (repository secret).
- [ ] Dependabot alerts and security updates on. Secret scanning and push protection on, if offered for private repos.

Azure:
- [ ] Account MFA.
- [ ] Dedicated resource group; SWA Free plan, source "Other".
- [ ] Paste the token only into GitHub. If ever exposed: "Manage deployment token" -> Reset, then update the secret.
