# Setup guide: putting jonwitherspoon.com online

This guide takes the site from your laptop to the internet. Tick each box as you go. Words in *italics* are explained the first time they appear.

You will use three things:

- **GitHub** stores the site's files and runs the automatic build (*GitHub Actions*).
- **Azure Static Web Apps** (SWA) hosts the finished site. The Free plan is enough.
- **Cloudflare** holds the DNS for jonwitherspoon.com (the address book that points the domain at Azure).

## 1. Create the GitHub repository

- [ ] Turn on two-factor sign-in (2FA) for your GitHub account (Settings > Password and authentication).
- [ ] Create a new repository named `jonwitherspoon.com`. Do not add a README, licence or .gitignore (the project already has them).
- [ ] Choose visibility (see section 2). Recommended: **public**. The site content is public anyway, and a public repository gets the safety features below for free.
- [ ] From the project folder, add the repository as `origin` and push both branches: `main` and `dev`.

## 2. GitHub settings

Public repository (recommended):

- [ ] Settings > Rules > Rulesets: create a ruleset for `main` that requires a pull request and blocks force pushes and deletion.
- [ ] Settings > Code security: turn on **Secret scanning** and **Push protection** (stops you committing a password by accident).
- [ ] Turn on **Dependabot alerts** and **Dependabot security updates**. (`.github/dependabot.yml` already asks for weekly update pull requests against `dev`.)

Private repository (works, with fewer protections):

- [ ] On a Free personal account a private repository has no branch protection rules and no secret scanning. Be careful to merge to `main` only on purpose.
- [ ] Turn on **Dependabot alerts**; they work on private repositories.

Both:

- [ ] Settings > Actions > General > Workflow permissions: choose **Read repository contents permissions** (the workflow asks for more only where it needs it).
- [ ] Same page: under Actions permissions, choose to allow only selected actions, and if you see "Require actions to be pinned to a full-length commit SHA", turn it on. (A *SHA* is a fixed fingerprint of an action's code, so it cannot change underneath you. The workflow already uses them. This option may not appear on every plan; skip it if it is missing.)

## 3. Create the Azure Static Web App

- [ ] Sign in to the Azure portal with multi-factor authentication (MFA) on.
- [ ] Create a new **resource group** (a folder for related Azure things), for example `rg-jonwitherspoon-site`.
- [ ] Create a **Static Web App** in that group: plan type **Free**, deployment source **Other** (not GitHub; our own workflow does the deploying).
- [ ] When it is created, open it and choose **Manage deployment token**. Copy the token. Treat it like a password: anyone who has it can replace your site.

## 4. Add the secret to GitHub

- [ ] In the GitHub repository: Settings > Secrets and variables > Actions > **New repository secret**.
- [ ] Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`. Value: the token. Save.
- [ ] Never paste the token anywhere else (not in files, chats or commits).

## 5. Try it locally, then first deploy

To look at the site on your laptop, run `npm run build && npm run preview` and open http://localhost:4321. Use this rather than `npm run dev`, because the lab pages are copied at build time and the dev server does not serve them. The Projects and Labs pages have a search box, powered by one small file, `public/search.js`.

- [ ] Open a pull request from `dev` into `main`. The workflow builds the site and publishes a **preview** web address (shown in a comment on the pull request). Free plan allows 3 previews at once; previews are public.
- [ ] Open the preview and check the pages: Home, Portfolio, Projects, Labs, MD-102 lab, KQL lab, and a missing page.
- [ ] Production refuses to deploy while any `[TO SUPPLY ...]` placeholder text remains on the site. Fill in every placeholder in `src/data/site.json` first (the build prints which pages still have them).
- [ ] Merge the pull request into `main`. That deploys to the live site address Azure shows on the app's Overview page (ends in `azurestaticapps.net`).

## 6. Custom domains (Azure and Cloudflare)

Plan: only the *apex* `jonwitherspoon.com` (no "www") is an Azure custom domain. Cloudflare sends `www.jonwitherspoon.com` to the apex, so www never reaches Azure. This leaves one of the two free-plan domain slots spare.

Confidence: the Azure and Cloudflare steps follow their documentation. Microsoft has no Cloudflare-specific page, and what happens if you turn the Cloudflare proxy on is not documented (low confidence), so the steps below keep the apex on DNS only.

**Azure (apex only)**

- [ ] In the Static Web App: Custom domains > Add > custom domain on other DNS. Enter `jonwitherspoon.com` and choose **TXT** validation. Azure shows a code; keep the page open.

**Cloudflare DNS (apex)**

- [ ] Cloudflare > the zone > DNS > Records. Add a **TXT** record: name `@`, content = the code from Azure.
- [ ] Add a **CNAME** record: name `@`, target = your app's `*.azurestaticapps.net` address (shown on the Azure Overview page; no `https://`). Cloudflare "flattens" a CNAME at the apex, which is allowed.
- [ ] Set the CNAME to **DNS only** (grey cloud), not Proxied. Azure must see the real record to verify the domain and to renew the certificate later.
- [ ] Wait until Azure shows the domain as validated (usually minutes, up to 72 hours). Azure then issues the HTTPS certificate by itself.

**Cloudflare www redirect**

- [ ] DNS > Records: add an **A** record, name `www`, IPv4 `192.0.2.1`, **Proxied** (orange cloud). This is a placeholder that goes nowhere; it only exists so the redirect can run. Using `192.0.2.1` is a common Cloudflare pattern (medium confidence); follow the dashboard's prompt if it says otherwise.
- [ ] Rules > Redirect Rules > Create rule, using the template "Redirect from WWW to root" (wildcard pattern): request URL `https://www.*`, target `https://${1}`, status **301**, **preserve query string**. Deploy it.

**Cloudflare settings to leave OFF** (they inject script into pages and would break the strict CSP)

- [ ] Rocket Loader: off.
- [ ] Web Analytics automatic beacon injection: off.
- [ ] Email Address Obfuscation (Scrape Shield): off.
- [ ] Auto Minify: off (retired by Cloudflare in 2024; switch off any leftover).
- [ ] Mirage and Zaraz: leave off unless you need them.
- [ ] Cloudflare's own HSTS: leave off, because the site already sends HSTS and two sources would conflict.

**If you later turn the proxy on for the apex (orange cloud)**

- [ ] Set SSL/TLS mode to **Full (strict)**, never Flexible (Flexible can cause redirect loops).
- [ ] Expect Azure's certificate renewal to need checking: renewal needs the domain to resolve to the app over the public internet, and a proxied record resolves to Cloudflare instead (low confidence). Re-check in Azure after a few weeks.
- [ ] Re-run all the checks in section 7.

## 7. Checks after deploying

Run these in a terminal, once for production (your domain) and once for a preview (its address). Replace `HOST`.

```
curl -sI https://HOST/
curl -sI https://HOST/portfolio/
curl -sI https://HOST/exam_apps/md-102/
curl -sI https://HOST/exam_apps/md-102
curl -sI https://HOST/exam_apps/md-102/kql-lab.html
curl -sI https://HOST/nope
curl -sI http://jonwitherspoon.com/
curl -sI https://www.jonwitherspoon.com/
```

- [ ] Every response has: `strict-transport-security`, `x-content-type-options: nosniff`, `referrer-policy`, `permissions-policy`, `x-frame-options: DENY`, `content-security-policy`.
- [ ] The CSP on `/` and `/portfolio/` has **no** `unsafe-inline`.
- [ ] The CSP on the `/exam_apps/...` addresses (with and without the final slash) is the lab one: it contains `script-src 'self' 'unsafe-inline'` and `connect-src 'none'`. Because your apps still load Google Fonts, this CSP also lists `https://fonts.googleapis.com` (in `style-src`) and `https://fonts.gstatic.com` (in `font-src`). The main pages never do.
- [ ] `/nope` returns status 404 and still has the headers.
- [ ] `curl -sI http://jonwitherspoon.com/` redirects to `https://`.
- [ ] `curl -sI https://www.jonwitherspoon.com/` returns `301` with a `location` header pointing to `https://jonwitherspoon.com/`.
- [ ] The headers on the apex still include `content-security-policy` and `strict-transport-security` (only one HSTS header, not two).
- [ ] View the page source of the live site (browser: view-source) and confirm no script or beacon added by Cloudflare appears.
- [ ] Open the live site once in a browser with the developer tools Network tab open: nothing loads from Google or any other outside host on the main pages (the two lab apps load Google Fonts, which is allowed on the lab addresses only).

## 8. Rolling back

- [ ] If a deploy goes wrong, revert the merge on `main` in GitHub (the Revert button on the merged pull request) and merge the revert; the workflow redeploys the previous version.
- [ ] Azure also keeps recent builds under the app's Environments; use that page if GitHub is unavailable.

## 9. Resetting the deploy token

Do this if the token may have leaked, or every year as housekeeping.

- [ ] Azure portal > the Static Web App > Manage deployment token > **Reset token**. Copy the new one.
- [ ] Update the GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` with the new value.
- [ ] Re-run the latest workflow to confirm it still deploys.

## 10. Adding another practice lab later

Your study apps are yours; the site only hosts them. No configuration change is needed: the build copies the top-level HTML files of every `exam_apps/<code>/` folder into the site, and one header rule, `/exam_apps*`, covers every lab.

- [ ] Create `exam_apps/<code>/` (for example `exam_apps/sc-300/`) with its `index.html` beside its `source/` folder, as in `exam_apps/md-102/`. The folder name is the web address, `/exam_apps/<code>/`. Only `.html` files directly in that folder are published; `source/`, scripts and notes are not.
- [ ] Add an entry to `labs[]` in `src/data/site.json` (see `docs/editing-guide.md`). Required: `code` and `name`. Every button is one entry in the lab's `links` list, each with a `label` and a `path` (for example `/exam_apps/az-104/`). Optional: `status` (`live`, `in-progress` or `planned`; if missing, a lab with links shows as live and one without shows as planned), `updated`, `description` and `currentFor`. A minimal entry:

```
{
    "code": "AZ-104",
    "name": "Azure Administrator practice app",
    "status": "live",
    "links": [
        { "label": "AZ-104", "path": "/exam_apps/az-104/" }
    ]
}
```

- [ ] Run `npm run build`; the output lists each lab file copied. Then `npm run preview` and open `/exam_apps/<code>/` in a browser. Check that it loads and that progress saves.
- [ ] After deploying, run the `curl -sI` checks from section 7 for the new address and confirm the lab CSP is present.
