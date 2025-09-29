import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export default function SubmissionInfo({ submission }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Submission ID:</span>
          <code className="bg-gray-100 p-1 rounded">{submission._id}</code>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Problem ID:</span>
          <code className="bg-gray-100 p-1 rounded">
            <Link to={`/problem/${submission.problem_id}`}>{submission.problem_id}</Link>
          </code>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Submitted By:</span>
          <code className="bg-gray-100 p-1 rounded">
            <Link to={`/user/${submission.writer}`}>{submission.writer}</Link>
          </code>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">State:</span>
          <Badge
            variant={
              submission.state === "Accepted"
                ? "success"
                : submission.state === "Wrong Answer"
                ? "destructive"
                : "secondary"
            }
          >
            {submission.state}
          </Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Execution Time:</span> {submission.fexec_time} ms
          </div>
          <div>
            <span className="font-medium">Memory:</span> {submission.memory} MB
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
