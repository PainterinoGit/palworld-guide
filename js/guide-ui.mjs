import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { getPalById } from '../data/pals.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { renderTeamCard } from './team-renderer.mjs';
import { renderGuideStep } from './guide-renderer.mjs';

const STORAGE_KEY = 'palworld-level-band';

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
    slot.addEventListener('click', event => {
      if (window.matchMedia('(hover: none)').matches) {
        event.stopPropagation();
        tooltip.classList.toggle('visible');
      }
    });
  });
}

export function initLevelTeams() {
  const select = document.getElementById('levelBandSelect');
  if (!select) return;
  select.innerHTML = LEVEL_BANDS.map(band => `<option value="${band.id}">${band.label}</option>`).join('');
  select.value = getInitialBandId();
  renderLevelBand(select.value);
  select.addEventListener('change', () => renderLevelBand(select.value));
}

export function initGuideSteps() {
  const select = document.getElementById('guideStepSelect');
  const host = document.getElementById('levelGuideHost');
  if (!select || !host) return;
  select.innerHTML = GUIDE_STEPS.map(step => `<option value="${step.id}">${step.levelBandId} · ${step.goal}</option>`).join('');
  const saved = window.localStorage.getItem('palworld-guide-step');
  select.value = GUIDE_STEPS.some(step => step.id === saved) ? saved : GUIDE_STEPS[0].id;
  const render = () => {
    const step = GUIDE_STEPS.find(item => item.id === select.value) || GUIDE_STEPS[0];
    host.innerHTML = renderGuideStep(step);
    window.localStorage.setItem('palworld-guide-step', step.id);
  };
  render();
  select.addEventListener('change', render);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLevelTeams, { once: true });
  document.addEventListener('DOMContentLoaded', initGuideSteps, { once: true });
} else {
  initLevelTeams();
  initGuideSteps();
}
