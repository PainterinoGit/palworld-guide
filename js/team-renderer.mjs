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

function palIconUrl(name, size = 24) {
  const file = `${name.replace(/ /g, '_')}_icon.png`;
  return `https://palworld.wiki.gg/images/thumb/${encodeURIComponent(file)}/${size}px-${encodeURIComponent(file)}`;
}

function palLabel(pal, size = 24) {
  return `<span class="pal-inline-name"><img class="pal-inline-icon" src="${palIconUrl(pal.name, size)}" alt="" aria-hidden="true" onerror="this.style.display='none'"><span>${escapeHtml(pal.name)}</span></span>`;
}

export function renderTeamSlot(teamSlot, context = 'combat') {
  if (teamSlot.palId === null) {
    const alternatives = teamSlot.alternativePalIds
      .map(getPalById)
      .filter(Boolean)
      .map(pal => palLabel(pal, 18))
      .join('');
    return `<div class="team-slot team-slot-variable" data-context="${escapeHtml(context)}">
      <div class="team-slot-pal team-slot-question">?</div>
      <div class="team-slot-copy"><strong>Variabler Slot</strong><span>${escapeHtml(teamSlot.reason)}</span>${alternatives ? `<small class="team-alternatives">Optionen: ${alternatives}</small>` : ''}</div>
    </div>`;
  }

  const pal = getPalById(teamSlot.palId);
  if (!pal) return '';
  const alternatives = teamSlot.alternativePalIds
    .map(getPalById)
    .filter(Boolean)
    .map(candidate => palLabel(candidate, 18))
    .join('') || 'keine nötig';
  return `<div class="team-slot" data-pal-id="${escapeHtml(pal.id)}" data-context="${escapeHtml(context)}" tabindex="0" role="button" aria-label="${escapeHtml(pal.name)}: Details und Datenbank öffnen">
    <div class="team-slot-pal"><span class="team-slot-index">${escapeHtml(teamSlot.role)}</span><strong>${palLabel(pal, 28)}</strong><small>${escapeHtml(pal.types.join(' / '))}</small></div>
    <div class="team-slot-copy"><strong>${escapeHtml(contextLabel[context] || context)}</strong><span>${escapeHtml(teamSlot.reason)}</span><small class="team-alternatives">Alternative: ${alternatives}</small></div>
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
