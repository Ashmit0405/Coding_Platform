import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";

export default function SubmitProblem() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    problem: "",
    difficulty: "Easy",
    testcases: null,
    expected: null,
    input_lines: 1,
    output_lines: 1,
    time_limit: 1,
    memory_limit: 64,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("problem", formData.problem);
      data.append("difficulty", formData.difficulty);
      data.append("submitter", user._id);
      data.append("state", "pending");
      data.append("input_lines", formData.input_lines);
      data.append("output_lines", formData.output_lines);
      data.append("time_limit", formData.time_limit);
      data.append("memory_limit", formData.memory_limit);

      if (formData.testcases) data.append("testcases", formData.testcases);
      if (formData.expected) data.append("expected", formData.expected);

      const res = await fetch("http://localhost:5000/api/submit-problem", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await res.json();
      console.log(result)
      if (!res.ok) throw new Error(result.message || "Submission failed");

      setMessage("Problem submitted successfully!");
      setFormData({
        title: "",
        problem: "",
        difficulty: "Easy",
        testcases: null,
        expected: null,
        input_lines: 1,
        output_lines: 1,
        time_limit: 1,
        memory_limit: 64,
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
    <Navbar/>
      <h1 className="text-3xl font-bold mb-6">Submit New Problem</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Problem Description</label>
          <Textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <Select value={formData.difficulty} onValueChange={(val) => setFormData(prev => ({ ...prev, difficulty: val }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block font-semibold">Testcases File</label>
          <Input type="file" name="testcases" onChange={handleChange} required />
        </div>

        <div>
          <label className="block font-semibold">Expected Output File</label>
          <Input type="file" name="expected" onChange={handleChange} required />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block font-semibold mb-1">Input Lines</label>
            <Input
              type="number"
              name="input_lines"
              value={formData.input_lines}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Output Lines</label>
            <Input
              type="number"
              name="output_lines"
              value={formData.output_lines}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Time Limit (s)</label>
            <Input
              type="number"
              name="time_limit"
              value={formData.time_limit}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Memory Limit (MB)</label>
            <Input
              type="number"
              name="memory_limit"
              value={formData.memory_limit}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Submitting..." : "Submit Problem"}
        </Button>
      </form>
    </div>
  );
}
