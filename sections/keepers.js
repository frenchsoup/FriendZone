window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, isAdminAuthenticated, pendingChanges, handleKeeperChange, handleSaveRow, handleToggleLock }) => {
  if (!keepers[selectedYear]?.length) {
    return <div className="text-center text-gray-300">Loading keepers...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">Keepers</h2>
      <div className="flex justify-center mb-4 space-x-2">
        {['2022', '2023', '2024', '2025'].map(year => (
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
      <div className="table-container overflow-x-auto max-w-[100%]">
        <div className="card bg-gray-900 text-gray-100 rounded-lg shadow-lg p-2 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base sm:text-lg font-bold text-teal-400">Keepers {selectedYear}</h3>
            {isAdminAuthenticated && (
              <button
                onClick={() => handleToggleLock(selectedYear)}
                className={`px-2 py-1 text-xs rounded-full lock-button ${
                  locks[selectedYear] ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-500 hover:bg-teal-600'
                } text-white transition-all`}
              >
                {locks[selectedYear] ? 'Unlock' : 'Lock'}
              </button>
            )}
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800">
                <th className="text-left py-1 px-0.5 w-[10%] min-w-[50px] text-gray-300">Team</th>
                <th className="text-left py-1 px-0.5 w-[15%] min-w-[60px] text-gray-300">Keeper 1</th>
                <th className="text-right py-1 px-0.5 w-[10%] min-w-[45px] text-gray-300">Draft Cost 1</th>
                <th className="text-center py-1 px-0.5 w-[5%] min-w-[25px] text-gray-300">Tag 1</th>
                <th className="text-right py-1 px-0.5 w-[8%] min-w-[35px] text-gray-300">Cost 1</th>
                <th className="text-left py-1 px-0.5 w-[15%] min-w-[60px] text-gray-300">Keeper 2</th>
                <th className="text-right py-1 px-0.5 w-[10%] min-w-[45px] text-gray-300">Draft Cost 2</th>
                <th className="text-center py-1 px-0.5 w-[5%] min-w-[25px] text-gray-300">Tag 2</th>
                <th className="text-right py-1 px-0.5 w-[8%] min-w-[35px] text-gray-300">Cost 2</th>
                <th className="text-right py-1 px-0.5 w-[10%] min-w-[45px] text-gray-300">Auction $</th>
                <th className="text-right py-1 px-0.5 w-[12%] min-w-[45px] text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keepers[selectedYear].map((team, index) => {
                const pending = pendingChanges.keepers[selectedYear]?.[index] || {};
                const displayTeam = { ...team, ...pending };
                return (
                  <tr key={index} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}>
                    <td className="py-0.5 px-0.5 w-[10%] min-w-[50px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.team || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.team || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-700 p-0.5 rounded text-xs text-gray-100 focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="py-0.5 px-0.5 w-[15%] min-w-[60px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.keeper1 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                          className="w-full bg-gray-700 p-0.5 rounded text-xs text-gray-100 focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-right py-0.5 px-0.5 w-[10%] min-w-[45px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.draftCost1 ? `$${displayTeam.draftCost1}` : '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', e.target.value)}
                          className="w-full sm:w-10 bg-gray-700 p-0.5 rounded text-xs text-gray-100 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-center py-0.5 px-0.5 w-[5%] min-w-[25px]">
                      <input
                        type="checkbox"
                        checked={displayTeam.tag1 || false}
                        disabled={locks[selectedYear]}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                        className="h-3 w-3 text-teal-500 rounded focus:ring-teal-500 disabled:opacity-50"
                      />
                    </td>
                    <td className="text-right py-0.5 px-0.5 w-[8%] min-w-[35px] text-gray-400">{displayTeam.cost1 ? `$${displayTeam.cost1}` : '-'}</td>
                    <td className="py-0.5 px-0.5 w-[15%] min-w-[60px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.keeper2 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                          className="w-full bg-gray-700 p-0.5 rounded text-xs text-gray-100 focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-right py-0.5 px-0.5 w-[10%] min-w-[45px]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-400">{displayTeam.draftCost2 ? `$${displayTeam.draftCost2}` : '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', e.target.value)}
                          className="w-full sm:w-10 bg-gray-700 p-0.5 rounded text-xs text-gray-100 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </td>
                    <td className="text-center py-0.5 px-0.5 w-[5%] min-w-[25px]">
                      <input
                        type="checkbox"
                        checked={displayTeam.tag2 || false}
                        disabled={locks[selectedYear]}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                        className="h-3 w-3 text-teal-500 rounded focus:ring-teal-500 disabled:opacity-50"
                      />
                    </td>
                    <td className="text-right py-0.5 px-0.5 w-[8%] min-w-[35px] text-gray-400">{displayTeam.cost2 ? `$${displayTeam.cost2}` : '-'}</td>
                    <td className="text-right py-0.5 px-0.5 w-[10%] min-w-[45px] text-gray-400">{displayTeam.remaining ? `$${displayTeam.remaining}` : '-'}</td>
                    <td className="text-right py-0.5 px-0.5 w-[12%] min-w-[45px]">
                      {!locks[selectedYear] && (
                        <button
                          onClick={() => handleSaveRow(selectedYear, index)}
                          className="px-1 py-0.5 text-xs bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
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