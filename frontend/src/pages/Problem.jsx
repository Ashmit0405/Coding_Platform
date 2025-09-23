import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Texteditor from "../components/texteditor.jsx"; // your TinyMCE component
import { useForm } from "react-hook-form";
import Navbar from "@/components/navbar.jsx";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const {control,handleSubmit}=useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get-problem/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch problem");
        setProblem(data.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const onSubmit = async (values) => {
    console.log("User solution:", values);
    // Example: post to backend
    // await fetch(`http://localhost:5000/api/submit/${id}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   credentials: "include",
    //   body: JSON.stringify({ solution: values.Content }),
    // });
  };

  if (loading) return <p className="p-4">Loading problem...</p>;
  if (!problem) return <p className="p-4 text-red-500">Problem not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Navbar/>
      <h1 className="text-3xl font-bold mb-6">{problem.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <p className="text-gray-700 whitespace-pre-line">{problem.problem}</p>

          <div className="flex gap-6">
            <p>
              <span className="font-semibold">Submissions:</span> {problem.submissions}
            </p>
            <p>
              <span className="font-semibold">Accepted:</span> {problem.accepted}
            </p>
            <p>
              <span className="font-semibold">Difficulty:</span> {problem.difficulty}
            </p>
            <p>
              <span className="font-semibold">Acceptance:</span> {problem.accepted/problem.submissions}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
        {/* <Texteditor name="Content" control={control} label="Your Solution" /> */}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      </div>
    </div>
  );
}
