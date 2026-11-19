/**
 * @typedef {{ id: string, body?: string, data: { title: string, date: Date, draft: boolean } }} ArticleEntry
 */

/**
 * Drops drafts and sorts newest first. Does not change the list it is given.
 * @param {ArticleEntry[]} entries
 * @returns {ArticleEntry[]}
 */
export function publishedArticles(entries) {
    return entries
        .filter((entry) => !entry.data.draft)
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Finds images in article text that have no alt text (a short description for screen readers).
 * @param {string} markdown
 * @returns {string[]} the image addresses that need alt text
 */
export function findImagesWithoutAlt(markdown) {
    const missing = [];
    for (const match of markdown.matchAll(/!\[([^\]]*)\]\(\s*([^)\s]+)/g)) {
        if (match[1].trim() === '') missing.push(match[2]);
    }
    for (const match of markdown.matchAll(/<img\b[^>]*>/gi)) {
        const alt = /\salt="([^"]*)"/i.exec(match[0]);
        if (!alt || alt[1].trim() === '') missing.push(/\ssrc="([^"]*)"/i.exec(match[0])?.[1] ?? '');
    }
    return missing;
}

/**
 * Finds markup that the site's strict content security policy forbids: raw script or style
 * tags, style attributes, and images loaded from another website.
 * @param {string} markdown
 * @returns {string[]} one plain-language problem per finding
 */
export function findUnsafeMarkup(markdown) {
    const problems = [];
    if (/<script\b/i.test(markdown)) problems.push('raw <script> tag (scripts are not allowed in articles)');
    if (/<style\b/i.test(markdown)) problems.push('raw <style> tag (styles are not allowed in articles)');
    if (/<[a-z][^>]*\sstyle\s*=/i.test(markdown)) problems.push('style="" attribute (inline styles are not allowed in articles)');
    const imageAddresses = [
        ...[...markdown.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g)].map((match) => match[1]),
        ...[...markdown.matchAll(/<img\b[^>]*\ssrc="([^"]*)"/gi)].map((match) => match[1]),
    ];
    for (const address of imageAddresses) {
        if (/^(https?:)?\/\//i.test(address)) problems.push(`outside image address ${address} (copy the picture into the article folder instead)`);
    }
    return problems;
}

/**
 * Stops the build with a clear message when a published article breaks a site rule.
 * @param {{ id: string, filePath?: string, body?: string }} entry
 * @returns {void}
 */
export function assertArticleIsAllowed(entry) {
    const body = entry.body ?? '';
    const problems = [
        ...findUnsafeMarkup(body),
        ...findImagesWithoutAlt(body).map((address) => `picture ${address} has no alt text (write ![what it shows](${address}))`),
    ];
    if (problems.length > 0) {
        throw new Error(`Article ${entry.filePath ?? entry.id} cannot be published:\n- ${problems.join('\n- ')}`);
    }
}
