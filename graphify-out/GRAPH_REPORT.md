# Graph Report - C:\Users\maxsp\Desktop\Palworld  (2026-09-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 394 nodes · 705 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d0e3b5d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.js
- breeding-calculator.mjs
- index.mjs
- team-renderer.mjs
- bootstrap.mjs
- guide-ui.mjs
- final-fix-regression.test.mjs
- base-planner.mjs
- guide-renderer.mjs
- manifest.json
- import-palworld-breeding-data.mjs
- job-tierlist.test.mjs
- resource-catalog.test.mjs
- task-6-legacy.test.mjs
- team-hover.test.mjs
- resources.js
- breeding-edge-cases.test.mjs
- breeding-ui.test.mjs
- job-tierlist.js
- teams-bases-ui.test.mjs
- bases.js
- pals-roster.js
- handbook-condensation.test.mjs
- task-5-review.test.mjs

## God Nodes (most connected - your core abstractions)
1. `renderTeamSlot()` - 12 edges
2. `renderPalsTable()` - 11 edges
3. `PALS` - 10 edges
4. `getPalById()` - 10 edges
5. `renderGuideStep()` - 10 edges
6. `applyCurrentMeta()` - 10 edges
7. `buildPalDatabase()` - 10 edges
8. `asArray()` - 9 edges
9. `asText()` - 9 edges
10. `renderTeamCard()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `initBasePlanner()` --calls--> `getBasePlan()`  [EXTRACTED]
  js/base-planner.mjs → data/base-plans.mjs
- `attachTeamSlotDetails()` --calls--> `getPalById()`  [EXTRACTED]
  js/guide-ui.mjs → data/pals.mjs
- `resolvePal()` --calls--> `getPalById()`  [EXTRACTED]
  js/team-renderer.mjs → data/pals.mjs
- `renderCompactTeamProgress()` --indirect_call--> `slot()`  [INFERRED]
  js/guide-ui.mjs → data/teams.mjs
- `renderEndgameTeams()` --indirect_call--> `slot()`  [INFERRED]
  js/guide-ui.mjs → data/teams.mjs

## Import Cycles
- None detected.

## Communities (24 total, 7 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.06
Nodes (56): applyPalThumbs(), applyPalVisuals(), applySynergyChipIcons(), bindResourceDetails(), buildFallbackPalDB(), buildPalDB(), captureMapPreview(), cleanChipName() (+48 more)

### Community 1 - "breeding-calculator.mjs"
Cohesion: 0.09
Nodes (35): BREEDING_COMBINATIONS, CALCULATOR_SOURCE, ROSTER_SOURCE, PALWORLD_BREEDING_META, createBreedingCalculator(), escapeHtml(), filterBreedingRelationships(), getPalByName() (+27 more)

### Community 2 - "index.mjs"
Cohesion: 0.07
Nodes (32): ACTIVE_TASK_UPDATES, BASE_PLANS, FLEX_PATTERNS, getBasePlan(), SOURCES, twoBaseBreeding, ACTIVE_META_PAL_IDS, ACTIVE_META_PALS (+24 more)

### Community 3 - "team-renderer.mjs"
Cohesion: 0.09
Nodes (37): base(), BASE_TEAMS, combat(), COMBAT_TEAMS, LEVEL_BANDS, roaming(), ROAMING_TEAMS, sourceSets (+29 more)

### Community 4 - "bootstrap.mjs"
Cohesion: 0.11
Nodes (33): PATCH_NOTES, appScript, applyCurrentMeta(), applyGuidePalData(), asArray(), asText(), buildPalDatabase(), buildTargetNameMap() (+25 more)

### Community 5 - "guide-ui.mjs"
Cohesion: 0.11
Nodes (29): checklist(), GUIDE_STEPS, roadmapStep(), slot(), attachTeamSlotDetails(), COMPACT_PHASE_LABELS, escapeHtml(), getChecklistItemKey() (+21 more)

### Community 6 - "final-fix-regression.test.mjs"
Cohesion: 0.08
Nodes (20): ACTIVE_SOURCE_IDS, isActiveSourceId(), META_SOURCES, app, bootstrapScriptIndex, database, html, rosterContext (+12 more)

### Community 7 - "base-planner.mjs"
Cohesion: 0.18
Nodes (18): BREEDING_ROUTES, CALC, escapeHtml(), initBasePlanner(), LOCATION_LABELS, PAL_NAMES, palIconUrl(), renderBasePlan() (+10 more)

### Community 8 - "guide-renderer.mjs"
Cohesion: 0.18
Nodes (19): getPalById(), escapeHtml(), PAL_BY_ID, renderChecklist(), renderGuideStep(), renderLocationList(), renderPalReferenceList(), renderSpecialContext() (+11 more)

### Community 9 - "manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, lang, name, scope, short_name (+2 more)

### Community 10 - "import-palworld-breeding-data.mjs"
Cohesion: 0.33
Nodes (5): combinations, metadata, pals, source, unique

### Community 11 - "job-tierlist.test.mjs"
Cohesion: 0.33
Nodes (4): app, data, html, jobEntryCounts

### Community 12 - "resource-catalog.test.mjs"
Cohesion: 0.40
Nodes (3): app, html, resources

### Community 13 - "task-6-legacy.test.mjs"
Cohesion: 0.40
Nodes (3): app, html, roster

### Community 14 - "team-hover.test.mjs"
Cohesion: 0.40
Nodes (4): app, css, html, source

### Community 15 - "resources.js"
Cohesion: 0.50
Nodes (3): RESOURCE_CATALOG, RESOURCE_IMAGES, RESOURCES

### Community 17 - "breeding-ui.test.mjs"
Cohesion: 0.50
Nodes (3): bootstrap, css, html

## Knowledge Gaps
- **154 isolated node(s):** `SOURCES`, `ACTIVE_TASK_UPDATES`, `FLEX_PATTERNS`, `twoBaseBreeding`, `BASES` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PALS` connect `index.mjs` to `team-renderer.mjs`, `bootstrap.mjs`, `final-fix-regression.test.mjs`, `base-planner.mjs`, `guide-renderer.mjs`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `BASE_PLANS` connect `index.mjs` to `bootstrap.mjs`, `base-planner.mjs`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `buildPalDatabase()` connect `bootstrap.mjs` to `final-fix-regression.test.mjs`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `SOURCES`, `ACTIVE_TASK_UPDATES`, `FLEX_PATTERNS` to the rest of the system?**
  _154 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.061016949152542375 - nodes in this community are weakly interconnected._
- **Should `breeding-calculator.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Should `index.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06585365853658537 - nodes in this community are weakly interconnected._