# Task 1 Report: Zuchtbeziehungen und Suchindizes

## Files changed

- `data/breeding-combinations.mjs` — curated route and roster relationships with explicit status, phase, notes, and sources.
- `js/breeding-data.mjs` — normalized parent-pair helpers, child/parent indexes, and lookup functions.
- `tests/breeding-calculator.test.mjs` — Node `node:test` normalization/index contract and record-shape tests.

## TDD verification

Red command:

```text
node --test tests/breeding-calculator.test.mjs
```

Output: failed as expected with `ERR_MODULE_NOT_FOUND` because `js/breeding-data.mjs` did not exist.

Green commands:

```text
node --test tests/breeding-calculator.test.mjs
```

Output: 2 tests passed, 0 failed.

```text
node --test tests/*.test.mjs
node --check data/breeding-combinations.mjs
node --check js/breeding-data.mjs
git diff --check
```

Output: 22 tests passed, 0 failed; both modules parsed successfully; whitespace check clean.

## Self-review

- Parent lookup is case-insensitive and independent of input order.
- Reversed parent order is normalized before indexing.
- Same child/pair records with different statuses remain distinct.
- Special, incomplete, and self-only relationships retain visible status and notes.
- Unknown roster relationships remain representable with explicit placeholder parent names rather than being dropped.
- Modules use browser-compatible ES module syntax and have no server/account behavior.

## Concerns

- Several roster entries confirm that breeding is possible without naming parents; these are represented as `incomplete` records with `Unbekannter Eltern-Pal` placeholders and should be refined when a reliable source supplies the pair.
- Some route entries are intentionally guidance-level rather than exhaustive calculator data; their status/notes make that limitation visible.

## Commit hash

Implementation commit: `7db429b4070efca20fe1a5612146655346f00524`

## Fix round 1 evidence

Review findings addressed:

- Added self-only route records for Jetragon and Shadowbeak, roster-derived self-only records for Silvance, Dandilord, and Hartalis, the explicit Cryolinx Terra + Dazemu pair, and an incomplete unknown-parent Loomen record.
- Replaced the incorrect concrete Loupmoon Cryst + Frostplume pair with an incomplete unknown-parent record; no concrete pair lookup is created.
- Removed the unregistered `pals-breeding-route` source ID and constrained relationship sources to existing active metadata IDs.
- Strengthened tests for reversed parent lookup and exact duplicate suppression.

Fix-round red command:

```text
node --test tests/breeding-calculator.test.mjs
```

Output: failed as expected on the missing Jetragon self-only relationship, then exposed the unregistered source ID during the same red cycle.

Fix-round green commands:

```text
node --test tests/breeding-calculator.test.mjs
node --test tests/*.test.mjs
node --check data/breeding-combinations.mjs
node --check js/breeding-data.mjs
git diff --check
```

Output: focused suite 3 passed, full suite 23 passed, 0 failed; syntax checks passed; diff check clean.

Fix-round commit: `7a9756d91cbcdc3301268e511c87da85dcfb0169`

## Fix round 2 evidence

- Corrected the Shadowbeak self-only record argument order so it has exactly the required fields, with `status: 'special-case'`, `phase: 'late'`, a self-only note, and calculator provenance.
- Restored separate provenance constants: roster-derived records use registered `palmods-work-suitability`; calculator-derived records use `palworld-gg-breeding-calculator`.
- Added regression assertions for Shadowbeak’s field shape and values, and for non-calculator roster provenance.

Fix-round red command:

```text
node --test tests/breeding-calculator.test.mjs
```

Output: failed on Shadowbeak’s malformed field ordering (`phase` contained the note) before the production correction.

Fix-round green commands:

```text
node --test tests/breeding-calculator.test.mjs
node --test tests/*.test.mjs
node --check data/breeding-combinations.mjs
node --check js/breeding-data.mjs
git diff --check
```

Output: focused suite 4 passed, full suite 24 passed, 0 failed; syntax checks passed; diff check clean.

Fix-round 2 commit: `48c00970da17bdce1f5525ff9ff0ca696fd095dd`
