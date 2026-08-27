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

    for (const teamSlot of team.slots) {
      assert.ok(teamSlot.role?.trim(), `${team.id}: Slotrolle fehlt`);
      assert.ok(teamSlot.reason?.trim(), `${team.id}: Slotbegründung fehlt`);
      assert.ok(teamSlot.palId === null || palIds.has(teamSlot.palId), `${team.id}: ungültige Pal-ID`);
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
  for (const teamSlot of team.slots) {
    assert.ok(teamSlot.role?.trim(), `${team.id}: Slotrolle fehlt`);
    assert.ok(teamSlot.reason?.trim(), `${team.id}: Slotbegründung fehlt`);
    assert.ok(teamSlot.palId === null || palIds.has(teamSlot.palId), `${team.id}: ungültige Pal-ID`);
  }
}

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
