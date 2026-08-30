import { PALS } from '../data/pals.mjs';
import { META_SOURCES } from '../data/meta-sources.mjs';
import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { BASE_PLANS } from '../data/base-plans.mjs';
import { BREEDING_ROUTES } from '../data/breeding.mjs';
import { PATCH_NOTES } from '../data/patchnotes.mjs';
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

const appScript = document.createElement('script');
appScript.src = 'js/app.js';
document.body.appendChild(appScript);
window.initBasePlanner?.();
