import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navbar from "@/components/navbar.jsx";
import { AuthContext } from "@/context/AuthContext.jsx";
import useSubmission from "@/hooks/useSubmission.js";
import useProblem from "@/hooks/useProblem.js";
import useSolutions from "@/hooks/useSolutions.js";
import useHistory from "@/hooks/useHistory.js";

import AcceptedSolutions from "@/components/problem/Accepted.jsx";
import SubmissionHistory from "@/components/problem/History.jsx";
import ProblemDetails from "@/components/problem/ProblemDetails.jsx";
import SubmitSolution from "@/components/problem/SubmitSolution.jsx";
import { Button } from "@/components/ui/button";
export default function ProblemPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const { problem, loading: loadingProblem, error: errorProblem } = useProblem(id);
  const { solutions, loading: loadingSolutions, error: errorSolutions } = useSolutions(id);
  const { history, loading: loadingHistory, error: errorHistory } = useHistory(id, user?._id);

  const [solutionsVisible, setSolutionsVisible] = useState(true);
  const [historyVisible, setHistoryVisible] = useState(true);

  const { control, handleSubmit, watch, register } = useForm({
    defaultValues: { language: "cpp", Content: "" },
  });
  const selectedLanguage = watch("language");
  const { submitting, result, submitSolution } = useSubmission({ problemId: id, user });

  if (loadingProblem) return <p className="p-4">Loading problem...</p>;
  if (errorProblem) return <p className="p-4 text-red-500">Error: {errorProblem}</p>;
  if (!problem) return <p className="p-4 text-red-500">Problem not found.</p>;

  return (
    <div className="w-full mx-auto p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">{problem.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProblemDetails problem={problem} />

        <SubmitSolution
          control={control}
          selectedLanguage={selectedLanguage}
          register={register}
          handleSubmit={handleSubmit}
          submitSolution={submitSolution}
          submitting={submitting}
          result={result}
        />

        <AcceptedSolutions
          solutions={solutions}
          loading={loadingSolutions}
          error={errorSolutions}
          visible={solutionsVisible}
          setVisible={setSolutionsVisible}
        />

        <SubmissionHistory
          history={history}
          loading={loadingHistory}
          error={errorHistory}
          visible={historyVisible}
          setVisible={setHistoryVisible}
        />
      </div>

      <div className="flex mt-4 gap-4">
        {!solutionsVisible && <Button  className={"hover:cursor-pointer"} onClick={() => setSolutionsVisible(true)}>Show Accepted Solutions</Button>}
        {!historyVisible && <Button className={"hover:cursor-pointer"} onClick={() => setHistoryVisible(true)}>Show Your History</Button>}
      </div>
    </div>
  );
}
