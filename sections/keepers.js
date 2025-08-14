window.Keepers = () => {
  const { keepers, locks, selectedYear, setSelectedYear, pendingChanges, isAdminAuthenticated, handleToggleLock, initializeKeepers } = window.AppState;

  React.useEffect(() => {
    initializeKeepers(selectedYear);
  }, [selectedYear]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Keepers</h2>
      <div className="flex justify-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded text-sm"
        >
          {['2022', '2023', '2024', '2025'].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        {isAdminAuthenticated && (
          <button
            onClick={() => handleToggleLock(selectedYear)}
            className={`ml-2 px-2 py-1 text-sm rounded ${locks[selectedYear] ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'} text-white transition-all`}
          >
            {locks[selectedYear] ? 'Unlock' : 'Lock'}
          </button>
        )}
      </div>
      <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Team</th>
              <th className="text-left py-2">Keeper 1</th>
              <th className="text-right py-2">Draft Cost</th>
              <th className="text-center py-2">Tag</th>
              <th className="text-right py-2">Cost</th>
              <th className="text-left py-2">Keeper 2</th>
              <th className="text-right py-2">Draft Cost</th>
              <th className="text-center py-2">Tag</th>
              <th className="text-right py-2">Cost</th>
              <th className="text-right py-2">Remaining</th>
              {isAdminAuthenticated && !locks[selectedYear] && <th className="text-right py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {keepers[selectedYear].map((team, index) => {
              const pending = pendingChanges[selectedYear][index] || {};
              const displayTeam = { ...team, ...pending };
              return (
                <tr key={index} className="border-b">
                  <td className="py-2">{team.team}</td>
                  <td className="py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="text"
                        value={displayTeam.keeper1 || ''}
                        onChange={(e) => window.AppState.handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                        className="w-full bg-gray-100 p-1 rounded text-sm"
                      />
                    ) : (
                      <span>{team.keeper1 || ''}</span>
                    )}
                  </td>
                  <td className="text-right py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="number"
                        value={displayTeam.draftCost1 || ''}
                        onChange={(e) => window.AppState.handleKeeperChange(selectedYear, index, 'draftCost1', e.target.value)}
                        onKeyDown={(e) => window.AppState.handleArrowKey(e, selectedYear, index, 'draftCost1')}
                        className="w-20 bg-gray-100 p-1 rounded text-sm text-right"
                      />
                    ) : (
                      <span>{team.draftCost1 || 0}</span>
                    )}
                  </td>
                  <td className="text-center py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="checkbox"
                        checked={displayTeam.tag1 || false}
                        onChange={(e) => window.AppState.handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                        className="h-4 w-4"
                      />
                    ) : (
                      <span>{team.tag1 ? 'Yes' : 'No'}</span>
                    )}
                  </td>
                  <td className="text-right py-2">{displayTeam.cost1 || 0}</td>
                  <td className="py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="text"
                        value={displayTeam.keeper2 || ''}
                        onChange={(e) => window.AppState.handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                        className="w-full bg-gray-100 p-1 rounded text-sm"
                      />
                    ) : (
                      <span>{team.keeper2 || ''}</span>
                    )}
                  </td>
                  <td className="text-right py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="number"
                        value={displayTeam.draftCost2 || ''}
                        onChange={(e) => window.AppState.handleKeeperChange(selectedYear, index, 'draftCost2', e.target.value)}
                        onKeyDown={(e) => window.AppState.handleArrowKey(e, selectedYear, index, 'draftCost2')}
                        className="w-20 bg-gray-100 p-1 rounded text-sm text-right"
                      />
                    ) : (
                      <span>{team.draftCost2 || 0}</span>
                    )}
                  </td>
                  <td className="text-center py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="checkbox"
                        checked={displayTeam.tag2 || false}
                        onChange={(e) => window.AppState.handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                        className="h-4 w-4"
                      />
                    ) : (
                      <span>{team.tag2 ? 'Yes' : 'No'}</span>
                    )}
                  </td>
                  <td className="text-right py-2">{displayTeam.cost2 || 0}</td>
                  <td className="text-right py-2">{displayTeam.remaining || 200}</td>
                  {isAdminAuthenticated && !locks[selectedYear] && (
                    <td className="text-right py-2">
                      <button
                        onClick={() => window.AppState.handleSaveRow(selectedYear, index)}
                        className="px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
                      >
                        Save
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};