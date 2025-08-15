  window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, pendingChanges, isAdminAuthenticated, handleToggleLock, initializeData, handleKeeperChange, handleSaveRow, handleArrowKey }) => {
    const currentKeepers = keepers[selectedYear] || Array(12).fill().map((_, i) => ({
      team: `Team ${i + 1}`,
      keeper1: '', draftCost1: 0, tag1: false, cost1: 0,
      keeper2: '', draftCost2: 0, tag2: false, cost2: 0,
      remaining: 200,
    }));

    const years = ['2022', '2023', '2024', '2025'];

    return (
      <div className="space-y-4 px-2 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-white text-center">Keepers</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex space-x-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  initializeData(year);
                }}
                className={`px-3 py-1 text-sm rounded ${
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
              className={`px-3 py-1 text-sm rounded ${
                locks[selectedYear] ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
              } text-white transition-all`}
            >
              {locks[selectedYear] ? 'Unlock' : 'Lock'}
            </button>
          )}
        </div>
        <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
          <div className="space-y-4">
            {currentKeepers.map((team, index) => {
              const pending = pendingChanges.keepers?.[selectedYear]?.[index] || {};
              const displayTeam = { ...team, ...pending };
              return (
                <div key={index} className="border-b py-2 flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  <div className="font-bold">{displayTeam.team}</div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Keeper 1</label>
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
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Draft Cost 1</label>
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="number"
                        value={pending.draftCost1 ?? team.draftCost1}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost1', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-100 p-1 rounded text-sm"
                        name={`draftCost1-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost1')}
                      />
                    ) : (
                      <span>{displayTeam.draftCost1}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Tag 1</label>
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
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Cost 1</label>
                    <span>{displayTeam.cost1}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Keeper 2</label>
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
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Draft Cost 2</label>
                    {isAdminAuthenticated && !locks[selectedYear] ? (
                      <input
                        type="number"
                        value={pending.draftCost2 ?? team.draftCost2}
                        onChange={(e) => handleKeeperChange(selectedYear, index, 'draftCost2', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-100 p-1 rounded text-sm"
                        name={`draftCost2-${index}`}
                        onKeyDown={(e) => handleArrowKey(e, selectedYear, index, 'draftCost2')}
                      />
                    ) : (
                      <span>{displayTeam.draftCost2}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Tag 2</label>
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
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Cost 2</label>
                    <span>{displayTeam.cost2}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold">Remaining</label>
                    <span>{displayTeam.remaining}</span>
                  </div>
                  {isAdminAuthenticated && !locks[selectedYear] && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold">Actions</label>
                      <button
                        onClick={() => handleSaveRow(selectedYear, index)}
                        className="px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };