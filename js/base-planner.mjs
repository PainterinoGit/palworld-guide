import { BASE_PLANS, getBasePlan } from '../data/base-plans.mjs';
import { BREEDING_ROUTES } from '../data/breeding.mjs';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const sourceLinks = ids => ids.map(id => {
  const source = window.GuideData?.META_SOURCES?.find(item => item.id === id);
  return source ? `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>` : '';
}).filter(Boolean).join(' · ');

function renderBasePlan(plan) {
  return `<div class="base-plan-grid">${plan.bases.map((base, index) => `<article class="base-plan-card">
    <div class="base-plan-card-top"><span class="base-plan-number">0${index + 1}</span><span class="base-plan-kicker">${escapeHtml(plan.baseCount)}-BASE-SETUP</span></div>
    <h3>${escapeHtml(base.name)}</h3><p class="base-plan-purpose">${escapeHtml(base.purpose)}</p>
    <div class="base-plan-section"><h4>Worker-Pool</h4><ul>${base.workers.map(worker => `<li>${escapeHtml(worker)}</li>`).join('')}</ul></div>
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
    <div class="breeding-steps">${route.steps.map(step => `<article class="breeding-step"><span class="breeding-step-order">${step.order}</span><div><p class="breeding-pair"><strong>${escapeHtml(step.parents)}</strong><span>→</span><strong>${escapeHtml(step.result)}</strong></p><p>${escapeHtml(step.reason)}</p><p class="breeding-access"><strong>Zugang:</strong> ${escapeHtml(step.access)}</p><div class="base-plan-sources"><span>Quellen</span>${sourceLinks(step.sources)}</div></div></article>`).join('')}</div>
  </section>`).join('');
}

function initBasePlanner() {
  const host = document.getElementById('basePlanHost');
  const controls = document.getElementById('basePlanControls');
  if (!host || !controls) return;
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
