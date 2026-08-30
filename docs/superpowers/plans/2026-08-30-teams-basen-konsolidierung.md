# Teams & Basen Konsolidierung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den bisherigen Teams- und Base-Planer-Bereich zu einem kompakten Reiter „Teams & Basen“ mit drei Teamphasen und integriertem Base-Planer umbauen.

**Architecture:** Die bestehenden Team- und Base-Datenmodule bleiben getrennt. Ein neues Präsentationsmodell gruppiert die sechs vorhandenen Levelbands in Start, Midgame und Endgame; die UI rendert pro Phase nur den Kampf-Kern und wenige Wechseloptionen. Der Base-Planer behält seine Daten- und Renderlogik und erhält lediglich einen Host im gemeinsamen Tab.

**Tech Stack:** Statisches HTML, CSS, browserseitiges JavaScript/ES-Module, Node.js `node:test`-Regressionstests.

**Spec:** `docs/superpowers/specs/2026-08-30-teams-basen-konsolidierung-design.md`

## Global Constraints

- Der bisherige Reiter „Teams & Base-Worker“ wird zu **„Teams & Basen“**.
- Der separate Top-Level-Reiter „Base-Planer“ entfällt.
- Es werden drei sichtbare Teamphasen dargestellt: **Start**, **Midgame**, **Endgame**.
- Pro Phase werden ein Kampfteam mit fünf Slots, höchstens zwei Wechseloptionen und eine kurze Wechselregel gezeigt.
- Die bestehenden sechs Levelbands, Teamdaten, Base-Plan-Daten und Quellen bleiben als Rohdaten erhalten.
- Base-Worker werden nicht zusätzlich als eigenständige Teamkarten dupliziert.
- Der vollständige Base-Planer bleibt nach der Migration bedienbar.
- Keine neuen Kampfteam-Empfehlungen, keine Änderung der Base-Planer-Daten und keine Nutzerprofile.
- Jede Produktionsänderung folgt zuerst einem roten Test, danach minimaler Implementierung und anschließendem vollständigem Testlauf.

---

### Task 1: Präsentationsmodell für drei Teamphasen

**Files:**
- Create: `js/team-progression.mjs`
- Test: `tests/team-progression.test.mjs`

**Interfaces:**
- Consumes: `window.GuideData.TEAMS`-kompatible Teamobjekte mit `levelBandId` und `kind`.
- Produces: `TEAM_PHASES` und `buildTeamPhaseView(teams)`.
- `buildTeamPhaseView(teams)` returns an array of exactly three objects with `{ id, label, levelBandIds, combat, swaps, switchWhen }`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { buildTeamPhaseView } from '../js/team-progression.mjs';
import { TEAMS } from '../data/teams.mjs';

const phases = buildTeamPhaseView(TEAMS);
assert.deepEqual(phases.map(phase => phase.id), ['start', 'midgame', 'endgame']);
assert.deepEqual(phases.map(phase => phase.levelBandIds), [
  ['1-10', '10-20'],
  ['20-30', '30-40'],
  ['40-50', '50-plus']
]);
assert.ok(phases.every(phase => phase.combat?.kind === 'combat'));
assert.ok(phases.every(phase => phase.combat.slots.length === 5));
assert.ok(phases.every(phase => phase.swaps.length <= 2));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team-progression.test.mjs`

Expected: FAIL because `js/team-progression.mjs` and `buildTeamPhaseView` do not exist.

- [ ] **Step 3: Write minimal implementation**

Implement `TEAM_PHASES` with the three exact level-band groups. For each phase, filter the input to the first `kind === 'combat'` team in the phase's band order, select `kind === 'special'` entries as candidates, and expose at most the first two as `swaps`. Use the combat team's existing `switchWhen`, `combinationReason`, `slots`, `sources`, and `title` without mutating the input array.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team-progression.test.mjs`

Expected: PASS with exactly three phases and five combat slots per phase.

- [ ] **Step 5: Commit**

```bash
git add js/team-progression.mjs tests/team-progression.test.mjs
git commit -m "feat: add compact team progression model"
```

### Task 2: Gemeinsamen Top-Level-Tab herstellen

**Files:**
- Modify: `index.html:40-57, 88-103, 833-840`
- Test: `tests/final-fix-regression.test.mjs`

**Interfaces:**
- Consumes: existing `switchTab`, `team` content host, and `basePlanHost`/`basePlanControls` IDs.
- Produces: one reachable top-level `teams` tab containing team and Base-Planer sections; no top-level `base-planner` tab button or container.

- [ ] **Step 1: Write the failing test**

Add assertions to the existing navigation regression test:

```js
assert.match(html, /switchTab\('teams'\).*Teams &amp; Basen/s);
assert.doesNotMatch(html, /switchTab\('base-planner'\)/);
assert.match(html, /id="teams"[\s\S]*id="basePlanControls"/);
assert.match(html, /id="teams"[\s\S]*id="basePlanHost"/);
assert.doesNotMatch(html, /<div id="base-planner" class="tab-content">/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/final-fix-regression.test.mjs`

Expected: FAIL because the current navigation still contains `Base-Planer` and its own top-level container.

- [ ] **Step 3: Write minimal implementation**

Rename the navigation button and move the existing Base-Planer hero, controls, host, legend, food note, and disclaimer below the new team-progress host inside `#teams`. Remove only the separate `#base-planner` wrapper and its top-level button. Change the footer link to `switchTab('teams')` with label `Teams & Basen`. Keep `basePlanControls` and `basePlanHost` IDs unchanged so `base-planner.mjs` continues to work.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/final-fix-regression.test.mjs`

Expected: PASS with a single shared tab and preserved Base-Planer hosts.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/final-fix-regression.test.mjs
git commit -m "feat: merge base planner into teams tab"
```

### Task 3: Kompakten Team-Fortschritt rendern

**Files:**
- Modify: `js/guide-ui.mjs:1-170`
- Modify: `index.html` team section around the existing `levelTeamGuide` markup
- Test: `tests/guide-ui.test.mjs`

**Interfaces:**
- Consumes: `buildTeamPhaseView(TEAMS)`, existing `renderTeamCard`/team renderer helpers, and the new `#teamProgressHost` element.
- Produces: `renderCompactTeamProgress({ phases, host })`, which writes one compact phase card per phase and no Base-Worker team cards.

- [ ] **Step 1: Write the failing test**

Create a renderer contract test that loads the module source and checks the required output contract:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ui = readFileSync(new URL('../js/guide-ui.mjs', import.meta.url), 'utf8');
assert.match(ui, /renderCompactTeamProgress/);
assert.match(ui, /teamProgressHost/);
assert.match(ui, /Start/);
assert.match(ui, /Midgame/);
assert.match(ui, /Endgame/);
assert.match(ui, /swaps/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/guide-ui.test.mjs`

Expected: FAIL because the compact renderer and host do not exist.

- [ ] **Step 3: Write minimal implementation**

Add `teamProgressHost` to `index.html`. In `guide-ui.mjs`, import `buildTeamPhaseView`, build the three phases once, and render a compact section containing phase label, combat team title, five slots via the existing team-card/slot rendering path, one short combination reason, one `Wann wechseln?` line, and up to two swap labels. Remove the old six-band timeline, level summary, full roaming cards, full base cards, and special-team grid from the visible render path. Keep the existing progress roadmap state and links intact where they do not duplicate team cards.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/guide-ui.test.mjs tests/team-renderer.test.mjs tests/team-data.test.mjs`

Expected: PASS; the compact renderer contract and existing team data/renderer contracts remain valid.

- [ ] **Step 5: Commit**

```bash
git add js/guide-ui.mjs index.html tests/guide-ui.test.mjs
git commit -m "feat: render compact three-phase team path"
```

### Task 4: Base-Planer-Initialisierung im gemeinsamen Tab stabilisieren

**Files:**
- Modify: `js/base-planner.mjs:65-85`
- Modify: `js/app.js:1-25, 170-210`
- Test: `tests/base-planner.test.mjs`

**Interfaces:**
- Consumes: unchanged `renderBasePlan({ plan, host })`, `basePlanControls`, `basePlanHost`, and `switchTab`.
- Produces: idempotent initialization that renders the Base-Planer when `teams` becomes active and does not require a `base-planner` tab.

- [ ] **Step 1: Write the failing test**

Extend the Base-Planer contract:

```js
const app = read('../js/app.js');
const planner = read('../js/base-planner.mjs');
assert.match(app, /basePlanHost/);
assert.match(app, /teams/);
assert.match(planner, /function initBasePlanner/);
assert.match(planner, /basePlanControls/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/base-planner.test.mjs`

Expected: FAIL because initialization is currently tied to the old top-level container lifecycle.

- [ ] **Step 3: Write minimal implementation**

Extract or expose `initBasePlanner()` in `base-planner.mjs`; guard it with a data attribute so repeated tab switches do not duplicate controls. Call it during the existing bootstrap and when the shared `teams` tab becomes active. Preserve the current base-count selection and `renderBasePlan` behavior.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/base-planner.test.mjs`

Expected: PASS with stable Base-Planer hosts and no duplicate initialization.

- [ ] **Step 5: Commit**

```bash
git add js/base-planner.mjs js/app.js tests/base-planner.test.mjs
git commit -m "refactor: initialize base planner inside shared tab"
```

### Task 5: Text- und Layoutreduktion für Teams & Basen

**Files:**
- Modify: `css/style.css:1605-1626, 2297-2364`
- Modify: `index.html` compact team/base headings and copy
- Test: `tests/teams-bases-ui.test.mjs`

**Interfaces:**
- Consumes: the new compact team markup classes and existing Base-Planer classes.
- Produces: readable three-phase cards, clear section hierarchy, and mobile-safe layout without changing data behavior.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
assert.match(html, /Baue einen stabilen Kern und tausche nur einzelne Slots aus/);
assert.match(html, /id="teamProgressHost"/);
assert.match(css, /team-progress/);
assert.match(css, /@media[^{]+\{[\s\S]*team-progress/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/teams-bases-ui.test.mjs`

Expected: FAIL because the new compact copy and layout selectors are not present.

- [ ] **Step 3: Write minimal implementation**

Add the short shared introduction, phase-card styles, swap styles, and a clear Base-Planer section heading. Use a three-column layout on wide screens and one column below the existing mobile breakpoint. Keep Base-Planer controls and tables readable; do not nest a horizontally scrolling table inside another horizontal scroller.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/teams-bases-ui.test.mjs`

Expected: PASS with the new copy and responsive selectors.

- [ ] **Step 5: Commit**

```bash
git add css/style.css index.html tests/teams-bases-ui.test.mjs
git commit -m "style: simplify teams and bases presentation"
```

### Task 6: Gesamtregression und Übergabeprüfung

**Files:**
- Modify: none planned; integration corrections belong in the task that exposes the regression
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: all completed shared-tab, progression, renderer, planner, and style contracts.
- Produces: verified working tree with no stale top-level Base-Planer references and all existing functionality passing.

- [ ] **Step 1: Run the complete test suite**

Run: `node --test tests/*.test.mjs`

Expected: all existing and new tests PASS.

- [ ] **Step 2: Search for stale navigation references**

Run: `rg -n "switchTab\('base-planner'\)|Teams &amp; Base-Worker|id=\"base-planner\"" index.html js tests`

Expected: no stale top-level navigation/container references; internal data names may remain only where they describe the Base-Planer feature.

- [ ] **Step 3: Check the final diff**

Run: `git diff --check; git status --short`

Expected: no whitespace errors and only files belonging to this feature are changed.

- [ ] **Step 4: Commit any final integration correction**

```bash
git add index.html js data css tests
git commit -m "test: verify teams and bases consolidation"
```
