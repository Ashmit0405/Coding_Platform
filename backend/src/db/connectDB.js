import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
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