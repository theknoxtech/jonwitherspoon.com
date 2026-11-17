import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MAIN_PAGES = {
    '/': 'index.html',
    '/portfolio/': 'portfolio/index.html',
    '/projects/': 'projects/index.html',
    '/labs/': 'labs/index.html',
    '/404': '404.html',
};

function readPage(file) {
    const path = join(DIST, file);
    assert.ok(existsSync(path), `dist/${file} is missing (run "npm run build" first)`);
    return readFileSync(path, 'utf8');
}

function readDistCss() {
    const home = readPage('index.html');
    const href = /<link rel="stylesheet" href="([^"]+)"/.exec(home)[1];
    return readFileSync(join(DIST, href), 'utf8');
}

function tokens(block) {
    return Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((match) => [match[1], match[2]]));
}

function luminance(hex) {
    const [red, green, blue] = [1, 3, 5]
        .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
        .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
}

function countMatches(text, pattern) {
    return (text.match(pattern) || []).length;
}

test('dist/ exists', () => {
    assert.ok(existsSync(DIST), 'dist/ is missing: run "npm run build" before the tests');
});

test('dist/ is not older than the sources it was built from (run "npm run build" first)', () => {
    const newest = (directory) => readdirSync(directory, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .reduce((latest, entry) => Math.max(latest, statSync(join(entry.parentPath, entry.name)).mtimeMs), 0);
    const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
    const builtAt = statSync(join(DIST, 'index.html')).mtimeMs;
    for (const name of ['src', 'public']) {
        assert.ok(newest(join(sourceRoot, name)) <= builtAt + 1000, `dist/index.html is older than ${name}/: the build is stale, run "npm run build"`);
    }
});

test('all required main pages are built', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        assert.ok(existsSync(join(DIST, file)), `dist/${file} is missing`);
    }
});

test('portfolio page lists the current role first, with a visible placeholder', () => {
    const html = readPage('portfolio/index.html');
    const roles = [...html.matchAll(/class="entry[^"]*"/g)];
    assert.ok(roles.length >= 5, 'expected five experience entries');
    const experience = html.slice(html.indexOf('id="panel-experience"'), html.indexOf('id="panel-projects"'));
    assert.ok(experience.indexOf('Critical Network Solutions') > 0, 'current role must be in the Experience panel');
    const order = ['Critical Network Solutions', 'Enable Resource Group', 'Southeastern Computer Associates', 'DWK Lifesciences', 'K12'];
    let lastIndex = -1;
    for (const company of order) {
        const index = experience.indexOf(company, lastIndex + 1);
        assert.ok(index > lastIndex, `${company} is missing or out of order`);
        lastIndex = index;
    }
    assert.match(html, /current/);
    assert.match(html, /class="placeholder"[^>]*>\[TO SUPPLY:/);
});

test('portfolio page has certifications with verify links, past exams, education', () => {
    const html = readPage('portfolio/index.html');
    assert.equal(countMatches(html, /class="cert"/g), 7, 'expected seven certifications');
    assert.equal(countMatches(html, /class="exam"/g), 1, 'expected one past exam');
    assert.match(html, /Verify on/);
    const sc300 = html.slice(html.indexOf('Identity and Access Administrator Associate'));
    assert.ok(sc300.length > 0, 'SC-300 certification missing');
    assert.match(sc300.slice(0, sc300.indexOf('</li>')), /Earned 29 Jul 2026/);
    assert.match(sc300.slice(0, sc300.indexOf('</li>')), /href="https:\/\/learn\.microsoft\.com\/api\/credentials\/share\/en-us\/JonWitherspoon-9260\/AFCED976DD341750\?sharingId=76B3F23CC8D338C8"/);
    assert.doesNotMatch(html, /Microsoft Identity and Access Administrator \(SC-300\)/, 'duplicate past-exam entry');
    assert.match(html, /Western Governors University/);
});

test('projects page shows four projects', () => {
    const html = readPage('projects/index.html');
    assert.equal(countMatches(html, /class="card"/g), 4);
});

test('home shows the profile card with avatar, three featured projects and the study-labs strip', () => {
    const html = readPage('index.html');
    assert.match(html, /<img class="avatar" src="\/avatar\.jpg" width="80" height="80" alt="/);
    assert.equal(countMatches(html, /class="card"/g), 3);
    assert.match(html, /href="\/exam_apps\/md-102\/"/);
});

test('labs page shows MD-102 and KQL lab, planned lab has no link', () => {
    const html = readPage('labs/index.html');
    assert.match(html, /MD-102/);
    assert.match(html, /href="\/exam_apps\/md-102\/"/);
    assert.match(html, /href="\/exam_apps\/md-102\/kql-lab\.html"/);
    assert.match(html, /KQL Lab/);
    const planned = html.slice(html.indexOf('SC-300'));
    assert.ok(planned.length > 0, 'SC-300 planned entry missing');
    assert.doesNotMatch(planned.slice(0, planned.indexOf('</li>')), /<a /);
    assert.doesNotMatch(html, /href="\/exam_apps\/sc-300/);
});

test('main pages have no inline script, no inline style, no style=, no external-host script', () => {
    for (const [route, file] of Object.entries(MAIN_PAGES)) {
        const html = readPage(file);
        for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
            assert.match(script[1], /\ssrc="\/(search|tabs)\.js"/, `${route}: script that is not /search.js or /tabs.js`);
            assert.equal(script[2].trim(), '', `${route}: inline script content`);
            assert.doesNotMatch(script[1], /type="module"/);
        }
        assert.doesNotMatch(html, /<script\b(?![^>]*\ssrc=)/i, `${route} has <script without src`);
        assert.doesNotMatch(html, /<script[^>]*\ssrc="(https?:)?\/\//i, `${route} external script`);
        assert.doesNotMatch(html, /<style/i, `${route} has <style`);
        assert.doesNotMatch(html, /\sstyle=/i, `${route} has style=`);
    }
});

test('every page loads /search.js (deferred); only /portfolio/ also loads /tabs.js', () => {
    for (const [route, file] of Object.entries(MAIN_PAGES)) {
        const html = readPage(file);
        assert.match(html, /<script[^>]*\ssrc="\/search\.js"[^>]*\sdefer/, `${route} search.js reference`);
        assert.equal(/<script[^>]*\ssrc="\/tabs\.js"[^>]*\sdefer/.test(html), route === '/portfolio/', `${route} tabs.js reference`);
    }
    assert.ok(existsSync(join(DIST, 'search.js')) && existsSync(join(DIST, 'tabs.js')));
});

test('search.js and tabs.js use no eval or innerHTML; search.js fetches only its own index', () => {
    const script = readFileSync(join(DIST, 'search.js'), 'utf8');
    assert.doesNotMatch(script, /\beval\(|new Function|innerHTML|outerHTML|insertAdjacentHTML|document\.write|XMLHttpRequest|WebSocket|sendBeacon|localStorage/);
    const fetchCalls = script.match(/\bfetch\(/g) ?? [];
    assert.equal(fetchCalls.length, 1);
    assert.match(script, /fetch\('\/search-index\.json'/);
    const tabs = readFileSync(join(DIST, 'tabs.js'), 'utf8');
    assert.doesNotMatch(tabs, /\beval\(|new Function|innerHTML|outerHTML|insertAdjacentHTML|document\.write|\bfetch\(|XMLHttpRequest/);
});

test('projects and labs have a labelled search box, a live count and a no-match message', () => {
    for (const file of ['projects/index.html', 'labs/index.html']) {
        const html = readPage(file);
        const labelFor = /<label[^>]*\sfor="([^"]+)"[^>]*>[^<]+<\/label>/.exec(html)?.[1];
        assert.ok(labelFor, `${file} search label`);
        assert.match(html, new RegExp(`<input[^>]*type="search"[^>]*\\sid="${labelFor}"`), `${file} labelled search input`);
        assert.match(html, /aria-live="polite"/, `${file} live count`);
        assert.match(html, /No matches/, `${file} no-match message`);
        assert.match(html, /data-search-clear/, `${file} clear button`);
        assert.match(html, /data-search-empty[^>]*\shidden|\shidden[^>]*data-search-empty/, `${file} no-match message hidden at first`);
    }
});

test('every project card and lab row exposes lowercase data-search text', () => {
    const projects = readPage('projects/index.html');
    const cards = [...projects.matchAll(/<li class="card" data-search="([^"]+)"/g)];
    assert.equal(cards.length, 4);
    assert.match(cards[0][1], /winnow/);
    assert.match(cards[0][1], /c#/);
    assert.match(cards[0][1], /active/);
    const labs = readPage('labs/index.html');
    const rows = [...labs.matchAll(/<li class="lab" data-search="([^"]+)"/g)];
    assert.equal(rows.length, 3);
    assert.match(rows[0][1], /october 2026/);
    assert.match(rows[0][1], /md-102/);
    assert.match(rows[0][1], /kql lab/);
    assert.match(rows[0][1], /live/);
    assert.match(rows[1][1], /planned/);
    for (const [, value] of [...cards, ...rows]) assert.equal(value, value.toLowerCase());
});

test('projects page offers tag filter buttons; search panel is hidden by CSS until the script adds a class', () => {
    const html = readPage('projects/index.html');
    assert.ok(countMatches(html, /<button[^>]*aria-pressed="false"[^>]*data-tag=/g) >= 5, 'tag filter buttons');
    const css = readDistCss();
    assert.match(css, /\.search-panel\{[^}]*display:none/);
    assert.match(css, /\.has-search \.search-panel\{[^}]*display:block/);
});

test('Budgetry is gone from every built page, the stylesheet and the script', () => {
    for (const file of readdirSync(DIST, { recursive: true })) {
        if (!/\.(html|css|js|json|txt)$/.test(file) || file.startsWith('exam_apps')) continue;
        assert.doesNotMatch(readFileSync(join(DIST, file), 'utf8'), /budgetry|plaid/i, file);
    }
    assert.doesNotMatch(readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'), /budgetry/i);
});

test('home hero has two same-size buttons in one row: View projects (primary) and Portfolio; no About button or link', () => {
    const html = readPage('index.html');
    const hero = html.slice(html.indexOf('<section class="hero"'), html.indexOf('</section>'));
    const row = /<div class="button-row">([\s\S]*?)<\/div>/.exec(hero)[1];
    assert.match(row, /<a class="button button-primary" href="\/projects\/">View projects<\/a>\s*<a class="button button-secondary" href="\/portfolio\/">Portfolio<\/a>/);
    assert.equal(countMatches(hero, /class="button[ "]/g), 2);
    assert.doesNotMatch(html, /About me|<summary>About<\/summary>|>About</);
    assert.match(hero, /<p class="role-line mono">Systems Engineer II at Critical Network Solutions<\/p>/);
    assert.match(html, /<meta name="description" content="[^"]*Systems Engineer II at Critical Network Solutions/);
    assert.match(readPage('portfolio/index.html'), /<meta name="description" content="[^"]*Systems Engineer II at Critical Network Solutions/);
});

test('home project cards use plain text links with the same labels as site.json; Winnow has two', () => {
    const html = readPage('index.html');
    const section = html.slice(html.indexOf('id="latest-heading"'), html.indexOf('<section class="lab-strip"'));
    const cards = section.split('<li class="card">').slice(1);
    assert.equal(cards.length, 3);
    for (const card of cards) {
        assert.doesNotMatch(card, /class="button/, 'no button styling inside home cards');
        assert.match(card, /class="text-link"[^>]*>See it on GitHub</);
    }
    const winnow = cards.find((card) => card.includes('Winnow'));
    assert.match(winnow, /class="text-link"[^>]*>Latest release</);
    assert.match(winnow, /href="https:\/\/github\.com\/theknoxtech\/winnow\/releases\/latest"/);
});

test('every project link reads "See it on GitHub" (plus "Latest release" for Winnow) and is a button on /projects/', () => {
    const site = JSON.parse(readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'));
    for (const project of site.projects) assert.ok(project.links.some((link) => link.label === 'See it on GitHub'), project.title);
    const html = readPage('projects/index.html');
    assert.equal(countMatches(html, /class="button button-secondary"[^>]*>See it on GitHub</g), 4);
    assert.equal(countMatches(html, /class="button button-secondary"[^>]*>Latest release</g), 1);
    assert.doesNotMatch(html, /GitHub profile|>Repository</);
    assert.ok(!('url' in site.projects[0]) && !('linkLabel' in site.projects[0]), 'old url/linkLabel fields are gone');
});

test('study labs strip: one button per lab with a link (the button is the link); labs without links are status pills', () => {
    const html = readPage('index.html');
    const strip = html.slice(html.indexOf('<section class="lab-strip"'), html.indexOf('</section>', html.indexOf('<section class="lab-strip"')));
    assert.match(strip, /<a class="button button-secondary" href="\/exam_apps\/md-102\/">MD-102<\/a>/);
    assert.equal(countMatches(strip, /<a /g), 1, 'only the MD-102 button is a link');
    assert.match(strip, /<span class="chip chip-amber mono">SC-300 planned<\/span>/);
    assert.match(strip, /<span class="chip chip-amber mono">AZ-104 planned<\/span>/);
    assert.doesNotMatch(strip, /All labs|Open MD-102/);
});

test('labs page: every lab link is a button to its page, same style and size; AZ-104 is planned without a button; currentFor shows', () => {
    const html = readPage('labs/index.html');
    assert.match(html, /<a class="button button-primary" href="\/exam_apps\/md-102\/">MD-102<\/a>/);
    assert.match(html, /<a class="button button-primary" href="\/exam_apps\/md-102\/kql-lab\.html">KQL Lab<\/a>/);
    assert.doesNotMatch(html, /class="companions"|class="text-link"/);
    assert.match(html, /Current for the October 2026 exam update/);
    const az = html.slice(html.indexOf('AZ-104'));
    assert.match(az.slice(0, az.indexOf('</li>')), /Microsoft Azure Administrator/);
    assert.doesNotMatch(az.slice(0, az.indexOf('</li>')), /<a /);
    assert.match(az.slice(0, az.indexOf('</li>')), /status status-planned/);
});

test('home layout: compact hero with profile card, Articles (empty state), A few projects, Study labs strip', () => {
    const html = readPage('index.html');
    assert.match(html, /<h1 id="page-title">Hi, I(&#39;|')m Jon<\/h1>/);
    assert.match(html, /<aside class="profile-card" aria-label="Profile">/);
    assert.match(html, /<h2[^>]*>(?:<span[^>]*>[^<]*<\/span> )?Articles<\/h2>/);
    assert.match(html, /<p class="empty-state">Articles are on the way\.<\/p>/);
    assert.doesNotMatch(html, /class="article-card"/, 'no fake posts');
    assert.match(html, /A few projects/);
    assert.match(html, /<section class="lab-strip"[\s\S]*Study labs[\s\S]*href="\/labs\/"/);
    assert.ok(html.indexOf('Articles') < html.indexOf('A few projects') && html.indexOf('A few projects') < html.indexOf('Study labs'), 'section order');
    assert.doesNotMatch(html, /Browse by topic|topic-link|>Now<|Featured project|class="glass-cta"/);
    assert.doesNotMatch(html, /\/blog\//, 'no blog route');
    assert.ok(!existsSync(join(DIST, 'blog')));
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
});

test('profile card shows location and small icon+label links (not buttons); portfolio card shows the current role line', () => {
    for (const file of ['index.html', 'portfolio/index.html']) {
        const html = readPage(file);
        const card = html.slice(html.indexOf('<aside class="profile-card"'), html.indexOf('</aside>'));
        assert.match(card, /Knoxville, TN/);
        assert.match(card, /class="social-link"[^>]*>(?:<span class="icon"[^>]*>[\s\S]*?<\/span>)?(GitHub)</);
        assert.match(card, /class="social-link"[^>]*>(?:<span class="icon"[^>]*>[\s\S]*?<\/span>)?(LinkedIn)</);
        assert.doesNotMatch(card, /class="button/);
    }
    const portfolio = readPage('portfolio/index.html');
    const card = portfolio.slice(portfolio.indexOf('<aside class="profile-card"'), portfolio.indexOf('</aside>'));
    assert.match(card, /Systems Engineer II at Critical Network Solutions/);
    assert.match(portfolio, /class="social-link"[^>]*>Credly</);
    assert.match(portfolio, /class="social-link"[^>]*>Microsoft Learn</);
});

test('project chips and filters come from the tags in site.json (change a tag there and they follow)', () => {
    const site = JSON.parse(readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'));
    const tags = [...new Set(site.projects.flatMap((project) => project.tags))];
    const projects = readPage('projects/index.html');
    const filters = [...projects.matchAll(/data-tag="([^"]+)"/g)].map((match) => match[1]).sort();
    assert.deepEqual(filters, tags.map((tag) => tag.toLowerCase()).sort());
    for (const tag of tags) assert.ok(projects.includes(`>${tag.replace('&', '&amp;')}</li>`) || projects.includes(`>${tag}</`), `chip for ${tag}`);
});

test('articles section is driven by the blog collection (no articles in this build), and site.json has no articles list', () => {
    const site = JSON.parse(readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'));
    assert.ok(!('articles' in site), 'the old articles list is removed from site.json');
    assert.match(readPage('index.html'), /<p class="empty-state">Articles are on the way\.<\/p>/);
    assert.match(readPage('articles/index.html'), /<p class="empty-state">/);
});

test('header has monogram, icon links with text labels and a search button hidden until JS; dialog is present', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        const html = readPage(file);
        assert.match(html, /<span class="monogram" aria-hidden="true">J<\/span>/);
        assert.match(html, /<a class="icon-link" href="https:\/\/github\.com\/theknoxtech"[^>]*>(?:(?!<\/a>).)*<span class="visually-hidden">GitHub<\/span>/);
        assert.match(html, /<a class="icon-link" href="https:\/\/www\.linkedin\.com[^>]*>(?:(?!<\/a>).)*<span class="visually-hidden">LinkedIn<\/span>/);
        assert.match(html, /<button class="search-trigger" type="button" data-quick-open aria-haspopup="dialog">/);
        assert.match(html, /<kbd class="shortcut mono" data-shortcut>Ctrl K<\/kbd>/);
        assert.match(html, /<dialog class="quick-search" data-quick-dialog aria-label="Search projects and labs">/);
        assert.match(html, /<input[^>]*type="search"[^>]*id="quick-search-input"[^>]*data-quick-input/);
        assert.match(html, /data-quick-status aria-live="polite"/);
    }
    const css = readDistCss();
    assert.match(css, /\.search-trigger\{[^}]*display:none/);
    assert.match(css, /\.has-quick-search \.search-trigger\{[^}]*display:inline-flex/);
});

test('search-index.json lists the four projects and the labs, same-origin urls only, no Budgetry', () => {
    const raw = readFileSync(join(DIST, 'search-index.json'), 'utf8');
    const entries = JSON.parse(raw);
    assert.equal(entries.filter((entry) => entry.kind === 'project').length, 4);
    assert.equal(entries.filter((entry) => entry.kind === 'lab').length, 3);
    assert.ok(entries.find((entry) => entry.title.includes('MD-102')).description.includes('October 2026'));
    for (const entry of entries) {
        assert.ok(entry.title && typeof entry.description === 'string' && Array.isArray(entry.tags), JSON.stringify(entry));
        assert.match(entry.url, /^(\/(?!\/)|https:\/\/)/, entry.url);
    }
    assert.doesNotMatch(raw, /budgetry|plaid|TO SUPPLY/i);
    assert.ok(entries.some((entry) => entry.title.includes('MD-102') && entry.url === '/exam_apps/md-102/'));
});

test('footer is one compact row: brand, four nav links, icon links, copyright, build stamp, old-site link; no Topics column', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        const html = readPage(file);
        const footer = html.slice(html.indexOf('<footer class="site-footer">'), html.indexOf('</footer>'));
        assert.ok(footer.length > 0, `${file} footer`);
        assert.match(footer, /<p class="footer-brand">/);
        assert.match(footer, /<nav aria-label="Footer">/);
        assert.equal(countMatches(footer, /<ul class="footer-list">[\s\S]*?<\/ul>/g), 1);
        for (const label of ['Portfolio', 'Projects', 'Labs', 'Articles']) assert.match(footer, new RegExp(`<a href="/${label.toLowerCase()}/">${label}</a>`));
        assert.match(footer, /class="footer-social"/);
        assert.match(footer, /&copy; 2026 Jon Witherspoon|© 2026 Jon Witherspoon/);
        assert.match(footer, /built \d{4}-\d{2}-\d{2} · (local|[0-9a-f]{7})/);
        assert.match(footer, /href="https:\/\/siliconscripted\.com"/);
        assert.doesNotMatch(footer, /Topics|Navigation<|footer-grid/);
    }
});

test('footer CSS is slim: one flex row, small text, no tall padding', () => {
    const css = readFileSync(new URL('../src/styles/site.css', import.meta.url), 'utf8');
    const rule = /\.site-footer \{([^}]*)\}/.exec(css.slice(css.indexOf('.footer-brand') - 1200))[1];
    assert.match(rule, /display:\s*flex/);
    assert.match(rule, /padding-top:\s*0\.25rem/);
    assert.match(rule, /font-size:\s*0\.8125rem/);
});

test('experience timeline has no date pills: dates are plain monospace text under the role', () => {
    const css = readFileSync(new URL('../src/styles/site.css', import.meta.url), 'utf8');
    const dates = /\.entry-dates \{([^}]*)\}/.exec(css)[1];
    assert.doesNotMatch(dates, /border-radius|background/);
    const html = readPage('portfolio/index.html');
    const entry = /<li class="entry">([\s\S]*?)<\/li><li class="entry">/.exec(html)[1];
    assert.ok(entry.indexOf('<h3>') < entry.indexOf('entry-dates mono'), 'dates come after the role heading');
    assert.ok(entry.indexOf('class="meta"') < entry.indexOf('entry-dates mono'), 'dates come under the company line');
});

test('no page links to /work/ and the nav says Portfolio', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        const html = readPage(file);
        assert.doesNotMatch(html, /\/work\//, `${file} still mentions /work/`);
        assert.match(html, /<a href="\/portfolio\/"[^>]*>Portfolio<\/a>/);
    }
    assert.ok(!existsSync(join(DIST, 'work')), 'dist/work must not exist');
});

test('portfolio page: six tabs in order with ARIA wiring, six panels present, tab bar hidden by CSS until JS', () => {
    const html = readPage('portfolio/index.html');
    const names = ['about', 'skills', 'experience', 'projects', 'certifications', 'education'];
    const labels = ['About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Education'];
    assert.match(html, /<div class="tablist" role="tablist" aria-label="Portfolio sections" data-tablist>/);
    let last = -1;
    names.forEach((name, index) => {
        const tab = new RegExp(`<button class="tab" type="button" role="tab" id="tab-${name}" aria-controls="panel-${name}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${labels[index]}</button>`);
        assert.match(html, tab, `tab ${name}`);
        const position = html.search(tab);
        assert.ok(position > last, `tab ${name} out of order`);
        last = position;
        assert.match(html, new RegExp(`<section class="tab-panel" id="panel-${name}" role="tabpanel" aria-labelledby="tab-${name}">\\s*<h2`), `panel ${name}`);
        assert.ok(!new RegExp(`id="panel-${name}"[^>]*hidden`).test(html), `panel ${name} must be visible without JS`);
    });
    assert.match(html, /\[DRAFT: Jon to review\]/);
    assert.match(html, /href="\/projects\/">See all projects</);
    assert.match(html, /<details class="past-exams">/);
    const css = readDistCss();
    assert.match(css, /\.tabs-wrapper\{[^}]*display:none/);
    assert.match(css, /\.has-tabs \.tabs-wrapper\{[^}]*display:block/);
    assert.match(css, /\.tab\{[^}]*min-height:40px/);
});

test('tabs.js implements arrow, Home and End keys, roving tabindex and the URL hash', () => {
    const script = readFileSync(join(DIST, 'tabs.js'), 'utf8');
    for (const needle of ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'tabIndex', 'aria-selected', 'hashchange', 'location.hash', 'has-tabs']) assert.ok(script.includes(needle), needle);
});

test('the draft note sits in the About panel on /portfolio/, which is visible without JavaScript', () => {
    const html = readPage('portfolio/index.html');
    const about = html.slice(html.indexOf('id="panel-about"'), html.indexOf('id="panel-skills"'));
    assert.match(about, /\[DRAFT: Jon to review\]/);
    assert.doesNotMatch(about, /hidden/);
});

test('contrast: text, buttons, chips, badges and controls meet WCAG AA in light and dark', () => {
    const css = readFileSync(new URL('../src/styles/site.css', import.meta.url), 'utf8');
    const darkStart = css.indexOf('@media (prefers-color-scheme: dark)');
    const light = tokens(css.slice(0, darkStart));
    const dark = { ...light, ...tokens(css.slice(darkStart, css.indexOf('*,')) ) };
    const textPairs = [
        ['ink', 'background'], ['ink', 'surface'], ['ink-muted', 'background'], ['ink-muted', 'surface'],
        ['accent-text', 'background'], ['accent-text', 'surface'], ['ink', 'hero-tint'], ['ink', 'hero-tint-end'], ['ink-muted', 'hero-tint-end'], ['accent-text', 'hero-tint-end'], ['accent-two', 'hero-tint-end'], ['ink-muted', 'hero-tint'],
        ['accent-text', 'hero-tint'], ['button-text', 'button-fill'], ['button-text', 'button-hover'],
        ['accent-text', 'tint'], ['accent-two', 'tint'], ['accent-two', 'background'], ['accent-two', 'surface'], ['accent-two', 'hero-tint'], ['ink', 'tint'],
        ['chip-blue-text', 'chip-blue-fill'], ['chip-teal-text', 'chip-teal-fill'],
        ['chip-amber-text', 'chip-amber-fill'], ['chip-rose-text', 'chip-rose-fill'],
        ['status-live-text', 'status-live-fill'], ['status-progress-text', 'status-progress-fill'],
        ['status-planned-text', 'status-planned-fill'],
    ];
    // --glass-worst is the brightest likely backdrop under a glass panel (an orb at full strength plus the glass fill).
    textPairs.push(['ink', 'glass-worst'], ['ink-muted', 'glass-worst'], ['accent-text', 'glass-worst'], ['accent-two', 'glass-worst']);
    const largeTextPairs = [['heading-start', 'glass-worst'], ['heading-mid', 'glass-worst'], ['heading-end', 'glass-worst'], ['heading-start', 'background'], ['heading-mid', 'background'], ['heading-end', 'background'], ['heading-mid', 'hero-tint'], ['heading-end', 'hero-tint']];
    const graphicPairs = [['control-border', 'surface'], ['control-border', 'background'], ['accent', 'background'], ['accent', 'surface']];
    for (const [mode, palette] of [['light', light], ['dark', dark]]) {
        for (const [foreground, background] of textPairs) {
            assert.ok(palette[foreground] && palette[background], `${mode}: --${foreground} or --${background} missing`);
            assert.ok(contrastRatio(palette[foreground], palette[background]) >= 4.5, `${mode}: ${foreground} on ${background} = ${contrastRatio(palette[foreground], palette[background]).toFixed(2)}`);
        }
        for (const [foreground, background] of largeTextPairs) {
            assert.ok(contrastRatio(palette[foreground], palette[background]) >= 3, `${mode}: heading ${foreground} on ${background} = ${contrastRatio(palette[foreground], palette[background]).toFixed(2)}`);
        }
        for (const [foreground, background] of graphicPairs) {
            assert.ok(contrastRatio(palette[foreground], palette[background]) >= 3, `${mode}: ${foreground} vs ${background}`);
        }
    }
});
test('main pages have one h1, a title, a description and the right canonical', () => {
    for (const [route, file] of Object.entries(MAIN_PAGES)) {
        const html = readPage(file);
        assert.equal(countMatches(html, /<h1[\s>]/g), 1, `${route} h1 count`);
        assert.match(html, /<title>[^<]+<\/title>/, `${route} title`);
        assert.match(html, /<meta name="description" content="[^"]+"/, `${route} description`);
        const expected = route === '/404' ? '/404.html' : route;
        assert.ok(
            html.includes(`<link rel="canonical" href="https://jonwitherspoon.com${expected}"`),
            `${route} canonical`,
        );
    }
});

test('footer has build stamp and old-site link; skip link and nav exist', () => {
    const html = readPage('index.html');
    assert.match(html, /built \d{4}-\d{2}-\d{2} · (local|[0-9a-f]{7})/);
    assert.match(html, /href="https:\/\/siliconscripted\.com"/);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /href="https:\/\/github\.com\/theknoxtech"/);
    assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/witherspoon84\/"/);
});

test('external links never use target=_blank and carry rel noopener', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        const html = readPage(file);
        assert.doesNotMatch(html, /target="_blank"/);
        for (const anchor of html.matchAll(/<a [^>]*href="https?:\/\/[^"]*"[^>]*>/g)) {
            assert.match(anchor[0], /rel="noopener noreferrer"/, anchor[0]);
        }
    }
});

test('fonts and avatar are local files and referenced locally', () => {
    for (const name of ['IBMPlexSans-Regular', 'IBMPlexSans-SemiBold', 'IBMPlexMono-Regular', 'IBMPlexMono-Medium']) {
        const path = join(DIST, 'fonts', `${name}.woff2`);
        assert.ok(existsSync(path), `${name}.woff2 missing in dist`);
        assert.ok(statSync(path).size > 5000);
    }
    assert.ok(existsSync(join(DIST, 'fonts', 'LICENSE.txt')));
    assert.ok(existsSync(join(DIST, 'avatar.jpg')));
    const home = readPage('index.html');
    const cssFiles = [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(cssFiles.length >= 1, 'external stylesheet link expected');
    const css = readFileSync(join(DIST, cssFiles[0]), 'utf8');
    for (const name of ['IBMPlexSans-Regular', 'IBMPlexSans-SemiBold', 'IBMPlexMono-Regular', 'IBMPlexMono-Medium']) {
        assert.ok(css.includes(`/fonts/${name}.woff2`), `${name} not referenced in css`);
    }
    assert.match(css, /font-display:\s*swap/);
});

test('no external hosts in src, href (non-anchor) or url() of main pages', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        const html = readPage(file);
        assert.doesNotMatch(html, /\ssrc="(https?:)?\/\//, `${file} external src`);
        for (const tag of html.matchAll(/<(link|img|source|iframe|video|audio)\b[^>]*>/g)) {
            if (tag[0].includes('rel="canonical"')) continue;
            assert.doesNotMatch(tag[0], /(src|href)="(https?:)?\/\//, `${file}: ${tag[0]}`);
        }
    }
    const home = readPage('index.html');
    for (const href of home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
        const css = readFileSync(join(DIST, href[1]), 'utf8');
        assert.doesNotMatch(css, /url\(\s*['"]?(https?:)?\/\//, 'external url() in css');
        assert.doesNotMatch(css, /@import/);
    }
});

test('no phone, address or date of birth patterns in main pages', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        const html = readPage(file);
        assert.doesNotMatch(html, /\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/);
        assert.doesNotMatch(html, /date of birth|\bDOB\b/i);
    }
});

test('contrast: white text on the primary button gradient meets 4.5:1 at every point of the gradient', () => {
    const css = readFileSync(new URL('../src/styles/site.css', import.meta.url), 'utf8');
    const palette = tokens(css.slice(0, css.indexOf('@media (prefers-color-scheme: dark)')));
    const stops = ['gradient-start', 'gradient-mid', 'gradient-end'].map((name) => palette[name]);
    const channels = (hex) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
    const toHex = (values) => `#${values.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
    let worst = Infinity;
    for (let step = 0; step <= 100; step += 1) {
        const position = (step / 100) * 2;
        const segment = Math.min(1, Math.floor(position));
        const fraction = position - segment;
        const from = channels(stops[segment]);
        const to = channels(stops[segment + 1]);
        const color = toHex(from.map((value, index) => value + (to[index] - value) * fraction));
        worst = Math.min(worst, contrastRatio(palette['button-text'], color));
    }
    assert.ok(worst >= 4.5, `worst button gradient contrast ${worst.toFixed(2)}`);
});

test('liquid-glass CSS: glass panels, pure-CSS orbs, reduced-motion respected, no inline style', () => {
    const css = readFileSync(new URL('../src/styles/site.css', import.meta.url), 'utf8');
    assert.match(css, /--glass-blur:\s*blur\(24px\) saturate\(180%\)/);
    assert.match(css, /html::before,\s*body::before,\s*body::after\s*\{[^}]*position:\s*fixed[^}]*pointer-events:\s*none/);
    assert.match(css, /radial-gradient\(circle, var\(--orb-indigo\)/);
    assert.match(css, /radial-gradient\(circle, var\(--orb-cyan\)/);
    assert.match(css, /radial-gradient\(circle, var\(--orb-violet\)/);
    assert.match(css, /\.site-header\s*\{[^}]*position:\s*sticky/);
    assert.match(css, /@media \(forced-colors: active\)/);
    for (const route of ['index.html', 'projects/index.html']) assert.doesNotMatch(readPage(route), /<div[^>]*orb/, 'orbs are CSS pseudo-elements, not markup');
});
