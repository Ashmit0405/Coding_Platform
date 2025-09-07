import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";
import path from "path";
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadFile=async(localpath)=>{
    try {
        if(!localpath) return null;
        console.log(localpath)
        const absolute=path.resolve(localpath)
        const upload=await cloudinary.uploader.upload(absolute,{
            resource_type:"auto",
        });
        console.log("File Uploaded to :",upload.url)
        // fs.unlinkSync(localpath)
        return upload.secure_url;
    } catch (error) {
        // if (fs.existsSync(localpath)) fs.unlinkSync(localpath);
        throw new Error(error.message || "Cloudinary upload failed");
    }
}

const deleteFile=async(public_id,resource_type="image")=>{
    try {
        if(!public_id) return null;
        const res=cloudinary.uploader.destroy(public_id,{
            resource_type: `${resource_type}`
        })
        return res;
    } catch (error) {
        return error;
    }
}

export {uploadFile,deleteFile};