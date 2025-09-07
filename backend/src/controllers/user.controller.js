import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadFile } from "../utils/fileUpload.js";
import jwt from "jsonwebtoken"
import { Code } from "../model/code.model.js";
import mongoose from "mongoose";
const generateAccessandRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;

        const res=await user.save({validateBeforeSave:false});
        if(!res) throw new ApiError(501,"Token not saved");
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(501,error?.message||"Server error in creating the token");
    }
}

const registration=asyncHandler(async (req,res)=>{
    const {username,fullname,email,password,role}=req.body;
    if(!username||!email||!fullname||!password||!role){
        return res.status(401).json(new ApiError(401,"User or email or fullnane is missing"));
    }
    console.log(username," ",fullname," ",email," ",password," ",role);
    const existeduser=await User.findOne({
        $or:[{username},{email},{fullname}]
    });
    if(existeduser){
        return res.status(401).json(new ApiError(401,"User already exists"));
    }
    const profilePhoto=req.files?.profilePhoto[0]?.path;
    const newuser=await User.create({
        username,
        fullname,
        password,
        email,
        role:role,
        profilePhoto:profilePhoto||""
    });
    const created=await User.findById(newuser._id).select("-password -profilePhoto -refreshToken")
    if(!created){
        return res.status(401).json(new ApiError(401,"Error creating new user"));
    }
    return res.status(200).json(new ApiResponse(200,"User created successfully"));
})

const login=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) return res.status(401).json(new ApiError(401,"Some fields are missing"));
    const user=await User.findOne({
        $or:[{email}]
    })
    if(!user) return res.status(401).json(new ApiError(401,"User Not Found"));
    const iscorrect=await user.isPasswordCorrect(password);
    if(!iscorrect) return res.status(401).json(new ApiError(401,"Password not matched"));
    const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id);
    const options={
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{user:user,accessToken,refreshToken},"User Logged in successfully"));
})

const changePassword=asyncHandler(async(req,res)=>{
    const {old_password,new_password}=req.body;
    const user_id=req.user?._id;
    const user=await User.findById(user_id)
    const iscorrect=user.isPasswordCorrect(old_password);
    if(!iscorrect) return res.status(401).json(new ApiError(401,"Password Not Correct"));
    user.password=new_password;
    await user.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200,"Password changed successfully"))
})

const logout=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user?._id,{
        $unset:{
            refreshToken:1,
        }
    },{
        new: true
    });
    const options={
        httpOnly: true,
        secure: true
    };
    res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,"Logged Out Successfully"));
})

const changeProfile=asyncHandler(async(req,res)=>{
    const coverImage_path=req.files?.path;
    if(!coverImage_path) return res.status(401).json(new ApiError(401,"Profile Changed"));
    const image_path=await uploadFile(coverImage_path);
    if(!image_path) return res.status(401).json(new ApiError(401,"Error uploading image"));
    const user_id=req.user?._id;
    const user=await User.findById(user_id);
    user.profilePhoto=image_path;
    await user.save({validateBeforeSave: false})
    return res.status(200).json(new ApiResponse(200,"Profile changed Successfully"));
})

const updateDetails=asyncHandler(async(req,res)=>{
    const user_id=req.user?._id;
    const {username,email,fullname}=req.body;
    const user= await User.findById(user_id);
    if(username) user.username=username;
    if(email) user.email=email;
    if(fullname) user.fullname=fullname;
    await user.save({
        validateBeforeSave: false
    });
    return res.status(200).json(new ApiResponse(200,"Details Updated Successfully"));
})

const getUser=asyncHandler(async (req,res)=>{
    const user_id=req.user?._id;
    if(!user_id) return res.status(401).json(new ApiError(401,"Error fetching the user"));
    const user=await User.findById(user_id).select("-password -role");
    if(!user) return res.status(401).json(new ApiError(401,"Error fetching the user"))
    const profile=await Code.aggregate([
        {
            $match:{
                writer: new mongoose.Types.ObjectId(user_id),
            }
        },{
            $project:{
                problem_id: 1,
                code: 1,
                state: 1,
                createdAt: 1,
            }
        },{
            $sort:{
                createdAt: -1
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,{user,"history":profile},"User Fetched Successfully"));
})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const token=req.cookies.refreshToken||req.body.refreshToken;
    if(!token) return res.status(401).json(new ApiError(401,"Token Not Found"));
    try {
        const decoded=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        const user=await User.findById(decoded?._id);
        if(!user) return res.status(401).json(new ApiError(401,"User Not Found"));
        if(token!==user.refreshToken) return res.status(401).json(new ApiError(401,"Invalid Token"));
        const options={
            httpOnly:true,
            secure: true
        };
        const {accessToken,refreshToken}=generateAccessandRefreshToken(user._id);
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{user:user,accessToken,refreshToken},"Token generated successfully"));
    } catch (error) {
        return res.json(401).json(new ApiError(401,"Error refreshing the access token"));
    }
})

export {registration,login,changePassword,logout,changeProfile,updateDetails,getUser,refreshAccessToken}