import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildBreedingIndex,
  getBreedingRelationshipsForChild,
  getBreedingRelationshipsForParents,
  normalizeParentPair,
} from '../js/breeding-data.mjs';
import { BREEDING_COMBINATIONS } from '../data/breeding-combinations.mjs';

test('normalizes parent pairs and preserves distinct child/status records', () => {
  const input = [
    { id: 'a', child: 'Target', parents: ['Zulu', 'Alpha'], status: 'verified', phase: 'mid', note: '', sources: [] },
    { id: 'b', child: 'Target', parents: ['Alpha', 'Zulu'], status: 'special-case', phase: 'late', note: '', sources: [] },
  ];
  const index = buildBreedingIndex(input);

  assert.deepEqual(normalizeParentPair(['Zulu', 'Alpha']), ['Alpha', 'Zulu']);
  assert.equal(getBreedingRelationshipsForChild(index, 'Target').length, 2);
  assert.equal(getBreedingRelationshipsForParents(index, ['Alpha', 'Zulu']).length, 2);
});

test('exports complete, status-bearing static breeding records', () => {
  assert.ok(BREEDING_COMBINATIONS.length > 0);
  for (const combination of BREEDING_COMBINATIONS) {
    assert.ok(combination.id && combination.child);
    assert.equal(combination.parents.length, 2);
    assert.ok(combination.parents.every((parent) => typeof parent === 'string' && parent.length > 0));
    assert.ok(combination.status && combination.phase);
    assert.ok(Array.isArray(combination.sources));
  }
});
