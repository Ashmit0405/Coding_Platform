import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../model/user.model.js";


const verifyJWT=asyncHandler(async (req,res,next)=>{
    try {
        console.log(req)
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(400,"Token Not Found");
        }

        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user=await User.findById(decoded?._id).select("-password -refreshToken");
        console.log(user)
        if(!user){
            throw new ApiError(401,"User Not Found");
        }
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(501,error?.message||"Something went wrong");
    }
})

export {verifyJWT};