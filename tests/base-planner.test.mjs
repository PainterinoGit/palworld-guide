import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BASE_PLANS, getBasePlan } from '../data/base-plans.mjs';
const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const app = read('../js/app.js');
const planner = read('../js/base-planner.mjs');
globalThis.window = { GuideData: { META_SOURCES: [] } };
const { initBasePlanner, renderBasePlan } = await import('../js/base-planner.mjs');

assert.match(app, /basePlanHost/);
assert.match(app, /teams/);
assert.match(planner, /function initBasePlanner/);
assert.match(planner, /basePlanControls/);
assert.match(app, /if \(tabName === 'teams'\)[\s\S]*initBasePlanner/);

function createPlannerDom() {
  const listeners = new Map();
  const buttons = [1, 2, 3].map(count => {
    const classes = new Set();
    const attributes = new Map();
    return {
      dataset: { baseCount: String(count) },
      classList: {
        contains: className => classes.has(className),
        toggle: (className, enabled) => enabled ? classes.add(className) : classes.delete(className),
      },
      setAttribute: (name, value) => attributes.set(name, value),
      getAttribute: name => attributes.get(name),
    };
  });
  let controlsMarkupWrites = 0;
  let controlsMarkup = '';
  const controls = {
    dataset: {},
    get innerHTML() { return controlsMarkup; },
    set innerHTML(value) { controlsMarkupWrites++; controlsMarkup = value; },
    addEventListener(type, listener) {
      listeners.set(type, [...(listeners.get(type) || []), listener]);
    },
    querySelectorAll: selector => selector === 'button' ? buttons : [],
  };
  const host = { innerHTML: '' };
  globalThis.document = {
    getElementById(id) {
      return id === 'basePlanControls' ? controls : id === 'basePlanHost' ? host : null;
    },
  };
  return {
    buttons,
    controls,
    controlsMarkupWrites: () => controlsMarkupWrites,
    host,
    listenerCount: type => (listeners.get(type) || []).length,
    selectBaseCount(count) {
      const button = buttons.find(item => item.dataset.baseCount === String(count));
      for (const listener of listeners.get('click') || []) listener({ target: { closest: () => button } });
    },
  };
}

const plannerDom = createPlannerDom();
initBasePlanner();
assert.equal(plannerDom.controlsMarkupWrites(), 1, 'initialisiert die Base-Plan-Controls einmal');
assert.equal(plannerDom.listenerCount('click'), 1, 'registriert einen Auswahl-Listener');
plannerDom.selectBaseCount(3);
const selectedPlan = plannerDom.host.innerHTML;
initBasePlanner();
assert.equal(plannerDom.controlsMarkupWrites(), 1, 'dupliziert die Controls beim zweiten Aufruf nicht');
assert.equal(plannerDom.listenerCount('click'), 1, 'dupliziert den Auswahl-Listener beim zweiten Aufruf nicht');
assert.equal(plannerDom.buttons[2].classList.contains('active'), true, 'behält die gewählte Basenanzahl bei');
assert.equal(plannerDom.buttons[2].getAttribute('aria-pressed'), 'true', 'behält den Auswahlstatus bei');
assert.equal(plannerDom.host.innerHTML, selectedPlan, 'rendert den gewählten Plan beim zweiten Aufruf nicht neu');

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
assert.match(breeding.workers.join(' · '), /Braloha.*Breeding Farms/i, 'Breedingbase nennt Braloha als Zucht-Worker');
assert.match(production.buildings, /2× Beerenplantage.*2× Salatplantage/i, 'Produktionsbase nennt konkrete Futterplantagen');
assert.match(breeding.buildings, /2× Weizenplantage.*1× Beerenplantage/i, 'Breedingbase nennt konkrete Kuchenplantagen');
assert.match(breeding.workers.join(' · '), /2× Chikipi.*2× Mozzarina.*2× Beegarde/i, 'Breedingbase nennt Ranch-Pals mit Mengen');
assert.match(breeding.note, /Kuchenproduktion/i, 'Breedingbase erklärt den Produktionszweck');
const threeBasePlan = getBasePlan(3);
assert.ok(threeBasePlan.bases.every(base => base.workers.length === 20), 'jede Base im 3-Basen-Layout plant 20 Worker-Slots');
assert.ok(threeBasePlan.bases.every(base => base.workers.every(worker => /Monitoring:/i.test(worker))), '3-Basen-Layout erklärt die Monitoring-Einstellung je Worker');
for (const plan of Object.values(BASE_PLANS)) {
  for (const base of plan.bases) {
    assert.ok(base.workers.some(worker => /Watering/i.test(worker) && !/Reserve|Watering aus/i.test(worker)), `${base.name}: aktiver Watering-Worker fehlt`);
    assert.ok(base.workers.some(worker => /Gathering/i.test(worker) && !/Reserve|Gathering aus/i.test(worker)), `${base.name}: aktiver Gathering-Worker fehlt`);
    assert.ok(base.workers.some(worker => /Electricity/i.test(worker) && !/Reserve|Electricity aus/i.test(worker)), `${base.name}: aktiver Electricity-Worker fehlt`);
    assert.ok(base.workers.some(worker => /Medicine Production/i.test(worker) && !/Reserve|Medicine Production aus/i.test(worker)), `${base.name}: aktiver Clinic-Worker fehlt`);
    assert.doesNotMatch(base.workers.join(' · '), /(?:Vixy|Cremis|Cattiva|Lifmunk|Tanzee).*Reserve/i, `${base.name}: schwacher Reserve-Pal bleibt nicht fest eingeplant`);
  }
}
for (const plan of [getBasePlan(2), getBasePlan(3)]) {
  const breedingBase = plan.bases.find(base => /Breeding/i.test(base.name));
  assert.match(breedingBase.workers.join(' · '), /Braloha.*Breeding-Support.*kein anderer Job aktiv/i, `${plan.baseCount}-Basen-Breedingbase nennt Braloha als separaten Zucht-Support`);
}
assert.match(getBasePlan(3).bases.flatMap(base => base.workers).join(' · '), /Flex-Slot/i, '3-Basen-Layout hält variable Slots offen');
const allBuildingText = Object.values(BASE_PLANS).flatMap(plan => plan.bases.map(base => base.buildings)).join(' ');
for (const building of ['Palbox', 'Futterbox', 'Betten', 'Heiße Quelle', 'Monitoring Stand', 'Lager', 'Klinik', 'Mühle', 'Breeding Farm|Ancient Hatchery']) {
  assert.match(allBuildingText, new RegExp(building, 'i'), `Gebäude & Layout nennt ${building}`);
}
assert.match(allBuildingText, /Zerkleinerer|Crusher/i, 'Produktionslayout nennt Zerkleinerer');
assert.match(allBuildingText, /Stromgenerator|Generator/i, 'Produktionslayout nennt Stromversorgung');
assert.match(allBuildingText, /Öl-Extraktor|Crude Oil Extractor/i, 'Endgame-Layout nennt Ölversorgung');
assert.match(allBuildingText, /Ancient Material Synthesizer/i, 'Endgame-Layout nennt Material-Synthesizer');
const plannerHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(plannerHtml, /Worker-Food.*Salat.*2× Salat.*2× Tomate.*Kochtopf/i, 'Base Planner erklärt Salatproduktion');
const renderedTwoBase = renderBasePlan(twoBasePlan);
assert.match(renderedTwoBase, /class="base-worker-icon"/, 'Worker-Pool zeigt Pal-Icons');
assert.match(renderedTwoBase, /switchTab\('pals'\)/, 'Worker-Pool verlinkt Pals in die Datenbank');
assert.match(renderedTwoBase, /⛏️|⚡|🔥|🛠️|🌱|💧|📦/, 'Worker-Pool zeigt Skill-Emojis');
assert.match(renderedTwoBase, /data-pal-name=/, 'Worker-Pool markiert Pals für Hoverdetails');
const appSource = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
assert.match(appSource, /enableBaseWorkerTooltips/, 'Base-Worker erhalten Hover-Interaktionen');
assert.match(appSource, /workSuitability/, 'Pal-Hoverdetails enthalten Arbeitseignungen');
assert.match(styleSource, /\.pal-work-skills/, 'Pal-Hoverkarte zeigt Arbeitsfähigkeiten kompakt');

console.log('base planner data contract: ok');
