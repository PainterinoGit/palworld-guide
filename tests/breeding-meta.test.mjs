import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BREEDING_ROUTES } from '../data/breeding.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const breedingText = BREEDING_ROUTES.flatMap(route => route.steps.map(step => `${step.parents} ${step.result} ${step.reason} ${step.access}`)).join(' ');

assert.ok(BREEDING_ROUTES.length >= 3, 'es gibt mehrere zeitlich gestaffelte Zucht-Routen');
assert.ok(BREEDING_ROUTES.length >= 5, 'die Kurzliste deckt die wichtigsten Meta-Bereiche ab');
assert.ok(BREEDING_ROUTES.some(route => /Base/i.test(route.phase)), 'Base-Zucht ist separat erklärt');
assert.ok(BREEDING_ROUTES.some(route => /Support/i.test(route.title)), 'Breeding-Support ist separat erklärt');
const currentRoutes = BREEDING_ROUTES.filter(route => /1\.0|aktuell|Utility|World Tree/i.test(`${route.phase} ${route.title}`));
assert.ok(currentRoutes.some(route => route.steps.some(step => /Yakumo/i.test(`${step.parents} ${step.result}`))), 'aktuelle Yakumo-Kombos müssen enthalten sein');
assert.ok(currentRoutes.some(route => route.steps.some(step => /Suzaku|Azurobe|Kitsun|Palumba/i.test(`${step.result}`))), 'aktuelle Utility-Kombos müssen enthalten sein');
assert.match(html, /deterministisch|vorhersehbar/i, 'der Guide muss die deterministische Art-Vererbung erklären');
assert.match(html, /Special Cake.*(?:vier|4)|(?:vier|4).*Special Cake/i, 'der Guide muss Special Cake bei der Passive-Vererbung einordnen');
assert.match(breedingText, /Katress.*Wixen|Wixen.*Katress/i, 'der Guide muss geschlechtsabhängige Sonderkombos nennen');
assert.doesNotMatch(html, /4 gleichzeitig ~10%|30% Vater, 30% Mutter, 40%/i, 'unbelegte alte Vererbungsquoten dürfen nicht mehr im Guide stehen');
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
