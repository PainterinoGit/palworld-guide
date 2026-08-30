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
