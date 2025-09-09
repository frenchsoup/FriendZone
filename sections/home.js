window.Home = () => {
  const { prizes } = window.AppState;

  const getWinner = (year, category) => {
    const winners = prizes[year]?.yearlyWinners || [];
    const found = winners.find(w => w.category === category);
    return found ? found.team : 'TBD';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">FriendZone Fantasy Football Champions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {['2024', '2023'].map(year => (
          <div key={year} className="card bg-white text-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 animate-fade-in">
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-t-lg p-4 flex items-center">
              <span className="text-lg mr-2">🏈</span>
              <h3 className="text-lg sm:text-xl font-bold">{year} Season</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center border-l-4 border-teal-500 pl-2">
                <span className="text-sm sm:text-base font-medium mr-2">🏆 1st Place:</span>
                <span className="text-sm sm:text-base font-semibold">{getWinner(year, "Playoff Champ")}</span>
              </div>
              <div className="flex items-center border-l-4 border-teal-500 pl-2">
                <span className="text-sm sm:text-base font-medium mr-2">🥈 2nd Place:</span>
                <span className="text-sm sm:text-base font-semibold">{getWinner(year, "Playoff Runner Up")}</span>
              </div>
              <div className="flex items-center border-l-4 border-teal-500 pl-2">
                <span className="text-sm sm:text-base font-medium mr-2">🥉 3rd Place:</span>
                <span className="text-sm sm:text-base font-semibold">{getWinner(year, "Playoff 3rd Place")}</span>
              </div>
              <div className="flex items-center border-l-4 border-teal-500 pl-2">
                <span className="text-sm sm:text-base font-medium mr-2">⭐ Regular Season:</span>
                <span className="text-sm sm:text-base font-semibold">{getWinner(year, "Regular Season Champ")}</span>
              </div>
              <div className="flex items-center border-l-4 border-teal-500 pl-2">
                <span className="text-sm sm:text-base font-medium mr-2">🛡️ Survivor:</span>
                <span className="text-sm sm:text-base font-semibold">{getWinner(year, "Survivor")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};