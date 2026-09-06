export const TEAM_PHASES = [
  { id: 'start', label: 'Start', levelBandIds: ['1-10', '10-20'] },
  { id: 'midgame', label: 'Midgame', levelBandIds: ['20-30', '30-40'] },
  { id: 'endgame', label: 'Endgame', levelBandIds: ['40-50', '50-plus'] },
];

export function buildTeamPhaseView(teams) {
  return TEAM_PHASES.map(phase => {
    const targetBandId = phase.id === 'endgame'
      ? phase.levelBandIds[phase.levelBandIds.length - 1]
      : phase.levelBandIds[0];
    const combat = teams.find(team => team.levelBandId === targetBandId && team.kind === 'combat')
      || phase.levelBandIds
        .map(levelBandId => teams.find(team => team.levelBandId === levelBandId && team.kind === 'combat'))
        .find(Boolean);
    const swaps = teams
      .filter(team => phase.levelBandIds.includes(team.levelBandId) && team.kind === 'special')
      .slice(0, 2);

    return {
      ...phase,
      combat,
      swaps,
      switchWhen: combat?.switchWhen,
    };
  });
}

export function getEndgameTeams(teams) {
  const combat = teams.find(team => team.id === '50-plus-combat')
    || teams.find(team => team.kind === 'combat' && team.levelBandId === '50-plus');
  const roaming = teams.find(team => team.id === '50-plus-roaming')
    || teams.find(team => team.kind === 'roaming' && team.levelBandId === '50-plus');
  const fishing = teams.find(team => team.specialty === 'water-fishing');
  const catching = teams.find(team => team.specialty === 'capture-farming');

  return [
    {
      category: 'combat',
      icon: '⚔️',
      title: 'Endgame Kämpfen (Level 80 Raids)',
      subtitle: 'Maximale DPS & Bossmechaniken für Level-80-Ultra-Raids und Turmbosse',
      team: combat,
    },
    {
      category: 'roaming',
      icon: '🐎',
      title: 'Endgame Roamen (Max Speed & Mobilität)',
      subtitle: 'Schnellste Welt- & World-Tree-Erkundung mit Jetragon (Tech 70) & Allround-Kampfkraft',
      team: roaming,
    },
    {
      category: 'fishing',
      icon: '🎣',
      title: 'Endgame Angeln & Wasser-Exploration',
      subtitle: 'World-Tree-Fischen, Fischteiche, Holy Water & Ozeane ohne Ausdauerverlust',
      team: fishing,
    },
    {
      category: 'catching',
      icon: '🎯',
      title: 'Endgame Fangen & Dog Coins',
      subtitle: 'Mammorest-Capture-Loop mit Yakumo, Drop-Multiplikatoren und Freeze-Bonus (+30%)',
      team: catching,
    },
  ].filter(entry => Boolean(entry.team));
}

