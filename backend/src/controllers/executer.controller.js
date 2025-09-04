import { asyncHandler } from "../utils/asynchandler.js";
import { cons } from "../utils/containerpools.js"
import { exec } from "child_process";
import fs from "fs/promises";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import { Problem } from "../model/problem.model.js";

const run_code = asyncHandler(async (req, res) => {
    const { language, code, problem_id } = req.body;
    console.log("Incoming code:", code);
    console.log("Language: ", language);
    const extension = getFileEx(language);
    if (!extension) {
        return res.status(401).json(new ApiError(401, "Invalid language"));
    }

    if (!code) {
        return res.status(401).json(new ApiError(401, "Code not found"));
    }

    const problem = await Problem.findById(problem_id);
    if (!problem) return res.status(401).json(new ApiError(401, "Problem not found"));

    const input_lines = problem.input_lines;
    const output_lines = problem.output_lines;
    let file_name = "";
    if (language === "java") {
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
        file_name = `${str}.${extension}`;
    }
    else {
        file_name = `prog_${Date.now()}_${Math.floor(Math.random() * 10000)}.${extension}`;
    }
    const hostpath = `public/problems/${problem_id}/${file_name}`;
    const containerpath = `problems/${problem_id}/${file_name}`;
    console.log(file_name)

    await fs.writeFile(hostpath, code);
    console.log("File written:", hostpath);

    const pool = cons[language];

    if (!pool) {
        return res.status(401).json(new ApiError(401, "Invalid langauge"));
    }
    const container = pool.acquire();

    if (!container) {
        return res.status(500).json(new ApiError(500, 'Server busy'));
    }

    const cmd = getdoc_com(language, containerpath, problem_id);
    const dockerCmd = `docker exec ${container} sh -c "${cmd}"`;
    exec(dockerCmd, async (error, stdout, stderr) => {
        await fs.unlink(hostpath).catch(() => { });

        if (error && error.code !== 1) {
            return res.status(500).json({ error: error.message });
        }

        const base = "/usr/src/myapp/problems";
        const outputFile = `${base}/${problem_id}/output.txt`;
        const expectedFile = `${base}/${problem_id}/expected.txt`;
        const checking_cmd = `diff -w ${expectedFile} ${outputFile}`;
        const docker_check = `docker exec ${container} sh -c "${checking_cmd}"`
        exec(docker_check, async (err, stdout, stderr) => {
            if (err && err.code === 1) {
                const diffs = [];
                const lines = stdout.trim().split("\n");
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.match(/^\d/)) {
                        const [from, change, to] = line.match(/^(\d+)([acd])(\d+)/).slice(1);
                        const expected = lines[i + 1]?.replace(/^< /, "");
                        const found = lines[i + 3]?.replace(/^> /, "");
                        diffs.push({ line: from, expected, found });
                        i += 3;
                    }
                }
                return res.status(200).json({ success: false, diff: diffs });
            } else if (err) {
                return res.status(500).json({ error: "Error running diff", details: err.message });
            } else {
                return res.status(200).json(new ApiResponse(200, "All passed"));
            }
        });
    });
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

const getdoc_com = (language, containerpath, problem_id) => {
    const base = "/usr/src/myapp/problems";
    const inputFile = `${base}/${problem_id}/testcases.txt`;
    const outputFile = `${base}/${problem_id}/output.txt`;
    const execFile = `${base}/${problem_id}/program`
    switch (language) {
        case "c":
            return `gcc ${containerpath} -o ${execFile} && cat ${inputFile} | ${execFile} > ${outputFile}`;
        case "cpp":
            return `g++ ${containerpath} -o ${execFile} && cat ${inputFile} | ${execFile} > ${outputFile}`;
        case "java": {
            const classDir = `${base}/${problem_id}`;
            const classname = containerpath.split("/").pop().replace(".java", "");
            return `javac ${containerpath} && cat ${inputFile} | java -cp ${classDir} ${classname} > ${outputFile}`;
        }
        case "python":
            return `cat ${inputFile} | python3 /usr/src/myapp/${containerpath} > ${outputFile}`;
        case "javascript":
            return `cat ${inputFile} | node /usr/src/myapp/${containerpath} > ${outputFile}`;
        default: return null;
    }
}

export { run_code };
