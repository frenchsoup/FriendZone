window.Keepers = ({ keepers, locks, selectedYear, setSelectedYear, isAdminAuthenticated }) => {
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
          <h3 className="text-base sm:text-lg font-bold mb-3">Keepers {selectedYear}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 sm:px-3">Team</th>
                <th className="text-left py-2 px-2 sm:px-3">Keeper 1</th>
                <th className="text-right py-2 px-2 sm:px-3">Draft Cost 1</th>
                <th className="text-center py-2 px-2 sm:px-3">Tag 1</th>
                <th className="text-right py-2 px-2 sm:px-3">Cost 1</th>
                <th className="text-left py-2 px-2 sm:px-3">Keeper 2</th>
                <th className="text-right py-2 px-2 sm:px-3">Draft Cost 2</th>
                <th className="text-center py-2 px-2 sm:px-3">Tag 2</th>
                <th className="text-right py-2 px-2 sm:px-3">Cost 2</th>
                <th className="text-right py-2 px-2 sm:px-3">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {keepers[selectedYear].map((team, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}>
                  <td className="py-2 px-2 sm:px-3">{team.team || '-'}</td>
                  <td className="py-2 px-2 sm:px-3">{team.keeper1 || '-'}</td>
                  <td className="text-right py-2 px-2 sm:px-3">{team.draftCost1 || '-'}</td>
                  <td className="text-center py-2 px-2 sm:px-3">{team.tag1 ? 'Yes' : 'No'}</td>
                  <td className="text-right py-2 px-2 sm:px-3">{team.cost1 || '-'}</td>
                  <td className="py-2 px-2 sm:px-3">{team.keeper2 || '-'}</td>
                  <td className="text-right py-2 px-2 sm:px-3">{team.draftCost2 || '-'}</td>
                  <td className="text-center py-2 px-2 sm:px-3">{team.tag2 ? 'Yes' : 'No'}</td>
                  <td className="text-right py-2 px-2 sm:px-3">{team.cost2 || '-'}</td>
                  <td className="text-right py-2 px-2 sm:px-3">{team.remaining || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};