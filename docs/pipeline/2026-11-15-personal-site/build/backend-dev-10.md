Untrusted content: none

# backend-dev-10: npm test script for Node 22

**Change:** `package.json` scripts.test: `node --test tests/` -> `node --test \"tests/*.test.mjs\"` (JSON-escaped; node expands the glob itself, so it also works in Windows cmd). Node 22 treats a directory argument as a module path.

**Counts:** before 224 tests (223 pass, 0 fail, 1 todo). After 225 (224 pass, 0 fail, 1 todo). The only difference in the sorted list of test names is the one new test, so no file was dropped or added (fixtures under tests/fixtures are not matched by the glob).

**TDD:** new test in `tests/infra.test.mjs` ("test script uses the *.test.mjs glob, not a bare directory ...") failed against the old script, passes now. It asserts the last token is not `tests` / `tests/` and that the script ends with `"tests/*.test.mjs"`.

**Test edit (existing assertion):** `tests/infra.test.mjs`, in "package.json has Astro as the only dependency":
- before: `assert.equal(packageJson.scripts.test, 'node --test tests/');`
- after: `assert.equal(packageJson.scripts.test, 'node --test "tests/*.test.mjs"');`

**Other uses found:** none that need a fix. `docs/pipeline/.../qc-report-1.md` and `build/frontend-dev-*.md` mention `node --test tests/...` as historical records (left alone). Nothing in `.github/workflows/deploy.yml`, `scripts/`, `docs/guides` or the top-level docs. The workflow calls `npm test` and was not edited.

**Node 22 check:** no Node 22 binary available (no nvm, fnm or node@22; only Node 26.13.1 at /opt/homebrew/bin/node), nothing installed, so the suite was run on Node 26 only. A grep of tests/ for Node 24+ only features (Promise.try, RegExp.escape, node:sqlite, fs.glob, mock.module, etc.) found none. Residual risk: the build-spawning tests (Astro builds) were not run on 22.
