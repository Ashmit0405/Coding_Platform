import { Router } from "express";
import { changePassword, changeProfile, getUser, login, logout, refreshAccessToken, registration } from "../controllers/user.controller.js";
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
userroute.route("/change-profile").post(verifyJWT,changeProfile);
userroute.route("/get-user").get(verifyJWT,getUser);
userroute.route("/refresh-access").post(refreshAccessToken);
// userroute.route("/")

export {userroute}