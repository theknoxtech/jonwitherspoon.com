import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const config = JSON.parse(read('public/staticwebapp.config.json'));
const workflow = read('.github/workflows/deploy.yml');
const packageJson = JSON.parse(read('package.json'));
const builtLabs = join(root, 'dist/exam_apps');
const LAB_COMMIT = 'c1d1619';
const labFiles = ['exam_apps/md-102/index.html', 'exam_apps/md-102/kql-lab.html'];

function walk(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });
}

test('config is valid JSON under 20 KB', () => {
    assert.ok(statSync(join(root, 'public/staticwebapp.config.json')).size < 20 * 1024);
});

test('global headers match the plan', () => {
    const headers = config.globalHeaders;
    assert.equal(headers['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
    assert.equal(headers['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()');
    assert.equal(headers['X-Frame-Options'], 'DENY');
    assert.equal('X-XSS-Protection' in headers, false);
    assert.doesNotMatch(read('public/staticwebapp.config.json'), /preload/);
});

test('main CSP is strict', () => {
    const csp = config.globalHeaders['Content-Security-Policy'];
    for (const part of ["default-src 'self'", "img-src 'self' data:", "object-src 'none'", "base-uri 'self'", "form-action 'none'", "frame-ancestors 'none'"]) {
        assert.ok(csp.includes(part), part);
    }
    assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval|https?:/);
});

test('/exam_apps* is the first route and carries the lab CSP', () => {
    const [first] = config.routes;
    assert.equal(first.route, '/exam_apps*');
    const csp = first.headers['Content-Security-Policy'];
    for (const part of ["script-src 'self' 'unsafe-inline'", "connect-src 'none'", "frame-ancestors 'none'", "object-src 'none'"]) {
        assert.ok(csp.includes(part), part);
    }
});

test('lab CSP allows Google Fonts on the lab route only', () => {
    const csp = config.routes[0].headers['Content-Security-Policy'];
    assert.ok(csp.includes("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"), 'style-src');
    assert.ok(csp.includes("font-src 'self' https://fonts.gstatic.com;"), 'font-src');
    assert.equal([...csp.matchAll(/https?:\/\/[^\s;]+/g)].length, 2);
    assert.equal(config.routes.length, 1);
    assert.doesNotMatch(JSON.stringify(config.globalHeaders), /google|gstatic/);
});

test('/exam_apps* matches the folder, no-slash form and files', () => {
    const prefix = config.routes[0].route.slice(0, -1);
    for (const path of ['/exam_apps', '/exam_apps/', '/exam_apps/md-102', '/exam_apps/md-102/', '/exam_apps/md-102/kql-lab.html']) {
        assert.ok(path.startsWith(prefix), path);
    }
});

test('404 override exists and there is no navigationFallback', () => {
    assert.deepEqual(config.responseOverrides['404'], { rewrite: '/404.html' });
    assert.equal('navigationFallback' in config, false);
});

test('workflow permissions, triggers and secrets', () => {
    assert.match(workflow, /^permissions:\n  contents: read$/m);
    assert.doesNotMatch(workflow, /pull_request_target|id-token/);
    assert.match(workflow, /persist-credentials: false/);
    assert.match(workflow, /node-version-file: \.node-version/);
    assert.match(workflow, /run: npm ci$/m);
    assert.doesNotMatch(workflow, /npm install/);
    assert.match(workflow, /skip_app_build: true/);
    assert.match(workflow, /skip_api_build: true/);
    assert.match(workflow, /app_location: dist/);
    assert.match(workflow, /head\.repo\.full_name == github\.repository/);
    assert.match(workflow, /dependabot\[bot\]/);
    assert.match(workflow, /azure_static_web_apps_api_token: \$\{\{ secrets\.AZURE_STATIC_WEB_APPS_API_TOKEN \}\}/);
    assert.equal((workflow.match(/pull-requests: write/g) ?? []).length, 1);
});

function runStepLines(text) {
    const lines = text.split('\n');
    const collected = [];
    for (let index = 0; index < lines.length; index += 1) {
        const match = lines[index].match(/^(\s*)run:(.*)$/);
        if (!match) continue;
        collected.push(match[2]);
        for (let next = index + 1; next < lines.length; next += 1) {
            const indent = lines[next].match(/^(\s*)/)[1].length;
            if (lines[next].trim() !== '' && indent <= match[1].length) break;
            collected.push(lines[next]);
        }
    }
    return collected;
}

test('workflow never puts expressions inside run steps', () => {
    const lines = runStepLines(workflow);
    assert.ok(lines.length >= 3);
    for (const line of lines) assert.doesNotMatch(line, /\$\{\{/);
});

test('actions are pinned to the planned SHAs', () => {
    const uses = [...workflow.matchAll(/uses: (\S+)@(\S+)/g)].map((match) => `${match[1]}@${match[2]}`);
    assert.ok(uses.length >= 3);
    for (const reference of uses) assert.match(reference, /@[0-9a-f]{40}$/, reference);
    assert.ok(workflow.includes('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1'));
    assert.ok(workflow.includes('actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1'));
    assert.ok(workflow.includes('Azure/static-web-apps-deploy@1a947af9992250f3bc2e68ad0754c0b0c11566c9'));
});

test('dependabot covers actions and npm against dev', () => {
    const dependabot = read('.github/dependabot.yml');
    assert.match(dependabot, /github-actions/);
    assert.match(dependabot, /package-ecosystem: npm/);
    assert.equal((dependabot.match(/target-branch: dev/g) ?? []).length, 2);
});

test('package.json has Astro as the only dependency', () => {
    assert.deepEqual(packageJson.dependencies, { astro: '^6.4.8' });
    assert.equal(packageJson.devDependencies, undefined);
    assert.equal(packageJson.engines.node, '>=22.12');
    assert.equal(packageJson.scripts.test, 'node --test tests/');
    assert.equal(read('.node-version').trim(), '22');
    assert.match(read('.gitattributes'), /^\* text=auto eol=lf$/m);
});

test('no lab files or notes under public/', () => {
    const files = walk(join(root, 'public')).map((file) => relative(root, file));
    for (const file of files) {
        assert.doesNotMatch(file, /\/(source|kql-source)\/|\.md$|\.DS_Store$/, file);
    }
});

const hasBuild = existsSync(join(root, 'dist'));

test('dist hygiene when a build exists', { skip: !hasBuild }, () => {
    const files = walk(join(root, 'dist'));
    for (const file of files) {
        const name = relative(root, file);
        assert.doesNotMatch(name, /\/(source|kql-source)\/|\.(md|sh)$|\.DS_Store$/, name);
        if (name.endsWith('.js')) assert.match(name, /^dist\/_astro\//, name);
    }
    const phone = /\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}/;
    const address = /\d{1,5} [A-Za-z]+ (Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd)\b/;
    for (const file of files.filter((name) => /\.(html|json|xml|txt)$/.test(name))) {
        const text = readFileSync(file, 'utf8');
        assert.doesNotMatch(text, phone, relative(root, file));
        assert.doesNotMatch(text, address, relative(root, file));
    }
});

test('built labs: only .html files, and the apps are byte-identical copies', { skip: !hasBuild }, () => {
    for (const file of walk(builtLabs)) assert.match(file, /\.html$/, relative(root, file));
    for (const name of ['index.html', 'kql-lab.html']) {
        const built = readFileSync(join(builtLabs, 'md-102', name));
        assert.ok(built.equals(readFileSync(join(root, 'exam_apps/md-102', name))), name);
    }
});

test('lab pages: informational scan (the apps are not edited, nothing here fails)', (t) => {
    for (const file of labFiles) {
        const text = read(file);
        const hosts = new Set([...text.matchAll(/(?:src|href)=["']https?:\/\/([^/"']+)/g)].map((match) => match[1]));
        const risky = text.match(/<iframe|\beval\(|new Function|@import|\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|importScripts/g) ?? [];
        const personal = (text.match(/theknoxtech|witherspoon|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/gi) ?? []).concat(text.match(/\/Users\/[A-Za-z]|C:\\Users\\jon/g) ?? []);
        t.diagnostic(`${file}: hosts [${[...hosts].join(', ')}]; risky constructs [${[...new Set(risky)].join(', ')}]; personal-looking strings [${[...new Set(personal)].join(', ')}]`);
    }
});

function committedLabFiles() {
    const listing = execFileSync('git', ['ls-tree', '-r', '--name-only', LAB_COMMIT], { cwd: root, encoding: 'utf8' });
    return listing.split('\n').filter((name) => name.startsWith('md-102/'));
}

const hasLabCommit = (() => {
    try {
        execFileSync('git', ['cat-file', '-e', `${LAB_COMMIT}^{commit}`], { cwd: root, stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
})();

test('study apps are byte-identical to the original commit', { skip: !hasLabCommit && `commit ${LAB_COMMIT} not available` }, () => {
    const committed = committedLabFiles();
    assert.equal(committed.length, 44);
    for (const committedPath of committed) {
        const original = execFileSync('git', ['show', `${LAB_COMMIT}:${committedPath}`], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
        const target = `exam_apps/${committedPath}`;
        assert.ok(existsSync(join(root, target)), `${target} is missing`);
        assert.ok(original.equals(readFileSync(join(root, target))), `${target} differs from ${LAB_COMMIT}:${committedPath}`);
    }
});
