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
            "Accepted",
            "Wrong Answer",
            "Runtime/Compilation error",
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
    stdout: { type: String },
    stderr: { type: String },
    failed_cases: [{
        case: { type: Number },
        passed: { type: Boolean },
        input: [{ type: String }],
        expected: [{ type: String }],
        got: [{ type: String }]
    }],
}, {
    timestamps: true
});

export const Code = mongoose.model("Code", codeschema);