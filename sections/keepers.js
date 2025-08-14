window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, pendingChanges, isAdminAuthenticated, handleToggleLock, initializeData, handleKeeperChange, handleSaveRow, handleArrowKey }) => {
  console.log('Keepers props:', { keepers, selectedYear, pendingChanges });

  // Ensure keepers[selectedYear] exists, fallback to empty array
  const currentKeepers = keepers[selectedYear] || Array(12).fill().map((_, i) => ({
    team: `Team ${i + 1}`,
    keeper1: '', draftCost1: 0, tag1: false, cost1: 0,
    keeper2: '', draftCost2: 0, tag2: false, cost2: 0,
    remaining: 200,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Keepers</h2>
      <div className="flex justify-between items-center">
        <span className="text-white">{selectedYear}</span>
        {isAdminAuthenticated && (
          <button
            onClick={() => handleToggleLock(selectedYear)}
            className={`px-2 py-1 text-sm rounded ${locks[selectedYear] ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'} text-white transition-all`}
          >
            {locks[selectedYear] ? 'Unlock' : 'Lock'}
          </button>
        )}
      </div>
      <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Team</th>
              <th className="text-left py-2">Keeper 1</th>
              <th className="text-right py-2">Draft Cost 1</th>
              <th className="text-center py-2">Tag 1</th>
              <th className="text-right py-2">Cost 1</th>
              <th className="text-left py-2">Keeper 2</th>
              <th className="text-right py-2">Draft Cost 2</th>
              <th className="text-center py-2">Tag 2</th>
              <th className="text-right py-2">Cost 2</th>
              <th className="text-right py-2">Remaining</th>
              {isAdminAuthenticated && !locks[selectedYear] && <th className="text-right py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentKeepers.map((team, index) => {
              const pending = pendingChanges.keepers?.[selectedYear]?.[index] || {};
              const displayTeam = { ...team, ...pending };
              return (
                <tr key={index} className="border-b">
                  <td className="py-2">{displayTeam.team}</td>
                  <td className="py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="text"
                        value={pending.keeper1 ?? team.keeper1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                        className="w-full bg-gray-100 p-1 rounded text-sm"
                        name={`keeper1-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'keeper1')}
                      />
                    ) : (
                      <span>{displayTeam.keeper1}</span>
                    )}
                  </td>
                  <td className="text-right py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="number"
                        value={pending.draftCost1 ?? team.draftCost1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-100 p-1 rounded text-sm text-right"
                        name={`draftCost1-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost1')}
                      />
                    ) : (
                      <span>{displayTeam.draftCost1}</span>
                    )}
                  </td>
                  <td className="text-center py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="checkbox"
                        checked={pending.tag1 ?? team.tag1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                        className="h-4 w-4"
                      />
                    ) : (
                      <span>{displayTeam.tag1 ? 'Yes' : 'No'}</span>
                    )}
                  </td>
                  <td className="text-right py-2">{displayTeam.cost1}</td>
                  <td className="py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="text"
                        value={pending.keeper2 ?? team.keeper2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                        className="w-full bg-gray-100 p-1 rounded text-sm"
                        name={`keeper2-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'keeper2')}
                      />
                    ) : (
                      <span>{displayTeam.keeper2}</span>
                    )}
                  </td>
                  <td className="text-right py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="number"
                        value={pending.draftCost2 ?? team.draftCost2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-100 p-1 rounded text-sm text-right"
                        name={`draftCost2-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost2')}
                      />
                    ) : (
                      <span>{displayTeam.draftCost2}</span>
                    )}
                  </td>
                  <td className="text-center py-2">
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="checkbox"
                        checked={pending.tag2 ?? team.tag2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                        className="h-4 w-4"
                      />
                    ) : (
                      <span>{displayTeam.tag2 ? 'Yes' : 'No'}</span>
                    )}
                  </td>
                  <td className="text-right py-2">{displayTeam.cost2}</td>
                  <td className="text-right py-2">{displayTeam.remaining}</td>
                  {isAdminAuthenticated && !locks[selectedYear] && (
                    <td className="text-right py-2">
                      <button
                        onClick={() => handleSaveRow(selectedYear, index)}
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