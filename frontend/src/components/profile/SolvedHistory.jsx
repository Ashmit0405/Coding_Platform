import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SolvedHistory({ problems, loading, visible, setVisible }) {
  return (
    <Card>
      <CardHeader className="w-64">
        <CardTitle>History</CardTitle>
        <Button size="sm" onClick={() => setVisible(!visible)}>
          {visible ? "Collapse" : "Expand"}
        </Button>
      </CardHeader>

      {visible && (
        <CardContent className="space-y-2">
          {loading ? (
            <p className="text-gray-600">Loading problems...</p>
          ) : problems.length > 0 ? (
            <ul className="space-y-2">
              {problems.map((problem, idx) => (
                <li key={idx} className="p-3 border rounded-md hover:bg-gray-50 transition">
                  <p className="font-medium text-blue-600">
                    <Link to={`/problem/${problem.problem_id}`}>{problem.problem_id}</Link>
                  </p>
                  <p className="text-sm text-gray-500">Result: {problem.state}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No problems solved yet.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
