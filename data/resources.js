// Real screenshots for resource-hotspot pins (thepalprofessor.com originals)
// Files live in assets/images/ — extracted from the original inline base64 blobs.
const RESOURCE_IMAGES = {
    oil_s1: "assets/images/resource-oil-s1.jpg",
    oil_s2: "assets/images/resource-oil-s2.jpg",
    coal_s: "assets/images/resource-coal-s.jpg",
    starter_base: "assets/images/resource-starter-base.jpg",
    triple_base: "assets/images/resource-triple-base.jpg",
};

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
            { id: 'res-starter', name: 'Startbasis-Hotspot', tier: 's', resource: 'Allround',
               x: 232, y: 487, image: 'starter_base',
               note: 'Klassiker direkt neben Spawn – deckt sich mit unserer Base „Plateau of Beginnings Nord".' },
            { id: 'res-triple', name: 'Triple-Base-Setup', tier: 's', resource: 'Bauplatz',
               x: -251, y: 42, image: 'triple_base',
               note: 'Flach, riesige Fläche für 4-10 Basen gleichzeitig.' }
        ];
