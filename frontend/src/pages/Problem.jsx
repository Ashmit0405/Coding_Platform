import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Texteditor from "../components/texteditor.jsx";
import { useForm } from "react-hook-form";
import Navbar from "@/components/navbar.jsx";
import { AuthContext } from "@/context/AuthContext.jsx";
import useSubmission from "@/hooks/useSubmission.js";
import ResultDisplay from "@/components/result.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solutions, setSolutions] = useState([]);
  const [history, setHistory] = useState([]);
  const [solutionsVisible, setSolutionsVisible] = useState(true);
  const [historyVisible, setHistoryVisible] = useState(true);
  const { user } = useContext(AuthContext);

  const { control, handleSubmit, watch, register } = useForm({
    defaultValues: { language: "cpp", Content: "" },
  });

  const selectedLanguage = watch("language");
  const { submitting, result, submitSolution } = useSubmission({ problemId: id, user });

  useEffect(() => {
    const fetchProblemSolutionsHistory = async () => {
      try {
        const resProblem = await fetch(`http://localhost:5000/api/get-problem/${id}`, { credentials: "include" });
        const dataProblem = await resProblem.json();
        if (!resProblem.ok) throw new Error(dataProblem.message || "Failed to fetch problem");
        setProblem(dataProblem.data);

        const resSolutions = await fetch(`http://localhost:5000/api/get-sols/${id}`, { credentials: "include" });
        const dataSolutions = await resSolutions.json();
        if (!resSolutions.ok) throw new Error(dataSolutions.message || "Failed to fetch solutions");
        setSolutions(dataSolutions.data || []);

        const resHistory = await fetch(`http://localhost:5000/api/get-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ problem_id: id, user_id: user._id })
        });
        const dataHistory = await resHistory.json();
        console.log(dataHistory)
        if (!resHistory.ok && dataHistory.statusCode !== 300) throw new Error(dataHistory.message || "Failed to fetch history");
        setHistory(dataHistory.data || []);
      } catch (err) {
        console.error("Error fetching problem, solutions, or history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProblemSolutionsHistory();
  }, [id, user]);

  if (loading) return <p className="p-4">Loading problem...</p>;
  if (!problem) return <p className="p-4 text-red-500">Problem not found.</p>;

  return (
    <div className="w-full mx-auto p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">{problem.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 max-h-[600px] overflow-y-auto">
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 whitespace-pre-line">{problem.problem}</p>
            <div className="flex gap-6 text-sm flex-wrap">
              <p><span className="font-semibold">Submissions:</span> {problem.submissions}</p>
              <p><span className="font-semibold">Accepted:</span> {problem.accepted}</p>
              <p><span className="font-semibold">Difficulty:</span> {problem.difficulty}</p>
              <p><span className="font-semibold">Acceptance:</span> {problem.submissions > 0 ? (problem.accepted / problem.submissions).toFixed(2) : 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 max-h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Submit Your Solution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
            <Label>Language</Label>
            <Select {...register("language", { required: true })} defaultValue="cpp">
              <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>

            <Texteditor
              name="Content"
              control={control}
              label={`Your Solution (${selectedLanguage})`}
              language={selectedLanguage}
              className="flex-1 min-h-[200px]"
            />

            <Button type="submit" onClick={handleSubmit(submitSolution)} disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Submit"}
            </Button>

            <ResultDisplay result={result} />
          </CardContent>
        </Card>

        {solutionsVisible && solutions.length > 0 && (
          <Card className="flex-1 max-h-[600px] flex flex-col overflow-y-auto">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Accepted Solutions</CardTitle>
              <Button size="sm" onClick={() => setSolutionsVisible(false)}>Collapse</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {solutions.map((sol, idx) => (
                <Card key={idx} className="border p-2">
                  <p className="text-sm text-gray-500">Submitted by: {sol.writer}</p>
                  <p className="text-xs text-gray-400">Date: {new Date(sol.createdAt).toLocaleString()}</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-sm">{sol.code}</pre>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {historyVisible && history.length > 0 && (
          <Card className="flex-1 max-h-[600px] flex flex-col overflow-y-auto">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Your Submission History</CardTitle>
              <Button size="sm" onClick={() => setHistoryVisible(false)}>Collapse</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {history.map((h, idx) => (
                <Card key={idx} className="border p-2">
                  <p className="text-sm text-gray-500">Status: {h.state}</p>
                  <p className="text-xs text-gray-400">Memory: {h.memory} MB | Time: {h.fexec_time} ms</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-sm">{h.code}</pre>
                  {h.failed_cases && h.failed_cases.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-1">Failed Cases:</h3>
                      <ul className="list-disc ml-6 text-xs space-y-1">
                        {h.failed_cases.map((c, i) => (
                          <li key={i}>
                            <p><strong>Input:</strong> {c.input.join(", ")}</p>
                            <p><strong>Expected:</strong> {c.expected.join(" ")}</p>
                            <p><strong>Got:</strong> {c.got.join(" ")}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex mt-4 gap-4">
        {!solutionsVisible && solutions.length > 0 && (
          <Button onClick={() => setSolutionsVisible(true)}>Show Accepted Solutions</Button>
        )}
        {!historyVisible && history.length > 0 && (
          <Button onClick={() => setHistoryVisible(true)}>Show Your History</Button>
        )}
      </div>
    </div>
  );
}
