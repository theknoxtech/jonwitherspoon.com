/** Every colour a tag chip can have. Each one has a .chip-<name> class and colour variables in site.css. */
export const TAG_COLOR_NAMES = ['blue', 'teal', 'amber', 'rose', 'green', 'purple', 'orange', 'pink', 'sky', 'slate'];

/** The colours handed out to tags Jon has not coloured himself. Kept to the original four so existing tags never change. */
export const AUTOMATIC_TAG_COLORS = ['blue', 'teal', 'amber', 'rose'];

/**
 * Checks the tagColors list from site.json and returns a function that gives the colour name for a tag.
 * A listed tag gets its chosen colour (exact, case-sensitive match); any other tag gets a stable
 * automatic colour worked out from its letters, so a tag looks the same on every page.
 * @param {Record<string, string> | undefined} tagColors
 * @returns {(tag: string) => string}
 * @throws {Error} when a colour is not one of TAG_COLOR_NAMES
 */
export function tagColorPicker(tagColors) {
    const chosen = tagColors ?? {};
    for (const [tag, color] of Object.entries(chosen)) {
        if (!TAG_COLOR_NAMES.includes(color)) {
            throw new Error(`tagColors in src/data/site.json: the colour ${JSON.stringify(color)} for the tag "${tag}" is not a colour name. Use one of: ${TAG_COLOR_NAMES.join(', ')}.`);
        }
    }
    return (tag) => {
        if (Object.hasOwn(chosen, tag)) return chosen[tag];
        const total = [...tag].reduce((sum, character) => sum + character.charCodeAt(0), 0);
        return AUTOMATIC_TAG_COLORS[total % AUTOMATIC_TAG_COLORS.length];
    };
}
