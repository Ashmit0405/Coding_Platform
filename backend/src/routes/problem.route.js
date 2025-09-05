import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getallproblems, submit_problem } from "../controllers/problem.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const prob_router=Router();
prob_router.route("/get-all-problems").get(getallproblems);
prob_router.route("/submit-problem").post(upload.fields([
    {
        name: "testcases",
        maxCount: 1
    },
    {
        name: "expected",
        maxCount: 1
    }
]),submit_problem);

export {prob_router}