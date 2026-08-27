import { PALS, getPalById } from '../data/pals.mjs';
import { TEAMS } from '../data/teams.mjs';
import { renderTeamCard } from './team-renderer.mjs';

const PAL_BY_ID = new Map(PALS.map(pal => [pal.id, pal]));
const TEAM_BY_ID = new Map(TEAMS.map(team => [team.id, team]));

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function resolvePal(id) {
  return PAL_BY_ID.get(id) || getPalById(id);
}

function renderPalReferenceList(ids, label) {
  return `<section class="guide-pal-section"><h3>${escapeHtml(label)}</h3><ul class="guide-pal-list">${ids.map(id => {
    const pal = resolvePal(id);
    return pal
      ? `<li data-guide-pal-id="${escapeHtml(id)}"><strong>${escapeHtml(pal.name)}</strong><span>${escapeHtml(pal.location)}</span></li>`
      : `<li data-guide-pal-id="${escapeHtml(id)}"><strong>Unbekannte Pal-ID</strong><span>${escapeHtml(id)}</span></li>`;
  }).join('')}</ul></section>`;
}

function renderLocationList(ids) {
  return `<section class="guide-location-section"><h3>Fundorte</h3><ul>${ids.map(id => `<li><button class="guide-location-link" type="button" data-target-location="${escapeHtml(id)}" onclick="switchTab('locations'); selectLocation('${escapeHtml(id)}')">${escapeHtml(id)}</button></li>`).join('')}</ul></section>`;
}

function renderTeamReferences(teamIds = {}) {
  const kinds = ['combat', 'roaming', 'base'];
  return `<section class="guide-team-section"><h3>Vollständige Teams</h3><div class="guide-team-grid level-team-grid">${kinds.map(kind => {
    const teamId = teamIds[kind];
    const team = TEAM_BY_ID.get(teamId);
    return team
      ? `<div class="guide-team-reference" data-guide-team-kind="${kind}">${renderTeamCard(team, kind)}</div>`
      : `<div class="guide-team-reference guide-team-invalid" data-guide-team-id="${escapeHtml(teamId)}"><strong>Unbekannte ${escapeHtml(kind)}-Team-ID</strong><span>${escapeHtml(teamId)}</span></div>`;
  }).join('')}</div></section>`;
}

function renderSpecialContext(specialTeamIds = []) {
  if (!specialTeamIds.length) return '';
  return `<section class="guide-special-section"><h3>Spezialkontext</h3><p>Diese Teams ersetzen die Roadmap-Teams nicht; sie gelten nur für die konkrete Situation.</p><div class="guide-team-grid level-team-grid">${specialTeamIds.map(teamId => {
    const team = TEAM_BY_ID.get(teamId);
    return team
      ? `<div class="guide-team-reference" data-guide-special-team-id="${escapeHtml(teamId)}">${renderTeamCard(team, 'special')}</div>`
      : `<div class="guide-team-reference guide-team-invalid" data-guide-special-team-id="${escapeHtml(teamId)}"><strong>Unbekannte Spezialteam-ID</strong><span>${escapeHtml(teamId)}</span></div>`;
  }).join('')}</div></section>`;
}

function renderChecklist(step) {
  return `<section class="guide-checklist-section"><h3>Checkliste</h3><ul class="guide-checklist">${step.checklist.map(item => `<li><label><input type="checkbox" data-guide-checklist="${escapeHtml(`${step.id}:${item.id}`)}"><span>${escapeHtml(item.label)}</span></label></li>`).join('')}</ul></section>`;
}

export function renderGuideStep(step) {
  return `<article class="guide-step-card" data-guide-step="${escapeHtml(step.id)}">
    <div class="guide-step-kicker">Level ${escapeHtml(step.levelBandId)}</div>
    <section class="guide-goal-section"><h3>Ziel</h3><h2>${escapeHtml(step.goal)}</h2></section>
    ${renderTeamReferences(step.teamIds)}
    ${renderSpecialContext(step.specialTeamIds)}
    ${renderPalReferenceList(step.requiredPalIds, 'Benötigte Pals')}
    ${renderLocationList(step.locationIds)}
    <section class="guide-upgrade-section"><h3>Upgrade / Wechsel</h3>
      ${renderPalReferenceList(step.immediatePalIds, 'Sofort holen')}
      ${renderPalReferenceList(step.replaceLaterPalIds, 'Später ersetzen')}
      <p class="guide-step-switch"><strong>Wechselkriterium:</strong> ${escapeHtml(step.switchWhen)}</p>
    </section>
    ${renderChecklist(step)}
  </article>`;
}
