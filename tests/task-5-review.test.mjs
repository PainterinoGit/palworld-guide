import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

for (const [id, label] of [
  ['palSearchInput', 'Pal-Suche'],
  ['palTypeFilter', 'Pal-Typ-Filter'],
  ['palSortSelect', 'Pal-Sortierung'],
]) {
  const labelPattern = new RegExp(`<label\\b[^>]*for=["']${id}["'][^>]*>[\\s\\S]*?</label>`, 'i');
  const ariaPattern = new RegExp(`<(?:input|select)\\b[^>]*id=["']${id}["'][^>]*aria-label=["'][^"']+["']`, 'i');
  assert.ok(labelPattern.test(html) || ariaPattern.test(html), `${label} muss beschriftet sein`);
}

const viewport = html.match(/<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["'][^>]*>/i)?.[1] || '';
assert.doesNotMatch(viewport, /maximum-scale\\s*=\\s*1/i, 'Viewport darf den maximalen Zoom nicht beschränken');
assert.doesNotMatch(viewport, /user-scalable\\s*=\\s*no/i, 'Viewport darf Mobile-Zoom nicht deaktivieren');

console.log('task 5 review contract: ok');
