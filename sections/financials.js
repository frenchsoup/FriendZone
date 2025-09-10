window.Financials = () => {
  const prizes = window.AppState.prizes;
  const payouts = window.AppState.payouts;
  const yearlyAwards = window.AppState.yearlyAwards;
  const leagueTeams = window.AppState.leagueTeams;
  const [expandedTeam, setExpandedTeam] = React.useState(null);

  // Get payout amounts by category
  const payoutMap = {};
  (payouts?.prizes || []).forEach(p => {
    payoutMap[p.category] = p.prize;
  });

  // Get all years from yearlyAwards, fallback to empty object if undefined
  const years = Object.keys(yearlyAwards || {}).sort();
  // Get all teams from leagueTeams, fallback to empty array if undefined
  const teamList = (leagueTeams || []).map(t => t.team).sort();

  // Helper: calculate winnings for a team in a year
  function calcWinnings(team, year) {
    const p = prizes[year] || {};
    let weeklyHighScore = 0;
    let survivor = 0;
    let regularSeason = 0;
    let playoffChamp = 0;
    let playoffRunnerUp = 0;
    let playoffThird = 0;

    // Weekly High Score
    const whsPrize = payoutMap['Weekly High Score (Weeks 1-14)'];
    const whsCount = (p.weeklyHighScores || []).filter(w => w.team === team).length;
    weeklyHighScore = whsPrize && whsCount ? Math.round((whsPrize / 14) * whsCount) : 0;

    // Survivor
    const survivorPrize = payoutMap['Survivor (Week 13 Winner)'];
    if ((p.survivor || [])[11]?.winner === team) survivor = survivorPrize || 0;

    // Yearly Winners from yearlyAwards
    const awards = yearlyAwards[year] || [];
    awards.forEach(w => {
      if (w.team === team) {
        if (w.category === 'Regular Season Champ') regularSeason = payoutMap[w.category] || 0;
        if (w.category === 'Playoff Champ') playoffChamp = payoutMap[w.category] || 0;
        if (w.category === 'Playoff Runner Up') playoffRunnerUp = payoutMap[w.category] || 0;
        if (w.category === 'Playoff 3rd Place') playoffThird = payoutMap[w.category] || 0;
      }
    });

    return {
      weeklyHighScore,
      survivor,
      regularSeason,
      playoffChamp,
      playoffRunnerUp,
      playoffThird,
      total: weeklyHighScore + survivor + regularSeason + playoffChamp + playoffRunnerUp + playoffThird
    };
  }

  // Calculate totals per team across all years
  const teamTotals = teamList.map(team => {
    let sum = {
      weeklyHighScore: 0,
      survivor: 0,
      regularSeason: 0,
      playoffChamp: 0,
      playoffRunnerUp: 0,
      playoffThird: 0,
      total: 0
    };
    // Only add if team participated in that year
    const teamYears = (leagueTeams.find(t => t.team === team)?.years || []).map(String);
    years.forEach(year => {
      if (teamYears.includes(year)) {
        const w = calcWinnings(team, year);
        sum.weeklyHighScore += w.weeklyHighScore;
        sum.survivor += w.survivor;
        sum.regularSeason += w.regularSeason;
        sum.playoffChamp += w.playoffChamp;
        sum.playoffRunnerUp += w.playoffRunnerUp;
        sum.playoffThird += w.playoffThird;
        sum.total += w.total;
      }
    });
    return { team, ...sum };
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Financials</h2>
      <div className="table-container overflow-x-auto">
        <div className="inline-block align-top">
          <div className="card bg-white text-gray-800 rounded-lg shadow-md p-1 sm:p-4">
            <table className="min-w-[600px] sm:min-w-[900px] w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left whitespace-nowrap">Team</th>
                  <th className="text-right whitespace-nowrap">Weekly HS</th>
                  <th className="text-right whitespace-nowrap">Survivor</th>
                  <th className="text-right whitespace-nowrap">RS</th>
                  <th className="text-right whitespace-nowrap">Champ</th>
                  <th className="text-right whitespace-nowrap">2nd</th>
                  <th className="text-right whitespace-nowrap">3rd</th>
                  <th className="text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {teamTotals.map((row, idx) => (
                  <React.Fragment key={row.team}>
                    <tr
                      className={`border-b cursor-pointer transition-colors duration-150 ${expandedTeam === row.team
                          ? 'bg-teal-100 font-bold'
                          : idx % 2 === 0
                            ? 'table-row-even'
                            : 'table-row-odd'
                        } hover:bg-teal-50`}
                      style={{ cursor: 'pointer' }}
                      title="Tap to view yearly breakdown"
                      onClick={() => setExpandedTeam(expandedTeam === row.team ? null : row.team)}
                    >
                      <td>{row.team}</td>
                      <td className="text-right">{row.weeklyHighScore ? `$${row.weeklyHighScore}` : '-'}</td>
                      <td className="text-right">{row.survivor ? `$${row.survivor}` : '-'}</td>
                      <td className="text-right">{row.regularSeason ? `$${row.regularSeason}` : '-'}</td>
                      <td className="text-right">{row.playoffChamp ? `$${row.playoffChamp}` : '-'}</td>
                      <td className="text-right">{row.playoffRunnerUp ? `$${row.playoffRunnerUp}` : '-'}</td>
                      <td className="text-right">{row.playoffThird ? `$${row.playoffThird}` : '-'}</td>
                      <td className="text-right font-bold">{row.total ? `$${row.total}` : '-'}</td>
                    </tr>
                    {expandedTeam === row.team && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={8}>
                          <div className="py-2">
                            <table className="w-full text-xs">
                              <thead>
                                <tr>
                                  <th className="text-left">Year</th>
                                  <th className="text-right">Weekly HS</th>
                                  <th className="text-right">Survivor</th>
                                  <th className="text-right">RS</th>
                                  <th className="text-right">Champ</th>
                                  <th className="text-right">2nd</th>
                                  <th className="text-right">3rd</th>
                                  <th className="text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {((leagueTeams.find(t => t.team === row.team)?.years || []).map(String)).map(year => {
                                  if (!years.includes(year)) return null;
                                  const w = calcWinnings(row.team, year);
                                  return (
                                    <tr key={year}>
                                      <td>{year}</td>
                                      <td className="text-right">{w.weeklyHighScore ? `$${w.weeklyHighScore}` : '-'}</td>
                                      <td className="text-right">{w.survivor ? `$${w.survivor}` : '-'}</td>
                                      <td className="text-right">{w.regularSeason ? `$${w.regularSeason}` : '-'}</td>
                                      <td className="text-right">{w.playoffChamp ? `$${w.playoffChamp}` : '-'}</td>
                                      <td className="text-right">{w.playoffRunnerUp ? `$${w.playoffRunnerUp}` : '-'}</td>
                                      <td className="text-right">{w.playoffThird ? `$${w.playoffThird}` : '-'}</td>
                                      <td className="text-right font-bold">{w.total ? `$${w.total}` : '-'}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-xs text-gray-500">
              <span>Tap a team row to view yearly breakdown.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};