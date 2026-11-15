import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MAIN_PAGES = {
    '/': 'index.html',
    '/work/': 'work/index.html',
    '/projects/': 'projects/index.html',
    '/labs/': 'labs/index.html',
    '/404': '404.html',
};

function readPage(file) {
    const path = join(DIST, file);
    assert.ok(existsSync(path), `dist/${file} is missing (run "npm run build" first)`);
    return readFileSync(path, 'utf8');
}

function countMatches(text, pattern) {
    return (text.match(pattern) || []).length;
}

test('dist/ exists', () => {
    assert.ok(existsSync(DIST), 'dist/ is missing: run "npm run build" before the tests');
});

test('all required main pages are built', () => {
    for (const file of Object.values(MAIN_PAGES)) {
        assert.ok(existsSync(join(DIST, file)), `dist/${file} is missing`);
    }
});

test('work page lists the current role first, with a visible placeholder', () => {
    const html = readPage('work/index.html');
    const roles = [...html.matchAll(/class="entry[^"]*"/g)];
    assert.ok(roles.length >= 5, 'expected five experience entries');
    const firstEntryStart = html.indexOf('class="entry');
    const firstCompany = html.indexOf('Critical Network Solutions');
    assert.ok(firstCompany > 0 && firstCompany > firstEntryStart - 2000);
    const order = ['Critical Network Solutions', 'Enable Resource Group', 'Southeastern Computer Associates', 'DWK Lifesciences', 'K12'];
    let lastIndex = -1;
    for (const company of order) {
        const index = html.indexOf(company, lastIndex + 1);
        assert.ok(index > lastIndex, `${company} is missing or out of order`);
        lastIndex = index;
    }
    assert.match(html, /current/);
    assert.match(html, /class="placeholder"[^>]*>\[TO SUPPLY:/);
});

test('work page has certifications with verify links, past exams, education', () => {
    const html = readPage('work/index.html');
    assert.ok(countMatches(html, /class="cert"/g) === 6, 'expected six certifications');
    assert.match(html, /Verify on/);
    assert.match(html, /SC-300/);
    assert.match(html, /Western Governors University/);
});

test('projects page shows five projects', () => {
    const html = readPage('projects/index.html');
    assert.equal(countMatches(html, /class="card"/g), 5);
});

test('home shows avatar, three featured projects, Now block', () => {
    const html = readPage('index.html');
    assert.match(html, /<img[^>]+src="\/avatar\.jpg"[^>]+width="96"[^>]+height="96"[^>]+alt="/);
    assert.equal(countMatches(html, /class="card"/g), 3);
    assert.match(html, /Now/);
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

test('main pages contain no <script, <style or style=', () => {
    for (const [route, file] of Object.entries(MAIN_PAGES)) {
        const html = readPage(file);
        assert.doesNotMatch(html, /<script/i, `${route} has <script`);
        assert.doesNotMatch(html, /<style/i, `${route} has <style`);
        assert.doesNotMatch(html, /\sstyle=/i, `${route} has style=`);
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
