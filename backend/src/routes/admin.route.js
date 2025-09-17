import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {checkadmin} from "../middlewares/admin.middleware.js"
import { accept_reject, change_role, getallusers, getdashboard, remove_acc } from "../controllers/admin.controller.js";
const admin_rou=Router();

admin_rou.route("/get-dashboard").get(verifyJWT,checkadmin,getdashboard);
admin_rou.route("/accept-reject").post(verifyJWT,checkadmin,accept_reject);
admin_rou.route("/get-all-users").get(verifyJWT,checkadmin,getallusers);
admin_rou.route("/remove-acc/:id").delete(verifyJWT,checkadmin,remove_acc);
admin_rou.route("/change-role").post(verifyJWT,checkadmin,change_role);

export {admin_rou};