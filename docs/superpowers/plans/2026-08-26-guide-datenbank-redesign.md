# Guide- und Datenbank-Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die bestehende Palworld-Seite wird zu einem levelbereichsbasierten, geführten Guide mit vollständigen Kampf-, Roaming- und Base-Teams sowie einer kontextbezogenen Pal-Datenbank.

**Architecture:** Die statischen Pal-, Team-, Levelbereich- und Standortdaten werden aus dem HTML in fokussierte JavaScript-Datenmodule verschoben. Eine zentrale Rendering-Schicht erzeugt Wegweiser, Teamkarten, Tooltips und Datenbank aus diesen Daten; die vorhandene Single-Page-Navigation bleibt zunächst erhalten, wird aber auf vier Hauptbereiche reduziert. Die Migration erfolgt in drei unabhängig prüfbaren Phasen: Datenfundament, Nutzerfluss/UI und Inhaltsbereinigung.

**Tech Stack:** Vanilla HTML, CSS und JavaScript; vorhandene statische Assets; `node --check` für JavaScript-Syntax; lokaler `python -m http.server` für Browser-Prüfungen.

**Spec:** `docs/superpowers/specs/2026-08-26-guide-datenbank-redesign-design.md`

## Global Constraints

- Der geführte Playthrough ist der Haupteinstieg.
- Levelbereiche sind die primäre Ordnung; Türme und Bosse sind Sonderfälle.
- Kampf, Roaming/Erkundung und Base werden als getrennte, vollständige Teams dargestellt.
- Ein variabler Teamplatz wird als `?` angezeigt; nicht benötigte Plätze als `—`.
- Desktop-Hover und Mobile-Tap zeigen denselben kontextbezogenen Pal-Detailstand.
- HTML dient nicht mehr als primäre Datenquelle.
- Serverseitige Benutzerkonten, Savegame-Analyse und ein freier Optimierungsalgorithmus gehören nicht zur ersten Umsetzung.

## File Structure

- Create `data/pals.js`: zentrale Pal-Entitäten und normalisierte Alias-/Bilddaten.
- Create `data/teams.js`: sechs Levelbereiche, vollständige Standardteams und Spezialteams.
- Create `data/guide.js`: Wegweiser-Ziele, Vorbereitung, Items, Orte und Abschlusskriterien.
- Create `data/index.mjs`: test-facing module boundary exporting the normalized collections.
- Modify `index.html`: vier Hauptbereiche und schlanke Rendering-Hosts statt mehrfacher manueller Teamkarten.
- Modify `js/app.js`: Daten-Rendering, Navigation, Fortschritt, Tooltips und Filter.
- Modify `css/style.css`: responsive Teamkarten, Tooltip-Positionierung, Fokuszustände und mobile Interaktion.
- Create `tests/guide-data.test.mjs`: Node-basierte Konsistenztests ohne zusätzliche Abhängigkeiten.
- Resolve `palworld-guide.html`: als veraltete Quelle markieren, auf die aktive Seite verweisen oder entfernen, nachdem keine Referenz mehr besteht.

---

### Task 1: Zentrale Datenverträge und Test-Grundlage

**Files:**
- Create: `data/pals.js`
- Create: `data/teams.js`
- Create: `data/guide.js`
- Create: `tests/guide-data.test.mjs`
- Modify: `index.html` script includes

**Interfaces:**
- `PALS`: Array von `{ id, name, image, types, availability, location, roles, workSuitability, partnerSkill, whyGood, alternatives, upgradeFrom, upgradeTo }`.
- `LEVEL_BANDS`: Array von `{ id, label, minLevel, maxLevel, summary }`.
- `TEAMS`: Array von `{ id, levelBandId, kind, title, purpose, slots, prerequisites, switchWhen }`.
- Jeder Slot ist `{ palId: string|null, role: string, reason: string, alternativePalIds: string[], optional: boolean }`.
- `GUIDE_STEPS`: Array von `{ id, levelBandId, goal, preparation, items, locationIds, completion, nextStepId }`.

- [ ] **Step 1: Write the failing data contract tests**

```js
import assert from 'node:assert/strict';
import { PALS, LEVEL_BANDS, TEAMS, GUIDE_STEPS } from '../data/index.mjs';

assert.equal(new Set(PALS.map(p => p.id)).size, PALS.length);
assert.deepEqual(LEVEL_BANDS.map(b => b.id), ['1-10', '10-20', '20-30', '30-40', '40-50', '50-plus']);
for (const team of TEAMS) {
  assert.ok(['combat', 'roaming', 'base', 'special'].includes(team.kind));
  assert.ok(team.slots.length > 0);
  for (const slot of team.slots) {
    assert.ok(slot.palId === null || PALS.some(p => p.id === slot.palId));
    assert.equal(typeof slot.reason, 'string');
  }
}
for (const step of GUIDE_STEPS) assert.ok(LEVEL_BANDS.some(b => b.id === step.levelBandId));
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tests/guide-data.test.mjs`
Expected: FAIL because the normalized modules do not exist yet.

- [ ] **Step 3: Add the shared module barrel**

Create `data/index.mjs` exporting the four data collections. Keep source files as browser-compatible scripts if required by the existing page, and provide the `.mjs` exports as the test-facing boundary.

- [ ] **Step 4: Populate the first complete vertical slice**

Add all six level-band records and at least one complete combat, roaming and base team per band. Use `palId: null` plus `optional: true` for a variable `?` slot; do not invent a Pal name for variable slots. Add the current guide's existing Pal records to `PALS` before adding new recommendations.

- [ ] **Step 5: Run the test to verify it passes**

Run: `node tests/guide-data.test.mjs`
Expected: PASS with no duplicate IDs, invalid references or missing team reasons.

- [ ] **Step 6: Commit**

```bash
git add data tests index.html
git commit -m "Add normalized guide and team data contracts"
```

### Task 2: Render complete level-based teams

**Files:**
- Modify: `index.html` team and guide section hosts
- Modify: `js/app.js` team rendering and team navigation
- Modify: `css/style.css` team-card styles

**Interfaces:**
- Produce `renderTeamCard(teamId, context)` returning a DOM node or HTML string with the team title, purpose, slot count, slots, alternatives, prerequisites and switch timing.
- Produce `renderTeamSlot(slot, context)` where `palId === null` renders an explained `?`, not a broken card.
- Produce `renderTeamsForLevelBand(levelBandId)` rendering one combat, one roaming and one base team before special teams.

- [ ] **Step 1: Add a failing DOM fixture test**

Extend `tests/guide-data.test.mjs` with assertions that every level band has exactly one `combat`, `roaming` and `base` team and that all non-optional slots have a Pal ID.

- [ ] **Step 2: Run the fixture test**

Run: `node tests/guide-data.test.mjs`
Expected: FAIL for any missing team category or invalid required slot.

- [ ] **Step 3: Replace duplicated team markup with rendering hosts**

Keep the existing section IDs used by navigation, but replace repeated static team-card blocks with containers addressed by level-band and team kind. Preserve existing handbook prose until the rendered cards are verified.

- [ ] **Step 4: Implement the three team renderers**

Render actual slot count from `team.slots.length`; render `?` for optional null slots; add a compact role label and the slot reason; add links/data attributes for each Pal; show alternatives collapsed below the main team.

- [ ] **Step 5: Add level-band selection and persistence**

Store the selected band under `palworld-level-band`. If no value exists, select `1-10`; if a stored ID is invalid, fall back to `1-10`. Update the selected band without duplicating cards in the DOM.

- [ ] **Step 6: Run syntax and local smoke checks**

Run: `node --check js/app.js`
Run: `python -m http.server 8000`
Open: `http://127.0.0.1:8000/index.html`
Verify: switching all six bands shows combat, roaming and base cards; optional slots show `?`; reload preserves the selected band.

- [ ] **Step 7: Commit**

```bash
git add index.html js/app.js css/style.css
git commit -m "Render complete teams by level band"
```

### Task 3: Build the guide-first Wegweiser

**Files:**
- Modify: `data/guide.js`
- Modify: `index.html` Wegweiser host
- Modify: `js/app.js` Wegweiser state and rendering
- Modify: `css/style.css` Wegweiser dashboard

**Interfaces:**
- Produce `renderGuideStep(stepId)` with goal, preparation, linked level-band teams, items, locations, completion and next-step action.
- Preserve `loadWegweiserState()` and `saveWegweiserState(state)` but change the fallback to the first guide step.

- [ ] **Step 1: Add guide-step consistency tests**

Assert that every `GUIDE_STEPS` entry has a valid level band, a non-empty goal, a non-empty preparation list, a completion criterion and either a valid next step or an explicit final marker.

- [ ] **Step 2: Run the tests and confirm the missing fields**

Run: `node tests/guide-data.test.mjs`
Expected: FAIL until each step has the required fields.

- [ ] **Step 3: Define guide steps by level band, not by tower**

Create onboarding, stabilization, mid-game entry, specialization, late-game build and endgame steps. Add tower and raid encounters only as linked special situations inside the relevant step.

- [ ] **Step 4: Render one primary next action**

The Wegweiser must show one prominent current goal, then the three standard team links, then optional special teams. Do not show every team build expanded at once.

- [ ] **Step 5: Verify progress behavior**

Marking a step complete advances to `nextStepId`; reload preserves progress; clearing progress returns to the first level band and first step.

- [ ] **Step 6: Commit**

```bash
git add data/guide.js index.html js/app.js css/style.css tests
git commit -m "Make the Wegweiser the guide-first entry point"
```

### Task 4: Contextual Pal tooltips and database links

**Files:**
- Modify: `data/pals.js`
- Modify: `js/app.js` Pal tooltip, database and filter rendering
- Modify: `index.html` Pal database host
- Modify: `css/style.css` tooltip and focus styles

**Interfaces:**
- Produce `getPalById(palId)`.
- Produce `renderPalTooltip(palId, context)` with image, types, role, location, availability, why-good text, alternative and upgrade fields.
- Produce `openPalDetails(palId, context)` and `closePalDetails()` for hover, focus and tap.

- [ ] **Step 1: Add data tests for tooltip completeness**

For every Pal referenced by a standard team, assert `image`, `location`, `availability`, `whyGood` and at least one role are non-empty strings or arrays.

- [ ] **Step 2: Run the test to identify incomplete Pal records**

Run: `node tests/guide-data.test.mjs`
Expected: FAIL for records still relying on the old HTML-only fields.

- [ ] **Step 3: Implement the shared Pal detail renderer**

Use one renderer for team cards, database rows and future map links. Pass `context: 'combat' | 'roaming' | 'base' | 'database'` and show the context-specific reason while retaining common location and availability.

- [ ] **Step 4: Implement interaction states**

Desktop hover opens the tooltip after a short delay; keyboard focus opens it immediately; mobile tap toggles it; Escape and outside click close it. Add `aria-describedby`, visible focus styles and a database link.

- [ ] **Step 5: Implement database goal filters**

Add goal buttons for Kampf-Pal, Worker, Mount, Fanghilfe, Team-Upgrade and Boss-Kontermöglichkeit. Keep search, element and work-suitability filters and make the selected goal visible.

- [ ] **Step 6: Verify responsive behavior**

Use browser inspection at desktop width and a narrow mobile width. Verify the large image is visible, text is not clipped, the tooltip does not require hover on touch, and keyboard focus can reach every Pal.

- [ ] **Step 7: Commit**

```bash
git add data/pals.js index.html js/app.js css/style.css tests
git commit -m "Add contextual Pal details and database goals"
```

### Task 5: Reclassify and connect special teams, map and handbook

**Files:**
- Modify: `data/teams.js`
- Modify: `data/guide.js`
- Modify: `index.html` special-team, map and handbook hosts
- Modify: `js/app.js` cross-links

**Interfaces:**
- Special teams use `kind: 'special'`, `specialty: 'boss' | 'fang' | 'dungeon' | 'resource' | 'mount' | 'raid'` and `useWhen`.
- Cross-links use `data-target-team`, `data-target-pal`, `data-target-location` and `data-target-handbook` so the same navigation function can handle all references.

- [ ] **Step 1: Add tests preventing special teams from being default teams**

Assert that each level band has no more than one default team per kind and that every special team has a non-empty `useWhen`.

- [ ] **Step 2: Move current boss, fang, dungeon and resource builds into special-team data**

Keep their recommendations but label them as purpose-specific and place them after the three standard teams in the UI.

- [ ] **Step 3: Add context links from teams and guide cards**

Clicking a Pal opens its database detail; clicking a location switches to the map and selects that location; clicking a handbook topic switches to the relevant subsection.

- [ ] **Step 4: Verify navigation and backtracking**

From every standard and special team, follow at least one Pal, location and handbook link and confirm the destination is visible and the selected context is retained.

- [ ] **Step 5: Commit**

```bash
git add data index.html js/app.js tests
git commit -m "Connect special teams, locations and handbook references"
```

### Task 6: Consolidate old content and remove duplicate sources

**Files:**
- Modify: `index.html`
- Modify: `data/pals.js`, `data/teams.js`, `data/guide.js`
- Modify or remove: `palworld-guide.html`
- Modify: `js/app.js`

- [ ] **Step 1: Inventory duplicate recommendations**

Search for every repeated team and Pal name in the active page and classify each occurrence as data, prose explanation or obsolete duplicate. Keep explanatory prose only when it adds reasoning not represented by the data model.

- [ ] **Step 2: Remove HTML scraping as the source of Pal data**

Delete the runtime path that reconstructs `PAL_DB` from `.pal-card` elements. Replace consumers with `getPalById()` and explicit data references.

- [ ] **Step 3: Resolve the legacy page**

Confirm there are no references to `palworld-guide.html`. If it is unused, remove it in the same commit; otherwise replace its body with a short redirect/link to `index.html` and document the reason.

- [ ] **Step 4: Check internal consistency**

Run the data tests and search for stale `Early`, `Mid`, `Late` team headings that are not part of a level-band label. Verify that the Wegweiser fallback is not `turm3` and that no default team has an unreachable Pal without an alternative.

- [ ] **Step 5: Commit**

```bash
git add index.html data js/app.js palworld-guide.html tests
git commit -m "Consolidate guide content into one data source"
```

### Task 7: Accessibility, responsive QA and final verification

**Files:**
- Modify: `css/style.css`
- Modify: `index.html`
- Modify: `js/app.js`
- Modify: `tests/guide-data.test.mjs`

- [ ] **Step 1: Add final contract checks**

Assert that all six level bands have three standard teams, every referenced Pal exists, every required slot has a reason, every tooltip-required field exists and every special team states when it should be used.

- [ ] **Step 2: Run all static checks**

Run: `node tests/guide-data.test.mjs`
Run: `node --check js/app.js`
Run: `git diff --check`
Expected: all commands exit successfully with no whitespace errors.

- [ ] **Step 3: Run the end-to-end smoke checklist**

Open the local page and verify: first-load starts at Level 1–10; all four primary sections are reachable; each level band renders combat, roaming and base teams; `?` slots are explained; Pal hover/focus/tap shows the large image, location and reason; special teams are separated; map and handbook links work; reload preserves Wegweiser and selected band.

- [ ] **Step 4: Verify narrow layout and keyboard flow**

At mobile width, verify no horizontal overflow in team cards or tooltips. With keyboard only, tab through navigation, level selector, team slots, tooltip trigger and close controls; focus must remain visible.

- [ ] **Step 5: Review source consistency**

Run `rg -n "PAL_DB|buildPalDB|theme-kampf|stage-early|stage-mid|stage-late|palworld-guide" index.html js data` and inspect each remaining match. Remaining legacy names are allowed only when they are compatibility selectors or explanatory prose with an active data equivalent.

- [ ] **Step 6: Commit final verification changes**

```bash
git add index.html js data css tests
git commit -m "Verify responsive guide and database redesign"
```

## Execution Notes

Implement tasks in order. After each task, run its listed checks before starting the next one. The first phase can ship with the current visual style; visual polish should remain limited to styles needed for readable team cards, clear hierarchy, responsive behavior and accessible interaction.
