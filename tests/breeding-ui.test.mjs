import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = readFileSync(new URL('../js/bootstrap.mjs', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');

assert.match(html, /switchTab\('breeding'\)/);
assert.match(html, /id="breedingTargetHost"/);
assert.match(html, /id="breedingParentHost"/);
assert.match(html, /id="breedingResultsHost"/);
assert.match(bootstrap, /breeding-calculator/);
assert.match(css, /\.breeding-calculator/);
