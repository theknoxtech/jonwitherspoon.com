/**
 * Light / dark theme, loaded in the <head> of every page WITHOUT defer so the
 * saved choice is on <html> before the first paint (no flash of the wrong theme).
 *
 * 1. Early: read the saved choice and, if it is exactly "light" or "dark", set
 *    data-theme on <html>. With no choice, CSS follows the device setting.
 * 2. After the page is parsed: wire the header toggle button, which flips the
 *    theme, saves the choice and updates its label and aria-pressed. The button
 *    stays hidden until the `has-theme-toggle` class is added to <html>.
 *
 * Storage can be blocked (private windows), so every storage call is guarded.
 */
(() => {
    const STORAGE_KEY = 'theme';
    const THEMES = ['light', 'dark'];
    const root = document.documentElement;

    /**
     * Returns the saved theme, or null when nothing valid is saved or storage is blocked.
     *
     * @returns {string | null}
     */
    const readSavedTheme = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return THEMES.includes(saved) ? saved : null;
        } catch (error) {
            return null;
        }
    };

    /**
     * Saves the choice; a blocked store only means it is not remembered.
     *
     * @param {string} theme "light" or "dark".
     */
    const saveTheme = (theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Theme choice could not be saved.');
        }
    };

    /**
     * Returns the theme currently shown: the explicit choice, else the device setting.
     *
     * @returns {string} "light" or "dark".
     */
    const currentTheme = () => {
        const chosen = root.getAttribute('data-theme');
        if (THEMES.includes(chosen)) {
            return chosen;
        }
        const deviceDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return deviceDark ? 'dark' : 'light';
    };

    const initToggle = () => {
        const button = document.querySelector('[data-theme-toggle]');
        const label = document.querySelector('[data-theme-label]');
        if (!button || !label) {
            return;
        }

        const showState = () => {
            const isDark = currentTheme() === 'dark';
            label.textContent = isDark ? 'Light mode' : 'Dark mode';
            button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        };

        button.addEventListener('click', () => {
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            saveTheme(next);
            showState();
        });
        showState();
        root.classList.add('has-theme-toggle');
    };

    const savedTheme = readSavedTheme();
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggle);
    } else {
        initToggle();
    }
})();
