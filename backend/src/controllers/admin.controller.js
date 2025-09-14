import { Problem } from "../model/problem.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {User} from "../model/user.model.js"

const getdashboard = asyncHandler(async (req, res) => {
    const problems = await Problem.aggregate([
        {
            $match: {
                state: "Pending"
            }
        },
        {
            $project: {
                _id: 0,
                problem: 1,
                submiter: 1,
                createdAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    if (problems.length == 0) res.status(401).json(new ApiError(401, "Error fetching the pending problems"));
    return res.status(200).json(new ApiResponse(200, problems, "Pending problems fetched successfully"))
})

const accept_reject = asyncHandler(async (req, res) => {
    const { problem_id, decision } = req.body;
    if (!problem_id || !decision) return res.status(401).json(new ApiError(401, "Id or decision missing"));

    const prob = await Problem.findById(problem_id);
    if (!prob) return res.status(401).json(new ApiError(401, "Problem does not exist"));

    if (decision == "accepted") { 
        prob.state = decision; 
        await prob.save(); 
    }
    else if(decision=="rejected"){
        await Problem.findByIdAndDelete(problem_id);
    }
    else return res.status(404).json(new ApiError(404,"Invalid decision"));
    return res.status(200).json(new ApiResponse(200, "Problem's decision made"));
})

const getallusers=asyncHandler(async(req,res)=>{
    const users=await User.find({}).select("-password -refreshToken");
    if(users.length==0) return res.status(404).json(new ApiError(404,"Error getting all the suers"));
    return res.status(200).json(new ApiResponse(200,users,"All users fetched successfully"))
})

const remove_acc=asyncHandler(async(req,res)=>{
    const {user_id}=req.params;
    if(!user_id) return res.status(404).json(new ApiError(404,"Id not found"));
    const user=await User.findByIdAndDelete(user_id);
    if(!user) return res.status(404).json(new ApiResponse(404,"Error removing the user"));
    return res.status(200).json(new ApiResponse(200,user,"User removed successfully"));
})

const change_role=asyncHandler(async(req,res)=>{
    const {user_id,role}=req.body;
    const user=await User.findById(user_id);
    if(!user) return res.status(404).json(new ApiError(404,"Error fetching the user"));
    user.role=role;
    try {
        await user.save();
        return res.status(200).json(new ApiResponse(200,"User role changed successfully"));
    } catch (error) {
        return res.status(404).json(new ApiError(404,"Error saving the user",error));
    }

})

export { getdashboard, accept_reject, getallusers, remove_acc, change_role };