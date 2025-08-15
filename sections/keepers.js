window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, pendingChanges, isAdminAuthenticated, handleToggleLock, initializeData, handleKeeperChange, handleSaveRow, handleArrowKey }) => {
  const currentKeepers = keepers[selectedYear] || Array(12).fill().map((_, i) => ({
    team: `Team ${i + 1}`,
    keeper1: '', draftCost1: 0, tag1: false, cost1: 0,
    keeper2: '', draftCost2: 0, tag2: false, cost2: 0,
    remaining: 200,
  }));

  const years = ['2022', '2023', '2024', '2025'];

  return (
    <div className="space-y-2 px-2 sm:px-0">
      <h2 className="text-base sm:text-lg font-bold text-white text-center">Keepers</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex space-x-1">
          {years.map(year => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                initializeData(year);
              }}
              className={`px-2 py-0.5 text-xs rounded ${
                selectedYear === year
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-teal-500 hover:text-white'
              } transition-all`}
            >
              {year}
            </button>
          ))}
        </div>
        {isAdminAuthenticated && (
          <button
            onClick={() => handleToggleLock(selectedYear)}
            className={`px-2 py-0.5 text-xs rounded ${
              locks[selectedYear] ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
            } text-white transition-all`}
          >
            {locks[selectedYear] ? 'Unlock' : 'Lock'}
          </button>
        )}
      </div>
      <div className="card bg-white text-gray-800 rounded-lg shadow-md p-2 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1 px-1 font-semibold">Team</th>
              <th className="text-left py-1 px-1 font-semibold">Keeper 1</th>
              <th className="text-right py-1 px-1 font-semibold">Cost 1</th>
              <th className="text-center py-1 px-1 font-semibold">Tag 1</th>
              <th className="text-right py-1 px-1 font-semibold">Total 1</th>
              <th className="text-left py-1 px-1 font-semibold">Keeper 2</th>
              <th className="text-right py-1 px-1 font-semibold">Cost 2</th>
              <th className="text-center py-1 px-1 font-semibold">Tag 2</th>
              <th className="text-right py-1 px-1 font-semibold">Total 2</th>
              <th className="text-right py-1 px-1 font-semibold">Remaining</th>
              {!locks[selectedYear] && (
                <th className="text-right py-1 px-1 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentKeepers.map((team, index) => {
              const pending = pendingChanges.keepers?.[selectedYear]?.[index] || {};
              const displayTeam = { ...team, ...pending };
              return (
                <tr key={index} className="border-b">
                  <td className="py-1 px-1 font-medium">{displayTeam.team}</td>
                  <td className="py-1 px-1">
                    {!locks[selectedYear] ? (
                      <input
                        type="text"
                        value={pending.keeper1 ?? team.keeper1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                        className="w-full bg-gray-100 p-0.5 rounded text-xs"
                        name={`keeper1-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'keeper1')}
                      />
                    ) : (
                      <span>{displayTeam.keeper1 || '-'}</span>
                    )}
                  </td>
                  <td className="text-right py-1 px-1">
                    {!locks[selectedYear] ? (
                      <input
                        type="number"
                        value={pending.draftCost1 ?? team.draftCost1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', parseInt(e.target.value) || 0)}
                        className="w-12 bg-gray-100 p-0.5 rounded text-xs text-right"
                        name={`draftCost1-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost1')}
                      />
                    ) : (
                      <span>{displayTeam.draftCost1 || 0}</span>
                    )}
                  </td>
                  <td className="text-center py-1 px-1">
                    {!locks[selectedYear] ? (
                      <input
                        type="checkbox"
                        checked={pending.tag1 ?? team.tag1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                        className="h-3 w-3"
                      />
                    ) : (
                      <span>{displayTeam.tag1 ? 'Yes' : 'No'}</span>
                    )}
                  </td>
                  <td className="text-right py-1 px-1">{displayTeam.cost1 || 0}</td>
                  <td className="py-1 px-1">
                    {!locks[selectedYear] ? (
                      <input
                        type="text"
                        value={pending.keeper2 ?? team.keeper2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                        className="w-full bg-gray-100 p-0.5 rounded text-xs"
                        name={`keeper2-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'keeper2')}
                      />
                    ) : (
                      <span>{displayTeam.keeper2 || '-'}</span>
                    )}
                  </td>
                  <td className="text-right py-1 px-1">
                    {!locks[selectedYear] ? (
                      <input
                        type="number"
                        value={pending.draftCost2 ?? team.draftCost2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', parseInt(e.target.value) || 0)}
                        className="w-12 bg-gray-100 p-0.5 rounded text-xs text-right"
                        name={`draftCost2-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost2')}
                      />
                    ) : (
                      <span>{displayTeam.draftCost2 || 0}</span>
                    )}
                  </td>
                  <td className="text-center py-1 px-1">
                    {!locks[selectedYear] ? (
                      <input
                        type="checkbox"
                        checked={pending.tag2 ?? team.tag2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                        className="h-3 w-3"
                      />
                    ) : (
                      <span>{displayTeam.tag2 ? 'Yes' : 'No'}</span>
                    )}
                  </td>
                  <td className="text-right py-1 px-1">{displayTeam.cost2 || 0}</td>
                  <td className="text-right py-1 px-1">{displayTeam.remaining || 200}</td>
                  {!locks[selectedYear] && (
                    <td className="text-right py-1 px-1">
                      <button
                        onClick={() => handleSaveRow(selectedYear, index)}
                        className="px-1 py-0.5 text-xs bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
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