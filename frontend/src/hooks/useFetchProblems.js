import { useEffect, useState } from "react";

export default function useFetchProblems(accessToken) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_BACKEND_URL;  

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${API}/api/get-all-problems`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch problems");

      setProblems(data.data || []);
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchProblems();
  }, [accessToken]);

  return { problems, setProblems, loading, fetchProblems };
}
