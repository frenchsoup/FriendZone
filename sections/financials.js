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
    return { team, years: teamYears, ...sum };
  });

  // Top earners (top 3 teams by total)
  const topEarners = [...teamTotals]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  // Helper to format numbers with commas, no decimals
  function formatMoney(num) {
    if (!num || isNaN(num)) return '-';
    return `$${Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Financials</h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
        <div className="flex flex-row w-full justify-center items-stretch gap-2">
          {topEarners.map((team, idx) => (
            <div
              key={team.team}
              className="relative bg-teal-600 text-white rounded-lg shadow-lg px-2 py-2 flex flex-col items-center min-w-[90px] max-w-[33vw] sm:min-w-[180px] sm:px-4 sm:py-3 border-4 border-teal-400"
              style={{ flex: '1 1 0' }}
            >
              <div className="text-md font-bold mb-1">{team.team}</div>
              <div className="text-sm font-semibold mb-1">{formatMoney(team.total)}</div>
              <div className="text-sm font-medium">{team.years.length} {team.years.length === 1 ? 'year' : 'years'}</div>
              <span style={{position: 'absolute', top: 1, right: 2}} className="text-xs font-bold text-teal-200">#{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="table-container overflow-x-auto">
        <div className="inline-block align-top">
          <div className="card bg-white text-gray-800 rounded-lg shadow-md p-1 sm:p-4">
            <table className="min-w-[600px] sm:min-w-[900px] w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className=" whitespace-nowrap w-[10%] px-2 border-r">Team</th>
                  <th className=" whitespace-nowrap w-[10%] px-2 border-r">Weekly HS</th>
                  <th className=" whitespace-nowrap px-2 border-r">Survivor</th>
                  <th className=" whitespace-nowrap px-2 border-r">RS</th>
                  <th className=" whitespace-nowrap px-2 border-r">Champ</th>
                  <th className=" whitespace-nowrap px-2 border-r">2nd</th>
                  <th className=" whitespace-nowrap px-2 border-r">3rd</th>
                  <th className=" whitespace-nowrap px-2">Total</th>
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
                      <td className="px-2 border-r">{row.team}</td>
                      <td className=" px-2 border-r">{row.weeklyHighScore ? formatMoney(row.weeklyHighScore) : '-'}</td>
                      <td className=" px-2 border-r">{row.survivor ? formatMoney(row.survivor) : '-'}</td>
                      <td className=" px-2 border-r">{row.regularSeason ? formatMoney(row.regularSeason) : '-'}</td>
                      <td className=" px-2 border-r">{row.playoffChamp ? formatMoney(row.playoffChamp) : '-'}</td>
                      <td className=" px-2 border-r">{row.playoffRunnerUp ? formatMoney(row.playoffRunnerUp) : '-'}</td>
                      <td className=" px-2 border-r">{row.playoffThird ? formatMoney(row.playoffThird) : '-'}</td>
                      <td className=" font-bold px-2">{row.total ? formatMoney(row.total) : '-'}</td>
                    </tr>
                    {expandedTeam === row.team && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={8}>
                          <div className="py-2">
                            <table className="w-full text-xs">
                              <thead>
                                <tr>
                                  <th className=" px-2 border-r">Year</th>
                                  <th className=" px-2 border-r">Weekly HS</th>
                                  <th className=" px-2 border-r">Survivor</th>
                                  <th className=" px-2 border-r">RS</th>
                                  <th className=" px-2 border-r">Champ</th>
                                  <th className=" px-2 border-r">2nd</th>
                                  <th className=" px-2 border-r">3rd</th>
                                  <th className=" px-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {((leagueTeams.find(t => t.team === row.team)?.years || []).map(String)).map(year => {
                                  if (!years.includes(year)) return null;
                                  const w = calcWinnings(row.team, year);
                                  return (
                                    <tr key={year}>
                                      <td className="px-2 border-r">{year}</td>
                                      <td className=" px-2 border-r">{w.weeklyHighScore ? formatMoney(w.weeklyHighScore) : '-'}</td>
                                      <td className=" px-2 border-r">{w.survivor ? formatMoney(w.survivor) : '-'}</td>
                                      <td className=" px-2 border-r">{w.regularSeason ? formatMoney(w.regularSeason) : '-'}</td>
                                      <td className=" px-2 border-r">{w.playoffChamp ? formatMoney(w.playoffChamp) : '-'}</td>
                                      <td className=" px-2 border-r">{w.playoffRunnerUp ? formatMoney(w.playoffRunnerUp) : '-'}</td>
                                      <td className=" px-2 border-r">{w.playoffThird ? formatMoney(w.playoffThird) : '-'}</td>
                                      <td className=" font-bold px-2">{w.total ? formatMoney(w.total) : '-'}</td>
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