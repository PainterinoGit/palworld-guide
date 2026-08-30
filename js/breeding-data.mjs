import { BREEDING_COMBINATIONS } from '../data/breeding-combinations.mjs';
import { PALWORLD_BREEDING_META } from '../data/palworld-breeding-meta.mjs';

const normalizeParentPair = (parents) => [...parents].sort((left, right) => left.localeCompare(right));

const childKey = (child) => child.toLocaleLowerCase();
const parentsKey = (parents) => normalizeParentPair(parents).map((parent) => parent.toLocaleLowerCase()).join('|');

const externalParentsKey = (left, right) => [left, right].sort().join('|');

function buildCalculatedRelationships(meta = PALWORLD_BREEDING_META) {
  const byId = new Map(meta.map((pal) => [pal.id, pal]));
  const explicitChildren = new Set();
  const explicitPairs = new Set();
  const calculated = [];

  for (const pal of meta) {
    for (const combo of pal.combos ?? []) {
      const child = byId.get(combo.child);
      const parentA = byId.get(combo.a);
      const parentB = byId.get(combo.b);
      if (!child || !parentA || !parentB) continue;
      explicitChildren.add(combo.child);
      explicitPairs.add(externalParentsKey(combo.a, combo.b));
      calculated.push({
        id: `external-${combo.a}-${combo.b}-${combo.child}`,
        child: child.name,
        parents: [parentA.name, parentB.name],
        status: 'verified',
        phase: 'reference',
        note: 'Kombination aus der lokalen Volltabelle des Referenz-Rechners.',
        sources: ['palworld-gg-breeding-calculator'],
      });
    }
  }

  const candidates = meta.filter((pal) => pal.name && pal.combiRank && pal.combiRank !== 9999 && !pal.isBoss && (!pal.ignoreCombi || (pal.combos ?? []).length));
  const nonExplicitChildren = meta.filter((pal) => pal.name && pal.combiRank && !explicitChildren.has(pal.id) && !pal.ignoreCombi);
  const nearest = new Map();
  const maxRank = Math.max(...candidates.map((pal) => pal.combiRank), 0);
  for (let rank = 0; rank <= maxRank + 1; rank += 1) {
    nearest.set(rank, candidates.reduce((best, pal) => {
      if (!best) return pal;
      const distance = Math.abs(pal.combiRank - rank);
      const bestDistance = Math.abs(best.combiRank - rank);
      return distance < bestDistance || (distance === bestDistance && pal.combiPriority > best.combiPriority) ? pal : best;
    }, null));
  }

  for (const target of nonExplicitChildren) {
    for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
      for (let rightIndex = leftIndex; rightIndex < candidates.length; rightIndex += 1) {
        const left = candidates[leftIndex];
        const right = candidates[rightIndex];
        if (explicitPairs.has(externalParentsKey(left.id, right.id))) continue;
        const result = left.id === right.id ? left : nearest.get((left.combiRank + right.combiRank + 1) >> 1);
        if (result?.id !== target.id) continue;
        calculated.push({
          id: `calculated-${left.id}-${right.id}-${target.id}`,
          child: target.name,
          parents: [left.name, right.name],
          status: 'calculated',
          phase: 'reference',
          note: 'Vollständige Kombination nach der öffentlichen Breeding-Ranglogik berechnet.',
          sources: ['palworld-gg-breeding-calculator'],
        });
      }
    }
  }
  return calculated;
}

const relationshipMergeKey = (relationship) => `${childKey(relationship.child)}|${parentsKey(relationship.parents)}`;
const allRelationships = [...buildCalculatedRelationships(), ...BREEDING_COMBINATIONS];
const BREEDING_RELATIONSHIPS = [...new Map(allRelationships.map((relationship) => [relationshipMergeKey(relationship), relationship])).values()];

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

const BREEDING_INDEX = buildBreedingIndex(BREEDING_RELATIONSHIPS);

export {
  BREEDING_RELATIONSHIPS as BREEDING_COMBINATIONS,
  BREEDING_INDEX,
  buildBreedingIndex,
  getBreedingRelationshipsForChild,
  getBreedingRelationshipsForParents,
  normalizeParentPair,
};
