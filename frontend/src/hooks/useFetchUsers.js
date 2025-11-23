// src/hooks/useFetchUsers.js
import { useEffect, useState } from "react";

export default function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_BACKEND_URL;  
  useEffect(() => {
    fetch(`${API}/api/get-all-users`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  return { users, setUsers, loading };
}
