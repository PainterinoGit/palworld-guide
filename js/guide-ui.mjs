import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { renderTeamCard } from './team-renderer.mjs';

const STORAGE_KEY = 'palworld-level-band';

function getInitialBandId() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return LEVEL_BANDS.some(band => band.id === saved) ? saved : LEVEL_BANDS[0].id;
}

function renderLevelBand(bandId) {
  const band = LEVEL_BANDS.find(item => item.id === bandId) || LEVEL_BANDS[0];
  const host = document.getElementById('levelTeamHost');
  const summary = document.getElementById('levelBandSummary');
  if (!host || !summary) return;

  summary.innerHTML = `<strong>${band.label}</strong><span>${band.summary}</span>`;
  host.innerHTML = TEAMS
    .filter(team => team.levelBandId === band.id && ['combat', 'roaming', 'base'].includes(team.kind))
    .map(team => renderTeamCard(team, team.kind))
    .join('');
  window.localStorage.setItem(STORAGE_KEY, band.id);
}

export function initLevelTeams() {
  const select = document.getElementById('levelBandSelect');
  if (!select) return;
  select.innerHTML = LEVEL_BANDS.map(band => `<option value="${band.id}">${band.label}</option>`).join('');
  select.value = getInitialBandId();
  renderLevelBand(select.value);
  select.addEventListener('change', () => renderLevelBand(select.value));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLevelTeams, { once: true });
} else {
  initLevelTeams();
}
