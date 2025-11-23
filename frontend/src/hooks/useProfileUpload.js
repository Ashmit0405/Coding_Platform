import { useState } from "react";

export default function useProfileUpload(token) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL;  
  const uploadProfile = async (file, onSuccess) => {
    if (!file) {
      setMsg("Please select a file first.");
      return;
    }

    setLoading(true);
    setMsg("Uploading...");

    try {
      const formData = new FormData();
      formData.append("coverImage_path", file);

      const res = await fetch(`${API}/api/change-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || "Profile updated successfully!");
        if (onSuccess) onSuccess();
      } else {
        setMsg(data.message || "Error uploading profile photo.");
      }
    } catch (err) {
      setMsg("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { uploadProfile, msg, loading };
}
