# Breeding Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Einen lokalen Breeding-Rechner mit Zielsuche, Elternsuche und klickbaren Eltern-Icons in der Pal-Tabelle bauen.

**Architecture:** Eine reine Daten-/Index-Schicht normalisiert Elternpaare und liefert Beziehungen in beide Richtungen. Ein eigenes Calculator-Modul rendert Ziel- und Elternansicht; die bestehende Pal-Tabelle übergibt nur ein Ziel-Pal an den Rechner. Der neue Haupttab wird über den bestehenden Bootstrap-/Tab-Mechanismus eingebunden.

**Tech Stack:** Statisches HTML, CSS, browserseitige ES-Module, bestehende Roster-Daten, Node `node:test`.

**Spec:** `docs/superpowers/specs/2026-08-30-breeding-calculator-design.md`

## Global Constraints

- Keine externe Weiterleitung als primärer Rechner.
- Keine Server- oder Account-Funktion; Berechnung und Filterung laufen im Browser.
- Die Datenbasis enthält alle bekannten Kombinationen, die für den aktuellen Roster vorliegen.
- Unvollständige oder besondere Beziehungen werden sichtbar als Status markiert, nicht als garantiertes Ergebnis ausgegeben.
- Elternreihenfolge wird für Suche und Duplikatvermeidung normalisiert.
- Fehlende Pal-Icons fallen auf einen neutralen Platzhalter zurück.
- Die vollständige Node-Test-Suite muss grün bleiben.

---

### Task 1: Zuchtbeziehungen und Suchindizes

**Files:**
- Create: `data/breeding-combinations.mjs`
- Create: `js/breeding-data.mjs`
- Test: `tests/breeding-calculator.test.mjs`

**Interfaces:**
- `BREEDING_COMBINATIONS`: Array von `{ id, child, parents: [string, string], status, phase, note, sources }`.
- `normalizeParentPair(parents)`: gibt ein alphabetisch sortiertes Paar zurück.
- `buildBreedingIndex(combinations)`: gibt `{ byChild, byParents, pals }` zurück.
- `getBreedingRelationshipsForChild(index, childName)`: gibt Beziehungen für das Ziel zurück.
- `getBreedingRelationshipsForParents(index, parents)`: behandelt vertauschte Reihenfolge identisch.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { buildBreedingIndex, getBreedingRelationshipsForChild, getBreedingRelationshipsForParents, normalizeParentPair } from '../js/breeding-data.mjs';

const input = [
  { id: 'a', child: 'Target', parents: ['Zulu', 'Alpha'], status: 'verified', phase: 'mid', note: '', sources: [] },
  { id: 'b', child: 'Target', parents: ['Alpha', 'Zulu'], status: 'special-case', phase: 'late', note: '', sources: [] }
];
const index = buildBreedingIndex(input);
assert.deepEqual(normalizeParentPair(['Zulu', 'Alpha']), ['Alpha', 'Zulu']);
assert.equal(getBreedingRelationshipsForChild(index, 'Target').length, 2);
assert.equal(getBreedingRelationshipsForParents(index, ['Alpha', 'Zulu']).length, 2);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/breeding-calculator.test.mjs`
Expected: FAIL because `js/breeding-data.mjs` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create the curated relationship records from the existing `data/breeding.mjs` routes and roster breeding notes. Deduplicate pair order in `buildBreedingIndex`; retain distinct records only when their child or status differs. Use `Map` keys of `child.toLowerCase()` and `normalizeParentPair(parents).join('|').toLowerCase()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/breeding-calculator.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/breeding-combinations.mjs js/breeding-data.mjs tests/breeding-calculator.test.mjs
git commit -m "feat: add indexed breeding relationships"
```

### Task 2: Reine Filter- und Calculator-Logik

**Files:**
- Modify: `js/breeding-data.mjs`
- Create: `js/breeding-calculator.mjs`
- Test: `tests/breeding-calculator.test.mjs`

**Interfaces:**
- `filterBreedingRelationships(relationships, { search, element, phase, status }, roster)`: filtert ohne DOM.
- `createBreedingCalculator({ index, roster, hosts, onTargetChange })`: initialisiert die UI und gibt `{ selectTarget(name), selectParent(slot, name) }` zurück.
- `getPalByName(roster, name)`: liefert Roster-Daten oder `null`.

- [ ] **Step 1: Write the failing test**

```js
import { filterBreedingRelationships } from '../js/breeding-calculator.mjs';

const relationships = [
  { child: 'Target', parents: ['Alpha', 'Zulu'], status: 'verified', phase: 'mid' },
  { child: 'Other', parents: ['Beta', 'Gamma'], status: 'special-case', phase: 'late' }
];
assert.equal(filterBreedingRelationships(relationships, { search: 'target', phase: 'mid', status: 'verified' }, []).length, 1);
assert.equal(filterBreedingRelationships(relationships, { search: 'missing', phase: 'all', status: 'all' }, []).length, 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/breeding-calculator.test.mjs`
Expected: FAIL because the filter export does not exist.

- [ ] **Step 3: Write minimal implementation**

Implement case-insensitive name matching over child and parent names, optional child element matching via roster lookup, and exact `phase`/`status` filters. Keep DOM rendering out of the filter function. Implement parent selection through the indexed pair lookup and preserve a selected target in the returned controller.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/breeding-calculator.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/breeding-data.mjs js/breeding-calculator.mjs tests/breeding-calculator.test.mjs
git commit -m "feat: add breeding calculator query logic"
```

### Task 3: Breeding-Reiter und Rechner-UI

**Files:**
- Modify: `index.html`
- Modify: `js/bootstrap.mjs`
- Modify: `js/app.js`
- Modify: `js/breeding-calculator.mjs`
- Modify: `css/style.css`
- Test: `tests/breeding-ui.test.mjs`

**Interfaces:**
- Host IDs: `breedingTargetHost`, `breedingParentHost`, `breedingResultsHost`.
- `initBreedingCalculator()`: idempotente Initialisierung für den neuen Tab.
- `switchTab('breeding')`: aktiviert den Tab und initialisiert den Rechner.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = readFileSync(new URL('../js/bootstrap.mjs', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
assert.match(html, /switchTab\('breeding'\)/);
assert.match(html, /id="breedingTargetHost"/);
assert.match(html, /id="breedingParentHost"/);
assert.match(html, /id="breedingResultsHost"/);
assert.match(bootstrap, /breeding-calculator/);
assert.match(css, /\.breeding-calculator/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/breeding-ui.test.mjs`
Expected: FAIL because the Breeding tab and hosts do not exist.

- [ ] **Step 3: Write minimal implementation**

Add the `Breeding` button and tab after `Teams & Basen`. Render a compact target search/select area, two parent pickers, filter controls and result host. Use the existing source-link convention for citations. Render parent and child icons from the roster, with accessible names and a visible empty state. Make initialization idempotent and retain deep-link target state through `switchTab`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/breeding-ui.test.mjs tests/breeding-calculator.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html js/bootstrap.mjs js/app.js js/breeding-calculator.mjs css/style.css tests/breeding-ui.test.mjs
git commit -m "feat: add local breeding calculator tab"
```

### Task 4: Zucht-Icons in der Pal-Tabelle

**Files:**
- Modify: `js/pal-table.mjs` or the existing Pal-table renderer identified by `rg -n "render.*Pal|pals-table|partnerSkill" js index.html`
- Modify: `js/breeding-calculator.mjs`
- Modify: `index.html`
- Modify: `css/style.css`
- Test: `tests/breeding-table.test.mjs`

**Interfaces:**
- `renderBreedingCell(childName, index, roster)`: gibt kompakte, tastaturbedienbare Icon-Gruppe zurück.
- `openBreedingTarget(childName)`: aktiviert den Breeding-Tab und setzt das Ziel.

- [ ] **Step 1: Write the failing test**

```js
assert.match(tableSource, /renderBreedingCell/);
assert.match(tableSource, /openBreedingTarget/);
assert.match(html, /Zucht/);
assert.match(css, /\.pal-breeding/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/breeding-table.test.mjs`
Expected: FAIL because the Pal table has no breeding column or renderer.

- [ ] **Step 3: Write minimal implementation**

Add a compact `Zucht` column. Show up to two parent-pair icon groups per result; use `title` and `aria-label` for the full parent names and a `+N` marker for additional relationships. Clicking or pressing Enter calls `openBreedingTarget(childName)`. Keep the cell narrow and ensure the existing broken partner-skill table layout is not reintroduced.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/breeding-table.test.mjs tests/breeding-calculator.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js tests/breeding-table.test.mjs
git commit -m "feat: link pal table to breeding parents"
```

### Task 5: Handbuch-Verlinkung und Sonderfälle

**Files:**
- Modify: `index.html`
- Modify: `js/breeding-calculator.mjs`
- Modify: `css/style.css`
- Test: `tests/breeding-edge-cases.test.mjs`

**Interfaces:**
- `renderBreedingEmptyState(kind)`: liefert verständliche Zustände für kein Ziel, keine Elternkombination und Sonderfälle.

- [ ] **Step 1: Write the failing test**

```js
assert.match(html, /Breeding-Rechner/);
assert.match(html, /switchTab\('breeding'\)/);
assert.match(calculatorSource, /same-species/);
assert.match(calculatorSource, /Keine bekannte Kombination/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/breeding-edge-cases.test.mjs`
Expected: FAIL until the handbooks link and explicit empty/special-case renderers exist.

- [ ] **Step 3: Write minimal implementation**

Replace the old primary external Calculator action in the Handbuch with an internal `switchTab('breeding')` link; retain external sources under `Quellen`. Render explicit copy for missing target, missing relationship, same-species and incomplete data. Do not call any relationship guaranteed when its status is not `verified`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/breeding-edge-cases.test.mjs tests/*.test.mjs`
Expected: PASS with no stale external-calculator primary action.

- [ ] **Step 5: Commit**

```bash
git add index.html js/breeding-calculator.mjs css/style.css tests/breeding-edge-cases.test.mjs
git commit -m "feat: explain breeding edge cases and internal links"
```

### Task 6: Gesamtprüfung und manuelle UI-Abnahme

**Files:**
- Modify: only if a regression is found.
- Test: existing full suite and relevant new tests.

- [ ] **Step 1: Run the full test suite**

Run: `node --test tests/*.test.mjs`
Expected: all tests pass.

- [ ] **Step 2: Check stale references and syntax**

Run: `rg -n "palworld-gg-breeding-calculator|switchTab\\('breeding'\\)|breedingTargetHost|renderBreedingCell" index.html js data tests`

Confirm the external calculator appears only as a source, the internal tab is reachable, all required hosts are wired, and changed modules parse with `node --check` where applicable.

- [ ] **Step 3: Run whitespace validation**

Run: `git diff --check`
Expected: no output and exit code 0.

- [ ] **Step 4: Manually verify the UI**

Open the static page and check: target search, parent selection, filters, empty states, clickable table icons, keyboard focus, desktop compactness, and one-column mobile layout.

- [ ] **Step 5: Commit any final correction**

```bash
git add index.html js data css tests
git commit -m "fix: finalize breeding calculator integration"
```
