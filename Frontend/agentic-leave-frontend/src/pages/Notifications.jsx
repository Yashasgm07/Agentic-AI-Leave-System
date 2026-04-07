import { useEffect, useState } from "react";
import Layout from "../components/Layout";


function Notifications() {

  const [list, setList] = useState([]);


  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,   // ✅
      },
    })
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setList(data);
        }

      });

  }, []);


  return (
    <Layout>

      <h2 className="text-2xl font-bold mb-6">
        HR Notifications
      </h2>


      {list.length === 0 && (
        <p>No notifications</p>
      )}


      <div className="space-y-4">

        {list.map((n, i) => (

          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow"
          >

            <h3 className="font-semibold">
              {n.title}
            </h3>

            <p>{n.message}</p>

            <p className="text-sm">
              Reason: {n.reason}
            </p>

            <p className="text-sm text-gray-400">
              {n.date}
            </p>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Notifications;
