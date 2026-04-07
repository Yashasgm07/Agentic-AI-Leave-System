import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";


function ApplyLeave() {

  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const token = localStorage.getItem("token");


  // Auto calculate days
  function calculateDays() {

    if (!fromDate || !toDate) return 0;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const diff =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

    return diff > 0 ? diff : 0;
  }


  async function handleSubmit(e) {

    e.preventDefault();


    if (!reason || !fromDate || !toDate) {
      setError("All fields are required");
      return;
    }


    const days = calculateDays();

    if (days <= 0) {
      setError("Invalid date range");
      return;
    }


    setLoading(true);
    setError("");


    try {

      const res = await fetch(
        "http://127.0.0.1:5000/apply-leave",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            reason,
            from_date: fromDate,
            to_date: toDate,
          }),
        }
      );


      const data = await res.json();


      if (!res.ok) {
        setError(data.error || "Request failed");
        setLoading(false);
        return;
      }


      navigate("/result", {
        state: data,
      });

    } catch (err) {

      console.error(err);
      setError("Backend not running");

    }

    setLoading(false);
  }



  return (

    <Layout>

      <div className="max-w-xl mx-auto">

        <div className="bg-white p-8 rounded-xl shadow-lg">


          {/* Header */}
          <div className="mb-6 text-center">

            <h2 className="text-2xl font-bold mb-1">
              📝 Apply Leave
            </h2>

            <p className="text-gray-500 text-sm">
              Powered by Agentic AI Decision Engine
            </p>

          </div>



          {/* Error */}
          {error && (
            <p className="text-red-500 text-center mb-4">
              {error}
            </p>
          )}



          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* Reason */}
            <div>

              <label className="block mb-1 font-medium">
                Reason
              </label>

              <textarea
                className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Explain your reason..."
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

            </div>



            {/* From Date */}
            <div>

              <label className="block mb-1 font-medium">
                From Date
              </label>

              <input
                type="date"
                className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />

            </div>



            {/* To Date */}
            <div>

              <label className="block mb-1 font-medium">
                To Date
              </label>

              <input
                type="date"
                className="w-full border rounded p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />

            </div>



            {/* Days Preview */}
            {fromDate && toDate && (

              <div className="text-sm text-gray-600 text-center">

                📅 Total Days:{" "}
                <span className="font-semibold text-indigo-600">
                  {calculateDays()}
                </span>

              </div>

            )}



            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >

              {loading ? "🤖 AI Processing..." : "Submit Request"}

            </button>

          </form>


          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-4">

            Your request will be analyzed using AI agents

          </p>


        </div>

      </div>

    </Layout>
  );
}

export default ApplyLeave;
