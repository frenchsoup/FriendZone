window.Home = () => (
  <div className="space-y-4">
    <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">FriendZone Fantasy Football Champions</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {['2024', '2023'].map(year => (
        <div key={year} className="card bg-gray-800 text-gray-100 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-fade-in">
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-t-lg p-4 flex items-center">
            <span className="text-lg mr-2">🏈</span>
            <h3 className="text-lg sm:text-xl font-bold">{year} Season</h3>
          </div>
          <div className="p-4 space-y-3">
            {year === '2024' ? (
              <>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🏆 1st Place:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Chris Ayer</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🥈 2nd Place:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Alex LeFevre</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🥉 3rd Place:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Connor Buckley</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">⭐ Regular Season:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Zach D'Agata</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🛡️ Survivor:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Connor Buckley</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🏆 1st Place:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Alex Bzydrya</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🥈 2nd Place:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Jake LeFevre</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🥉 3rd Place:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Jordan Picard</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">⭐ Regular Season:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Jake LeFevre</span>
                </div>
                <div className="flex items-center border-l-4 border-teal-500 pl-2">
                  <span className="text-sm sm:text-base font-medium text-gray-300 mr-2">🛡️ Survivor:</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-100">Alex Bzydrya</span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);