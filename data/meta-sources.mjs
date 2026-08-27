/**
 * Versioned source contract for current Palworld meta recommendations.
 * Summaries are repository-owned notes; source content and transcripts are not copied here.
 */
export const META_VERSION = 'Patch 1.0+ · geprüft am 2026-08-27';

export const META_SOURCES = [
  {
    id: 'official-v1-release-changelog',
    title: 'Palworld v1.0 Official Release Changelog',
    url: 'https://steamdb.info/patchnotes/24088745/',
    type: 'official',
    isOfficialDomain: false,
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'official',
    summary: 'Belegt den 1.0-Releasekontext und die großen System- und Inhaltsänderungen.'
  },
  {
    id: 'official-server-guide-1-0-3',
    title: 'Palworld Server Guide 1.0.3',
    url: 'https://docs.palworldgame.com/',
    type: 'official',
    isOfficialDomain: true,
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+; konkreter Dokumentationsstand 1.0.3',
    confidence: 'official',
    summary: 'Liefert offiziellen Versions- und Mechanikkontext, keine Tierlisten.'
  },
  {
    id: 'palworld-calc-1-0-tier-list',
    title: 'PalWorld Calc 1.0 Tier List',
    url: 'https://palworldcalc.com/tier-list/',
    type: 'data',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'structured-data',
    summary: 'Vergleicht aktuelle Raw-Stats und Work-Suitability getrennt.'
  },
  {
    id: 'palmods-work-suitability',
    title: 'PalMods Work-Suitability-Überarbeitung',
    url: 'https://www.palmods.gg/guides/whats-new/work-suitability',
    type: 'data',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'structured-data',
    summary: 'Dokumentiert Arbeitslevel, Aura-Träger und Aufwertungslogik.'
  },
  {
    id: 'pcgamer-best-pals',
    title: 'PC Gamer: Best Pals for base work and mounts',
    url: 'https://www.pcgamer.com/games/survival-crafting/palworld-best-pals/',
    type: 'editorial',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'single-editorial',
    summary: 'Gleicht praktische Auswahl nach Arbeit, Verfügbarkeit und Partner-Skill ab.'
  },
  {
    id: 'pal-compass-role-rankings',
    title: 'Pal Compass: role-based 1.0 rankings',
    url: 'https://palcompass.com/guides/best-pals',
    type: 'editorial',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'single-editorial',
    summary: 'Trennt Kampf, Base, Early Game, Mount, Support und Zuchtrollen.'
  },
  {
    id: 'pindrop-verified-combat-list',
    title: 'PinDrop: verified 1.0 combat list',
    url: 'https://pindrop.gg/palworld/guides/best-combat-pals',
    type: 'editorial',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'single-editorial',
    summary: 'Liefert einen transparenten Combat-Score und elementbasierte Counter.'
  },
  {
    id: 'video-pal-professor-combat-top-5',
    title: 'The Pal Professor – Top 5 Combat Pals',
    url: 'https://www.youtube.com/watch?v=amZY6qiPAdQ',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Praxisabgleich für Kampf-Pals und Full-Damage-Partys.'
  },
  {
    id: 'video-pal-professor-overpowered',
    title: 'The Pal Professor – 20 Most Overpowered Pals',
    url: 'https://www.youtube.com/watch?v=toYU7ofg3-s',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Kampf-, Raid-, Support- und Base-Empfehlungen ab.'
  },
  {
    id: 'video-pal-professor-combat-builds',
    title: 'The Pal Professor – Top 5 Combat Builds',
    url: 'https://www.youtube.com/watch?v=uCX1SaQf64w',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Zeigt konkrete Party-Builds als ergänzenden Praxisabgleich.'
  },
  {
    id: 'video-italianspartacus-party-comps',
    title: 'ItalianSpartacus – Best Combat Party Comps',
    url: 'https://www.youtube.com/watch?v=I2yWYKBcQqQ',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Endgame-Kampfkompositionen und Rollenabdeckung ab.'
  },
  {
    id: 'video-briot-best-teams',
    title: 'Briot – Die besten Teams',
    url: 'https://www.youtube.com/watch?v=N2LYB2yBC4E',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Ergänzt den deutschsprachigen Abgleich für Teamzusammenstellungen.'
  },
  {
    id: 'video-jay-dunna-top-builds',
    title: 'Jay Dunna – Top 5 Builds',
    url: 'https://www.youtube.com/watch?v=82ims6y0nzQ',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Spieler- und Pal-Schaden in konkreten Builds ab.'
  },
  {
    id: 'video-ragegaming-op-combat-builds',
    title: 'RageGamingVideos – Top 5 OP Combat Builds',
    url: 'https://www.youtube.com/watch?v=y8C6lM0Kcl0',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Praxisabgleich für Endgame-Kampf-Builds.'
  },
  {
    id: 'video-ragegaming-any-pal-op',
    title: 'RageGamingVideos – Any Pal OP machen',
    url: 'https://www.youtube.com/watch?v=2VZqwIiCcNc',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'cautious-community',
    summary: 'Veranschaulicht Power-Items und Aufwertung; Namenssignale sind begrenzt.'
  },
  {
    id: 'video-ragegaming-infinite-resource-base',
    title: 'RageGamingVideos – Infinite Resource Base',
    url: 'https://www.youtube.com/watch?v=kVmjm8JvdlU',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Ressourcenbase, Worker-Aufteilung und Engpasslogik ab.'
  },
  {
    id: 'video-shario-base-pals',
    title: 'Shario – Beste Base-Pals je Eignung',
    url: 'https://www.youtube.com/watch?v=WHgjoElqM_4',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Work-Suitability und Base-Rollen aus Spielersicht ab.'
  },
  {
    id: 'video-tropsplays-base-pals',
    title: 'TropsPlays – Best Base Pals getestet',
    url: 'https://www.youtube.com/watch?v=S-2-aMdw7Qw',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Ergänzt Praxistests neuer Base-Pals.'
  },
  {
    id: 'video-pal-professor-work-level-10',
    title: 'The Pal Professor – Best Base Pals / Work Level 10',
    url: 'https://www.youtube.com/watch?v=Dj-DQN50zkI',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Level-10-Worker und Ranch-Anwendungen ab.'
  },
  {
    id: 'video-ragegaming-true-best-base-pals',
    title: 'RageGamingVideos – True Best Base Pals',
    url: 'https://www.youtube.com/watch?v=oe2sMmKzx0I',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Gleicht Worker-Setup, Skills und Basislogistik ab.'
  },
  {
    id: 'video-vilestride-overpowered-pals',
    title: 'Vilestride – Top 10 Overpowered Pals',
    url: 'https://www.youtube.com/watch?v=dmDCXW1-j14',
    type: 'video',
    checkedAt: '2026-08-27',
    scope: 'Patch 1.0+',
    confidence: 'community-cross-check',
    summary: 'Ergänzt den allgemeinen Community-Abgleich für starke Picks.'
  }
];

export const ACTIVE_SOURCE_IDS = META_SOURCES.map(source => source.id);

export function isActiveSourceId(sourceId) {
  return ACTIVE_SOURCE_IDS.includes(sourceId);
}
