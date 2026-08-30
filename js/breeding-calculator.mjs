import {
  getBreedingRelationshipsForChild,
  getBreedingRelationshipsForParents,
} from './breeding-data.mjs';

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase();
const rosterEntries = (roster) => Array.isArray(roster) ? roster : Object.values(roster ?? {});
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));

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
    const matchesElement = !element || element === 'all' || elements.some((value) => normalize(value) === element);
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

function isDomHost(host) {
  return typeof host?.querySelector === 'function';
}

function palIconUrl(name, size = 40) {
  const file = `${String(name).replace(/ /g, '_')}_icon.png`;
  return `https://palworld.wiki.gg/images/thumb/${encodeURIComponent(file)}/${size}px-${encodeURIComponent(file)}`;
}

function iconMarkup(name) {
  const label = escapeHtml(name);
  return `<span class="breeding-pal-icon" aria-hidden="true"><img src="${palIconUrl(name)}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="breeding-pal-fallback" hidden>${label.charAt(0) || '?'}</span></span>`;
}

function sourceLinks(sourceIds, sourceCatalog) {
  const sources = Array.isArray(sourceCatalog) ? sourceCatalog : [];
  return (sourceIds ?? []).map((id) => sources.find((source) => source.id === id))
    .filter((source) => source?.url)
    .map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>`)
    .join(' · ');
}

function statusLabel(status) {
  return ({ verified: 'Verifiziert', incomplete: 'Unvollständig', 'special-case': 'Sonderfall' })[status] ?? 'Unbekannter Status';
}

function optionMarkup(names, selected, placeholder) {
  return [`<option value="">${escapeHtml(placeholder)}</option>`, ...names.map((name) => `<option value="${escapeHtml(name)}"${name === selected ? ' selected' : ''}>${escapeHtml(name)}</option>`)].join('');
}

function createBreedingCalculator({ index, roster = [], hosts = {}, onTargetChange, sourceCatalog = [] } = {}) {
  let selectedTarget = null;
  const selectedParents = [null, null];
  const filters = { element: 'all', phase: 'all', status: 'all' };
  const targetHost = hostFor(hosts, 'targetHost', 'target');
  const parentHost = hostFor(hosts, 'parentHost', 'parents');
  const resultsHost = hostFor(hosts, 'resultsHost', 'results');
  const relationships = [...(index?.byChild?.values?.() ?? [])].flat();
  const allNames = [...(index?.pals ?? [])].sort((left, right) => left.localeCompare(right));
  const targetNames = [...new Set(relationships.map(({ child }) => child))].sort((left, right) => left.localeCompare(right));
  const elementNames = [...new Set(rosterEntries(roster).flatMap((pal) => Array.isArray(pal?.types) ? pal.types : [pal?.type ?? pal?.element]).filter(Boolean))]
    .sort((left, right) => String(left).localeCompare(String(right)));
  const phaseNames = [...new Set(relationships.map(({ phase }) => phase).filter(Boolean))].sort();
  const statusNames = [...new Set(relationships.map(({ status }) => status).filter(Boolean))].sort();

  function selectedRelationships() {
    if (selectedParents.every(Boolean)) return getBreedingRelationshipsForParents(index, selectedParents);
    if (selectedTarget) return getBreedingRelationshipsForChild(index, selectedTarget);
    return [];
  }

  function renderTarget() {
    if (!isDomHost(targetHost)) {
      writeHost(targetHost, selectedTarget ? `Ziel: ${selectedTarget}` : 'Kein Ziel ausgewählt.');
      return;
    }
    targetHost.innerHTML = `<div class="breeding-controls">
      <label>Ziel suchen<input class="pals-search" type="search" list="breedingTargetChoices" data-breeding-target-search value="${escapeHtml(selectedTarget ?? '')}" placeholder="Pal eingeben…"></label>
      <label>Ziel auswählen<select class="pals-select" data-breeding-target>${optionMarkup(targetNames, selectedTarget, 'Ziel-Pal auswählen')}</select></label>
      <label>Element<select class="pals-select" data-breeding-filter="element"><option value="all">Alle Elemente</option>${elementNames.map((element) => `<option value="${escapeHtml(element)}"${filters.element === element ? ' selected' : ''}>${escapeHtml(element)}</option>`).join('')}</select></label>
      <label>Phase<select class="pals-select" data-breeding-filter="phase"><option value="all">Alle Phasen</option>${phaseNames.map((phase) => `<option value="${escapeHtml(phase)}"${filters.phase === phase ? ' selected' : ''}>${escapeHtml(phase)}</option>`).join('')}</select></label>
      <label>Status<select class="pals-select" data-breeding-filter="status"><option value="all">Alle Status</option>${statusNames.map((status) => `<option value="${escapeHtml(status)}"${filters.status === status ? ' selected' : ''}>${escapeHtml(statusLabel(status))}</option>`).join('')}</select></label>
      <datalist id="breedingTargetChoices">${targetNames.map((name) => `<option value="${escapeHtml(name)}"></option>`).join('')}</datalist>
    </div>`;
    targetHost.querySelector('[data-breeding-target-search]').addEventListener('change', (event) => selectTarget(event.target.value));
    targetHost.querySelector('[data-breeding-target]').addEventListener('change', (event) => selectTarget(event.target.value));
    targetHost.querySelectorAll('[data-breeding-filter]').forEach((control) => control.addEventListener('change', (event) => {
      filters[event.target.dataset.breedingFilter] = event.target.value;
      renderResults();
    }));
  }

  function renderParents() {
    if (!isDomHost(parentHost)) {
      writeHost(parentHost, `Eltern A: ${selectedParents[0] ?? '—'}; Eltern B: ${selectedParents[1] ?? '—'}`);
      return;
    }
    parentHost.innerHTML = `<div class="breeding-parent-pickers">
      <label>Elternteil A<select class="pals-select" data-breeding-parent="0">${optionMarkup(allNames, selectedParents[0], 'Erstes Elternteil wählen')}</select></label>
      <span class="breeding-pair-arrow" aria-hidden="true">+</span>
      <label>Elternteil B<select class="pals-select" data-breeding-parent="1">${optionMarkup(allNames, selectedParents[1], 'Zweites Elternteil wählen')}</select></label>
    </div>`;
    parentHost.querySelectorAll('[data-breeding-parent]').forEach((control) => control.addEventListener('change', (event) => {
      selectParent(Number(event.target.dataset.breedingParent), event.target.value);
    }));
  }

  function renderResults() {
    const activeRelationships = selectedRelationships();
    const visibleRelationships = filterBreedingRelationships(activeRelationships, filters, roster);
    if (!isDomHost(resultsHost)) {
      const names = visibleRelationships.map(({ child, status }) => `${child} (${status})`);
      writeHost(resultsHost, names.length ? names.join(', ') : 'Keine bekannte Kombination.');
      return visibleRelationships;
    }
    if (!selectedTarget && !selectedParents.every(Boolean)) {
      resultsHost.innerHTML = '<p class="breeding-empty-state">Wähle ein Ziel oder zwei Elternteile, um bekannte Kombinationen zu sehen.</p>';
      return visibleRelationships;
    }
    if (!visibleRelationships.length) {
      resultsHost.innerHTML = '<p class="breeding-empty-state">Keine bekannte Kombination für diese Auswahl und Filter.</p>';
      return visibleRelationships;
    }
    resultsHost.innerHTML = `<div class="breeding-results-list">${visibleRelationships.map((relationship) => {
      const parents = relationship.parents.map((parent) => `<span class="breeding-pal">${iconMarkup(parent)}<span>${escapeHtml(parent)}</span></span>`).join('<span class="breeding-result-plus" aria-hidden="true">+</span>');
      const sources = sourceLinks(relationship.sources, sourceCatalog);
      return `<article class="breeding-result">
        <div class="breeding-result-line"><div class="breeding-result-pals">${parents}<span class="breeding-result-arrow" aria-hidden="true">→</span><span class="breeding-pal breeding-child">${iconMarkup(relationship.child)}<strong>${escapeHtml(relationship.child)}</strong></span></div><span class="breeding-status breeding-status-${escapeHtml(relationship.status)}">${escapeHtml(statusLabel(relationship.status))}</span></div>
        <p>${escapeHtml(relationship.note || 'Keine zusätzliche Notiz hinterlegt.')}</p>
        ${sources ? `<div class="breeding-sources"><span>Quellen</span>${sources}</div>` : ''}
      </article>`;
    }).join('')}</div>`;
    return visibleRelationships;
  }

  function selectTarget(name) {
    const selectedName = String(name ?? '').trim();
    selectedTarget = targetNames.find((candidate) => normalize(candidate) === normalize(selectedName)) ?? null;
    renderTarget();
    renderResults();
    if (selectedTarget && typeof onTargetChange === 'function') onTargetChange(selectedTarget);
    return selectedTarget ? getBreedingRelationshipsForChild(index, selectedTarget) : [];
  }

  function selectParent(slot, name) {
    const slotIndex = parentSlot(slot);
    if (slotIndex === null) return [];
    const selectedName = String(name ?? '').trim();
    selectedParents[slotIndex] = allNames.find((candidate) => normalize(candidate) === normalize(selectedName)) ?? null;
    renderParents();
    const found = selectedParents.every(Boolean) ? getBreedingRelationshipsForParents(index, selectedParents) : [];
    renderResults();
    return found;
  }

  renderTarget();
  renderParents();
  renderResults();

  return { selectTarget, selectParent };
}

export {
  createBreedingCalculator,
  filterBreedingRelationships,
  getPalByName,
};
