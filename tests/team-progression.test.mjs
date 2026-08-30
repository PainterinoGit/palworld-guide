import assert from 'node:assert/strict';
import { buildTeamPhaseView, TEAM_PHASES } from '../js/team-progression.mjs';
import { TEAMS } from '../data/teams.mjs';

assert.deepEqual(TEAM_PHASES, [
  { id: 'start', label: 'Start', levelBandIds: ['1-10', '10-20'] },
  { id: 'midgame', label: 'Midgame', levelBandIds: ['20-30', '30-40'] },
  { id: 'endgame', label: 'Endgame', levelBandIds: ['40-50', '50-plus'] },
]);

const input = structuredClone(TEAMS);
const phases = buildTeamPhaseView(input);

assert.deepEqual(Object.keys(phases[0]), ['id', 'label', 'levelBandIds', 'combat', 'swaps', 'switchWhen']);
assert.deepEqual(phases.map(phase => phase.id), ['start', 'midgame', 'endgame']);
assert.deepEqual(phases.map(phase => phase.label), ['Start', 'Midgame', 'Endgame']);
assert.deepEqual(phases.map(phase => phase.levelBandIds), [
  ['1-10', '10-20'],
  ['20-30', '30-40'],
  ['40-50', '50-plus'],
]);
assert.ok(phases.every(phase => phase.combat?.kind === 'combat'));
assert.ok(phases.every(phase => phase.combat.slots.length === 5));
assert.ok(phases.every(phase => phase.swaps.length <= 2));

for (const phase of phases) {
  assert.equal(phase.combat, input.find(team => team.kind === 'combat' && phase.levelBandIds.includes(team.levelBandId)));
  assert.equal(phase.switchWhen, phase.combat.switchWhen);
  assert.equal(phase.combat.title, input.find(team => team.id === phase.combat.id).title);
  assert.equal(phase.combat.combinationReason, input.find(team => team.id === phase.combat.id).combinationReason);
  assert.equal(phase.combat.slots, input.find(team => team.id === phase.combat.id).slots);
  assert.equal(phase.combat.sources, input.find(team => team.id === phase.combat.id).sources);
  assert.ok(phase.swaps.every(team => team.kind === 'special'));
}

assert.deepEqual(input, TEAMS);

const syntheticStartTeams = [
  { id: 'combat-10-20', levelBandId: '10-20', kind: 'combat', slots: Array(5), switchWhen: 'later' },
  { id: 'special-first', levelBandId: '1-10', kind: 'special' },
  { id: 'special-second', levelBandId: '10-20', kind: 'special' },
  { id: 'special-third', levelBandId: '1-10', kind: 'special' },
  { id: 'combat-1-10', levelBandId: '1-10', kind: 'combat', slots: Array(5), switchWhen: 'first' },
];
const syntheticStart = buildTeamPhaseView(syntheticStartTeams)[0];

assert.equal(syntheticStart.combat.id, 'combat-1-10');
assert.deepEqual(syntheticStart.swaps.map(team => team.id), ['special-first', 'special-second']);
