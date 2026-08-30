import {
  getBreedingRelationshipsForChild,
  getBreedingRelationshipsForParents,
} from './breeding-data.mjs';

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase();
const rosterEntries = (roster) => Array.isArray(roster) ? roster : Object.values(roster ?? {});

function getPalByName(roster, name) {
  const needle = normalize(name);
  if (!needle) return null;
  return rosterEntries(roster).find((pal) => normalize(pal?.name) === needle) ?? null;
}

function filterBreedingRelationships(relationships, filters = {}, roster = []) {
  const search = normalize(filters.search);
  const element = normalize(filters.element);
  const phase = filters.phase ?? 'all';
  const status = filters.status ?? 'all';

  return (Array.isArray(relationships) ? relationships : []).filter((relationship) => {
    const names = [relationship.child, ...(relationship.parents ?? [])].map(normalize);
    const matchesSearch = !search || names.some((name) => name.includes(search));
    const pal = getPalByName(roster, relationship.child);
    const elements = Array.isArray(pal?.types) ? pal.types : [pal?.type ?? pal?.element];
    const matchesElement = !element || elements.some((value) => normalize(value) === element);
    const matchesPhase = phase === 'all' || relationship.phase === phase;
    const matchesStatus = status === 'all' || relationship.status === status;
    return matchesSearch && matchesElement && matchesPhase && matchesStatus;
  });
}

function hostFor(hosts, ...names) {
  return names.map((name) => hosts?.[name]).find(Boolean) ?? null;
}

function writeHost(host, text) {
  if (host) host.textContent = text;
}

function parentSlot(slot) {
  if (slot === 0 || slot === 'first' || slot === 'a' || slot === 'parentA') return 0;
  if (slot === 1 || slot === 'second' || slot === 'b' || slot === 'parentB') return 1;
  return null;
}

function createBreedingCalculator({ index, roster = [], hosts = {}, onTargetChange } = {}) {
  let selectedTarget = null;
  const selectedParents = [null, null];
  const targetHost = hostFor(hosts, 'targetHost', 'target');
  const parentHost = hostFor(hosts, 'parentHost', 'parents');
  const resultsHost = hostFor(hosts, 'resultsHost', 'results');

  function renderTarget() {
    writeHost(targetHost, selectedTarget ? `Ziel: ${selectedTarget}` : 'Kein Ziel ausgewählt.');
  }

  function renderParents() {
    writeHost(parentHost, `Eltern A: ${selectedParents[0] ?? '—'}; Eltern B: ${selectedParents[1] ?? '—'}`);
  }

  function renderResults(relationships) {
    const names = relationships.map(({ child, status }) => `${child} (${status})`);
    writeHost(resultsHost, names.length ? names.join(', ') : 'Keine bekannte Kombination.');
  }

  function selectTarget(name) {
    selectedTarget = String(name ?? '').trim() || null;
    const relationships = selectedTarget ? getBreedingRelationshipsForChild(index, selectedTarget) : [];
    renderTarget();
    renderResults(relationships);
    if (selectedTarget && typeof onTargetChange === 'function') onTargetChange(selectedTarget);
    return relationships;
  }

  function selectParent(slot, name) {
    const slotIndex = parentSlot(slot);
    if (slotIndex === null) return [];
    selectedParents[slotIndex] = String(name ?? '').trim() || null;
    const relationships = selectedParents.every(Boolean)
      ? getBreedingRelationshipsForParents(index, selectedParents)
      : [];
    renderParents();
    renderResults(relationships);
    return relationships;
  }

  renderTarget();
  renderParents();
  renderResults([]);

  return { selectTarget, selectParent };
}

export {
  createBreedingCalculator,
  filterBreedingRelationships,
  getPalByName,
};
