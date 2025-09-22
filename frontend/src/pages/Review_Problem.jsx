import { useEffect, useState, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { AuthContext } from "@/context/AuthContext.jsx"; // adjust path

export default function ReviewProblems() {
  const [problems, setProblems] = useState([]);
  const { user } = useContext(AuthContext); // logged-in user

  useEffect(() => {
    fetch("http://localhost:5000/api/get-dashboard", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleReview = async (id, action) => {
    try {
      const res = await fetch("http://localhost:5000/api/accept-reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          problem_id: id,
          decision: action,
        }),
      });

      if (res.ok) {
        setProblems((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 grid gap-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Pending Problems</h1>

      {problems.filter(p => p.submiter !== user?._id).length === 0 ? (
        <h1>No Pending Problems</h1>
      ) : (
        problems
          .filter((p) => p.submiter !== user?._id) // exclude problems submitted by current user
          .map((problem) => (
            <Card key={problem._id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{problem.title}</h2>
                <p className="text-gray-600">{problem.problem}</p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>🟢 Difficulty: {problem.difficulty}</span>
                  <span>👤 Submitted by: {problem.submiter}</span>
                  <span>💾 Memory: {problem.memory_limit} MB</span>
                  <span>⏱️ Time: {problem.time_limit}s</span>
                </div>

                {/* Download buttons */}
                <div className="flex gap-3 mt-4">
                  <a
                    href={`${problem.testcases}?fl_attachment:testcases.txt`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="hover:cursor-pointer">
                      Download Testcases 📥
                    </Button>
                  </a>
                  <a
                    href={`${problem.expected}?fl_attachment:expected.txt`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="hover:cursor-pointer">
                      Download Expected 📥
                    </Button>
                  </a>
                </div>

                {/* Review buttons */}
                <div className="flex gap-3 mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 hover:cursor-pointer"
                    onClick={() => handleReview(problem._id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 hover:cursor-pointer"
                    onClick={() => handleReview(problem._id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
      )}
    </div>
  );
}
