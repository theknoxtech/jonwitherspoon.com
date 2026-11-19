# Recon 04: MD-102 update date, Azure SWA with Cloudflare DNS

Untrusted content: none (no instruction-like text on fetched pages). Fetch date 2026-11-16.

## Q1. MD-102 dates (Microsoft Learn)
- Study guide (https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/md-102): heading "Skills measured as of October 27, 2026" (most recent version); change-log table "Skill area prior to October 27, 2026 | Skill area as of October 27, 2026"; metadata ms.date 2026-08-16, updated_at 2026-09-25; title "Study guide for Exam MD-102: Managing and Securing Microsoft 365 Endpoints by using Intune". The page says two versions of skills measured are included depending on when the exam is taken; only the Oct 27, 2026 version was returned. No "updated on" sentence.
- Certification page (exam URL redirects to "Microsoft 365 Certified: Endpoint Administrator Associate"): "Last Updated 07/24/2026"; "The English language version of this certification will be updated on October 27, 2026"; no retirement date or replacement exam named; exam still offered (100 minutes, English plus 6 languages).
- Confidence high. The Oct 27, 2026 update is already in effect.

## Q2. Azure SWA with Cloudflare DNS
- No Cloudflare-specific SWA page from Microsoft. Generic external-DNS guides apply: https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain , apex-domain-external , custom-domain-external.
- Apex: portal Custom domains > Add, choose TXT, generate code; add DNS TXT at `@` with the code; add ALIAS/ANAME or CNAME flattening at `@` to the default `*.azurestaticapps.net` hostname (no https://). Cloudflare CNAME flattening at the apex is an accepted method (CNAME at `@`, Cloudflare flattens). Propagation up to 72 hours.
- www: CNAME `www` to the `*.azurestaticapps.net` host.
- Proxy status: Microsoft does not say. Domain verification needs publicly resolvable DNS; automatic certificate renewal needs the domain to resolve to the static web app over the public internet. A proxied CNAME resolves to Cloudflare IPs and community reports say it fails the CNAME check while TXT passes. Safest: DNS only (grey cloud) with TXT validation; if proxied later, expect to re-verify at certificate renewal (low confidence).
- If proxied: use SSL mode Full (strict), not Flexible (redirect loop risk). Inference.
- TXT pre-validation host for zero downtime: `_dnsauth.www.<DOMAIN>` for apex, `_dnsauth.<SUBDOMAIN>.<DOMAIN>` for subdomains.
- Sources: Microsoft pages above; https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/ ; https://developers.cloudflare.com/dns/cname-flattening/ (not fetched).

## Q3. Cloudflare www to apex redirect
- Current rule type: Redirect Rules (Single Redirects), Rules > Redirect Rules. Cloudflare's example "Redirect from WWW to root": wildcard pattern `https://www.*`, target `https://${1}`, status 301, preserve query string. Custom-filter equivalent (translation, verify in the dashboard): `(http.host eq "www.jonwitherspoon.com")` with dynamic target `concat("https://jonwitherspoon.com", http.request.uri.path)`, 301, preserve query string.
- DNS requirement: the redirecting hostname must be proxied (orange cloud); typical placeholder is a proxied A record such as `192.0.2.1` (medium confidence). Resolution: redirect www to apex, so `www` is only a proxied placeholder and only the apex reaches Azure (apex DNS only). Then only the apex needs to be an Azure custom domain.
- Sources: https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/ ; .../single-redirects/create-dashboard/ ; .../single-redirects/examples/ ; .../reference/page-rules-migration/

## Q4. Headers and CSP behind Cloudflare
- Cloudflare passes origin headers (CSP, HSTS) through by default (no official page states it; low/medium). Cloudflare's own HSTS setting is off by default; if enabled it adds/overrides Strict-Transport-Security, so do not enable both.
- Settings that inject script or break `default-src 'self'` (only when proxied): Rocket Loader (turn off), Web Analytics automatic beacon injection (disable), Email Address Obfuscation (turn off), Scrape Shield features (avoid), Auto Minify (deprecated 2024-08-05; turn off if any remnant), Mirage and Zaraz (check).
- To see what Cloudflare injects, view source through the proxy and compare with the origin.
- Source: https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/
