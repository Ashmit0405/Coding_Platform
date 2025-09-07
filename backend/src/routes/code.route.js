import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { submit_code } from "../controllers/code.controller.js";

const code_router=Router();
code_router.route("/submit-code").post(verifyJWT,submit_code);

export {code_router}