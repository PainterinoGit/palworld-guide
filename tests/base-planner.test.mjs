import assert from 'node:assert/strict';
import { BASE_PLANS, getBasePlan } from '../data/base-plans.mjs';
globalThis.window = { GuideData: { META_SOURCES: [] } };
const { renderBasePlan } = await import('../js/base-planner.mjs');

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
assert.ok(production.workers.every(worker => /Monitoring:/i.test(worker)), 'Produktionsbase erklärt die Monitoring-Einstellung je Worker');
assert.ok(breeding.workers.every(worker => /Monitoring:/i.test(worker)), 'Breedingbase erklärt die Monitoring-Einstellung je Worker');
assert.match(production.workers.join(' · '), /Reserve/i, 'Produktionsbase kennzeichnet Reserve-Worker');
assert.match(breeding.workers.join(' · '), /Ranch-Reserve/i, 'Breedingbase kennzeichnet Ranch-Reserve');
assert.match(production.buildings, /2× Beerenplantage.*2× Salatplantage/i, 'Produktionsbase nennt konkrete Futterplantagen');
assert.match(breeding.buildings, /2× Weizenplantage.*1× Beerenplantage/i, 'Breedingbase nennt konkrete Kuchenplantagen');
assert.match(breeding.workers.join(' · '), /2× Chikipi.*2× Mozzarina.*2× Beegarde/i, 'Breedingbase nennt Ranch-Pals mit Mengen');
assert.match(breeding.note, /Kuchenproduktion/i, 'Breedingbase erklärt den Produktionszweck');
const threeBasePlan = getBasePlan(3);
assert.ok(threeBasePlan.bases.every(base => base.workers.length === 15), 'jede Base im 3-Basen-Layout plant 15 Worker-Slots');
assert.ok(threeBasePlan.bases.every(base => base.workers.every(worker => /Monitoring:/i.test(worker))), '3-Basen-Layout erklärt die Monitoring-Einstellung je Worker');
const allBuildingText = Object.values(BASE_PLANS).flatMap(plan => plan.bases.map(base => base.buildings)).join(' ');
for (const building of ['Palbox', 'Futterbox', 'Betten', 'Heiße Quelle', 'Monitoring Stand', 'Lager', 'Klinik', 'Mühle', 'Breeding Farm|Ancient Hatchery']) {
  assert.match(allBuildingText, new RegExp(building, 'i'), `Gebäude & Layout nennt ${building}`);
}
assert.match(allBuildingText, /Zerkleinerer|Crusher/i, 'Produktionslayout nennt Zerkleinerer');
assert.match(allBuildingText, /Stromgenerator|Generator/i, 'Produktionslayout nennt Stromversorgung');
assert.match(allBuildingText, /Öl-Extraktor|Crude Oil Extractor/i, 'Endgame-Layout nennt Ölversorgung');
assert.match(allBuildingText, /Ancient Material Synthesizer/i, 'Endgame-Layout nennt Material-Synthesizer');
const renderedTwoBase = renderBasePlan(twoBasePlan);
assert.match(renderedTwoBase, /class="base-worker-icon"/, 'Worker-Pool zeigt Pal-Icons');
assert.match(renderedTwoBase, /switchTab\('pals'\)/, 'Worker-Pool verlinkt Pals in die Datenbank');
assert.match(renderedTwoBase, /⛏️|⚡|🔥|🛠️|🌱|💧|📦/, 'Worker-Pool zeigt Skill-Emojis');

console.log('base planner data contract: ok');
