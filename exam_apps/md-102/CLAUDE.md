# MD-102 Practice Lab: instructions for Claude Code

Single-file vanilla-JS study app for the Microsoft MD-102 exam. The question bank is concatenated into `all.js`, injected into `source/app.html`, and the result is the deployed `index.html`. Also a private Claude Artifact. Full details: `HOW-THESE-APPS-ARE-BUILT.md` (read it before big changes and keep it current).

## Layout
- `index.html` is the built, deployed page (the standalone build).
- `source/`: `h.js` (helpers), `q1.js` to `q28.js`, `labs.js`, `app.html`, `assemble.sh`, `chk.js`, `dump.js`, `link-urls.tsv`, `check-links.sh`, some tests (`t3` to `t7`, `t19`). Tests `t8` to `t18` are not on this machine.
- The Astro site is at the repo root (`../../`). It copies each top-level `.html` in `exam_apps/<code>/` into `dist/exam_apps/<code>/`.

## Build
- `bash source/assemble.sh` concatenates: `h.js q1..q15 labs.js q16 q17 q18 q19 q21 q22 q23 q24 q25 q26 q28 q27 q20` into `all.js`, replaces `/*__DATA__*/` in `app.html` to make `index.html`, and writes `standalone.html`. The deployed `index.html` is `standalone.html` (adds a shim so Download backup works outside Claude). Needs `node` and `python3`.
- Adding a question file: put it immediately before `q27.js` in the build order (the newest file is `q28.js`, so a new `q29.js` goes between `q28.js` and `q27.js`). Update `assemble.sh`, `chk.js` and `dump.js` together.

## Question helpers (`h.js`)
- `add(d, t, q, [correct], [wrong], explanation, link)`; `addo(...)` ordering; `addv(...)` with a mock settings panel; `fix(...)`.
- `ML = 'https://learn.microsoft.com/'`; domains `D1` to `D5`.
- Ids are `Q.length + 1`. Multi-select is automatic when more than one answer is correct.
- `q27.js` splices questions out, so any file that adds questions must come before it, or ids duplicate. `q20.js` must stay last (it removes topics starting with `Lab `).
- `q27.js` is a patch file: `PL()` link fixes, `q.swap` interchangeable ordering steps (zero-based groups), the `R` map of old to new Learn paths, the domain re-tag block, and the retired-feature splice block. Ids stay stable when questions are removed.

## Domains (Oct 27, 2026 outline) and current bank
D1 Prepare infrastructure 20-25%, D2 Manage and maintain devices 25-30%, D3 Protect devices 15-20%, D4 Manage and secure applications 15-20%, D5 Optimize endpoint operations 10-15%. Bank: 724 questions (D1 118, D2 150, D3 112, D4 278, D5 66). Tag by exam-outline domain, not by the topic the question was written under; drills filter on `q.d`.

## Content rules (do not break)
- Learn-only quiz: no lab-based questions (the Labs tab stays).
- Verify every claim on Microsoft Learn; tell Jon plainly what was confirmed, corrected or dropped.
- The correct answer is never the longest option.
- Every question has a Learn link.
- Menu paths use arrows: `Apps > Monitor > App protection status`.
- Remove retired features; keep merely deprecated ones.
- Write questions in your own words from Learn. Never copy questions from third-party practice sites (they may be real exam content).
- Keep the app generic for any learner: no personal details in the app.

## Checks
- `node source/chk.js` prints `LONG` and `nolink` lines. Old ids up to about 371 still print `LONG` (accepted). Ids 672 and above must be clean.
- Playwright tests (`source/t*.js`) load `index.html`; paths may need adjusting on this machine.
- Site: `node --test tests/*.test.mjs` from the repo root must show 30 pass (plain `npm test` fails). The "[TO SUPPLY" placeholder warning in the build is pre-existing.

## Pitfalls
- Apostrophes inside single-quoted JS strings break the build. Use double quotes.
- `q8.js` and other older files use `L.*` link keys; new files should define their own link constants.

## Deploy
1. Build, run `chk.js` and tests.
2. Copy `standalone.html` to `exam_apps/md-102/index.html`.
3. Run the Astro build at the repo root and the 30 site tests.
4. Copy `dist/` out and confirm `dist/exam_apps/md-102/index.html` matches the source copy.
5. Claude Code cannot republish the Artifact. Publish from a claude.ai chat with the Artifact tool, using the existing Artifact URL: https://claude.ai/artifact/RYX6AHXREneYYmYPxUzgMx
6. Update `HOW-THESE-APPS-ARE-BUILT.md` (and the counts above) whenever the app changes.

## Link checking
`source/check-links.sh` reads `source/link-urls.tsv` and prints any non-200 Learn link. Run it in a normal terminal.

## Open items
- Learn contradicts itself on app configuration for Windows managed apps (overview says iOS/iPadOS and Android only; configure-managed-apps says Edge for Windows). The bank avoids the ambiguity.
- Replacement Learn links from the last audit came from search results and were not re-fetched; run `check-links.sh`.
- Domain re-tags were made from question stems and may still have strays.
