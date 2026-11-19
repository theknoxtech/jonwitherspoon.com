# Round 2: ops specialist

Untrusted content: none (read council round-1 files, recon 01, CVE report, CLAUDE.md, md-102 assemble.sh/chk.js/dump.js/kql test.js and the guide; none contained instructions).

## UX proposal
- Agree: page map, `/work/` as one page, labs hub from data, no JS needed, placeholders visible, `/md-102/` fixed.
- Object: projects as a content collection with `/projects/<slug>/` pages (extra schema and write-ups Jon has not supplied). Instead: cards from JSON linking to the repo (detail pages: could).
- Improve: IBM Plex as woff2 files in `public/fonts/` (downloaded once, OFL). No npm font package; strict CSP still holds.

## Security proposal
- Agree: all "must" items, SHA pinning, `npm ci`, no `pull_request_target`.
- Object: `skip_app_build: false` (Oryx picks its own Node and install command). Build in our own step with `npm ci`.
- Improve: meet the main CSP with `build.inlineStylesheets: 'never'` and no client scripts; no Astro `security.csp` hashes needed.

## Revised proposal (changes only)

**1. Domains (must).** Setup steps 5 to 7:
- www: CNAME to the SWA hostname.
- Apex: TXT validation record, then ALIAS/ANAME or CNAME flattening to the SWA hostname.
- SWA has no www/apex redirect; any redirect is registrar forwarding. Apex plus www uses both free domain slots.
- If the registrar has no ALIAS: move the zone to Azure DNS (about $0.50/month), or have the registrar forward apex to www and add only www to SWA.
- Allow up to 72 hours for propagation.
- Prototype-review question: which registrar? (Ops preferred www as default domain; see plan for the settled choice.)

**2. Workflow (must).**
- Steps: checkout `3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`; setup-node `949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0` with `node-version-file: .node-version`; `npm ci`; `npm run build`.
- Deploy `Azure/static-web-apps-deploy@1a947af9992250f3bc2e68ad0754c0b0c11566c9 # v1` with `app_location: dist`, `output_location: ""`, `skip_app_build: true`, `skip_api_build: true`, `action: upload`.
- `.node-version` = 22 (latest 22.x, at least 22.12). `package.json`: `engines.node ">=22.12"`, `astro: "^6.4.8"`.
- `public/staticwebapp.config.json` lands in `dist/` because Astro copies `public/` into the build.

**3. Data model (must).** One file `src/data/site.json` with keys `profile`, `experience[]`, `projects[]` (`featured`, `order`, `url`), `certifications[]`, `skills[]`, `labs[]` (`code`, `name`, `status`, `updated`, `path`, `companions[]`).
- Files: `src/pages/{index,work,projects,labs,404}.astro`, `src/layouts/Base.astro`, `src/styles/site.css`, `src/data/site.json`, `public/avatar.jpg`, `public/fonts/*`.

**4. Add a cert app (must).**
- Config has two fixed loose-CSP route rules written once: `/md-102/*` and `/apps/*`. Recommendation: future apps live at `/apps/<code>/`.
- Steps: build in `apps/<code>/`; copy built HTML to `public/apps/<code>/`; add a `labs[]` entry; open a PR and check the preview. No CSP edit per app.
- Test with `curl -I` that the rule covers `/md-102/` and `/md-102/kql-lab.html`.

**5. Avatar (should).** Developer downloads once (`curl -L -o public/avatar.jpg "<avatar_url>&s=460"`) and commits it. Plain `<img>` with width and height (not Astro's image pipeline). GitHub re-encodes avatars, so verify only: macOS `mdls public/avatar.jpg` should show no GPS/EXIF; Windows Properties > Details. Only if metadata turns up, ask Jon to approve Pillow in a venv.

**6. md-102 move (must).** `git mv`: `md-102/{index,kql-lab}.html` to `public/md-102/`; `source/`, `kql-source/` and the guide to `apps/md-102/`.
- `assemble.sh`, `chk.js`, `test.js` use paths relative to their own folder, so they keep working.
- Guide changes: file tree (lines 17-21), section 10 step 1 (line 143) and step 4 (line 146: `cd apps/md-102/source && bash assemble.sh && node chk.js`, then `cp standalone.html ../../../public/md-102/index.html`).
- Gitignore build outputs `all.js`, `index.html`, `standalone.html` under `apps/`.
- `kql-source/test.js` needs Playwright; keep it out of the site's `package.json` and say so in the guide.
- `chk.js` and `dump.js` write to `/tmp`, which may break on Windows. Log it, do not fix now (could).

**7. Placeholder guard (must).** About 15-line inline integration in `astro.config.mjs`. On `astro:build:done` it scans `dist/**/*.html` for `[TO SUPPLY` and prints count and file names as a warning. Never fails the build. Env flag `FAIL_ON_PLACEHOLDER=1` turns it into a failure on `main` (should).

**Assumptions added:** registrar (ask Jon); www as default domain; future apps under `/apps/`.

Recon requests: none.
