import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { getPalById } from '../data/pals.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { renderTeamCard } from './team-renderer.mjs';
import { renderGuideStep } from './guide-renderer.mjs';

const STORAGE_KEY = 'palworld-level-band';
const GUIDE_STORAGE_KEY = 'palworld-guide-step';
const GUIDE_DONE_KEY = 'palworld-guide-done';

export function getChecklistItemKey(stepId, checklistId) {
  return `${stepId}:${checklistId}`;
}

export function isGuideStepComplete(step, doneChecklist) {
  return step.checklist.every(item => doneChecklist.has(getChecklistItemKey(step.id, item.id)));
}

function readDoneSteps() {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = JSON.parse(window.localStorage.getItem(GUIDE_DONE_KEY) || '[]');
    return new Set(stored.flatMap(value => {
      const step = GUIDE_STEPS.find(candidate => candidate.id === value);
      return step ? step.checklist.map(item => getChecklistItemKey(step.id, item.id)) : [value];
    }).filter(value => typeof value === 'string'));
  } catch {
    return new Set();
  }
}

function writeDoneSteps(done) {
  window.localStorage.setItem(GUIDE_DONE_KEY, JSON.stringify([...done].sort()));
}

function renderLevelTimeline(activeId) {
  const host = document.getElementById('levelBandTimeline');
  if (!host) return;
  host.innerHTML = LEVEL_BANDS.map((band, index) => `<button class="level-band-node${band.id === activeId ? ' is-active' : ''}" type="button" data-level-band="${band.id}" aria-pressed="${band.id === activeId}">
    <span class="level-band-node-line" aria-hidden="true"><span>${index + 1}</span></span>
    <span class="level-band-node-copy"><strong>${band.label}</strong><small>${band.summary}</small></span>
  </button>`).join('');
  host.querySelectorAll('[data-level-band]').forEach(button => button.addEventListener('click', () => renderLevelBand(button.dataset.levelBand)));
}

function getInitialBandId() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return LEVEL_BANDS.some(band => band.id === saved) ? saved : LEVEL_BANDS[0].id;
}

function renderLevelBand(bandId) {
  const band = LEVEL_BANDS.find(item => item.id === bandId) || LEVEL_BANDS[0];
  const host = document.getElementById('levelTeamHost');
  const specialHost = document.getElementById('levelSpecialHost');
  const summary = document.getElementById('levelBandSummary');
  if (!host || !summary || !specialHost) return;

  renderLevelTimeline(band.id);
  summary.innerHTML = `<strong>${band.label}</strong><span>${band.summary}</span>`;
  host.innerHTML = TEAMS
    .filter(team => team.levelBandId === band.id && ['combat', 'roaming', 'base'].includes(team.kind))
    .map(team => renderTeamCard(team, team.kind))
    .join('');
  const specialTeams = TEAMS.filter(team => team.levelBandId === band.id && team.kind === 'special');
  specialHost.innerHTML = specialTeams.length
    ? `<div class="level-special-heading"><span>SPEZIALTEAMS</span><small>Nur für konkrete Situationen wechseln</small></div>${specialTeams.map(team => renderTeamCard(team, team.kind)).join('')}`
    : '';
  attachTeamSlotDetails(host);
  window.localStorage.setItem(STORAGE_KEY, band.id);
}

function palImageUrl(name) {
  return `https://palworld.wiki.gg/wiki/Special:FilePath/${encodeURIComponent(name)}.png`;
}

function attachTeamSlotDetails(host) {
  const tooltip = document.getElementById('chipTooltip');
  if (!tooltip) return;
  host.querySelectorAll('.team-slot[data-pal-id]').forEach(slot => {
    const pal = getPalById(slot.dataset.palId);
    if (!pal) return;
    const show = () => {
      tooltip.innerHTML = `<img class="chip-tooltip-img" src="${palImageUrl(pal.name)}" alt="${pal.name}" onerror="this.style.display='none'"><div class="chip-tooltip-name">${pal.name}</div><div class="chip-tooltip-meta">${pal.types.join(' / ')} · ${pal.roles.join(' / ')}</div><div class="chip-tooltip-loc">📍 ${pal.location}</div><div class="chip-tooltip-loc">💡 ${pal.whyGood}</div><div class="chip-tooltip-loc">↔ Alternative: ${pal.alternatives.length ? pal.alternatives.join(', ') : 'keine nötig'}</div>`;
      tooltip.classList.add('visible');
    };
    const move = event => {
      const offset = 16;
      let x = event.clientX + offset;
      let y = event.clientY + offset;
      const rect = tooltip.getBoundingClientRect();
      if (x + rect.width > window.innerWidth) x = event.clientX - rect.width - offset;
      if (y + rect.height > window.innerHeight) y = event.clientY - rect.height - offset;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    };
    slot.addEventListener('mouseenter', show);
    slot.addEventListener('mousemove', move);
    slot.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    slot.addEventListener('focus', show);
    slot.addEventListener('blur', () => tooltip.classList.remove('visible'));
    const openDatabase = () => {
      const search = document.getElementById('palSearchInput');
      if (search) {
        search.value = pal.name;
        search.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (typeof window.switchTab === 'function') window.switchTab('pals');
    };
    slot.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDatabase();
      }
    });
    slot.addEventListener('click', event => {
      if (window.matchMedia('(hover: none)').matches) {
        event.stopPropagation();
        tooltip.classList.toggle('visible');
      } else {
        openDatabase();
      }
    });
  });
}

export function initLevelTeams() {
  if (!document.getElementById('levelBandTimeline')) return;
  renderLevelBand(getInitialBandId());
}

export function initGuideSteps() {
  const roadmap = document.getElementById('guideRoadmapHost');
  const host = document.getElementById('levelGuideHost');
  if (!roadmap || !host) return;
  let activeId = window.localStorage.getItem(GUIDE_STORAGE_KEY);
  if (!GUIDE_STEPS.some(step => step.id === activeId)) activeId = GUIDE_STEPS[0].id;
  const render = () => {
    const step = GUIDE_STEPS.find(item => item.id === activeId) || GUIDE_STEPS[0];
    const done = readDoneSteps();
    roadmap.innerHTML = GUIDE_STEPS.map((step, index) => {
      const complete = isGuideStepComplete(step, done);
      const completedCount = step.checklist.filter(item => done.has(getChecklistItemKey(step.id, item.id))).length;
      return `<div class="guide-roadmap-item${step.id === activeId ? ' is-active' : ''}${complete ? ' is-done' : ''}">
      <button class="guide-roadmap-step" type="button" data-guide-step="${step.id}" aria-pressed="${step.id === activeId}">
        <span class="guide-roadmap-number">${complete ? '✓' : index + 1}</span>
        <span><strong>${step.levelBandId}</strong><small>${step.goal} · ${completedCount}/${step.checklist.length} erledigt</small></span>
      </button>
    </div>`;
    }).join('');
    roadmap.querySelectorAll('[data-guide-step]').forEach(button => button.addEventListener('click', () => {
      activeId = button.dataset.guideStep;
      window.localStorage.setItem(GUIDE_STORAGE_KEY, activeId);
      render();
    }));
    host.innerHTML = renderGuideStep(step);
    host.querySelectorAll('[data-guide-checklist]').forEach(input => {
      input.checked = done.has(input.dataset.guideChecklist);
      input.addEventListener('change', () => {
        const nextDone = readDoneSteps();
        input.checked ? nextDone.add(input.dataset.guideChecklist) : nextDone.delete(input.dataset.guideChecklist);
        writeDoneSteps(nextDone);
        render();
      });
    });
    window.localStorage.setItem(GUIDE_STORAGE_KEY, step.id);
  };
  render();
}

if (typeof document !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLevelTeams, { once: true });
  document.addEventListener('DOMContentLoaded', initGuideSteps, { once: true });
} else if (typeof document !== 'undefined') {
  initLevelTeams();
  initGuideSteps();
}
