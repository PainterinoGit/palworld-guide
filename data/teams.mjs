const sourceSets = {
  combat: ['palworld-calc-1-0-tier-list', 'pindrop-verified-combat-list', 'video-pal-professor-combat-builds'],
  roaming: ['pcgamer-best-pals', 'pal-compass-role-rankings', 'video-italianspartacus-party-comps'],
  base: ['palmods-work-suitability', 'video-ragegaming-infinite-resource-base', 'video-pal-professor-work-level-10'],
};

const specialSourceSets = {
  elementCounter: [
    'palworld-calc-1-0-tier-list',
    'pindrop-verified-combat-list',
    'video-pal-professor-combat-builds',
    'video-ragegaming-op-combat-builds',
  ],
  resourceRun: [
    'palmods-work-suitability',
    'pcgamer-best-pals',
    'video-ragegaming-infinite-resource-base',
    'video-pal-professor-work-level-10',
    'video-shario-base-pals',
    'video-tropsplays-base-pals',
    'video-ragegaming-true-best-base-pals',
  ],
  raidEndgame: [
    'palworld-calc-1-0-tier-list',
    'pindrop-verified-combat-list',
    'video-pal-professor-combat-builds',
    'video-pal-professor-overpowered',
    'video-italianspartacus-party-comps',
    'video-ragegaming-op-combat-builds',
  ],
};

export const LEVEL_BANDS = [
  { id: '1-10', label: 'Level 1–10', minLevel: 1, maxLevel: 10, summary: 'Start, erste Base und grundlegende Mobilität.' },
  { id: '10-20', label: 'Level 10–20', minLevel: 10, maxLevel: 20, summary: 'Stabile Reisegruppe und erste Spezialisierung.' },
  { id: '20-30', label: 'Level 20–30', minLevel: 20, maxLevel: 30, summary: 'Mid-Game-Worker, Mount und gezielte Kampfrollen.' },
  { id: '30-40', label: 'Level 30–40', minLevel: 30, maxLevel: 40, summary: 'Zucht, Regionen und getrennte Kampf-/Base-Rollen.' },
  { id: '40-50', label: 'Level 40–50', minLevel: 40, maxLevel: 50, summary: 'Late-Game-Aufbau und Vorbereitung auf Raids.' },
  { id: '50-plus', label: 'Level 50+', minLevel: 50, maxLevel: null, summary: 'Endgame, Raids und finale Teams.' },
];

const slot = (palId, role, reason, alternativePalIds = []) => ({
  palId,
  role,
  reason,
  alternativePalIds,
  optional: palId === null,
});

const team = ({ id, levelBandId, kind, title, purpose, accessNote, switchWhen, combinationReason, slots, sources, specialty }) => ({
  id,
  levelBandId,
  kind,
  specialty,
  title,
  purpose,
  accessNote,
  useWhen: accessNote,
  switchWhen,
  combinationReason,
  slots,
  sources,
  sourceIds: sources,
});

const combat = (levelBandId, slots, details) => team({
  id: `${levelBandId}-combat`, levelBandId, kind: 'combat', slots, sources: sourceSets.combat,
  ...details,
});

const roaming = (levelBandId, slots, details) => team({
  id: `${levelBandId}-roaming`, levelBandId, kind: 'roaming', slots, sources: sourceSets.roaming,
  ...details,
});

const base = (levelBandId, slots, details) => team({
  id: `${levelBandId}-base`, levelBandId, kind: 'base', slots, sources: sourceSets.base,
  ...details,
});

export const COMBAT_TEAMS = [
  combat('1-10', [
    slot('foxparks', 'damage', 'Früher Fire-Druck und Reichweite für die ersten Kämpfe.'),
    slot('daedream', 'support', 'Der Partner-Skill liefert zusätzlichen Dark-Druck, ohne einen weiteren aktiven Slot zu verbrauchen.'),
    slot('cattiva', 'utility', 'Traglast und sofortige Verfügbarkeit halten den Start flexibel.'),
    slot('vixy', 'utility', 'Die frühe Utility lässt Ressourcen- und Fangläufe ohne Spezialzucht anlaufen.'),
    slot(null, 'flex', 'Freier Slot: nach Gegner-Element, Fangziel oder persönlicher Spielweise besetzen.', ['lamball', 'rushoar']),
  ], {
    title: 'Level 1–10 · Früher Kampf-Kern', purpose: 'Frühe Quests und sichere Kämpfe mit sofort verfügbaren Pals.',
    accessNote: 'Nach den ersten Fängen; Daedream ist nachts und Vixy in der Startregion zugänglich.',
    switchWhen: 'Sobald ein Ground-Counter, ein Mount oder ein gezielter Midgame-Carry verfügbar ist.',
    combinationReason: 'Foxparks übernimmt den frühen Schaden, Daedream ergänzt dauerhaft, Cattiva trägt und Vixy hält den Ressourcenfluss offen; der fünfte Platz bleibt bewusst situativ.',
  }),
  combat('10-20', [
    slot('rushoar', 'ground-counter', 'Ground-Abdeckung beantwortet Electric-Ziele und bietet zugleich frühe Mobilität.'),
    slot('foxparks', 'damage', 'Fire-Schaden bleibt gegen passende Ziele der verlässlichste frühe Druck.'),
    slot('daedream', 'support', 'Zusatzgeschosse stabilisieren Mehrzielkämpfe und Nachtläufe.'),
    slot('cattiva', 'utility', 'Die Traglast erhöht die Ausdauer auf Erkundungs- und Beuteläufen.'),
    slot(null, 'flex', 'Freier Slot: für das aktuelle Gebiet, einen Counter oder defensiven Fang-Support wählen.', ['eikthyrdeer', 'lamball']),
  ], {
    title: 'Level 10–20 · Übergangs-Kampfteam', purpose: 'Erste Elementantworten aufbauen, ohne die frühe Verfügbarkeit zu verlieren.',
    accessNote: 'Nach dem ersten Gebietsboss und mit Sattel-/Ausrüstungszugang für die Übergangsphase.',
    switchWhen: 'Bei Anubis-, Jormuntide-Ignis- oder Lyleen-Zugang die Übergangsplätze rollenbasiert ersetzen.',
    combinationReason: 'Rushoar ergänzt den frühen Foxparks-/Daedream-Kern um Ground, während Cattiva und der Flex-Slot die noch wechselnden Gebiete abfedern.',
  }),
  combat('20-30', [
    slot('anubis', 'carry', 'Ground-Schaden und Partner-Skill bilden den ersten belastbaren Midgame-Carry.'),
    slot('jormuntide-ignis', 'damage', 'Fire-/Dragon-Druck deckt Ice- und Grass-Ziele sowie regionale Kämpfe ab.'),
    slot('lily', 'support', 'Lyleens Heilung hält Dungeons und längere Kämpfe stabil.'),
    slot('eikthyrdeer', 'mount', 'Das erreichbare Boden-Mount verbindet Kampfteam und Midgame-Reisen.'),
    slot(null, 'element-counter', 'Freier Slot: den fünften Platz gegen das konkrete Gegner-Element besetzen.', ['foxcicle', 'rushoar', 'blazehowl']),
  ], {
    title: 'Level 20–30 · Midgame-Rollen-Kern', purpose: 'Anubis, Jormuntide Ignis, Lyleen und Eikthyrdeer bilden den stabilen Midgame-Rahmen.',
    accessNote: 'Mit Alpha-/Zuchtzugang für Anubis, Fire-Fortschritt und dem ersten verlässlichen Mount.',
    switchWhen: 'Wenn ein Bossziel feststeht oder ein später Spezialist den Carry-, Support- oder Mount-Slot klar verbessert.',
    combinationReason: 'Anubis trägt Ground, Jormuntide Ignis liefert Fire, Lyleen heilt, Eikthyrdeer verkürzt Wege und der variable Slot verhindert ein blindes Element-Mismatch.',
  }),
  combat('30-40', [
    slot('anubis', 'carry', 'Bleibt der flexible Ground-Kern für allgemeine Kämpfe und Reparaturbedarf.'),
    slot('jormuntide-ignis', 'damage', 'Fire-/Dragon-Schaden und Kindling-Synergie halten den Übergang effizient.'),
    slot('lily', 'support', 'Heilung und Sustain sichern Dungeons ohne permanente Rückkehr.'),
    slot('eikthyrdeer', 'roaming', 'Bodenmobilität bleibt für Regionen und Ressourcenwege praktisch.'),
    slot(null, 'element-counter', 'Freier Slot: nach Gebiet, Boss-Schwäche oder Resistenz auswählen.', ['foxcicle', 'blazehowl', 'frostallion']),
  ], {
    title: 'Level 30–40 · Regionales Kampfteam', purpose: 'Das Midgame-Kernteam bleibt stabil, während der fünfte Platz regionale Counter aufnimmt.',
    accessNote: 'Nach dem Aufbau von Zucht, Ability- und Elementausrüstung sowie dem Zugang zu neuen Regionen.',
    switchWhen: 'Wenn ein Flug-Mount, ein Raid-Pal oder ein Boss-spezifischer Counter den konkreten Lauf messbar verbessert.',
    combinationReason: 'Die drei Kernrollen Carry, Fire-Druck und Heilung bleiben konstant; Eikthyrdeer deckt Wege ab und der variable Slot folgt der Region statt einer alten Pauschalempfehlung.',
  }),
  combat('40-50', [
    slot('jormuntide-ignis', 'carry', 'Ein ausgebauter Fire-Carry bleibt gegen passende Lategame-Ziele effizient.'),
    slot('anubis', 'damage', 'Ground-Abdeckung und flexible Passives ergänzen den Carry.'),
    slot('frostallion', 'counter', 'Ice-Druck und Reitoption beantworten passende Dragon-/Fire-Ziele.'),
    slot('lily', 'support', 'Heilung bleibt wertvoll, bis Raid-Support und Passives final stehen.'),
    slot(null, 'counter', 'Freier Platz: Boss-Element und Resistenz vor jedem Einsatz prüfen.', ['orserk', 'frostallion-noct', 'bellanoir']),
  ], {
    title: 'Level 40–50 · Lategame-Vorbereitung', purpose: 'Ein ausgerüsteter Kern mit einem bewusst bossabhängigen Counter-Slot.',
    accessNote: 'Mit späten Regionen, verbesserter Ausrüstung und gezielter Vorbereitung auf World Tree oder Raids.',
    switchWhen: 'Sobald das Raid-Element, die Passives und der konkrete Gegenmechanismus bekannt sind.',
    combinationReason: 'Jormuntide Ignis und Anubis liefern verlässlichen Druck, Frostallion beantwortet ausgewählte Elemente, Lyleen stabilisiert und der fünfte Slot bleibt bossabhängig.',
  }),
  combat('50-plus', [
    slot('shaolong', 'carry', 'Shaolong liefert den Dragon-/Water-Endgame-Carry; Panthalus ist der gleichwertige Water-/Raid-Pfad.', ['panthalus']),
    slot('orserk', 'carry-support', 'Electric-/Dragon-Druck und Partnernutzen geben Water-Zielen eine klare Antwort.'),
    slot('bellanoir-libero', 'support', 'Raid-Support und Dark-Druck ergänzen den Carry, ohne die Counterplätze zu verbrauchen.'),
    slot('frostallion-noct', 'counter', 'Dark-/Ice-Option für ein konkretes Ziel und zusätzliche Endgame-Mobilität.'),
    slot(null, 'counter', 'Zweiter Counter: vor dem Raid nach Schwäche und Mechanik auswählen.', ['jormuntide-ignis', 'frostallion', 'orserk']),
  ], {
    title: 'Level 50+ · Endgame-Kampfteam', purpose: 'Endgame-Grundgerüst aus Carry, Orserk, Support und zwei bewusst variablen Countern.',
    accessNote: 'Erst mit World-Tree-/Raid-Zugang, gepflegten Passives und einer Ausrüstung für das konkrete Ziel.',
    switchWhen: 'Bei jeder Raid-Mechanik neu nach Boss-Element, Resistenz, Cooldowns und Rollen-Uptime besetzen.',
    combinationReason: 'Shaolong oder Panthalus trägt, Orserk liefert Electric-Druck, Bellanoir Libero unterstützt und die letzten zwei Plätze beantworten das konkrete Endgame-Ziel.',
  }),
];

export const ROAMING_TEAMS = [
  roaming('1-10', [
    slot('foxparks', 'damage', 'Reichweite hilft auf kurzen Erkundungswegen und beim kontrollierten Schwächen.'),
    slot('daedream', 'support', 'Nacht- und Dungeonläufe profitieren vom zusätzlichen Partnerdruck.'),
    slot('cattiva', 'utility', 'Traglast macht frühe Sammelwege trotz fehlendem Mount praktikabel.'),
    slot('vixy', 'resource', 'Fang- und Ressourcenläufe werden durch Ranch-/Sphere-Utility vorbereitet.'),
    slot(null, 'mount', 'Freier Platz: sobald vorhanden ein Mount oder Gebiets-Counter einsetzen.', ['rushoar', 'eikthyrdeer']),
  ], {
    title: 'Level 1–10 · Frühes Roaming', purpose: 'Kurze Fang-, Sammel- und Nachtläufe mit Utility statt falscher Base-Spezialisierung.',
    accessNote: 'Sofort nach den ersten Fängen; der fünfte Slot wartet auf Sattel oder Gebietsbedarf.',
    switchWhen: 'Sobald ein verlässliches Mount oder eine lange Ressourcenroute ansteht.',
    combinationReason: 'Foxparks und Daedream sichern Kämpfe, Cattiva trägt, Vixy unterstützt den Nachschub und der fünfte Slot bleibt für Mobilität offen.',
  }),
  roaming('10-20', [
    slot('eikthyrdeer', 'mount', 'Das Boden-Mount verkürzt Wege zwischen Base, Dungeon und Ressourcenpunkten.'),
    slot('rushoar', 'ground-counter', 'Ground-Abdeckung ergänzt das Mount gegen Electric-Ziele.'),
    slot('foxparks', 'damage', 'Fire-Druck bleibt für passende Gebiete effizient.'),
    slot('vixy', 'resource', 'Sphere- und Fangvorbereitung hält die Route produktiv.'),
    slot(null, 'flex', 'Freier Platz: Support oder weiterer Element-Counter nach Route auswählen.', ['daedream', 'lily', 'foxcicle']),
  ], {
    title: 'Level 10–20 · Mount-Roaming', purpose: 'Erste Mobilität mit einem getrennten Ressourcen- und Kampfprofil.',
    accessNote: 'Mit Eikthyrdeer-Sattel und einer Route, die längere Wege zwischen Base und Dungeons verlangt.',
    switchWhen: 'Bei Flug-Mount-Zugang, neuen Gebieten oder einer Route mit spezialisiertem Rohstoffziel.',
    combinationReason: 'Eikthyrdeer spart Zeit, Rushoar und Foxparks beantworten frühe Kämpfe, Vixy hält Fangressourcen bereit und der Flex-Slot folgt der Route.',
  }),
  roaming('20-30', [
    slot('eikthyrdeer', 'mount', 'Verlässliche Bodenmobilität bleibt der wichtigste Midgame-Reisegewinn.'),
    slot('jormuntide-ignis', 'damage', 'Fire-/Dragon-Druck deckt Vulkan- und regionale Kämpfe ab.'),
    slot('lily', 'support', 'Heilung verlängert Dungeon- und Ressourcenläufe.'),
    slot('digtoise', 'resource', 'Mining-Spezialisierung macht gezielte Erzläufe effizient.'),
    slot(null, 'element-counter', 'Freier Platz: dem Zielgebiet entsprechend kontern.', ['anubis', 'foxcicle', 'blazehowl']),
  ], {
    title: 'Level 20–30 · Midgame-Ressourcenroute', purpose: 'Mount, Sustain und Mining werden für längere Midgame-Routen getrennt kombiniert.',
    accessNote: 'Nach dem ersten Mining-/Zuchtfortschritt und mit einer festgelegten Erz- oder Dungeonroute.',
    switchWhen: 'Wenn ein Flug-Mount oder ein Bossziel die Ressourcenrolle überflüssig macht.',
    combinationReason: 'Eikthyrdeer bewegt die Gruppe, Jormuntide Ignis kämpft, Lyleen heilt, Digtoise farmt Erz und der freie Platz bleibt elementabhängig.',
  }),
  roaming('30-40', [
    slot('eikthyrdeer', 'mount', 'Bodenmobilität bleibt für regionale Wege und Materialrouten effizient.'),
    slot('anubis', 'carry', 'Ground-Schaden und Utility sichern Kämpfe auf Ressourcenwegen.'),
    slot('jormuntide-ignis', 'damage', 'Fire-Abdeckung und Burn-Druck ergänzen den Ground-Kern.'),
    slot('lily', 'support', 'Heilung reduziert Rückwege bei Dungeons und Alpha-Routen.'),
    slot(null, 'counter', 'Freier Platz: den regionalen Counter nicht durch einen Base-Worker ersetzen.', ['foxcicle', 'frostallion', 'blazehowl']),
  ], {
    title: 'Level 30–40 · Regionales Roaming', purpose: 'Kampf- und Reisegruppe für neue Regionen mit klar getrennten Base-Rollen.',
    accessNote: 'Mit regionaler Ausrüstung, ausreichenden Sphären und einem konkreten Sammel- oder Bossziel.',
    switchWhen: 'Bei langen Strecken auf ein Flug-Mount und bei Bossen auf die passende Elementantwort wechseln.',
    combinationReason: 'Anubis und Jormuntide Ignis teilen Ground-/Fire-Druck, Lyleen hält die Gruppe stabil und Eikthyrdeer plus Flex-Slot passen sich dem Gebiet an.',
  }),
  roaming('40-50', [
    slot('jetragon', 'flying-mount', 'Die hohe Geschwindigkeit senkt die Reisezeit auf späten Routen.'),
    slot('jormuntide-ignis', 'carry', 'Fire-/Dragon-Schaden deckt weiterhin passende Lategame-Ziele.'),
    slot('lily', 'support', 'Heilung bleibt eine verlässliche Absicherung auf langen Wegen.'),
    slot('frostallion', 'counter', 'Ice-Mount und Ice-Schaden beantworten konkrete Zieltypen.'),
    slot(null, 'resource-counter', 'Freier Platz: Gathering, Mining oder ein zweiter Element-Counter nach Route.', ['knocklem', 'aegidron', 'orserk']),
  ], {
    title: 'Level 40–50 · Schnelles Lategame-Roaming', purpose: 'Späte Reisezeit priorisieren, ohne Kampf- und Supportrollen zu vermischen.',
    accessNote: 'Mit legendärem Mount-Zugang oder einer gleichwertigen schnellen Reisealternative.',
    switchWhen: 'Wenn das Ziel statt Reisegeschwindigkeit einen Raid-Support oder einen speziellen Ressourcen-Pal verlangt.',
    combinationReason: 'Jetragon verkürzt Wege, Jormuntide Ignis und Frostallion bringen Elementdruck, Lyleen stabilisiert und der letzte Platz optimiert die Route.',
  }),
  roaming('50-plus', [
    slot('jetragon', 'flying-mount', 'Maximale Reisegeschwindigkeit verbindet World Tree, Raids und Ressourcenrouten.'),
    slot('shaolong', 'carry', 'Dragon-/Water-Carry bleibt auf späten Erkundungswegen kampfstark.', ['panthalus']),
    slot('orserk', 'support-counter', 'Electric-Druck und Water-Loot-Synergie helfen auf Endgame-Routen.'),
    slot('bellanoir-libero', 'support', 'Raid-Support schützt bei gefährlichen Kampfexkursionen.'),
    slot(null, 'resource-counter', 'Freier Platz: nach Farmziel Mining, Gathering oder den nötigen Boss-Counter einsetzen.', ['aegidron', 'knocklem', 'frostallion-noct']),
  ], {
    title: 'Level 50+ · Endgame-Roaming', purpose: 'Lange Endgame-Routen mit Flug-Mount, Carry, Support und situativer Ressourcenrolle.',
    accessNote: 'Mit Endgame-Mount, World-Tree-Zugang und einer Route, deren Kampf- und Farmziel bekannt ist.',
    switchWhen: 'Für einen reinen Raid das Roaming-Team gegen das boss-spezifische Spezialteam tauschen.',
    combinationReason: 'Jetragon löst Mobilität, Shaolong oder Panthalus und Orserk lösen Kämpfe, Bellanoir Libero unterstützt und der letzte Slot folgt dem Farmziel.',
  }),
];

export const BASE_TEAMS = [
  base('1-10', [
    slot('cattiva', 'production-core', 'Handiwork und Transport überbrücken die ersten Crafting- und Lagerengpässe.'),
    slot('vixy', 'production-core', 'Farming auf der Ranch baut früh Sphären- und Ressourcenreserven auf.'),
    slot('foxparks', 'production-core', 'Kindling 1 versorgt die ersten Öfen und Kochstellen.'),
    slot('rushoar', 'ore-material', 'Mining und Felsabbau liefern Baumaterial für die Startbase.'),
    slot(null, 'cooling-logistics', 'Freier Slot: Kühlung oder Transport erst bei tatsächlichem Engpass besetzen.', ['lamball', 'cattiva']),
  ], {
    title: 'Level 1–10 · Startbase-Dreiklang', purpose: 'Produktionskern, Erz/Material und Kühlung/Logistik bleiben als getrennte Aufgaben sichtbar.',
    accessNote: 'Direkt nach Palbox, Ranch und erstem Ofen; keine Zucht- oder Bossvoraussetzung.',
    switchWhen: 'Sobald ein Bereich dauerhaft wartet oder ein höherer Work-Suitability-Pal zugänglich wird.',
    combinationReason: 'Cattiva, Vixy und Foxparks starten die Produktion; Rushoar bedient Material und der variable Platz verhindert, dass frühe Base-Slots mit einer ungenutzten Kühlrolle blockiert werden.',
  }),
  base('10-20', [
    slot('cattiva', 'production-core', 'Handiwork/Transport bleibt ein flexibler Puffer für die wachsende Base.'),
    slot('foxparks', 'production-core', 'Kindling hält Küche und Öfen in der Übergangsphase am Laufen.'),
    slot('vixy', 'production-core', 'Ranch-Produktion unterstützt die Sphere-Ökonomie.'),
    slot('eikthyrdeer', 'ore-material', 'Lumbering 2 und regionale Ressourcenwege decken Materialbedarf ab.'),
    slot(null, 'cooling-logistics', 'Freier Slot: Transport oder Kühlung nach Base-Layout wählen.', ['rushoar', 'lamball']),
  ], {
    title: 'Level 10–20 · Übergangsbase', purpose: 'Der Produktionskern wächst, während Material und Logistik getrennt beobachtet werden.',
    accessNote: 'Mit erweitertem Palbox-Limit, erstem Mount und einer Base, die mehrere Verarbeitungsgebäude betreibt.',
    switchWhen: 'Bei dauerhaftem Erz-, Transport- oder Ofenengpass auf einen Spezialisten wechseln.',
    combinationReason: 'Cattiva, Foxparks und Vixy halten Kernproduktion und Nachschub offen, Eikthyrdeer übernimmt Material und der fünfte Platz reagiert auf reale Laufwege.',
  }),
  base('20-30', [
    slot('anubis', 'production-core', 'Handiwork 4 und Mining 3 verbinden Crafting mit einem wichtigen Midgame-Puffer.'),
    slot('jormuntide-ignis', 'production-core', 'Kindling 4 skaliert Öfen und Küche deutlich besser als Foxparks.'),
    slot('lily', 'production-core', 'Planting und Medicine halten Pflanzen- und Heilmittelketten flexibel.'),
    slot('digtoise', 'ore-material', 'Mining-Spezialisierung entkoppelt Erzabbau vom Produktionskern.'),
    slot(null, 'cooling-logistics', 'Freier Slot: Transport, Kühlung oder Strom nach dem größten Engpass einsetzen.', ['eikthyrdeer', 'anubis']),
  ], {
    title: 'Level 20–30 · Spezialisierte Midgame-Base', purpose: 'Produktionskern und Erz/Material sind erstmals klar getrennt; Logistik bleibt messbar.',
    accessNote: 'Mit Anubis-Zugang, Breeding Farm und mehreren laufenden Produktionsketten.',
    switchWhen: 'Wenn ein Level-8-Worker oder ein Base-Umbau einen gemessenen Engpass besser löst.',
    combinationReason: 'Anubis, Jormuntide Ignis und Lyleen bilden den Produktionskern, Digtoise hält Erz getrennt und der fünfte Slot folgt Kühl-/Transportlast.',
  }),
  base('30-40', [
    slot('anubis', 'production-core', 'Flexibles Handiwork bleibt sinnvoll, solange die Endgame-Spezialisten noch fehlen.'),
    slot('jormuntide-ignis', 'production-core', 'Kindling 4 unterstützt große Öfen und Verarbeitung.'),
    slot('lily', 'production-core', 'Planting/Medicine deckt den Verbrauch der wachsenden Base.'),
    slot('digtoise', 'ore-material', 'Gezieltes Mining hält Erz und Material außerhalb des Crafting-Kerns.'),
    slot(null, 'cooling-logistics', 'Freier Slot: Transporter oder Kühlung nach Gebäude-Layout einsetzen.', ['wumpo', 'bastigor', 'knocklem']),
  ], {
    title: 'Level 30–40 · Getrennte Rollenbase', purpose: 'Base-Produktionskern, Erz/Material und Kühlung/Logistik werden bewusst nicht vermischt.',
    accessNote: 'Mit zweiter Base oder klarer Produktionslast und regionalem Materialbedarf.',
    switchWhen: 'Bei späten Work-Leveln, langen Laufwegen oder dauerhaftem Kühl-/Transportengpass umstrukturieren.',
    combinationReason: 'Die ersten drei Slots produzieren, Digtoise farmt Material separat und der variable Logistikplatz macht das Layout zum Entscheidungskriterium.',
  }),
  base('40-50', [
    slot('solenne', 'production-core', 'Handiwork 8 reduziert Crafting- und Reparaturwartezeiten.'),
    slot('renjishi', 'production-core', 'Kindling 8 ist für Hochlast-Öfen der aktuelle Spezialistenwert.'),
    slot('dandilord', 'production-core', 'Planting 8 hält große Farmketten stabil.'),
    slot('knocklem', 'ore-material', 'Mining 7 und Transporting 7 bündeln schwere Materiallogistik.', ['aegidron']),
    slot('bastigor', 'cooling-logistics', 'Cooling 8 hält Kühllager und Produktionsketten stabil.'),
  ], {
    title: 'Level 40–50 · Lategame-Produktionsbase', purpose: 'Hohe Arbeitslevel werden nach Produktion, Material und Kühlung/Logistik getrennt eingesetzt.',
    accessNote: 'Mit späten Regionen, ausreichender Palbox-Kapazität und dauerhaft hoher Produktionslast.',
    switchWhen: 'Wenn Laufwege, Uptime oder ein anderer Engpass den nominalen Work-Level-Vorteil überwiegen.',
    combinationReason: 'Solenne, Renjishi und Dandilord bilden den Produktionskern, Knocklem löst Material/Logistik und Bastigor hält Kühlung als eigene Verantwortung.',
  }),
  base('50-plus', [
    slot('solenne', 'production-core', 'Handiwork 8 bleibt der Kern für Endgame-Crafting und Reparatur.'),
    slot('renjishi', 'production-core', 'Kindling 8 maximiert die Hochlast-Verarbeitung.'),
    slot('dandilord', 'production-core', 'Planting 8 stabilisiert große Nahrungs- und Ressourcenketten.'),
    slot('aegidron', 'ore-material', 'Mining 8 übernimmt Erz und Material als klar getrennten Endgame-Engpass.', ['knocklem']),
    slot('bastigor', 'cooling-logistics', 'Cooling 8 bildet den Kühlkern; bei Transportlast Knocklem ergänzen.', ['wumpo', 'knocklem']),
  ], {
    title: 'Level 50+ · Endgame-Produktionsbase', purpose: 'Endgame-Worker mit separatem Produktionskern, Erz/Material und Kühlung/Logistik.',
    accessNote: 'Mit World-Tree-Zugang, hoher Produktionslast und einem Base-Layout, das Spezialisten auslastet.',
    switchWhen: 'Nach gemessener Uptime und Laufweganalyse; nominale Work-Level allein sind kein Wechselgrund.',
    combinationReason: 'Solenne, Renjishi und Dandilord liefern Produktion, Aegidron löst Mining und Bastigor trennt Kühlung von der Materiallogistik.',
  }),
];

export const SPECIAL_TEAMS = [
  team({
    id: 'special-element-counter', levelBandId: '20-30', kind: 'special', specialty: 'element-counter',
    title: 'Spezialteam · Element-Counter', purpose: 'Situatives Gegenstück für einen bekannten Boss oder eine Region mit klarer Element-Schwäche.',
    accessNote: 'Nur aufstellen, wenn das Gegner-Element und die eigene Counter-Palette bekannt sind.',
    switchWhen: 'Nach dem Boss oder beim Wechsel der Resistenz zurück zum passenden Standard-/Roaming-Team.',
    combinationReason: 'Anubis und Jormuntide Ignis bilden einen Midgame-Kern, Lyleen hält ihn stabil und die beiden variablen Plätze beantworten die konkrete Schwäche.',
    sources: specialSourceSets.elementCounter,
    slots: [
      slot('anubis', 'carry', 'Grundlegender Ground-Druck gegen passende Ziele.'),
      slot('jormuntide-ignis', 'damage', 'Fire-Druck für Ziele mit Ice- oder Grass-Schwäche.'),
      slot('lily', 'support', 'Heilung für den längeren Counter-Lauf.'),
      slot(null, 'counter', 'Ersten Counter nach der bekannten Boss-Schwäche wählen.', ['frostallion', 'orserk', 'jormuntide-ignis']),
      slot(null, 'counter', 'Zweiten Counter nach Resistenz, Arena und Cooldowns wählen.', ['foxcicle', 'blazehowl', 'rushoar']),
    ],
  }),
  team({
    id: 'special-resource-run', levelBandId: '30-40', kind: 'special', specialty: 'resource-run',
    title: 'Spezialteam · Ressourcenlauf', purpose: 'Gezielte Erz-, Material- oder Sammelroute außerhalb der Base.',
    accessNote: 'Vor einer konkreten Route mit bekanntem Rohstoffziel, ausreichend Inventar und Rückweg.',
    switchWhen: 'Nach der Route zurückwechseln; für lange Wege ein schnelleres Mount priorisieren.',
    combinationReason: 'Eikthyrdeer verkürzt Bodenwege, Digtoise und Anubis lösen Erz/Material, Jormuntide Ignis schützt die Route und der letzte Platz bleibt zielabhängig.',
    sources: specialSourceSets.resourceRun,
    slots: [
      slot('eikthyrdeer', 'mount', 'Praktische Midgame-Mobilität zwischen Ressourcenpunkten.'),
      slot('digtoise', 'mining', 'Spezialisiert auf Erzadern und Materialabbau.'),
      slot('anubis', 'resource', 'Backup für Mining, Handiwork und Base-nahe Reparaturen.'),
      slot('jormuntide-ignis', 'damage', 'Fire-/Dragon-Druck auf gefährlichen Ressourcenwegen.'),
      slot(null, 'resource-counter', 'Nach Zielressource Gathering, Kühlung oder Element-Counter ergänzen.', ['foxcicle', 'wumpo', 'jetragon']),
    ],
  }),
  team({
    id: 'special-raid-endgame', levelBandId: '50-plus', kind: 'special', specialty: 'raid-endgame',
    title: 'Spezialteam · Raid / Endgame', purpose: 'Boss- und Raid-Loop mit festem Carry-/Support-Kern und zwei Counterplätzen.',
    accessNote: 'Erst nach Raid-Zugang, Endgame-Ausrüstung und Prüfung der Bossmechanik einsetzen.',
    switchWhen: 'Nach jedem Raid anhand von Element, Resistenz, Schadenfenster und Support-Uptime neu besetzen.',
    combinationReason: 'Shaolong oder Panthalus trägt, Orserk gibt Electric-Druck, Bellanoir Libero unterstützt und zwei Counterplätze bleiben dem Raidziel vorbehalten.',
    sources: specialSourceSets.raidEndgame,
    slots: [
      slot('shaolong', 'carry', 'Dragon-/Water-Carry für den Endgame-Grundrahmen.', ['panthalus']),
      slot('orserk', 'carry-support', 'Electric-/Dragon-Druck gegen passende Water-Ziele.'),
      slot('bellanoir-libero', 'support', 'Raid-Support und Dark-Schaden im langen Kampf.'),
      slot(null, 'counter', 'Erster Raid-Counter nach dem Boss-Element.', ['frostallion-noct', 'jormuntide-ignis', 'orserk']),
      slot(null, 'counter', 'Zweiter Raid-Counter nach Mechanik und Resistenz.', ['frostallion', 'bellanoir', 'jormuntide-ignis']),
    ],
  }),
];

export const TEAMS = [
  ...COMBAT_TEAMS,
  ...ROAMING_TEAMS,
  ...BASE_TEAMS,
  ...SPECIAL_TEAMS,
];
