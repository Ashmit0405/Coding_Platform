import { useState } from "react";

export default function useSubmission({ problemId, user }) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;  

  const submitSolution = async (values) => {
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          language: values.language,
          code: values.Content,
          problem_id: problemId,
          writer: user?._id,
        }),
      });

      const data = await res.json();
      console.log("Run API response:", data);

      if (!res.ok) throw new Error(data.message || "Submission failed");

      let status = "UNKNOWN";
      let text = data.data;
      let failedCases = null;

      if (typeof text === "string") {
        if (text.includes("TLE")) {
          status = "TLE";
          text = "⏱️ Time Limit Exceeded";
        } else if (text.includes("MLE")) {
          status = "MLE";
          text = "💾 Memory Limit Exceeded";
        } else if (text.includes("Runtime/Compilation")) {
          status = "RTE";
          text = "❌ Runtime/Compilation Error";
        } else if (text.includes("All cases passed")) {
          status = "AC";
          text = "✅ Accepted";
        } else if (text.includes("Wrong Answer")) {
          status = "WA";
          text = "⚠️ Wrong Answer";
        }
      }

      if (Array.isArray(data.data)) {
        failedCases = data.data;
      }

      setResult({
        status,
        text,
        failedCases,
        raw: data,
      });
      console.log(result)
    } catch (err) {
      console.error("Error submitting solution:", err);
      setResult({ status: "ERROR", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, result, submitSolution };
}
