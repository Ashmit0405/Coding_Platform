// src/hooks/useChangeUserRole.js
export default function useChangeUserRole(setUsers) {
  const changeUserRole = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/change-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: id, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
      } else {
        console.error("Failed to change role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  return { changeUserRole };
}
