import { readFileSync } from 'node:fs';
import baseConfig from '../../astro.config.mjs';

/** When TAG_COLORS_JSON is set, replaces site.json's tagColors in the build only; the file on disk is never changed. */
const tagColorsOverride = {
    name: 'tag-colors-override',
    enforce: 'pre',
    load(id) {
        if (!process.env.TAG_COLORS_JSON || !id.endsWith('/src/data/site.json')) return null;
        const site = JSON.parse(readFileSync(id, 'utf8'));
        return JSON.stringify({ ...site, tagColors: JSON.parse(process.env.TAG_COLORS_JSON) });
    },
};

/** The real config, with Astro's cache moved to the folder the test names so fixture builds never touch the real cache (Vite's own dependency cache included). */
export default {
    ...baseConfig,
    cacheDir: `${process.env.BLOG_CACHE_DIR}/`,
    vite: { ...baseConfig.vite, cacheDir: `${process.env.BLOG_CACHE_DIR}/vite`, plugins: [...(baseConfig.vite?.plugins ?? []), tagColorsOverride] },
};
