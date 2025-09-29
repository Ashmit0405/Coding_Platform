import { Router } from "express";
import { changePassword, changeProfile, codeprofile, getcurrUser, getotheruser, getuser_logs, login, logout, refreshAccessToken, registration, search_user, updateDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userroute=Router();

userroute.route("/register").post(
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
    ]),registration);
userroute.route("/login").post(login);
userroute.route("/logout").post(verifyJWT,logout);
userroute.route("/password-change").post(verifyJWT,changePassword);
userroute.route("/change-profile").post(verifyJWT,upload.fields([
    {
        name: "coverImage_path",
        maxCount: 1
    }
]),changeProfile);
userroute.route("/get-curr-user").get(verifyJWT,getcurrUser);
userroute.route("/refresh-access").post(refreshAccessToken);
userroute.route("/get-user/:id").get(getotheruser);
userroute.route("/get-logs/:problem_id").get(verifyJWT,getuser_logs);
userroute.route("/get-coding-profile").get(verifyJWT,codeprofile)
userroute.route("/update-details").post(verifyJWT,updateDetails)
userroute.route("/search-user").post(verifyJWT,search_user)

export {userroute}