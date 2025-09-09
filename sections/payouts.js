window.Payouts = () => {
  const { payouts, setPayouts, isAdminAuthenticated, updateData } = window.AppState;

  const handleAddPayout = async () => {
    if (!isAdminAuthenticated) return;
    const newPayout = { category: 'New Category', percentage: 0, prize: 0 };
    const updatedPayouts = [...payouts, newPayout];
    const result = await updateData('payouts.json', updatedPayouts, 'update');
    if (result) setPayouts(updatedPayouts);
  };

  const handleDeletePayout = async (index) => {
    if (!isAdminAuthenticated) return;
    const updatedPayouts = payouts.filter((_, i) => i !== index);
    const result = await updateData('payouts.json', updatedPayouts, 'delete', index);
    if (result) setPayouts(updatedPayouts);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Payouts</h2>
      <div className="card bg-white text-gray-800 rounded-lg shadow-md p-2 sm:p-4">
        <table className="w-full text-xs sm:text-sm min-w-[350px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Category</th>
              <th className="text-right py-2">Percentage</th>
              <th className="text-right py-2">Prize</th>
              {isAdminAuthenticated && <th className="text-right py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(payouts.prizes || []).map((payout, index) => (
              <tr key={index} className={`border-b hover:bg-teal-50 transition-colors`}>
                <td className="py-2">
                  {isAdminAuthenticated ? (
                    <input
                      type="text"
                      value={payout.category}
                      onChange={(e) => window.AppState.handlePayoutChange(index, 'category', e.target.value)}
                      className="w-full bg-gray-100 p-2 rounded text-base"
                      style={{ minHeight: '2.25rem' }}
                      aria-label="Edit payout category"
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
                      onChange={(e) => window.AppState.handlePayoutChange(index, 'percentage', e.target.value)}
                      className="w-20 bg-gray-100 p-2 rounded text-base text-right"
                      style={{ minHeight: '2.25rem' }}
                      aria-label="Edit payout percentage"
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
                      onChange={(e) => window.AppState.handlePayoutChange(index, 'prize', e.target.value)}
                      className="w-20 bg-gray-100 p-2 rounded text-base text-right"
                      style={{ minHeight: '2.25rem' }}
                      aria-label="Edit payout prize"
                    />
                  ) : (
                    <span>${payout.prize}</span>
                  )}
                </td>
                {isAdminAuthenticated && (
                  <td className="text-right py-2">
                    <button
                      onClick={() => handleDeletePayout(index)}
                      className="text-red-500 hover:text-red-700 text-lg px-2 py-1 rounded"
                      style={{ minHeight: '2.25rem' }}
                      aria-label="Delete payout"
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
            className="mt-3 w-full px-2 py-2 text-base bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
            style={{ minHeight: '2.25rem' }}
            aria-label="Add payout"
          >
            Add Payout
          </button>
        )}
      </div>
    </div>
  );
};