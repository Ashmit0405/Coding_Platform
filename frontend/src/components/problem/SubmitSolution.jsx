import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Texteditor from "../texteditor.jsx";
import ResultDisplay from "../result.jsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SubmitSolution({ control, selectedLanguage, register, handleSubmit, submitSolution, submitting, result }) {
  return (
    <Card className="flex-1 max-h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Submit Your Solution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
        <Label>Language</Label>
        <Select {...register("language", { required: true })} defaultValue="cpp">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
          </SelectContent>
        </Select>

        <Texteditor
          name="Content"
          control={control}
          label={`Your Solution (${selectedLanguage})`}
          language={selectedLanguage}
          className="flex-1 min-h-[200px]"
        />

        <Button
          type="submit"
          onClick={handleSubmit(submitSolution)}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>

        <ResultDisplay result={result} />
      </CardContent>
    </Card>
  );
}
