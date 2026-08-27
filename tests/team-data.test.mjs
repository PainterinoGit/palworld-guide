import assert from 'node:assert/strict';
import {
  BASE_TEAMS,
  COMBAT_TEAMS,
  LEVEL_BANDS,
  ROAMING_TEAMS,
  SPECIAL_TEAMS,
  TEAMS,
} from '../data/teams.mjs';
import { PALS } from '../data/pals.mjs';
import { ACTIVE_SOURCE_IDS } from '../data/meta-sources.mjs';

const expectedBands = ['1-10', '10-20', '20-30', '30-40', '40-50', '50-plus'];
const palIds = new Set(PALS.map(pal => pal.id));
const sourceIds = new Set(ACTIVE_SOURCE_IDS);
const expectedSpecialSources = {
  'element-counter': [
    'palworld-calc-1-0-tier-list',
    'pindrop-verified-combat-list',
    'video-pal-professor-combat-builds',
    'video-ragegaming-op-combat-builds',
  ],
  'resource-run': [
    'palmods-work-suitability',
    'pcgamer-best-pals',
    'video-ragegaming-infinite-resource-base',
    'video-pal-professor-work-level-10',
    'video-shario-base-pals',
    'video-tropsplays-base-pals',
    'video-ragegaming-true-best-base-pals',
  ],
  'raid-endgame': [
    'palworld-calc-1-0-tier-list',
    'pindrop-verified-combat-list',
    'video-pal-professor-combat-builds',
    'video-pal-professor-overpowered',
    'video-italianspartacus-party-comps',
    'video-ragegaming-op-combat-builds',
  ],
};
const teamsByKind = [
  ['combat', COMBAT_TEAMS],
  ['roaming', ROAMING_TEAMS],
  ['base', BASE_TEAMS],
];

assert.deepEqual(LEVEL_BANDS.map(band => band.id), expectedBands);
assert.equal(TEAMS.length, COMBAT_TEAMS.length + ROAMING_TEAMS.length + BASE_TEAMS.length + SPECIAL_TEAMS.length);

for (const [kind, teams] of teamsByKind) {
  assert.equal(teams.length, expectedBands.length, `${kind}: jedes Levelband braucht ein Team`);
  assert.deepEqual(teams.map(team => team.levelBandId), expectedBands, `${kind}: Levelband-Reihenfolge`);

  for (const team of teams) {
    assert.equal(team.kind, kind);
    assert.equal(team.slots.length, 5, `${team.id}: Teamgröße`);
    assert.ok(team.purpose?.trim(), `${team.id}: Zweck fehlt`);
    assert.ok(team.accessNote?.trim(), `${team.id}: Zugangshinweis fehlt`);
    assert.ok(team.switchWhen?.trim(), `${team.id}: Wechselkriterium fehlt`);
    assert.ok(team.combinationReason?.trim(), `${team.id}: Kombinationsbegründung fehlt`);
    assert.ok(team.sources.length > 0, `${team.id}: Quellenpflicht`);
    assert.ok(team.sources.every(sourceId => sourceIds.has(sourceId)), `${team.id}: unbekannte Quelle`);
    assert.ok(Array.isArray(team.sourceIds), `${team.id}: sourceIds fehlt`);
    assert.deepEqual(team.sourceIds, team.sources, `${team.id}: sourceIds muss die Quellen spiegeln`);

    for (const teamSlot of team.slots) {
      assert.ok(teamSlot.role?.trim(), `${team.id}: Slotrolle fehlt`);
      assert.ok(teamSlot.reason?.trim(), `${team.id}: Slotbegründung fehlt`);
      assert.ok(teamSlot.palId === null || palIds.has(teamSlot.palId), `${team.id}: ungültige Pal-ID`);
      assert.ok(Array.isArray(teamSlot.alternativePalIds), `${team.id}: alternativePalIds fehlt`);
      assert.ok(
        teamSlot.alternativePalIds.every(alternativePalId => palIds.has(alternativePalId)),
        `${team.id}: unbekannte alternative Pal-ID`
      );
      if (teamSlot.palId === null) {
        assert.equal(teamSlot.optional, true, `${team.id}: ?-Slot muss optional sein`);
        assert.match(teamSlot.reason, /frei|flex|variabel|situativ|ziel|counter|gegen/i);
      }
    }
  }
}

for (const team of SPECIAL_TEAMS) {
  assert.equal(team.kind, 'special');
  assert.equal(team.slots.length, 5, `${team.id}: Spezialteamgröße`);
  assert.ok(team.specialty?.trim(), `${team.id}: Spezialgebiet fehlt`);
  assert.ok(team.purpose?.trim(), `${team.id}: Zweck fehlt`);
  assert.ok(team.accessNote?.trim(), `${team.id}: Zugangshinweis fehlt`);
  assert.ok(team.switchWhen?.trim(), `${team.id}: Wechselkriterium fehlt`);
  assert.ok(team.combinationReason?.trim(), `${team.id}: Kombinationsbegründung fehlt`);
  assert.ok(team.sources.length > 0, `${team.id}: Quellenpflicht`);
  assert.ok(team.sources.every(sourceId => sourceIds.has(sourceId)), `${team.id}: unbekannte Quelle`);
  assert.ok(Array.isArray(team.sourceIds), `${team.id}: sourceIds fehlt`);
  assert.deepEqual(team.sourceIds, team.sources, `${team.id}: sourceIds muss die Quellen spiegeln`);
  for (const teamSlot of team.slots) {
    assert.ok(teamSlot.role?.trim(), `${team.id}: Slotrolle fehlt`);
    assert.ok(teamSlot.reason?.trim(), `${team.id}: Slotbegründung fehlt`);
    assert.ok(teamSlot.palId === null || palIds.has(teamSlot.palId), `${team.id}: ungültige Pal-ID`);
    assert.ok(Array.isArray(teamSlot.alternativePalIds), `${team.id}: alternativePalIds fehlt`);
    assert.ok(
      teamSlot.alternativePalIds.every(alternativePalId => palIds.has(alternativePalId)),
      `${team.id}: unbekannte alternative Pal-ID`
    );
  }
}

for (const [specialty, sources] of Object.entries(expectedSpecialSources)) {
  const team = SPECIAL_TEAMS.find(candidate => candidate.specialty === specialty);
  assert.ok(team, `Spezialteam ${specialty} fehlt`);
  assert.deepEqual(team.sourceIds, sources, `${team.id}: fachlich passende Quellen fehlen oder sind unpassend`);
}

assert.equal(palIds.has('unknown-alternative-pal'), false, 'unbekannte Alternativ-Pal-ID darf nicht gültig werden');
assert.equal(sourceIds.has('unknown-team-source'), false, 'unbekannte Team-Quellen-ID darf nicht gültig werden');

assert.ok(COMBAT_TEAMS[0].slots.some(teamSlot => teamSlot.palId === null), 'Early-Kampfteam braucht Flex-Slot');
assert.deepEqual(
  COMBAT_TEAMS.find(team => team.levelBandId === '1-10').slots.slice(0, 4).map(teamSlot => teamSlot.palId),
  ['foxparks', 'daedream', 'cattiva', 'vixy']
);
assert.deepEqual(
  COMBAT_TEAMS.find(team => team.levelBandId === '20-30').slots.slice(0, 4).map(teamSlot => teamSlot.palId),
  ['anubis', 'jormuntide-ignis', 'lily', 'eikthyrdeer']
);

const endgame = COMBAT_TEAMS.find(team => team.levelBandId === '50-plus');
assert.ok(['shaolong', 'panthalus'].includes(endgame.slots[0].palId));
assert.equal(endgame.slots[1].palId, 'orserk');
assert.ok(endgame.slots.slice(2).every(teamSlot => /support|counter/i.test(teamSlot.role)));

for (const team of BASE_TEAMS) {
  const roles = team.slots.map(teamSlot => teamSlot.role).join(' ');
  assert.match(roles, /production|handiwork|kindling|planting|medicine/i, `${team.id}: Produktionskern fehlt`);
  assert.match(roles, /ore|material|mining|lumbering|gathering/i, `${team.id}: Erz-/Materialrolle fehlt`);
  assert.match(roles, /cooling|logistics|transporting|electricity/i, `${team.id}: Kühlung/Logistikrolle fehlt`);
}

assert.ok(SPECIAL_TEAMS.some(team => /counter/i.test(team.specialty)));
assert.ok(SPECIAL_TEAMS.some(team => /raid|endgame/i.test(team.specialty)));
assert.ok(SPECIAL_TEAMS.some(team => /resource/i.test(team.specialty)));
assert.ok(SPECIAL_TEAMS.every(team => team.kind === 'special' && team.sources.length > 0));

console.log('team data contract: ok');
