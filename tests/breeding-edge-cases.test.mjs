import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const html = read('../index.html');
const calculatorSource = read('../js/breeding-calculator.mjs');

test('links the handbook primary calculator action to the local breeding tab', () => {
  assert.match(html, /Breeding-Rechner/);
  assert.match(html, /switchTab\('breeding'\)/);
  assert.doesNotMatch(
    html,
    /<a\b(?=[^>]*href=["'][^"']*palworld\.gg\/de\/breeding-calculator[^"']*["'])[^>]*>\s*(?:[^<]*Calculator[^<]*)<\/a>/i,
    'der primäre Handbook-Calculator darf nicht mehr auf den externen Rechner zeigen',
  );
});

test('declares explicit empty and qualified special-case render states', () => {
  assert.match(calculatorSource, /same-species/);
  assert.match(calculatorSource, /Keine bekannte Kombination/);
  assert.match(calculatorSource, /incomplete/);
  assert.doesNotMatch(calculatorSource, /guaranteed/i);
});
