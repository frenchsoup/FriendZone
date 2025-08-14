window.Prizes = () => {
  const { prizes, keepers, selectedYear, setSelectedYear, isAdminAuthenticated } = window.AppState;

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Prizes</h2>
      <div className="flex justify-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded text-sm"
        >
          {['2023', '2024', '2025'].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="table-container">
          <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-base sm:text-lg font-bold mb-3">Weekly High Scores</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-3 w-[20%]">Week</th>
                  <th className="text-left py-2 px-2 sm:px-3 w-[50%]">Team</th>
                  <th className="text-right py-2 px-2 sm:px-3 w-[30%]">Total</th>
                </tr>
              </thead>
              <tbody>
                {prizes[selectedYear].weeklyHighScores.map((score, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
                    <td className="py-2 px-2 sm:px-3">{score.week}</td>
                    <td className="py-2 px-2 sm:px-3">
                      {isAdminAuthenticated ? (
                        <select
                          value={score.team}
                          onChange={(e) => window.AppState.handleWeeklyScoreChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm"
                        >
                          <option value="">Select Team</option>
                          {window.AppState.getRemainingTeams(selectedYear).map(team => (
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
                          type="number"
                          value={score.total}
                          onChange={(e) => window.AppState.handleWeeklyScoreChange(selectedYear, index, 'total', e.target.value)}
                          className="w-full sm:w-16 bg-gray-100 p-1 rounded text-sm text-right no-spinner"
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
        <div className="table-container">
          <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-base sm:text-lg font-bold mb-3">Survivor Pool</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 sm:px-3 w-[20%]">Week</th>
                  <th className="text-left py-2 px-2 sm:px-3 w-[80%]">Team</th>
                </tr>
              </thead>
              <tbody>
                {prizes[selectedYear].survivor.map((entry, index) => (
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
                        <select
                          value={entry.eliminated || entry.winner || ''}
                          onChange={(e) => window.AppState.handleSurvivorChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm"
                        >
                          <option value="">Select Team</option>
                          {window.AppState.getRemainingTeams(selectedYear, index).map(team => (
                            <option key={team} value={team}>{team}</option>
                          ))}
                        </select>
                      ) : (
                        <span>{entry.eliminated || entry.winner || ''}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};