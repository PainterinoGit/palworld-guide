import { PALS, getPalById } from '../data/pals.mjs';
import { LEVEL_BANDS } from '../data/teams.mjs';

const PAL_BY_ID = new Map(PALS.map(pal => [pal.id, pal]));

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

const roleLabel = {
  carry: 'Carry',
  damage: 'Schaden',
  support: 'Support',
  utility: 'Utility',
  mount: 'Mount',
  resource: 'Ressourcen',
  'production-core': 'Produktion',
  'ore-material': 'Erz / Material',
  flex: 'Flex',
};

const typeLabel = {
  Fire: 'Feuer',
  Water: 'Wasser',
  Grass: 'Pflanze',
  Electric: 'Elektro',
  Ground: 'Boden',
  Ice: 'Eis',
  Dragon: 'Drache',
  Dark: 'Dunkel',
  Neutral: 'Neutral',
};

function resolvePal(id) {
  return PAL_BY_ID.get(id) || getPalById(id);
}

function palIconUrl(name, size = 24) {
  const file = `${name.replace(/ /g, '_')}_icon.png`;
  return `https://palworld.wiki.gg/images/thumb/${encodeURIComponent(file)}/${size}px-${encodeURIComponent(file)}`;
}

function palLabel(pal, size = 24) {
  return `<span class="pal-inline-name"><img class="pal-inline-icon" src="${palIconUrl(pal.name, size)}" alt="" aria-hidden="true" onerror="this.style.display='none'"><span>${escapeHtml(pal.name)}</span></span>`;
}

function renderAlternative(id) {
  const pal = resolvePal(id);
  return pal
    ? palLabel(pal, 18)
    : `<span class="team-alternative-invalid">Unbekannte Pal-ID: ${escapeHtml(id)}</span>`;
}

function renderAlternatives(ids = [], label = 'Alternativen') {
  if (!ids.length) return '';
  return `<small class="team-alternatives">${escapeHtml(label)}: ${ids.map(renderAlternative).join(' · ')}</small>`;
}

function formatRole(role) {
  return roleLabel[role] || role;
}

function formatTypes(types = []) {
  return types.map(type => typeLabel[type] || type).join(' / ');
}

export function renderTeamSlot(teamSlot, context = 'combat') {
  const alternativeHtml = renderAlternatives(teamSlot.alternativePalIds, 'Optionen');
  if (teamSlot.palId === null) {
    return `<div class="team-slot team-slot-variable" data-context="${escapeHtml(context)}">
      <div class="team-slot-pal team-slot-question">?</div>
      <div class="team-slot-copy"><span class="team-slot-role">Rolle: ${escapeHtml(formatRole(teamSlot.role))}</span><span class="team-slot-reason"><strong>Kontext:</strong> ${escapeHtml(teamSlot.reason)}</span>${alternativeHtml}</div>
    </div>`;
  }

  const pal = resolvePal(teamSlot.palId);
  if (!pal) {
    return `<div class="team-slot team-slot-invalid" data-pal-id="${escapeHtml(teamSlot.palId)}" data-context="${escapeHtml(context)}">
      <div class="team-slot-pal team-slot-question">!</div>
      <div class="team-slot-copy"><strong>Unbekannter Pal</strong><span class="team-slot-role">Rolle: ${escapeHtml(formatRole(teamSlot.role))}</span><span>Pal-ID: ${escapeHtml(teamSlot.palId)}</span><span class="team-slot-reason">${escapeHtml(teamSlot.reason)}</span>${alternativeHtml}</div>
    </div>`;
  }

  return `<div class="team-slot" data-pal-id="${escapeHtml(pal.id)}" data-context="${escapeHtml(context)}" tabindex="0" role="button" aria-label="${escapeHtml(pal.name)}: Details und Datenbank öffnen">
    <div class="team-slot-pal"><strong>${palLabel(pal, 28)}</strong><span class="team-slot-type">Element: ${escapeHtml(formatTypes(pal.types))}</span></div>
    <div class="team-slot-copy"><span class="team-slot-role">Rolle: ${escapeHtml(formatRole(teamSlot.role))}</span><span class="team-slot-reason"><strong>Begründung:</strong> ${escapeHtml(teamSlot.reason)}</span>${alternativeHtml || '<small class="team-alternatives">Optionen: keine nötig</small>'}</div>
  </div>`;
}

export function renderTeamCard(team, context = team.kind) {
  const slotHtml = (team.slots || []).map(teamSlot => renderTeamSlot(teamSlot, context)).join('');
  const band = LEVEL_BANDS.find(item => item.id === team.levelBandId);
  const accessNote = team.accessNote || team.useWhen || 'Zugangshinweis nicht hinterlegt.';
  return `<article class="team-card" data-team-id="${escapeHtml(team.id)}" data-level-band="${escapeHtml(team.levelBandId)}">
    <div class="team-card-kicker">${escapeHtml(contextLabel[context] || context)} · ${escapeHtml(band?.label || team.levelBandId)}</div>
    <h3>${escapeHtml(team.title)}</h3>
    <p class="team-card-purpose"><strong>Zweck:</strong> ${escapeHtml(team.purpose)}</p>
    <p class="team-card-reason"><strong>Kombinationsbegründung:</strong> ${escapeHtml(team.combinationReason)}</p>
    <div class="team-card-slots"><div class="team-card-slots-label">Team-Slots · ${(team.slots || []).length}</div>${slotHtml}</div>
    <div class="team-card-meta"><strong>Zugang:</strong> ${escapeHtml(accessNote)}</div>
    <div class="team-card-meta"><strong>Wechselkriterium:</strong> ${escapeHtml(team.switchWhen)}</div>
  </article>`;
}

export function renderTeamsForLevelBand(levelBandId, teams) {
  return teams
    .filter(team => team.levelBandId === levelBandId)
    .map(team => renderTeamCard(team, team.kind))
    .join('');
}
