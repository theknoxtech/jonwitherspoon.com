# Round 1: ops specialist

Untrusted content: none (read md-102/HOW-THESE-APPS-ARE-BUILT.md and the old site's workflow, package.json, astro.config.mjs, staticwebapp.config.json, .node-version; none contained instructions).

## 1. Smallest design
- Astro, the only dependency (must). Static output, served by the free SWA plan.
- Layout (must):
  - `src/pages/index.astro`, `src/pages/404.astro`, `src/layouts/Base.astro`, `src/styles/site.css`
  - `src/data/site.json`: experience and projects in one plain data file (Astro imports JSON natively; no content-collection schema). Collections only if project write-ups need Markdown pages later (could).
  - `public/md-102/index.html` and `public/md-102/kql-lab.html`: copied through untouched; path stays /md-102/.
  - `apps/md-102/{source,kql-source,HOW-THESE-APPS-ARE-BUILT.md}`: build tooling outside `public/`, never deploys.
  - Adding SC-300 later: add `public/sc-300/` and `apps/sc-300/`.
  - Update the guide's section 10 step 4: copy to `../../../public/md-102/index.html`.
- `public/staticwebapp.config.json` (must): must end up in `dist/`; holds 404 override and headers. md-102 uses inline scripts and Google Fonts, so `/md-102/*` gets its own CSP.
- `.gitattributes` with `* text=auto eol=lf` (must): CRLF would break `assemble.sh`.
- Size targets: ~250 lines .astro, 150 CSS, 100 JSON, 50 workflow YAML, 30 config JSON.

## 2. Install, run, remove (same on macOS and Windows)
- `git clone <repo>`, `npm ci`, `npm run dev`. Scripts: `dev`, `build`, `preview`; leave out `astro check` (adds two dependencies).
- Rebuilding md-102 on Windows needs Git Bash and Python.
- Remove: delete the SWA resource, DNS records and repo.

## 3. Components
- Node 22 LTS (`.node-version` plus `engines`)
- astro ^6 (pin exact versions via committed `package-lock.json`)
- actions/checkout, actions/setup-node, Azure/static-web-apps-deploy@v1
- Targets: ubuntu-latest runner; macOS and Windows for development

## 4. Operational concerns
- Workflow (must): push to `main`; pull_request to `main` (opened, synchronize, reopened, closed). Steps: checkout, setup-node from `.node-version`, `npm ci`, `npm run build`, deploy `dist` with `skip_app_build: true`. Drop the old OIDC/github-script steps. Permissions: `contents: read`, `pull-requests: write`. `concurrency` per ref (should).
- Branch mapping: `main` is production. PRs get preview environments, removed when the PR closes. A PR from `dev` to `main` is the staging check (must). Persistent `dev` environment is optional (could); it uses one of the few preview slots.
- Secret: deployment token in GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN` (must). Not in any file.
- Logging: Actions run log; `gh run view --log`.
- Deploys are full uploads; re-running is safe.
- Coexistence: new SWA resource and new repo. Do not touch the old SiliconScripted.com repo, SWA or DNS.

Setup guide outline (must), saved as `docs/setup-guide.md`:
1. Create the GitHub repo and push `dev` and `main`.
2. Azure portal: create a Static Web App, Free plan, source "Other" so Azure does not generate its own workflow.
3. Copy the deployment token and add it as the repo secret.
4. Push to `main`; confirm the `*.azurestaticapps.net` URL works.
5. Custom domain `www`: CNAME at the registrar to the SWA hostname, then validate.
6. Apex `jonwitherspoon.com`: TXT validation record, then ALIAS/ANAME (or CNAME flattening), or move DNS to Azure DNS.
7. Pick a default domain and redirect the other to it.
8. Verify: HTTPS on both names, `/md-102/` loads, a test PR creates a preview.
9. Rollback: re-run an earlier deploy run.

## 5. Work split
- Front-end: `src/pages/*`, `src/layouts/Base.astro`, `src/styles/site.css`, `src/data/site.json`
- Back-end: `package.json`, `package-lock.json`, `astro.config.mjs`, `.node-version`, `.gitattributes`, `.github/workflows/deploy.yml`, `public/staticwebapp.config.json`, moving md-102 into `public/` and `apps/`, `docs/setup-guide.md`

## 6. Assumptions
- Repo visibility: private (recommended).
- Default domain: apex, www redirects to it (recommended).
- Registrar: unknown, ask Jon.
- Persistent `dev` environment: no.
- `kql-lab.html` linked from the home page: yes.

## 7. Recon requests
- SWA Free plan: number of preview environments; free apps per subscription?
- SWA apex domain: required DNS records; ALIAS/flattening only, or Azure DNS?
- Can SWA redirect www to apex natively (default domain setting)?
- Current major versions of actions/checkout and actions/setup-node?
- Minimum Node version for Astro 6?
- Does `skip_app_build: true` with `app_location: dist` read `staticwebapp.config.json` from `dist`?
- Do SWA preview environments on the Free plan have public URLs?
