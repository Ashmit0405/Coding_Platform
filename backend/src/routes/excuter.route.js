import { Router } from "express";
import { getsubmission, run_code } from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const runner_router=Router();

runner_router.post("/run",verifyJWT,run_code);
runner_router.get("/get-sub/:id",verifyJWT,getsubmission);

export {runner_router};