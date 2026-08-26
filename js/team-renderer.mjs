import { getPalById } from '../data/pals.mjs';
import { LEVEL_BANDS } from '../data/teams.mjs';

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const contextLabel = {
  combat: 'Kampf',
  roaming: 'Roaming',
  base: 'Base',
  special: 'Spezial',
};

export function renderTeamSlot(teamSlot, context = 'combat') {
  if (teamSlot.palId === null) {
    const alternatives = teamSlot.alternativePalIds
      .map(getPalById)
      .filter(Boolean)
      .map(pal => pal.name)
      .join(', ');
    return `<div class="team-slot team-slot-variable" data-context="${escapeHtml(context)}">
      <div class="team-slot-pal team-slot-question">?</div>
      <div class="team-slot-copy"><strong>Variabler Slot</strong><span>${escapeHtml(teamSlot.reason)}</span>${alternatives ? `<small>Optionen: ${escapeHtml(alternatives)}</small>` : ''}</div>
    </div>`;
  }

  const pal = getPalById(teamSlot.palId);
  if (!pal) return '';
  const alternatives = teamSlot.alternativePalIds
    .map(getPalById)
    .filter(Boolean)
    .map(candidate => candidate.name)
    .join(', ') || 'keine nötig';
  return `<div class="team-slot" data-pal-id="${escapeHtml(pal.id)}" data-context="${escapeHtml(context)}" tabindex="0">
    <div class="team-slot-pal"><span class="team-slot-index">${escapeHtml(teamSlot.role)}</span><strong>${escapeHtml(pal.name)}</strong><small>${escapeHtml(pal.types.join(' / '))}</small></div>
    <div class="team-slot-copy"><strong>${escapeHtml(contextLabel[context] || context)}</strong><span>${escapeHtml(teamSlot.reason)}</span><small>Alternative: ${escapeHtml(alternatives)}</small></div>
  </div>`;
}

export function renderTeamCard(team, context = team.kind) {
  const slotHtml = team.slots.map(slot => renderTeamSlot(slot, context)).join('');
  const band = LEVEL_BANDS.find(item => item.id === team.levelBandId);
  const prerequisites = team.prerequisites.length ? `<div class="team-card-meta"><strong>Vorbereitung:</strong> ${escapeHtml(team.prerequisites.join(' · '))}</div>` : '';
  const useWhen = team.useWhen ? `<div class="team-card-meta"><strong>Nur einsetzen:</strong> ${escapeHtml(team.useWhen)}</div>` : '';
  return `<article class="team-card" data-team-id="${escapeHtml(team.id)}" data-level-band="${escapeHtml(team.levelBandId)}">
    <div class="team-card-kicker">${escapeHtml(contextLabel[context] || context)} · ${escapeHtml(band?.label || team.levelBandId)}</div>
    <h3>${escapeHtml(team.title)}</h3>
    <p class="team-card-purpose">${escapeHtml(team.purpose)}</p>
    <div class="team-card-slots"><div class="team-card-slots-label">Team-Slots · ${team.slots.length}</div>${slotHtml}</div>
    ${prerequisites}
    ${useWhen}
    <div class="team-card-meta"><strong>Wechseln:</strong> ${escapeHtml(team.switchWhen)}</div>
  </article>`;
}

export function renderTeamsForLevelBand(levelBandId, teams) {
  return teams
    .filter(team => team.levelBandId === levelBandId)
    .map(team => renderTeamCard(team, team.kind))
    .join('');
}
