import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    fullname: {
        type: String,
        required: false
    },
    profilePhoto: {
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role:{
        type:String,
        enum:["setter","admin","user"],
        default: "user"
    },
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true
});

userschema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});

userschema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
}

userschema.methods.generateAccessToken = function () {
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)};

userschema.methods.generateRefreshToken = function () {
    return jwt.sign(
    {
        _id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)};

export const User= mongoose.model("User",userschema);