import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import SubmissionInfo from "@/components/submission/SubmissionInfo.jsx";
import FailedCases from "@/components/submission/FailedCases.jsx";
import SubmittedCode from "@/components/submission/SubmittedCode.jsx";
import OutputSection from "@/components/submission/OutputSection.jsx";

export default function SubmissionDetails() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_BACKEND_URL;  
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(`${API}/api/get-sub/${id}`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setSubmission(data.data);
      } catch (err) {
        console.error("Error fetching submission", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!submission) return <p className="p-6">No submission found</p>;

  return (
    <main className="p-6 w-full mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Submission Details</h1>

      <SubmissionInfo submission={submission} />
      <FailedCases failedCases={submission.failed_cases} />
      <SubmittedCode code={submission.code} />
      <OutputSection stdout={submission.stdout} stderr={submission.stderr} />

      <div className="mt-6">
        <Button onClick={() => window.history.back()}>Back</Button>
      </div>
    </main>
  );
}
