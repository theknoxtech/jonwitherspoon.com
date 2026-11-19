Untrusted content: none

# backend-dev-8: push order fix in the guides

Changes (docs only):
- docs/setup-guide.md section 1: push only `main` now; `dev` is pushed last, at the end of section 4a.
- docs/setup-guide.md section 4a: intro notes why `dev` is held back; the last push step now says "Push `dev` now, for the first time" with the plain reason (first push starts the dev deploy, which needs the dev secret) and the check that the first dev push lands on `dev.jonwitherspoon.com`, not a `-dev.` preview address.
- docs/github-actions-guide.md: "Before you start" says `main` is pushed and `dev` is pushed last, after both secrets; the dev-site step says to push `dev` as the last part of 4a; the "Check the first dev push" step now follows that push. The first-pull-request step (dev on GitHub, then pull request) already matched the order.
- Plan Risk 6 ("the guide orders the steps so the secret comes before the first push") is now true; plan not edited.

Tests: `node --test tests/qc-static.test.mjs tests/qc-final.test.mjs tests/devsite.test.mjs tests/infra.test.mjs`: 116 tests, 114 pass, 1 fail, 1 todo.
The failure is "QC secrets: no token-looking strings ... personal phone/address/email in tracked files". It matches a phone-number-like pattern in docs/security/reviews/2026-11-18-plan-personal-site-run-1.md line 62 (committed in 408a09a), not in the guides I edited. It is not caused by this change and I did not touch that file or the test. The orchestrator needs to decide how to handle it.
