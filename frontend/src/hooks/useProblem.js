import { useEffect, useState } from "react";

export default function useProblem(id) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;  
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${API}/api/get-problem/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch problem");
        setProblem(data.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProblem();
  }, [id]);

  return { problem, loading, error };
}
