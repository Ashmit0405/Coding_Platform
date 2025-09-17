import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const systemcheck=asyncHandler(async (req,res)=>{
    return res.status(200).json(new ApiResponse(200,"System working fine"));
})

export {systemcheck};