// QC edge cases that need a fresh build. Every build runs in a throwaway copy of
// the site under the system temp folder, so the real dist/ and exam_apps/ are
// never touched. The packages in node_modules are shared through links, but each copy
// gets its own .vite and .astro cache folders: two builds sharing one Vite dependency
// cache collide (ENOTEMPTY on node_modules/.vite/deps) whenever they overlap.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const astroBin = join(root, 'node_modules/astro/bin/astro.mjs');
const canBuild = existsSync(astroBin);

function makeCopy(label) {
    const directory = mkdtempSync(join(tmpdir(), `qc-${label}-`));
    for (const name of ['src', 'public', 'astro.config.mjs', 'package.json']) cpSync(join(root, name), join(directory, name), { recursive: true });
    mkdirSync(join(directory, 'node_modules'));
    for (const name of readdirSync(join(root, 'node_modules'))) {
        if (name === '.vite' || name === '.astro') continue;
        symlinkSync(join(root, 'node_modules', name), join(directory, 'node_modules', name));
    }
    return directory;
}

function removeCopy(directory) {
    rmSync(directory, { recursive: true, force: true });
}

function build(directory, extraEnv = {}) {
    const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', ...extraEnv };
    delete env.FAIL_ON_PLACEHOLDER;
    delete env.GITHUB_SHA;
    // Nothing from the outer npm run may point a throwaway build back at the real project.
    for (const name of Object.keys(env)) if (name.startsWith('npm_') || name === 'INIT_CWD') delete env[name];
    Object.assign(env, extraEnv);
    const result = spawnSync(process.execPath, [astroBin, 'build', '--root', directory, '--outDir', join(directory, 'dist')], { cwd: directory, env, encoding: 'utf8', timeout: 120000 });
    return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

function withCopy(label, body, { siteChange, extraEnv, setup } = {}) {
    const directory = makeCopy(label);
    try {
        if (siteChange) {
            const path = join(directory, 'src/data/site.json');
            const site = JSON.parse(readFileSync(path, 'utf8'));
            siteChange(site);
            writeFileSync(path, JSON.stringify(site, null, 4));
        }
        if (setup) setup(directory);
        const result = build(directory, extraEnv);
        body(result, directory);
    } finally {
        removeCopy(directory);
    }
}

function walkNames(directory) {
    return readdirSync(directory, { recursive: true });
}

const skip = !canBuild;

// Guard: no throwaway build may write into the real dist/. Snapshot first, compare in the last test.
const realProjectsPage = join(root, 'dist/projects/index.html');
const realPageBefore = existsSync(realProjectsPage) ? readFileSync(realProjectsPage, 'utf8') : null;

test('QC edge: build with NO exam_apps folder at all succeeds and publishes no exam_apps', { skip }, () => {
    withCopy('noapps', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        assert.ok(!existsSync(join(directory, 'dist/exam_apps')));
        assert.ok(existsSync(join(directory, 'dist/index.html')));
    });
});

test('QC edge: build with an EMPTY exam_apps folder succeeds', { skip }, () => {
    withCopy('emptyapps', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        assert.ok(!existsSync(join(directory, 'dist/exam_apps')) || readdirSync(join(directory, 'dist/exam_apps')).length === 0);
    }, { setup: (directory) => mkdirSync(join(directory, 'exam_apps')) });
});

test('QC edge: a lab folder with no index.html builds, copies no notes or scripts, and publishes only an empty folder', { skip }, (t) => {
    withCopy('noindex', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        const published = walkNames(join(directory, 'dist/exam_apps'));
        assert.deepEqual(published, ['sc-300'], `expected only an empty sc-300 folder, got ${published}`);
        t.diagnostic('observed: dist/exam_apps/sc-300/ is created empty; the build does not warn that a lab has no page');
    }, {
        setup: (directory) => {
            mkdirSync(join(directory, 'exam_apps/sc-300/source'), { recursive: true });
            writeFileSync(join(directory, 'exam_apps/sc-300/notes.md'), '# notes\n');
            writeFileSync(join(directory, 'exam_apps/sc-300/source/app.js'), 'x');
            writeFileSync(join(directory, 'exam_apps/stray.html'), '<p>stray</p>');
        },
    });
});

test('QC edge: a lab folder copies only its top-level .html files (not .md, .sh, .js, sub-folders, dotfiles)', { skip }, () => {
    withCopy('labcopy', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        assert.deepEqual(walkNames(join(directory, 'dist/exam_apps')).sort(), ['mylab', 'mylab/extra.html', 'mylab/index.html']);
    }, {
        setup: (directory) => {
            const lab = join(directory, 'exam_apps/mylab');
            mkdirSync(join(lab, 'source'), { recursive: true });
            for (const name of ['index.html', 'extra.html', 'README.md', 'build.sh', 'data.js', '.DS_Store', 'source/app.html']) writeFileSync(join(lab, name), 'x');
        },
    });
});

const optionalFieldCases = {
    'lab without updated (null)': (site) => { delete site.labs[0].updated; },
    'lab without links (a live lab with no buttons)': (site) => { delete site.labs[0].links; },
    'lab with an empty links list': (site) => { site.labs[0].links = []; },
    'project without links': (site) => { delete site.projects[0].links; },
    'project with an empty links list': (site) => { site.projects[0].links = []; },
    'lab without currentFor': (site) => { delete site.labs[0].currentFor; },
    'certification without verifyUrl and verifyLabel': (site) => { delete site.certifications[0].verifyUrl; delete site.certifications[0].verifyLabel; },
    'certification without earned': (site) => { delete site.certifications[0].earned; },
    'education without areas': (site) => { delete site.education.areas; },
    'profile without about paragraphs': (site) => { site.profile.about = []; },
};

for (const [label, change] of Object.entries(optionalFieldCases)) {
    test(`QC edge site.json: ${label} still builds`, { skip }, () => {
        withCopy('optional', ({ status, output }) => assert.equal(status, 0, output.split('\n').filter((line) => /Error|TypeError|Cannot/.test(line)).join('\n')), { siteChange: change });
    });
}

test('QC edge site.json: a new lab entry with only code and name (and one with one link) builds', { skip }, () => {
    withCopy('guidelab', ({ status, output }) => {
        assert.equal(status, 0, output.split('\n').filter((line) => /Error|TypeError|Cannot/.test(line)).join('\n'));
    }, { siteChange: (site) => { site.labs.push({ code: 'AZ-900', name: 'Azure Fundamentals' }); site.labs.push({ code: 'AZ-104', name: 'Azure Administrator', links: [{ label: 'AZ-104', path: '/exam_apps/az-104/' }] }); } });
});

test('QC edge site.json: a planned lab without a links list builds', { skip }, () => {
    withCopy('nocompanions', ({ status, output }) => {
        assert.equal(status, 0, output.split('\n').filter((line) => /Error|TypeError|Cannot/.test(line)).join('\n'));
    }, { siteChange: (site) => { delete site.labs[1].links; } });
});

test('QC edge site.json: an experience entry without technologies builds', { skip }, () => {
    withCopy('notech', ({ status, output }) => {
        assert.equal(status, 0, output.split('\n').filter((line) => /Error|TypeError|Cannot/.test(line)).join('\n'));
    }, { siteChange: (site) => { delete site.experience[1].technologies; } });
});

test('QC edge site.json: a project without tags builds', { skip }, () => {
    withCopy('notags', ({ status, output }) => {
        assert.equal(status, 0, output.split('\n').filter((line) => /Error|TypeError|Cannot/.test(line)).join('\n'));
    }, { siteChange: (site) => { delete site.projects[3].tags; } });
});

test('QC edge site.json: a project without featured or order builds and does not appear on Home', { skip }, () => {
    withCopy('nofeatured', ({ status, output }, directory) => {
        assert.equal(status, 0, output.split('\n').filter((line) => /Error|TypeError|Cannot/.test(line)).join('\n'));
        assert.equal((readFileSync(join(directory, 'dist/index.html'), 'utf8').match(/class="card"/g) ?? []).length, 3);
    }, { siteChange: (site) => { delete site.projects[3].featured; delete site.projects[3].order; } });
});

test('QC edge: a missing avatar file does not stop the build (no guard), and the page then points at a missing file', { skip }, (t) => {
    withCopy('noavatar', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        assert.ok(!existsSync(join(directory, 'dist/avatar.jpg')));
        assert.match(readFileSync(join(directory, 'dist/index.html'), 'utf8'), /src="\/avatar\.jpg"/);
        t.diagnostic('observed: build exits 0 and ships a broken avatar reference when public/avatar.jpg is missing');
    }, { setup: (directory) => unlinkSync(join(directory, 'public/avatar.jpg')) });
});

test('QC edge: the build stamp shows the first 7 characters of GITHUB_SHA, or "local"', { skip }, () => {
    withCopy('sha', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        assert.match(readFileSync(join(directory, 'dist/index.html'), 'utf8'), /built \d{4}-\d{2}-\d{2} · abcdef1</);
    }, { extraEnv: { GITHUB_SHA: 'abcdef1234567890abcdef1234567890abcdef12' } });
    withCopy('nosha', ({ status }, directory) => {
        assert.equal(status, 0);
        assert.match(readFileSync(join(directory, 'dist/index.html'), 'utf8'), /built \d{4}-\d{2}-\d{2} · local</);
    });
});

test('QC placeholder guard: warns and exits 0 by default, naming the files', { skip }, () => {
    withCopy('warn', ({ status, output }) => {
        assert.equal(status, 0, output);
        assert.match(output, /WARNING: 1 page\(s\) still contain "\[TO SUPPLY": portfolio\/index\.html/);
    });
});

test('QC placeholder guard: FAIL_ON_PLACEHOLDER=1 fails the build with a non-zero exit and names the files', { skip }, () => {
    withCopy('fail', ({ status, output }) => {
        assert.notEqual(status, 0, 'build should fail');
        assert.match(output, /1 page\(s\) still contain "\[TO SUPPLY": portfolio\/index\.html/);
        assert.doesNotMatch(output, /WARNING:/);
    }, { extraEnv: { FAIL_ON_PLACEHOLDER: '1' } });
});

test('QC placeholder guard: FAIL_ON_PLACEHOLDER=0 only warns', { skip }, () => {
    withCopy('zero', ({ status, output }) => {
        assert.equal(status, 0, output);
        assert.match(output, /WARNING:/);
    }, { extraEnv: { FAIL_ON_PLACEHOLDER: '0' } });
});

test('QC placeholder guard: with every placeholder filled in, no warning and FAIL_ON_PLACEHOLDER=1 passes', { skip }, () => {
    withCopy('filled', ({ status, output }, directory) => {
        assert.equal(status, 0, output);
        assert.doesNotMatch(output, /WARNING|TO SUPPLY/);
        assert.ok(existsSync(join(directory, 'dist/index.html')));
    }, {
        extraEnv: { FAIL_ON_PLACEHOLDER: '1' },
        siteChange: (site) => {
            const filled = JSON.parse(JSON.stringify(site).replaceAll(/\[TO SUPPLY[^"]*\]/g, 'Filled'));
            Object.assign(site, filled);
        },
    });
});

test('QC placeholder guard (info): only the exact value "1" triggers failure; "true" and "yes" only warn', { skip }, (t) => {
    for (const value of ['true', 'yes']) {
        withCopy('truthy', ({ status }) => {
            assert.equal(status, 0, `FAIL_ON_PLACEHOLDER=${value} should only warn`);
        }, { extraEnv: { FAIL_ON_PLACEHOLDER: value } });
    }
    t.diagnostic('the workflow sets exactly "1" or "0", so this is consistent with CI');
});

test('QC placeholder guard: a placeholder added to a page that had none is caught (page title)', { skip }, () => {
    withCopy('newplaceholder', ({ status, output }) => {
        assert.notEqual(status, 0);
        assert.match(output, /projects\/index\.html/);
    }, {
        extraEnv: { FAIL_ON_PLACEHOLDER: '1' },
        siteChange: (site) => { site.projects[0].description = '[TO SUPPLY: description]'; },
    });
});

test('QC edge: running the build twice gives the same file list (rebuild is repeatable)', { skip }, () => {
    const directory = makeCopy('twice');
    try {
        assert.equal(build(directory).status, 0);
        const first = walkNames(join(directory, 'dist')).sort();
        assert.equal(build(directory).status, 0);
        assert.deepEqual(walkNames(join(directory, 'dist')).sort(), first);
    } finally {
        removeCopy(directory);
    }
});

test('QC edge: the throwaway builds left the real dist/ untouched', () => {
    const after = existsSync(realProjectsPage) ? readFileSync(realProjectsPage, 'utf8') : null;
    assert.equal(after, realPageBefore, 'dist/projects/index.html changed while the edge-case builds ran');
});
