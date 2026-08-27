import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../js/guide-ui.mjs', import.meta.url), 'utf8');

assert.match(source, /attachTeamSlotDetails\(host, specialHost\)/);
assert.match(source, /specialHost\.querySelectorAll\('\.team-slot\[data-pal-id\]'\)/);
assert.match(source, /slot\.setAttribute\('aria-describedby', 'chipTooltip'\)/);
assert.match(source, /show\(event\)/);

console.log('team hover contract: ok');
