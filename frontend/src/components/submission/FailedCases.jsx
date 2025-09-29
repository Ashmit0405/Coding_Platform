import { Card, CardContent } from "@/components/ui/card";

export default function FailedCases({ failedCases }) {
  if (!failedCases || failedCases.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Failed Test Cases</h2>
        {failedCases.map((fc) => (
          <div key={fc._id} className="p-3 mb-3 border rounded-md bg-red-50">
            <p className="font-medium">Case #{fc.case}</p>
            <p>
              <strong>Input:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1">{fc.input.join("\n")}</pre>
            </p>
            <p>
              <strong>Expected:</strong>{" "}
              <code className="bg-green-100 p-1 rounded">{fc.expected.join(", ")}</code>
            </p>
            <p>
              <strong>Got:</strong>{" "}
              <code className="bg-red-100 p-1 rounded">{fc.got.join(", ")}</code>
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
