# Task 1 Report

## Changed files

- `js/team-progression.mjs`
- `tests/team-progression.test.mjs`

## Commit

`d6d9b87` — `feat: add compact team progression model`

## Test

Command:

```text
node --test tests/team-progression.test.mjs
```

Output summary: 1 test passed, 0 failed, 0 skipped, 0 cancelled.

## Concerns

None. The report is intentionally left outside the requested two-file commit.

## Round 1 fix report

### Coverage added

- Imported and asserted the exported `TEAM_PHASES` constant.
- Added a reversed synthetic combat fixture proving selection follows `levelBandIds` order rather than input order.
- Added three matching start-phase special teams and asserted only the first two swaps are returned.

### Covering test

Command:

```text
node --test tests/team-progression.test.mjs
```

Output summary: 1 test passed, 0 failed, 0 skipped, 0 cancelled.
