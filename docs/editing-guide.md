# Editing guide

Almost everything on the site lives in one file: `src/data/site.json`. You change text in that file, and the pages change. You do not need to touch any other file.

Two rules for editing it:

- Every item is wrapped in `{ }`. Items in a list are separated by a comma, but there is **no comma after the last item**.
- Text goes in straight double quotes `"like this"`.

If the build complains after an edit, the cause is nearly always a missing or extra comma. Check the line just above the one it names.

## Add or remove a button (a link)

Every button is one entry in a `links` list. To add a button, add one entry. To remove a button, delete that entry.

On a project, a link has a `label` (the words) and a `url` (the web address):

```json
"links": [
    { "label": "See it on GitHub", "url": "https://github.com/theknoxtech/winnow" },
    { "label": "Latest release", "url": "https://github.com/theknoxtech/winnow/releases/latest" }
]
```

To add a button, put a comma after the last entry and add a new line:

```json
    { "label": "Documentation", "url": "https://example.com/docs" }
```

To remove a button, delete its whole line. If it was the last line, delete the comma on the line above it.

On a lab, a link has a `label` and a `path` (an address on this site, starting with `/`).

On the Projects page these links show as buttons. On the Home page they show as plain text links.

## Add a project

Copy this into the `projects` list (after the last project, with a comma between them) and change the words:

```json
{
    "title": "My New Tool",
    "description": "One sentence about what it does.",
    "tags": ["PowerShell", "Windows"],
    "status": "active",
    "date": "2026-11-20",
    "links": [
        { "label": "See it on GitHub", "url": "https://github.com/theknoxtech/my-new-tool" }
    ],
    "featured": false,
    "order": 5
}
```

- `featured: true` shows it in "A few projects" on the Home page. `false` shows it only on the Projects page.
- `order` is the position (1 is first). Projects with no `order` go after the ones that have one, newest first.
- `status` is a word such as `active`.

To remove a project, delete its whole `{ ... }` block.

## Change tags

Tags are the `"tags"` list on a project. Edit the words:

```json
"tags": ["C#", "Windows Event Log", "Remote Support"]
```

The little tag chips and the filter buttons on the Projects page are built from these words, so changing them here changes them everywhere. Search also uses them.

## Add a lab and its buttons

Copy this into the `labs` list:

```json
{
    "code": "SC-200",
    "name": "Security Operations Analyst practice app",
    "status": "live",
    "updated": "2026-11-20",
    "links": [
        { "label": "SC-200", "path": "/exam_apps/sc-200/" },
        { "label": "KQL Lab", "path": "/exam_apps/sc-200/kql-lab.html" }
    ]
}
```

- Each entry in `links` is one button on the Labs page, going to its own page.
- On the Home page, each lab shows one button, using its code (here SC-200) and the first link.
- The app itself goes in `exam_apps/sc-200/` as a folder with an `index.html`. The folder name is the web address.
- Optional lines: `"description": "..."` for a sentence of text, and `"currentFor": "Current for the October 2026 exam update"` for a note under the title.

## Mark a lab planned or live

Change the `status` line.

- Planned (no page yet): use `"status": "planned"` and leave links empty: `"links": []`. It shows as a plain label, not a button.
- Live: use `"status": "live"` and add at least one entry in `links`.

## Add a certification

Copy this into the `certifications` list. They show on the Portfolio page in the order they are listed, so put the new one where you want it to appear.

```json
{
    "issuer": "Microsoft",
    "name": "Microsoft Certified: Example Associate",
    "earned": "2026-12-01",
    "description": "One or two sentences about what it covers.",
    "verifyLabel": "Verify on Microsoft Learn",
    "verifyUrl": "https://learn.microsoft.com/..."
}
```

`description` is optional. Dates are written year-month-day.

## Update my current job

Find the entry in `experience` that has `"current": true` (it is first in the list). Fill in the lines that still say `[TO SUPPLY ...]`:

```json
{
    "company": "Critical Network Solutions",
    "title": "Systems Engineer II",
    "start": "2025-09",
    "end": "present",
    "location": "Remote",
    "current": true,
    "bullets": [
        "First thing I did, with a number if you have one.",
        "Second thing.",
        "Third thing."
    ],
    "technologies": ["PowerShell", "Microsoft 365", "Intune"]
}
```

`start` is year-month. Use 3 to 5 bullets. The live (production) site will not publish while any `[TO SUPPLY` text is left anywhere in the file, so search the file for it before you publish.

When you change jobs, set the old job's `"current"` to `false`, give it an end month, and put the new job at the top of the list.

## Add an article

Articles are not in `site.json`. Each article is its own Markdown file (a plain text file) in the folder `src/content/blog/`. If that folder does not exist yet, create it.

There are two ways to make an article:

- **One file, no pictures:** `src/content/blog/my-title.md`. The web address becomes `/articles/my-title/`.
- **One folder, with pictures:** `src/content/blog/my-title/index.md`, and the pictures go in the same folder. The web address is still `/articles/my-title/`.

Use lowercase words with dashes in the file or folder name. It becomes the web address.

The top of the file is a header between two lines of three dashes, then the article text:

```markdown
---
title: How I automated BitLocker
date: 2026-12-01
description: One sentence summary.
tags: [PowerShell, BitLocker]
draft: false
---

The article text goes here. A blank line starts a new paragraph.

## A heading

- a list item
- another one
```

- `title`, `date` (year-month-day) and `description` are required. If one is missing or wrong, the build stops and names the file.
- `tags` is optional. Tags look the same as on Projects.
- `draft: true` hides the article everywhere (list, Home, search). Use it while you are still writing, or to hold an article back until a later date. Without `draft`, the article is published. A date in the future does not hide it.

### Add a picture

1. Make the article a folder (`my-title/index.md`) and copy the picture into that folder, for example `bitlocker-policy.png`.
2. In the text, write `![what the picture shows](./bitlocker-policy.png)`.

The words in the square brackets are the **alt text**: a short description for people who cannot see the picture. It is required. If it is empty, the build stops.

Keep each original picture under about 2 MB. The site makes a smaller copy for visitors, but the big original stays in the repository. Only use your own pictures, and check screenshots for private details (names, tenant IDs, addresses) before you commit, because git keeps every old version. Pictures must be files in the article folder: an address that starts with `https://` is not allowed, and the build stops.

### Add a banner picture (optional)

A banner is the wide picture across the top of the article and at the top of its card on the Articles page and on Home. Copy the picture into the article folder and add two lines to the header:

```markdown
cover: ./cover.png
coverAlt: Short description of the picture
```

`coverAlt` is required whenever `cover` is set. An article with no banner gets a plain text card.

### What the build refuses

The build stops, naming the file, if an article has: a picture with no alt text, a `cover` with no `coverAlt`, a picture from another website, a raw `<script>` or `<style>` tag, or a `style=` attribute. This keeps the site safe.

### Preview and publish

1. Preview on your computer with `npm run build && npm run preview` (see "Try it on your computer"), then open `/articles/`.
2. To publish, set `draft: false` (or remove the line), then follow "Publish" below. The article goes live when the pull request is merged into `main`.

## Change the profile text

All in the `profile` block at the top of `site.json`:

- `roleLine`: the line under your name.
- `intro`: the short paragraph on Home.
- `about`: the About text on the Portfolio page. It is a list of paragraphs, each in quotes and separated by commas.
- `location`, `github`, `linkedin`: your location and links.
- `aboutDraftNote`: the "[DRAFT: Jon to review]" note. Set it to an empty `""` once you are happy with the About text.

## Try it on your computer

In a terminal, in the project folder:

```
npm run build && npm run preview
```

Then open http://localhost:4321 in your browser. Press Ctrl+C in the terminal to stop it.

Use this, not `npm run dev`. The lab pages are copied in at build time, and the dev server does not serve them.

To check nothing broke, run `npm test`.

## Publish

Work on the `dev` branch, never directly on `main`.

1. Save your changes, then run:

   ```
   git add -A
   git commit -m "feat(site): describe what you changed"
   git push origin dev
   ```

2. On GitHub, open a pull request from `dev` into `main`. The build runs, and a preview address appears in a comment on the pull request. Check the preview.
3. Merge the pull request. That publishes the live site.

If the build fails with `[TO SUPPLY`, fill in the text it names (see "Update my current job").
