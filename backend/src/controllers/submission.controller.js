import { asyncHandler } from "../utils/asynchandler.js";
import { cons } from "../utils/containerpools.js";
import { exec } from "child_process";
import fs from "fs/promises";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Problem } from "../model/problem.model.js";
import { Code } from "../model/code.model.js";
import axios from "axios";
import path from "path";
import { isValidObjectId } from "mongoose";
import { promisify } from "util";

const execPromise = promisify(exec);

const run_code = asyncHandler(async (req, res) => {
    const { language, code, problem_id, writer } = req.body;
    if (!code || !problem_id || !writer) 
        return res.status(400).json(new ApiError(400, "All Fields must be filled"));

    const newsol = await Code.create({ code, problem_id, writer });
    const extension = getFileEx(language);
    if (!extension) return res.status(401).json(new ApiError(401, "Invalid language"));

    const problem = await Problem.findById(problem_id);
    if (!problem) return res.status(401).json(new ApiError(401, "Problem not found"));

    const pool = cons[language];
    if (!pool) return res.status(401).json(new ApiError(401, "Invalid language"));

    const container = await pool.acquire();
    if (!container) return res.status(500).json(new ApiError(500, 'Server busy'));

    const host = path.join(process.cwd(), "tmp", "problems", problem_id.toString());
    await fs.mkdir(host, { recursive: true });

    const file_name = language === "java" ? getjavaname(code, extension) : `prog_${Date.now()}_${Math.floor(Math.random() * 10000)}_${newsol._id}.${extension}`;
    const codeFilePath = path.join(host, file_name);
    await fs.writeFile(codeFilePath, code);

    try {
        const testcasespath = await downloadfile(problem.testcases, path.join(host, "testcases.txt"));
        const expectedpath = await downloadfile(problem.expected, path.join(host, "expected.txt"));
        if (!testcasespath || !expectedpath)
            throw new Error("Error getting the testcases");

        const cont = `/usr/src/myapp/problems/${problem_id}`;
        const sub_fold = `${cont}/${newsol._id}`;
        const contCodeFile = `${sub_fold}/${file_name}`;
        const contOutputFile = `${sub_fold}/output.txt`;
        const contTestFile = `${cont}/testcases.txt`;
        const contExpectedFile = `${cont}/expected.txt`;        
        await execPromise(`docker exec ${container} mkdir -p ${sub_fold}`);
        await Promise.all([
            execPromise(`docker cp ${testcasespath} ${container}:${contTestFile}`),
            execPromise(`docker cp ${expectedpath} ${container}:${contExpectedFile}`),
            execPromise(`docker cp ${codeFilePath} ${container}:${contCodeFile}`)
        ]);

        const cmd = getdoc_com(language, contCodeFile, sub_fold, contTestFile, contOutputFile);
        const dockerCmd = `docker exec ${container} sh -c "/usr/bin/time -v timeout ${problem.time_limit + 1}s ${cmd}"`;

        let stdout = "", stderr = "";
        try {
            const result = await execPromise(dockerCmd);
            stdout = result.stdout;
            stderr = result.stderr;
        } catch (error) {
            stdout = error.stdout || "";
            stderr = error.stderr || "";
            if (error.killed || error.signal === "SIGTERM" || error.code === 124) {
                newsol.state = "Time Limit Exceeded";
                await newsol.save();
                return res.status(200).json(new ApiResponse(200, "TLE encountered"));
            }
        }

        await fs.rm(host, { recursive: true, force: true }).catch(() => {});
        await fs.unlink(testcasespath).catch(() => {});
        await fs.unlink(expectedpath).catch(() => {});

        newsol.stdout = stdout;
        newsol.stderr = stderr;
        newsol.fexec_time = 0;
        newsol.memory = 0;

        const lines = stderr.split("\n");
        const memLine = lines.find(l => l.includes("Maximum resident set size"));
        if (memLine) newsol.memory = parseInt(memLine.split(":")[1].trim(), 10) / 1024;

        const usrTime = lines.find(l => l.includes("User time (seconds)"));
        const sysTime = lines.find(l => l.includes("System time (seconds)"));
        if (usrTime && sysTime) {
            const u = parseFloat(usrTime.split(":")[1].trim());
            const s = parseFloat(sysTime.split(":")[1].trim());
            newsol.fexec_time = Math.round((u + s) * 1000);
        }

        if (newsol.memory > problem.memory_limit) {
            newsol.state = "Memory Limit Exceeded";
            await newsol.save();
            return res.status(200).json(new ApiResponse(200, "MLE encountered"));
        }

        const resp = await checkResults(container, problem_id, newsol._id, problem.output_lines, problem.input_lines);
        if (!resp) throw new Error("Error fetching the cases");

        problem.submissions += 1;
        if (resp.every(r => r.passed)) {
            problem.accepted += 1;
            await problem.save();
            newsol.state = "Accepted";
            newsol.failed_cases = [];
            await newsol.save();
            return res.status(200).json(new ApiResponse(200, "All cases passed"));
        } else {
            await problem.save();
            newsol.state = "Wrong Answer";
            newsol.failed_cases = resp.filter(r => !r.passed);
            await newsol.save();
            return res.status(200).json(new ApiResponse(200, newsol.failed_cases, "Wrong Answer"));
        }

    } catch (error) {
        newsol.state = "Runtime/Compilation error";
        await newsol.save();
        return res.status(500).json(new ApiError(500, error.message || "Unknown error"));
    } finally {
        await pool.release(container);
    }
});

const getFileEx = (language) => {
    switch (language) {
        case "c": return "c";
        case "cpp": return "cpp";
        case "python": return "py";
        case "java": return "java";
        case "javascript": return "js";
        default: return null;
    }
}

const getdoc_com = (language, codeFile, sub_fold, inputFile, outputFile) => {
    const execFile = `${sub_fold}/program`;
    switch (language) {
        case "c":
            return `gcc ${codeFile} -o ${execFile} && chmod +x ${execFile} && ${execFile} < ${inputFile} > ${outputFile}`;
        case "cpp":
            return `g++ ${codeFile} -o ${execFile} -O2 -std=c++17 && chmod +x ${execFile} && ${execFile} < ${inputFile} > ${outputFile}`;
        case "java": {
            const classname = codeFile.split("/").pop().replace(".java", "");
            return `javac ${codeFile} && cat ${inputFile} | java -cp ${sub_fold} ${classname} > ${outputFile}`;
        }
        case "python":
            return `cat ${inputFile} | python3 ${codeFile} > ${outputFile}`;
        case "javascript":
            return `cat ${inputFile} | node ${codeFile} > ${outputFile}`;
        default:
            return null;
    }
};

const getjavaname = (code, extension) => {
    const idx = code.indexOf("public class ");
    let str = "";
    if (idx !== -1) {
        const start = idx + 13;
        for (let i = start; i < code.length; i++) {
            const ch = code.charAt(i);
            if (ch === ' ' || ch === '{' || ch === '\n') break;
            str += ch;
        }
    }
    return `${str}.${extension}`;
};

const downloadfile = async (url, dest) => {
    const resp = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(dest, resp.data);
    return dest;
};

const checkResults = async (container, problem_id, submit_id, output_lines, input_lines) => {
    const base = `/usr/src/myapp/problems/${problem_id}`;
    const expectedFile = `${base}/expected.txt`;
    const outputFile = `${base}/${submit_id}/output.txt`;
    const testcaseFile = `${base}/testcases.txt`;

    const readFileLines = async (file) => {
        const { stdout } = await execPromise(`docker exec ${container} cat ${file}`);
        return stdout.trim().split("\n");
    };

    const testcases = (await readFileLines(testcaseFile)).slice(1);
    const expectedLines = await readFileLines(expectedFile);
    const outputLines = await readFileLines(outputFile);

    const results = [];
    let expIdx = 0, outIdx = 0, caseNo = 1, testIdx = 0;

    while (expIdx < expectedLines.length && outIdx < outputLines.length) {
        const expChunk = expectedLines.slice(expIdx, expIdx + output_lines);
        const outChunk = outputLines.slice(outIdx, outIdx + output_lines);
        const inputChunk = testcases.slice(testIdx, testIdx + input_lines);

        if (expChunk.join("\n").trim() === outChunk.join("\n").trim()) {
            results.push({ case: caseNo, passed: true });
        } else {
            results.push({
                case: caseNo,
                passed: false,
                input: inputChunk,
                expected: expChunk,
                got: outChunk
            });
        }

        expIdx += output_lines;
        outIdx += output_lines;
        testIdx += input_lines;
        caseNo++;
    }

    return results;
};

const getsubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || !isValidObjectId(id)) return res.status(400).json(new ApiError(400, "Id Not Correct"));
    const sub = await Code.findById(id)
    if (!sub) return res.status(400).json(new ApiError(400, "Error Fetching the submission"));
    return res.status(200).json(new ApiResponse(200, sub, "Submission Fetched Successfully"))
})

export { run_code, getsubmission };
