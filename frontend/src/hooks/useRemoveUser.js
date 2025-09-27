// src/hooks/useRemoveUser.js
export default function useRemoveUser(setUsers) {
  const removeUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/remove-acc/${id}`, {
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
