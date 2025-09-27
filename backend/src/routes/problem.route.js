import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { get_history_prob, getallproblems, getproblem, getsolutions, prob_sort, search_prob, submit_problem } from "../controllers/problem.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { check_ps } from "../middlewares/ps.middleware.js";

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
]),verifyJWT,check_ps,submit_problem);
prob_router.route("/get-problem/:id").get(getproblem);
prob_router.route("/sort-problem").post(prob_sort);
prob_router.route("/search-problem").post(search_prob);
prob_router.route("/get-sols/:id").get(getsolutions);
prob_router.route("/get-history").post(get_history_prob);

export {prob_router}