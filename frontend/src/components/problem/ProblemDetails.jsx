import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProblemDetails({ problem }) {
  return (
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
          <p>
            <span className="font-semibold">Acceptance:</span>{" "}
            {problem.submissions > 0
              ? (problem.accepted / problem.submissions).toFixed(2)
              : 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
