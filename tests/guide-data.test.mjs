import assert from 'node:assert/strict';
import { PALS, LEVEL_BANDS, TEAMS, GUIDE_STEPS } from '../data/index.mjs';
import { getChecklistItemKey, isGuideStepComplete } from '../js/guide-ui.mjs';

const expectedBands = ['1-10', '10-20', '20-30', '30-40', '40-50', '50-plus'];
const palIds = new Set(PALS.map(pal => pal.id));
const teamsById = new Map(TEAMS.map(team => [team.id, team]));

assert.deepEqual(GUIDE_STEPS.map(step => step.levelBandId), expectedBands);
assert.equal(new Set(GUIDE_STEPS.map(step => step.id)).size, GUIDE_STEPS.length);
assert.equal(GUIDE_STEPS.length, 6);

for (const [index, step] of GUIDE_STEPS.entries()) {
  assert.ok(step.goal.trim(), `${step.id}: Ziel fehlt`);
  assert.ok(step.switchWhen.trim(), `${step.id}: Wechselkriterium fehlt`);
  assert.ok(step.locationIds.length > 0, `${step.id}: Fundort fehlt`);
  assert.ok(step.requiredPalIds.length > 0, `${step.id}: benötigte Pals fehlen`);
  assert.ok(step.immediatePalIds.length > 0, `${step.id}: Sofort-holen-Pals fehlen`);
  assert.ok(step.replaceLaterPalIds.length > 0, `${step.id}: Später-ersetzen-Pals fehlen`);
  assert.ok(Array.isArray(step.checklist) && step.checklist.length > 0, `${step.id}: Checkliste fehlt`);
  assert.deepEqual(Object.keys(step.teamIds), ['combat', 'roaming', 'base'], `${step.id}: vollständige Teamverknüpfung fehlt`);
  assert.equal(new Set(step.checklist.map(item => item.id)).size, step.checklist.length, `${step.id}: doppelte Checklisten-ID`);
  assert.ok(step.checklist.every(item => item.label.trim()), `${step.id}: Checklistenlabel fehlt`);

  for (const palId of [...step.requiredPalIds, ...step.immediatePalIds, ...step.replaceLaterPalIds]) {
    assert.ok(palIds.has(palId), `${step.id}: unbekannte Pal-ID ${palId}`);
  }

  for (const [kind, teamId] of Object.entries(step.teamIds)) {
    const team = teamsById.get(teamId);
    assert.ok(team, `${step.id}: unbekannte Team-ID ${teamId}`);
    assert.equal(team.kind, kind, `${step.id}: ${teamId} ist kein ${kind}-Team`);
    assert.equal(team.levelBandId, step.levelBandId, `${step.id}: Team-Levelband passt nicht`);
  }

  for (const teamId of step.specialTeamIds) {
    const team = teamsById.get(teamId);
    assert.ok(team, `${step.id}: unbekannte Spezialteam-ID ${teamId}`);
    assert.equal(team.kind, 'special', `${step.id}: ${teamId} muss Spezialteam sein`);
    assert.equal(team.levelBandId, step.levelBandId, `${step.id}: Spezialteam-Levelband passt nicht`);
  }

  assert.equal(step.nextStepId, GUIDE_STEPS[index + 1]?.id ?? null);
}

const firstStep = GUIDE_STEPS[0];
const checked = new Set(firstStep.checklist.map(item => getChecklistItemKey(firstStep.id, item.id)));
assert.equal(isGuideStepComplete(firstStep, checked), true);
checked.delete(getChecklistItemKey(firstStep.id, firstStep.checklist[0].id));
assert.equal(isGuideStepComplete(firstStep, checked), false);

console.log('guide data contract: ok');
