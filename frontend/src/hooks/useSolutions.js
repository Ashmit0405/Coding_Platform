import { useEffect, useState } from "react";

export default function useSolutions(id) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get-sols/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch solutions");
        setSolutions(data.data || []);
      } catch (err) {
        console.error("Error fetching solutions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSolutions();
  }, [id]);

  return { solutions, loading, error };
}
