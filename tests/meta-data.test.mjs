import assert from 'node:assert/strict';
import {
  ACTIVE_META_PAL_IDS,
  ACTIVE_META_PALS,
  PALS,
  getPalById,
} from '../data/pals.mjs';
import {
  ACTIVE_META_PAL_IDS as REEXPORTED_ACTIVE_META_PAL_IDS,
  ACTIVE_META_PALS as REEXPORTED_ACTIVE_META_PALS,
  PALS as REEXPORTED_PALS,
  getPalById as reexportedGetPalById,
} from '../data/index.mjs';
import { ACTIVE_SOURCE_IDS } from '../data/meta-sources.mjs';

const REQUIRED_ACTIVE_IDS = [
  'orserk',
  'shaolong',
  'panthalus',
  'frostallion-noct',
  'bellanoir',
  'bellanoir-libero',
  'jetragon',
  'jormuntide-ignis',
  'anubis',
  'lily',
  'renjishi',
  'dandilord',
  'solenne',
  'silvance',
  'bastigor',
  'knocklem',
  'knocklem-ignis',
  'wumpo',
  'aegidron',
];

const VALID_ROLES = new Set([
  'carry', 'support', 'counter', 'raid', 'damage', 'healer', 'transition',
  'kindling', 'watering', 'planting', 'electricity', 'handiwork', 'gathering',
  'lumbering', 'mining', 'medicine', 'cooling', 'transporting', 'farming',
  'mount', 'flying-mount', 'ground-mount', 'roaming', 'resource', 'utility',
  'early-game', 'mid-game', 'late-game', 'endgame', 'flex',
]);
const VALID_CONFIDENCE = new Set([
  'official', 'structured-data', 'single-editorial', 'community-cross-check', 'cautious-community',
]);

const activePals = PALS.filter(pal => pal.isActiveRecommendation === true);
const ids = PALS.map(pal => pal.id);

assert.equal(new Set(ids).size, ids.length, 'Pal-IDs müssen eindeutig sein');
assert.deepEqual(
  REQUIRED_ACTIVE_IDS.filter(id => activePals.some(pal => pal.id === id)),
  REQUIRED_ACTIVE_IDS,
  'alle recherchierten Schlüssel-Pals müssen aktiv modelliert sein'
);

for (const pal of PALS) {
  assert.ok(typeof pal.image === 'string' && pal.image.trim(), `${pal.id}: Bildreferenz fehlt`);
  assert.equal(getPalById(pal.image), pal, `${pal.id}: Bildreferenz muss auf denselben Pal auflösen`);
  assert.ok(Array.isArray(pal.aliases), `${pal.id}: aliases muss ein Array sein`);
  assert.ok(pal.aliases.every(alias => typeof alias === 'string' && alias.trim()), `${pal.id}: Alias ungültig`);
  for (const alias of pal.aliases) {
    assert.equal(getPalById(alias), pal, `${pal.id}: Alias ${alias} muss auf denselben Pal auflösen`);
  }
  if (pal.variantOf !== null) {
    assert.ok(typeof pal.variantOf === 'string' && pal.variantOf.trim(), `${pal.id}: variantOf ungültig`);
    assert.notEqual(pal.variantOf, pal.id, `${pal.id}: darf nicht auf sich selbst zeigen`);
    assert.ok(getPalById(pal.variantOf), `${pal.id}: variantOf muss auflösbar sein`);
  }
  for (const field of ['alternatives', 'upgradeFrom', 'upgradeTo']) {
    assert.ok(Array.isArray(pal[field]), `${pal.id}: ${field} muss ein Array sein`);
    for (const targetId of pal[field]) {
      assert.ok(getPalById(targetId), `${pal.id}: ${field}-Referenz ${targetId} muss auflösbar sein`);
    }
  }
}

assert.equal(REEXPORTED_PALS, PALS, 'data/index.mjs muss PALS unverändert re-exportieren');
assert.equal(REEXPORTED_ACTIVE_META_PALS, ACTIVE_META_PALS, 'data/index.mjs muss ACTIVE_META_PALS unverändert re-exportieren');
assert.equal(REEXPORTED_ACTIVE_META_PAL_IDS, ACTIVE_META_PAL_IDS, 'data/index.mjs muss ACTIVE_META_PAL_IDS unverändert re-exportieren');
assert.equal(reexportedGetPalById, getPalById, 'data/index.mjs muss getPalById unverändert re-exportieren');

for (const pal of activePals) {
  for (const field of ['combat', 'base', 'roaming', 'progression']) {
    const context = pal[field];
    assert.ok(context && typeof context === 'object', `${pal.id}: ${field} fehlt`);
    assert.ok(Array.isArray(context.roles) && context.roles.length > 0, `${pal.id}: ${field}.roles fehlt`);
    for (const role of context.roles) {
      assert.ok(VALID_ROLES.has(role), `${pal.id}: ungültige Rolle ${role}`);
    }
    assert.ok(context.reason?.trim(), `${pal.id}: ${field}.reason fehlt`);
    assert.ok(context.bestFor?.trim(), `${pal.id}: ${field}.bestFor fehlt`);
    assert.ok(context.switchWhen?.trim(), `${pal.id}: ${field}.switchWhen fehlt`);
  }

  assert.ok(pal.partnerSkill?.trim(), `${pal.id}: Partner-Skill/Fähigkeit fehlt`);
  assert.ok(pal.whyGood?.trim(), `${pal.id}: Einsatzgrund fehlt`);
  assert.ok(pal.bestFor?.trim(), `${pal.id}: beste Nutzung fehlt`);
  assert.ok(pal.location?.trim(), `${pal.id}: Fundort fehlt`);
  assert.ok(pal.switchWhen?.trim(), `${pal.id}: Wechselhinweis fehlt`);
  assert.ok(Array.isArray(pal.sources) && pal.sources.length > 0, `${pal.id}: aktive Source-ID fehlt`);
  assert.ok(pal.sources.every(sourceId => ACTIVE_SOURCE_IDS.includes(sourceId)), `${pal.id}: unbekannte Source-ID`);
  assert.equal(pal.patchScope, 'Patch 1.0+', `${pal.id}: falscher Patch-Scope`);
  assert.equal(pal.checkedAt, '2026-08-27', `${pal.id}: falsches Prüfdatum`);
  assert.ok(VALID_CONFIDENCE.has(pal.confidence), `${pal.id}: Confidence fehlt oder ungültig`);
}

const activeNames = activePals.map(pal => pal.name);
assert.equal(new Set(activeNames).size, activeNames.length, 'aktive Pal-Namen müssen eindeutig sein');
for (const pal of activePals) {
  assert.ok(!pal.aliases.includes(pal.name), `${pal.id}: Name darf nicht als Alias dupliziert werden`);
  if (pal.variantOf) {
    assert.ok(PALS.some(candidate => candidate.id === pal.variantOf), `${pal.id}: variantOf verweist auf keinen Pal`);
  }
}

assert.equal(PALS.find(pal => pal.id === 'foxparks')?.progression.phase, 'early');
assert.equal(PALS.find(pal => pal.id === 'anubis')?.progression.phase, 'mid');

console.log('meta data: ok');
