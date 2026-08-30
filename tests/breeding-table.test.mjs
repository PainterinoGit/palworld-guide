import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as breedingCalculator from '../js/breeding-calculator.mjs';
import { buildBreedingIndex } from '../js/breeding-data.mjs';

const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const app = read('../js/app.js');
const html = read('../index.html');
const css = read('../css/style.css');

test('renders at most two accessible parent-pair icon buttons and qualifies extra relationships', () => {
  const index = buildBreedingIndex([
    { id: 'first', child: 'Target', parents: ['Alpha', 'Beta'], status: 'verified', phase: 'mid', note: '', sources: [] },
    { id: 'second', child: 'Target', parents: ['Gamma', 'Delta'], status: 'special-case', phase: 'late', note: '', sources: [] },
    { id: 'third', child: 'Target', parents: ['Epsilon', 'Zeta'], status: 'incomplete', phase: 'late', note: '', sources: [] },
  ]);

  const markup = breedingCalculator.renderBreedingCell('Target', index, [
    { name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }, { name: 'Delta' },
  ]);

  assert.equal((markup.match(/<button\b/g) ?? []).length, 2);
  assert.match(markup, /title="Alpha \+ Beta/);
  assert.match(markup, /aria-label="Zuchtziel Target: Eltern Alpha \+ Beta/);
  assert.match(markup, /onclick="openBreedingTarget\(&quot;Target&quot;\)"/);
  assert.match(markup, /breeding-pal-fallback/);
  assert.match(markup, />\+1</);
  assert.match(markup, /title="Sonderfall"[^>]*>S<\/span>/);
});

test('wires the Pal table, breeding target action, and compact cell styling', () => {
  assert.match(app, /window\.renderBreedingCell\?\.\(e\.name, window\.BREEDING_INDEX, Object\.values\(PAL_DB\)\)/);
  assert.match(app, /<td class="pal-breeding-cell">\$\{breedingHtml\}<\/td>/);
  assert.match(app, /function openBreedingTarget\(childName\)/);
  assert.match(html, /<th>Zucht<\/th>/);
  assert.match(css, /\.pal-breeding/);
});
