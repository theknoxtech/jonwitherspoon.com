import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const PLACEHOLDER_MARKER = '[TO SUPPLY';

function listHtmlFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return listHtmlFiles(path);
        return entry.name.endsWith('.html') ? [path] : [];
    });
}

const placeholderGuard = {
    name: 'placeholder-guard',
    hooks: {
        'astro:build:done': ({ dir }) => {
            const outputDirectory = fileURLToPath(dir);
            const flagged = listHtmlFiles(outputDirectory).filter((file) =>
                readFileSync(file, 'utf8').includes(PLACEHOLDER_MARKER),
            );
            if (flagged.length === 0) return;
            const names = flagged.map((file) => file.slice(outputDirectory.length)).join(', ');
            const message = `${flagged.length} page(s) still contain "${PLACEHOLDER_MARKER}": ${names}`;
            if (process.env.FAIL_ON_PLACEHOLDER === '1') throw new Error(message);
            console.warn(`WARNING: ${message}`);
        },
    },
};

/**
 * Copies only the top-level .html files of each exam_apps/<code>/ folder into
 * dist/exam_apps/<code>/. Sources, scripts and notes stay out of the deploy.
 */
const labCopy = {
    name: 'lab-copy',
    hooks: {
        'astro:build:done': ({ dir }) => {
            const sourceRoot = join(process.cwd(), 'exam_apps');
            if (!existsSync(sourceRoot)) return;
            const outputRoot = join(fileURLToPath(dir), 'exam_apps');
            for (const lab of readdirSync(sourceRoot, { withFileTypes: true })) {
                if (!lab.isDirectory()) continue;
                const pages = readdirSync(join(sourceRoot, lab.name), { withFileTypes: true })
                    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'));
                mkdirSync(join(outputRoot, lab.name), { recursive: true });
                for (const page of pages) {
                    copyFileSync(join(sourceRoot, lab.name, page.name), join(outputRoot, lab.name, page.name));
                    console.log(`lab-copy: exam_apps/${lab.name}/${page.name}`);
                }
            }
        },
    },
};

export default defineConfig({
    output: 'static',
    site: 'https://jonwitherspoon.com',
    build: { inlineStylesheets: 'never' },
    // The default colour highlighter writes style="" attributes, which the strict CSP forbids.
    markdown: { syntaxHighlight: false },
    integrations: [placeholderGuard, labCopy],
});
