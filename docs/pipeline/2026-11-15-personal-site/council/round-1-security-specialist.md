# Round 1: security specialist

Untrusted content: none (read the old site's workflow, config and _headers, plus md-102/index.html and kql-lab.html; none contain instructions aimed at agents).

## 1. What could go wrong
1. Azure deploy token leaks or a workflow is hijacked; site replaced with phishing or defacement. The only route to real harm.
2. Supply chain: compromised npm package or moved action tag runs in CI while the token is available. The old workflow runs an unpinned `npm install @actions/core @actions/http-client`.
3. Unpublished files go live: `md-102/source/`, `kql-source/`, `HOW-THESE-APPS-ARE-BUILT.md`, `.DS_Store`.
4. Private info exposed: phone, home address, personal email in pages or commits.
5. XSS in cert apps: md-102 writes to `innerHTML` at lines 4964-4971 and has a progress export field (`#exp`). If it can import progress, a crafted import could inject script.
6. Clickjacking or framing of the site's pages.

## 2. Controls
- must (1): token only as a GitHub Actions secret, scoped to a `production` environment; rotate in Azure portal if exposed. Ask Recon whether OIDC or managed identity can replace it.
- must (1, 2): `permissions: contents: read` at top of workflow. Drop `id-token: write` and the github-script id-token step unless SWA auth needs them.
- must (2): commit `package-lock.json`, install with `npm ci`. Dependencies: Astro plus at most a couple of packages.
- must (1): never `pull_request_target`. Plain `pull_request`, so fork PRs get no secrets.
- should (2): pin third-party actions by full commit SHA with a version comment. Dependabot for actions and npm.
- must (3): deploy only Astro `dist/`: `app_location` "/", `output_location` "dist", `skip_app_build` false. Cert apps in `public/md-102/` with only `index.html` and `kql-lab.html`. Source folders outside `public/`.
- must (6, 5): `staticwebapp.config.json` `globalHeaders`:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-Frame-Options: DENY`
  - main-site CSP: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`
  - if Astro inlines scripts or styles, use hashes or `build.inlineStylesheets: 'never'`, not `'unsafe-inline'`.
- must (5): `/md-102/*` route header with looser CSP: `script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'none'`, plus same frame, base, object rules. Do not loosen the main site to suit the apps.
- should (5): check whether progress import feeds `innerHTML`; if so validate fields or use `textContent`.
- must (4): contact as a link to GitHub or LinkedIn, or a role-based email. No phone, street address, date of birth.
- should (4): self-host a downloaded avatar and strip EXIF.
- should: `rel="noopener noreferrer"` on every `target="_blank"` link.
- should (1, 4): branch protection on `main` (PR required, no force push); secret scanning and push protection; Dependabot alerts.
- could: self-host IBM Plex fonts to drop Google from CSP.

## 3. Must not do
- No `'unsafe-inline'` or `'unsafe-eval'` in the main-site CSP. No CDN script hosts.
- No `pull_request_target`, no `${{ github.event.* }}` inside `run:` steps, no unpinned `npm install` in CI.
- Never commit `.env*`, the deploy token, `swa-cli.config.json` with a token, or `.DS_Store`.
- No `X-XSS-Protection` header (deprecated); do not copy from old site.

## 4. Tests that prove it
- `curl -I` on `/`, `/md-102/` and a 404: main CSP has no `unsafe-inline`.
- No CSP errors in browser console on all main pages and both cert apps.
- `dist/` contains no `source/`, `kql-source/`, `.md` or `.DS_Store`.
- grep of `dist/` finds no phone or address patterns.
- Workflow has `permissions:`, no `pull_request_target`, actions pinned by SHA.
- `npm audit --omit=dev` shows no high findings.

## 5. Assumptions
- PR preview environments are public URLs; keep them (content not sensitive) or set SWA preview limit to 0.
- No analytics (keeps CSP clean).
- Contact via GitHub or LinkedIn links only.

## 6. Recon requests
- Current `Azure/static-web-apps-deploy` version and commit SHA; does it still need `azure_static_web_apps_api_token`, or is OIDC/managed identity deploy supported?
- SWA: do route-level `headers` override `globalHeaders` for the same header name (per-path CSP)?
- Astro (current version): does static output inline scripts/styles; is the CSP hash feature (`csp` config) stable?
- Does SWA apply `globalHeaders` to `404.html` and redirect responses?
- CVE: current Astro and Vite advisories that affect static builds.
