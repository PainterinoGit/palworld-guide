import assert from 'node:assert/strict';
import { renderGuideStep } from '../js/guide-renderer.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';

const firstStep = renderGuideStep(GUIDE_STEPS[0]);
assert.match(firstStep, /Erste Base stabil aufbauen/);
assert.match(firstStep, /Vorbereitung/);
assert.match(firstStep, /Erfolgskriterium/);
assert.match(firstStep, /Startbase/);
assert.match(firstStep, /data-target-location="plateau-nord"/);

console.log('guide renderer: ok');
