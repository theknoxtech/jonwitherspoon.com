import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Returns a copy of a Static Web Apps config with the noindex header added to
 * its global headers. Every other header and route is kept. Running it again
 * on its own output changes nothing.
 *
 * @param {object} config The parsed staticwebapp.config.json.
 * @returns {object} A new config object that also sends X-Robots-Tag.
 */
export function addNoindexHeader(config) {
    return {
        ...config,
        globalHeaders: { ...config.globalHeaders, 'X-Robots-Tag': 'noindex, nofollow' },
    };
}

/**
 * Adds the noindex header to the built config inside a dist folder.
 *
 * @param {string} distPath The built site folder.
 * @throws {Error} If the config file is missing or is not valid JSON.
 */
function rewriteDistConfig(distPath) {
    const configPath = join(distPath, 'staticwebapp.config.json');
    let text;
    try {
        text = readFileSync(configPath, 'utf8');
    } catch (error) {
        throw new Error(`Cannot read ${configPath}: ${error.message}`);
    }
    let config;
    try {
        config = JSON.parse(text);
    } catch (error) {
        throw new Error(`${configPath} is not valid JSON: ${error.message}`);
    }
    writeFileSync(configPath, `${JSON.stringify(addNoindexHeader(config), null, 4)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const distPath = process.argv[2];
    if (!distPath) {
        console.error('Usage: node scripts/make-dev-config.mjs <dist folder>');
        process.exit(1);
    }
    try {
        rewriteDistConfig(distPath);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
