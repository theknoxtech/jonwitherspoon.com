# Round 2: UX specialist

Untrusted content: none (read council round-1 files, recon 01, the CVE report, CLAUDE.md, and md-102/source/app.html lines 155-166; none contained instructions).

## Security proposal
- Agree: token kept only as a secret, `contents: read`, `npm ci`, SHA pins, deploy `dist/` only, a separate looser CSP for `/md-102/*`, contact through links only.
- Object: self-hosting fonts is marked "could". Main-site CSP has `font-src 'self'`, so Google Fonts would be blocked and the site would quietly fall back. Make self-hosting a **must** for the main site.
- Object: the `noopener` rule on `target="_blank"`. Better to open no external links in new tabs; keep the rule as fallback.
- Improve: add a test that greps `dist/**/*.html` (outside `md-102/`) for `<script`, `<style` and `style="`; it should find none.

## Ops proposal
- Agree: Astro only dependency, `src/data/site.json`, `apps/` vs `public/` split, `.gitattributes`, skipping `astro check`.
- Object: page list has only `index` and `404`; design needs `work.astro`, `projects.astro`, `labs.astro` too (small, no extra dependency).
- Object: "kql-lab linked from home". Better: list it on `/labs/` as a companion under MD-102; Home links to Labs.
- Improve: rewrite setup step 7 to match the domain decision below.

## Revised proposal (changes only)
1. **CSP (must):** no JavaScript at all. No theme toggle, tabs or hamburger; theme follows the system setting via CSS. `build.inlineStylesheets: 'never'`. No `style=` attributes or `define:vars`; placeholders get a CSS class. With no inline code, the server CSP header is enough and Astro's `security.csp` is not needed.
2. **Fonts (must):** self-host IBM Plex as woff2 in `public/fonts/`, Latin subset only (about 4 files: Sans 400 and 600, Mono 400 and 500). `font-display: swap` with system fallback. SIL OFL: commit `OFL.txt` next to the fonts. md-102 stays on Google Fonts under its own CSP.
3. **Data (must):** ops's `site.json` for experience, projects and labs. Projects are cards only, linking to GitHub repo or demo. Drop `/projects/<slug>/` (the 5 old notes are one paragraph each). Content collection later if longer write-ups (could).
4. **Domain (must):** apex `jonwitherspoon.com` canonical. Add both apex and www as SWA custom domains (Free allows 2), both HTTPS. Every page carries `<link rel="canonical">` pointing at the apex. Registrar forwarding of www to apex (should) only if the registrar forwards over HTTPS; otherwise skip (a certificate error on www is worse than no redirect).
5. **md-102 back link (must):** in `md-102/source/app.html`, as the first line inside the `<div>` at line 156, above `<div class="eyebrow">`, add `<a class="back" href="/labs/">&larr; Labs</a>` plus one rule in its existing `<style>`: `.back{display:inline-block;margin-bottom:.5rem;font:500 .85rem 'IBM Plex Mono',monospace;color:inherit}`. Run `assemble.sh`, copy result to `public/md-102/index.html`. Same in the kql-lab source, linking to `/md-102/` with text "&larr; MD-102". Plain link; `/md-102/` URL and saved progress unaffected.
6. **Build stamp (should):** no git needed. Read `process.env.GITHUB_SHA`, first 7 chars; date is build date UTC. Show `built 2026-11-15 · a1b2c3d`; locally `built <date> · local`. Do not link the commit (repo is private).
7. **Current-role fields (must), [TO SUPPLY]:** job title; start month (YYYY-MM); location or "Remote"; 3-5 achievement bullets; technologies list; whether Jon wants the employer named publicly (recommend yes). Company is Critical Network Solutions (known).

Recon requests: none.
