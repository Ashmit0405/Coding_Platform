// pages/Profile.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "@/components/navbar.jsx";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-coding-profile", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
        setProblems(data.problems || []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSolvedProblems();
  }, [user, token]);

  if (!user) {
    return <p className="text-center text-gray-600">Please log in first.</p>;
  }

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      {/* User Info */}
      <Navbar/>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Profile</h2>
        <p><span className="font-medium">Username:</span> {user.username}</p>
        <p><span className="font-medium">Full Name:</span> {user.fullname}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Role:</span> {user.role}</p>
      </div>

      {/* Solved Problems */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">History</h2>

        {loading ? (
          <p className="text-gray-600">Loading problems...</p>
        ) : problems.length > 0 ? (
          <ul className="space-y-2">
            {problems.map((problem, idx) => (
              <li
                key={idx}
                className="p-3 border rounded-md hover:bg-gray-50 transition"
              >
                <p className="font-medium text-blue-600">{problem.title}</p>
                <p className="text-sm text-gray-500">Difficulty: {problem.difficulty}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No problems solved yet.</p>
        )}
      </div>
    </div>
  );
}
