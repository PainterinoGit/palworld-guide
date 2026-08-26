const standard = (id, levelBandId, kind, title, purpose, slots, prerequisites = [], switchWhen = '') => ({ id, levelBandId, kind, title, purpose, slots, prerequisites, switchWhen });
const slot = (palId, role, reason, alternativePalIds = [], optional = false) => ({ palId, role, reason, alternativePalIds, optional });

export const LEVEL_BANDS = [
  { id: '1-10', label: 'Level 1–10', minLevel: 1, maxLevel: 10, summary: 'Start, erste Base und grundlegende Mobilität.' },
  { id: '10-20', label: 'Level 10–20', minLevel: 10, maxLevel: 20, summary: 'Stabile Reisegruppe und erste Spezialisierung.' },
  { id: '20-30', label: 'Level 20–30', minLevel: 20, maxLevel: 30, summary: 'Mid-Game-Worker, Mount und gezielte Kampfrollen.' },
  { id: '30-40', label: 'Level 30–40', minLevel: 30, maxLevel: 40, summary: 'Zucht, Regionen und getrennte Kampf-/Base-Rollen.' },
  { id: '40-50', label: 'Level 40–50', minLevel: 40, maxLevel: 50, summary: 'Late-Game-Aufbau und Vorbereitung auf Raids.' },
  { id: '50-plus', label: 'Level 50+', minLevel: 50, maxLevel: null, summary: 'Endgame, Raids und finale Teams.' },
];

export const TEAMS = LEVEL_BANDS.flatMap((band, index) => {
  const progression = [
    ['cattiva', 'foxparks', 'daedream', 'vixy'],
    ['cattiva', 'foxparks', 'rushoar', 'eikthyrdeer', null],
    ['anubis', 'blazehowl', 'foxcicle', 'eikthyrdeer', null],
    ['anubis', 'lily', 'jormuntide-ignis', 'eikthyrdeer', null],
    ['jormuntide-ignis', 'anubis', 'lily', 'frostallion', null],
    ['shadowbeak', 'jormuntide-ignis', 'jetragon', 'paladius', 'frostallion'],
  ][index];
  const combatRoles = ['primary damage', 'element coverage', 'support', 'mobility', 'variable'];
  const combat = progression.map((palId, slotIndex) => slot(palId, combatRoles[slotIndex], palId ? 'Deckt die wichtigste Rolle dieses Levelbereichs ab.' : 'Gegenwart und Ziel bestimmen diesen variablen Slot.', palId ? [] : ['foxparks', 'foxcicle'], palId === null));
  const roaming = [progression[3] ?? progression[0], progression[0], progression[1], progression[2], null].map((palId, slotIndex) => slot(palId, ['mount', 'combat', 'resource', 'support', 'variable'][slotIndex], palId ? 'Für normale Erkundung und Reisen im aktuellen Abschnitt.' : 'Frei nach Gebiet, Mount-Bedarf oder Sammelziel.', [], palId === null));
  const base = [
    ['cattiva', 'handiwork'], ['vixy', 'farming'], ['foxparks', 'kindling'], ['anubis', 'mining'], ['lily', 'planting'], [null, 'transporting'],
  ].map(([palId, role]) => slot(palId, role, palId ? 'Übernimmt diese Base-Aufgabe in der aktuellen Phase.' : 'Nur einsetzen, wenn die Produktionslast diesen Worker verlangt.', [], palId === null));
  return [
    standard(`${band.id}-combat`, band.id, 'combat', `${band.label} · Standard-Kampfteam`, 'Normale Kämpfe, Quests und Erkundungskämpfe', combat, [], 'Wenn der nächste Levelbereich oder das genannte Upgrade erreichbar ist.'),
    standard(`${band.id}-roaming`, band.id, 'roaming', `${band.label} · Roaming-/Erkundungsteam`, 'Reisen, Sammeln, Dungeons und allgemeine Erkundung', roaming, [], 'Wenn ein schnelleres Mount oder ein neues Gebiet verfügbar wird.'),
    standard(`${band.id}-base`, band.id, 'base', `${band.label} · Base-Team`, 'Produktion, Ressourcen und Worker-Aufgaben', base, [], 'Wenn eine Produktionskette dauerhaft Engpässe erzeugt.'),
  ];
});
