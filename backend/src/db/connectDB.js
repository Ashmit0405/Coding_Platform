import mongoose from 'mongoose';
import {DB} from "../constants.js"

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB}?retryWrites=true&w=majority&appName=Cluster0`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
}
export default connectDB;