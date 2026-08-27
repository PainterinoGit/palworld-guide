const CONTEXT_KEYS = ['combat', 'base', 'roaming', 'progression'];
const GOAL_CONTEXTS = {
  combat: 'combat',
  fang: 'combat',
  worker: 'base',
  mount: 'roaming',
  upgrade: 'progression',
};

const unique = values => [...new Set(values.filter(Boolean))];

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function emptyContexts() {
  return Object.fromEntries(CONTEXT_KEYS.map(key => [key, null]));
}

function makeReferenceEntry(pal) {
  const name = asText(pal.name);
  return {
    id: asText(pal.id) || slugify(name),
    name,
    aliases: [],
    canonicalId: asText(pal.id) || slugify(name),
    image: name,
    types: asArray(pal.types),
    tier: asText(pal.tier) || null,
    stages: asText(pal.stage) ? [pal.stage] : [],
    partnerSkill: asText(pal.partnerSkill) || null,
    workSuitability: { ...(pal.workSuitability || {}) },
    location: asText(pal.location) || null,
    roles: [],
    contexts: emptyContexts(),
    whyGood: null,
    bestFor: null,
    switchWhen: null,
    alternatives: [],
    alternativeIds: [],
    upgradeFrom: [],
    upgradeFromIds: [],
    upgradeTo: [],
    upgradeToIds: [],
    active: false,
    featured: false,
    sourceStatus: null,
  };
}

function sourceStatusFor(pal, sourceCatalog) {
  const sourceById = new Map(asArray(sourceCatalog).map(source => [source.id, source]));
  const sourceIds = asArray(pal.sources);
  const sources = sourceIds.map(id => {
    const source = sourceById.get(id);
    return source ? { id: source.id, title: source.title, url: source.url } : { id };
  });
  return {
    sourceIds,
    sources,
    patchScope: asText(pal.patchScope) || null,
    checkedAt: asText(pal.checkedAt) || null,
    confidence: asText(pal.confidence) || null,
    label: [asText(pal.patchScope), asText(pal.checkedAt) ? `geprüft am ${pal.checkedAt}` : '']
      .filter(Boolean)
      .join(' · '),
  };
}

function validateActiveMeta(pal) {
  const missing = [];
  for (const field of ['whyGood', 'bestFor', 'switchWhen', 'patchScope', 'checkedAt', 'confidence']) {
    if (!asText(pal[field])) missing.push(field);
  }
  if (!asArray(pal.sources).length) missing.push('sources');
  for (const contextKey of CONTEXT_KEYS) {
    const context = pal[contextKey];
    if (!context || !asArray(context.roles).length) {
      missing.push(`${contextKey}.roles`);
      continue;
    }
    for (const field of ['reason', 'bestFor', 'switchWhen']) {
      if (!asText(context[field])) missing.push(`${contextKey}.${field}`);
    }
  }
  if (missing.length) {
    throw new Error(`Aktive Pal-Meta ${pal.id || pal.name} unvollständig: ${missing.join(', ')}`);
  }
}

function buildTargetNameMap(database, pals) {
  const targets = new Map();
  Object.values(database).forEach(entry => {
    [entry.id, entry.canonicalId, entry.name, ...entry.aliases].forEach(key => {
      if (key) targets.set(String(key).toLowerCase(), entry.name);
    });
  });
  asArray(pals).forEach(pal => {
    const name = asText(pal.name);
    [pal.id, pal.canonicalId, name, ...asArray(pal.aliases)].forEach(key => {
      if (key) targets.set(String(key).toLowerCase(), name);
    });
  });
  return targets;
}

function resolveTargetNames(values, targetNames) {
  return asArray(values).map(value => targetNames.get(String(value).toLowerCase()) || value);
}

function applyCurrentMeta(entry, pal, targetNames, sourceCatalog) {
  validateActiveMeta(pal);
  const contexts = Object.fromEntries(CONTEXT_KEYS.map(key => [key, { ...pal[key], roles: [...pal[key].roles] }]));
  const roles = unique(CONTEXT_KEYS.flatMap(key => contexts[key].roles));
  const alternativeIds = asArray(pal.alternatives);
  const upgradeFromIds = asArray(pal.upgradeFrom);
  const upgradeToIds = asArray(pal.upgradeTo);

  return {
    ...entry,
    id: asText(pal.id) || entry.id,
    name: asText(pal.name) || entry.name,
    aliases: unique(asArray(pal.aliases)),
    canonicalId: asText(pal.canonicalId) || asText(pal.id) || entry.canonicalId,
    image: asText(pal.image) || asText(pal.name) || entry.image,
    types: asArray(pal.types).length ? [...pal.types] : entry.types,
    tier: asText(pal.tier) || entry.tier,
    stages: contexts.progression.phase ? [contexts.progression.phase] : entry.stages,
    partnerSkill: asText(pal.partnerSkill) || entry.partnerSkill,
    workSuitability: { ...(pal.workSuitability || {}) },
    location: asText(pal.location) || entry.location,
    roles,
    contexts,
    whyGood: asText(pal.whyGood),
    bestFor: asText(pal.bestFor),
    switchWhen: asText(pal.switchWhen),
    alternatives: resolveTargetNames(alternativeIds, targetNames),
    alternativeIds,
    upgradeFrom: resolveTargetNames(upgradeFromIds, targetNames),
    upgradeFromIds,
    upgradeTo: resolveTargetNames(upgradeToIds, targetNames),
    upgradeToIds,
    availability: asText(pal.availability) || null,
    active: true,
    featured: true,
    sourceStatus: sourceStatusFor(pal, sourceCatalog),
  };
}

export function buildPalDatabase(roster = [], metaPals = [], sourceCatalog = []) {
  const database = {};
  asArray(roster).forEach(pal => {
    const entry = makeReferenceEntry(pal);
    if (entry.name) database[entry.name] = entry;
  });

  const activePals = asArray(metaPals).filter(pal => pal.isActiveRecommendation === true);
  activePals.forEach(pal => {
    const name = asText(pal.name);
    if (!name) return;
    if (!database[name]) database[name] = makeReferenceEntry(pal);
  });

  const targetNames = buildTargetNameMap(database, activePals);
  activePals.forEach(pal => {
    const name = asText(pal.name);
    database[name] = applyCurrentMeta(database[name], pal, targetNames, sourceCatalog);
  });
  return database;
}

export function resolvePalEntry(database, identifier) {
  const needle = asText(identifier).toLowerCase();
  if (!needle) return null;
  return Object.values(database || {}).find(entry => [
    entry.id,
    entry.canonicalId,
    entry.name,
    ...(entry.aliases || []),
  ].some(value => asText(value).toLowerCase() === needle)) || null;
}

export function resolvePalImageName(database, identifier) {
  const entry = resolvePalEntry(database, identifier);
  return entry?.image || entry?.name || asText(identifier);
}

export function matchesPalGoal(entry, goal) {
  if (goal === 'all') return true;
  if (!entry) return false;
  if (goal === 'worker') {
    return Boolean(entry.contexts?.base?.roles?.length || Object.keys(entry.workSuitability || {}).length);
  }
  if (goal === 'mount') {
    return Boolean(
      entry.contexts?.roaming?.roles?.some(role => ['mount', 'flying-mount', 'ground-mount'].includes(role))
      || /mount|reitbar|reittier/i.test(entry.partnerSkill || '')
    );
  }
  if (goal === 'fang') {
    return Boolean(entry.contexts?.combat?.roles?.some(role => ['counter', 'support'].includes(role)));
  }
  if (goal === 'upgrade') {
    return Boolean(entry.active && (entry.upgradeFromIds?.length || entry.upgradeToIds?.length || entry.contexts?.progression));
  }
  const contextKey = GOAL_CONTEXTS[goal];
  return Boolean(contextKey && entry.contexts?.[contextKey]?.roles?.length);
}

export function getPalDetails(entry, goal = 'all') {
  const contextKey = GOAL_CONTEXTS[goal];
  const context = contextKey ? entry?.contexts?.[contextKey] : null;
  const active = Boolean(entry?.active);
  return {
    image: entry?.image || entry?.name || '',
    location: entry?.location || 'Fundort noch nicht hinterlegt.',
    reason: context?.reason || (active ? entry.whyGood : null),
    bestFor: context?.bestFor || (active ? entry.bestFor : null),
    alternatives: entry?.alternatives || [],
    switchWhen: context?.switchWhen || (active ? entry.switchWhen : null),
    sourceStatus: entry?.sourceStatus || null,
  };
}

// Compatibility wrapper for callers that already have a seeded database.
// It keeps the object identity while applying only active, validated meta data.
export function applyGuidePalData(database, pals, sourceCatalog = []) {
  const merged = buildPalDatabase(Object.values(database || {}), pals, sourceCatalog);
  Object.keys(database).forEach(key => delete database[key]);
  Object.assign(database, merged);
  return database;
}
