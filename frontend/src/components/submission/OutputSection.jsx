import { Card, CardContent } from "@/components/ui/card";

export default function OutputSection({ stdout, stderr }) {
  if (!stdout && !stderr) return null;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {stdout && (
          <div>
            <h3 className="font-medium">Stdout:</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{stdout}</pre>
          </div>
        )}
        {stderr && (
          <div>
            <h3 className="font-medium">Stderr:</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">{stderr}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
