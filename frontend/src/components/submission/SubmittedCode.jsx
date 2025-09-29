import { Card, CardContent } from "@/components/ui/card";

export default function SubmittedCode({ code }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Submitted Code</h2>
        <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto max-h-[500px]">
          {code}
        </pre>
      </CardContent>
    </Card>
  );
}
