import { TEAMS } from '../data/teams.mjs';
import { getPalById } from '../data/pals.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { renderTeamSlot } from './team-renderer.mjs';
import { renderGuideStep } from './guide-renderer.mjs';
import { buildTeamPhaseView } from './team-progression.mjs';

const GUIDE_STORAGE_KEY = 'palworld-guide-step';
const GUIDE_DONE_KEY = 'palworld-guide-done';
const COMPACT_PHASE_LABELS = ['Start', 'Midgame', 'Endgame'];

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

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

export function renderCompactTeamProgress({ phases, host }) {
  if (!host) return;
  host.innerHTML = phases.filter(phase => COMPACT_PHASE_LABELS.includes(phase.label)).map(phase => {
    const combat = phase.combat;
    const swaps = phase.swaps.slice(0, 2);
    return `<article class="team-card compact-team-phase" data-team-phase="${escapeHtml(phase.id)}">
      <div class="team-card-kicker">KAMPFTEAM · ${escapeHtml(phase.label)}</div>
      <h3>${escapeHtml(combat.title)}</h3>
      <p class="team-card-reason">${escapeHtml(combat.combinationReason)}</p>
      <div class="team-card-slots"><div class="team-card-slots-label">Team-Slots · ${combat.slots.length}</div>${combat.slots.map(slot => renderTeamSlot(slot, 'combat')).join('')}</div>
      <p class="team-card-meta"><strong>Wann wechseln?</strong> ${escapeHtml(phase.switchWhen)}</p>
      ${swaps.length ? `<div class="team-card-meta"><strong>Swap-Optionen:</strong><ul>${swaps.map(swap => `<li><strong>${escapeHtml(swap.title)}</strong> — ${escapeHtml(swap.switchWhen)}</li>`).join('')}</ul></div>` : ''}
    </article>`;
  }).join('');
  attachTeamSlotDetails(host, host);
}

function palImageUrl(name) {
  return `https://palworld.wiki.gg/wiki/Special:FilePath/${encodeURIComponent(name)}.png`;
}

function attachTeamSlotDetails(host, specialHost) {
  const tooltip = document.getElementById('chipTooltip');
  if (!tooltip) return;
  const specialSlots = specialHost.querySelectorAll('.team-slot[data-pal-id]');
  const slots = [...new Set([...host.querySelectorAll('.team-slot[data-pal-id]'), ...specialSlots])];
  slots.forEach(slot => {
    const pal = getPalById(slot.dataset.palId);
    if (!pal) return;
    slot.setAttribute('aria-describedby', 'chipTooltip');
    const show = event => {
      tooltip.innerHTML = `<img class="chip-tooltip-img" src="${palImageUrl(pal.name)}" alt="${pal.name}" onerror="this.style.display='none'"><div class="chip-tooltip-name">${pal.name}</div><div class="chip-tooltip-meta">${pal.types.join(' / ')} · ${pal.roles.join(' / ')}</div><div class="chip-tooltip-loc">📍 ${pal.location}</div><div class="chip-tooltip-loc">💡 ${pal.whyGood}</div><div class="chip-tooltip-loc">↔ Alternative: ${pal.alternatives.length ? pal.alternatives.join(', ') : 'keine nötig'}</div>`;
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');
      if (event) move(event);
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
    slot.addEventListener('mouseenter', event => show(event));
    slot.addEventListener('mousemove', move);
    slot.addEventListener('mouseleave', () => { tooltip.classList.remove('visible'); tooltip.setAttribute('aria-hidden', 'true'); });
    slot.addEventListener('focus', show);
    slot.addEventListener('blur', () => { tooltip.classList.remove('visible'); tooltip.setAttribute('aria-hidden', 'true'); });
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
  const host = document.getElementById('teamProgressHost');
  if (!host) return;
  renderCompactTeamProgress({ phases: buildTeamPhaseView(TEAMS), host });
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
