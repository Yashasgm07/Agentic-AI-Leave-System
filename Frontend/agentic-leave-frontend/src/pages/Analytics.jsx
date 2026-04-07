import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:5000/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const records = await res.json();

        if (!Array.isArray(records)) return;

        const total = records.length;
        const approved = records.filter(r => r.status === "Approved").length;
        const rejected = records.filter(r => r.status === "Rejected").length;
        const review = records.filter(
          r => r.status === "Review" || r.status === "Pending"
        ).length;

        const daysData = records.map(r => ({
          name: r.name,
          days: Number(r.days),
        }));

        setData({
          total,
          approved,
          rejected,
          review,
          daysData,
        });

      } catch (err) {
        console.error("Analytics Error:", err);
      }
    }

    loadData();
  }, []);


  if (!data) {
    return (
      <Layout>
        <p className="text-gray-500">Loading analytics...</p>
      </Layout>
    );
  }


  const pieData = [
    { name: "Approved", value: data.approved },
    { name: "Review", value: data.review },
    { name: "Rejected", value: data.rejected },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];


  return (
    <Layout>

      <h2 className="text-2xl font-bold mb-6">
        📊 Analytics Dashboard
      </h2>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Requests</p>
          <h3 className="text-3xl font-bold">{data.total}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Approved</p>
          <h3 className="text-3xl font-bold text-green-600">
            {data.approved}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Under Review</p>
          <h3 className="text-3xl font-bold text-yellow-500">
            {data.review}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Rejected</p>
          <h3 className="text-3xl font-bold text-red-600">
            {data.rejected}
          </h3>
        </div>

      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            Leave Days per Employee
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={data.daysData}>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="days" fill="#3b82f6" radius={[6,6,0,0]} />

              </BarChart>

            </ResponsiveContainer>
          </div>

        </div>


        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            Decision Distribution
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>
          </div>

        </div>


      </div>


    </Layout>
  );
}

export default Analytics;