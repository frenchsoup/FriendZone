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

  // Get all years from yearlyAwards and prizes so recent prize updates (e.g., 2025)
  // are included even if `yearlyawards.json` doesn't yet list that year.
  const awardYears = Object.keys(yearlyAwards || {});
  const prizeYears = Object.keys(window.AppState.prizes || {});
  const years = Array.from(new Set([...awardYears, ...prizeYears])).sort();
  // Get all team ids from leagueTeams, fallback to empty array if undefined
  const teamList = (leagueTeams || []).map(t => t.id).sort();

  // Helper: calculate winnings for a team in a year
  function calcWinnings(team, year) {
    const p = prizes[year] || {};
    let weeklyHighScore = 0;
    let survivor = 0;
    let regularSeason = 0;
    let playoffChamp = 0;
    let playoffRunnerUp = 0;
    let playoffThird = 0;

    // Weekly High Score: `payoutMap` stores the total pool for Weeks 1-14 (e.g. $560),
    // so compute per-week amount by dividing by number of weeks, then multiply
    // by how many weekly wins the team has.
    const totalWhsPool = Number(payoutMap['Weekly High Score (Weeks 1-14)']) || 0;
    const numWeeks = (p.weeklyHighScores || []).length || 14;
    const perWeekPrize = numWeeks > 0 ? (totalWhsPool / numWeeks) : 0;
    const whsCount = (p.weeklyHighScores || []).filter(w => {
      const wTeamId = window.AppState.getTeamIdByName ? (window.AppState.getTeamIdByName(w.team) || w.team) : w.team;
      return wTeamId === team;
    }).length;
    weeklyHighScore = perWeekPrize * whsCount;

    // Survivor
    const survivorPrize = Number(payoutMap['Survivor (Week 13 Winner)']) || 0;
    const winnerEntry = (p.survivor || [])[11];
    if (winnerEntry) {
      const winnerId = window.AppState.getTeamIdByName(winnerEntry.winner) || winnerEntry.winner;
      if (winnerId === team) survivor = survivorPrize || 0;
    }

    // Yearly Winners from yearlyAwards
    const awards = yearlyAwards[year] || [];
    awards.forEach(w => {
      // yearlyAwards may store team ids or names; normalize to id when possible
      const awardTeamId = window.AppState.getTeamIdByName(w.team) || w.team;
      if (awardTeamId === team) {
        if (w.category === 'Regular Season Champ') regularSeason = Number(payoutMap[w.category]) || 0;
        if (w.category === 'Playoff Champ') playoffChamp = Number(payoutMap[w.category]) || 0;
        if (w.category === 'Playoff Runner Up') playoffRunnerUp = Number(payoutMap[w.category]) || 0;
        if (w.category === 'Playoff 3rd Place') playoffThird = Number(payoutMap[w.category]) || 0;
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
    const teamYears = (leagueTeams.find(t => t.id === team)?.years || []).map(String);
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

  // Top earners (top 5 teams by total)
  const topEarners = [...teamTotals]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Helper to format numbers with commas, no decimals
  function formatMoney(num) {
    if (!num || isNaN(num)) return '-';
    return `$${Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Financials</h2>
      <div className="flex flex-col lg:flex-row gap-4 mb-4 items-stretch">
        <div className="w-full lg:w-60 flex-shrink-0">
          <div className="flex flex-col gap-2 h-full items-start">
            {topEarners.map((team, idx) => (
              <div
                key={team.team}
                className="relative bg-teal-600 text-white rounded-md shadow-md px-1 py-0.5 sm:px-2 sm:py-2 flex flex-col items-start w-full border-2 sm:border-4 border-teal-400 leading-tight"
                style={{ minHeight: 36 }}
              >
                <div className="text-xs sm:text-sm font-bold mb-0.5 truncate w-full">{window.AppState.getTeamById(team.team)?.team || team.team}</div>
                <div className="text-[10px] sm:text-sm font-semibold mb-0.5">{formatMoney(team.total)}</div>
                <div className="text-[10px] sm:text-sm font-medium">{team.years.length} {team.years.length === 1 ? 'year' : 'years'}</div>
                <span style={{position: 'absolute', top: 4, right: 8}} className="text-xs font-bold text-teal-200">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 h-full">
          <div className="table-container h-full">
            <div className="inline-block align-top w-full h-full">
              <div className="card bg-white text-gray-800 rounded-lg shadow-md p-1 sm:p-4 h-full overflow-x-auto">
                <table className="min-w-[600px] sm:min-w-[900px] w-full text-xs sm:text-sm border-collapse divide-y divide-gray-200">
                  <thead>
                    <tr className="border-b">
                      <th className=" whitespace-nowrap w-[10%] px-2 py-2 border-r sticky top-0 bg-white z-20 text-left">Team</th>
                      <th className=" whitespace-nowrap w-[10%] px-2 py-2 border-r sticky top-0 bg-white z-20 text-right">Weekly HS</th>
                      <th className=" whitespace-nowrap px-2 py-2 border-r sticky top-0 bg-white z-20 text-right">Survivor</th>
                      <th className=" whitespace-nowrap px-2 py-2 border-r sticky top-0 bg-white z-20 text-right">RS</th>
                      <th className=" whitespace-nowrap px-2 py-2 border-r sticky top-0 bg-white z-20 text-right">Champ</th>
                      <th className=" whitespace-nowrap px-2 py-2 border-r sticky top-0 bg-white z-20 text-right">2nd</th>
                      <th className=" whitespace-nowrap px-2 py-2 border-r sticky top-0 bg-white z-20 text-right">3rd</th>
                      <th className=" whitespace-nowrap px-2 py-2 sticky top-0 bg-white z-20 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamTotals.map((row, idx) => (
                      <React.Fragment key={row.team}>
                        <tr
                          className={`border-b cursor-pointer transition-colors duration-150 ${expandedTeam === row.team ? 'bg-teal-100 font-bold' : (idx % 2 === 0 ? 'table-row-even' : 'table-row-odd')} hover:bg-teal-50`}
                          style={{ cursor: 'pointer' }}
                          title="Tap to view yearly breakdown"
                          onClick={() => setExpandedTeam(expandedTeam === row.team ? null : row.team)}
                        >
                          <td className="px-2 py-1 sm:py-2 border-r">{window.AppState.getTeamById(row.team)?.team || row.team}</td>
                          <td className=" px-2 py-1 sm:py-2 border-r text-right tabular-nums">{row.weeklyHighScore ? formatMoney(row.weeklyHighScore) : '-'}</td>
                          <td className=" px-2 py-1 sm:py-2 border-r text-right tabular-nums">{row.survivor ? formatMoney(row.survivor) : '-'}</td>
                          <td className=" px-2 py-1 sm:py-2 border-r text-right tabular-nums">{row.regularSeason ? formatMoney(row.regularSeason) : '-'}</td>
                          <td className=" px-2 py-1 sm:py-2 border-r text-right tabular-nums">{row.playoffChamp ? formatMoney(row.playoffChamp) : '-'}</td>
                          <td className=" px-2 py-1 sm:py-2 border-r text-right tabular-nums">{row.playoffRunnerUp ? formatMoney(row.playoffRunnerUp) : '-'}</td>
                          <td className=" px-2 py-1 sm:py-2 border-r text-right tabular-nums">{row.playoffThird ? formatMoney(row.playoffThird) : '-'}</td>
                          <td className=" font-bold px-2 py-1 sm:py-2 text-right tabular-nums">{row.total ? formatMoney(row.total) : '-'}</td>
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
                                    {((leagueTeams.find(t => t.id === row.team)?.years || []).map(String)).map(year => {
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
      </div>
    </div>
  );
};