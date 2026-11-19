/**
 * Tabs for the Portfolio page (WAI-ARIA tabs pattern, automatic activation).
 *
 * Without this script every panel stays visible, stacked, and the tab bar stays
 * hidden: the bar only appears once the `has-tabs` class is added to <html>.
 * The selected tab is mirrored in the URL hash (for example #experience), so
 * links and the Back button work.
 */
(() => {
    const tablist = document.querySelector('[data-tablist]');
    if (!tablist) {
        return;
    }
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    if (tabs.length === 0 || panels.some((panel) => panel === null)) {
        return;
    }

    const nameOf = (tab) => tab.id.replace(/^tab-/, '');

    const select = (selected) => {
        tabs.forEach((tab, index) => {
            const isSelected = tab === selected;
            tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            tab.tabIndex = isSelected ? 0 : -1;
            panels[index].hidden = !isSelected;
        });
        if (typeof selected.scrollIntoView === 'function') {
            selected.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    };

    const selectFromHash = () => {
        const wanted = decodeURIComponent(window.location.hash.slice(1));
        select(tabs.find((tab) => nameOf(tab) === wanted) || tabs[0]);
    };

    const activate = (tab, moveFocus) => {
        window.location.hash = nameOf(tab);
        select(tab);
        if (moveFocus) {
            tab.focus();
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => activate(tab, false));
        tab.addEventListener('keydown', (event) => {
            const index = tabs.indexOf(tab);
            const lastIndex = tabs.length - 1;
            const targets = {
                ArrowRight: tabs[index === lastIndex ? 0 : index + 1],
                ArrowLeft: tabs[index === 0 ? lastIndex : index - 1],
                Home: tabs[0],
                End: tabs[lastIndex],
            };
            if (targets[event.key]) {
                event.preventDefault();
                activate(targets[event.key], true);
            }
        });
    });

    window.addEventListener('hashchange', selectFromHash);
    document.documentElement.classList.add('has-tabs');
    selectFromHash();
})();
