window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, pendingChanges, isAdminAuthenticated, handleToggleLock, initializeData, handleKeeperChange, handleSaveRow, handleArrowKey }) => {
  React.useEffect(() => {
    initializeData(selectedYear);
  }, [selectedYear]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Keepers</h2>
      <div className="flex justify-center mb-4 space-x-2">
        {['2022', '2023', '2024', '2025'].map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-3 py-1 text-sm rounded transition-all ${
              selectedYear === year
                ? 'bg-teal-500 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-teal-600 hover:text-white'
            }`}
          >
            {year}
          </button>
        ))}
        {isAdminAuthenticated && (
          <button
            onClick={() => handleToggleLock(selectedYear)}
            className={`ml-2 px-2 py-1 text-sm rounded ${
              locks[selectedYear] ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
            } text-white transition-all lock-button`}
          >
            {locks[selectedYear] ? 'Unlock' : 'Lock'}
          </button>
        )}
      </div>
      <div className="table-container">
        <div className="card bg-white text-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1 px-1 sm:px-2 w-[18%] sm:w-[15%]">Team</th>
                <th className="text-left py-1 px-1 sm:px-2 w-[18%] sm:w-[15%]">Keeper 1</th>
                <th className="text-right py-1 px-1 sm:px-2 w-[10%] sm:w-[10%]">Draft Cost</th>
                <th className="text-center py-1 px-1 sm:px-2 w-[8%] sm:w-[8%]">Tag</th>
                <th className="text-right py-1 px-1 sm:px-2 w-[8%] sm:w-[8%]">Cost</th>
                <th className="text-left py-1 px-1 sm:px-2 w-[18%] sm:w-[15%]">Keeper 2</th>
                <th className="text-right py-1 px-1 sm:px-2 w-[10%] sm:w-[10%]">Draft Cost</th>
                <th className="text-center py-1 px-1 sm:px-2 w-[8%] sm:w-[8%]">Tag</th>
                <th className="text-right py-1 px-1 sm:px-2 w-[8%] sm:w-[8%]">Cost</th>
                <th className="text-right py-1 px-1 sm:px-2 w-[8%] sm:w-[8%]">Remaining</th>
                {!locks[selectedYear] && <th className="text-right py-1 px-1 sm:px-2 w-[8%] sm:w-[10%]">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {keepers[selectedYear]?.map((team, index) => {
                const pending = pendingChanges.keepers[selectedYear]?.[index] || {};
                const displayTeam = { ...team, ...pending };
                return (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
                    <td className="py-1 px-1 sm:px-2">{team.team}</td>
                    <td className="py-1 px-1 sm:px-2">
                      {!locks[selectedYear] ? (
                        <input
                          type="text"
                          value={displayTeam.keeper1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-xs sm:text-sm"
                        />
                      ) : (
                        <span>{team.keeper1 || ''}</span>
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-2">
                      {!locks[selectedYear] ? (
                        <input
                          type="number"
                          name={`draftCost1-${index}`}
                          value={displayTeam.draftCost1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', e.target.value)}
                          onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost1')}
                          className="w-14 sm:w-16 bg-gray-100 p-1 rounded text-xs sm:text-sm text-right no-spinner"
                        />
                      ) : (
                        <span>${team.draftCost1 || 0}</span>
                      )}
                    </td>
                    <td className="text-center py-1 px-1 sm:px-2">
                      {!locks[selectedYear] ? (
                        <input
                          type="checkbox"
                          checked={displayTeam.tag1 || false}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                      ) : (
                        <span>{team.tag1 ? 'Yes' : 'No'}</span>
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-2">${displayTeam.cost1 || 0}</td>
                    <td className="py-1 px-1 sm:px-2">
                      {!locks[selectedYear] ? (
                        <input
                          type="text"
                          value={displayTeam.keeper2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-xs sm:text-sm"
                        />
                      ) : (
                        <span>{team.keeper2 || ''}</span>
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-2">
                      {!locks[selectedYear] ? (
                        <input
                          type="number"
                          name={`draftCost2-${index}`}
                          value={displayTeam.draftCost2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', e.target.value)}
                          onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost2')}
                          className="w-14 sm:w-16 bg-gray-100 p-1 rounded text-xs sm:text-sm text-right no-spinner"
                        />
                      ) : (
                        <span>${team.draftCost2 || 0}</span>
                      )}
                    </td>
                    <td className="text-center py-1 px-1 sm:px-2">
                      {!locks[selectedYear] ? (
                        <input
                          type="checkbox"
                          checked={displayTeam.tag2 || false}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                      ) : (
                        <span>{team.tag2 ? 'Yes' : 'No'}</span>
                      )}
                    </td>
                    <td className="text-right py-1 px-1 sm:px-2">${displayTeam.cost2 || 0}</td>
                    <td className="text-right py-1 px-1 sm:px-2">${displayTeam.remaining || 200}</td>
                    {!locks[selectedYear] && (
                      <td className="text-right py-1 px-1 sm:px-2">
                        <button
                          onClick={() => handleSaveRow(selectedYear, index)}
                          className="px-2 py-1 text-xs sm:text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
                        >
                          Save
                        </button>
                      </td>
                    )}
                  </tr>
                );
              }) || <tr><td colSpan="11">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};