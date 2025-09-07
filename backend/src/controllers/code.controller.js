import { Code } from "../model/code.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const submit_code=asyncHandler(async (req,res)=>{
    const {code,problem_id,writer}=req.body;
    if(!code||!problem_id||!writer) return res.status(400).json(new ApiError(400,"All Fields must be filled"));
    const newsol=await Code.create({
        code: code,
        problem_id: problem_id,
        writer: writer
    });
    const created=await Code.findById(newsol._id);
    if(!created) return res.status(400).json(new ApiError(400,"Error submitting the code"));
    return res.status(200).json(new ApiResponse(200,newsol,"Code submitted successfully"));
})

export {submit_code};