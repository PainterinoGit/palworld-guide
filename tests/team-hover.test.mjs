import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../js/guide-ui.mjs', import.meta.url), 'utf8');
const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(source, /attachTeamSlotDetails\(host, specialHost\)/);
assert.match(source, /specialHost\.querySelectorAll\('\.team-slot\[data-pal-id\]'\)/);
assert.match(source, /slot\.setAttribute\('aria-describedby', 'chipTooltip'\)/);
assert.match(source, /show\(event\)/);
assert.match(app, /pal-capture-map/);
assert.match(app, /captureMapPreview/);
assert.doesNotMatch(css, /\.pals-master-table\s*\{\s*min-width:\s*1460px/);
assert.match(css, /\.pal-capture-map/);
assert.match(css, /\.pal-capture-tooltip\s*\{[^}]*width:min\(980px/i);
assert.match(css, /\.pal-capture-map\s*\{[^}]*min-height:420px/i);
assert.doesNotMatch(html, /<th>Quellenstatus<\/th>/i);
assert.doesNotMatch(app, /<td>\$\{palSourceStatusHtml\(e\)\}<\/td>/);

console.log('team hover contract: ok');
