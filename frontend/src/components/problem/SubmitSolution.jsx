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
import { Controller } from "react-hook-form";
export default function SubmitSolution({ control, selectedLanguage, register, handleSubmit, submitSolution, submitting, result }) {
  return (
    <Card className="flex-1 max-h-[1000px] flex flex-col">
      <CardHeader>
        <CardTitle>Submit Your Solution</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(submitSolution)} className="flex flex-col flex-1">
      <CardContent className="flex flex-col gap-4 flex-1 overflow-y-auto">
        <Label>Language</Label>
        <Controller
          name="language"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}>
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
            </Select>)}
        />
        <Texteditor
          name="Content"
          control={control}
          label={`Your Solution (${selectedLanguage})`}
          key={selectedLanguage}
          language={selectedLanguage}
          className="flex-1 min-h-[200px]"
        />

        <Button
          type="submit"
          // onClick={handleSubmit(submitSolution)}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>

        <ResultDisplay result={result} />
      </CardContent>
      </form>
    </Card>
  );
}
