import assert from 'node:assert/strict';
import { renderTeamSlot, renderTeamCard } from '../js/team-renderer.mjs';
import { TEAMS } from '../data/teams.mjs';

const combatTeam = TEAMS.find(team => team.id === '10-20-combat');
const optionalSlot = combatTeam.slots.find(slot => slot.optional);
const concreteSlot = combatTeam.slots.find(slot => !slot.optional);

assert.match(renderTeamSlot(optionalSlot, 'combat'), /\?/);
assert.match(renderTeamSlot(optionalSlot, 'combat'), /variab/i);
assert.match(renderTeamSlot(concreteSlot, 'combat'), /Cattiva|Foxparks|Rushoar|Eikthyrdeer/);
assert.match(renderTeamSlot(concreteSlot, 'combat'), /role|Rolle/i);

const card = renderTeamCard(combatTeam, 'combat');
assert.match(card, /Level 10–20/);
assert.match(card, /Standard-Kampfteam/);
assert.match(card, /Team-Slots|Slots/);
assert.match(card, /Alternativen|Alternative/);

console.log('team renderer: ok');
