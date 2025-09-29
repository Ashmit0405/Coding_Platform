import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SubmissionHistory({ history, loading, error, visible, setVisible }) {
  if (!visible) return null;

  return (
    <Card className="flex-1 max-h-[600px] flex flex-col overflow-y-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Your Submission History</CardTitle>
        <Button size="sm" onClick={() => setVisible(false)}>Collapse</Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {loading ? (
          <p>Loading history...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : history.length > 0 ? (
          history.map((h, idx) => (
            <Card key={idx} className="border p-2">
              <p className="text-sm text-gray-500">Status: {h.state}</p>
              <p className="text-xs text-gray-400">
                Memory: {h.memory} MB | Time: {h.fexec_time} ms
              </p>
              <Link
                to={`/submission/${h._id}`}
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                View Full Submission →
              </Link>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No submissions yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
