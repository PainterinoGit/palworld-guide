import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const resources = read('../data/resources.js');
const app = read('../js/app.js');
const html = read('../index.html');

assert.match(resources, /const RESOURCE_CATALOG\s*=\s*\[/);
for (const resource of ['Holz', 'Stein', 'Fasern', 'Paldium', 'Erz', 'Kohle', 'Schwefel', 'Reiner Quarz', 'Rohöl', 'Hexolith', 'Chromit']) {
  assert.match(resources, new RegExp(`name: '${resource}'`), `${resource} muss im Rohstoffkatalog enthalten sein`);
}
assert.match(app, /resourceCatalog|RESOURCE_CATALOG/);
assert.match(html, /id="resourceCatalog"/);
assert.match(html, /resource-table/);
assert.match(html, /id="resourceDetailTooltip"/);

console.log('resource catalog contract: ok');
