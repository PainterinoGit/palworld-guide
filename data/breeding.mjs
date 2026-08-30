// Curated 1.0+ roadmap: the important projects, not an exhaustive calculator dump.
const CALC = ['palworld-gg-breeding-calculator', 'pal-compass-role-rankings'];

const BREEDING_ROUTES = [
  {
    id: 'early-core', phase: 'Early / Mid Game', title: 'Die Kernlinie für Kampf und Base',
    steps: [
      { order: 1, parents: 'Blazehowl + Jormuntide', result: 'Jormuntide Ignis', kind: 'Garantierter Ziel-Pal', priority: 'P1', reason: 'Starker Fire-Kampfpal und zuverlässiges Kindling für die erste Produktionsbase.', access: 'Beide Eltern sichern, Geschlecht prüfen und die Paarung im Calculator bestätigen.', sources: CALC },
      { order: 2, parents: 'Moldron + Jormuntide Ignis', result: 'Anubis', kind: 'Übergangspal', priority: 'P1', reason: 'Der wichtigste frühe Allrounder für Handiwork, Mining und Ground-Kampf.', access: 'Nach dem Jormuntide-Ignis-Schritt; gute Eltern mit gewünschten Passives weiterzüchten.', sources: CALC }
    ]
  },
  {
    id: 'base-specialists', phase: 'Mid Game · Base', title: 'Die wichtigsten Base-Spezialisten',
    steps: [
      { order: 1, parents: 'Anubis mit gewünschten Arbeits-Passives + passender Partner', result: 'Anubis-Arbeitslinie', kind: 'Passive-/IV-Zucht', priority: 'P1', reason: 'Zuerst Anubis perfektionieren, bevor seltene Endgame-Pals gezüchtet werden.', access: 'Die exakte Paarung und das Ergebnis vor jedem Kuchenlauf im Calculator prüfen; die Arten sind nicht frei wählbar.', sources: CALC },
      { order: 2, parents: 'Lyleen-Eltern + passender Dark-Partner', result: 'Lyleen Noct', kind: 'Spezialprojekt', priority: 'P2', reason: 'Starker Support-/Heil-Pal für spätere Kampf- und Erkundungsteams.', access: 'Optional: erst starten, wenn beide Eltern verfügbar sind; kein Pflichtschritt für die Base.', sources: CALC },
      { order: 3, parents: 'Fach-Pal-Eltern nach Calculator', result: 'Orserk, Knocklem oder Dandilord', kind: 'Base-Ausbau', priority: 'P2', reason: 'Gezielte Linien für Electricity, Transport, Mining und Planting – je nach Base-Aufteilung.', access: 'Nur züchten, wenn der Pal nicht effizient gefangen werden kann oder perfekte Arbeits-Passives benötigt werden.', sources: ['palmods-work-suitability', ...CALC] }
    ]
  },
  {
    id: 'breeding-support', phase: 'Breeding-Support', title: 'Breeding-Support und Eltern vorbereiten',
    steps: [
      { order: 1, parents: 'Croajiro Noct + Tetroise Primo', result: 'Braloha', kind: 'Support-Pal', priority: 'P1', reason: 'Braloha verkürzt die Zeit bis neue Eier entstehen und gehört in die Breeding-Base, sobald verfügbar.', access: 'Wild ab höherem Level oder über diese konkrete Zuchtlinie; nur einen guten Support-Pal einplanen.', sources: ['palmods-early-breeding-route', 'palmods-work-suitability'] },
      { order: 2, parents: 'Zwei Ziel-Eltern mit Philanthropist', result: 'Zucht-Eltern mit schnellerer Farm', kind: 'Optionaler Booster', priority: 'P2', reason: 'Philanthropist ist ein Bonus für die Zuchtgeschwindigkeit, aber kein eigener Ziel-Pal.', access: 'Nur auf Eltern vererben, die ohnehin für das Endziel gebaut werden; nicht für jede frühe Linie neu anfangen.', sources: CALC },
      { order: 3, parents: 'Eltern mit 3–4 gewünschten Passives + IVs', result: 'Endgültiger Kampf-/Arbeits-Pal', kind: 'Endausbau', priority: 'P1', reason: 'Passives und IVs erst am finalen Ziel konzentrieren; freie Slots erhöhen Mutation und Ausschuss.', access: 'Nach dem Ziel-Pal mehrere Eier laufen lassen, gute Nachkommen behalten und anschließend kondensieren.', sources: CALC }
    ]
  },
  {
    id: 'current-utility-combos', phase: '1.0 · Aktuelle Utility-Kombos', title: 'Aktuelle 1.0-Kombos nach Engpass',
    steps: [
      { order: 1, parents: 'Polapup + Jolthog oder Penking + Cinnamoth', result: 'Beegarde', kind: 'Kuchenversorgung', priority: 'P1', reason: 'Honey ist der wiederkehrende Flaschenhals für jede größere Breeding-Session.', access: 'Eine passende Elternpaarung aus dem eigenen Palbox-Bestand wählen und im aktuellen Calculator bestätigen.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 2, parents: 'Leafan + Lamball oder Pupperai + Bakemi', result: 'Yakumo', kind: 'Passive-/Capture-Projekt', priority: 'P1', reason: 'Yakumo vorbereitet gezielte Passive für spätere Captures und ergänzt die Dog-Coin-Route.', access: 'Nur mit den gewünschten Passives auf die Trägerlinie gehen; die genaue Partner-Skill-Wirkung im Spielstand testen.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 3, parents: 'Bushi + Bushi Noct oder Grizzbolt + Solmora', result: 'Suzaku', kind: 'Kindling-Spezialist', priority: 'P2', reason: 'Sinnvoll, wenn Öfen und Kuchenproduktion der Produktionsengpass sind.', access: 'Nur vor Anubis oder einem Endgame-Kampfprojekt priorisieren, wenn Kindling tatsächlich bremst.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 4, parents: 'Grizzbolt + Flambelle oder Rooby + Bushi Noct', result: 'Azurobe', kind: 'Watering-Spezialist', priority: 'P2', reason: 'Gezielte Watering-Linie für Plantagen und Mühlen, wenn die Basis dort Zeit verliert.', access: 'Bei stabilem Watering nicht aus Komfortgründen züchten; vorher die Laufwege der Base prüfen.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 5, parents: 'Vanwyrm + Wumpo oder Penking + Blazamut', result: 'Palumba', kind: 'Reise-Utility', priority: 'P3', reason: 'Ein praktisches Boden-Mount für wiederkehrende Routen, aber nach Produktion und Kernkampf.', access: 'Nur starten, wenn die Route tatsächlich Zeit kostet und kein vorhandenes Mount genügt.', sources: ['palworld-gg-breeding-calculator'] }
    ]
  },
  {
    id: 'current-world-tree-combos', phase: '1.0 · World Tree', title: 'World-Tree-Ziele und Sonderfälle',
    steps: [
      { order: 1, parents: 'Eidrolon-Eltern nach Calculator', result: 'Eidrolon', kind: 'World-Tree-Mount', priority: 'P2', reason: 'Skaliert mit Dragon-/Dark-Teams und öffnet weitere Endgame-Routen.', access: 'Erst nach World-Tree-Zugang und gesicherten Eltern; kein früher Pflichtschritt.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 2, parents: 'Eltern nach aktuellem Calculator', result: 'Aegidron', kind: 'Spezialprojekt', priority: 'P3', reason: 'Reduziert Explosionsschaden und schützt vor Betäubung – besonders für definierte Raid-Mechaniken.', access: 'Zuchtziel nur wählen, wenn diese Schutzwirkung gebraucht wird; sonst Fang-/Raid-Route bevorzugen.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 3, parents: 'Zwei Pals derselben Art', result: 'Self-only-Pals', kind: 'Sonderfall', priority: 'P2', reason: 'Einige Spitzenpals haben keine nutzbare Fremdpaarung und können nur artgleich vermehrt werden.', access: 'Männliches und weibliches Exemplar zuerst fangen; darunter fallen u.a. Bastigor, Jetragon, Shadowbeak und Xenolord.', sources: ['palworld-gg-breeding-calculator'] },
      { order: 4, parents: 'Weibliche Katress + männlicher Wixen / männliche Katress + weibliche Wixen', result: 'Katress Ignis / Wixen Noct', kind: 'Geschlechtsabhängige Sonderkombi', priority: 'P3', reason: 'Die beiden Paarungen liefern je nach Geschlecht unterschiedliche Varianten.', access: 'Geschlecht vor dem Einsetzen prüfen und die gewünschte Variante im Calculator bestätigen.', sources: ['palworld-gg-breeding-calculator'] }
    ]
  },
  {
    id: 'endgame-mounts', phase: 'Late Game · Kampf & Mounts', title: 'Nur die wichtigsten Endgame-Projekte',
    steps: [
      { order: 1, parents: 'Frostallion + Helzephyr', result: 'Frostallion Noct', kind: 'Legendärer Variant-Pal', priority: 'P2', reason: 'Endgame-Dark-Mount und Kampfprojekt mit hohem Elternaufwand.', access: 'Beide seltenen Eltern zuerst sichern; optional, nicht für den normalen Fortschritt nötig.', sources: CALC },
      { order: 2, parents: 'Gefangener Ziel-Pal + passive/IV-Eltern', result: 'Shadowbeak oder Faleris-Linie', kind: 'Kampf-/Mount-Ausbau', priority: 'P2', reason: 'Bei diesen Endgame-Pals lohnt Breeding primär für perfekte Passives, IVs und Kondensation.', access: 'Kein fester Universalpfad: das konkrete Paar und Ergebnis immer im Calculator prüfen.', sources: CALC },
      { order: 3, parents: 'Gefangener Jetragon / Raid-Pal', result: 'Perfekte Endgame-Version', kind: 'Catch-first-Projekt', priority: 'P3', reason: 'Viele Endgame-Pals werden effizienter gefangen; züchte sie erst danach für Passives und IVs.', access: 'Nicht garantiert züchtbar oder nicht effizient als Erstzugang – Fang, Eltern und Variantentyp vorher prüfen.', sources: CALC }
    ]
  },
  {
    id: 'special-variants', phase: 'Late Game · Spezialzucht', title: 'Seltene Varianten und Mutationen zuletzt',
    steps: [
      { order: 1, parents: 'Eidolon Ignis mit Philanthropist + Braloha', result: 'Aegidron-Zuchtversuch', kind: 'Nicht garantierte Spezialzucht', priority: 'P3', reason: 'Seltener Mining-8-Versuch mit keiner verlässlichen Standard-Trefferquote – nicht als Pflichtpfad behandeln.', access: 'World-Tree-/Endgame-Zugang, mehrere Versuche und ausreichend Kuchen einplanen.', sources: ['palmods-work-suitability'] }
    ]
  }
];

export { BREEDING_ROUTES };
