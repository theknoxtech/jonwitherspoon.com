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

Articles are a list called `articles` in `site.json`. It starts empty (`[]`), which shows "no articles yet" on the Home page. To add one:

```json
"articles": [
    {
        "title": "How I automated BitLocker",
        "date": "2026-12-01",
        "description": "A short summary of the article.",
        "tags": ["PowerShell", "BitLocker"],
        "url": "https://example.com/my-article"
    }
]
```

The Home page shows up to three, in the order you list them. The `url` can be any address for now. A full blog on this site has not been built yet.

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
