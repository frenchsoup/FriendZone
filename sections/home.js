window.Home = () => {
  const yearlyAwards = window.AppState.yearlyAwards;
  const leagueTeams = window.AppState.leagueTeams;

  // List of years from awards data, fallback to empty object if undefined
  const years = Object.keys(yearlyAwards || {}).sort((a, b) => b - a);

  // Helper to get winner for a category/year
  const getWinner = (year, category) => {
    const winners = yearlyAwards[year] || [];
    const found = winners.find(w => w.category === category);
    if (!found) return 'TBD';
    const val = found.team;
    // If the stored value is now a team id, resolve to the canonical display name
    const byId = window.AppState.getTeamById(val);
    if (byId) return byId.team;
    // Fallback: normalize any legacy name casing
    return window.AppState.normalizeTeamName ? window.AppState.normalizeTeamName(val) : (val || 'TBD');
  };

  // Categories to display
  const categories = [
    { key: 'Playoff Champ', label: '🏆 1st Place:' },
    { key: 'Playoff Runner Up', label: '🥈 2nd Place:' },
    { key: 'Playoff 3rd Place', label: '🥉 3rd Place:' },
    { key: 'Regular Season Champ', label: '⭐ Regular Season:' },
    { key: 'Survivor', label: '🛡️ Survivor:' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">FriendZone Fantasy Football Champions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {years.map(year => (
          <div key={year} className="card bg-white text-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 animate-fade-in">
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-t-lg p-4 flex items-center">
              <span className="text-lg mr-2">🏈</span>
              <h3 className="text-lg sm:text-xl font-bold">{year} Season</h3>
            </div>
            <div className="p-4 space-y-3">
              {categories.map(cat => {
                // Omit Survivor for years before 2023
                if (cat.key === 'Survivor' && Number(year) < 2023) return null;
                return (
                  <div key={cat.key} className="flex items-center border-l-4 border-teal-500 pl-2">
                    <span className="text-sm sm:text-base font-medium mr-2">{cat.label}</span>
                    <span className="text-sm sm:text-base font-semibold">{getWinner(year, cat.key)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};