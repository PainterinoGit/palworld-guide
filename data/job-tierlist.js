// Curated Patch 1.0+ job rankings. metaScore balances the raw work level
// with speed, footprint, uptime and community practice instead of ranking
// by the numeric suitability value alone.
const JOB_TIERLIST = [
    { job: 'Mining', icon: '⛏️', entries: [
        { pal: 'Anubis', tier: 'S', workLevel: 3, metaScore: 98, speed: 5, size: 5, community: 5, why: 'Extrem schnell und kompakt; Handiwork plus Mining machen ihn zum stärksten Allrounder für Erz und Paldium.' },
        { pal: 'Astegon', tier: 'S', workLevel: 4, metaScore: 96, speed: 3, size: 2, community: 5, why: 'Sehr hoher Mining-Wert und stark bei großen Clustern, braucht aber mehr Platz und ist später verfügbar.' },
        { pal: 'Digtoise', tier: 'A', workLevel: 3, metaScore: 91, speed: 4, size: 4, community: 4, why: 'Hohe Abbaugeschwindigkeit im frühen bis mittleren Spiel; besonders gut als spezialisierter Minenarbeiter.' },
    ] },
    { job: 'Transport', icon: '📦', entries: [
        { pal: 'Wumpo', tier: 'S', workLevel: 4, metaScore: 97, speed: 4, size: 2, community: 5, why: 'Hohe Traglast und große Transportreichweite; stark für große Produktionsbasen trotz größerem Körper.' },
        { pal: 'Vanwyrm', tier: 'A', workLevel: 3, metaScore: 92, speed: 5, size: 4, community: 5, why: 'Schnelle Wege und gute Erreichbarkeit; weniger Laufzeitverlust zwischen entfernten Produktionsgebäuden.' },
        { pal: 'Helzephyr', tier: 'A', workLevel: 3, metaScore: 89, speed: 4, size: 4, community: 4, why: 'Zuverlässiger Midgame-Transporter mit brauchbarer Mobilität und wenig Spezialaufwand.' },
    ] },
    { job: 'Lumbering', icon: '🪵', entries: [
        { pal: 'Wumpo Botan', tier: 'S', workLevel: 4, metaScore: 96, speed: 4, size: 2, community: 5, why: 'Höchster Holzfällwert plus hoher Transportnutzen; ideal für automatisierte Holzbasen.' },
        { pal: 'Eikthyrdeer', tier: 'A', workLevel: 2, metaScore: 88, speed: 5, size: 4, community: 5, why: 'Früh verfügbar, schnell und kompakt; der beste praktische Übergang bis zum spezialisierten Worker.' },
        { pal: 'Bastigor', tier: 'A', workLevel: 6, metaScore: 90, speed: 3, size: 2, community: 4, why: 'Sehr hoher Wert für späte Holzproduktion, aber deutlich später und platzintensiver.' },
    ] },
    { job: 'Kindling', icon: '🔥', entries: [
        { pal: 'Jormuntide Ignis', tier: 'S', workLevel: 4, metaScore: 98, speed: 4, size: 3, community: 5, why: 'Starker Endgame-Standard für Öfen und Küchen mit hohem Kindling-Wert und verlässlicher Basisleistung.' },
        { pal: 'Blazamut', tier: 'A', workLevel: 3, metaScore: 91, speed: 5, size: 3, community: 5, why: 'Schneller, starker Feuer-Worker für anspruchsvolle Produktionsketten.' },
        { pal: 'Suzaku', tier: 'A', workLevel: 3, metaScore: 87, speed: 4, size: 4, community: 4, why: 'Gute erreichbare Übergangslösung mit solider Produktionsgeschwindigkeit.' },
    ] },
    { job: 'Planting', icon: '🌱', entries: [
        { pal: 'Lyleen', tier: 'S', workLevel: 4, metaScore: 97, speed: 4, size: 4, community: 5, why: 'Top-Pflanzerin für große Farmen und zusätzlich wertvoll durch Medicine Production.' },
        { pal: 'Lyleen Noct', tier: 'A', workLevel: 3, metaScore: 90, speed: 4, size: 4, community: 4, why: 'Gute späte Alternative, wenn die normale Lyleen anderweitig im Team gebraucht wird.' },
        { pal: 'Mossanda', tier: 'A', workLevel: 2, metaScore: 84, speed: 3, size: 2, community: 4, why: 'Kompaktere Übergangslösung mit mehreren Basisfähigkeiten.' },
    ] },
    { job: 'Watering', icon: '💧', entries: [
        { pal: 'Jormuntide', tier: 'S', workLevel: 4, metaScore: 98, speed: 4, size: 2, community: 5, why: 'Sehr hoher Watering-Wert und starke Praxisleistung in großen Produktionsbasen.' },
        { pal: 'Azurobe', tier: 'A', workLevel: 3, metaScore: 90, speed: 4, size: 4, community: 4, why: 'Früher erreichbarer Spezialist für Crusher, Mühle und Bewässerung.' },
        { pal: 'Suzaku Aqua', tier: 'A', workLevel: 3, metaScore: 87, speed: 4, size: 4, community: 4, why: 'Späte, flexible Alternative mit solider Geschwindigkeit.' },
    ] },
    { job: 'Electricity', icon: '⚡', entries: [
        { pal: 'Orserk', tier: 'S', workLevel: 4, metaScore: 97, speed: 4, size: 4, community: 5, why: 'Hoher Electricity-Wert und kompakter als viele Alternativen; zuverlässiger Dauerbetrieb.' },
        { pal: 'Grizzbolt', tier: 'A', workLevel: 3, metaScore: 90, speed: 4, size: 4, community: 5, why: 'Starker, früh bekannter Allrounder für die erste zuverlässige Stromversorgung.' },
        { pal: 'Relaxaurus Lux', tier: 'A', workLevel: 3, metaScore: 86, speed: 3, size: 3, community: 4, why: 'Gute Zwischenlösung, wenn hohe Electricity-Abdeckung ohne Endgame-Zugang gebraucht wird.' },
    ] },
    { job: 'Handiwork', icon: '🔨', entries: [
        { pal: 'Anubis', tier: 'S', workLevel: 4, metaScore: 99, speed: 5, size: 5, community: 5, why: 'Extrem schnelle Handiwork-Animation und kompakte Größe; der Community-Standard für Crafting.' },
        { pal: 'Lyleen Noct', tier: 'A', workLevel: 3, metaScore: 89, speed: 4, size: 4, community: 4, why: 'Starke späte Ergänzung mit zusätzlicher Medicine Production.' },
        { pal: 'Lunaris', tier: 'A', workLevel: 3, metaScore: 85, speed: 4, size: 4, community: 4, why: 'Guter spezialisierter Handiwork-Pal, wenn Anubis noch nicht verfügbar ist.' },
    ] },
    { job: 'Medicine', icon: '💊', entries: [
        { pal: 'Lyleen Noct', tier: 'S', workLevel: 3, metaScore: 96, speed: 4, size: 4, community: 5, why: 'Sehr starke Medizinherstellung mit guter Arbeitsgeschwindigkeit und zusätzlicher Handiwork-Abdeckung.' },
        { pal: 'Vaelet', tier: 'A', workLevel: 3, metaScore: 88, speed: 4, size: 4, community: 4, why: 'Zuverlässiger Spezialist für Medizin, wenn die späte Meta-Option fehlt.' },
        { pal: 'Felbat', tier: 'A', workLevel: 3, metaScore: 84, speed: 3, size: 3, community: 4, why: 'Praktischer Übergangs-Worker mit brauchbarer Größe und Verfügbarkeit.' },
    ] },
    { job: 'Cooling', icon: '❄️', entries: [
        { pal: 'Frostallion', tier: 'S', workLevel: 4, metaScore: 96, speed: 4, size: 3, community: 5, why: 'Hoher Cooling-Wert und stark für Kühlketten, besonders im späten Spiel.' },
        { pal: 'Vanwyrm Cryst', tier: 'A', workLevel: 3, metaScore: 89, speed: 4, size: 4, community: 4, why: 'Gute mobile Alternative mit solider Basisleistung und kleinerem Footprint.' },
        { pal: 'Pengullet', tier: 'A', workLevel: 1, metaScore: 82, speed: 4, size: 5, community: 4, why: 'Nicht der höchste Wert, aber sehr klein, früh verfügbar und erstaunlich praktisch für einzelne Kühlstationen.' },
    ] },
];
window.JOB_TIERLIST = JOB_TIERLIST;
