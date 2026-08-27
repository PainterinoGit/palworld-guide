import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const html = read('../index.html');
const app = read('../js/app.js');
const roster = read('../data/pals-roster.js');

assert.doesNotMatch(html, /legacy-team-library/i, 'die alte statische Team-Bibliothek darf nicht mehr im DOM-Quelltext stehen');
assert.doesNotMatch(html, /Die stärksten Einzel-Pals im Endgame/i, 'die alte statische Endgame-Tierliste muss entfernt sein');
assert.doesNotMatch(html, /Mount-Tierliste nach Terrain/i, 'die alte statische Mount-Tierliste muss entfernt sein');
assert.doesNotMatch(html, /flyingMountsTable|groundMountsTable|waterMountsTable|transportPalsTable/i, 'alte statische Mount-/Transporttabellen dürfen nicht aktiv bleiben');
assert.doesNotMatch(html, /Detaillierte Community-Team-Builds/i, 'alte statische Community-Team-Builds dürfen nicht konkurrieren');
assert.doesNotMatch(html, /Konkrete Early-Game-Breeding-Kette|Zucht-Stufen 1–11|Weiterführende Kombinationen/i, 'alte konkrete Zucht-Empfehlungen dürfen nicht aktiv bleiben');
assert.doesNotMatch(html, /Rang-Leiter \(Patch 1\.0|Vor Patch 1\.0/i, 'alte patchspezifische Rangdaten dürfen nicht ohne Quellen-ID aktiv bleiben');
assert.doesNotMatch(html, /questTrack|questDetailHost|resetWegweiser|data\/quests\.js/i, 'der alte unquellengestützte Wegweiser darf nicht parallel aktiv sein');
assert.doesNotMatch(html, /data\/skills\.js/i, 'die alte Skill-Tierlisten-Datenquelle darf nicht geladen werden');

assert.doesNotMatch(app, /SKILL_TIERS|PAL_SUITABILITY|renderSkillTable|Top-15-Listen/i, 'app.js darf keine alte Skill-Tierlisten-Fallbacklogik enthalten');
assert.doesNotMatch(app, /QUESTS|renderWegweiser|loadWegweiserState|resetWegweiser/i, 'app.js darf keinen alten Quest-/Team-Fallback enthalten');
assert.match(app, /buildPalDatabase\(/, 'die aktive Pal-Datenbank muss über die aktuelle Meta-Schicht gebaut werden');
assert.match(roster, /neutral|Referenzdaten/i, 'der Roster muss ausdrücklich als neutrale Referenz gekennzeichnet sein');
assert.equal(existsSync(new URL('../data/skills.js', import.meta.url)), false, 'alte Skill-Tierlisten-Datei darf nicht mehr vorhanden sein');
assert.equal(existsSync(new URL('../data/quests.js', import.meta.url)), false, 'alte Quest-/Team-Fallback-Datei darf nicht mehr vorhanden sein');

console.log('task 6 legacy contract: ok');
