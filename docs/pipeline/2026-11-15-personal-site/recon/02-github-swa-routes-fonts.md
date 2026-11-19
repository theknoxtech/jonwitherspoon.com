# Recon 02: GitHub Free plan, SWA routes, 404, IBM Plex files

Untrusted content: none.

## Q1. GitHub Free, private repo
- Branch protection and rulesets: not available for private repos on Free (Pricing page lists repository rules for public repos on Free; Pro/Team/Enterprise for private). Confidence medium (no single doc sentence).
- Secret scanning and push protection: public repos only on Free; private repos need GitHub Secret Protection (paid add-on, Team/Enterprise Cloud). Confidence high.
- Dependabot alerts and version updates: available on private repos on Free. Confidence high.
- "Require actions to be pinned to a full-length commit SHA": checkbox under Settings > Actions > General; docs state no plan restriction; could not confirm on Free (medium-low). Test in the repo.
- Sources: https://github.com/pricing ; https://docs.github.com/en/code-security/getting-started/github-security-features ; https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets ; https://docs.github.com/en/get-started/learning-about-github/githubs-plans ; https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository ; https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/

## Q2. SWA route matching and headers
- `/md-102/*` does NOT match `/md-102` or `/md-102/`; it matches `/md-102/kql-lab.html`. Docs: "A route pattern of /calendar/* ... won't match requests for the paths /calendar or /calendar.html. Use /calendar* to match all requests that begin with /calendar." Use `/md-102*` for folder root, no-slash form and everything under it (also matches `/md-102x`; acceptable).
- `/md-102` -> `/md-102/` redirect only with `"trailingSlash": "auto"` or `"always"`. With no setting, `/about` returns 200 and `/about/index.html` is served as-is. `auto` also 301s `/privacy.html` to `/privacy`.
- Rules evaluated in array order, first match wins; put specific before general. Only `route` and `methods` decide a match.
- Route-level headers override globalHeaders only for the same header name; otherwise the union. So a route-level CSP replaces the global CSP for that path; other global headers still apply. `""` removes a header. Case-insensitivity of names not stated.
- Source: https://learn.microsoft.com/en-us/azure/static-web-apps/configuration (updated 2026-03-25). Confidence high.

## Q3. Custom 404
- `"responseOverrides": {"404": {"rewrite": "/404.html"}}` (doc example). Astro `src/pages/404.astro` builds to `404.html` (docs.astro.build/en/basics/astro-pages/). Not tested on SWA.
- Status preservation not stated explicitly; verify with `curl -I` on a missing URL.
- Do not set `navigationFallback` on a static site (unknown paths would return 200 and bypass the 404).
- Confidence high for config and Astro output; medium for status.

## Q4. IBM Plex woff2
- Official source: IBM/plex GitHub repo (same files in npm `@ibm/plex-sans`, `@ibm/plex-mono`); not fonts.gstatic.com.
- Pre-split: `packages/plex-sans/fonts/split/woff2/IBMPlexSans-<Weight>-<Subset>.woff2` (subsets Cyrillic, Greek, Latin1, Latin2, Latin3, Pi). Sans 400 `IBMPlexSans-Regular-Latin1.woff2`; Sans 600 `IBMPlexSans-SemiBold-Latin1.woff2`; Mono 400 `packages/plex-mono/fonts/split/woff2/IBMPlexMono-Regular-Latin1.woff2`; Mono 500 `IBMPlexMono-Medium-Latin1.woff2` (Mono names inferred, not verified).
- Un-split: `packages/plex-sans/fonts/complete/woff2/IBMPlexSans-Regular.woff2` (about 63 kB each).
- Raw URL pattern (inferred, not fetched): `https://raw.githubusercontent.com/IBM/plex/master/packages/plex-sans/fonts/split/woff2/IBMPlexSans-Regular-Latin1.woff2`
- Licence: SIL OFL 1.1 is `LICENSE.txt` (repo root and per package), there is NO `OFL.txt`.
- IBM's "Latin1" is not Google's "latin" subset; check curly quotes, en/em dashes, euro sign; add Latin2 if missing.
- Confidence medium-high for Sans, medium for Mono.
