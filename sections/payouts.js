window.Payouts = ({ payouts, setPayouts, isAdminAuthenticated, updateData, handlePayoutChange, handleAddPayout, handleDeletePayout }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">Payouts</h2>
      <div className="card bg-gray-900 text-gray-100 rounded-lg shadow-lg p-4 animate-fade-in">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="text-left py-2 px-1 sm:px-3 w-[40%] min-w-[100px] text-gray-300">Category</th>
              <th className="text-right py-2 px-1 sm:px-3 w-[20%] min-w-[60px] text-gray-300">Percentage</th>
              <th className="text-right py-2 px-1 sm:px-3 w-[20%] min-w-[60px] text-gray-300">Prize</th>
              {isAdminAuthenticated && <th className="text-right py-2 px-1 sm:px-3 w-[20%] min-w-[60px] text-gray-300">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}>
                <td className="py-1 px-1 sm:px-3 w-[40%] min-w-[100px]">
                  {isAdminAuthenticated ? (
                    <input
                      type="text"
                      value={payout.category}
                      onChange={(e) => handlePayoutChange(index, 'category', e.target.value)}
                      className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <span className="text-gray-400">{payout.category}</span>
                  )}
                </td>
                <td className="text-right py-1 px-1 sm:px-3 w-[20%] min-w-[60px]">
                  {isAdminAuthenticated ? (
                    <input
                      type="number"
                      value={payout.percentage}
                      onChange={(e) => handlePayoutChange(index, 'percentage', e.target.value)}
                      className="w-full sm:w-16 bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <span className="text-gray-400">{payout.percentage}%</span>
                  )}
                </td>
                <td className="text-right py-1 px-1 sm:px-3 w-[20%] min-w-[60px]">
                  {isAdminAuthenticated ? (
                    <input
                      type="number"
                      value={payout.prize}
                      onChange={(e) => handlePayoutChange(index, 'prize', e.target.value)}
                      className="w-full sm:w-16 bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 text-right no-spinner focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <span className="text-gray-400">${payout.prize}</span>
                  )}
                </td>
                {isAdminAuthenticated && (
                  <td className="text-right py-1 px-1 sm:px-3 w-[20%] min-w-[60px]">
                    <button
                      onClick={() => handleDeletePayout(index)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isAdminAuthenticated && (
          <button
            onClick={handleAddPayout}
            className="mt-3 w-full px-2 py-1 text-xs sm:text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
          >
            Add Payout
          </button>
        )}
      </div>
    </div>
  );
};