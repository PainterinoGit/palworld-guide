export const TEAM_PHASES = [
  { id: 'start', label: 'Start', levelBandIds: ['1-10', '10-20'] },
  { id: 'midgame', label: 'Midgame', levelBandIds: ['20-30', '30-40'] },
  { id: 'endgame', label: 'Endgame', levelBandIds: ['40-50', '50-plus'] },
];

export function buildTeamPhaseView(teams) {
  return TEAM_PHASES.map(phase => {
    const combat = phase.levelBandIds
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
