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
const twoBasePlan = getBasePlan(2);
const production = twoBasePlan.bases[0];
const breeding = twoBasePlan.bases[1];
assert.equal(production.workers.length, 12, 'Produktionsbase plant alle 12 Worker-Slots');
assert.equal(breeding.workers.length, 12, 'Breedingbase plant alle 12 Worker-Slots');
assert.match(production.workers.join(' · '), /Reserve/i, 'Produktionsbase kennzeichnet Reserve-Worker');
assert.match(breeding.workers.join(' · '), /Ranch-Reserve/i, 'Breedingbase kennzeichnet Ranch-Reserve');
assert.match(production.buildings, /2× Beerenplantage.*2× Salatplantage/i, 'Produktionsbase nennt konkrete Futterplantagen');
assert.match(breeding.buildings, /2× Weizenplantage.*1× Beerenplantage/i, 'Breedingbase nennt konkrete Kuchenplantagen');
assert.match(breeding.workers.join(' · '), /2× Chikipi.*2× Mozzarina.*2× Beegarde/i, 'Breedingbase nennt Ranch-Pals mit Mengen');
assert.match(breeding.note, /Kuchenproduktion/i, 'Breedingbase erklärt den Produktionszweck');

console.log('base planner data contract: ok');
