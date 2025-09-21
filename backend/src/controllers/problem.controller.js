import mongoose from "mongoose";
import { Problem } from "../model/problem.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadFile } from "../utils/fileUpload.js";
import { Code } from "../model/code.model.js";

const getallproblems=asyncHandler(async (req,res)=>{
    const problems=await Problem.find().select("-testcases -expected -input_lines -output_lines -state");
    if(!problems) return res.status(401).json(new ApiError(401,"No Problems Found"));
    return res.status(200).json(new ApiResponse(200,problems,"Problems Fetched Successufully"));
})

const submit_problem=asyncHandler(async (req,res)=>{
    const {problem,submitter,input_lines,output_lines,time_limit,memory_limit,title}=req.body;
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
    const pro=await Problem.create({problem: problem,submiter: submitter,input_lines: input_lines,output_lines: output_lines,testcases: testcases_path,expected: expected_path, time_limit: time_limit, memory_limit: memory_limit,title: title});
    const created=await Problem.findById(pro._id).select("-input_lines -output_lines -testcases_path -expected_path");
    if(!created) return res.status(401).json(new ApiError(401,"Error saving the problem"));
    return res.status(200).json(new ApiResponse(200,created,"Problem sent to admin successfully"));
})

const getproblem=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    if(!mongoose.isValidObjectId(id)) return res.status(401).json(new ApiError(401,"Invalid id"));
    const pro=await Problem.findById(id).select("-testcases -expected -state -input_lines -output_lines");
    if(!pro) return res.status(401).json(new ApiError(401,"Problem not found"));
    return res.status(200).json(new ApiResponse(200,pro,"Problem fetched successfully"));
})

const getsolutions=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.isValidObjectId(id)) return res.status(401).json(new ApiError(401,"Invalid Object Id"));

    const ans=await Code.aggregate([
        {
            $match:{
                problem_id: new mongoose.Types.ObjectId(id),
                state: "pending"
            }
        },
        {
            $project:{
                _id: 0,
                writer: 1,
                code: 1,
                createdAt: 1
            }
        },
        {
            $sort:{
                createdAt: -1
            }
        }
    ])

    if(ans.length==0) return res.status(400).json(new ApiError(400,"Error fetching the codes"));

    return res.status(200).json(new ApiResponse(200,ans,"All accepted solutions fetched successfully"));
})

const prob_sort=asyncHandler(async(req,res)=>{
    const {basis,order}=req.body;
    const sortOrder = order === "asc" ? 1 : -1;
    let probs;
    if(basis==="difficulty"){
        probs = await Problem.aggregate([
            {
                $addFields: {
                    difficultyOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
                                { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
                                { case: { $eq: ["$difficulty", "Hard"] }, then: 3 }
                            ],
                            default: 4
                        }
                    }
                }
            },
            { $sort: { difficultyOrder: sortOrder } }
        ]);

        if(probs.length==0) return res.status(404).json(new ApiError(404,"Problems not found"));
    }
    else if(basis==="acceptance"){
        probs=await Problem.aggregate([
            {
                $addFields:{
                    acceptance_rate:{
                        $cond:{
                            if: {$eq: ["$submissions",0]},
                            then: 0,
                            else: {$divide:["$accepted","$submissions"]}
                        }
                    }
                }
            },
            {
                $sort:{
                    acceptance_rate: sortOrder
                }
            }
        ])
        if(probs.length==0) return res.status(404).json(new ApiError(404,"Problems not found"));
    }
    return res.status(200).json(new ApiResponse(200,probs,"Problems sorted successfully"));
})

const search_prob=asyncHandler(async(req,res)=>{
    const {query}=req.body;
    const probs=await Problem.find({
        $or:[
            {title:{$regex:query,$options:"i"}},
            {problem:{$regex:query,$options:"i"}},
        ]
    })

    if(probs.length==0) return res.status(404).json(new ApiResponse(404,null,"No Problem Found"));
    return res.status(200).json(new ApiResponse(200,probs,"Problem searched successfully"));
})

export {getallproblems,submit_problem,getproblem,getsolutions,prob_sort,search_prob};