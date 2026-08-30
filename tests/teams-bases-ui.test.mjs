import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
assert.match(html, /Baue einen stabilen Kern und tausche nur einzelne Slots aus/);
assert.match(html, /id="teamProgressHost"/);
assert.match(css, /team-progress/);
assert.match(css, /@media[^\{]+\{[\s\S]*team-progress/);
