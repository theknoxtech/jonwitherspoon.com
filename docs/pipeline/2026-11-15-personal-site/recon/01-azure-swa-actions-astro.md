# Recon 01: Azure SWA, GitHub Actions, Astro, avatar

Untrusted content: none (fetched pages contained no embedded instructions).

## Q1. Azure/static-web-apps-deploy
- Only moving tag is `v1`, commit SHA `1a947af9992250f3bc2e68ad0754c0b0c11566c9` (GitHub tags API). No GitHub Releases. Docs still show `@v1`. Pin the SHA with a `# v1` comment.
- `azure_static_web_apps_api_token` is still required (default authorization). The "identity token" variant in Learn sets `id-token: write` + `contents: read`, fetches an OIDC token via actions/github-script and passes it as `github_id_token` alongside the API token; it is not token-free. No fully OIDC/managed-identity deployment found (medium confidence: absence in docs). `id-token: write` is only needed for that variant.
- With `skip_app_build: true`: set `app_location` to the prebuilt folder and `output_location: ''`. Copy `staticwebapp.config.json` into that output directory; for Astro it must end up in `dist` (put it in `public/`).
- Sources: https://github.com/Azure/static-web-apps-deploy ; https://api.github.com/repos/Azure/static-web-apps-deploy/tags ; https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration (updated 2026-09-28) ; https://learn.microsoft.com/en-us/azure/static-web-apps/configuration (updated 2026-03-25). Caveat: action.yml not read directly; doc example uses older action versions.

## Q2. SWA Free plan
- Free: 3 preview (staging) environments per app, 10 apps per subscription, 2 custom domains per app, 500 MB total storage, 250 MB per environment, 100 GB bandwidth/month. (Standard: 10 previews, 6 domains, 100 apps.)
- Preview URL form `<DEFAULT_HOST_NAME>-<BRANCH_OR_ENV>.<LOCATION>.azurestaticapps.net`. Docs do not say private; restriction features (IP allow-lists, private endpoint) are Standard-only, so previews are publicly reachable on Free (inference, medium). Custom domains do not work on preview environments.
- Sources: https://learn.microsoft.com/en-us/azure/static-web-apps/quotas (updated 2026-09-28) ; https://learn.microsoft.com/en-us/azure/static-web-apps/preview-environments (updated 2026-02-25).

## Q3. Custom domains
- Apex: TXT record at `@` with the portal-generated code, plus `ALIAS`/`ANAME` or CNAME flattening pointing `@` at the `*.azurestaticapps.net` hostname. Azure DNS is the alternative if the registrar lacks these. A record to `stableInboundIP` is a not-recommended fallback.
- `www`: CNAME to the `*.azurestaticapps.net` hostname.
- No native www-to-apex (or reverse) redirect setting; documented approach is registrar/DNS forwarding of the apex to `www`. Route redirects in `staticwebapp.config.json` cannot match on hostname (medium confidence: absence in docs).
- Apex changes can take up to 72 hours to propagate. Free plan allows 2 custom domains (apex + www = exactly 2).
- Sources: https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain ; https://learn.microsoft.com/en-us/azure/static-web-apps/apex-domain-external

## Q4. Headers
- Route-level header overrides `globalHeaders` for the same header name; otherwise the union is returned. `""` removes a header. Global headers do not affect API responses.
- Docs do not say whether `globalHeaders` apply to the custom 404 or redirect responses ("applied to each response"). Test with `curl -I` after deploy. (Low confidence.)
- Docs list no default `X-Frame-Options` or HSTS; set explicitly and verify live.
- `staticwebapp.config.json` max size 20 KB.
- Source: https://learn.microsoft.com/en-us/azure/static-web-apps/configuration

## Q5. Action versions
- actions/checkout `v7.0.1` (2026-07-20) commit `3d3c42e5aac5ba805825da76410c181273ba90b1`.
- actions/setup-node `v7.1.0` commit `949feb2413d6458794dcd2491c4babbbce0c15c1`.
- Both tag refs are commit objects. Re-check before pinning ("latest" moves).
- Sources: https://api.github.com/repos/actions/checkout/git/ref/tags/v7.0.1 ; https://api.github.com/repos/actions/setup-node/git/ref/tags/v7.1.0

## Q6. Astro 6
- Requires Node 22.12.0 or higher (18 and 20 dropped).
- `build.inlineStylesheets` default `'auto'`: stylesheets under Vite's `assetsInlineLimit` (4 kB) are inlined in `<style>`; larger emitted as files. `'never'` and `'always'` exist. Covers styles only; script inlining not verified.
- `security.csp` added in 6.0.0, stable. Works for static output: adds a `<meta http-equiv="content-security-policy">` per page with `script-src`/`style-src` hashes. Limits: not in dev (test build + preview); external scripts/styles not supported out of the box; ClientRouter not supported; Shiki not supported; a meta tag cannot carry `frame-ancestors`, `report-uri` or `sandbox` (set via SWA headers).
- Sources: https://docs.astro.build/en/guides/upgrade-to/v6/ ; https://docs.astro.build/en/reference/configuration-reference/

## Q7. GitHub avatar
- Documented stable form: REST API `GET /users/{username}` -> `avatar_url` (append `&s=460`, follow redirects). `https://github.com/<username>.png` is a convention (redirects to avatars.githubusercontent.com); size param is `s`, `?size=` not confirmed. Test once with `curl -L -o avatar.png` and check dimensions.
- Source: https://docs.github.com/en/rest/users/users
