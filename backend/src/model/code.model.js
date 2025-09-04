import mongoose, { Schema } from "mongoose";

const codeschema=new Schema({
    code:{
        type: String,
        required: true,
        index: true
    },
    problem_id: {
        type: Schema.Types.ObjectId,
        ref:"Problem",
        required: true
    },
    state:{
        type: String,
        enum:["Accepted","Rejected","Pending"],
        default: "Pending"
    },
    writer:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
});

export const Code= mongoose.model("Code",codeschema);