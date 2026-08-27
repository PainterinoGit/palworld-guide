import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const resources = read('../data/resources.js');
const app = read('../js/app.js');
const html = read('../index.html');

assert.match(resources, /const RESOURCE_CATALOG\s*=\s*\[/);
assert.match(resources, /window\.RESOURCE_CATALOG\s*=\s*RESOURCE_CATALOG/);
for (const resource of ['Holz', 'Hartholz', 'Stein', 'Fasern', 'Paldium', 'Erz', 'Kohle', 'Schwefel', 'Reiner Quarz', 'Rohöl', 'Leder', 'Ancient Civilization Core', 'Ancient Civilization Part', 'Dog Coin', 'Pal-Metallbarren', 'Plasteel', 'Carbon Fiber', 'Polymer', 'Circuit Board', 'Hochwertiger Stoff', 'Nightstar Sand', 'Dark Fragment', 'Soralit', 'Paloxit', 'World Tree Holy Water', 'Hexolith', 'Chromit']) {
  assert.match(resources, new RegExp(`name: '${resource}'`), `${resource} muss im Rohstoffkatalog enthalten sein`);
}
assert.match(app, /resourceCatalog|RESOURCE_CATALOG/);
assert.match(app, /window\.RESOURCE_CATALOG/);
assert.match(html, /id="resourceCatalog"/);
assert.match(html, /resource-table/);
assert.match(html, /id="resourceDetailTooltip"/);
assert.match(resources, /resource: 'Hartholz'/);
assert.match(resources, /name: 'Leder'.*Händler|name: 'Leder'.*Leder-Drop/i, 'Leder muss eine konkrete Beschaffungsmethode nennen');
assert.match(resources, /name: 'Ancient Civilization Core'.*Raid|name: 'Ancient Civilization Core'.*Recycler/i, 'Ancient Civilization Core muss eine konkrete Farmmethode nennen');
assert.match(resources, /name: 'Nightstar Sand'.*Nacht|name: 'Nightstar Sand'.*Feybreak/i, 'Nightstar Sand muss die Nachtfarm nennen');
assert.match(resources, /name: 'Chromit'.*Metal Detector|name: 'Chromit'.*Smokie/i, 'Chromit muss Werkzeug oder Smokie als Farmmethode nennen');

console.log('resource catalog contract: ok');
