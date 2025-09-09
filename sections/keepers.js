window.Keepers = () => {
  const { keepers, locks, selectedYear, setSelectedYear, pendingChanges, isAdminAuthenticated, handleToggleLock, initializeKeepers, handleKeeperChange, handleSaveRow } = window.AppState;
  const [savingStates, setSavingStates] = React.useState({});

  React.useEffect(() => {
    initializeKeepers(selectedYear);
  }, [selectedYear]);

  const enhancedHandleSaveRow = async (year, index) => {
    try {
      setSavingStates(prev => ({ ...prev, [index]: true }));
      const teamData = pendingChanges[selectedYear]?.[index] || keepers[year][index];
      const payload = {
        file: `keepers_${year}.json`,
        data: teamData,
        action: 'update',
        indexData: index,
      };
      await handleSaveRow(year, index, payload);
      setTimeout(() => {
        setSavingStates(prev => ({ ...prev, [index]: false }));
      }, 1000);
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save: ${err.message}`);
      setSavingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const enhancedHandleToggleLock = async (year) => {
    try {
      const updatedLocks = { ...locks, [year]: !locks[year] };
      const payload = {
        file: 'locks.json',
        data: updatedLocks,
        action: 'update',
      };
      await handleToggleLock(year, payload);
    } catch (err) {
      console.error('Lock toggle error:', err);
      alert(`Failed to toggle lock: ${err.message}`);
    }
  };

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
            onClick={() => enhancedHandleToggleLock(selectedYear)}
            className={`px-2 py-1 text-xs rounded lock-button ${
              locks[selectedYear] ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-500 hover:bg-teal-600'
            } text-white transition-all`}
          >
            {locks[selectedYear] ? 'Unlock' : 'Lock'}
          </button>
        )}
      </div>
      <div className="table-container flex justify-center overflow-x-auto">
        <div className="card bg-white text-gray-800 rounded-lg shadow-md p-1 sm:p-3" style={{ display: 'block', width: 'fit-content', minWidth: '900px' }}>
          <table className="w-full text-xs sm:text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1 px-1 w-[12%]">Team</th>
                <th className="text-left py-1 px-1 w-[16%]">Keeper 1</th>
                <th className="text-right py-1 px-1 w-[10%]">Draft Cost 1</th>
                <th className="text-center py-1 px-1 w-[4%]">Tag 1</th>
                <th className="text-right py-1 px-1 w-[8%]">Cost 1</th>
                <th className="text-left py-1 px-1 w-[16%]">Keeper 2</th>
                <th className="text-right py-1 px-1 w-[10%]">Draft Cost 2</th>
                <th className="text-center py-1 px-1 w-[4%]">Tag 2</th>
                <th className="text-right py-1 px-1 w-[8%]">Cost 2</th>
                <th className="text-right py-1 px-1 w-[12%]">Auction $</th>
                {!locks[selectedYear] && <th className="text-right py-1 px-1 w-[10%]">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {keepers[selectedYear].map((team, index) => {
                const pending = pendingChanges[selectedYear]?.[index] || {};
                const displayTeam = { ...team, ...pending };
                return (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'} hover:bg-teal-50 transition-colors`}>
                    <td className="py-1 px-1 w-[12%]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-800">{displayTeam.team || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.team || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'team', e.target.value)}
                          className="w-full bg-gray-100 p-2 rounded text-base text-gray-800 focus:ring-2 focus:ring-teal-500"
                          style={{ minHeight: '2.25rem' }}
                        />
                      )}
                    </td>
                    <td className="py-1 px-1 w-[16%]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-800">{displayTeam.keeper1 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper1', e.target.value)}
                          className="w-full bg-gray-100 p-2 rounded text-base text-gray-800 focus:ring-2 focus:ring-teal-500"
                          style={{ minHeight: '2.25rem' }}
                        />
                      )}
                    </td>
                    <td className="text-right py-1 px-1 w-[10%]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-800">{displayTeam.draftCost1 ? `$${displayTeam.draftCost1}` : '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost1 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', e.target.value)}
                          className="w-full bg-gray-100 p-2 rounded text-base text-gray-800 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                          style={{ minHeight: '2.25rem' }}
                        />
                      )}
                    </td>
                    <td className="text-center py-1 px-1 w-[4%]">
                      <input
                        type="checkbox"
                        checked={displayTeam.tag1 || false}
                        disabled={locks[selectedYear]}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag1', e.target.checked)}
                        className="h-5 w-5 text-teal-500 rounded focus:ring-teal-500 disabled:opacity-50"
                        style={{ minHeight: '2.25rem' }}
                      />
                    </td>
                    <td className="text-right py-1 px-1 w-[8%] text-gray-800">
                      {displayTeam.cost1 ? `$${displayTeam.cost1}` : '-'}
                    </td>
                    <td className="py-1 px-1 w-[16%]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-800">{displayTeam.keeper2 || '-'}</span>
                      ) : (
                        <input
                          type="text"
                          value={displayTeam.keeper2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'keeper2', e.target.value)}
                          className="w-full bg-gray-100 p-2 rounded text-base text-gray-800 focus:ring-2 focus:ring-teal-500"
                          style={{ minHeight: '2.25rem' }}
                        />
                      )}
                    </td>
                    <td className="text-right py-1 px-1 w-[10%]">
                      {locks[selectedYear] ? (
                        <span className="text-gray-800">{displayTeam.draftCost2 ? `$${displayTeam.draftCost2}` : '-'}</span>
                      ) : (
                        <input
                          type="number"
                          value={displayTeam.draftCost2 || ''}
                          onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', e.target.value)}
                          className="w-full bg-gray-100 p-2 rounded text-base text-gray-800 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                          style={{ minHeight: '2.25rem' }}
                        />
                      )}
                    </td>
                    <td className="text-center py-1 px-1 w-[4%]">
                      <input
                        type="checkbox"
                        checked={displayTeam.tag2 || false}
                        disabled={locks[selectedYear]}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'tag2', e.target.checked)}
                        className="h-5 w-5 text-teal-500 rounded focus:ring-teal-500 disabled:opacity-50"
                        style={{ minHeight: '2.25rem' }}
                      />
                    </td>
                    <td className="text-right py-1 px-1 w-[8%] text-gray-800">
                      {displayTeam.cost2 ? `$${displayTeam.cost2}` : '-'}
                    </td>
                    <td className="text-right py-1 px-1 w-[12%] text-gray-800">
                      {displayTeam.remaining ? `$${displayTeam.remaining}` : '-'}
                    </td>
                    {!locks[selectedYear] && (
                      <td className="text-right py-1 px-1 w-[10%]">
                        <button
                          onClick={() => enhancedHandleSaveRow(selectedYear, index)}
                          className={`px-2 py-1 text-base rounded text-white transition-all ${
                            savingStates[index] ? 'bg-blue-500' : 'bg-teal-500 hover:bg-teal-600'
                          }`}
                          disabled={savingStates[index]}
                          style={{ minHeight: '2.25rem' }}
                          aria-label="Save keeper row"
                        >
                          {savingStates[index] ? 'Saving...' : 'Save'}
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
    </div>
  );
};