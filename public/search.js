/**
 * Search for the whole site, loaded on every page.
 *
 * 1. Page filter: on Projects and Labs, items carry a lowercase `data-search`
 *    attribute written at build time (Projects also `data-tags`). Without this
 *    script every item stays visible and the search UI stays hidden, because it
 *    only appears once the `has-search` class is added to <html>.
 * 2. Quick search: a native <dialog> opened by the header button or Ctrl/Cmd+K.
 *    It reads /search-index.json (same origin, generated at build time) and
 *    builds results with DOM APIs only.
 */
(() => {
    const MAX_RESULTS = 8;
    const SAFE_URL = /^(\/(?!\/)|https:\/\/)/;

    const initPageFilter = () => {
        const panel = document.querySelector('[data-search-panel]');
        const input = panel ? panel.querySelector('[data-search-input]') : null;
        const clearButton = panel ? panel.querySelector('[data-search-clear]') : null;
        const countLine = panel ? panel.querySelector('[data-search-count]') : null;
        const emptyMessage = panel ? panel.querySelector('[data-search-empty]') : null;
        const items = Array.from(document.querySelectorAll('[data-search]'));
        if (!panel || !input || !countLine || !emptyMessage || items.length === 0) {
            return;
        }

        const noun = panel.dataset.searchNoun || 'items';
        const tagButtons = Array.from(panel.querySelectorAll('[data-tag]'));
        let activeTag = '';

        const applyFilter = () => {
            const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
            let visibleCount = 0;
            items.forEach((item) => {
                const text = (item.dataset.search || '').toLowerCase();
                const tags = (item.dataset.tags || '').split('|');
                const matches = terms.every((term) => text.includes(term)) && (!activeTag || tags.includes(activeTag));
                item.hidden = !matches;
                if (matches) {
                    visibleCount += 1;
                }
            });
            countLine.textContent = `Showing ${visibleCount} of ${items.length} ${noun}`;
            emptyMessage.hidden = visibleCount !== 0;
        };

        const setActiveTag = (tag) => {
            activeTag = tag;
            tagButtons.forEach((button) => {
                button.setAttribute('aria-pressed', button.dataset.tag === activeTag ? 'true' : 'false');
            });
        };

        const reset = () => {
            input.value = '';
            setActiveTag('');
            applyFilter();
        };

        input.addEventListener('input', applyFilter);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                reset();
            }
        });
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                reset();
                input.focus();
            });
        }
        tagButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setActiveTag(activeTag === button.dataset.tag ? '' : button.dataset.tag);
                applyFilter();
            });
        });

        const requestedTag = (new URLSearchParams(window.location.search).get('tag') || '').toLowerCase();
        if (tagButtons.some((button) => button.dataset.tag === requestedTag)) {
            setActiveTag(requestedTag);
        }
        applyFilter();
        document.documentElement.classList.add('has-search');
    };

    const buildResult = (entry) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'quick-result';
        link.href = entry.url;
        if (entry.url.startsWith('https://')) {
            link.rel = 'noopener noreferrer';
        }
        const title = document.createElement('span');
        title.className = 'quick-result-title';
        title.textContent = entry.title;
        const kind = document.createElement('span');
        kind.className = 'status status-planned mono';
        kind.textContent = entry.kind;
        const description = document.createElement('span');
        description.className = 'quick-result-text';
        description.textContent = entry.description;
        link.append(title, kind, description);
        item.append(link);
        return item;
    };

    const initQuickSearch = () => {
        const dialog = document.querySelector('[data-quick-dialog]');
        const input = dialog ? dialog.querySelector('[data-quick-input]') : null;
        const list = dialog ? dialog.querySelector('[data-quick-results]') : null;
        const status = dialog ? dialog.querySelector('[data-quick-status]') : null;
        const closeButton = dialog ? dialog.querySelector('[data-quick-close]') : null;
        const openButtons = Array.from(document.querySelectorAll('[data-quick-open]'));
        if (!dialog || !input || !list || !status || typeof dialog.showModal !== 'function') {
            return false;
        }

        const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
        document.querySelectorAll('[data-shortcut]').forEach((hint) => {
            hint.textContent = isMac ? 'Cmd K' : 'Ctrl K';
        });

        let entries = null;
        let loading = false;

        const render = () => {
            list.replaceChildren();
            const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
            if (!entries) {
                return;
            }
            if (terms.length === 0) {
                status.textContent = 'Type to search.';
                return;
            }
            const matches = entries
                .filter((entry) => {
                    const text = [entry.title, entry.description, entry.status, entry.kind, ...entry.tags].join(' ').toLowerCase();
                    return terms.every((term) => text.includes(term));
                })
                .slice(0, MAX_RESULTS);
            matches.forEach((entry) => list.append(buildResult(entry)));
            status.textContent = matches.length === 0 ? 'No matches.' : `${matches.length} result${matches.length === 1 ? '' : 's'}`;
        };

        const loadEntries = async () => {
            if (entries || loading) {
                return;
            }
            loading = true;
            try {
                const response = await fetch('/search-index.json', { credentials: 'same-origin' });
                if (!response.ok) {
                    throw new Error(`search index ${response.status}`);
                }
                const data = await response.json();
                entries = data
                    .filter((entry) => typeof entry.title === 'string' && typeof entry.url === 'string' && SAFE_URL.test(entry.url))
                    .map((entry) => ({
                        kind: String(entry.kind || ''),
                        title: entry.title,
                        description: String(entry.description || ''),
                        status: String(entry.status || ''),
                        url: entry.url,
                        tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [],
                    }));
                render();
            } catch (error) {
                console.error(error);
                status.textContent = 'Search is unavailable right now.';
            } finally {
                loading = false;
            }
        };

        const open = () => {
            if (!dialog.open) {
                dialog.showModal();
            }
            input.focus();
            input.select();
            loadEntries();
        };

        const links = () => Array.from(list.querySelectorAll('a'));

        openButtons.forEach((button) => button.addEventListener('click', open));
        if (closeButton) {
            closeButton.addEventListener('click', () => dialog.close());
        }
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
        input.addEventListener('input', render);
        input.addEventListener('keydown', (event) => {
            const results = links();
            if (event.key === 'ArrowDown' && results.length > 0) {
                event.preventDefault();
                results[0].focus();
            } else if (event.key === 'Enter' && results.length > 0) {
                event.preventDefault();
                results[0].click();
            }
        });
        list.addEventListener('keydown', (event) => {
            const results = links();
            const index = results.indexOf(document.activeElement);
            if (index === -1) {
                return;
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                (results[index + 1] || results[index]).focus();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                (index === 0 ? input : results[index - 1]).focus();
            }
        });
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                open();
            }
        });
        return true;
    };

    initPageFilter();
    if (initQuickSearch()) {
        document.documentElement.classList.add('has-quick-search');
    }
})();
