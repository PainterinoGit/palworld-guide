import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PATCH_NOTES } from '../data/patchnotes.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const patchText = PATCH_NOTES.map(note => `${note.title} ${note.summary} ${note.changes.map(change => change.text).join(' ')}`).join(' ');

assert.ok(PATCH_NOTES.some(note => note.version === '1.0.3'), 'Patch 1.0.3 muss im Patchnotes-Datensatz stehen');
assert.match(html, /switchTab\(['"]patchnotes['"]\)/, 'Patchnotes müssen über die Hauptnavigation erreichbar sein');
assert.match(html, /id="patchnotes"/, 'Patchnotes-Tab muss existieren');
assert.match(html, /Level 23/, 'Aquatic Construction Kit muss in der sichtbaren Progression aktualisiert sein');
assert.match(html, /Level 70/, 'Jetragon-Technologie muss in der sichtbaren Progression aktualisiert sein');
assert.match(html, /Serenity/, 'Handbuch muss die aktualisierte Endgame-Passive-Einordnung enthalten');
assert.match(html, /Bastigor/, 'Raid-Abschnitt muss Bastigor als defensive Option erwähnen');
assert.match(html, /World Tree Holy Water/, 'Ressourcen-/Endgame-Hinweise müssen Holy Water enthalten');
assert.match(html, /Dog-Coin-Farm/i, 'Ressourcen-Tab muss die neue Dog-Coin-Farm sichtbar erklären');
assert.match(html, /Beam Scatter/i, 'Dog-Coin-Farm muss Beam Scatter als Werkzeug nennen');
assert.match(html, /Service Minded/i, 'Dog-Coin-Farm muss die Yakumo-Anforderung nennen');
assert.match(html, /Ultra-Raid/i, 'Handbuch muss einen vollständigen Ultra-Raid-Einstieg enthalten');
assert.match(html, /Bellanoir Libero/i, 'Ultra-Raid-Hinweis muss Bellanoir Libero speziell einordnen');
assert.doesNotMatch(html, /Beliebte Ziel-Kombo:<\/strong> Legend \+ Musclehead \+ Ferocious \+ Lucky/i, 'Breeding darf Lucky nicht als unkritische Ziel-Kombo empfehlen');
assert.match(patchText, /0,1.*Gewicht|Gewicht.*0,1/i, 'Patchnotes müssen die Holy-Water-Gewichtsänderung nennen');

console.log('patchnotes guide: ok');
