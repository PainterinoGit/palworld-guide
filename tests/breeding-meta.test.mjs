import assert from 'node:assert/strict';
import { BREEDING_ROUTES } from '../data/breeding.mjs';

assert.ok(BREEDING_ROUTES.length >= 3, 'es gibt mehrere zeitlich gestaffelte Zucht-Routen');
for (const route of BREEDING_ROUTES) {
  assert.ok(route.id && route.phase && route.title && route.steps.length, 'jede Route ist vollständig beschrieben');
  for (const step of route.steps) {
    assert.ok(step.order && step.parents && step.result && step.reason, 'jeder Zuchtschritt erklärt Eltern, Ergebnis und Zweck');
    assert.ok(step.access && step.sources.length, 'jeder Zuchtschritt nennt Zugang und Quellen');
  }
}

console.log('breeding meta contract: ok');
