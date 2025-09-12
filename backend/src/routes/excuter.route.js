import { Router } from "express";
import { run_code } from "../controllers/submission.controller.js";

const runner_router=Router();

runner_router.post("/run",run_code);

export {runner_router};