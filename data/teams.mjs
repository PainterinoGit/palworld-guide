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

const STANDARD_TEAMS = LEVEL_BANDS.flatMap((band, index) => {
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

export const TEAMS = [
  ...STANDARD_TEAMS,
  {
    id: 'special-tower-electric', levelBandId: '10-20', kind: 'special', specialty: 'boss',
    title: 'Spezialteam · Electric-Boss', purpose: 'Nur einsetzen, wenn ein Electric-Boss oder eine Electric-Region dein Ziel ist.',
    useWhen: 'Vor dem Bosskampf mit Ground-Fokus vorbereiten.', prerequisites: ['Ground-Pal', 'Fernkampfwaffe'], switchWhen: 'Nach dem Kampf zurück auf das Standardteam wechseln.',
    slots: [slot('rushoar', 'ground counter', 'Kontert Electric mit Ground.', ['anubis']), slot('foxcicle', 'ice backup', 'Zusätzliche sichere Distanzoption.', ['foxparks']), slot(null, 'variable', 'Nach Bossmechanik oder eigener Spielweise wählen.', ['anubis', 'cattiva'], true)],
  },
  {
    id: 'special-fang', levelBandId: '20-30', kind: 'special', specialty: 'fang',
    title: 'Spezialteam · Fangen', purpose: 'Wild-Pals sicher schwächen, ohne sie versehentlich zu besiegen.',
    useWhen: 'Vor einem gezielten Fangziel oder Alpha-Encounter.', prerequisites: ['Pal Spheres', 'Schwächungs-Angriff'], switchWhen: 'Nach dem Fang zurück auf das Standardteam wechseln.',
    slots: [slot('foxparks', 'burn / weaken', 'Schwächt Ziele kontrolliert mit Fire.', []), slot('vixy', 'sphere support', 'Hilft beim Sphere-Nachschub.', []), slot(null, 'variable', 'Je nach Fangziel defensiv oder mobil wählen.', ['lamball', 'eikthyrdeer'], true)],
  },
  {
    id: 'special-resource', levelBandId: '30-40', kind: 'special', specialty: 'resource',
    title: 'Spezialteam · Ressourcenroute', purpose: 'Für Erz, Kohle und entfernte Farm-Routen.',
    useWhen: 'Wenn du gezielt eine Ressource außerhalb der Base farmst.', prerequisites: ['Mount', 'ausreichend Inventar'], switchWhen: 'Nach der Route zurück auf das Standardteam wechseln.',
    slots: [slot('eikthyrdeer', 'mount', 'Schnelle Fortbewegung zwischen Hotspots.', ['jetragon']), slot('digtoise', 'mining', 'Baut Erzadern effizient ab.', ['anubis']), slot('anubis', 'repair / utility', 'Übernimmt Mining und Handiwork als Backup.', []), slot(null, 'variable', 'Gebietsspezifisch ergänzen.', ['foxcicle', 'lily'], true)],
  },
  {
    id: 'special-raid', levelBandId: '50-plus', kind: 'special', specialty: 'raid',
    title: 'Spezialteam · Raid / World Tree', purpose: 'Für Endgame-Bosse und schwierige Raid-Loops.',
    useWhen: 'Erst einsetzen, wenn das Standardteam ausgerüstet und das Raid-Ziel bekannt ist.', prerequisites: ['Endgame-Ausrüstung', 'gepflegte Kern-Pals'], switchWhen: 'Je nach Bossmechanik und Element wechseln.',
    slots: [slot('shadowbeak', 'dark carry', 'Hoher Endgame-Schaden.', ['jormuntide-ignis']), slot('jormuntide-ignis', 'fire carry', 'Flächenschaden gegen passende Ziele.', ['blazehowl']), slot('jetragon', 'burst / mount', 'Mobilität und Burst-Schaden.', ['frostallion']), slot('paladius', 'defense', 'Defensive Absicherung.', ['lily'])],
  },
];
