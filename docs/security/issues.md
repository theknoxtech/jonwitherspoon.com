# Security issues

Every finding gets a row with an ID that is never reused. Status values: Open, Fixed (awaiting check), Closed, Logged for later, Deferred, Accepted. A box is ticked only after the fix is committed, its tests pass, and a later review run confirms it.

| Done | ID | Severity | Status | Found in run | Where | Summary | Confirming run |
|---|---|---|---|---|---|---|---|
| [ ] | SEC-001 | Low | Fixed, awaiting check | 1 | exam_apps/md102-handoff.md | Handoff note removed from the history before the first push (rewrite 2026-11-18, Jon approved); the artifact link remains in exam_apps/md-102/CLAUDE.md by Jon decision | |
| [ ] | SEC-002 | Info | Logged for later | 1 | docs/pipeline build notes | Local `/Users/...` paths in run records | |
| [ ] | SEC-003 | Low | Logged for later | 1 | cve/report-2.md; articles/[slug].astro | Astro advisory exception says "no image pipeline", but sharp now processes blog images | |
| [ ] | SEC-004 | Low | Logged for later | 1 | src/lib/articles.js | Article markup guard misses unquoted img src, javascript: links, iframes; CSP is the backstop | |
| [ ] | SEC-005 | Low | Logged for later | 1 | src/data/site.json:180,187 | http:// CompTIA verify links | |
| [ ] | SEC-006 | Info | Logged for later | 1 | deploy.yml; dev site | PR previews and dev site are public, with placeholders and (for previews) no noindex | |
| [ ] | SEC-007 | Info | Logged for later | 1 | exam_apps/md-102 | Preset exam date, unvalidated backup restore, unsafe-inline on shared origin (owner-known; owner decides) | |
| [ ] | SEC-008 | Info | Logged for later | 1 | public/tabs.js | Malformed URL hash throws URIError | |
| [ ] | SEC-009 | Info | Logged for later | 1 | HSTS config; setup guide 4a | includeSubDomains and dangling CNAME warning missing | |
| [ ] | SEC-010 | Info | Logged for later | 1 | deploy.yml; dependabot.yml; setup guide | No CI on PRs to dev, cancel-in-progress on prod, no deploy Environment, no fork-approval advice | |
| [ ] | SEC-011 | Info | Logged for later | 1 | src/data/site.json | Client and employer names on the public portfolio (owner decides) | |
