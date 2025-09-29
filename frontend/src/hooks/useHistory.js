import { useEffect, useState } from "react";

export default function useHistory(id, userId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log({ problem_id: id, user_id: userId })
      try {
        const res = await fetch(`http://localhost:5000/api/get-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ problem_id: id, user_id: userId }),
        });
        const data = await res.json();

        if (!res.ok && data.statusCode !== 300) {
          throw new Error(data.message || "Failed to fetch history");
        }
        setHistory(data.data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && userId) fetchHistory();
  }, [id, userId]);

  return { history, loading, error };
}
