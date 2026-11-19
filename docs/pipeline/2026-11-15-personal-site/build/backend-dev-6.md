Untrusted content: none

# Backend dev 6: dev site deploy

## What changed
- Task 1: `scripts/make-dev-config.mjs` exports `addNoindexHeader(config)` (returns a copy, adds `X-Robots-Tag: noindex, nofollow` to `globalHeaders`, idempotent). Run as `node scripts/make-dev-config.mjs <dist>` it rewrites `<dist>/staticwebapp.config.json`; missing path, missing file or invalid JSON exits 1 with a message.
- Task 2: `deploy.yml` workflow changes (below).
- Task 3: docs updated (setup guide new section 4a plus section 7 and 9 lines; GitHub Actions guide; editing guide Publish).

## Files
- New: `scripts/make-dev-config.mjs`, `tests/devsite.test.mjs` (17 tests)
- Changed: `.github/workflows/deploy.yml`, `tests/qc-static.test.mjs`, `docs/setup-guide.md`, `docs/github-actions-guide.md`, `docs/editing-guide.md`
- exam_apps/ untouched (its uncommitted changes are the other chat's).

## Workflow diff summary
- `push` branches: `[main, dev]`; pull_request unchanged.
- `build_and_deploy` condition: `(github.event_name == 'push' && github.ref == 'refs/heads/main') || (<existing PR guard>)`; deploy step gets `production_branch: main`. Nothing else changed.
- New `deploy_dev`: `if: github.event_name == 'push' && github.ref == 'refs/heads/dev'`, `contents: read` only; same pinned checkout, setup-node, `npm ci`, build (`FAIL_ON_PLACEHOLDER: '0'`), Test, phone/address scan; then `node scripts/make-dev-config.mjs dist`; deploy with `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`, `production_branch: dev`. No placeholder-block step. Same 3 pinned SHAs, no new actions.

## Existing test edits (all in tests/qc-static.test.mjs, each broken by this change)
1. Triggers test: `branches: [main]` -> `branches: [main, dev]` (title says "main and dev").
2. Guard test: `/^github\.event_name == 'push' \|\| \(/` -> `/^\(github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'\) \|\| \(/`.
3. Placeholder switch test: `FAIL_ON_PLACEHOLDER` count 1 -> 2 (dev sets it to '0').
4. Pinned uses test: `uses.length` 4 -> 7.
5. Secrets test: regex also allows `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`; count 3 -> 5.
6. Phone/address pattern test: patterns now de-duplicated with `new Set` (dev job repeats the same scan), so length stays 2.
`tests/infra.test.mjs` needed no edits.

## Counts
`ASTRO_TELEMETRY_DISABLED=1 npm run build && npm test`: 184 tests, 184 pass, 0 fail (run once). Build printed "collection blog does not exist or is empty" messages (pre-existing, no blog posts; build succeeded).

## Extras (not built)
- Meta robots noindex in dev pages; dev login; cancel-protection; `--ignore-scripts`; validating the config shape in the script beyond JSON parse; a check that the production job still blocks placeholders is not duplicated for dev.

## For Jon
- I included the phone/address scan in the dev job (the plan said "like production", and dev is public). Remove it if you want dev lighter.
- The 3x full run in the plan was run once, per instructions.
- The first dev push must be checked as the guides say (production environment, not a `-dev.` preview); Azure behavior is undocumented.
