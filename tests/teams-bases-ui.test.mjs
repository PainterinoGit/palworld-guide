import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
assert.match(html, /Baue einen stabilen Kern und tausche nur einzelne Slots aus/);
assert.match(html, /id="teamProgressHost"/);

const teamProgressDesktopRule = css.match(/\.team-progress\s*\{([^}]*)\}/)?.[1] ?? '';
assert.match(teamProgressDesktopRule, /display\s*:\s*grid/);
assert.match(teamProgressDesktopRule, /grid-template-columns\s*:\s*repeat\(3\s*,\s*minmax\(0\s*,\s*1fr\)/);

const teamProgressMobileRule = css.match(/@media\s*\(max-width:\s*900px\)\s*\{[\s\S]*?\.team-progress\s*\{([^}]*)\}/)?.[1] ?? '';
assert.match(teamProgressMobileRule, /grid-template-columns\s*:\s*1fr/);

assert.match(
  html,
  /<section\s+class="base-planner-section"[\s\S]*id="basePlanHost"[\s\S]*base-plan-legend[\s\S]*base-plan-food-note[\s\S]*base-plan-disclaimer[\s\S]*<\/section>/
);
