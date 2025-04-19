import { Router } from "express";
import { run_code } from "../controllers/executer.controller.js";

const router=Router();

router.post("/run",run_code);

export {router};