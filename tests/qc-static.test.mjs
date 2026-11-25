// QC checks that read the built site (dist/), the CSS, the workflow text, the
// avatar bytes and the tracked files. Run "npm run build" first.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const hasBuild = existsSync(DIST);
const MAIN_PAGES = ['index.html', 'portfolio/index.html', 'projects/index.html', 'labs/index.html', '404.html'];
const read = (path) => readFileSync(join(root, path), 'utf8');
const readDist = (path) => readFileSync(join(DIST, path), 'utf8');

function walk(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });
}

function pageUrl(file) {
    return '/' + file.replace(/index\.html$/, '');
}

// ---------------------------------------------------------------- links

function resolveInDist(urlPath) {
    const clean = urlPath.split('#')[0].split('?')[0];
    const direct = join(DIST, clean);
    if (clean.endsWith('/')) return existsSync(join(direct, 'index.html')) ? join(direct, 'index.html') : null;
    if (existsSync(direct) && statSync(direct).isFile()) return direct;
    if (existsSync(join(direct, 'index.html'))) return join(direct, 'index.html');
    return null;
}

function collectReferences(html) {
    const references = [];
    for (const match of html.matchAll(/<(a|link|img|source|script|iframe)\b[^>]*>/gi)) {
        const tag = match[0];
        const attribute = /<link\b/i.test(tag) && /rel="canonical"/.test(tag) ? null : /\s(?:href|src)="([^"]*)"/.exec(tag);
        if (attribute) references.push({ tag: match[1].toLowerCase(), value: attribute[1] });
    }
    return references;
}

function findBrokenLinks(file, html) {
    const broken = [];
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    for (const { value } of collectReferences(html)) {
        if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith('//')) continue;
        if (value.startsWith('#')) {
            if (value.length > 1 && !ids.has(value.slice(1))) broken.push(`${value} (no such id)`);
            continue;
        }
        const absolute = value.startsWith('/') ? value : posix.join(pageUrl(file), value);
        if (!resolveInDist(absolute)) broken.push(`${value} -> not in dist`);
    }
    return broken;
}

test('QC link checker: every internal link and asset on every main page resolves to a file in dist', { skip: !hasBuild }, () => {
    let checked = 0;
    for (const file of MAIN_PAGES) {
        const html = readDist(file);
        checked += collectReferences(html).length;
        assert.deepEqual(findBrokenLinks(file, html), [], `${file} has broken references`);
    }
    assert.ok(checked > 30, `only ${checked} references checked`);
});

test('QC link checker: stylesheet url() references resolve to files in dist', { skip: !hasBuild }, () => {
    const cssFiles = walk(join(DIST, '_astro')).filter((file) => file.endsWith('.css'));
    assert.ok(cssFiles.length >= 1);
    let checked = 0;
    for (const cssFile of cssFiles) {
        for (const match of readFileSync(cssFile, 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
            checked += 1;
            assert.ok(resolveInDist(match[1]), `${match[1]} missing from dist`);
        }
    }
    assert.equal(checked, 4);
});

test('QC link checker: the link checker itself detects a broken link (self-test)', () => {
    const sample = '<a href="/nope/">x</a><a href="#ghost">y</a><img src="/missing.png">';
    assert.equal(findBrokenLinks('index.html', sample).length, 3);
});

test('QC: lab links from the Labs and Home pages land on built lab files', { skip: !hasBuild }, () => {
    for (const file of ['labs/index.html', 'index.html']) {
        const html = readDist(file);
        for (const match of html.matchAll(/href="(\/exam_apps\/[^"]*)"/g)) {
            assert.ok(resolveInDist(match[1]), `${file}: ${match[1]} not in dist`);
        }
    }
});

test('QC (info): internal links inside the lab apps (apps are not edited, never fails)', { skip: !hasBuild }, (t) => {
    for (const file of walk(join(DIST, 'exam_apps')).filter((name) => name.endsWith('.html'))) {
        const html = readFileSync(file, 'utf8');
        const internal = [...html.matchAll(/\shref="(\/[^"]*|[^"#:]+\.html[^"]*)"/g)].map((match) => match[1]);
        t.diagnostic(`${relative(root, file)}: ${internal.length} internal href(s) ${JSON.stringify([...new Set(internal)])}`);
    }
});

// ------------------------------------------------------- page structure

test('QC: every image has alt text, numeric width and height, and a local existing source', { skip: !hasBuild }, () => {
    let images = 0;
    for (const file of MAIN_PAGES) {
        for (const match of readDist(file).matchAll(/<img\b[^>]*>/g)) {
            images += 1;
            const tag = match[0];
            assert.match(tag, /\salt="[^"]*"/, `${file}: no alt: ${tag}`);
            assert.match(tag, /\swidth="\d+"/, `${file}: no width: ${tag}`);
            assert.match(tag, /\sheight="\d+"/, `${file}: no height: ${tag}`);
            const source = /\ssrc="([^"]+)"/.exec(tag)?.[1];
            assert.ok(source && source.startsWith('/') && resolveInDist(source), `${file}: bad src ${source}`);
        }
    }
    assert.ok(images >= 1, 'expected at least the avatar');
});

test('QC: the avatar alt text is meaningful (not empty, not the file name)', { skip: !hasBuild }, () => {
    const alt = /<img[^>]*class="avatar"[^>]*alt="([^"]*)"/.exec(readDist('index.html'))?.[1];
    assert.ok(alt && alt.length > 5 && !/avatar|jpg/i.test(alt), `alt was: ${alt}`);
});

function headingLevels(html) {
    const body = html.replace(/<!--[\s\S]*?-->/g, '');
    return [...body.matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
}

test('QC: one h1 per page, the first heading is the h1, and levels never jump down by more than one', { skip: !hasBuild }, () => {
    for (const file of MAIN_PAGES) {
        const levels = headingLevels(readDist(file));
        assert.equal(levels.filter((level) => level === 1).length, 1, `${file}: h1 count (${levels})`);
        assert.equal(levels[0], 1, `${file}: first heading is not h1 (${levels})`);
        for (let index = 1; index < levels.length; index += 1) {
            assert.ok(levels[index] - levels[index - 1] <= 1, `${file}: h${levels[index - 1]} -> h${levels[index]} skips a level (${levels})`);
        }
    }
});

test('QC: every page has exactly one canonical link, absolute, on the apex, matching its own path', { skip: !hasBuild }, () => {
    for (const file of MAIN_PAGES) {
        const html = readDist(file);
        const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
        assert.equal(canonicals.length, 1, `${file}: canonical count`);
        const href = /href="([^"]+)"/.exec(canonicals[0][0])[1];
        const expectedPath = file === '404.html' ? '/404.html' : pageUrl(file);
        assert.equal(href, `https://jonwitherspoon.com${expectedPath}`);
        assert.doesNotMatch(href, /www\.|http:\/\//);
    }
});

test('QC: lang, viewport, unique titles and unique descriptions on every page', { skip: !hasBuild }, () => {
    const titles = new Set();
    const descriptions = new Set();
    for (const file of MAIN_PAGES) {
        const html = readDist(file);
        assert.match(html, /<html lang="en"/, `${file} lang`);
        assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/, `${file} viewport`);
        assert.doesNotMatch(html, /user-scalable=no|maximum-scale=1\b/, `${file} blocks zoom`);
        titles.add(/<title>([^<]+)<\/title>/.exec(html)[1]);
        descriptions.add(/<meta name="description" content="([^"]+)"/.exec(html)[1]);
    }
    assert.equal(titles.size, MAIN_PAGES.length, 'duplicate titles');
    assert.equal(descriptions.size, MAIN_PAGES.length, 'duplicate descriptions');
});

test('QC: no duplicate ids and every aria-labelledby points at an existing id', { skip: !hasBuild }, () => {
    for (const file of MAIN_PAGES) {
        const html = readDist(file);
        const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
        assert.equal(new Set(ids).size, ids.length, `${file}: duplicate ids`);
        for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
            assert.ok(ids.includes(match[1]), `${file}: aria-labelledby ${match[1]} has no target`);
        }
        assert.ok(ids.includes('main'), `${file}: skip-link target #main missing`);
    }
});

test('QC: JavaScript-free markup (no script, handlers, javascript: urls, forms, iframes, noscript, module preloads)', { skip: !hasBuild }, () => {
    for (const file of MAIN_PAGES) {
        const html = readDist(file);
        assert.doesNotMatch(html, /<noscript|<form|<iframe|<object|<embed|<base\b/i, `${file}: forbidden element`);
        assert.doesNotMatch(html.replace(/<script\s+src="\/(search|tabs|theme)\.js"[^>]*><\/script>/g, ''), /<script/i, `${file}: script other than /search.js, /tabs.js or /theme.js`);
        assert.doesNotMatch(html, /\son[a-z]+\s*=/i, `${file}: inline event handler`);
        assert.doesNotMatch(html, /javascript:/i, `${file}: javascript: url`);
        assert.doesNotMatch(html, /modulepreload|type="module"/i, `${file}: module script hint`);
    }
    assert.deepEqual(walk(DIST).filter((file) => file.endsWith('.js')).map((file) => relative(DIST, file)), ['search.js', 'tabs.js', 'theme.js'], 'main build should emit only search.js, tabs.js and theme.js');
});

test('QC: the 404 page links back into the site and the 404 override targets it', { skip: !hasBuild }, () => {
    const html = readDist('404.html');
    for (const link of ['/', '/portfolio/', '/projects/', '/labs/']) assert.ok(html.includes(`href="${link}"`), link);
    assert.match(html, /<nav[^>]*aria-label="Main"/);
    assert.deepEqual(JSON.parse(readDist('staticwebapp.config.json')).responseOverrides['404'], { rewrite: '/404.html' });
    assert.ok(existsSync(join(DIST, '404.html')));
});

test('QC: About text has no draft marker and the old Silicon Scripted branding is absent from the pages', { skip: !hasBuild }, () => {
    assert.doesNotMatch(readDist('portfolio/index.html'), /DRAFT: Jon to review/);
    for (const file of MAIN_PAGES) {
        const visibleText = readDist(file).replace(/<[^>]+>/g, ' ');
        const hits = visibleText.match(/silicon\s+scripted/gi) ?? [];
        assert.deepEqual(hits, [], `${file}: old brand name in visible text`);
    }
});

test('QC: Portfolio page keeps the planned order, eight certifications and one past exam', { skip: !hasBuild }, () => {
    const html = readDist('portfolio/index.html');
    assert.equal((html.match(/class="cert"/g) ?? []).length, 8);
    assert.equal((html.match(/class="exam"/g) ?? []).length, 1);
    assert.equal((html.match(/class="badge mono">current</g) ?? []).length, 1, 'exactly one current badge');
    assert.ok(html.indexOf('current') < html.indexOf('Enable Resource Group'));
});

test('QC: placeholders use the CSS class, never an inline style', { skip: !hasBuild }, () => {
    for (const file of MAIN_PAGES) {
        for (const match of readDist(file).matchAll(/<[^>]*\[TO SUPPLY[^<]*/g)) {
            assert.doesNotMatch(match[0], /style=/);
        }
    }
    const css = readdirSync(join(DIST, '_astro')).filter((name) => name.endsWith('.css'));
    assert.match(readFileSync(join(DIST, '_astro', css[0]), 'utf8'), /\.placeholder\{[^}]*dashed/);
});

// ------------------------------------------------------------------ CSS

const css = read('src/styles/site.css');

function hexToLuminance(hex) {
    const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
    const [red, green, blue] = channels.map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
    const [lighter, darker] = [hexToLuminance(foreground), hexToLuminance(background)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
}

function variables(block) {
    return Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((match) => [match[1], match[2]]));
}

test('QC CSS: light and dark palettes both exist; they follow prefers-color-scheme until a data-theme choice is made', () => {
    assert.match(css, /color-scheme:\s*light dark/);
    assert.match(css, /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{/);
    const dark = variables(css.slice(css.indexOf('@media (prefers-color-scheme: dark)')));
    for (const name of ['background', 'surface', 'ink', 'ink-muted', 'rule', 'accent', 'accent-text']) assert.ok(dark[name], `dark --${name}`);
    assert.doesNotMatch(css, /\.dark\b|\.light\b/);
});

test('QC CSS: text colour pairs meet WCAG AA 4.5:1 in light and dark; the accent border meets 3:1', () => {
    const light = variables(css.slice(0, css.indexOf('@media (prefers-color-scheme: dark)')));
    const dark = variables(css.slice(css.indexOf('@media (prefers-color-scheme: dark)'), css.indexOf('*,')));
    for (const [mode, palette] of [['light', light], ['dark', dark]]) {
        const merged = { ...light, ...palette };
        for (const text of ['ink', 'ink-muted', 'accent-text']) {
            for (const surface of ['background', 'surface']) {
                const ratio = contrast(merged[text], merged[surface]);
                assert.ok(ratio >= 4.5, `${mode}: ${text} on ${surface} = ${ratio.toFixed(2)}`);
            }
        }
        const border = contrast(merged.accent, merged.background);
        assert.ok(border >= 3, `${mode}: accent vs background = ${border.toFixed(2)}`);
    }
});

test('QC CSS: visible keyboard focus, skip link reveal, reduced-motion handling', () => {
    assert.match(css, /a:focus-visible[^{]*\{[^}]*outline:\s*2px solid/);
    assert.match(css, /\.skip-link:focus\s*\{\s*top:/);
    assert.doesNotMatch(css, /outline:\s*(none|0)/);
    assert.match(css, /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*html\s*\{\s*scroll-behavior: smooth/);
    // Liquid-glass design: the only animation is the slow orb drift, and it lives inside the no-preference block.
    const motionStart = css.search(/@media \(prefers-reduced-motion: no-preference\)\s*\{/);
    assert.ok(motionStart > 0, 'no-preference block missing');
    const outsideMotion = css.slice(0, motionStart);
    const motionBlock = css.slice(motionStart);
    assert.doesNotMatch(outsideMotion, /@keyframes|animation|transition/, 'animation or transition outside the no-preference block');
    for (const keyframes of motionBlock.matchAll(/@keyframes\s+([\w-]+)/g)) assert.match(keyframes[1], /^orb-/, `keyframes ${keyframes[1]} is not an orb animation`);
    for (const declaration of motionBlock.matchAll(/animation:[^;]*;/g)) {
        assert.match(declaration[0], /\borb-drift-[abc]\b/, `unexpected animation: ${declaration[0]}`);
        const seconds = [...declaration[0].matchAll(/(\d+(?:\.\d+)?)s\b/g)].map((match) => Number(match[1]));
        assert.ok(seconds.length > 0 && seconds.every((value) => value >= 16 && value <= 24), `orb drift must be slow (16-24s): ${declaration[0]}`);
    }
    for (const declaration of motionBlock.matchAll(/transition:[^;]*;/g)) {
        for (const duration of declaration[0].matchAll(/(\d+(?:\.\d+)?)(m?s)\b/g)) {
            const milliseconds = duration[2] === 's' ? Number(duration[1]) * 1000 : Number(duration[1]);
            assert.ok(milliseconds <= 300, `transition longer than 300ms: ${declaration[0]}`);
        }
        assert.doesNotMatch(declaration[0], /\ball\b/, 'transition: all is too broad');
    }
});

test('QC CSS: mobile-first single column, 640px breakpoint, 44px tap targets, no fixed wide widths', () => {
    assert.match(css, /@media \(min-width: 640px\)/);
    assert.match(css, /\.hero\s*\{[^}]*grid-template-columns:\s*1fr/);
    assert.match(css, /overflow-wrap:\s*anywhere/);
    assert.match(css, /box-sizing:\s*border-box/);
    // WCAG 2.2 AA needs 24px; fine pointers get 40px, coarse pointers (touch) get 44px.
    assert.match(css, /@media \(pointer: coarse\)\s*\{[^}]*\{[^}]*min-height:\s*44px/);
    const smallest = [...css.replace(/@media \(pointer: coarse\)[\s\S]*?\n\}\n/, '').matchAll(/min-height:\s*(\d+)px/g)].map((match) => Number(match[1]));
    assert.ok(smallest.every((value) => value >= 24), `a control is under 24px tall: ${smallest}`);
    const coarse = /@media \(pointer: coarse\)\s*\{([^}]*)\}/.exec(css)[1];
    for (const selector of ['.nav-name', '.nav-list a', '.card a', '.lab a', '.plain-list a', '.site-footer a', '.button', '.text-link', '.social-link', '.icon-link', '.tab']) {
        assert.ok(coarse.includes(selector), `no coarse-pointer 44px rule for ${selector}`);
    }
    assert.match(css, /\.button,[^{]*\{[^}]*min-height:\s*40px/);
    assert.doesNotMatch(css.replace(/@media \(min-width: 640px\)[\s\S]*$/, ''), /(?<![-a-z])width:\s*\d{3,}px|(?<=min-)width:\s*\d{3,}px/, 'fixed wide width outside the breakpoint');
    // Only the Portfolio tab bar may scroll sideways, and only its tab labels may stay on one line.
    assert.doesNotMatch(css.replace(/\.tablist\s*\{[^}]*\}/, '').replace(/\.tab\s*\{[^}]*\}/, ''), /white-space:\s*nowrap|overflow-x:\s*(scroll|auto)/);
    assert.doesNotMatch(css, /!important|text-shadow/);
    // Glass is allowed: backdrop blur up to 28px, always with the -webkit- twin and an opaque fallback.
    for (const blur of css.matchAll(/blur\((\d+(?:\.\d+)?)px\)/g)) assert.ok(Number(blur[1]) <= 28, `blur too strong: ${blur[0]}`);
    assert.doesNotMatch(css, /(?<!backdrop-)filter:/, 'filter (glow/blur on content) is not allowed');
    assert.ok((css.match(/-webkit-backdrop-filter/g) ?? []).length >= 4, '-webkit- prefix missing');
    assert.match(css, /@supports not \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)/, 'no fallback for browsers without backdrop-filter');
});

test('QC CSS: no external urls, no @import, fonts swap in with system fallbacks', () => {
    assert.doesNotMatch(css, /https?:\/\/|@import/);
    assert.equal((css.match(/font-display:\s*swap/g) ?? []).length, 4);
    assert.match(css, /--font-sans:[^;]*system-ui[^;]*sans-serif/);
    assert.match(css, /--font-mono:[^;]*monospace/);
});

const COVERED_ANCESTORS = new Set([...css.matchAll(/(?:^|[}{])\s*([.\w\s,-]+)\s*\{[^}]*min-height:\s*44px/g)]
    .flatMap((match) => match[1].split(','))
    .map((selector) => selector.trim())
    .flatMap((selector) => {
        const className = /^\.([\w-]+)(?:\s+a)?$/.exec(selector)?.[1];
        return className ? [className] : [];
    }));

function findSmallStandaloneLinks(html) {
    const stack = [];
    const found = [];
    const tokens = html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|([^<]+)/g);
    for (const token of tokens) {
        if (token[4] !== undefined) {
            for (const open of stack) open.text += token[4];
            continue;
        }
        const [, closing, name, attributes] = token;
        const tag = name.toLowerCase();
        if (['meta', 'link', 'img', 'br', 'hr', 'input'].includes(tag)) continue;
        if (!closing) {
            stack.push({ tag, classes: /class="([^"]*)"/.exec(attributes)?.[1].split(/\s+/) ?? [], text: '', anchorText: 0 });
            continue;
        }
        const element = stack.pop();
        if (tag === 'a' && element) {
            const parent = stack[stack.length - 1];
            const sole = parent && ['p', 'li', 'dd'].includes(parent.tag) && parent.text.trim() === element.text.trim();
            const covered = [element, ...stack].some((candidate) => candidate.classes.some((name2) => COVERED_ANCESTORS.has(name2)));
            if (sole && !covered) found.push(element.text.trim());
        }
    }
    return found;
}

test('QC CSS: every standalone link (the only content of its line) has a 44px tap-target rule', { skip: !hasBuild }, () => {
    assert.ok(COVERED_ANCESTORS.has('card') && COVERED_ANCESTORS.has('lab'), `covered: ${[...COVERED_ANCESTORS]}`);
    const problems = [];
    for (const file of MAIN_PAGES) {
        for (const text of findSmallStandaloneLinks(readDist(file))) problems.push(`${file}: "${text}"`);
    }
    assert.deepEqual(problems, [], 'standalone links without a 44px rule');
});

// --------------------------------------------------------------- avatar

function readAvatarSegments() {
    const bytes = readFileSync(join(root, 'public/avatar.jpg'));
    const segments = [];
    let offset = 2;
    while (offset < bytes.length && bytes[offset] === 0xff && bytes[offset + 1] !== 0xda) {
        const length = bytes.readUInt16BE(offset + 2);
        segments.push({ marker: bytes[offset + 1], data: bytes.subarray(offset + 4, offset + 2 + length) });
        offset += 2 + length;
    }
    return { bytes, segments };
}

test('QC avatar: real JPEG, 460x460, local, small, and only JFIF + one tiny Exif + empty IPTC segments', () => {
    const { bytes, segments } = readAvatarSegments();
    assert.deepEqual([...bytes.subarray(0, 2)], [0xff, 0xd8]);
    assert.deepEqual([...bytes.subarray(-2)], [0xff, 0xd9]);
    const frame = segments.find((segment) => segment.marker === 0xc0 || segment.marker === 0xc2);
    assert.equal(frame.data.readUInt16BE(1), 460);
    assert.equal(frame.data.readUInt16BE(3), 460);
    assert.ok(bytes.length < 150 * 1024, `avatar is ${bytes.length} bytes`);
    const markers = segments.map((segment) => segment.marker.toString(16));
    assert.equal(markers.filter((marker) => marker === 'e1').length, 1, 'exactly one APP1 (Exif) segment');
    assert.ok(!markers.includes('fe'), 'no JPEG comment segment');
    assert.ok(!markers.some((marker) => ['e2', 'e3', 'e4', 'ec', 'ee'].includes(marker)), `unexpected APPn: ${markers}`);
});

test('QC avatar: the one Exif entry is the Exif sub-IFD pointer holding only ColorSpace and pixel size; no GPS, camera, date or XMP', (t) => {
    const { bytes, segments } = readAvatarSegments();
    const exif = segments.find((segment) => segment.marker === 0xe1).data;
    assert.equal(exif.subarray(0, 6).toString('latin1'), 'Exif\0\0');
    assert.equal(exif.length, 74, 'Exif payload size');
    const tiff = exif.subarray(6);
    const little = tiff.subarray(0, 2).toString('latin1') === 'II';
    assert.ok(little || tiff.subarray(0, 2).toString('latin1') === 'MM');
    const read16 = (offset) => (little ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset));
    const read32 = (offset) => (little ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset));
    const firstIfd = read32(4);
    const entryCount = read16(firstIfd);
    assert.equal(entryCount, 1, 'IFD0 has exactly one entry');
    const tag = read16(firstIfd + 2);
    assert.equal(tag, 0x8769, 'the one entry is the Exif IFD pointer (0x8769)');
    const subIfd = read32(firstIfd + 10);
    const subTags = Array.from({ length: read16(subIfd) }, (unused, index) => read16(subIfd + 2 + index * 12));
    assert.deepEqual(subTags, [0xa001, 0xa002, 0xa003], 'sub-IFD: ColorSpace, PixelXDimension, PixelYDimension');
    assert.ok(!subTags.includes(0x8825), 'no GPS IFD pointer');
    assert.equal(read32(firstIfd + 2 + 12), 0, 'no IFD1 / thumbnail');
    for (const needle of ['GPS', 'http://ns.adobe.com/xap', 'Make', 'Model', 'DateTime', 'Software']) {
        assert.ok(!bytes.includes(Buffer.from(needle)), `${needle} found in avatar bytes`);
    }
    const iptc = segments.find((segment) => segment.marker === 0xed).data;
    assert.ok(iptc.length <= 60, 'APP13 is tiny (empty Photoshop block)');
    assert.ok(iptc.includes(Buffer.from('d41d8cd98f00b204e9800998ecf8427e', 'hex')), 'APP13 holds only the empty-data MD5 digest');
    t.diagnostic('Exif: IFD0 has 1 entry, tag 0x8769 (Exif IFD pointer) -> sub-IFD {ColorSpace=1(sRGB), PixelXDimension=460, PixelYDimension=460}; APP13 is an empty Photoshop 8BIM block (IPTC size 0 + MD5 of empty data)');
});

test('QC avatar and fonts: dist copies are byte-identical to public; fonts are woff2 with the OFL license beside them', { skip: !hasBuild }, () => {
    assert.ok(readFileSync(join(DIST, 'avatar.jpg')).equals(readFileSync(join(root, 'public/avatar.jpg'))));
    for (const name of ['IBMPlexSans-Regular', 'IBMPlexSans-SemiBold', 'IBMPlexMono-Regular', 'IBMPlexMono-Medium']) {
        const bytes = readFileSync(join(DIST, 'fonts', `${name}.woff2`));
        assert.equal(bytes.subarray(0, 4).toString('latin1'), 'wOF2', name);
        assert.ok(bytes.length < 120 * 1024, `${name} is ${bytes.length} bytes`);
    }
    const license = readDist('fonts/LICENSE.txt');
    assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
    assert.match(license, /IBM/);
});

// ------------------------------------------------------ config in dist

test('QC config: dist copy is identical to public, valid, and the main CSP equals the plan text exactly', { skip: !hasBuild }, () => {
    const built = readDist('staticwebapp.config.json');
    assert.equal(built, read('public/staticwebapp.config.json'));
    const config = JSON.parse(built);
    assert.equal(
        config.globalHeaders['Content-Security-Policy'],
        "default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'",
    );
    assert.deepEqual(Object.keys(config.globalHeaders).sort(), [
        'Content-Security-Policy', 'Permissions-Policy', 'Referrer-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options',
    ]);
    assert.equal(config.routes[0].route, '/exam_apps*');
    assert.equal(config.routes.length, 1);
});

test('QC config (by design, not failed): the lab route CSP differs from the plan only by the two Google font hosts', { skip: !hasBuild }, (t) => {
    const lab = JSON.parse(readDist('staticwebapp.config.json')).routes[0].headers['Content-Security-Policy'];
    const planned = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'";
    const withoutGoogle = lab.replace(' https://fonts.googleapis.com', '').replace(' https://fonts.gstatic.com', '');
    assert.equal(withoutGoogle, planned);
    t.diagnostic('lab CSP allows fonts.googleapis.com and fonts.gstatic.com because the apps still load Google Fonts and are not edited (HARD RULE)');
});

test('QC dist: only expected file types are published (no maps, sources, notes, dotfiles, scripts, package files)', { skip: !hasBuild }, () => {
    const allowed = /\.(html|css|json|jpg|woff2|txt)$|^(search|tabs|theme)\.js$/;
    for (const file of walk(DIST)) {
        const name = relative(DIST, file);
        assert.match(name, allowed, `unexpected file type in dist: ${name}`);
        assert.doesNotMatch(name, /(^|\/)\.|package(-lock)?\.json$|\.map$|(source|kql-source)\//, name);
    }
    assert.ok(!existsSync(join(DIST, 'exam_apps', 'package.json')));
});

test('QC (info, never fails): lab apps audit for criteria 15 and 18 (Jon\'s apps are not modified)', { skip: !hasBuild }, (t) => {
    for (const file of walk(join(DIST, 'exam_apps')).filter((name) => name.endsWith('.html'))) {
        const text = readFileSync(file, 'utf8');
        const findings = {
            externalFontHosts: [...new Set([...text.matchAll(/https:\/\/(fonts\.g[a-z]+\.com)/g)].map((match) => match[1]))],
            iframe: /<iframe/i.test(text),
            evalOrFunction: /\beval\(|new Function/.test(text),
            blobUrl: /blob:/.test(text),
            networkCalls: /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/.test(text),
            presetExamDate: (text.match(/\|\|\s*'(20\d\d-\d\d-\d\d)'/g) ?? []),
            emailOrOwnerName: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}|theknoxtech|witherspoon/i.test(text),
            innerHtmlUses: (text.match(/innerHTML/g) ?? []).length,
        };
        t.diagnostic(`${relative(root, file)}: ${JSON.stringify(findings)}`);
    }
});

// ------------------------------------------------------------- workflow

const workflow = read('.github/workflows/deploy.yml');

function jobBlock(name) {
    const start = workflow.indexOf(`\n  ${name}:`);
    assert.ok(start >= 0, `job ${name} not found`);
    const rest = workflow.slice(start + 1);
    const next = rest.slice(1).search(/\n  [a-z_]+:\n/);
    return next < 0 ? rest : rest.slice(0, next + 1);
}

test('QC workflow: triggers are push to main and dev and pull_request to main only; never pull_request_target or workflow_run', () => {
    const triggers = workflow.slice(workflow.indexOf('\non:'), workflow.indexOf('\npermissions:'));
    assert.match(triggers, /push:\s*\n\s*branches: \[main, dev\]/);
    assert.match(triggers, /pull_request:\s*\n\s*branches: \[main\]/);
    assert.doesNotMatch(workflow, /pull_request_target|workflow_run|workflow_dispatch|issue_comment|schedule:/);
});

test('QC workflow: top-level permissions are read-only; pull-requests: write only on the deploy job; no other write scopes', () => {
    assert.match(workflow, /^permissions:\n  contents: read\n/m);
    assert.deepEqual([...workflow.matchAll(/^\s+([a-z-]+): write$/gm)].map((match) => match[1]), ['pull-requests']);
    assert.match(jobBlock('build_and_deploy'), /permissions:\n\s+contents: read\n\s+pull-requests: write/);
    assert.doesNotMatch(jobBlock('close_pull_request'), /permissions:/);
});

test('QC workflow: both jobs carry the same-repo and not-dependabot guard', () => {
    for (const job of ['build_and_deploy', 'close_pull_request']) {
        const block = jobBlock(job);
        const condition = /\n    if: (.*)\n/.exec(block)?.[1] ?? '';
        assert.match(condition, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/, `${job} same-repo guard`);
        assert.match(condition, /github\.actor != 'dependabot\[bot\]'/, `${job} dependabot guard`);
    }
    const deployCondition = /\n    if: (.*)\n/.exec(jobBlock('build_and_deploy'))[1];
    assert.match(deployCondition, /^\(github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'\) \|\| \(/, 'push runs to main are not subject to the pull request guard');
    assert.match(deployCondition, /github\.event\.action != 'closed'/);
});

test('QC workflow: the placeholder failure switch is set only from "push" events and checked again by a push-only step', () => {
    assert.equal((workflow.match(/FAIL_ON_PLACEHOLDER/g) ?? []).length, 2);
    assert.match(workflow, /FAIL_ON_PLACEHOLDER: \$\{\{ github\.event_name == 'push' && '1' \|\| '0' \}\}/);
    const step = workflow.slice(workflow.indexOf('name: Check dist for placeholders'));
    assert.match(step.split('\n').slice(0, 3).join('\n'), /if: github\.event_name == 'push'/);
    assert.match(step, /grep -rn --include='\*\.html' -F '\[TO SUPPLY' dist\//);
});

test('QC workflow: every uses: is pinned to a 40-character SHA with a version comment and matches the plan', () => {
    const plan = read('docs/plans/done-with-open-items/2026-11-15-personal-site.md');
    const uses = [...workflow.matchAll(/uses: (\S+)@(\S+)(?: # (\S+))?/g)];
    assert.equal(uses.length, 7);
    for (const [, action, reference, comment] of uses) {
        assert.match(reference, /^[0-9a-f]{40}$/, `${action} is not SHA-pinned`);
        assert.ok(comment, `${action}: no version comment`);
        assert.ok(plan.includes(reference), `${action}@${reference} not in the plan`);
    }
});

test('QC workflow: the token and secrets are only referenced through secrets.*; no literal credentials; run steps use no github.event data', () => {
    const secretLines = workflow.split('\n').filter((line) => /secrets\./.test(line));
    for (const line of secretLines) assert.match(line, /(azure_static_web_apps_api_token|repo_token): \$\{\{ secrets\.(AZURE_STATIC_WEB_APPS_API_TOKEN|AZURE_STATIC_WEB_APPS_API_TOKEN_DEV|GITHUB_TOKEN) \}\}$/, line);
    assert.equal(secretLines.length, 5);
    assert.doesNotMatch(workflow, /[A-Za-z0-9+/]{60,}/);
    assert.doesNotMatch(workflow, /run:[^\n]*\$\{\{/);
    assert.doesNotMatch(workflow, /echo[^\n]*secrets\./);
    assert.match(workflow, /npm ci\n/);
    assert.doesNotMatch(workflow, /npm install|npm i\b/);
});

test('QC workflow: the phone/address guard patterns, run as written against dist (including the lab apps), find nothing', { skip: !hasBuild }, () => {
    const patterns = [...new Set([...workflow.matchAll(/-e '([^']+)'/g)].map((match) => match[1]))];
    assert.equal(patterns.length, 2);
    const expressions = patterns.map((pattern) => new RegExp(pattern));
    for (const file of walk(DIST).filter((name) => /\.(html|json|xml|txt)$/.test(name))) {
        const text = readFileSync(file, 'utf8');
        for (const expression of expressions) assert.doesNotMatch(text, expression, relative(root, file));
    }
    assert.match('call 865-555-1234 now', expressions[0]);
    assert.match('12 Main Street', expressions[1]);
});

test('QC workflow: dependabot config targets dev weekly for npm and github-actions', () => {
    const dependabot = read('.github/dependabot.yml');
    assert.equal((dependabot.match(/interval: weekly/g) ?? []).length, 2);
    assert.match(dependabot, /package-ecosystem: github-actions/);
    assert.match(dependabot, /package-ecosystem: npm/);
});

// ----------------------------------------------------- packages / lockfile

function versionAtLeast(actual, minimum) {
    const left = actual.split('.').map(Number);
    const right = minimum.split('.').map(Number);
    for (let index = 0; index < 3; index += 1) {
        if (left[index] !== right[index]) return left[index] > right[index];
    }
    return true;
}

test('QC supply chain: lockfile pins astro >= 6.4.8 and vite at or above the CVE floor, all from the npm registry with integrity hashes', () => {
    const lock = JSON.parse(read('package-lock.json'));
    assert.equal(lock.lockfileVersion >= 3, true);
    const astro = lock.packages['node_modules/astro'].version;
    const vite = lock.packages['node_modules/vite'].version;
    assert.ok(versionAtLeast(astro, '6.4.8'), `astro ${astro}`);
    assert.ok(versionAtLeast(vite, '7.3.5') || versionAtLeast(vite, '8.0.16'), `vite ${vite}`);
    for (const [name, entry] of Object.entries(lock.packages)) {
        if (name === '') continue;
        assert.ok(entry.integrity, `${name}: no integrity hash`);
        assert.match(entry.resolved, /^https:\/\/registry\.npmjs\.org\//, `${name}: resolved from ${entry.resolved}`);
    }
});

// ------------------------------------------------------------ setup guide

test('QC setup guide (criterion 14): covers every step in plan section 5, in plain checklist form', () => {
    const guide = read('docs/setup-guide.md');
    const required = {
        'create repo, push main and dev': /main[\s\S]*dev|dev[\s\S]*main/,
        '2FA': /two-factor|2FA|authenticator/i,
        'ruleset on main': /ruleset|branch protection/i,
        'secret scanning': /secret scanning/i,
        'read-only workflow token': /read.only|read and write|read repository/i,
        'actions allow list / SHA pinning policy': /allow|pinning|pinned/i,
        'dependabot': /dependabot/i,
        'azure MFA': /MFA|multi-factor/i,
        'own resource group': /resource group/i,
        'free plan': /Free/,
        'source Other': /\bOther\b/,
        'token reset path': /reset/i,
        'secret name': /AZURE_STATIC_WEB_APPS_API_TOKEN/,
        'first deploy': /first deploy/i,
        'apex and www domains': /apex[\s\S]*www|www[\s\S]*apex/i,
        'DNS TXT and ALIAS/ANAME/flattening or Azure DNS': /TXT[\s\S]*(ALIAS|ANAME|flatten)|Azure DNS/i,
        'www redirect to the apex over HTTPS': /forward|redirect/i,
        'curl header checks': /curl -sI/,
        'http redirects to https': /http:\/\//,
        'add a lab': /exam_apps\/<code>/,
    };
    for (const [label, pattern] of Object.entries(required)) assert.match(guide, pattern, label);
    for (const path of [/\/(portfolio|work)\//, '/exam_apps/md-102/', '/exam_apps/md-102', '/exam_apps/md-102/kql-lab.html', '/nope']) {
        assert.ok(path instanceof RegExp ? path.test(guide) : guide.includes(path), `post-deploy check for ${path} missing`);
    }
    assert.ok((guide.match(/^- \[ \]/gm) ?? []).length >= 20, 'expected checkboxes');
    assert.doesNotMatch(guide, /\bbrew\b|sudo |rm -rf/);
});

// ------------------------------------------------- tracked-file scan

function trackedFiles() {
    try {
        const output = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
        return output.split('\0').filter(Boolean);
    } catch {
        return null;
    }
}

const tracked = trackedFiles();

test('QC secrets: no env files, key files, deploy config or .DS_Store are tracked', { skip: tracked === null }, () => {
    for (const file of tracked) {
        assert.doesNotMatch(file, /(^|\/)\.env|swa-cli\.config\.json|\.(pem|key|p12|pfx)$|(^|\/)\.DS_Store$|id_rsa/, file);
    }
});

test('QC secrets: no token-looking strings, private keys or personal phone/address/email in tracked files', { skip: tracked === null }, () => {
    const secretPatterns = [
        /ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gh[ousr]_[A-Za-z0-9]{30,}/,
        /AKIA[0-9A-Z]{16}/,
        /-----BEGIN [A-Z ]*PRIVATE KEY/,
        /xox[baprs]-[A-Za-z0-9-]{10,}/,
        /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
        /sk-[A-Za-z0-9]{32,}/,
        /(api[_-]?key|token|secret|password)["']?\s*[:=]\s*["'][A-Za-z0-9+/_-]{24,}["']/i,
    ];
    const personal = [
        /\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/,
        /\b\d{1,5} [A-Za-z]+ (Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd)\b/,
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/,
    ];
    for (const file of tracked) {
        // tests/qc-*.test.mjs hold deliberate fake values (a sample phone number, a fake commit id) used to test the scans themselves.
        if (/^tests\/qc-[^/]*\.test\.mjs$/.test(file)) continue;
        if (/\.(jpg|woff2)$/.test(file) || file === 'package-lock.json' || !existsSync(join(root, file))) continue;
        const text = readFileSync(join(root, file), 'utf8');
        for (const pattern of secretPatterns) assert.doesNotMatch(text, pattern, `${file}: secret-like text ${pattern}`);
        if (file.startsWith('exam_apps/')) continue;
        for (const pattern of personal) assert.doesNotMatch(text, pattern, `${file}: personal-data pattern ${pattern}`);
    }
});

test('QC secrets: long opaque strings in tracked text files are only the known action SHAs', { skip: tracked === null }, () => {
    const plan = read('docs/plans/done-with-open-items/2026-11-15-personal-site.md');
    const offenders = [];
    for (const file of tracked) {
        // Same reason as above: the QC test files contain deliberate fake values.
        if (/^tests\/qc-[^/]*\.test\.mjs$/.test(file)) continue;
        if (/\.(jpg|woff2)$/.test(file) || file === 'package-lock.json' || file.startsWith('exam_apps/') || !existsSync(join(root, file))) continue;
        for (const match of readFileSync(join(root, file), 'utf8').matchAll(/(?<![A-Za-z0-9/._-])[A-Za-z0-9+_]{40,}(?![A-Za-z0-9/._-])/g)) {
            if (/^[0-9a-f]{40}$/.test(match[0]) && plan.includes(match[0])) continue;
            offenders.push(`${file}: ${match[0].slice(0, 12)}...`);
        }
    }
    assert.deepEqual(offenders, []);
});

test('QC secrets: .gitignore keeps env files, dist and node_modules out', () => {
    const ignore = read('.gitignore');
    for (const entry of ['.env', '.env.*', 'dist/', 'node_modules/']) assert.ok(ignore.split('\n').includes(entry), entry);
});
