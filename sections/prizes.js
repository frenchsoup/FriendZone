window.Prizes = ({ prizes, keepers, selectedYear, setSelectedYear, getRemainingTeams }) => {
  const yearPrizes = prizes[selectedYear] || { weeklyHighScores: [], survivor: [] };
  const weeklyHighScores = yearPrizes.weeklyHighScores?.length > 0 ? yearPrizes.weeklyHighScores : Array(14).fill().map((_, i) => ({ week: i + 1, team: '', total: '' }));
  const survivor = yearPrizes.survivor?.length > 0 ? yearPrizes.survivor : Array(12).fill().map((_, i) => (i === 11 ? { week: 12, winner: '' } : { week: i + 1, eliminated: '' }));

  if (!prizes[selectedYear]) {
    return <div className="text-center text-gray-300">Loading prizes...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">Prizes</h2>
      <div className="flex justify-center mb-4 space-x-2">
        {['2023', '2024', '2025'].map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              selectedYear === year ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-teal-600 hover:text-white'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="table-container overflow-x-auto">
          <div className="card bg-gray-900 text-gray-100 rounded-lg shadow-lg p-4 animate-fade-in">
            <h3 className="text-base sm:text-lg font-bold text-teal-400 mb-3">Weekly High Scores</h3>
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800">
                  <th className="text-left py-2 px-1 sm:px-2 w-[20%] min-w-[60px] text-gray-300">Week</th>
                  <th className="text-left py-2 px-1 sm:px-2 w-[40%] min-w-[100px] text-gray-300">Team</th>
                  <th className="text-right py-2 px-1 sm:px-2 w-[20%] min-w-[60px] text-gray-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {weeklyHighScores.map((score, index) => (
                  <tr key={index} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}>
                    <td className="py-1 px-1 sm:px-2 w-[20%] min-w-[60px] text-gray-400">{score.week}</td>
                    <td className="py-1 px-1 sm:px-2 w-[40%] min-w-[100px] text-gray-400">{score.team || '-'}</td>
                    <td className="text-right py-1 px-1 sm:px-2 w-[20%] min-w-[60px] text-gray-400">{score.total || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table-container overflow-x-auto">
          <div className="card bg-gray-900 text-gray-100 rounded-lg shadow-lg p-4 animate-fade-in">
            <h3 className="text-base sm:text-lg font-bold text-teal-400 mb-3">Survivor Pool</h3>
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800">
                  <th className="text-left py-2 px-1 sm:px-2 w-[20%] min-w-[60px] text-gray-300">Week</th>
                  <th className="text-left py-2 px-1 sm:px-2 w-[60%] min-w-[100px] text-gray-300">Team</th>
                </tr>
              </thead>
              <tbody>
                {survivor.map((entry, index) => (
                  <tr key={index} className={`border-b border-gray-700 ${index === 11 ? 'bg-teal-900/50 font-semibold text-gray-100' : index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}>
                    <td className="py-1 px-1 sm:px-2 w-[20%] min-w-[60px] text-gray-400">{index === 11 ? 'Winner' : entry.week}</td>
                    <td className="py-1 px-1 sm:px-2 w-[60%] min-w-[100px] text-gray-400">{index === 11 ? (entry.winner || '-') : (entry.eliminated || '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-gray-300">Remaining Teams</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {(getRemainingTeams(selectedYear, survivor.length - 1) || []).length > 0 ? (
                  getRemainingTeams(selectedYear, survivor.length - 1).map(team => (
                    <span key={team} className="text-xs sm:text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">{team}</span>
                  ))
                ) : (
                  <span className="text-xs sm:text-sm text-gray-400">No teams remaining</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};