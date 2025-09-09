window.Prizes = () => {
  const { prizes, keepers, selectedYear, setSelectedYear, isAdminAuthenticated } = window.AppState;

  // Helper: get all teams for the selected year
  const getTeamsForYear = (year) => {
    return keepers[year]?.map(k => k.team) || [];
  };

  // Helper: get remaining teams for survivor for a given week
  const getSurvivorRemainingTeams = (year, upToWeek = null) => {
    const allTeams = getTeamsForYear(year);
    const survivorEntries = prizes[year]?.survivor || [];
    let eliminated = [];
    let winner = '';
    for (let i = 0; i < survivorEntries.length; i++) {
      if (upToWeek !== null && i > upToWeek) break;
      if (i === 11 && survivorEntries[i].winner) {
        winner = survivorEntries[i].winner;
      } else if (survivorEntries[i].eliminated) {
        eliminated.push(survivorEntries[i].eliminated);
      }
    }
    let remaining = allTeams.filter(t => !eliminated.includes(t) && t !== winner);
    return remaining;
  };

  // Handler for weekly high score change
  const handleHighScoreChange = (year, weekIdx, field, value) => {
    const updated = { ...prizes };
    updated[year].weeklyHighScores = updated[year].weeklyHighScores.map((score, idx) =>
      idx === weekIdx ? { ...score, [field]: value } : score
    );
    window.AppState.setPrizes(updated);
    window.AppState.persistPrizes(year, updated[year]);
  };

  // Handler for survivor change
  const handleSurvivorChange = (year, weekIdx, field, value) => {
    const updated = { ...prizes };
    updated[year].survivor = updated[year].survivor.map((entry, idx) => {
      if (idx === weekIdx) {
        if (weekIdx === 11) {
          return { ...entry, winner: value };
        } else {
          return { ...entry, eliminated: value };
        }
      }
      return entry;
    });
    window.AppState.setPrizes(updated);
    window.AppState.persistPrizes(year, updated[year]);
  };

  // Persist function (calls Netlify function)
  window.AppState.persistPrizes = async (year, data) => {
    try {
      await fetch('/.netlify/functions/update-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: `prizes_${year}.json`,
          data,
          action: 'update'
        })
      });
    } catch (e) {
      alert('Failed to save prizes data!');
    }
  };

  const yearData = prizes[selectedYear] || { weeklyHighScores: [], survivor: [], yearlyWinners: [] };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Prizes</h2>
      <div className="flex flex-wrap justify-center mb-4 gap-2">
        {['2023', '2024', '2025'].map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-3 py-2 text-base rounded transition-all ${
              selectedYear === year
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-teal-600 hover:text-white'
            }`}
            style={{ minWidth: '60px', fontSize: '1rem' }}
            aria-label={`Show prizes for ${year}`}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="table-container overflow-x-auto">
          <div className="card bg-white text-gray-800 rounded-lg shadow-md p-2 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-3">Weekly High Scores</h3>
            <table className="w-full text-xs sm:text-sm min-w-[350px] border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-3 w-[20%]">Week</th>
                  <th className="text-left py-2 px-2 sm:px-3 w-[50%]">Team</th>
                  <th className="text-right py-2 px-2 sm:px-3 w-[30%]">Total</th>
                </tr>
              </thead>
              <tbody>
                {yearData.weeklyHighScores.map((score, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
                    <td className="py-2 px-2 sm:px-3">{score.week}</td>
                    <td className="py-2 px-2 sm:px-3">
                      {isAdminAuthenticated ? (
                        <select
                          value={score.team || ''}
                          onChange={e => handleHighScoreChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-100 p-2 rounded text-base"
                          style={{ minHeight: '2.25rem' }}
                        >
                          <option value="">Select Team</option>
                          {getTeamsForYear(selectedYear).map(team => (
                            <option key={team} value={team}>{team}</option>
                          ))}
                        </select>
                      ) : (
                        <span>{score.team || ''}</span>
                      )}
                    </td>
                    <td className="text-right py-2 px-2 sm:px-3">
                      {isAdminAuthenticated ? (
                        <input
                          type="text"
                          value={score.total || ''}
                          onChange={e => handleHighScoreChange(selectedYear, index, 'total', e.target.value)}
                          className="w-full sm:w-16 bg-gray-100 p-2 rounded text-base text-right"
                          style={{ minHeight: '2.25rem' }}
                        />
                      ) : (
                        <span>{score.total || ''}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table-container overflow-x-auto">
          <div className="card bg-white text-gray-800 rounded-lg shadow-md p-2 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold mb-3">Survivor Pool</h3>
            <table className="w-full text-xs sm:text-sm min-w-[350px] border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-3 w-[20%]">Week</th>
                  <th className="text-left py-2 px-2 sm:px-3 w-[80%]">Team</th>
                </tr>
              </thead>
              <tbody>
                {yearData.survivor.map((entry, index) => {
                  const value = index === 11 ? (entry.winner || '') : (entry.eliminated || '');
                  const isLocked = !!value;
                  return (
                    <tr
                      key={index}
                      className={`border-b ${
                        index === 11
                          ? 'bg-teal-100 font-semibold text-gray-900'
                          : index % 2 === 0
                          ? 'table-row-even'
                          : 'table-row-odd'
                      }`}
                    >
                      <td className="py-2 px-2 sm:px-3">{index === 11 ? 'Winner' : entry.week}</td>
                      <td className="py-2 px-2 sm:px-3">
                        {isAdminAuthenticated ? (
                          isLocked ? (
                            <span>{value}</span>
                          ) : (
                            <select
                              value={value}
                              onChange={e => handleSurvivorChange(selectedYear, index, index === 11 ? 'winner' : 'eliminated', e.target.value)}
                              className="w-full bg-gray-100 p-2 rounded text-base"
                              style={{ minHeight: '2.25rem' }}
                            >
                              <option value="">Select Team</option>
                              {getSurvivorRemainingTeams(selectedYear, index).map(team => (
                                <option key={team} value={team}>{team}</option>
                              ))}
                            </select>
                          )
                        ) : (
                          <span>{value}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Remaining Teams</h4>
              <div className="flex flex-wrap gap-2">
                {getSurvivorRemainingTeams(selectedYear).length > 0 ? (
                  getSurvivorRemainingTeams(selectedYear).map(team => (
                    <span
                      key={team}
                      className="inline-block bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {team}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-600">No teams remaining</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};