# CVE follow-up: npm audit findings on Astro 6.4.8 (static site)

Untrusted content: web advisory pages and search summaries were read as data only. Several sources disagree on exact fixed versions or severities. No instructions found.

## Summary
None of the three npm audit findings is in KEV, and none looks exploitable in a static Astro 6 site built only from .astro pages that render JSON, with plain `<img>` tags and a build-time-only integration. Astro 6.4.8 is flagged for all the Astro advisories and every fix found is in 7.x; no 6.x release clears them (could not list 6.x versions on npm; check `npm view astro versions --json`). Recommendation: stay on 6.x with a short written exception, then move to 7.x as a planned upgrade.

## Findings
| Advisory | Component | Severity | Affects this site? | Action |
|---|---|---|---|---|
| GHSA-26w7-cxv4-gfx2 (libheif AVIF heap overflow) https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2 | astro <7.2.8 via sharp | Critical | No: needs Astro to process an untrusted AVIF; no image pipeline here | Accept; fixed 7.2.8 |
| CVE-2026-84376 (base-path bypass) https://github.com/withastro/astro/security/advisories/GHSA-376h-93r7-7g6f | astro <=7.2.3 | Moderate | No: needs non-root base plus middleware auth on a live server | Accept; fixed 7.2.4 |
| CVE-2026-59729 / CVE-2026-54298 (spread-attribute XSS) https://github.com/withastro/astro/security/advisories/GHSA-f48w-9m4c-m7f5 | astro <=7.0.3 | Moderate | No: attacker must control spread object keys; pages render committed JSON | Accept; fixed 7.0.5 |
| CVE-2026-59727 (`transition:*` XSS), CVE-2026-114127 (View Transitions CSS injection) | astro | Low | No: no view transitions | Accept |
| GHSA-98hj-9722-w3j8 (JSX/MDX XSS) | astro | Moderate | No: no MDX or JSX | Accept; fixed 7.3.2 per Snyk |
| CVE-2026-126364 (@astrojs/node file read) https://github.com/withastro/astro/security/advisories/GHSA-r3h5-4585-7x3w | @astrojs/node | Moderate | No: adapter not installed | None |
| GHSA-g7r4-m6w7-qqqr (esbuild dev-server file read, Windows) https://osv.dev/GHSA-g7r4-m6w7-qqqr | esbuild >=0.27.3 <0.28.1 | Low (CVSS 2.5 per OSV) | Unlikely: dev-only, Windows-only | Optional: `npm update esbuild` or override 0.28.1 (check Vite 7.3.8 allows it) |
| sharp / libvips / libheif / librsvg CVEs | sharp via astro | Varies | No: only runs when Astro processes images | Optional: `--omit=optional` in CI after testing |

## Upgrade note
Astro 7 uses Vite 8 and a stricter Rust compiler (rejects unclosed tags, no longer fixes invalid nesting; CSS output may differ; `compressHTML` defaults to `'jsx'`); needs Node >=22.23.4. Risk low to moderate; do it on its own branch and compare built HTML before and after; the `astro:build:done` integration is the part to test. Guide: https://docs.astro.build/en/guides/upgrade-to/v7/

## Not checked
EPSS scores; the exact sharp/libvips/librsvg CVE IDs; the esbuild range allowed by Vite 7.3.8; Astro 6.4.8's own sharp dependency type; the full advisory list (page 1 of 3 read).
