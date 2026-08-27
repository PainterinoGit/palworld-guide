import assert from 'node:assert/strict';
import { BASE_PLANS, getBasePlan } from '../data/base-plans.mjs';

assert.deepEqual(Object.keys(BASE_PLANS).sort(), ['1', '2', '3'], 'es gibt Empfehlungen für 1–3 Basen');
for (const count of [1, 2, 3]) {
  const plan = getBasePlan(count);
  assert.equal(plan.baseCount, count);
  assert.ok(plan.title && plan.summary, 'jede Konfiguration hat Titel und Zusammenfassung');
  assert.equal(plan.bases.length, count, `die ${count}-Basen-Konfiguration hat exakt ${count} Basen`);
  for (const base of plan.bases) {
    assert.ok(base.name && base.purpose && base.workers.length, 'jede Base hat Zweck und Worker');
    assert.ok(base.sources.length, 'jede Base-Empfehlung besitzt Quellen');
  }
}
assert.equal(getBasePlan(99), getBasePlan(3), 'unbekannte Auswahl fällt auf die größte Konfiguration zurück');

console.log('base planner data contract: ok');
