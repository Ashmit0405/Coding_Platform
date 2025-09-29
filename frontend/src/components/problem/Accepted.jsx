import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AcceptedSolutions({ solutions, loading, error, visible, setVisible }) {
  if (!visible) return null;

  return (
    <Card className="flex-1 max-h-[600px] flex flex-col overflow-y-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Accepted Solutions</CardTitle>
        <Button size="sm" onClick={() => setVisible(false)}>Collapse</Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {loading ? (
          <p>Loading solutions...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : solutions.length > 0 ? (
          solutions.map((sol, idx) => (
            <Card key={idx} className="border p-2">
              <p className="text-sm text-gray-500">
                Submitted by: <Link to={`/user/${sol.writer}`}>{sol.writer}</Link>
              </p>
              <p className="text-xs text-gray-400">
                Date: {new Date(sol.createdAt).toLocaleString()}
              </p>
              <Link
                to={`/submission/${sol._id}`}
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                View Full Submission →
              </Link>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No accepted solutions yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
