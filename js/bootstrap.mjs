import { PALS } from '../data/pals.mjs';
import { LEVEL_BANDS, TEAMS } from '../data/teams.mjs';
import { GUIDE_STEPS } from '../data/guide.mjs';
import { initLevelTeams } from './guide-ui.mjs';

window.GuideData = { PALS, LEVEL_BANDS, TEAMS, GUIDE_STEPS };
initLevelTeams();

const appScript = document.createElement('script');
appScript.src = 'js/app.js';
document.body.appendChild(appScript);
