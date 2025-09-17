import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const check_ps=asyncHandler(async (req,res,next)=>{
    const user=req.user;
    if(!user) throw new ApiError(400,"User Not Found");
    if(user.role!=="problem_setter"&&user.role!=="admin"){
        throw new ApiError(400,"This role is not allowed"); 
    }
    next();
})

export {check_ps};