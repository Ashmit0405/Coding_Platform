import { useState } from "react";

export default function useChangePassword(token) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async (oldPassword, newPassword, onSuccess) => {
    setLoading(true);
    setMsg("Processing...");
    try {
      const res = await fetch("http://localhost:5000/api/password-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setMsg(data.message || "Password changed successfully!");
        if (onSuccess) onSuccess();
      } else {
        setMsg(data.message || "Error changing password");
      }
    } catch (err) {
      setMsg("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, msg, loading };
}
