// pages/Home.jsx
import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

import { Link } from "react-router-dom";
import Navbar from "@/components/navbar.jsx";
export default function Home() {
  const { user, accessToken, logout, loading } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [load, setload] = useState(true);
  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }
  console.log(accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-all-problems", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // if protected route
          },
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch problems");

        setProblems(data.data || []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setload(false);
      }
    };

    fetchProblems();
  }, [accessToken]);

  return (
    <div className="p-6 space-y-6">
      <Navbar/>
      <main>
        <h2 className="text-2xl font-bold">
          Welcome <span className="text-blue-600">{user.username}</span> 🎉
        </h2>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Problems</h1>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Accepted</th>
                <th className="border px-4 py-2">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-blue-600 hover:underline">
                    <Link to={`/problems/${p._id}`}>{p.title}</Link>
                  </td>
                  <td className="border px-4 py-2">{p.difficulty}</td>
                  <td className="border px-4 py-2">{p.accepted}</td>
                  <td className="border px-4 py-2">{p.submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

    </div>

  );
}
