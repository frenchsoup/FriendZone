window.Financials = () => {
  const { prizes, payouts, keepers } = window.AppState;

  // Get payout amounts by category
  const payoutMap = {};
  (payouts?.prizes || []).forEach(p => {
    payoutMap[p.category] = p.prize;
  });

  // Get all years and all teams
  const years = Object.keys(keepers).filter(y => keepers[y]?.length);
  const allTeams = {};
  years.forEach(year => {
    keepers[year].forEach(teamObj => {
      if (teamObj.team) allTeams[teamObj.team] = true;
    });
  });
  const teamList = Object.keys(allTeams).sort();

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
    weeklyHighScore = whsPrize && whsCount ? Math.round((whsPrize / 14) * whsCount * 100) / 100 : 0;

    // Survivor
    const survivorPrize = payoutMap['Survivor (Week 13 Winner)'];
    if ((p.survivor || [])[11]?.winner === team) survivor = survivorPrize || 0;

    // Yearly Winners
    (p.yearlyWinners || []).forEach(w => {
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

  // Build table data
  const tableRows = [];
  teamList.forEach(team => {
    let grandTotal = 0;
    years.forEach(year => {
      const w = calcWinnings(team, year);
      grandTotal += w.total;
      tableRows.push({ team, year, ...w });
    });
    tableRows.push({ team, year: 'Total', ...calcWinnings(team, years[0]), total: grandTotal });
  });

  // Build summary per team
  const summaryRows = teamList.map(team => {
    let total = 0;
    years.forEach(year => {
      total += calcWinnings(team, year).total;
    });
    return { team, total };
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Financials</h2>
      <div className="table-container">
        <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left">Team</th>
                <th className="text-left">Year</th>
                <th className="text-right">Weekly High Score</th>
                <th className="text-right">Survivor</th>
                <th className="text-right">Regular Season</th>
                <th className="text-right">Playoff Champ</th>
                <th className="text-right">Runner Up</th>
                <th className="text-right">3rd Place</th>
                <th className="text-right">Total Won</th>
              </tr>
            </thead>
            <tbody>
              {teamList.map(team =>
                years.map(year => {
                  const w = calcWinnings(team, year);
                  return (
                    <tr key={team + year} className="border-b">
                      <td>{team}</td>
                      <td>{year}</td>
                      <td className="text-right">${w.weeklyHighScore.toFixed(2)}</td>
                      <td className="text-right">${w.survivor.toFixed(2)}</td>
                      <td className="text-right">${w.regularSeason.toFixed(2)}</td>
                      <td className="text-right">${w.playoffChamp.toFixed(2)}</td>
                      <td className="text-right">${w.playoffRunnerUp.toFixed(2)}</td>
                      <td className="text-right">${w.playoffThird.toFixed(2)}</td>
                      <td className="text-right font-bold">${w.total.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
              {/* Grand total per team */}
              <tr className="bg-teal-100 font-semibold">
                <td colSpan={2}>Grand Total</td>
                <td colSpan={7}>
                  {summaryRows.map(row => (
                    <span key={row.team} className="mr-4">
                      {row.team}: ${row.total.toFixed(2)}
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};