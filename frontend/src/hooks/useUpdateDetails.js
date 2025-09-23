import { useState } from "react";

export default function useUpdateDetails(token, user) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const updateDetails = async (detailsForm, onSuccess) => {
    if (
      detailsForm.username === user.username &&
      detailsForm.fullname === user.fullname &&
      detailsForm.email === user.email
    ) {
      setMsg("Already present");
      return;
    }

    setLoading(true);
    setMsg("Processing...");

    try {
      const res = await fetch("http://localhost:5000/api/update-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(detailsForm),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || "Details updated successfully!");
        if (onSuccess) onSuccess();
      } else {
        setMsg(data.message || "Error updating details");
      }
    } catch (err) {
      setMsg("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { updateDetails, msg, loading };
}
