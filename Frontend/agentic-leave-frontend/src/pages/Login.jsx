import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // 👈 NEW
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      // ❌ Login failed
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // ❌ Role mismatch check
      if (data.role !== role) {
        setError("❌ Wrong role selected!");
        setLoading(false);
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);

      // ✅ Redirect
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Backend not running");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Agentic AI
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Leave Management System
        </p>

        <h3 className="text-center font-semibold mb-4">
          Login to Continue
        </h3>


        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-3">
            {error}
          </p>
        )}


        {/* Role Selector */}
        <div className="flex justify-center gap-4 mb-5">

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="employee"
              checked={role === "employee"}
              onChange={() => setRole("employee")}
            />
            <span>🧑‍💼 Employee</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="hr"
              checked={role === "hr"}
              onChange={() => setRole("hr")}
            />
            <span>👨‍💻 HR</span>
          </label>

        </div>


        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Username"
            required
            className="w-full border p-2 rounded focus:outline-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />


          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-2 rounded focus:outline-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
          >

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>


        {/* Register Link */}
        <p className="text-center text-sm mt-4">

          New user?{" "}

          <Link
            to="/register"
            className="text-indigo-600 font-semibold"
          >
            Create account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
