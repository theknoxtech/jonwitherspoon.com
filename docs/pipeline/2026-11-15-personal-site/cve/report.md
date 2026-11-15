# CVE report (Normal run, Public exposure)

Untrusted content: web search results and vendor/news blog pages were read as data only; no instructions acted on.

Caveat from the analyst: snippet-level web searches only. Primary NVD, GitHub advisory and CISA KEV pages were not opened, so KEV and EPSS status is unverified. Treat version numbers as "verify on the GHSA page, then pin".

## Summary
No confirmed KEV-listed (actively exploited) CVE for this chain. Most actionable:
- Keep Astro and Vite at current patched releases.
- Pin GitHub Actions to full commit SHAs (2026 saw repeated tag-hijack and npm worm campaigns).
- Run Node 22 at the newest 22.x.
Most Astro and Vite CVEs sit in features a static site does not ship: dev server, SSR, server islands, Node adapter.

## Table
| CVE / advisory | Component, affected | Severity | Affects this app? | Action |
|---|---|---|---|---|
| CVE-2026-59731 (auth bypass, decode limit and rewrite canonicalization) https://advisories.gitlab.com/npm/astro/CVE-2026-59731/ | Astro 6.x, fixed 6.4.8 | not confirmed | Unclear; matters for middleware auth, static site has none | Require astro >= 6.4.8 |
| CVE-2026-54299 (Host header SSRF, prerendered error page fetch) https://cve.circl.lu/vuln/ghsa-2pvr-wf23-7pc7 | Astro < 6.4.6 | High | Likely no (server runtime issue) | Covered by 6.4.8 |
| CVE-2026-53571 (Windows bypass of server.fs.deny) https://osv.dev/CVE-2026-53571 | Vite < 6.4.3, 7.0.0 to < 7.3.5, 8.0.0 to < 8.0.16 | not confirmed | Dev server only (Windows laptops, only if exposed) | Vite >= 6.4.3 / 7.3.5 / 8.0.16; never `--host` on untrusted networks |
| CVE-2026-39364 https://nvd.nist.gov/vuln/detail/cve-2026-39364 and CVE-2026-39363 https://advisories.gitlab.com/npm/vite/CVE-2026-39363/ | Vite 7.1.0 to < 7.3.2, 8.0.0 to < 8.0.5 (39364); 6.0.0 to < 6.4.2, 7.x < 7.3.2, 8.x < 8.0.5 (39363) | High (39364) | Dev server only | Covered by versions above |
| Node.js 22 security releases June 2026 https://nodejs.org/en/blog/vulnerability/june-2026-security-releases (22.23.0), plus a reported July emergency 22.23.2 (secondary source, unconfirmed on nodejs.org) | Node 22 below latest 22.x | High | Low (build-only runtime) | Newest 22.x in CI via setup-node `node-version: 22` |

Other Astro advisories seen (SSR, Node adapter, server island, astro/hono: CVE-2026-45028, CVE-2026-27829) are out of scope for static output. CVE-2026-73423 and CVE-2026-84376 noted but unchecked; appear fixed only in Astro 7.x (the second is a base-path authorization bypass).

## Answers
1. Astro/Vite: require astro >= 6.4.8 and the Vite floor above; `npm ci` enforces lockfile; run `npm audit` in CI. Static output has little exposure.
2. Supply chain 2026: mutable tag hijacks (actions-cool/issues-helper, May: https://thehackernews.com/2026/05/github-actions-supply-chain-attack.html; codfish/semantic-release-action, June: https://www.stepsecurity.io/blog/supply-chain-compromise-codfish-semantic-release-action); Shai-Hulud-style npm worms (@antv: https://www.stepsecurity.io/blog/shai-hulud-here-we-go-again-mass-npm-supply-chain-attack-hits-the-antv-ecosystem). Mitigations: pin every action to a 40-char SHA with version comment, update via Dependabot; commit lockfile, `npm ci` only; consider `npm ci --ignore-scripts` if the build allows; consider minimum package age; `permissions: contents: read`; no deploy job on fork PRs.
3. Azure SWA / deploy action: no CVE or advisory found for Azure/static-web-apps-deploy or the deployment token. Token reset is documented: https://learn.microsoft.com/en-ca/Azure/static-web-apps/deployment-token-management. Store token only as a GitHub secret; rotate on suspected exposure; pin the action to a SHA (v1 is a mutable tag).

## Not checked
KEV/EPSS lookups; Azure SWA platform advisories and header behavior; exact installed Astro/Vite versions; IBM Plex font packages and transitive npm deps; laptop OS versions.

## Recon requests
- Exact patched versions of Astro 6.x and Vite current on npm today.
- Google Fonts embed vs self-hosted IBM Plex for CSP and privacy (design question).
