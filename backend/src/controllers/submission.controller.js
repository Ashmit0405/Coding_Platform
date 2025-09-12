import { asyncHandler } from "../utils/asynchandler.js";
import { cons } from "../utils/containerpools.js"
import { exec, execSync } from "child_process";
import fs from "fs/promises";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import { Problem } from "../model/problem.model.js";
import { Code } from "../model/code.model.js";
import axios from "axios"
import path from "path";

const run_code = asyncHandler(async (req, res) => {
    const { language, code, problem_id, writer } = req.body;
    if (!code || !problem_id || !writer) return res.status(400).json(new ApiError(400, "All Fields must be filled"));
    const newsol = await Code.create({
        code: code,
        problem_id: problem_id,
        writer: writer
    });

    const extension = getFileEx(language);
    if (!extension) {
        return res.status(401).json(new ApiError(401, "Invalid language"));
    }

    const problem = await Problem.findById(problem_id);
    if (!problem) return res.status(401).json(new ApiError(401, "Problem not found"));

    const input_lines = problem.input_lines;
    const output_lines = problem.output_lines;
    const file_name = language === "java" ? getjavaname(code, extension) : `prog_${Date.now()}_${Math.floor(Math.random() * 10000)}_${newsol._id}.${extension}`;

    // console.log(file_name)
    const pool = cons[language];

    if (!pool) {
        return res.status(401).json(new ApiError(401, "Invalid langauge"));
    }
    const container = pool.acquire();
    if (!container) {
        return res.status(500).json(new ApiError(500, 'Server busy'));
    }

    const host = path.join(process.cwd(), "tmp", "problems", problem_id.toString());
    await fs.mkdir(host, { recursive: true });

    // save code file on host
    const codeFilePath = path.join(host, file_name);
    await fs.writeFile(codeFilePath, code);

    try {
        const testcasespath = await downloadfile(problem.testcases, path.join(host, "testcases.txt"));
        const expectedpath = await downloadfile(problem.expected, path.join(host, "expected.txt"));
        if (!testcasespath || !expectedpath) {
            return res.status(500).json(new ApiError(500, "Error getting the testcases"));
        }

        const cont = `/usr/src/myapp/problems/${problem_id}`;
        const sub_fold = `${cont}/${newsol._id}`;
        const contCodeFile = `${sub_fold}/${file_name}`;
        const contOutputFile = `${sub_fold}/output.txt`;
        const contTestFile = `${cont}/testcases.txt`;
        const contExpectedFile = `${cont}/expected.txt`;

        execSync(`docker exec ${container} mkdir -p ${sub_fold}`);
        execSync(`docker cp ${testcasespath} ${container}:${contTestFile}`);
        execSync(`docker cp ${expectedpath} ${container}:${contExpectedFile}`);
        execSync(`docker cp ${codeFilePath} ${container}:${contCodeFile}`);


        const cmd = getdoc_com(language, contCodeFile, sub_fold, contTestFile, contOutputFile);
        const dockerCmd = `docker exec ${container} sh -c "timeout ${problem.time_limit}s ${cmd}"`;
        exec(dockerCmd, async (error, stdout, stderr) => {
            await fs.unlink(host).catch(() => { });
            await fs.unlink(testcasespath).catch(() => { });
            await fs.unlink(expectedpath).catch(() => { });
            if (error && error.code !== 1) {
                return res.status(500).json({ error: "some error" });
            }

            const resp = await checkResults(container, problem_id, newsol._id, output_lines, input_lines);
            if (!resp) return res.status(400).json(new ApiError(400, "Error fetching the cases"));

            if (resp.every(r => r.passed)) {
                problem.submissions += 1;
                problem.accepted+=1;
                await problem.save();
                return res.status(200).json(new ApiResponse(200, "All cases passed"));
            } else {
                problem.submissions += 1;
                await problem.save();
                return res.status(200).json(new ApiResponse(200, { success: false, resp }));
            }
        });
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Unknown error"));
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
            return `gcc ${codeFile} -o ${execFile} && cat ${inputFile} | ${execFile} > ${outputFile}`;
        case "cpp":
            return `g++ ${codeFile} -o ${execFile} && cat ${inputFile} | ${execFile} > ${outputFile}`;
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
    console.log("Detected Java class:", str);
    return `${str}.${extension}`;
}

const downloadfile = async (url, dest) => {
    const resp = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(dest, resp.data);
    return dest;
}

const checkResults = async (container, problem_id, submit_id, output_lines, input_lines) => {
    const base = `/usr/src/myapp/problems/${problem_id}`;
    const expectedFile = `${base}/expected.txt`;
    const outputFile = `${base}/${submit_id}/output.txt`;
    const testcaseFile = `${base}/testcases.txt`;

    const readFile = (file) =>
        execSync(`docker exec ${container} cat ${file}`)
            .toString()
            .trim()
            .split("\n");

    const testcases = readFile(testcaseFile).slice(1);
    const expectedLines = readFile(expectedFile);
    const outputLines = readFile(outputFile);

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

export { run_code };
