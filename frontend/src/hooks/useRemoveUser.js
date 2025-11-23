// src/hooks/useRemoveUser.js
export default function useRemoveUser(setUsers) {
  const API = import.meta.env.VITE_BACKEND_URL;  

  const removeUser = async (id) => {
    try {
      const res = await fetch(`${API}/api/remove-acc/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        console.error("Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return { removeUser };
}
