// Real screenshots for resource-hotspot pins (thepalprofessor.com originals)
// Files live in assets/images/ — extracted from the original inline base64 blobs.
const RESOURCE_IMAGES = {
    oil_s1: "assets/images/resource-oil-s1.jpg",
    oil_s2: "assets/images/resource-oil-s2.jpg",
    coal_s: "assets/images/resource-coal-s.jpg",
    starter_base: "assets/images/resource-starter-base.jpg",
    triple_base: "assets/images/resource-triple-base.jpg",
};

// Compact raw-material reference used by the resource database below.
const RESOURCE_CATALOG = [
    { id: 'wood', name: 'Holz', category: 'Organisch', early: 'Bäume und Holzfällplatz in jeder Startregion', durable: 'Holzfällplatz in der Basis', locations: 'Überall auf den Inseln', coords: '—', rarity: 'Häufig', note: 'Grundmaterial für Werkzeuge, Bauten und frühe Produktion.' },
    { id: 'stone', name: 'Stein', category: 'Mineral', early: 'Steinbrocken rund um den Spawn', durable: 'Steinbruch in der Basis', locations: 'Überall; große Cluster an Basen', coords: '—', rarity: 'Häufig', note: 'Früh per Hand sammeln, später über den Steinbruch automatisieren.' },
    { id: 'fiber', name: 'Fasern', category: 'Organisch', early: 'Büsche und Pflanzen im Startgebiet', durable: 'Faserplantage bzw. passende Drops', locations: 'Grasland und Waldregionen', coords: '—', rarity: 'Häufig', note: 'Wichtig für Betten, Stoff, Seile und frühe Ausrüstung.' },
    { id: 'paldium', name: 'Paldium', category: 'Mineral', early: 'Blaue Paldium-Knoten nahe dem Spawn', durable: 'Paldium-Knoten und Brecher', locations: 'Flüsse, Strände und blaue Knoten', coords: '—', rarity: 'Häufig', note: 'Für Sphären, Palbox, Reparaturen und Technologie.' },
    { id: 'ore', name: 'Erz', category: 'Mineral', early: 'Windswept Hills, 8–9 Knoten', durable: 'Moonless Shore, 10 Knoten je Cluster', locations: 'Moonless Shore; Windswept Hills', coords: '(-76, -319) · (96, -258)', rarity: 'Wichtig', note: 'Natürliche Knoten sind bis zum Mining Site oft schneller.', image: null },
    { id: 'coal', name: 'Kohle', category: 'Mineral', early: 'Mossanda Forest, kombiniert mit Erz', durable: 'Kohle-Cluster mit 6–9 Knoten', locations: 'Mossanda Forest; Mount Obsidian', coords: '(185, -30) · (328, 494)', rarity: 'Selten', note: 'Für Schießpulver und fortgeschrittene Produktion; Kohlemine ab Tech 41.', image: 'coal_s' },
    { id: 'sulfur', name: 'Schwefel', category: 'Mineral', early: 'Vulkanregionen; einzelne Knoten nahe Kohle', durable: 'Sulfur-Cluster mit 7–8 Knoten', locations: 'Mount Obsidian', coords: '(-590, -403) · (-741, 442)', rarity: 'Selten', note: 'Für Schießpulver; Schwefelmine ab Tech 45.', image: null },
    { id: 'quartz', name: 'Reiner Quarz', category: 'Mineral', early: 'Gefrorene Regionen manuell abbauen', durable: 'Pure-Quartz-Mining-Site', locations: 'Astral Mountains und Feybreak', coords: 'Gebietsabhängig', rarity: 'Selten', note: 'Später für Elektronik und High-Tech-Bauten; nicht jeder Standort ist auf der Basiskarte.', image: null },
    { id: 'crude-oil', name: 'Rohöl', category: 'Flüssigkeit', early: 'Öl-Nodes an der Küste', durable: 'Ölextraktor auf Öl-Nodes', locations: 'Oasis Isle; Ölstandorte im Meer', coords: '(885, 195) · (396, -466)', rarity: 'Sehr selten', note: 'Für Plasteel und spätere Produktion; 3-Nodes-Spots sind besonders wertvoll.', image: 'oil_s1' },
    { id: 'hexolite', name: 'Hexolith', category: 'DLC-Mineral', early: 'Feybreak-Küste ab höherem Level', durable: 'Hexolith-Mining-Site bzw. 2–3 Node-Spots', locations: 'Feybreak', coords: '(-1067, -1428) · (-1331, -1288)', rarity: 'Sehr selten', note: 'Außerhalb der Basiskarte; für späte Feybreak-Strukturen.', image: null },
    { id: 'chromite', name: 'Chromit', category: 'DLC-Mineral', early: 'Feybreak-Schrott-/Abbaugebiete', durable: 'Cluster rund um Feybreak-Basen', locations: 'Feybreak, nahe Hexolith-Spots', coords: 'Außerhalb der Basiskarte', rarity: 'Sehr selten', note: 'Späte DLC-Ressource; im Guide zunächst als Gebietsinfo geführt.', image: null },
];

        // Resource-hotspot locations (Hexolite/Öl/Kohle/Erz clusters), separate from BASES.
        // Coordinates cross-checked against the real map image; Hexolite entries lie outside
        // the -1000/1000 range (Feybreak-DLC area) and are listed but not plotted.
        const RESOURCES = [
            { id: 'res-oil-s1', name: 'Öl S-Tier (Oasis Isle)', tier: 's', resource: 'Öl',
               x: 794, y: 278, image: 'oil_s1',
               note: 'Triple-Öl, flach, 2× Trust-Peach-Spawns. Kleine Insel, gleiche Position wie unsere Base „Oil Kinship".' },
            { id: 'res-oil-s2', name: 'Öl S-Tier', tier: 's', resource: 'Öl',
               x: 396, y: 466, image: 'oil_s2',
               note: 'Triple-Öl, 5 Elemental Chests, 2× Trust-Peach-Spawns.' },
            { id: 'res-coal-s', name: 'Kohle S-Tier', tier: 's', resource: 'Kohle',
               x: 328, y: 494, image: 'coal_s',
               note: '6–9 Kohle-Knoten je nach Palbox-Platzierung.' },
            { id: 'res-coal-a', name: 'Kohle A-Tier', tier: 'a', resource: 'Kohle',
               x: 185, y: 30, image: null,
               note: '6 Kohle + 8 Erz kombiniert.' },
            { id: 'res-ore-s1', name: 'Erz S-Tier (max.)', tier: 's', resource: 'Erz',
               x: -76, y: 319, image: null,
               note: 'Je 10 Erz-Knoten (Moonless Shore) – zwei Standorte in unmittelbarer Nähe.' },
            { id: 'res-ore-s2', name: 'Erz S-Tier (max.)', tier: 's', resource: 'Erz',
               x: 96, y: 258, image: null,
               note: 'Je 10 Erz-Knoten (Moonless Shore) – Partnerstandort zu Erz S-Tier #1.' },
            { id: 'res-ore-a', name: 'Erz A-Tier (früh)', tier: 'a', resource: 'Erz',
               x: 71, y: 408, image: null,
               note: '8 Erz-Knoten, ideal für eine frühe zweite Base.' },
            { id: 'res-sulfur-s', name: 'Schwefel S-Tier', tier: 's', resource: 'Schwefel',
               x: -590, y: 403, image: null,
               note: '8 Schwefel-Knoten; Vulkanregion, schwebende Pals werden empfohlen.' },
            { id: 'res-starter', name: 'Startbasis-Hotspot', tier: 's', resource: 'Allround',
               x: 232, y: 487, image: 'starter_base',
               note: 'Klassiker direkt neben Spawn – deckt sich mit unserer Base „Plateau of Beginnings Nord".' },
            { id: 'res-triple', name: 'Triple-Base-Setup', tier: 's', resource: 'Bauplatz',
               x: -251, y: 42, image: 'triple_base',
               note: 'Flach, riesige Fläche für 4-10 Basen gleichzeitig.' }
        ];
