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
    difficulty:{
        type: String,
        enum: ["Easy","Medium","Hard"],
        default: "Easy"
    },
    testcases:{
        type: String,
        required: true
    },
    expected:{
        type: String,
        required: true
    },
    accepted:{
        type: Number,
        default: 0
    },
    submissions:{
        type: Number,
        default: 0
    },
    state:{
        type: String,
        enum: ["pending","accepted","rejected"],
        default: "pending"
    },
    input_lines:{
        type: Number,
        required: true
    },
    output_lines:{
        type: Number,
        required: true
    },
    time_limit:{
        type: Number,
        required: true,
        default: 1
    },
    memory_limit:{
        type: Number,
        required: true
    }
},{
    timestamps: true
})

export const Problem=mongoose.model("Problem",problemschema);