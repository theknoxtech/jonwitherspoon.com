# Round 1: UX specialist

Untrusted content: none (old-site files and md-102 files hold only content and styles).

## 1. Who uses it
Recruiters/hiring managers skim on a phone (current role, history, certs in under a minute); peers open projects and labs; Jon returns to the labs to study and edits content files in Astro.

## 2. Proposed interface
**Page map (must):** `/` Home, `/work/`, `/projects/` plus `/projects/<slug>/`, `/labs/`, `/md-102/` (existing app, unchanged path).
- Nav (must): name left; Work, Projects, Labs right, plus GitHub and LinkedIn with text labels for screen readers. No hamburger.
- `/work/` (must): one scrolling page with anchored sections (Experience, Skills, Certifications, Education). Replaces the old JS tabs.

**Home (must):** GitHub avatar (96px, square, small radius), name, one-line role in monospace, 2-sentence intro. A **Now** block: current role at Critical Network Solutions and "Studying: MD-102 -> open lab". Then 3 featured projects and footer.

**Experience (must):** changelog-style list. Monospace dates in a left column (`2025-09 -> present`), role and company right, bullets and technologies. Critical Network Solutions first with a `current` label.

**Projects (must):** data-driven cards (title, one line, tags, status) from a content collection seeded with the 5 old project notes. `featured` and `order` choose what Home shows.

**Labs hub (must):** one row per app from a data file (adding SC-300 = one entry). Row: exam code in large monospace, full name, status (`live` / `in progress` / `planned`), last-updated date, Open link. KQL Lab under the MD-102 row as a companion. Filter only once there are more than 8 apps.

**md-102 framing (must):** its own full page in the same tab, no iframe. `/md-102/` must never change (saved progress is tied to the URL). Add a one-line "<- Labs" link to `app.html` and rebuild.

**Theme without the AI look:**
- Type (must): IBM Plex Sans and IBM Plex Mono (md-102 already uses them). Monospace only for dates, exam codes, labels.
- Colour (must): one accent. Warm off-white paper in light, graphite in dark. Signal-amber accent (about #B26B00 light, #E8A33D dark), AA checked. Nothing violet or blue-on-black.
- Detail (must): 1px rules, 2-4px radius, no shadows, gradients, glow, blur, typing animations or emoji. Numbered section headers (`01 / Experience`). Footer `built <date> · <commit>` at build time.
- Layout (should): left-aligned, uneven two-column grid, no centred hero.

**Light/dark (must):** follow system setting only, no toggle (md-102 has none either).

**Accessibility (must):** AA contrast both themes, visible focus ring, skip link, one h1 per page, real links not scripted tabs, `prefers-reduced-motion`, avatar alt text.

**Mobile (must):** one column under 640px, dates above role, 44px tap targets, no sideways scroll at 390px.

**Placeholders (must):** visibly `[TO SUPPLY: ...]` with a dashed amber outline; also a build warning.

## 3. Edge cases
- Unknown URL: custom 404 with links to Work, Projects, Labs (must).
- Planned lab with no page: no link, "in progress" note (must).
- Avatar fails to load: name still reads well (must).
- JavaScript off: every page works (must).

## 4. Assumptions
- Save the avatar into the repo (recommended yes).
- Leave out SiliconScripted branding; small footer link to the old site (recommended yes).
- Rewrite the old About text; Jon reviews (typos, mentions Silicon Scripted) (recommended yes).
- Resume PDF not in the prototype.

**Content Jon must supply:** CNS start date, location or remote, 3-5 bullets, technologies; new About text; which projects count as best (Budgetry is personal finance; confirm OK to show publicly); current certification and exam targets; contact method (email or LinkedIn only).

## 5. Recon requests
- Confirm the stable URL for downloading the GitHub avatar for `theknoxtech` (e.g. `https://github.com/theknoxtech.png?size=460`).
