import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderCompactTeamProgress } from '../js/guide-ui.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const slots = Array.from({ length: 5 }, (_, index) => ({
  palId: null,
  role: `Rolle ${index + 1}`,
  reason: `Grund ${index + 1}`,
  alternativePalIds: [],
}));
const phases = ['Start', 'Midgame', 'Endgame', 'Nicht sichtbar'].map((label, index) => ({
  id: label.toLowerCase().replaceAll(' ', '-'),
  label,
  combat: {
    title: `${label}-Team`,
    combinationReason: `${label}-Begründung.`,
    slots,
  },
  switchWhen: `${label}-Wechsel.`,
  swaps: Array.from({ length: index === 0 ? 3 : 1 }, (_, swapIndex) => ({
    title: `${label}-Swap ${swapIndex + 1}`,
    switchWhen: 'Bei Bedarf wechseln.',
  })),
}));
const host = {
  innerHTML: '',
  querySelectorAll: () => [],
};
const originalDocument = globalThis.document;

globalThis.document = { getElementById: () => null };
try {
  renderCompactTeamProgress({ phases, host });
} finally {
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}

const phaseCards = host.innerHTML.match(/<article class="team-card compact-team-phase"[\s\S]*?<\/article>/g) || [];

assert.equal(phaseCards.length, 3, 'only the three compact phases are rendered');
assert.deepEqual(
  phaseCards.map(card => card.match(/KAMPFTEAM · ([^<]+)/)?.[1]),
  ['Start', 'Midgame', 'Endgame']
);
assert.equal((host.innerHTML.match(/class="team-slot(?: |")/g) || []).length, 15, 'three five-slot teams render');
assert.equal((host.innerHTML.match(/Wann wechseln\?/g) || []).length, 3, 'each phase has a switch line');
for (const card of phaseCards) {
  assert.ok((card.match(/<li>/g) || []).length <= 2, 'each phase has at most two swap options');
}
assert.match(html, /id="teamProgressHost"/);

console.log('guide ui: compact team progress renders');
