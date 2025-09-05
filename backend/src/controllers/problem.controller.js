import { Problem } from "../model/problem.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadFile } from "../utils/fileUpload.js";

const getallproblems=asyncHandler(async (req,res)=>{
    const problems=await Problem.find();
    if(!problems) return res.status(401).json(new ApiError(401,"No Problems Found"));
    return res.status(200).json(new ApiResponse(200,problems,"Problems Fetched Successufully"));
})

const submit_problem=asyncHandler(async (req,res)=>{
    const {problem,submitter,input_lines,output_lines}=req.body;
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if(!problem||!submitter||!input_lines||!output_lines) return res.status(401).json(new ApiError(401,"Some fields are missing"));
    const testcases=req.files?.testcases[0]?.path;
    const expected=req.files?.expected[0]?.path;
    if(!testcases||!expected) return res.status(401).json(new ApiError(401,"Both the files must be present"));
    let testcases_path,expected_path;
    try {
        testcases_path=await uploadFile(testcases);
        expected_path=await uploadFile(expected);
    } catch (error) {
        console.log(error)
        return res.status(401).json(new ApiError(401,error.message||"Error sending the file"));
    }
    if(!testcases_path||!expected_path) return res.status(401).json(new ApiError(401,"Error uploading the files"));
    const pro=await Problem.create({problem: problem,submiter: submitter,input_lines: input_lines,output_lines: output_lines,testcases: testcases_path,expected: expected_path});
    const created=await Problem.findById(pro._id).select("-input_lines -output_lines -testcases_path -expected_path");
    if(!created) return res.status(401).json(new ApiError(401,"Error saving the problem"));
    return res.status(200).json(new ApiResponse(200,created,"Problem sent to admin successfully"));
})

export {getallproblems,submit_problem};