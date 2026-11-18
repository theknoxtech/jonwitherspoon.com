// QC round 1 (Normal size) final checks: the copy-paste examples in docs/editing-guide.md run
// against a throwaway copy of the site, article edge cases, odd text in site.json, the dev config
// script, and guide-versus-file statements. Every build runs in a copy under the system temp
// folder (own .vite/.astro caches), so the real dist/, public/ and exam_apps/ are never touched.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { TAG_COLOR_NAMES } from '../src/lib/tags.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const astroBin = join(root, 'node_modules/astro/bin/astro.mjs');
const skip = !existsSync(astroBin);
const guide = readFileSync(join(root, 'docs/editing-guide.md'), 'utf8');
const coverPng = join(root, 'tests/fixtures/blog/banner/with-banner/cover.png');

/** Returns the fenced code blocks (language and text) under a "## heading" of the editing guide. */
function guideBlocks(heading) {
    const lines = guide.split('\n');
    const startLine = lines.indexOf(`## ${heading}`);
    assert.ok(startLine >= 0, `guide heading missing: ${heading}`);
    let inFence = false;
    let endLine = lines.length;
    for (let index = startLine + 1; index < lines.length; index += 1) {
        if (lines[index].startsWith('```')) inFence = !inFence;
        if (!inFence && lines[index].startsWith('## ')) { endLine = index; break; }
    }
    const section = lines.slice(startLine, endLine).join('\n');
    return [...section.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((match) => ({ language: match[1], text: match[2] }));
}

/** The guide shows some examples as loose lines ("tagColors": {...},). Wrap and parse them. */
function parseFragment(text) {
    const trimmed = text.trim().replace(/,$/, '');
    return trimmed.startsWith('{') ? JSON.parse(trimmed) : JSON.parse(`{${trimmed}}`);
}

function makeCopy(label) {
    const directory = mkdtempSync(join(tmpdir(), `qcfinal-${label}-`));
    for (const name of ['src', 'public', 'astro.config.mjs', 'package.json']) cpSync(join(root, name), join(directory, name), { recursive: true });
    mkdirSync(join(directory, 'node_modules'));
    for (const name of readdirSync(join(root, 'node_modules'))) {
        if (name === '.vite' || name === '.astro') continue;
        symlinkSync(join(root, 'node_modules', name), join(directory, 'node_modules', name));
    }
    return directory;
}

function build(directory, extraEnv = {}) {
    const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' };
    delete env.FAIL_ON_PLACEHOLDER;
    delete env.GITHUB_SHA;
    for (const name of Object.keys(env)) if (name.startsWith('npm_') || name === 'INIT_CWD') delete env[name];
    Object.assign(env, extraEnv);
    const result = spawnSync(process.execPath, [astroBin, 'build', '--root', directory, '--outDir', join(directory, 'dist')], { cwd: directory, env, encoding: 'utf8', timeout: 180000 });
    return { status: result.status, output: `${result.stdout}\n${result.stderr}`, dist: join(directory, 'dist'), directory };
}

/** Copies the site, lets `change` edit site.json (object) and `setup` add files, builds, runs `body`, removes the copy. */
function withCopy(label, body, { siteChange, setup, extraEnv } = {}) {
    const directory = makeCopy(label);
    try {
        if (siteChange) {
            const path = join(directory, 'src/data/site.json');
            const site = JSON.parse(readFileSync(path, 'utf8'));
            siteChange(site);
            writeFileSync(path, JSON.stringify(site, null, 4));
        }
        if (setup) setup(directory);
        body(build(directory, extraEnv));
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
}

const page = (result, file) => readFileSync(join(result.dist, file), 'utf8');
const searchIndex = (result) => JSON.parse(page(result, 'search-index.json'));
const allFiles = (directory) => readdirSync(directory, { recursive: true });
const writeArticle = (directory, relativePath, text) => {
    const path = join(directory, 'src/content/blog', relativePath);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
};
const header = (fields) => `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n')}\n---\n`;

// ---------- editing guide: site.json examples ----------

test('QC guide: "Add a project" example builds; the project shows on Projects and in search, not on Home (featured false)', { skip }, () => {
    const project = JSON.parse(guideBlocks('Add a project')[0].text);
    withCopy('guide-project', (result) => {
        assert.equal(result.status, 0, result.output);
        const projects = page(result, 'projects/index.html');
        assert.match(projects, /My New Tool/);
        assert.ok(projects.includes('href="https://github.com/theknoxtech/my-new-tool"'));
        assert.equal((projects.match(/\sdata-search="/g) ?? []).length, 5, 'five project cards');
        assert.ok(searchIndex(result).some((item) => item.kind === 'project' && item.title === 'My New Tool'));
        assert.doesNotMatch(page(result, 'index.html'), /My New Tool/);
    }, { siteChange: (site) => site.projects.push(project) });
});

test('QC guide: "Add a button" examples add a button on Projects and a plain link on Home; removing the last one leaves a project with no links', { skip }, () => {
    const blocks = guideBlocks('Add or remove a button (a link)');
    const links = parseFragment(blocks[0].text).links;
    const added = parseFragment(blocks[1].text);
    assert.equal(links.length, 2);
    withCopy('guide-button', (result) => {
        assert.equal(result.status, 0, result.output);
        const projects = page(result, 'projects/index.html');
        assert.match(projects, /<a class="button[^"]*"[^>]*href="https:\/\/example\.com\/docs"[^>]*>\s*Documentation|href="https:\/\/example\.com\/docs"[^>]*class="button[^"]*"[^>]*>\s*Documentation/);
        assert.ok(page(result, 'index.html').includes('href="https://example.com/docs"'), 'Home shows it as a link');
    }, { siteChange: (site) => { site.projects[0].links = [...links, added]; } });
    withCopy('guide-button-removed', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.ok(!page(result, 'projects/index.html').includes('github.com/theknoxtech/winnow'));
    }, { siteChange: (site) => { site.projects[0].links = []; } });
});

test('QC guide: "Change tags" example builds and the chips and filter buttons follow the words', { skip }, () => {
    const tags = parseFragment(guideBlocks('Change tags')[0].text).tags;
    withCopy('guide-tags', (result) => {
        assert.equal(result.status, 0, result.output);
        const projects = page(result, 'projects/index.html');
        for (const tag of ['C#', 'Zeta Tag', 'Remote Support']) assert.ok(projects.includes(`>${tag}<`) || projects.includes(`>\n${tag}`) || projects.includes(tag), tag);
        assert.ok(projects.includes('data-tag="c#"'));
    }, { siteChange: (site) => { site.projects[1].tags = [...tags, 'Zeta Tag']; } });
});

test('QC guide: "Change the colour of a tag" example gives those tags those colours on Projects, Home and Articles, and a wrong colour stops the build with a clear message', { skip }, () => {
    const tagColors = parseFragment(guideBlocks('Change the colour of a tag')[0].text).tagColors;
    assert.deepEqual(tagColors, { PowerShell: 'blue', 'C#': 'teal' });
    withCopy('guide-color', (result) => {
        assert.equal(result.status, 0, result.output);
        const projects = page(result, 'projects/index.html');
        assert.match(projects, /class="chip chip-teal"[^>]*>\s*C#\s*</);
        assert.match(projects, /class="chip chip-blue"[^>]*>\s*PowerShell\s*</);
        assert.match(page(result, 'index.html'), /class="chip chip-teal"[^>]*>\s*C#\s*</);
    }, {
        siteChange: (site) => { site.tagColors = tagColors; },
    });
    withCopy('guide-color-bad', (result) => {
        assert.notEqual(result.status, 0);
        assert.match(result.output, /PowerShell/);
        assert.match(result.output, /"bleu"/);
        assert.match(result.output, /blue, teal, amber, rose, green, purple, orange, pink, sky, slate/);
    }, { siteChange: (site) => { site.tagColors = { PowerShell: 'bleu' }; } });
    withCopy('guide-color-case', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.ok(!/class="chip chip-green"[^>]*>\s*PowerShell\s*</.test(page(result, 'projects/index.html')), 'lowercase key must not match');
    }, { siteChange: (site) => { site.tagColors = { powershell: 'green' }; } });
});

test('QC guide: the ten colour names in the guide are exactly the ones the code accepts, and each has a stylesheet class', () => {
    const listed = [...guideBlocks('Change the colour of a tag').length ? guide.match(/one of these ten words[^\n]*\n?/)[0].matchAll(/`([a-z]+)`/g) : []].map((match) => match[1]);
    assert.deepEqual(listed, TAG_COLOR_NAMES);
    const css = readFileSync(join(root, 'src/styles/site.css'), 'utf8');
    for (const name of TAG_COLOR_NAMES) assert.ok(css.includes(`.chip-${name}`), `.chip-${name}`);
});

test('QC guide: "Add a lab" example shows on Labs and Home with its buttons; "planned" with empty links is a plain label', { skip }, () => {
    const lab = JSON.parse(guideBlocks('Add a lab and its buttons')[0].text);
    withCopy('guide-lab', (result) => {
        assert.equal(result.status, 0, result.output);
        const labs = page(result, 'labs/index.html');
        assert.ok(labs.includes('SC-200'));
        assert.ok(labs.includes('href="/exam_apps/sc-200/"'));
        assert.ok(labs.includes('href="/exam_apps/sc-200/kql-lab.html"'));
        const home = page(result, 'index.html');
        assert.ok(home.includes('href="/exam_apps/sc-200/"'), 'Home strip uses the first link');
        assert.ok(!home.includes('href="/exam_apps/sc-200/kql-lab.html"'), 'Home strip shows one button per lab');
    }, { siteChange: (site) => site.labs.push(lab) });
    withCopy('guide-lab-planned', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.ok(page(result, 'labs/index.html').includes('SC-200'));
        assert.ok(!page(result, 'labs/index.html').includes('/exam_apps/sc-200'));
        assert.ok(!page(result, 'index.html').includes('/exam_apps/sc-200'));
    }, { siteChange: (site) => site.labs.push({ ...lab, status: 'planned', links: [] }) });
});

test('QC guide: "Add a certification" example shows on Portfolio in list position, with its verify link', { skip }, () => {
    const certification = JSON.parse(guideBlocks('Add a certification')[0].text);
    withCopy('guide-cert', (result) => {
        assert.equal(result.status, 0, result.output);
        const portfolio = page(result, 'portfolio/index.html');
        assert.ok(portfolio.includes('Microsoft Certified: Example Associate'));
        assert.ok(portfolio.includes('href="https://learn.microsoft.com/..."'));
        assert.ok(portfolio.indexOf('Example Associate') < portfolio.indexOf('Azure Fundamentals'), 'unshift puts it first');
    }, { siteChange: (site) => site.certifications.unshift(certification) });
});

test('QC guide: "Update my current job" example removes every placeholder, so a production build (FAIL_ON_PLACEHOLDER=1) succeeds', { skip }, () => {
    const job = JSON.parse(guideBlocks('Update my current job')[0].text);
    withCopy('guide-job', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.doesNotMatch(result.output, /TO SUPPLY/);
        assert.ok(page(result, 'portfolio/index.html').includes('Remote'));
    }, { siteChange: (site) => { site.experience[0] = { ...site.experience[0], ...job }; }, extraEnv: { FAIL_ON_PLACEHOLDER: '1' } });
});

test('QC guide: the profile edit instructions (aboutDraftNote empty) remove the draft note', { skip }, () => {
    withCopy('guide-note', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.doesNotMatch(page(result, 'portfolio/index.html'), /DRAFT: Jon to review/);
    }, { siteChange: (site) => { site.profile.aboutDraftNote = ''; } });
});

// ---------- editing guide: articles ----------

const articleBlocks = guideBlocks('Add an article');
const simpleArticle = articleBlocks.find((block) => block.language === 'markdown').text;
const bannerLines = guideBlocks('Add an article').length ? guide.match(/cover: \.\/cover\.png\ncoverAlt: [^\n]+/)[0] : '';

let sharedArticles;
function articleBuild() {
    if (sharedArticles) return sharedArticles;
    const directory = makeCopy('articles');
    writeArticle(directory, 'my-title.md', simpleArticle);
    const withImages = simpleArticle.replace('title: How I automated BitLocker', 'title: Pictures Article').replace('date: 2026-12-01', 'date: 2026-12-05').replace('draft: false', `${bannerLines}\ndraft: false`).replace('A heading', 'A heading\n\n![what the picture shows](./bitlocker-policy.png)\n\nmore');
    writeArticle(directory, 'with-pictures/index.md', withImages);
    cpSync(coverPng, join(directory, 'src/content/blog/with-pictures/cover.png'));
    cpSync(coverPng, join(directory, 'src/content/blog/with-pictures/bitlocker-policy.png'));
    writeArticle(directory, 'hidden-draft.md', header({ title: 'Secret Draft Zzz', date: '2026-12-02', description: 'draft text Qqq', draft: 'true' }) + '\nbody\n');
    writeArticle(directory, 'future-one.md', header({ title: 'From The Future', date: '2099-01-01', description: 'future text' }) + '\nbody\n');
    writeArticle(directory, 'same-a.md', header({ title: 'Same Day Alpha', date: '2026-12-03', description: 'a' }) + '\nbody\n');
    writeArticle(directory, 'same-b.md', header({ title: 'Same Day Beta', date: '2026-12-03', description: 'b' }) + '\nbody\n');
    writeArticle(directory, 'My Spaced Title/index.md', header({ title: 'Spaced', date: '2026-12-04', description: 'spaces' }) + '\nbody\n');
    writeArticle(directory, 'Upper Case.md', header({ title: 'Upper', date: '2026-12-04', description: 'caps' }) + '\nbody\n');
    writeArticle(directory, 'notes.md.txt', 'not an article');
    sharedArticles = { directory, result: build(directory) };
    return sharedArticles;
}

test('QC guide: the "Add an article" example, a picture, a banner, a draft, a future date, same-date articles and odd folder names all build', { skip }, () => {
    const { result } = articleBuild();
    assert.equal(result.status, 0, result.output);
});

test('QC articles: the guide example appears on /articles/, its own page, Home and search; the draft appears nowhere', { skip }, () => {
    const { result } = articleBuild();
    const list = page(result, 'articles/index.html');
    assert.ok(list.includes('href="/articles/my-title/"'));
    assert.ok(page(result, 'articles/my-title/index.html').includes('How I automated BitLocker'));
    assert.ok(page(result, 'index.html').includes('/articles/'));
    const index = searchIndex(result).filter((item) => item.kind === 'article');
    assert.ok(index.some((item) => item.url === '/articles/my-title/'));
    for (const text of ['Secret Draft Zzz', 'draft text Qqq', 'hidden-draft']) {
        for (const file of allFiles(result.dist).filter((name) => /\.(html|json|xml|txt)$/.test(name))) {
            assert.ok(!readFileSync(join(result.dist, file), 'utf8').includes(text), `${text} leaked into ${file}`);
        }
    }
    assert.ok(!existsSync(join(result.dist, 'articles/hidden-draft')));
});

test('QC articles: picture and banner from the guide give optimized images with alt, size and lazy loading; the banner on the article page loads eagerly', { skip }, () => {
    const { result } = articleBuild();
    const article = page(result, 'articles/with-pictures/index.html');
    const images = [...article.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]).filter((tag) => tag.includes('/_astro/'));
    assert.ok(images.length >= 2, 'banner and inline picture');
    for (const tag of images) {
        assert.match(tag, /\salt="[^"]+"/);
        assert.match(tag, /\swidth="\d+"/);
        assert.match(tag, /\sheight="\d+"/);
        assert.doesNotMatch(tag, /style=/);
        assert.match(tag, /src="\/_astro\/[^"]+"/);
        const file = /src="\/(_astro\/[^"]+)"/.exec(tag)[1];
        assert.ok(existsSync(join(result.dist, file)), `${file} exists in dist`);
    }
    assert.ok(images.some((tag) => /alt="what the picture shows"/.test(tag) && /loading="lazy"/.test(tag)));
    assert.ok(images.some((tag) => /alt="Short description of the picture"/.test(tag) && /loading="eager"/.test(tag)));
    assert.ok(page(result, 'articles/index.html').includes('Short description of the picture'), 'banner on list card');
    assert.ok(page(result, 'index.html').includes('Short description of the picture'), 'banner on Home card');
    assert.ok(!readFileSync(join(result.dist, 'articles/my-title/index.html'), 'utf8').includes('/_astro/cover'), 'plain article page has no banner');
});

test('QC articles: future date still publishes; two articles on one date both appear; spaces and capitals give clean lowercase addresses; no .md or sibling notes publish', { skip }, () => {
    const { result } = articleBuild();
    const list = page(result, 'articles/index.html');
    assert.ok(list.includes('href="/articles/from-the-future/"') === false, 'address comes from the file name, not the title');
    assert.ok(list.includes('href="/articles/future-one/"'));
    assert.ok(list.indexOf('/articles/future-one/') < list.indexOf('/articles/with-pictures/'), 'future date sorts first');
    assert.ok(list.includes('/articles/same-a/') && list.includes('/articles/same-b/'));
    assert.ok(existsSync(join(result.dist, 'articles/my-spaced-title/index.html')), 'folder with spaces and capitals');
    assert.ok(existsSync(join(result.dist, 'articles/upper-case/index.html')), 'file with a space and capitals');
    assert.ok(!existsSync(join(result.dist, 'articles/my-spaced-title/index/index.html')));
    for (const name of allFiles(result.dist)) assert.doesNotMatch(name, /\.(md|sh|txt\.md)$|\.DS_Store|source|extra-notes|notes\.md/i, `unexpected published file ${name}`);
    assert.ok(!existsSync(join(result.dist, 'articles/extra-notes')));
});

test('QC articles: Home shows only the latest three, newest first', { skip }, () => {
    const { result } = articleBuild();
    const home = page(result, 'index.html');
    const addresses = [...home.matchAll(/href="(\/articles\/[a-z0-9-]+\/)"/g)].map((match) => match[1]);
    const unique = [...new Set(addresses)];
    assert.deepEqual(unique.slice(0, 2), ['/articles/future-one/', '/articles/with-pictures/']);
    assert.equal(unique.filter((address) => address !== '/articles/').length, 3);
});

test('QC articles: search index has articles with same-origin urls only and no draft', { skip }, () => {
    const { result } = articleBuild();
    const items = searchIndex(result);
    for (const item of items) assert.match(item.url, /^\/(?!\/)|^https:\/\//);
    const articles = items.filter((item) => item.kind === 'article');
    assert.equal(articles.length, 7, 'seven published, one draft left out');
    assert.ok(!articles.some((item) => /Secret Draft/.test(item.title)));
    assert.ok(articles.every((item) => item.url.startsWith('/articles/')));
});

test('QC articles: every article page and the list have one h1, a canonical on the apex, and no inline script, style or style=', { skip }, () => {
    const { result } = articleBuild();
    for (const file of ['articles/index.html', 'articles/my-title/index.html', 'articles/with-pictures/index.html', 'articles/my-spaced-title/index.html']) {
        const html = page(result, file);
        assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, file);
        assert.match(html, /<link rel="canonical" href="https:\/\/jonwitherspoon\.com\/articles\//, file);
        assert.doesNotMatch(html, /<style|\sstyle=|<script(?![^>]*\ssrc=)/i, file);
    }
});

after(() => {
    if (sharedArticles) rmSync(sharedArticles.directory, { recursive: true, force: true });
});

// ---------- articles: header mistakes and rule breaks, each in its own build ----------

const brokenArticleCases = {
    'missing title': [header({ date: '2026-12-01', description: 'x' }) + '\nbody\n', /title/i],
    'invalid date': [header({ title: 'T', date: 'not-a-date', description: 'x' }) + '\nbody\n', /date/i],
    'missing description': [header({ title: 'T', date: '2026-12-01' }) + '\nbody\n', /description/i],
    'draft that is not true or false': [header({ title: 'T', date: '2026-12-01', description: 'x', draft: 'maybe' }) + '\nbody\n', /draft/i],
    'picture with empty alt text': [header({ title: 'T', date: '2026-12-01', description: 'x' }) + '\n![](./a.png)\n', /alt/i, true],
    'raw style tag': [header({ title: 'T', date: '2026-12-01', description: 'x' }) + '\n<style>p{color:red}</style>\n', /style/i],
    'style attribute': [header({ title: 'T', date: '2026-12-01', description: 'x' }) + '\n<p style="color:red">x</p>\n', /style/i],
    'outside picture': [header({ title: 'T', date: '2026-12-01', description: 'x' }) + '\n![ok](https://example.com/a.png)\n', /outside|example\.com/i],
    'cover that is not a file': [header({ title: 'T', date: '2026-12-01', description: 'x', cover: './nope.png', coverAlt: 'a' }) + '\nbody\n', /nope\.png/, false, false],
};
for (const [label, [text, expected, folder, namesFile = true]] of Object.entries(brokenArticleCases)) {
    test(`QC articles: ${label} fails the build and the message names the problem${namesFile ? ' and the file' : ''}`, { skip }, () => {
        withCopy('broken', (result) => {
            assert.notEqual(result.status, 0, 'build must fail');
            if (namesFile) assert.match(result.output, /broken-one/, 'names the article file');
            assert.match(result.output, expected);
        }, {
            setup: (directory) => {
                if (folder) {
                    writeArticle(directory, 'broken-one/index.md', text);
                    cpSync(coverPng, join(directory, 'src/content/blog/broken-one/a.png'));
                } else writeArticle(directory, 'broken-one.md', text);
            },
        });
    });
}

test('QC articles: a draft with rule breaks inside does not stop the build and is not published', { skip }, () => {
    withCopy('draftbad', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.ok(!existsSync(join(result.dist, 'articles/draft-bad')));
    }, { setup: (directory) => writeArticle(directory, 'draft-bad.md', header({ title: 'T', date: '2026-12-01', description: 'x', draft: 'true' }) + '\n<script>alert(1)</script>\n') });
});

test('QC articles: [TO SUPPLY in an article blocks a production build only (FAIL_ON_PLACEHOLDER=1), and only warns otherwise', { skip }, () => {
    const setup = (directory) => writeArticle(directory, 'todo.md', header({ title: 'T', date: '2026-12-01', description: '"[TO SUPPLY: summary]"' }) + '\nbody\n');
    withCopy('articleplaceholder-warn', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.match(result.output, /articles\/todo\/index\.html/);
    }, { setup });
    withCopy('articleplaceholder-fail', (result) => {
        assert.notEqual(result.status, 0);
        assert.match(result.output, /TO SUPPLY/);
    }, { setup, extraEnv: { FAIL_ON_PLACEHOLDER: '1' } });
});

test('QC articles: a stray .md file next to an article (notes, README) is read as an article and fails the build loudly, naming the file', { skip }, () => {
    withCopy('strayfile', (result) => {
        assert.notEqual(result.status, 0);
        assert.match(result.output, /extra-notes/);
    }, { setup: (directory) => { writeArticle(directory, 'ok/index.md', header({ title: 'T', date: '2026-12-01', description: 'x' }) + '\nbody\n'); writeArticle(directory, 'ok/extra-notes.md', 'just notes'); } });
});

test('QC articles: duplicate address (todo.md and todo/index.md) is reported or both build; records what happens', { skip }, (t) => {
    withCopy('dupe', (result) => {
        t.diagnostic(`duplicate slug build status=${result.status}; ${result.output.split('\n').filter((line) => /duplicate|Duplicate|conflict|todo/i.test(line)).slice(0, 3).join(' | ')}`);
        if (result.status === 0) assert.ok(existsSync(join(result.dist, 'articles/todo/index.html')));
        else assert.match(result.output, /todo/);
    }, {
        setup: (directory) => {
            writeArticle(directory, 'todo.md', header({ title: 'One', date: '2026-12-01', description: 'x' }) + '\nbody\n');
            writeArticle(directory, 'todo/index.md', header({ title: 'Two', date: '2026-12-02', description: 'y' }) + '\nbody\n');
        },
    });
});

test('QC articles: odd characters in article title, description and tags are escaped; a tag with C#, spaces, unicode and a quote is a clean chip', { skip }, () => {
    withCopy('articleodd', (result) => {
        assert.equal(result.status, 0, result.output);
        const html = page(result, 'articles/odd/index.html');
        const list = page(result, 'articles/index.html');
        for (const document of [html, list]) {
            assert.doesNotMatch(document.replace(/="[^"]*"/g, '=""'), /<b>bold<\/b>/, 'escaped outside attribute values');
            assert.doesNotMatch(document, /"><script>alert/);
            assert.doesNotMatch(document, /<[a-z][^>]*"[^"]*"><script/);
        }
        for (const tag of ['C#', 'Zwei Wörter', '日本語', "O'Reilly"]) assert.ok(html.includes(tag.replace("'", '&#39;')) || html.includes(tag), tag);
        assert.ok(searchIndex(result).some((item) => item.title === 'Odd <b>bold</b> & "quoted"'));
    }, {
        setup: (directory) => writeArticle(directory, 'odd.md', '---\ntitle: \'Odd <b>bold</b> & "quoted"\'\ndate: 2026-12-01\ndescription: \'x"><script>alert(1)</script>\'\ntags: [C#, Zwei Wörter, 日本語, "O\'Reilly"]\n---\nbody\n'),
    });
});

// ---------- site.json: odd, empty and very long text ----------

test('QC edge site.json: empty strings in title, description and tags build', { skip }, () => {
    withCopy('emptytext', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.equal((page(result, 'projects/index.html').match(/\sdata-search="/g) ?? []).length, 4);
    }, { siteChange: (site) => { Object.assign(site.projects[0], { title: '', description: '', tags: [''] }); site.labs[0].name = ''; site.profile.roleLine = ''; site.profile.intro = ''; } });
});

test('QC edge site.json: very long text (20,000 characters, no spaces) builds, and the stylesheet breaks long words so it cannot cause sideways scroll', { skip }, () => {
    const long = 'A'.repeat(20000);
    withCopy('longtext', (result) => {
        assert.equal(result.status, 0, result.output);
        assert.ok(page(result, 'projects/index.html').includes(long));
        // The copy builds here come out without the CSS bundle (see report), so read the source stylesheet.
        assert.match(readFileSync(join(root, 'src/styles/site.css'), 'utf8'), /overflow-wrap:\s*anywhere/);
    }, { siteChange: (site) => { site.projects[0].description = long; site.projects[0].title = 'T'.repeat(300); } });
});

test('QC edge site.json: tags with C#, spaces, unicode, quotes, angle brackets, ampersand and a pipe build; text is escaped; filter buttons are real buttons', { skip }, () => {
    const tags = ['C#', 'two words', '日本語', "O'Reilly", 'say "hi"', '<b>x</b>', 'a&b', 'a|b'];
    withCopy('oddtags', (result) => {
        assert.equal(result.status, 0, result.output);
        const projects = page(result, 'projects/index.html');
        assert.doesNotMatch(projects.replace(/="[^"]*"/g, '=""'), /<b>x<\/b>/, 'escaped outside attribute values');
        assert.ok(projects.includes('&lt;b&gt;x&lt;/b&gt;'));
        assert.ok(projects.includes('日本語'));
        const filters = [...projects.matchAll(/<button\b[^>]*data-tag="([^"]*)"[^>]*>/g)];
        assert.ok(filters.length >= tags.length);
        for (const filter of filters) assert.match(filter[0], /type="button"/, 'real button, keyboard-operable');
        assert.ok(searchIndex(result).some((item) => item.kind === 'project' && item.tags.includes('<b>x</b>')));
    }, { siteChange: (site) => { site.projects[0].tags = tags; } });
});

test('QC edge site.json: a tag containing "|" can still be filtered (data-tags uses "|" as its separator)', { skip, todo: 'Low: public/search.js splits data-tags on "|", so a tag like "a|b" never matches its own filter button' }, () => {
    withCopy('pipetag', (result) => {
        const projects = page(result, 'projects/index.html');
        const card = /data-tags="([^"]*)"/.exec(projects)[1];
        assert.ok(card.split('|').includes('a|b'));
    }, { siteChange: (site) => { site.projects[0].tags = ['a|b']; } });
});

// ---------- dev config script ----------

const devScript = join(root, 'scripts/make-dev-config.mjs');

test('QC dev config: a config with no globalHeaders gets one with only the noindex header; a path that is a file is a clear error; the source config is untouched', () => {
    const directory = mkdtempSync(join(tmpdir(), 'qcfinal-dev-'));
    try {
        writeFileSync(join(directory, 'staticwebapp.config.json'), JSON.stringify({ routes: [{ route: '/a', headers: { A: 'b' } }] }));
        const ok = spawnSync(process.execPath, [devScript, directory], { encoding: 'utf8' });
        assert.equal(ok.status, 0, ok.stderr);
        const written = JSON.parse(readFileSync(join(directory, 'staticwebapp.config.json'), 'utf8'));
        assert.deepEqual(written.globalHeaders, { 'X-Robots-Tag': 'noindex, nofollow' });
        assert.equal(written.routes[0].route, '/a');
        const notDirectory = spawnSync(process.execPath, [devScript, join(directory, 'staticwebapp.config.json')], { encoding: 'utf8' });
        assert.notEqual(notDirectory.status, 0);
        assert.match(notDirectory.stderr, /Cannot read|not valid|ENOTDIR/);
        const empty = join(directory, 'empty.json');
        mkdirSync(join(directory, 'sub'));
        writeFileSync(join(directory, 'sub', 'staticwebapp.config.json'), '');
        const emptyFile = spawnSync(process.execPath, [devScript, join(directory, 'sub')], { encoding: 'utf8' });
        assert.notEqual(emptyFile.status, 0);
        assert.match(emptyFile.stderr, /not valid JSON/);
        assert.ok(!existsSync(empty));
        assert.ok(!readFileSync(join(root, 'public/staticwebapp.config.json'), 'utf8').includes('X-Robots-Tag'));
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

test('QC dev config: run on a copy of the real config it keeps the lab route first, the 404 override and all six security headers, and adds noindex once', () => {
    const directory = mkdtempSync(join(tmpdir(), 'qcfinal-devreal-'));
    try {
        cpSync(join(root, 'public/staticwebapp.config.json'), join(directory, 'staticwebapp.config.json'));
        for (let run = 0; run < 2; run += 1) assert.equal(spawnSync(process.execPath, [devScript, directory], { encoding: 'utf8' }).status, 0);
        const text = readFileSync(join(directory, 'staticwebapp.config.json'), 'utf8');
        const config = JSON.parse(text);
        const source = JSON.parse(readFileSync(join(root, 'public/staticwebapp.config.json'), 'utf8'));
        assert.equal((text.match(/X-Robots-Tag/g) ?? []).length, 1);
        assert.deepEqual(config.routes, source.routes);
        assert.deepEqual(config.responseOverrides, source.responseOverrides);
        assert.deepEqual({ ...config.globalHeaders, 'X-Robots-Tag': undefined }, { ...source.globalHeaders, 'X-Robots-Tag': undefined });
        assert.ok(Buffer.byteLength(text) < 20 * 1024);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

// ---------- guides versus the real files ----------

const workflow = readFileSync(join(root, '.github/workflows/deploy.yml'), 'utf8');
const actionsGuide = readFileSync(join(root, 'docs/github-actions-guide.md'), 'utf8');
const setupGuide = readFileSync(join(root, 'docs/setup-guide.md'), 'utf8');

test('QC guides: every secret name the guides mention exists in the workflow, and every secret the workflow reads is in the guides', () => {
    const inWorkflow = new Set([...workflow.matchAll(/secrets\.([A-Z0-9_]+)/g)].map((match) => match[1]));
    const inGuides = new Set([...(actionsGuide + setupGuide).matchAll(/\b(AZURE_STATIC_WEB_APPS_API_TOKEN[A-Z_]*)\b/g)].map((match) => match[1]));
    for (const name of inGuides) assert.ok(inWorkflow.has(name), `guide names ${name} but the workflow does not read it`);
    for (const name of inWorkflow) if (name !== 'GITHUB_TOKEN') assert.ok(inGuides.has(name), `workflow reads ${name} but the guides never mention it`);
});

test('QC guides: files and folders the editing guide names exist (or are created by the guide)', () => {
    for (const path of ['src/data/site.json', 'src/styles/site.css', 'public/theme.js', 'docs/setup-guide.md']) assert.ok(existsSync(join(root, path)), path);
    for (const key of ['profile', 'experience', 'projects', 'certifications', 'tagColors', 'labs']) assert.ok(key in JSON.parse(readFileSync(join(root, 'src/data/site.json'), 'utf8')), key);
    assert.match(guide, /dev\.jonwitherspoon\.com/);
    assert.match(workflow, /branches: \[main, dev\]/);
});

test('QC guides: the Actions guide step list matches the workflow steps (checkout, node, npm ci, build, test, scan, placeholder check, deploy)', () => {
    const steps = [...actionsGuide.slice(actionsGuide.indexOf("The robot's steps")).matchAll(/^\d+\. (.+)$/gm)].map((match) => match[1]);
    const mentionsTest = steps.some((step) => /npm test|run the tests|tests/i.test(step));
    assert.ok(/- name: Test\n\s+run: npm test/.test(workflow), 'workflow has a Test step');
    assert.ok(mentionsTest, 'the guide step list should mention the test step the workflow runs');
});

test('QC guides: the Actions guide does not claim the workflow skips npm test while the workflow runs it', () => {
    const claimsNoTests = /workflow does not run `npm test`/.test(actionsGuide);
    const runsTests = /run: npm test/.test(workflow);
    assert.ok(!(claimsNoTests && runsTests), 'docs/github-actions-guide.md "Not in the workflow today" contradicts deploy.yml');
});
