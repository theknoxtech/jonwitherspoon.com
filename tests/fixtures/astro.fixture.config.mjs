import baseConfig from '../../astro.config.mjs';

/** The real config, with Astro's cache moved to the folder the test names so fixture builds never touch the real cache. */
export default { ...baseConfig, cacheDir: `${process.env.BLOG_CACHE_DIR}/` };
