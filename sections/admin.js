window.Admin = () => {
  const { adminPassword, setAdminPassword, handleAdminLogin } = window.AppState;

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Admin Login</h2>
      <div className="card bg-white text-gray-800 rounded-lg shadow-md p-4 max-w-sm mx-auto">
        <form onSubmit={handleAdminLogin}>
          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-gray-100 p-2 rounded text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};