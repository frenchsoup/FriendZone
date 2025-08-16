window.Admin = ({ handleAdminLogin }) => {
  const [adminPassword, setAdminPassword] = React.useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleAdminLogin(e);
    setAdminPassword('');
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">Admin Login</h2>
      <div className="card bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 animate-fade-in">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-gray-700 p-2 rounded text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};