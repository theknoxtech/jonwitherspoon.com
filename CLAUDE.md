# jonwitherspoon.com

<!--
How to use this template. Every project is different, so adapt it to fit:
- Required, and first: Project Context.
- Required, values adjusted to fit: Repository, Plans (the plans folder may change).
- Required, kept verbatim: Security Review Process.
- Replace with this project's real commands: Build and Execution Commands, Testing &
  Quality Control. Do not delete these sections; if there are no commands yet, say
  "None yet" and why, so the global default commands are not assumed.
- Optional: Project-Specific Rules.
- Add any sections this project needs (scope, open decisions, architecture notes)
  after Repository.
Nothing here loosens a non-negotiable in the global CLAUDE.md.
-->

## Project Context
<!-- Required. Claude will not start work until this is filled in. Replace the examples. -->
- **Core System**: Static personal website for jonwitherspoon.com, built with Astro and hosted on
  Azure Static Web Apps, deployed by GitHub Actions. Also hosts self-contained certification study
  apps (first one: `md-102/`).
- **Environments**: macOS (primary development), Windows, Azure Static Web Apps (production)
- **Languages**: Astro, HTML, CSS, JavaScript/TypeScript (Node version pinned in `.node-version`)
- **Exposure**: Public (reachable from the internet; Critical, High, and Medium findings block a merge)

## Repository
<!-- Replace the examples. -->
- **Remote**: Example - `github.com/CriticalMSP/<repo-name>` (private)
- **Branches**: Every repo has both `main` and `dev`. `main` is the default branch. `main` is created from the initial
  commit; all work happens on `dev` (or on plan branches cut from `dev`).
- **Merges to `main`**: Only when the repo owner explicitly authorizes it.

## Build and Execution Commands
<!-- Replace with this project's real commands. -->
- Run: `python3 main.py`
- Install dependencies: `pip install -r requirements.txt`

## Testing & Quality Control
- Run tests: `pytest`
- Lint: `ruff check .`

## Plans
<!-- Keep this section; change the plans folder if this project uses another. -->
Plans live in the repo, in `docs/plans/` unless this project says otherwise,
named `YYYY-MM-DD-short-topic.md`. A plan's folder shows where it stands;
its file name never changes, only its folder (moved with `git mv`, with
every link to it updated in the same commit).

| Folder | Meaning |
|---|---|
| top level | Living documents that are never "done" (backlog, roadmap) |
| `proposed/` | Written but not started (drafts, or approved and waiting) |
| `deferred/` | Parked on purpose by the repo owner |
| `in-progress/` | Its branch is being built |
| `done/` | Built and merged, nothing left over |
| `done-with-open-items/` | Built and merged, but it left items in the backlog or a follow-ups list |

- Every plan starts with a `**Status:**` line; plans in
  `done-with-open-items/` also have an `**Open items:**` line listing what
  is left, with links.
- Move a plan to `in-progress/` when its branch is cut, and out when it
  merges; when its last open item closes, move it to `done/`.

## Security Review Process (Non-Negotiable)
<!-- Keep this section as-is. It applies to every project. -->
Every code change gets an independent security review, and every review is
kept. No exceptions without the repo owner's explicit approval.

1. **When.** After a branch's code changes are finished and their tests
   pass, and before it is merged into `dev`. Every round of security fixes
   gets its own review run too.
2. **Who.** A separate agent that reviews read-only and changes nothing.
3. **Record every run.** Write a new file per run in `docs/security/reviews/`
   named `YYYY-MM-DD-<branch>-run-<N>.md`, with:
   - a header table: date, branch, commits reviewed, plan, reviewer, test
     count, and the overall result;
   - **1. What was implemented or changed before this run**;
   - **2. Findings**: ID, severity, where, what, and how it was verified,
     plus what was checked and found sound, and pre-existing issues;
   - **3. Mitigation steps**: the fix for each finding and the test that
     will prove it, or "none needed".

   Past run files are never rewritten; new information goes in a new run.
4. **Track every issue.** Every finding, including pre-existing ones, gets a
   row in `docs/security/issues.md` with an ID `SEC-NNN` that is never
   reused.
5. **Fix what blocks; log the rest.** Every project has an exposure class:
   **Local** (only the owner's machines, no network service, no other
   users), **Internal** (a trusted network or a few known people), or
   **Public** (reachable from the internet or used by unknown people). A
   finding **blocks** when it is Critical or High; for Internal, also Medium
   in exposed parts; for Public, also Medium.
   - **Blocking findings** are fixed on the branch, sized to the risk, and
     each fix is tested. The repo owner sees every blocking finding and what
     was done about it before the merge, and can reject a fix.
   - **Every other finding is logged for later**: it goes into
     `docs/security/review-later.md` under its severity (Critical, High,
     Medium, Low, Info), with a CVE link or the plain reason it was flagged
     and a suggested fix, and gets the status "Logged for later". The owner
     reviews that file when convenient. **Approval is per issue**: a reply
     that addresses one or some logged findings decides only those.
   - An issue that a later step of an approved plan will fix may be marked
     "Deferred", naming that plan step.
   Logged and deferred issues are re-checked at every run and closed when
   fixed and confirmed.
6. **Closing an issue.** When the fix is committed and its tests pass, the
   issue becomes "Fixed, awaiting check". The next review run checks each
   such issue. Only then is its box ticked, its status set to "Closed", and
   the confirming run recorded. Issues the owner accepts stay listed as
   "Accepted" with the reason, and are re-checked at every run.
7. **Merge gate.** A branch is not merged into `dev` while any blocking
   issue from its review runs is "Open" or "Fixed, awaiting check", or before
   the owner has seen every blocking finding. "Logged for later",
   "Deferred", and "Accepted" issues do not block a merge.

## Project-Specific Rules
<!-- Anything that applies only to this project. Global rules (branching, commit format,
     code style, security, planning) already load from ~/.claude/CLAUDE.md. -->
