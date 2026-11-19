import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TAG_COLOR_NAMES } from '../src/lib/tags.js';
import { findImagesWithoutAlt, findUnsafeMarkup, publishedArticles } from '../src/lib/articles.js';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const ASTRO_BIN = join(REPO_ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs');
const FIXTURE_CONFIG = 'tests/fixtures/astro.fixture.config.mjs';

/**
 * Builds the site with BLOG_DIR pointing at one fixture folder, the output and Astro's cache
 * (content data store, image cache) in the OS temp folder, so nothing is written to dist/,
 * public/, src/content/ or the real cache, and no fixture article can leak into a real build.
 * tagColorsJson, when given, replaces site.json's tagColors for that build only.
 */
function buildFixture(name, tagColorsJson) {
    const outDir = mkdtempSync(join(tmpdir(), `blog-${name}-`));
    const cacheDir = mkdtempSync(join(tmpdir(), `blog-cache-${name}-`));
    const result = spawnSync(process.execPath, [ASTRO_BIN, 'build', '--config', FIXTURE_CONFIG, '--outDir', outDir], {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        env: { ...process.env, BLOG_DIR: `tests/fixtures/blog/${name}`, BLOG_CACHE_DIR: cacheDir, ...(tagColorsJson && { TAG_COLORS_JSON: tagColorsJson }), ASTRO_TELEMETRY_DISABLED: '1' },
    });
    return { outDir, status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

function readOutput(build, file) {
    const path = join(build.outDir, file);
    assert.ok(existsSync(path), `${file} is missing from the fixture build`);
    return readFileSync(path, 'utf8');
}

function assertStrictCspClean(html, label) {
    assert.doesNotMatch(html, /<style/i, `${label} has <style`);
    assert.doesNotMatch(html, /\sstyle=/i, `${label} has style=`);
    for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        assert.match(script[1], /\ssrc="\/(search|tabs|theme)\.js"/, `${label}: unexpected script`);
        assert.equal(script[2].trim(), '', `${label}: inline script content`);
    }
}

const entry = (title, date, draft = false) => ({ id: title, data: { title, date: new Date(date), draft } });

test('publishedArticles drops drafts and sorts newest first', () => {
    const result = publishedArticles([entry('old', '2026-01-01'), entry('hidden', '2026-06-01', true), entry('new', '2026-03-01')]);
    assert.deepEqual(result.map((article) => article.id), ['new', 'old']);
});

test('publishedArticles returns an empty list for no entries and does not change its input', () => {
    assert.deepEqual(publishedArticles([]), []);
    const input = [entry('a', '2026-01-01'), entry('b', '2026-02-01')];
    publishedArticles(input);
    assert.deepEqual(input.map((article) => article.id), ['a', 'b']);
});

test('findImagesWithoutAlt lists images with empty or missing alt text', () => {
    assert.deepEqual(findImagesWithoutAlt('![A fine picture](./a.png)'), []);
    assert.deepEqual(findImagesWithoutAlt('![](./a.png) text ![  ](./b.png)'), ['./a.png', './b.png']);
    assert.deepEqual(findImagesWithoutAlt('<img src="./c.png">'), ['./c.png']);
    assert.deepEqual(findImagesWithoutAlt('<img src="./d.png" alt="">'), ['./d.png']);
    assert.deepEqual(findImagesWithoutAlt('<img src="./e.png" alt="Good">'), []);
});

test('findUnsafeMarkup flags raw script, raw style, style attributes and outside image addresses', () => {
    assert.deepEqual(findUnsafeMarkup('Plain text with `code` and ![Alt](./ok.png)'), []);
    assert.equal(findUnsafeMarkup('<script>alert(1)</script>').length, 1);
    assert.equal(findUnsafeMarkup('<style>p{}</style>').length, 1);
    assert.equal(findUnsafeMarkup('<p style="color:red">x</p>').length, 1);
    assert.equal(findUnsafeMarkup('![Alt](https://example.com/a.png)').length, 1);
    assert.equal(findUnsafeMarkup('![Alt](//example.com/a.png)').length, 1);
    assert.equal(findUnsafeMarkup('<img src="http://example.com/a.png" alt="x">').length, 1);
});

test('a build with no articles shows the empty state on /articles/ and leaves no fixture content behind', () => {
    const build = buildFixture('empty');
    assert.equal(build.status, 0, build.output);
    const html = readOutput(build, 'articles/index.html');
    assert.match(html, /<p class="empty-state">No articles yet\./);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.ok(html.includes('<link rel="canonical" href="https://jonwitherspoon.com/articles/"'));
    assert.match(html, /<script[^>]*\ssrc="\/search\.js"[^>]*\sdefer/);
    assertStrictCspClean(html, '/articles/');
    assert.match(readOutput(build, 'index.html'), /<p class="empty-state">Articles are on the way\.<\/p>/);
});

let normal;
before(() => {
    normal = buildFixture('normal');
});

test('published articles get a page, a list card, a Home card and a search entry; capitals and spaces become a clean address', () => {
    assert.equal(normal.status, 0, normal.output);
    assert.ok(existsSync(join(normal.outDir, 'articles', 'hello-world', 'index.html')), 'clean lowercase address');
    const list = readOutput(normal, 'articles/index.html');
    assert.equal((list.match(/<li class="article-card"/g) ?? []).length, 2);
    assert.ok(list.indexOf('Second Post') < list.indexOf('Hello World'), 'newest first');
    assert.match(list, /href="\/articles\/hello-world\/"/);
    assert.match(list, /<label[^>]*for="article-search"/);
    assert.match(list, /data-search-panel/);
    assert.match(list, /data-tag="powershell"/);
    const home = readOutput(normal, 'index.html');
    assert.match(home, /<li class="article-card"[\s\S]*Second Post[\s\S]*Hello World/);
    assert.doesNotMatch(home, /Articles are on the way/);
    const index = JSON.parse(readOutput(normal, 'search-index.json'));
    const article = index.find((item) => item.kind === 'article' && item.title === 'Hello World');
    assert.equal(article.url, '/articles/hello-world/');
    assert.ok(Array.isArray(article.tags) && typeof article.description === 'string');
});

test('an article page has one h1, the date, the canonical address, an article element and no inline script or style', () => {
    const html = readOutput(normal, 'articles/hello-world/index.html');
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
    assert.match(html, /<article\b/);
    assert.match(html, /2026-03-01/);
    assert.ok(html.includes('<link rel="canonical" href="https://jonwitherspoon.com/articles/hello-world/"'));
    assert.match(html, /<script[^>]*\ssrc="\/search\.js"[^>]*\sdefer/);
    assertStrictCspClean(html, 'article page');
    assert.match(html, /<pre\b/, 'code block present');
});

test('every page of the normal build has the Articles link in the nav and the footer', () => {
    for (const file of ['index.html', 'articles/index.html', 'articles/hello-world/index.html']) {
        const html = readOutput(normal, file);
        assert.equal((html.match(/<a href="\/articles\/"[^>]*>Articles<\/a>/g) ?? []).length, 2, `${file} nav and footer link`);
    }
});

test('a draft appears in no page, no search entry and no folder', () => {
    const build = buildFixture('draft');
    assert.equal(build.status, 0, build.output);
    assert.ok(existsSync(join(build.outDir, 'articles', 'published-one', 'index.html')));
    assert.ok(!existsSync(join(build.outDir, 'articles', 'secret-draft')));
    for (const file of readdirSync(build.outDir, { recursive: true })) {
        if (!/\.(html|json|js)$/.test(file) || file.startsWith('exam_apps')) continue;
        assert.doesNotMatch(readFileSync(join(build.outDir, file), 'utf8'), /Secret Draft|secret-draft/, file);
    }
});

test('a folder article keeps its address, optimizes its picture and gives the img alt, size and lazy loading', () => {
    const build = buildFixture('image');
    assert.equal(build.status, 0, build.output);
    assert.ok(existsSync(join(build.outDir, 'articles', 'my-title', 'index.html')), '/articles/my-title/');
    assert.ok(!existsSync(join(build.outDir, 'articles', 'my-title', 'index', 'index.html')), 'not /articles/my-title/index/');
    const html = readOutput(build, 'articles/my-title/index.html');
    const image = /<img\b[^>]*>/.exec(html.slice(html.indexOf('<article')))[0];
    assert.match(image, /\salt="Screenshot of the policy"/);
    assert.match(image, /\swidth="\d+"/);
    assert.match(image, /\sheight="\d+"/);
    assert.match(image, /\sloading="lazy"/);
    assert.match(image, /\ssrc="\/_astro\/[^"]+\.(png|webp|jpg)[^"]*"/);
    assert.ok(readdirSync(join(build.outDir, '_astro')).some((file) => /\.(png|webp|jpg)$/.test(file)), 'optimized image file');
    assertStrictCspClean(html, 'image article');
});

test('a banner shows on the Articles card, the Home card and the article page; an article without one has no img in its card', () => {
    const build = buildFixture('banner');
    assert.equal(build.status, 0, build.output);
    const article = readOutput(build, 'articles/with-banner/index.html');
    const banner = /<img\b[^>]*>/.exec(article.slice(article.indexOf('<article')))[0];
    assert.match(banner, /\salt="A wide banner"/);
    assert.match(banner, /\swidth="\d+"/);
    assert.match(banner, /\sheight="\d+"/);
    assert.doesNotMatch(banner, /loading="lazy"/, 'the top banner loads at once');
    for (const file of ['articles/index.html', 'index.html']) {
        const html = readOutput(build, file);
        const cards = html.split('<li class="article-card"').slice(1).map((card) => card.slice(0, card.indexOf('</li>\n') + 1 || undefined));
        const withBanner = cards.find((card) => card.includes('With Banner'));
        const plain = cards.find((card) => card.includes('Plain Card'));
        assert.match(withBanner, /<img\b[^>]*alt="A wide banner"[^>]*loading="lazy"|<img\b[^>]*loading="lazy"[^>]*alt="A wide banner"/, `${file} banner card`);
        assert.doesNotMatch(plain.split('Plain Card')[0], /<img\b/, `${file} plain card has no picture`);
        assertStrictCspClean(html, file);
    }
    assertStrictCspClean(article, 'banner article');
});

test('raw script, a missing picture description, a banner without coverAlt and an outside image all fail the build with a clear message', () => {
    const cases = [
        ['script', /script/i, /bad-script\.md/],
        ['missing-alt', /alt text/i, /missing-alt\/my-title\/index\.md/],
        ['cover-no-alt', /coverAlt is required/, /cover-no-alt\/my-title\/index\.md/],
        ['external-image', /outside image address/i, /bad-external\.md/],
    ];
    for (const [name, message, file] of cases) {
        const build = buildFixture(name);
        assert.notEqual(build.status, 0, `${name} must fail the build`);
        assert.match(build.output, message, `${name} message`);
        assert.match(build.output, file, `${name} names the file`);
    }
});

test('a build with a chosen tag colour paints that tag the same on every page it appears on', () => {
    const build = buildFixture('normal', '{"PowerShell":"purple","OneDrive":"green"}');
    assert.equal(build.status, 0, build.output);
    for (const file of ['index.html', 'projects/index.html', 'portfolio/index.html', 'articles/index.html', 'articles/hello-world/index.html']) {
        const html = readFileSync(join(build.outDir, file), 'utf8');
        assert.match(html, /class="chip chip-purple[^"]*"[^>]*>PowerShell</, `${file} PowerShell`);
        assert.doesNotMatch(html, /chip-(blue|teal|amber|rose|green) [^>]*>PowerShell</, `${file} no automatic PowerShell`);
    }
    const projects = readFileSync(join(build.outDir, 'projects/index.html'), 'utf8');
    assert.match(projects, /class="chip chip-green[^"]*"[^>]*>OneDrive</);
    assert.match(projects, /class="chip chip-amber chip-button"[^>]*>Bash</, 'unlisted tags keep their automatic colour');
});

test('a bad colour in tagColors fails the build, naming the tag, the colour and the valid names', () => {
    const build = buildFixture('normal', '{"PowerShell":"purle"}');
    assert.notEqual(build.status, 0, 'the build must fail');
    assert.match(build.output, /PowerShell/);
    assert.match(build.output, /purle/);
    for (const name of TAG_COLOR_NAMES) assert.ok(build.output.includes(name), `lists ${name}`);
});
