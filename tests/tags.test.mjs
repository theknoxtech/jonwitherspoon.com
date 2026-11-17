import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AUTOMATIC_TAG_COLORS, TAG_COLOR_NAMES, tagColorPicker } from '../src/lib/tags.js';

test('there are ten colour names: the original four first, then six new ones', () => {
    assert.deepEqual(TAG_COLOR_NAMES, ['blue', 'teal', 'amber', 'rose', 'green', 'purple', 'orange', 'pink', 'sky', 'slate']);
    assert.deepEqual(AUTOMATIC_TAG_COLORS, ['blue', 'teal', 'amber', 'rose']);
});

test('tags not listed in tagColors keep the colour they had before this feature', () => {
    const pickColor = tagColorPicker({});
    const before = {
        'C#': 'amber', 'Windows Event Log': 'rose', 'Remote Support': 'teal', PowerShell: 'teal', WMI: 'teal',
        'ConnectWise Automate': 'amber', 'Dell BIOS Provider': 'teal', 'Windows Shell API': 'teal', OneDrive: 'blue',
        Bash: 'amber', macOS: 'rose', Windows: 'rose', BitLocker: 'rose',
    };
    for (const [tag, color] of Object.entries(before)) assert.equal(pickColor(tag), color, tag);
});

test('a tag listed in tagColors gets that colour, from any of the ten names', () => {
    for (const name of TAG_COLOR_NAMES) assert.equal(tagColorPicker({ PowerShell: name })('PowerShell'), name);
});

test('the lookup is exact and case-sensitive, and does not match inherited object keys', () => {
    const pickColor = tagColorPicker({ PowerShell: 'purple' });
    assert.equal(pickColor('powershell'), AUTOMATIC_TAG_COLORS[[...'powershell'].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4]);
    assert.equal(pickColor('constructor'), AUTOMATIC_TAG_COLORS[[...'constructor'].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4]);
});

test('a bad colour throws a message naming the tag and the colour and listing every valid name', () => {
    assert.throws(() => tagColorPicker({ PowerShell: 'purle' }), (error) => {
        assert.match(error.message, /PowerShell/);
        assert.match(error.message, /purle/);
        for (const name of TAG_COLOR_NAMES) assert.ok(error.message.includes(name), `lists ${name}`);
        return true;
    });
    assert.throws(() => tagColorPicker({ Bash: 7 }), /Bash/);
    assert.throws(() => tagColorPicker({ Bash: 'Blue' }), /Blue/);
});

test('a missing tagColors is the same as an empty one', () => {
    assert.equal(tagColorPicker(undefined)('OneDrive'), 'blue');
});

test('the shipped site.json has an empty tagColors object', () => {
    const site = JSON.parse(readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'));
    assert.deepEqual(site.tagColors, {});
});
