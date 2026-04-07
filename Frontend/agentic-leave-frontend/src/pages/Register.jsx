import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);



  async function handleRegister(e) {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);


    try {

      const res = await fetch("http://127.0.0.1:5000/register", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
          role,
        }),

      });


      const data = await res.json();


      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }


      setSuccess("🎉 Registered successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch (err) {

      console.error(err);
      setError("Backend not running");

    }

    setLoading(false);
  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">

      <div className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl w-96 animate-fade-in">


        {/* Title */}
        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-indigo-600">
            Agentic AI
          </h1>

          <p className="text-gray-500">
            Create your account
          </p>

        </div>



        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-3">
            {error}
          </p>
        )}


        {/* Success */}
        {success && (
          <p className="text-green-600 text-center mb-3">
            {success}
          </p>
        )}



        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >


          {/* Username */}
          <div>

            <label className="text-sm text-gray-600">
              Username
            </label>

            <input
              type="text"
              required
              placeholder="Enter username"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>



          {/* Password */}
          <div>

            <label className="text-sm text-gray-600">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Create password"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>



          {/* Role */}
          <div>

            <label className="text-sm text-gray-600">
              Role
            </label>

            <select
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >

              <option value="employee">👨‍💼 Employee</option>
              <option value="hr">🧑‍💼 HR</option>

            </select>

          </div>



          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white w-full py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >

            {loading ? "Creating..." : "Create Account"}

          </button>

        </form>



        {/* Footer */}
        <p className="text-center text-sm mt-4 text-gray-600">

          Already registered?{" "}

          <Link
            to="/login"
            className="text-indigo-600 font-semibold"
          >
            Login
          </Link>

        </p>


      </div>

    </div>
  );
}

export default Register;
