import { useState } from "react";

export default function useSortProblems(accessToken, setProblems) {
  const [loading, setLoading] = useState(false);

  const sortProblems = async (basis, order) => {
    if (!basis) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/sort-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ basis, order }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to sort problems");

      setProblems(data.data || []);
    } catch (err) {
      console.error("Error sorting problems:", err);
    } finally {
      setLoading(false);
    }
  };

  return { sortProblems, loading };
}
