window.Payouts = ({ payouts, setPayouts, isAdminAuthenticated, updateData, handlePayoutChange, handleAddPayout, handleDeletePayout }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Payouts</h2>
      <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Category</th>
              <th className="text-right py-2">Percentage</th>
              <th className="text-right py-2">Prize</th>
              {isAdminAuthenticated && <th className="text-right py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">
                  {isAdminAuthenticated ? (
                    <input
                      type="text"
                      value={payout.category}
                      onChange={(e) => handlePayoutChange(index, 'category', e.target.value)}
                      className="w-full bg-gray-100 p-1 rounded text-sm"
                    />
                  ) : (
                    <span>{payout.category}</span>
                  )}
                </td>
                <td className="text-right py-2">
                  {isAdminAuthenticated ? (
                    <input
                      type="number"
                      value={payout.percentage}
                      onChange={(e) => handlePayoutChange(index, 'percentage', e.target.value)}
                      className="w-20 bg-gray-100 p-1 rounded text-sm text-right"
                    />
                  ) : (
                    <span>{payout.percentage}%</span>
                  )}
                </td>
                <td className="text-right py-2">
                  {isAdminAuthenticated ? (
                    <input
                      type="number"
                      value={payout.prize}
                      onChange={(e) => handlePayoutChange(index, 'prize', e.target.value)}
                      className="w-20 bg-gray-100 p-1 rounded text-sm text-right"
                    />
                  ) : (
                    <span>${payout.prize}</span>
                  )}
                </td>
                {isAdminAuthenticated && (
                  <td className="text-right py-2">
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
            className="mt-3 w-full px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
          >
            Add Payout
          </button>
        )}
      </div>
    </div>
  );
};