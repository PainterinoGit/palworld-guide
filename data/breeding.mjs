const BREEDING_ROUTES = [
  { id: 'early', phase: 'Early / Mid Game', title: 'Mit einer sicheren Unique-Kombo starten', steps: [
    { order: 1, parents: 'Blazehowl + Jormuntide', result: 'Jormuntide Ignis', reason: 'Die Unique-Kombo liefert einen starken Fire-Pal und gleichzeitig Kindling für die Base.', access: 'Beide Eltern, unterschiedliche Geschlechter, Breeding Farm + Kuchen.', sources: ['palworld-calc-1-0-tier-list', 'video-pal-professor-combat-builds'] },
    { order: 2, parents: 'Moldron + Jormuntide Ignis', result: 'Anubis', reason: 'Anubis ist der zentrale Übergangspal für Ground-Kampf sowie Handiwork/Mining.', access: 'Jormuntide Ignis zuerst sichern; genaue Variante im aktuellen Breeding-Calculator gegenprüfen.', sources: ['palworld-calc-1-0-tier-list', 'pal-compass-role-rankings'] }
  ] },
  { id: 'mid', phase: 'Mid Game', title: 'Kampf und Base-Arbeit über Übergangspals abdecken', steps: [
    { order: 1, parents: 'Anubis mit guten Kampf-Passives + Fire-Partner', result: 'Jormuntide Ignis-Zuchtziel', reason: 'Fire-Kampf und Kindling lösen zwei Midgame-Engpässe gleichzeitig.', access: 'Boss-/Breeding-Zugang; die konkrete Elternpaarung vor dem Kuchenlauf verifizieren.', sources: ['palworld-calc-1-0-tier-list', 'video-pal-professor-combat-builds'] },
    { order: 2, parents: 'Lyleen-Eltern oder Lyleen + passender Dark-Partner', result: 'Lyleen Noct', reason: 'Späte Heil-/Supportoption für Teams, wenn der Zugang vorhanden ist.', access: 'Late-Breeding-Projekt; nicht als frühe Pflichtkette einplanen.', sources: ['pal-compass-role-rankings', 'video-pal-professor-overpowered'] }
  ] },
  { id: 'late', phase: 'Late Game', title: 'Spezialisten und Varianten erst zum Schluss züchten', steps: [
    { order: 1, parents: 'Frostallion + Helzephyr', result: 'Frostallion Noct', reason: 'Legendärer Dark-Mount-/Kampfpfad mit klarer Endgame-Voraussetzung.', access: 'Beide Eltern und Breeding Farm; seltene Eltern nicht für frühe Projekte verbrauchen.', sources: ['palworld-calc-1-0-tier-list', 'pal-compass-role-rankings'] },
    { order: 2, parents: 'Eidrolon Ignis mit Philanthropist + Braloha', result: 'Aegidron-Zuchtversuch', reason: 'Spezialisierter Mining-8-Pal für die Ressourcenbase; wegen Mutationschance kein verlässlicher Frühpfad.', access: 'World-Tree-/Endgame-Zugang und seltene Mutation; mehrere Versuche einplanen.', sources: ['palmods-work-suitability', 'video-ragegaming-infinite-resource-base'] }
  ] }
];

export { BREEDING_ROUTES };
