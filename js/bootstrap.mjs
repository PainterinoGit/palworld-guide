import { PALS } from '../data/pals.mjs';
import { META_SOURCES } from '../data/meta-sources.mjs';
import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { BASE_PLANS } from '../data/base-plans.mjs';
import { BREEDING_ROUTES } from '../data/breeding.mjs';
import { PATCH_NOTES } from '../data/patchnotes.mjs';
import { BREEDING_INDEX } from './breeding-data.mjs';
import { createBreedingCalculator } from './breeding-calculator.mjs';
import {
  applyGuidePalData,
  buildPalDatabase,
  getPalDetails,
  matchesPalGoal,
  resolvePalEntry,
  resolvePalImageName,
} from './pal-data-adapter.mjs';
import './guide-ui.mjs';
import './base-planner.mjs';

window.GuideData = {
  PALS,
  META_SOURCES,
  LEVEL_BANDS,
  TEAMS,
  GUIDE_STEPS,
  applyGuidePalData,
  buildPalDatabase,
  getPalDetails,
  matchesPalGoal,
  resolvePalEntry,
  resolvePalImageName,
  BASE_PLANS,
  BREEDING_ROUTES,
  PATCH_NOTES,
};

let breedingCalculator;

window.initBreedingCalculator = () => {
  if (breedingCalculator) return breedingCalculator;
  const hosts = {
    targetHost: document.getElementById('breedingTargetHost'),
    parentHost: document.getElementById('breedingParentHost'),
    resultsHost: document.getElementById('breedingResultsHost'),
  };
  if (!hosts.targetHost || !hosts.parentHost || !hosts.resultsHost) return null;
  const roster = Array.isArray(window.FULL_PAL_ROSTER) && window.FULL_PAL_ROSTER.length
    ? window.FULL_PAL_ROSTER
    : PALS;
  breedingCalculator = createBreedingCalculator({
    index: BREEDING_INDEX,
    roster,
    hosts,
    sourceCatalog: META_SOURCES,
  });
  return breedingCalculator;
};

const appScript = document.createElement('script');
appScript.src = 'js/app.js';
document.body.appendChild(appScript);
window.initBasePlanner?.();
window.initBreedingCalculator();
