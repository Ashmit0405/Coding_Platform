import { useState } from "react";

export default function useSearchProblems(accessToken, setProblems, fetchProblems) {
  const [loading, setLoading] = useState(false);

  const searchProblems = async (query) => {
    if (!query.trim()) {
      fetchProblems(); // fallback to all
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/search-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to search problems");

      setProblems(data.data || []);
    } catch (err) {
      console.error("Error searching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  return { searchProblems, loading };
}
