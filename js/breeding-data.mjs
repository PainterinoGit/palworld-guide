import { BREEDING_COMBINATIONS } from '../data/breeding-combinations.mjs';

const normalizeParentPair = (parents) => [...parents].sort((left, right) => left.localeCompare(right));

const childKey = (child) => child.toLocaleLowerCase();
const parentsKey = (parents) => normalizeParentPair(parents).map((parent) => parent.toLocaleLowerCase()).join('|');

const buildBreedingIndex = (combinations) => {
  const byChild = new Map();
  const byParents = new Map();
  const pals = new Set();
  const seen = new Set();

  for (const relationship of combinations) {
    const normalizedParents = normalizeParentPair(relationship.parents);
    const record = { ...relationship, parents: normalizedParents };
    const dedupeKey = `${childKey(record.child)}|${parentsKey(record.parents)}|${childKey(record.status)}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const childIndexKey = childKey(record.child);
    const parentIndexKey = parentsKey(record.parents);
    if (!byChild.has(childIndexKey)) byChild.set(childIndexKey, []);
    if (!byParents.has(parentIndexKey)) byParents.set(parentIndexKey, []);
    byChild.get(childIndexKey).push(record);
    byParents.get(parentIndexKey).push(record);
    pals.add(record.child);
    record.parents.forEach((parent) => pals.add(parent));
  }

  return { byChild, byParents, pals };
};

const getBreedingRelationshipsForChild = (index, childName) => index.byChild.get(childKey(childName)) ?? [];
const getBreedingRelationshipsForParents = (index, parents) => index.byParents.get(parentsKey(parents)) ?? [];

const BREEDING_INDEX = buildBreedingIndex(BREEDING_COMBINATIONS);

export {
  BREEDING_COMBINATIONS,
  BREEDING_INDEX,
  buildBreedingIndex,
  getBreedingRelationshipsForChild,
  getBreedingRelationshipsForParents,
  normalizeParentPair,
};
