import assert from 'node:assert/strict';
import { PALS, LEVEL_BANDS, TEAMS, GUIDE_STEPS } from '../data/index.mjs';

assert.equal(new Set(PALS.map(pal => pal.id)).size, PALS.length);
assert.deepEqual(
  LEVEL_BANDS.map(band => band.id),
  ['1-10', '10-20', '20-30', '30-40', '40-50', '50-plus']
);

for (const team of TEAMS) {
  assert.ok(['combat', 'roaming', 'base', 'special'].includes(team.kind));
  assert.ok(team.slots.length > 0);

  for (const slot of team.slots) {
    assert.ok(slot.palId === null || PALS.some(pal => pal.id === slot.palId));
    assert.equal(typeof slot.reason, 'string');
  }
}

for (const step of GUIDE_STEPS) {
  assert.ok(LEVEL_BANDS.some(band => band.id === step.levelBandId));
}

console.log('guide data contract: ok');
