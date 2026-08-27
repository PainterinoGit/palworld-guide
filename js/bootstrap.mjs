import { PALS } from '../data/pals.mjs';
import { META_SOURCES } from '../data/meta-sources.mjs';
import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import {
  applyGuidePalData,
  buildPalDatabase,
  getPalDetails,
  matchesPalGoal,
  resolvePalEntry,
  resolvePalImageName,
} from './pal-data-adapter.mjs';
import './guide-ui.mjs';

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
};

const appScript = document.createElement('script');
appScript.src = 'js/app.js';
document.body.appendChild(appScript);
