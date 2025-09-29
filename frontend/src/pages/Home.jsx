import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "@/components/navbar.jsx";

import useFetchProblems from "@/hooks/useFetchProblems.js";
import useSearchProblems from "@/hooks/useSearchProblems.js";
import useSortProblems from "@/hooks/useSortProblems.js";

export default function Home() {
  const { user, accessToken, loading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBasis, setSortBasis] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { problems, setProblems, loading: load, fetchProblems } = useFetchProblems(accessToken);
  const { searchProblems } = useSearchProblems(accessToken, setProblems, fetchProblems);
  const { sortProblems } = useSortProblems(accessToken, setProblems);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!accessToken) return <Navigate to="/login" replace />;

  return (
    <div className="p-6 space-y-6">
      <Navbar />
      <main>
        <h2 className="text-2xl font-bold">
          Welcome <span className="text-blue-600">{user.username}</span> 🎉
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 my-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search problems..."
              className="border rounded px-3 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => searchProblems(searchQuery)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={sortBasis}
              onChange={(e) => setSortBasis(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="difficulty">Difficulty</option>
              <option value="acceptance">Acceptance Rate</option>
            </select>
            <select
              className="border rounded px-3 py-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button
              onClick={() => sortProblems(sortBasis, sortOrder)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Sort
            </button>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Problems</h1>
          {load ? (
            <p>Loading problems...</p>
          ) : (
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
                      <Link to={`/problem/${p._id}`}>{p.title}</Link>
                    </td>
                    <td className="border px-4 py-2">{p.difficulty}</td>
                    <td className="border px-4 py-2">{p.accepted}</td>
                    <td className="border px-4 py-2">{p.submissions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
