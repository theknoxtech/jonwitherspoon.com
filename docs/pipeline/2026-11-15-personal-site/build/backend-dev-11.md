Untrusted content: none

# backend-dev-11: done (option 1, per orchestrator)

Change in `src/data/site.json`, first `experience` entry only:
- The three bullets are now, in order: "Design, build and deploy automations at scale." / "Lead projects implementing cloud technologies and various migrations." / "Build AI solutions in Azure Foundry."
- Removed the trailing comma and the whitespace-only line. 4-space indent kept.
- `location` "Remote" kept (Jon's). `start` and `technologies` placeholders untouched.
- JSON checked with `node -e "JSON.parse(...)"`: valid.

Tests: `ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`
- Build passed. It printed the expected warning: `1 page(s) still contain "[TO SUPPLY": portfolio/index.html`.
- 225 tests, 224 pass, 0 fail, 1 todo. The todo is the existing pipe-in-tag test in `tests/qc-final.test.mjs:444` (marked todo in the repo; it is not caused by this change).
- Tests updated: none.

Placeholders left in `dist/portfolio/index.html`: 2 (`grep -o "TO SUPPLY" dist/portfolio/index.html | wc -l` gives 2: start and technologies).
