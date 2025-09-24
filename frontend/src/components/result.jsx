export default function ResultDisplay({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h2 className="text-lg font-bold mb-2">Result</h2>
      <p className="mb-2">{typeof result.text === "string" ? result.text : result.message}</p>

      {Array.isArray(result.failedCases) && result.failedCases.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Failed Cases:</h3>
          <ul className="list-disc ml-6 space-y-2">
            {result.failedCases.map((c, idx) => (
              <li key={idx}>
                <span className="font-semibold">Case {c.case}:</span>
                <div>
                  <p>
                    <strong>Input:</strong>{" "}
                    {Array.isArray(c.input) ? c.input.join(", ") : c.input}
                  </p>
                  <p>
                    <strong>Expected:</strong>{" "}
                    {Array.isArray(c.expected) ? c.expected.join(" ") : c.expected}
                  </p>
                  <p>
                    <strong>Got:</strong>{" "}
                    {Array.isArray(c.got) ? c.got.join(" ") : c.got}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
