import { useEffect, useState } from "react";
import Layout from "../components/Layout";


function Dashboard() {

  const role = localStorage.getItem("role");


  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });


  const [used, setUsed] = useState(0);



  useEffect(() => {

    const token = localStorage.getItem("token");


    fetch("http://127.0.0.1:5000/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {

        let total = data.length;

        let approved = data.filter(
          (i) => i.status === "Approved"
        ).length;

        let pending = data.filter(
          (i) => i.status === "Pending"
        ).length;

        let rejected = data.filter(
          (i) => i.status === "Rejected"
        ).length;


        // Only for employee
        if (role === "employee") {

          const sum = data.reduce(
            (a, b) => a + Number(b.days),
            0
          );

          setUsed(sum);
        }


        setStats({
          total,
          approved,
          pending,
          rejected,
        });

      });

  }, []);



  return (

    <Layout>


      <h2 className="text-2xl font-bold mb-6">
        Leave Management Dashboard
      </h2>


      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-xl shadow mb-8">

        <h3 className="text-xl font-semibold mb-1">
          👋 Hi, {localStorage.getItem("username")}
        </h3>

        <p>
          Welcome to Agentic AI Leave Management System
        </p>


        {/* Only Employee */}
        {role === "employee" && (
          <p className="mt-2 font-semibold">
            Leaves Used: {used} / 20
          </p>
        )}

      </div>



      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Requests</p>
          <h3 className="text-3xl font-bold">{stats.total}</h3>
        </div>


        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Approved</p>
          <h3 className="text-3xl font-bold text-green-600">
            {stats.approved}
          </h3>
        </div>


        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-500">
            {stats.pending}
          </h3>
        </div>


        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Rejected</p>
          <h3 className="text-3xl font-bold text-red-600">
            {stats.rejected}
          </h3>
        </div>


      </div>

    </Layout>
  );
}

export default Dashboard;
