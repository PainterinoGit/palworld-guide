import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PATCH_NOTES } from '../data/patchnotes.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.ok(PATCH_NOTES.some(note => note.version === '1.0.3'), 'Patch 1.0.3 muss im Patchnotes-Datensatz stehen');
assert.match(html, /switchTab\(['"]patchnotes['"]\)/, 'Patchnotes müssen über die Hauptnavigation erreichbar sein');
assert.match(html, /id="patchnotes"/, 'Patchnotes-Tab muss existieren');
assert.match(html, /Level 23/, 'Aquatic Construction Kit muss in der sichtbaren Progression aktualisiert sein');
assert.match(html, /Level 70/, 'Jetragon-Technologie muss in der sichtbaren Progression aktualisiert sein');
assert.match(html, /Serenity/, 'Handbuch muss die aktualisierte Endgame-Passive-Einordnung enthalten');
assert.match(html, /Bastigor/, 'Raid-Abschnitt muss Bastigor als defensive Option erwähnen');
assert.match(html, /World Tree Holy Water/, 'Ressourcen-/Endgame-Hinweise müssen Holy Water enthalten');

console.log('patchnotes guide: ok');
