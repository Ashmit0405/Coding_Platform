import { asyncHandler } from "../utils/asynchandler.js";
import { cons } from "../utils/containerpools.js"
import { exec } from "child_process";
import fs from "fs/promises";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"

const run_code = asyncHandler(async (req, res) => {
    const { language, code } = req.body;
    console.log("Incoming code:", code);
    console.log("Language: ", language);
    const extension = getFileEx(language);
    let file_name="";
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
        file_name=`${str}.${extension}`;
    }
    else {
        file_name = `prog_${Date.now()}_${Math.floor(Math.random() * 10000)}.${extension}`;
    }
    const hostpath = `public/${file_name}`;
    const containerpath = file_name;
    if (!extension) {
        return res.status(401).json(new ApiError(401, "Invalid language"));
    }

    if (!code) {
        return res.status(401).json(new ApiError(401, "Code not found"));
    }

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

    const cmd = getdoc_com(language, containerpath);
    const dockerCmd = `docker exec ${container} sh -c "${cmd}"`;
    exec(dockerCmd, async (error, stdout, stderr) => {
        await fs.unlink(hostpath).catch(() => { });
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        return res.status(200).json(new ApiResponse(200, stdout));
    })
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

const getdoc_com = (language, containerpath) => {
    switch (language) {
        case "c": return `gcc ${containerpath} -o program && ./program`;
        case "cpp": return `g++ ${containerpath} -o program && ./program`;
        case "java": return `javac ${containerpath} && java ${containerpath.replace(".java", "")}`;
        case "python": return `python3 ${containerpath}`;
        case "javascript": return `node ${containerpath}`;
        default: return null;
    }
}

export { run_code };
