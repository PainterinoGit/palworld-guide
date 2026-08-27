import assert from 'node:assert/strict';
import { renderGuideStep } from '../js/guide-renderer.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { getPalById } from '../data/pals.mjs';

const firstStep = GUIDE_STEPS[0];
const firstHtml = renderGuideStep(firstStep);
const goalIndex = firstHtml.indexOf(firstStep.goal);
const teamsIndex = firstHtml.indexOf('Vollständige Teams');
const neededPalsIndex = firstHtml.indexOf('Benötigte Pals');
const locationsIndex = firstHtml.indexOf('Fundorte');
const upgradeIndex = firstHtml.indexOf('Upgrade / Wechsel');
const checklistIndex = firstHtml.indexOf('Checkliste');

assert.ok(goalIndex >= 0, 'Ziel fehlt');
assert.ok(goalIndex < teamsIndex, 'Ziel muss vor den Teams stehen');
assert.ok(teamsIndex < neededPalsIndex, 'Teams müssen vor den benötigten Pals stehen');
assert.ok(neededPalsIndex < locationsIndex, 'Benötigte Pals müssen vor Fundorten stehen');
assert.ok(locationsIndex < upgradeIndex, 'Fundorte müssen vor Upgrade / Wechsel stehen');
assert.ok(upgradeIndex < checklistIndex, 'Upgrade / Wechsel muss vor der Checkliste stehen');

for (const teamId of Object.values(firstStep.teamIds)) {
  assert.match(firstHtml, new RegExp(`data-team-id="${teamId}"`));
}
for (const palId of firstStep.requiredPalIds) {
  assert.match(firstHtml, new RegExp(getPalById(palId).name));
  assert.match(firstHtml, new RegExp(getPalById(palId).location));
}
for (const item of firstStep.checklist) {
  assert.match(firstHtml, new RegExp(`data-guide-checklist="${firstStep.id}:${item.id}"`));
}

const endgameHtml = renderGuideStep(GUIDE_STEPS.at(-1));
assert.match(endgameHtml, /Spezialkontext/);
assert.match(endgameHtml, /special-raid-endgame/);
assert.match(endgameHtml, /Sofort holen/);
assert.match(endgameHtml, /Später ersetzen/);

console.log('guide renderer: ok');
