import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
const data = read('../data/job-tierlist.js');
const app = read('../js/app.js');
const html = read('../index.html');

assert.match(data, /const JOB_TIERLIST\s*=\s*\[/);
for (const job of ['Mining', 'Transport', 'Lumbering', 'Kindling', 'Planting', 'Watering', 'Electricity', 'Handiwork', 'Medicine', 'Cooling']) {
  assert.match(data, new RegExp(`job: '${job}'`), `${job} braucht eine eigene Tierlist`);
}
assert.match(data, /metaScore:/);
assert.match(data, /speed:/);
assert.match(data, /size:/);
assert.match(data, /community:/);
assert.match(app, /function renderJobTierlist\s*\(/);
assert.match(app, /function switchPalPanel\s*\(/);
assert.match(app, /FULL_PAL_ROSTER/);
assert.match(html, /id="jobTierlistPanel"/);
assert.match(html, /id="jobTierlistBody"/);
assert.match(html, /data-pal-panel="jobTierlistPanel"/);

console.log('job tierlist contract: ok');
