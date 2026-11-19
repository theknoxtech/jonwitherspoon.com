import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { addNoindexHeader } from '../scripts/make-dev-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const scriptPath = join(root, 'scripts/make-dev-config.mjs');
const workflow = read('.github/workflows/deploy.yml');

const sampleConfig = {
    routes: [{ route: '/exam_apps*', headers: { 'X-Test': 'lab' } }],
    globalHeaders: { 'X-Frame-Options': 'DENY' },
    responseOverrides: { 404: { rewrite: '/404.html' } },
};

function jobBlock(name) {
    const start = workflow.indexOf(`\n  ${name}:`);
    assert.ok(start >= 0, `job ${name} not found`);
    const rest = workflow.slice(start + 1);
    const next = rest.slice(1).search(/\n  [a-z_]+:\n/);
    return next < 0 ? rest : rest.slice(0, next + 1);
}

function runScript(...args) {
    return spawnSync(process.execPath, [scriptPath, ...args], { encoding: 'utf8' });
}

// ------------------------------------------------------------- the script

test('addNoindexHeader adds the X-Robots-Tag global header and keeps everything else', () => {
    const result = addNoindexHeader(sampleConfig);
    assert.equal(result.globalHeaders['X-Robots-Tag'], 'noindex, nofollow');
    assert.equal(result.globalHeaders['X-Frame-Options'], 'DENY');
    assert.deepEqual(result.routes, sampleConfig.routes);
    assert.deepEqual(result.responseOverrides, sampleConfig.responseOverrides);
});

test('addNoindexHeader does not change its input and is idempotent', () => {
    const before = structuredClone(sampleConfig);
    const once = addNoindexHeader(sampleConfig);
    assert.deepEqual(sampleConfig, before);
    assert.deepEqual(addNoindexHeader(once), once);
});

test('the script rewrites dist/staticwebapp.config.json with the noindex header', () => {
    const dist = mkdtempSync(join(tmpdir(), 'devsite-'));
    writeFileSync(join(dist, 'staticwebapp.config.json'), JSON.stringify(sampleConfig));
    const result = runScript(dist);
    assert.equal(result.status, 0, result.stderr);
    const written = JSON.parse(readFileSync(join(dist, 'staticwebapp.config.json'), 'utf8'));
    assert.equal(written.globalHeaders['X-Robots-Tag'], 'noindex, nofollow');
    assert.deepEqual(written.routes, sampleConfig.routes);
});

test('the script exits nonzero with a message when the config file is missing', () => {
    const result = runScript(mkdtempSync(join(tmpdir(), 'devsite-')));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /staticwebapp\.config\.json/);
});

test('the script exits nonzero with a message when the config is not valid JSON', () => {
    const dist = mkdtempSync(join(tmpdir(), 'devsite-'));
    writeFileSync(join(dist, 'staticwebapp.config.json'), '{ not json');
    const result = runScript(dist);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /not valid JSON/);
});

test('the script exits nonzero with a usage message when no path is given', () => {
    const result = runScript();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Usage/);
});

test('the source config never contains X-Robots-Tag, so production cannot carry it', () => {
    assert.doesNotMatch(read('public/staticwebapp.config.json'), /X-Robots-Tag/i);
});

// ------------------------------------------------------------ the workflow

test('triggers: push to main and dev, pull request to main only', () => {
    const triggers = workflow.slice(workflow.indexOf('\non:'), workflow.indexOf('\npermissions:'));
    assert.match(triggers, /push:\s*\n\s*branches: \[main, dev\]/);
    assert.match(triggers, /pull_request:\s*\n\s*branches: \[main\]/);
});

test('deploy_dev runs only for a push to refs/heads/dev', () => {
    const condition = /\n    if: (.*)\n/.exec(jobBlock('deploy_dev'))?.[1];
    assert.equal(condition, "github.event_name == 'push' && github.ref == 'refs/heads/dev'");
});

test('the production job runs on pull requests and on pushes to main, never on dev', () => {
    const condition = /\n    if: (.*)\n/.exec(jobBlock('build_and_deploy'))[1];
    assert.match(condition, /^\(github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'\) \|\| \(/);
    assert.doesNotMatch(condition, /refs\/heads\/dev/);
});

test('each job references only its own deploy secret', () => {
    const dev = jobBlock('deploy_dev');
    const production = jobBlock('build_and_deploy');
    assert.match(dev, /azure_static_web_apps_api_token: \$\{\{ secrets\.AZURE_STATIC_WEB_APPS_API_TOKEN_DEV \}\}/);
    assert.doesNotMatch(dev.replaceAll('AZURE_STATIC_WEB_APPS_API_TOKEN_DEV', ''), /AZURE_STATIC_WEB_APPS_API_TOKEN/);
    assert.doesNotMatch(production, /AZURE_STATIC_WEB_APPS_API_TOKEN_DEV/);
    assert.doesNotMatch(jobBlock('close_pull_request'), /AZURE_STATIC_WEB_APPS_API_TOKEN_DEV/);
});

test('production_branch is dev on the dev job and main on the production job', () => {
    assert.match(jobBlock('deploy_dev'), /production_branch: dev\n/);
    assert.match(jobBlock('build_and_deploy'), /production_branch: main\n/);
});

test('the dev job runs make-dev-config.mjs on dist before the deploy step', () => {
    const dev = jobBlock('deploy_dev');
    const script = dev.indexOf('node scripts/make-dev-config.mjs dist');
    assert.ok(script > 0, 'script step missing');
    assert.ok(script < dev.indexOf('Azure/static-web-apps-deploy@'), 'script must run before deploy');
    assert.ok(script > dev.indexOf('npm run build'), 'script must run after the build');
});

test('the dev job keeps placeholders allowed and has no production-only placeholder check', () => {
    const dev = jobBlock('deploy_dev');
    assert.match(dev, /FAIL_ON_PLACEHOLDER: '0'/);
    assert.doesNotMatch(dev, /\[TO SUPPLY/);
});

test('the dev job builds and tests like production', () => {
    const dev = jobBlock('deploy_dev');
    for (const step of ['npm ci\n', 'npm run build\n', 'npm test\n', 'persist-credentials: false', 'node-version-file: .node-version']) {
        assert.ok(dev.includes(step), step);
    }
});

test('the dev job has only contents: read', () => {
    const dev = jobBlock('deploy_dev');
    assert.match(dev, /permissions:\n\s+contents: read\n/);
    assert.doesNotMatch(dev, /: write/);
});

test('every uses: is a full SHA and the dev job adds no new action', () => {
    const uses = [...workflow.matchAll(/uses: (\S+)@(\S+)/g)];
    for (const [, action, reference] of uses) assert.match(reference, /^[0-9a-f]{40}$/, action);
    const distinct = new Set(uses.map((match) => `${match[1]}@${match[2]}`));
    assert.equal(distinct.size, 3);
    const devActions = new Set([...jobBlock('deploy_dev').matchAll(/uses: (\S+)@/g)].map((match) => match[1]));
    assert.deepEqual([...devActions].sort(), ['Azure/static-web-apps-deploy', 'actions/checkout', 'actions/setup-node']);
});
