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
const jobEntryCounts = [...data.matchAll(/entries:\s*\[([\s\S]*?)\]\s*\}/g)]
  .map(match => (match[1].match(/\{ pal:/g) || []).length);
assert.equal(jobEntryCounts.length, 10, 'alle Jobs müssen eine eigene Top-10-Liste haben');
assert.ok(jobEntryCounts.every(count => count >= 10), 'jeder Job muss mindestens zehn gerankte Pals enthalten');
assert.match(app, /function renderJobTierlist\s*\(/);
assert.match(app, /rankedEntries/);
assert.match(app, /function switchPalPanel\s*\(/);
assert.match(app, /FULL_PAL_ROSTER/);
assert.match(html, /id="jobTierlistPanel"/);
assert.match(html, /id="jobTierlistBody"/);
assert.match(html, /data-pal-panel="jobTierlistPanel"/);
assert.match(html, /Top 10 Pals je Job/);
assert.match(data, /palmods-base-1-0/);
assert.match(data, /genshinlab-base-1-0-3/);
assert.match(html, /palmods\.gg\/blog\/palworld-1-0-best-base-pals/);

console.log('job tierlist contract: ok');
