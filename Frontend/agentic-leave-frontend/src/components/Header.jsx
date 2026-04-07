import { useNavigate } from "react-router-dom";

function Header() {

  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  function handleLogout() {

    localStorage.clear();

    navigate("/login");
  }

  return (

    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      {/* Left */}
      <h1 className="text-xl font-bold text-indigo-700">
        Leave Management Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">

        {username && (
          <p className="text-gray-700 font-medium">
            Welcome, <span className="text-indigo-600">{username}</span> 👋
          </p>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Header;
