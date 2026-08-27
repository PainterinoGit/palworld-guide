import assert from 'node:assert/strict';
import {
  buildPalDatabase,
  getPalDetails,
  matchesPalGoal,
  resolvePalEntry,
  resolvePalImageName,
} from '../js/pal-data-adapter.mjs';

const roster = [
  {
    name: 'Alpha',
    types: ['Old'],
    tier: 'c',
    stage: 'early',
    partnerSkill: 'Alte Fähigkeit',
    workSuitability: { Mining: 2 },
    location: 'Alte Region',
    roles: ['legacy-top'],
    isBoss: false,
  },
  {
    name: 'Beta',
    types: ['Water'],
    tier: 'b',
    stage: 'mid',
    partnerSkill: 'Neutrale Fähigkeit',
    workSuitability: { Watering: 3 },
    location: 'Referenzregion',
    isBoss: false,
  },
];

const currentAlpha = {
  id: 'alpha-current',
  name: 'Alpha',
  aliases: ['Alpha Prime'],
  types: ['Fire'],
  availability: 'world-tree-late',
  location: 'Aktuelle Region',
  workSuitability: { Kindling: 8 },
  partnerSkill: 'Aktuelle Fähigkeit',
  whyGood: 'Aktueller Einsatzgrund.',
  bestFor: 'Aktuelle beste Nutzung.',
  switchWhen: 'Wechseln, sobald Beta besser passt.',
  alternatives: ['beta-current'],
  upgradeFrom: ['beta-current'],
  upgradeTo: ['beta-current'],
  isActiveRecommendation: true,
  combat: {
    roles: ['damage'],
    reason: 'Aktueller Kampfgrund.',
    bestFor: 'Bosskämpfe.',
    switchWhen: 'Bei einem Element-Counter wechseln.',
  },
  base: {
    roles: ['kindling'],
    reason: 'Aktueller Base-Grund.',
    bestFor: 'Große Öfen.',
    switchWhen: 'Bei geringer Last einen flexiblen Worker einsetzen.',
  },
  roaming: {
    roles: ['roaming', 'mount'],
    reason: 'Aktueller Roaming-Grund.',
    bestFor: 'Kurze Ressourcenwege.',
    switchWhen: 'Für lange Wege ein Flug-Mount nehmen.',
  },
  progression: {
    phase: 'late',
    roles: ['late-game'],
    reason: 'Aktueller Progressionsgrund.',
    bestFor: 'Die späte Produktionsphase.',
    switchWhen: 'Beim nächsten Upgrade neu bewerten.',
  },
  sources: ['source-current'],
  patchScope: 'Patch 1.0+',
  checkedAt: '2026-08-27',
  confidence: 'community-cross-check',
};

const currentBeta = {
  id: 'beta-current',
  name: 'Beta',
  aliases: [],
  types: ['Water'],
  location: 'Beta-Region',
  workSuitability: { Watering: 8 },
  partnerSkill: 'Beta-Fähigkeit',
  whyGood: 'Beta-Einsatzgrund.',
  bestFor: 'Beta-Nutzung.',
  switchWhen: 'Bei geändertem Ziel wechseln.',
  alternatives: [],
  upgradeFrom: [],
  upgradeTo: [],
  isActiveRecommendation: true,
  combat: { roles: ['support'], reason: 'Beta-Kampfgrund.', bestFor: 'Support.', switchWhen: 'Bei anderem Bedarf wechseln.' },
  base: { roles: ['watering'], reason: 'Beta-Base-Grund.', bestFor: 'Bewässerung.', switchWhen: 'Bei anderem Engpass wechseln.' },
  roaming: { roles: ['roaming'], reason: 'Beta-Roaming-Grund.', bestFor: 'Kurze Wege.', switchWhen: 'Bei langen Wegen wechseln.' },
  progression: { phase: 'mid', roles: ['mid-game'], reason: 'Beta-Progressionsgrund.', bestFor: 'Midgame.', switchWhen: 'Ins Endgame wechseln.' },
  sources: ['source-current'],
  patchScope: 'Patch 1.0+',
  checkedAt: '2026-08-27',
  confidence: 'single-editorial',
};

const sourceCatalog = [{
  id: 'source-current',
  title: 'Aktuelle Quelle',
  url: 'https://example.com/current-source',
}];

const database = buildPalDatabase(roster, [currentAlpha, currentBeta], sourceCatalog);
const alpha = database.Alpha;
const beta = database.Beta;

assert.deepEqual(alpha.types, ['Fire'], 'aktuelle Meta muss Rosterwerte priorisieren');
assert.equal(alpha.location, 'Aktuelle Region', 'aktuelle Fundortdaten müssen Vorrang haben');
assert.deepEqual(alpha.workSuitability, { Kindling: 8 }, 'aktuelle Arbeitsdaten dürfen nicht mit alten Werten verschmelzen');
assert.deepEqual(alpha.stages, ['late'], 'Progressionsphase muss den alten Roster-Stage ersetzen');
assert.deepEqual(alpha.roles, ['damage', 'kindling', 'roaming', 'mount', 'late-game'], 'Rollen müssen aus aktueller Meta kommen');
assert.equal(alpha.active, true);
assert.equal(beta.active, true);

assert.equal(resolvePalEntry(database, 'Alpha Prime'), alpha, 'Alias muss denselben Datensatz auflösen');
assert.equal(resolvePalEntry(database, 'alpha-current'), alpha, 'Meta-ID muss denselben Datensatz auflösen');
assert.equal(resolvePalImageName(database, 'Alpha Prime'), 'Alpha', 'Bildauflösung muss Aliasnamen auf den kanonischen Namen abbilden');
assert.equal(resolvePalImageName(database, 'Beta'), 'Beta');

assert.equal(matchesPalGoal(alpha, 'combat'), true, 'Kampffilter muss Combat-Rollen verwenden');
assert.equal(matchesPalGoal(alpha, 'worker'), true, 'Workerfilter muss Base-Rollen verwenden');
assert.equal(matchesPalGoal(alpha, 'mount'), true, 'Mountfilter muss Roaming-Rollen verwenden');
assert.equal(matchesPalGoal(beta, 'combat'), true, 'Support-Pals müssen im Kampffilter bleiben');
assert.equal(matchesPalGoal(beta, 'worker'), true, 'Arbeitsrollen müssen im Workerfilter bleiben');
assert.equal(matchesPalGoal(alpha, 'fang'), true, 'Fangfilter muss vorhandene Combat-Schadensrollen als Fangsemantik nutzen');
assert.equal(matchesPalGoal(beta, 'fang'), true, 'Fangfilter muss vorhandene Combat-Supportrollen als Fangsemantik nutzen');
assert.equal(matchesPalGoal(beta, 'upgrade'), false, 'Upgradefilter darf Progressionsdaten ohne Upgrade-Beziehung nicht akzeptieren');
assert.equal(matchesPalGoal(alpha, 'upgrade'), true, 'Upgradefilter muss echte Upgrade-Beziehungen akzeptieren');

assert.equal(alpha.sourceStatus.patchScope, 'Patch 1.0+');
assert.equal(alpha.sourceStatus.checkedAt, '2026-08-27');
assert.equal(alpha.sourceStatus.sources[0].url, 'https://example.com/current-source');
assert.match(alpha.sourceStatus.label, /Patch 1\.0\+ · geprüft am 2026-08-27/);

const combatDetails = getPalDetails(alpha, 'combat');
assert.deepEqual(
  {
    image: combatDetails.image,
    location: combatDetails.location,
    reason: combatDetails.reason,
    bestFor: combatDetails.bestFor,
    alternatives: combatDetails.alternatives,
    switchWhen: combatDetails.switchWhen,
  },
  {
    image: 'Alpha',
    location: 'Aktuelle Region',
    reason: 'Aktueller Kampfgrund.',
    bestFor: 'Bosskämpfe.',
    alternatives: ['Beta'],
    switchWhen: 'Bei einem Element-Counter wechseln.',
  },
  'Detaildaten müssen den gewählten Nutzungskontext abbilden'
);

assert.equal(database.Alpha.note, undefined, 'kein altes HTML-/Roster-Notizfeld darf als Meta-Fallback dienen');
assert.deepEqual(database.Alpha.legacyRoles, undefined, 'alte Empfehlungsrollen dürfen nicht in die aktive DB gelangen');
assert.equal(database.Alpha.featured, true, 'Featured-Status darf nur aus aktueller Meta stammen');
assert.equal(database.Beta.featured, true);

const neutralDatabase = buildPalDatabase([
  { ...roster[0], name: 'Neutral', roles: ['old-recommendation'], note: 'Alter HTML-Tipp' },
], []);
assert.equal(neutralDatabase.Neutral.active, false);
assert.equal(neutralDatabase.Neutral.featured, false);
assert.equal(neutralDatabase.Neutral.note, undefined, 'neutrale Referenz darf keinen alten Empfehlungstext aktivieren');
assert.deepEqual(neutralDatabase.Neutral.roles, [], 'neutrale Roster-Rollen dürfen keine aktuellen Filterrollen vortäuschen');

const orphanUpgradeDatabase = buildPalDatabase(
  roster,
  [{ ...currentBeta, upgradeFrom: ['missing-pal'], upgradeTo: [] }],
  sourceCatalog,
);
assert.deepEqual(orphanUpgradeDatabase.Beta.upgradeFromIds, [], 'unaufgelöste Upgrade-IDs dürfen keine Beziehung vortäuschen');
assert.equal(matchesPalGoal(orphanUpgradeDatabase.Beta, 'upgrade'), false, 'unaufgelöste Upgrade-IDs dürfen nicht als Upgrade gelten');

assert.throws(
  () => buildPalDatabase(roster, [{ ...currentAlpha, whyGood: '' }], sourceCatalog),
  /Begründung|whyGood|combat\.reason/,
  'aktive Meta ohne Begründung muss abgewiesen werden'
);

console.log('pal data adapter: ok');
