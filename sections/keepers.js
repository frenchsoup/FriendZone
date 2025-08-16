window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, isAdminAuthenticated, pendingChanges, handleKeeperChange, handleSaveRow, handleToggleLock }) => {
  if (!keepers[selectedYear]?.length) {
    return <div className="text-center text-white">Loading keepers...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Keepers</h2>
      <div className="flex justify-center mb-4 space-x-2">
        {['2022', '2023', '2024', '2025'].map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-3 py-1 text-sm rounded transition-all ${selectedYear === year ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-200 hover:bg-teal-600 hover:text-white'}`}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="table-container">
        <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base sm:text-lg font-bold">Keepers {selectedYear}</h3>
            {isAdminAuthenticated && (
              <button
                onClick={() => handleToggleLock(selectedYear)}
                className={`px-3 py-1 text-sm rounded ${locks[selectedYear] ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'} text-white transition-all`}
              >
                {locks[selectedYear] ? 'Unlock' : 'Lock'}
              </button>
            )}
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-2 px-2 sm:px-3 min-w-[100px]">Team</th>
                <th className="text-left py-2 px-2 sm:px-3 min-w-[80px]">Keeper 1</th>
                <th className="text-right py-2 px-2 sm:px-3 min-w-[60px]">Draft Cost 1</th>
                <th className="text-center py-2 px-2 sm:px-3 min-w-[40px]">Tag 1</th>
                <th className="text-right py-2 px-2 sm:px-3 min-w-[60px]">Cost 1</th>
                <th className="text-left py-2 px-2 sm:px-3 min-w-[80px]">Keeper 2</th>
                <th className="text-right py-2 px-2 sm:px-3 min-w-[60px]">Draft Cost 2</th>
                <th className="text-center py-2 px-2 sm:px-3 min-w-[40px]">Tag 2</th>
                <th className="text-right py-2 px-2 sm:px-3 min-w-[60px]">Cost 2</th>
                <th className="text-right py-2 px-2 sm:px-3 min-w-[80px]">Remaining</th>
                <th className="text-right py-2 px-2 sm:px-3 min-w-[60px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keepers[selectedYear].map((team, index) => {
                const pending = pendingChanges.keepers[selectedYear]?.[index] || {};
                const displayTeam = { ...team, ...pending };
                return (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
                    <td className="py-2 px-2 sm:px-3 min-w-[100px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.team || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.team || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm"
                        />
                      )}
                    </td>
                    <td className="py-2 px-2 sm:px-3 min-w-[80px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.keeper1 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm"
                        />
                      )}
                    </td>
                    <td className="text-right py-2 px-2 sm:px-3 min-w-[60px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.draftCost1 || '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', e.target.value)}
                          className="w-full sm:w-16 bg-gray-100 p-1 rounded text-sm text-right no-spinner"
                        />
                      )}
                    </td>
                    <td className="text-center py-2 px-2 sm:px-3 min-w-[40px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.tag1 ? 'Yes' : 'No'}</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={displayTeam.tag1 || false}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded"
                        />
                      )}
                    </td>
                    <td className="text-right py-2 px-2 sm:px-3 min-w-[60px]">{displayTeam.cost1 || '-'}</td>
                    <td className="py-2 px-2 sm:px-3 min-w-[80px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.keeper2 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm"
                        />
                      )}
                    </td>
                    <td className="text-right py-2 px-2 sm:px-3 min-w-[60px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.draftCost2 || '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', e.target.value)}
                          className="w-full sm:w-16 bg-gray-100 p-1 rounded text-sm text-right no-spinner"
                        />
                      )}
                    </td>
                    <td className="text-center py-2 px-2 sm:px-3 min-w-[40px]">
                      {locks[selectedYear] ? (
                        <span>{displayTeam.tag2 ? 'Yes' : 'No'}</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={displayTeam.tag2 || false}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded"
                        />
                      )}
                    </td>
                    <td className="text-right py-2 px-2 sm:px-3 min-w-[60px]">{displayTeam.cost2 || '-'}</td>
                    <td className="text-right py-2 px-2 sm:px-3 min-w-[80px]">{displayTeam.remaining || '-'}</td>
                    <td className="text-right py-2 px-2 sm:px-3 min-w-[60px]">
                      {!locks[selectedYear] && (
                        <button
                          onClick={() => handleSaveRow(selectedYear, index)}
                          className="px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
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