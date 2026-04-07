import { useEffect, useState } from "react";
import Layout from "../components/Layout";


function History() {

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          setRecords([]);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, []);



  // Filter + Search
  const filteredData = records.filter((item) => {

    const matchSearch =
      item.reason?.toLowerCase().includes(
        search.toLowerCase()
      );

    const matchStatus =
      filter === "all" || item.status === filter;

    return matchSearch && matchStatus;
  });



  // Status Badge
  function StatusBadge({ status }) {

    let color = "bg-gray-200 text-gray-800";

    if (status === "Approved") {
      color = "bg-green-100 text-green-700";
    }

    if (status === "Pending" || status === "Pending") {
      color = "bg-yellow-100 text-yellow-700";
    }

    if (status === "Rejected") {
      color = "bg-red-100 text-red-700";
    }


    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {status}
      </span>
    );
  }



  return (

    <Layout>

      <h2 className="text-2xl font-bold mb-6">
        📜 Leave History
      </h2>



      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">


        <input
          type="text"
          placeholder="🔍 Search by reason..."
          className="border p-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        <select
          className="border p-2 rounded w-full md:w-48 focus:ring-2 focus:ring-indigo-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >

          <option value="all">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>

        </select>

      </div>



      {/* Table Card */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">


        {/* Header */}
        <div className="grid grid-cols-8 bg-gray-100 px-4 py-3 font-semibold text-sm text-gray-700 min-w-[900px]">

          <div>Name</div>
          <div>Reason</div>
          <div className="text-center">From</div>
          <div className="text-center">To</div>
          <div className="text-center">Days</div>
          <div className="text-center">Status</div>
          <div className="text-center">Date</div>
          

        </div>



        {/* Loading */}
        {loading && (

          <div className="p-6 text-center text-gray-500">
            ⏳ Loading history...
          </div>

        )}



        {/* Rows */}
        {!loading && filteredData.length === 0 ? (

          <div className="p-6 text-center text-gray-500">
            😔 No records found
          </div>

        ) : (

          filteredData.map((item, index) => (

            <div
              key={index}
              className={`
                grid grid-cols-8 px-4 py-3 text-sm min-w-[900px]
                ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                hover:bg-indigo-50 transition
              `}
            >

              {/* Name */}
              <div className="font-medium text-gray-800">
                {item.name}
              </div>


              {/* Reason */}
              <div
                className="truncate max-w-[220px] text-gray-600"
                title={item.reason}
              >
                {item.reason}
              </div>


              {/* From */}
              <div className="text-center text-gray-600">
                {item.from_date || "-"}
              </div>


              {/* To */}
              <div className="text-center text-gray-600">
                {item.to_date || "-"}
              </div>


              {/* Days */}
              <div className="text-center font-semibold text-indigo-600">
                {item.days}
              </div>


              {/* Status */}
              <div className="text-center">
                <StatusBadge status={item.status} />
              </div>


              {/* Date */}
              <div className="text-center text-gray-600">
                {item.date}
              </div>


              {/* AI 
              <div className="text-center text-green-600 font-semibold">
                ✔ AI
              </div>*/}

            </div>

          ))

        )}

      </div>


    </Layout>
  );
}

export default History;
