import assert from 'node:assert/strict';
import { BREEDING_ROUTES } from '../data/breeding.mjs';

assert.ok(BREEDING_ROUTES.length >= 3, 'es gibt mehrere zeitlich gestaffelte Zucht-Routen');
assert.ok(BREEDING_ROUTES.length >= 5, 'die Kurzliste deckt die wichtigsten Meta-Bereiche ab');
assert.ok(BREEDING_ROUTES.some(route => /Base/i.test(route.phase)), 'Base-Zucht ist separat erklärt');
assert.ok(BREEDING_ROUTES.some(route => /Support/i.test(route.title)), 'Breeding-Support ist separat erklärt');
assert.ok(BREEDING_ROUTES.some(route => route.steps.some(step => /optional|Spezial|nicht garantiert/i.test(`${step.reason} ${step.access}`))), 'optionale und nicht garantierte Projekte sind gekennzeichnet');
for (const route of BREEDING_ROUTES) {
  assert.ok(route.id && route.phase && route.title && route.steps.length, 'jede Route ist vollständig beschrieben');
  for (const step of route.steps) {
    assert.ok(step.order && step.parents && step.result && step.reason, 'jeder Zuchtschritt erklärt Eltern, Ergebnis und Zweck');
    assert.ok(step.access && step.sources.length, 'jeder Zuchtschritt nennt Zugang und Quellen');
    assert.ok(step.priority && step.kind, 'jeder Zuchtschritt besitzt Priorität und Routentyp');
  }
}

console.log('breeding meta contract: ok');
