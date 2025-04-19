import mongoose from 'mongoose';
import {asyncHandler} from '../utils/asynchandler.js';

const MONGO_URI = process.env.MONGO_URI;
const connectDB = asyncHandler(async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
});
export default connectDB;