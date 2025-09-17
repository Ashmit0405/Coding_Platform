import { Router } from "express";
import { systemcheck } from "../controllers/system.controller.js";

const system_rou=Router();

system_rou.route("/system-check").get(systemcheck);

export {system_rou};