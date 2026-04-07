import { Link } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h2 className="text-xl font-bold mb-8">
        Agentic AI Leave
        <br />
        Management System
      </h2>

      <nav className="space-y-4 text-lg">

        {/* Dashboard - Everyone */}
        <Link
          to="/"
          className="block hover:text-blue-400"
        >
          📊 Dashboard
        </Link>


        {/* Employee Only */}
        {role === "employee" && (
          <>
            <Link
              to="/apply"
              className="block hover:text-blue-400"
            >
              ✍️ Apply Leave
            </Link>

            <Link
              to="/history"
              className="block hover:text-blue-400"
            >
              📄 My History
            </Link>
          </>
        )}


        {/* HR Only */}
        {role === "hr" && (
          <>
            <Link
              to="/history"
              className="block hover:text-blue-400"
            >
              📋 All Records
            </Link>

            <Link
              to="/notifications"
              className="block hover:text-blue-400"
            >
              🔔 Notifications
            </Link>

            <Link
              to="/analytics"
              className="block hover:text-blue-400"
            >
              📈 Analytics
            </Link>
          </>
        )}

      </nav>
    </div>
  );
}

export default Sidebar;
