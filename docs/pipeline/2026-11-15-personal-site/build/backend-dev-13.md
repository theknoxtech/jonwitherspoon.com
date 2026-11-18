Untrusted content: none

# backend-dev-13: About rewrite (5 paragraphs)

## Change
`src/data/site.json` `profile.about` replaced with the 5 strings in order (string 1 and 5 unchanged; 2, 3 new; 4 updated per Jon's degree message). `aboutDraftNote` untouched. Final string 4:

"I mentor junior engineers, write documentation and knowledge bases, and build free practice apps for Microsoft exams, which you can find under Labs. I hold a B.S. in Information Technology from Western Governors University, and I'm Microsoft certified in Azure Fundamentals and as an Identity and Access Administrator Associate."

## Test edits (caused by the change: About now contains "Identity and Access Administrator Associate" and "Azure Fundamentals", so first-occurrence lookups hit the About text instead of the cert list)
- `tests/site.test.mjs` line 112 (portfolio certifications test)
  - before: `html.slice(html.indexOf('Identity and Access Administrator Associate'))`
  - after: `html.slice(html.indexOf('Identity and Access Administrator Associate', html.indexOf('class="cert"')))`
- `tests/qc-final.test.mjs` line 189 ("Add a certification" guide test)
  - before: `portfolio.indexOf('Example Associate') < portfolio.indexOf('Azure Fundamentals')`
  - after: `... < portfolio.indexOf('Azure Fundamentals', portfolio.indexOf('class="cert"'))`

No assertion about paragraph count or text broke. The first run (before the degree edit and test edits) had these same 2 failures, nothing else.

## Result (final run, after all edits)
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: exit 0, 6 pages.
- `npm test`: 227 tests, 226 pass, 0 fail, 1 todo.
- Privacy scans pass: "no phone, address or date of birth patterns in main pages", "QC workflow: phone/address guard patterns", "QC secrets: no ... personal phone/address/email in tracked files".
- Files modified: site.json, the two test files. docs/security untouched; no commits.
