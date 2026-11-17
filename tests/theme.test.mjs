import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MAIN_PAGES = ['index.html', 'portfolio/index.html', 'projects/index.html', 'labs/index.html', '404.html'];
const THEME_SOURCE = readFileSync(new URL('../public/theme.js', import.meta.url), 'utf8');
const CSS_SOURCE = readFileSync(new URL('../src/styles/site.css', import.meta.url), 'utf8');

function readPage(file) {
    const path = join(DIST, file);
    assert.ok(existsSync(path), `dist/${file} is missing (run "npm run build" first)`);
    return readFileSync(path, 'utf8');
}

/**
 * Runs public/theme.js against a small fake page and fake storage.
 *
 * @param {object} options
 * @param {string | null} [options.saved] Value already in localStorage.
 * @param {boolean} [options.storageThrows] Make every localStorage call throw.
 * @param {boolean} [options.deviceDark] Whether the device prefers dark.
 * @param {string} [options.readyState] document.readyState at script start.
 * @returns {object} The fake page parts the tests inspect.
 */
function runThemeScript({ saved = null, storageThrows = false, deviceDark = false, readyState = 'complete' } = {}) {
    const rootAttributes = new Map();
    const rootClasses = new Set();
    const root = {
        classList: { add: (name) => rootClasses.add(name), contains: (name) => rootClasses.has(name) },
        setAttribute: (name, value) => rootAttributes.set(name, String(value)),
        getAttribute: (name) => (rootAttributes.has(name) ? rootAttributes.get(name) : null),
    };
    const buttonAttributes = new Map([['aria-pressed', 'false']]);
    const clickHandlers = [];
    const button = {
        setAttribute: (name, value) => buttonAttributes.set(name, String(value)),
        getAttribute: (name) => (buttonAttributes.has(name) ? buttonAttributes.get(name) : null),
        addEventListener: (type, handler) => {
            if (type === 'click') clickHandlers.push(handler);
        },
        click: () => clickHandlers.forEach((handler) => handler({ type: 'click' })),
    };
    const label = { textContent: 'Dark mode' };
    const readyHandlers = [];
    const document = {
        readyState,
        documentElement: root,
        querySelector: (selector) => ({ '[data-theme-toggle]': button, '[data-theme-label]': label })[selector] ?? null,
        addEventListener: (type, handler) => {
            if (type === 'DOMContentLoaded') readyHandlers.push(handler);
        },
    };
    const store = new Map(saved === null ? [] : [['theme', saved]]);
    const localStorage = {
        getItem: (key) => {
            if (storageThrows) throw new Error('storage blocked');
            return store.has(key) ? store.get(key) : null;
        },
        setItem: (key, value) => {
            if (storageThrows) throw new Error('storage blocked');
            store.set(key, String(value));
        },
    };
    const window = { matchMedia: (query) => ({ matches: deviceDark && query === '(prefers-color-scheme: dark)' }) };
    runInNewContext(THEME_SOURCE, { document, window, localStorage, console: { warn: () => {} } });
    return {
        root, button, label, store,
        theme: () => root.getAttribute('data-theme'),
        finishLoading: () => readyHandlers.forEach((handler) => handler({ type: 'DOMContentLoaded' })),
    };
}

// ------------------------------------------------------------------ script behaviour

test('theme.js: a saved "dark" sets data-theme="dark" on the html element', () => {
    assert.equal(runThemeScript({ saved: 'dark' }).theme(), 'dark');
});

test('theme.js: a saved "light" sets data-theme="light" on the html element', () => {
    assert.equal(runThemeScript({ saved: 'light', deviceDark: true }).theme(), 'light');
});

test('theme.js: saved junk is ignored and no data-theme is set', () => {
    for (const junk of ['banana', 'Dark', 'dark ', '', '"dark"', '<script>']) {
        assert.equal(runThemeScript({ saved: junk }).theme(), null, `junk value ${JSON.stringify(junk)}`);
    }
});

test('theme.js: no saved choice leaves data-theme unset so the device decides', () => {
    assert.equal(runThemeScript({ deviceDark: true }).theme(), null);
});

test('theme.js: storage that throws does not throw out of the script, and a click still switches the theme', () => {
    let page;
    assert.doesNotThrow(() => { page = runThemeScript({ storageThrows: true }); });
    assert.equal(page.theme(), null);
    assert.doesNotThrow(() => page.button.click());
    assert.equal(page.theme(), 'dark');
});

test('theme.js: the button is wired at once when the page is already parsed, and the page gets the has-theme-toggle class', () => {
    const page = runThemeScript();
    assert.ok(page.root.classList.contains('has-theme-toggle'));
    page.button.click();
    assert.equal(page.theme(), 'dark');
});

test('theme.js: while the page is still loading the saved theme is applied first and the button is wired after DOMContentLoaded', () => {
    const page = runThemeScript({ saved: 'dark', readyState: 'loading' });
    assert.equal(page.theme(), 'dark');
    assert.ok(!page.root.classList.contains('has-theme-toggle'));
    page.finishLoading();
    assert.ok(page.root.classList.contains('has-theme-toggle'));
    assert.equal(page.button.getAttribute('aria-pressed'), 'true');
});

test('theme.js: a click flips light to dark and back, saves each choice, and updates the label and aria-pressed', () => {
    const page = runThemeScript({ saved: 'light' });
    assert.equal(page.label.textContent, 'Dark mode');
    assert.equal(page.button.getAttribute('aria-pressed'), 'false');

    page.button.click();
    assert.equal(page.theme(), 'dark');
    assert.equal(page.store.get('theme'), 'dark');
    assert.equal(page.label.textContent, 'Light mode');
    assert.equal(page.button.getAttribute('aria-pressed'), 'true');

    page.button.click();
    assert.equal(page.theme(), 'light');
    assert.equal(page.store.get('theme'), 'light');
    assert.equal(page.label.textContent, 'Dark mode');
    assert.equal(page.button.getAttribute('aria-pressed'), 'false');
});

test('theme.js: with no saved choice on a dark device the button starts in the dark state and the first click goes light', () => {
    const page = runThemeScript({ deviceDark: true });
    assert.equal(page.label.textContent, 'Light mode');
    assert.equal(page.button.getAttribute('aria-pressed'), 'true');
    page.button.click();
    assert.equal(page.theme(), 'light');
    assert.equal(page.store.get('theme'), 'light');
});

// ------------------------------------------------------------------ built pages

test('every page loads /theme.js in the head, not deferred, before search.js', () => {
    for (const file of MAIN_PAGES) {
        const html = readPage(file);
        const head = html.slice(html.indexOf('<head'), html.indexOf('</head>'));
        const tag = /<script\b[^>]*\ssrc="\/theme\.js"[^>]*>/.exec(head);
        assert.ok(tag, `${file}: /theme.js is not in the head`);
        assert.doesNotMatch(tag[0], /\s(defer|async)\b|type="module"/, `${file}: theme.js must run before first paint`);
        assert.ok(head.indexOf(tag[0]) < head.indexOf('/search.js'), `${file}: theme.js should come before search.js`);
    }
    assert.ok(existsSync(join(DIST, 'theme.js')));
});

test('the header has a real theme button with a visible text label, aria-pressed, both icons, hidden until JS', () => {
    for (const file of MAIN_PAGES) {
        const html = readPage(file);
        const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
        const button = /<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">([\s\S]*?)<\/button>/.exec(header);
        assert.ok(button, `${file}: theme button missing from the header`);
        assert.match(button[1], /<span class="theme-toggle-text" data-theme-label>Dark mode<\/span>/);
        assert.match(button[1], /theme-icon-moon[^>]*aria-hidden="true"/);
        assert.match(button[1], /theme-icon-sun[^>]*aria-hidden="true"/);
        assert.ok(header.indexOf('data-theme-toggle') < header.indexOf('search-trigger'), `${file}: theme button sits next to Search`);
    }
    const builtCss = readFileSync(join(DIST, /<link rel="stylesheet" href="([^"]+)"/.exec(readPage('index.html'))[1]), 'utf8');
    assert.match(builtCss, /\.theme-toggle\{[^}]*display:none/);
    assert.match(builtCss, /\.has-theme-toggle \.theme-toggle\{[^}]*display:inline-flex/);
});

test('theme.js uses no eval, innerHTML, network, cookies or inline-script tricks', () => {
    const script = readFileSync(join(DIST, 'theme.js'), 'utf8');
    assert.doesNotMatch(script, /\beval\(|new Function|innerHTML|outerHTML|insertAdjacentHTML|document\.write|document\.cookie|\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon/);
});

// ------------------------------------------------------------------ CSS

function declarations(openingLine) {
    const start = CSS_SOURCE.indexOf(openingLine);
    assert.notEqual(start, -1, `site.css has no block starting ${openingLine.trim()}`);
    const body = CSS_SOURCE.slice(start + openingLine.length, CSS_SOURCE.indexOf('}', start));
    return body.split('\n').map((line) => line.trim()).filter(Boolean);
}

function asMap(lines) {
    return new Map(lines.map((line) => {
        const [name, ...value] = line.replace(/;$/, '').split(':');
        return [name.trim(), value.join(':').trim()];
    }));
}

test('CSS: the manual dark block and the device dark block declare exactly the same variables and values', () => {
    const deviceDark = declarations('@media (prefers-color-scheme: dark) {\n    :root:not([data-theme="light"]) {\n');
    const manualDark = declarations(':root[data-theme="dark"] {\n');
    assert.ok(manualDark.length > 40, 'manual dark block looks empty');
    assert.deepEqual(manualDark, deviceDark);
    assert.equal(asMap(manualDark).get('color-scheme'), 'dark');
});

test('CSS: the light block restores every variable the dark block changes to its :root light value', () => {
    const rootLight = asMap(declarations('\n:root {\n'));
    const lightBlock = asMap(declarations(':root[data-theme="light"] {\n'));
    const darkBlock = asMap(declarations(':root[data-theme="dark"] {\n'));
    assert.equal(lightBlock.get('color-scheme'), 'light');
    for (const name of darkBlock.keys()) {
        if (name === 'color-scheme') continue;
        assert.ok(lightBlock.has(name), `${name} is changed by dark but not restored by [data-theme="light"]`);
        assert.equal(lightBlock.get(name), rootLight.get(name), `${name} differs between :root and [data-theme="light"]`);
    }
    for (const name of lightBlock.keys()) {
        assert.ok(darkBlock.has(name), `${name} is in the light block but not the dark block`);
    }
});

test('CSS: the only prefers-color-scheme rule is the one device-dark block', () => {
    assert.equal((CSS_SOURCE.match(/prefers-color-scheme/g) ?? []).length, 1);
});
