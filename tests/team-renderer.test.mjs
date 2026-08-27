import assert from 'node:assert/strict';
import { renderTeamSlot, renderTeamCard } from '../js/team-renderer.mjs';
import { COMBAT_TEAMS } from '../data/teams.mjs';

const combatTeam = COMBAT_TEAMS.find(team => team.levelBandId === '1-10');
const optionalSlot = combatTeam.slots.find(teamSlot => teamSlot.palId === null);
const concreteSlot = combatTeam.slots.find(teamSlot => teamSlot.palId !== null);
const card = renderTeamCard(combatTeam, 'combat');

assert.match(renderTeamSlot(optionalSlot, 'combat'), /\?/);
assert.match(renderTeamSlot(optionalSlot, 'combat'), /variab|flex|situativ/i);
assert.match(renderTeamSlot(optionalSlot, 'combat'), /Kontext|Optionen|Grund/i);
assert.match(renderTeamSlot(concreteSlot, 'combat'), /Foxparks/);
assert.match(renderTeamSlot(concreteSlot, 'combat'), /Rolle|role/i);
assert.match(renderTeamSlot({ palId: 'not-in-pals', role: 'counter', reason: 'Testslot' }), /Unbekannter Pal/);
assert.match(renderTeamSlot({ palId: 'not-in-pals', role: 'counter', reason: 'Testslot' }), /not-in-pals/);
assert.match(
  renderTeamSlot({ palId: null, role: 'counter', reason: 'Testslot', alternativePalIds: ['not-in-pals'] }),
  /Unbekannte Pal-ID: not-in-pals/
);

assert.match(card, /Level 1–10/);
assert.match(card, /Zweck|Purpose|Standard/);
assert.match(card, /Kombination|Zusammenstellung|Begründung/i);
assert.match(card, /Zugang|Freischaltung/i);
assert.match(card, /Wechseln|Wechselkriterium/i);
assert.match(card, /Rolle|role/i);
assert.doesNotMatch(card, /team-source-badge|META_VERSION|2026-08-27/);
assert.doesNotMatch(card, /href="https?:\/\//);
assert.match(card, /team-slot-role/);
assert.match(card, /team-slot-type/);
assert.doesNotMatch(
  renderTeamCard({
    ...combatTeam,
    sourceIds: ['not-a-source-id'],
    sources: undefined,
  }, 'combat'),
  /not-a-source-id/
);

console.log('team renderer: ok');
