import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildBreedingIndex,
  getBreedingRelationshipsForChild,
  getBreedingRelationshipsForParents,
  normalizeParentPair,
} from '../js/breeding-data.mjs';
import { BREEDING_COMBINATIONS } from '../data/breeding-combinations.mjs';
import { META_SOURCES } from '../data/meta-sources.mjs';

test('normalizes parent pairs and preserves distinct child/status records', () => {
  const input = [
    { id: 'a', child: 'Target', parents: ['Zulu', 'Alpha'], status: 'verified', phase: 'mid', note: '', sources: [] },
    { id: 'b', child: 'Target', parents: ['Alpha', 'Zulu'], status: 'special-case', phase: 'late', note: '', sources: [] },
  ];
  const index = buildBreedingIndex(input);

  assert.deepEqual(normalizeParentPair(['Zulu', 'Alpha']), ['Alpha', 'Zulu']);
  assert.equal(getBreedingRelationshipsForChild(index, 'Target').length, 2);
  assert.equal(getBreedingRelationshipsForParents(index, ['Alpha', 'Zulu']).length, 2);
  assert.equal(getBreedingRelationshipsForParents(index, ['Zulu', 'Alpha']).length, 2);

  const duplicateIndex = buildBreedingIndex([...input, { ...input[0], id: 'duplicate' }]);
  assert.equal(getBreedingRelationshipsForParents(duplicateIndex, ['Zulu', 'Alpha']).length, 2);
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

test('includes the reviewed route and roster relationships with honest lookup status', () => {
  const index = buildBreedingIndex(BREEDING_COMBINATIONS);
  for (const child of ['Jetragon', 'Shadowbeak', 'Silvance', 'Dandilord', 'Hartalis']) {
    const relationship = getBreedingRelationshipsForChild(index, child).find(({ status }) => status === 'special-case');
    assert.deepEqual(relationship?.parents, [child, child]);
  }

  const cryolinx = getBreedingRelationshipsForChild(index, 'Cryolinx Terra');
  assert.ok(cryolinx.some(({ parents }) => parents.join('|') === 'Cryolinx|Dazemu'));

  const loomen = getBreedingRelationshipsForChild(index, 'Loomen');
  assert.equal(loomen.length, 1);
  assert.equal(loomen[0].status, 'incomplete');
  assert.equal(getBreedingRelationshipsForParents(index, ['Loomen', 'Frostplume']).length, 0);

  const loupmoon = getBreedingRelationshipsForChild(index, 'Loupmoon Cryst');
  assert.equal(loupmoon.length, 1);
  assert.equal(loupmoon[0].status, 'incomplete');
  assert.equal(getBreedingRelationshipsForParents(index, ['Loupmoon', 'Frostplume']).length, 0);

  const validSourceIds = new Set(META_SOURCES.map(({ id }) => id));
  for (const combination of BREEDING_COMBINATIONS) {
    for (const source of combination.sources) assert.ok(validSourceIds.has(source), `unknown source: ${source}`);
  }
});
