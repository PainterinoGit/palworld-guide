import { BASE_PLANS, getBasePlan } from '../data/base-plans.mjs';
import { BREEDING_ROUTES } from '../data/breeding.mjs';
import { PALS } from '../data/pals.mjs';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const PAL_NAMES = PALS.map(pal => pal.name).sort((a, b) => b.length - a.length);
const SKILL_EMOJIS = { Mining: '⛏️', Electricity: '⚡', Kindling: '🔥', Handiwork: '🛠️', Planting: '🌱', Watering: '💧', Transporting: '📦', 'Medicine Production': '🧪', 'Farming / Ranch': '🥚', Cooling: '❄️', Lumbering: '🌲' };
const LOCATION_LABELS = ['Erzbrunnen', 'Strombereich', 'Öfen und Schmelzer', 'Assembly-Lines', 'Plantagen', 'Medizinbereich', 'Lagerbereich', 'Küche', 'Kühler und Inkubatoren', 'Eier-Ranch', 'Milch-Ranch', 'Honig-Ranch', 'Wool-Ranch', 'Ressourcenplantagen', 'Holzbereich'];
const sourceLinks = ids => ids.map(id => {
  const source = window.GuideData?.META_SOURCES?.find(item => item.id === id);
  return source ? `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>` : '';
}).filter(Boolean).join(' · ');

function palIconUrl(name, size = 24) {
  const file = `${name.replace(/ /g, '_')}_icon.png`;
  return `https://palworld.wiki.gg/images/thumb/${encodeURIComponent(file)}/${size}px-${encodeURIComponent(file)}`;
}

function workerPalName(worker) {
  const knownName = PAL_NAMES.find(name => worker.includes(name));
  if (knownName) return knownName;
  return (worker.split(' · ')[0] || '').replace(/^\d+(?:–\d+)?×\s*/, '').trim();
}

function workerSkill(worker) {
  const role = worker.split(' · ')[1] || worker;
  return Object.keys(SKILL_EMOJIS).find(skill => role.includes(skill)) || (role.includes('Ranch') ? 'Farming / Ranch' : 'Utility');
}

function workerLocation(worker) {
  return LOCATION_LABELS.find(location => worker.includes(location)) || '';
}

function renderWorker(worker) {
  const palName = workerPalName(worker);
  const skill = workerSkill(worker);
  const emoji = SKILL_EMOJIS[skill] || '🔧';
  const location = workerLocation(worker);
  const reserve = /Reserve|Backup/i.test(worker);
  const disabled = /aus;/i.test(worker);
  const status = reserve ? '🔁 Reserve' : disabled ? '⛔ aus' : '✅ aktiv';
  const palVisual = palName ? `<img class="base-worker-icon" src="${palIconUrl(palName)}" alt="" aria-hidden="true" onerror="this.style.display='none'">` : '';
  const palLabel = palName
    ? `<a class="base-worker-pal" data-pal-name="${escapeHtml(palName)}" href="#pals" onclick="switchTab('pals'); const input=document.getElementById('palSearchInput'); if(input){input.value='${escapeHtml(palName)}'; filterPalsTable();} return false;">${palVisual}${escapeHtml(palName)}</a>`
    : `<span class="base-worker-pal">${escapeHtml(worker.split(' · ')[0])}</span>`;
  return `<li class="base-worker"><span class="base-worker-quantity">${escapeHtml(worker.match(/^\d+(?:–\d+)?×/)?.[0] || '')}</span>${palLabel}<span class="base-worker-meta">${emoji} ${escapeHtml(skill)} · ${status}${location ? ` · 📍 ${escapeHtml(location)}` : ''}</span></li>`;
}

export function renderBasePlan(plan) {
  return `<div class="base-plan-grid">${plan.bases.map((base, index) => `<article class="base-plan-card">
    <div class="base-plan-card-top"><span class="base-plan-number">0${index + 1}</span><span class="base-plan-kicker">${escapeHtml(plan.baseCount)}-BASE-SETUP</span></div>
    <h3>${escapeHtml(base.name)}</h3><p class="base-plan-purpose">${escapeHtml(base.purpose)}</p>
    <div class="base-plan-section"><h4>Worker-Pool · ${base.workers.length} Slots</h4><ul class="base-worker-list">${base.workers.map(renderWorker).join('')}</ul></div>
    <div class="base-plan-section"><h4>Gebäude & Layout</h4><p>${escapeHtml(base.buildings)}</p></div>
    <p class="base-plan-note"><strong>Praxis:</strong> ${escapeHtml(base.note)}</p>
    <div class="base-plan-sources"><span>Quellen</span>${sourceLinks(base.sources)}</div>
  </article>`).join('')}</div>`;
}

function renderBreedingRoutes() {
  const host = document.getElementById('breedingRouteHost');
  if (!host) return;
  host.innerHTML = BREEDING_ROUTES.map(route => `<section class="breeding-route">
    <div class="breeding-route-heading"><span class="base-plan-kicker">${escapeHtml(route.phase)}</span><h3>${escapeHtml(route.title)}</h3></div>
    <div class="breeding-steps">${route.steps.map(step => `<article class="breeding-step"><span class="breeding-step-order">${step.order}</span><div><p class="breeding-pair"><strong>${escapeHtml(step.parents)}</strong><span>→</span><strong>${escapeHtml(step.result)}</strong></p><div class="breeding-tags"><span class="breeding-tag breeding-priority">${escapeHtml(step.priority)}</span><span class="breeding-tag">${escapeHtml(step.kind)}</span></div><p>${escapeHtml(step.reason)}</p><p class="breeding-access"><strong>Zugang:</strong> ${escapeHtml(step.access)}</p><div class="base-plan-sources"><span>Quellen</span>${sourceLinks(step.sources)}</div></div></article>`).join('')}</div>
  </section>`).join('');
}

export function initBasePlanner() {
  const host = document.getElementById('basePlanHost');
  const controls = document.getElementById('basePlanControls');
  if (!host || !controls) return;
  if (controls.dataset.basePlannerInitialized) return;
  controls.dataset.basePlannerInitialized = 'true';
  controls.innerHTML = Object.values(BASE_PLANS).map(plan => `<button class="base-plan-control${plan.baseCount === 2 ? ' active' : ''}" type="button" data-base-count="${plan.baseCount}" aria-pressed="${plan.baseCount === 2}">${plan.baseCount} ${plan.baseCount === 1 ? 'Base' : 'Basen'}</button>`).join('');
  const update = count => {
    const plan = getBasePlan(count);
    host.innerHTML = `<div class="base-plan-summary"><div><span class="base-plan-kicker">PATCH 1.0+ · META-PRAXIS</span><h2>${escapeHtml(plan.title)}</h2><p>${escapeHtml(plan.summary)}</p></div><span class="base-count-badge">${plan.baseCount} ${plan.baseCount === 1 ? 'Base' : 'Basen'}</span></div>${renderBasePlan(plan)}`;
    controls.querySelectorAll('button').forEach(button => { const active = Number(button.dataset.baseCount) === plan.baseCount; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  };
  controls.addEventListener('click', event => { const button = event.target.closest('[data-base-count]'); if (button) update(button.dataset.baseCount); });
  update(2);
  renderBreedingRoutes();
}

window.initBasePlanner = initBasePlanner;
