import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /Pal Essence Condenser[\s\S]{0,500}Upgrade-Guide/i, 'Handbuch enthält einen eigenen Condenser-Guide');
assert.match(html, /0→1★[\s\S]{0,160}4 Duplikate/i, 'Guide nennt die Kosten bis 1 Stern');
assert.match(html, /3→4★[\s\S]{0,160}24 Duplikate/i, 'Guide nennt die Kosten bis 4 Sterne');
assert.match(html, /Chikipi|Mozzarina|Beegarde/, 'Guide nennt konkrete Ranch-Prioritäten');
assert.match(html, /Passives.*Zucht|Zucht.*Passives/i, 'Guide schützt fertige Zuchtlinien');
assert.match(html, /nicht.*verloren|unwiderruflich/i, 'Guide warnt vor unwiderruflichem Verbrauch');

console.log('handbook condensation guide: ok');
