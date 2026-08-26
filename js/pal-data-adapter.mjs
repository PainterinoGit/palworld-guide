function mergeUnique(current = [], additions = []) {
  return [...new Set([...current, ...additions].filter(Boolean))];
}

export function mergeGuidePalIntoDatabase(database, pal) {
  const entry = database[pal.name];
  if (!entry) return database;
  entry.types = mergeUnique(entry.types, pal.types);
  entry.roles = mergeUnique(entry.roles, pal.roles);
  entry.alternatives = mergeUnique(entry.alternatives, pal.alternatives);
  entry.upgradeTo = mergeUnique(entry.upgradeTo, pal.upgradeTo);
  entry.location ||= pal.location;
  entry.note ||= pal.whyGood;
  entry.availability ||= pal.availability;
  return database;
}

export function applyGuidePalData(database, pals) {
  pals.forEach(pal => mergeGuidePalIntoDatabase(database, pal));
  return database;
}
