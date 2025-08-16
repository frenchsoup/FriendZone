window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, isAdminAuthenticated, pendingChanges, handleKeeperChange, handleSaveRow, handleToggleLock }) => {
  if (!keepers[selectedYear]?.length) {
    return <div className="text-center text-gray-300">Loading keepers...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">Keepers</h2>
      <div className="flex justify-center mb-4 space-x-2">
        {['2025', '2024', '2023', '2022'].map(year => (
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
      <div className="table-container overflow-x-auto">
        <div className="card bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base sm:text-lg font-bold text-teal-400">Keepers {selectedYear}</h3>
            {isAdminAuthenticated && (
              <button
                onClick={() => handleToggleLock(selectedYear)}
                className={`px-3 py-1 text-sm rounded-full lock-button ${
                  locks[selectedYear] ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-500 hover:bg-teal-600'
                } text-white transition-all`}
              >
                {locks[selectedYear] ? 'Unlock' : 'Lock'}
              </button>
            )}
          </div>
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-900">
                <th className="text-left py-2 px-1 sm:px-3 w-[15%] min-w-[80px] text-gray-300">Team</th>
                <th className="text-left py-2 px-1 sm:px-3 w-[15%] min-w-[70px] text-gray-300">Keeper 1</th>
                <th className="text-right py-2 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-300">Draft Cost 1</th>
                <th className="text-center py-2 px-1 sm:px-3 w-[5%] min-w-[30px] text-gray-300">Tag 1</th>
                <th className="text-right py-2 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-300">Cost 1</th>
                <th className="text-left py-2 px-1 sm:px-3 w-[15%] min-w-[70px] text-gray-300">Keeper 2</th>
                <th className="text-right py-2 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-300">Draft Cost 2</th>
                <th className="text-center py-2 px-1 sm:px-3 w-[5%] min-w-[30px] text-gray-300">Tag 2</th>
                <th className="text-right py-2 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-300">Cost 2</th>
                <th className="text-right py-2 px-1 sm:px-3 w-[10%] min-w-[60px] text-gray-300">Remaining</th>
                <th className="text-right py-2 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keepers[selectedYear].map((team, index) => {
                const pending = pendingChanges.keepers[selectedYear]?.[index] || {};
                const displayTeam = { ...team, ...pending };
                return (
                  <tr key={index} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}>
                    <td className="py-1 px-1 sm:px-3 w-[15%] min-w-[80px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.team || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.team || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="py-1 px-1 sm:px-3 w-[15%] min-w-[70px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.keeper1 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                          className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-3 w-[10%] min-w-[50px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.draftCost1 || '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', e.target.value)}
                          className="w-full sm:w-12 bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-center py-1 px-1 sm:px-3 w-[5%] min-w-[30px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.tag1 ? 'Yes' : 'No'}</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={displayTeam.tag1 || false}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                          className="h-4 w-4 text-teal-500 rounded focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-400">{displayTeam.cost1 || '-'}</td>
                    <td className="py-1 px-1 sm:px-3 w-[15%] min-w-[70px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.keeper2 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                          className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-3 w-[10%] min-w-[50px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.draftCost2 || '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', e.target.value)}
                          className="w-full sm:w-12 bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-center py-1 px-1 sm:px-3 w-[5%] min-w-[30px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.tag2 ? 'Yes' : 'No'}</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={displayTeam.tag2 || false}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                          className="h-4 w-4 text-teal-500 rounded focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-3 w-[10%] min-w-[50px] text-gray-400">{displayTeam.cost2 || '-'}</td>
                    <td className="text-right py-1 px-1 sm:px-3 w-[10%] min-w-[60px] text-gray-400">{displayTeam.remaining || '-'}</td>
                    <td className="text-right py-1 px-1 sm:px-3 w-[10%] min-w-[50px]">
                      {!locks[selectedYear] && (
                        <button
                          onClick={() => handleSaveRow(selectedYear, index)}
                          className="px-2 py-1 text-xs sm:text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
                        >
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};