import mongoose,{Schema} from "mongoose";

const problemschema=new Schema({
    problem:{
        type: String,
        required: true
    },
    submiter:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testcases:{
        type: String,
        required: true
    },
    expected:{
        type: String,
        required: true
    },
    state:{
        type: String,
        enum: ["pending","accepted","rejected"],
        default: "pending"
    },
    input_lines:{
        type: String,
        required: true
    },
    output_lines:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Problem=mongoose.model("Problem",problemschema);