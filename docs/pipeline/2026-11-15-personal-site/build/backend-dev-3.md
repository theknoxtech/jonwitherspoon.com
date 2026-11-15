Untrusted content: none.

# Back-end build report 3 (new layout)

## Changed
- `astro.config.mjs`: new `lab-copy` integration (second, after the placeholder guard). On `astro:build:done` it copies only the top-level `.html` files of each `exam_apps/<code>/` into `dist/exam_apps/<code>/` and prints each file. Reads `exam_apps/`, writes only `dist/`.
- `tests/infra.test.mjs`: byte-identity test now compares all 44 files of c1d1619 (`md-102/<path>`) to `exam_apps/md-102/<path>`. Removed the public/exam_apps folder test. Added built-labs test (dist/exam_apps holds only .html; index.html and kql-lab.html byte-identical to originals) and stronger dist hygiene (no source/, kql-source/, .md, .sh, .DS_Store; .js only under `_astro/`). Informational scan repointed to `exam_apps/md-102/*.html` (print only). `/exam_apps*` still the first route with the Google font allowance on that route only.
- `docs/setup-guide.md`: "Add a new lab" rewritten (create `exam_apps/<code>/` with index.html beside source, labs[] entry, no copy, no CSP edit, preview and curl checks).
- `.gitignore`: the old `exam_apps/**/index.html` pattern WAS hiding Jon's `exam_apps/md-102/index.html`; replaced by `exam_apps/*/source/{all.js,index.html,standalone.html}` only. `git check-ignore` now reports neither index.html nor kql-lab.html as ignored.

## Results
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: OK, 5 pages, printed `lab-copy: exam_apps/md-102/index.html` and `kql-lab.html`; 2 placeholder warnings (front-end content). dist/exam_apps contains only those two files.
- `npm test`: 31 tests, 31 pass, 0 fail.
- Read-only check: every one of the 44 c1d1619 files is identical to `exam_apps/<path>` (0 differences). I wrote nothing in exam_apps/.

## Not done / notes
- Untracked generated files in `exam_apps/md-102/source/` (if still present) left alone. Astro 7 / npm audit question from report 2 is still open.
- Report backend-dev-2.md paths (`public/exam_apps/...`) are superseded by this layout.
