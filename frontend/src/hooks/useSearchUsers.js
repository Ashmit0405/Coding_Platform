// src/hooks/useSearchUsers.js
import { useState } from "react";

export default function useSearchUsers(setUsers, accessToken) {
  const [searching, setSearching] = useState(false);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch("http://localhost:5000/api/search-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to search users");

      setUsers(data.data || []);
    } catch (err) {
      console.error("Error searching users:", err);
      setUsers([]);
    }
  };

  return { searchUsers, searching };
}
