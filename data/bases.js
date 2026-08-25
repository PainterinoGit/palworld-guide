// Base location data — coordinates in Paldeck format (-1000 to 1000)
        const BASES = [
            {
                id: 'plateau-nord', name: 'Plateau of Beginnings – Nord', stage: 'early',
                x: 233, y: 488,
                resources: 'Stein, Holz, Paldium-Fragmente',
                note: 'Direkt am Startgebiet, leicht erreichbar mit natürlichen Engstellen als Verteidigung gegen Raids.'
            },
            {
                id: 'plateau-sued', name: 'Plateau of Beginnings – Süd', stage: 'early',
                x: 264, y: 548,
                resources: 'Paldium-Fragmente, Erz, Dungeon-Zugang',
                note: 'Große Fläche direkt neben einem Dungeon – praktisch für Material- und Pal-Sphere-Farming zum Start.'
            },
            {
                id: 'golden-hills', name: 'Golden Hills (Erz-Cluster)', stage: 'early',
                x: 4, y: 526,
                resources: 'Dicht gepackte Erz-Vorkommen, Wald',
                note: 'Sehr kompaktes Erz-Cluster, gut zu verteidigen. Etwas eng für spätere Erweiterung.'
            },
            {
                id: 'sunlit-isle', name: 'The Sunlit Isle (Öl-Farm)', stage: 'early',
                x: 405, y: 483,
                resources: '6 Rohöl-Knoten',
                note: 'Ungewöhnlich früh erreichbare Öl-Quelle, nur niedrigstufige Pals in der Nähe – leicht zu verteidigen.'
            },
            {
                id: 'ore-coal-plateau', name: 'Erz- & Kohle-Plateau (Sealed Realm)', stage: 'mid',
                x: 136, y: 20,
                resources: 'Erz, Kohle, Holz',
                note: 'In mehreren Guides die höchstbewertete Mid-Game-Base – große Flächen mit gleich drei wichtigen Ressourcen.'
            },
            {
                id: 'cinnamoth-forest', name: 'South of Cinnamoth Forest', stage: 'mid',
                x: -77, y: 310,
                resources: 'Erz, Holz, Schwefel (nahe)',
                note: 'Große flache Fläche für Basis-Ausbau, Schwefel in der Nähe wichtig für Schießpulver-Produktion.'
            },
            {
                id: 'investigators-fork', name: "East Investigator's Fork", stage: 'mid',
                x: -183, y: -110,
                resources: 'Hartholz, Erz, Schwefel',
                note: 'Guter Kompromiss-Standort südlich der Twilight Dunes mit drei nutzbaren Ressourcentypen.'
            },
            {
                id: 'quartz-safe', name: 'Quartz Safe Spot', stage: 'mid',
                x: -166, y: 184,
                resources: 'Quarz-Vorkommen',
                note: 'Ruhige, gut zu verteidigende Lage mit Fokus auf Quarz – wichtig für Kondensatoren & Technik-Items.'
            },
            {
                id: 'mount-obsidian', name: 'Mount Obsidian', stage: 'late',
                x: -571, y: -648,
                resources: 'Kohle, Skill Fruits',
                note: 'Zentral für den späten Tech-Tree, der viel Kohle benötigt. Bergige, wilde Lage.'
            },
            {
                id: 'mount-obsidian-west', name: 'Mount Obsidian West', stage: 'late',
                x: -620, y: -280,
                resources: 'Reiche Schwefel-Vorkommen',
                note: 'Für fortgeschrittene Waffenproduktion – große Mengen Schwefel in Reichweite.'
            },
            {
                id: 'sakurajima', name: 'Sakurajima Oil Farm', stage: 'late',
                x: 60, y: -580,
                resources: 'Kohle, Schwefel, Öl',
                note: 'Große flache Baufläche mit Dungeon und Wasserfall in der Nähe – guter Allround-Endgame-Standort.'
            },
            {
                id: 'oil2-kinship', name: 'Oil-Farm + Kinship Peach', stage: 'late',
                x: 794, y: 278,
                resources: '3 Öl-Knoten, Kinship Peach',
                note: 'Auf einem Öl-Knoten lassen sich hier 2 Ölraffinerien gleichzeitig platzieren – sehr effizient.'
            },
            {
                id: 'abandoned-ruins', name: 'Abandoned Ruins', stage: 'safe',
                x: -82, y: 190,
                resources: 'Keine Rohstoffe direkt vor Ort',
                note: '"Unantastbar" bei Raids dank erhöhter Position auf alten Ruinen – reiner Sicherheits-Standort.'
            },
            {
                id: 'frostbound-foot', name: 'Foot of Frostbound Mountains', stage: 'safe',
                x: 249, y: 17,
                resources: 'Wenig, dafür Grenzlage zwischen Biomen',
                note: 'Klippenlage zwischen mehreren Biomen, dadurch schwer zu raiden.'
            },
            {
                id: 'world-tree', name: 'World Tree Entrance', stage: 'safe',
                x: 634, y: 750,
                resources: 'Keine – reine Ruhe-Base',
                note: 'Abgelegener Endgame-Rückzugsort ohne Ressourcen und ohne Gefahren, nur zur Aussicht/als Zweitbase.'
            },
        ];
