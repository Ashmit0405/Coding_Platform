import {asyncHandler} from "../utils/asynchandler.js";
import { exec } from "child_process";
import fs from "fs";
import { ApiResponse } from "../utils/apiResponse.js";
const run_code=asyncHandler(async (req, res) => {
    const {code}=req.body;
    console.log(code);
    const file_name=`public/prog_${Date.now()}.c`;
    console.log(file_name);
    fs.writeFile(`${file_name}`, code, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        console.log("File written successfully");
    });
    exec(`gcc ${file_name} -o program && ./program`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        console.log(`stdout: ${stdout}`);
        return res.status(200).json(new ApiResponse(200, stdout));
    });
});

export {run_code};