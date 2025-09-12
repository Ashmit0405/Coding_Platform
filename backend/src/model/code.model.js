import mongoose, { Schema } from "mongoose";

const codeschema = new Schema({
    code: {
        type: String,
        required: true,
        index: true
    },
    problem_id: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
        index: true
    },
    state: {
        type: String,
        enum: [
            "Pending",
            "Running",
            "Accepted",
            "Wrong Answer",
            "Compilation Error",
            "Runtime Error",
            "Time Limit Exceeded",
            "Memory Limit Exceeded",
            "System Error"
        ],
        default: "Pending",
        index: true,
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fexec_time: { type: Number },   
    memory: { type: Number }, 
    createdAt: { type: Date, default: Date.now },
    stdout: { type: String },        
    stderr: { type: String },        
   failed_cases: [{ type: String }],
});

export const Code = mongoose.model("Code", codeschema);