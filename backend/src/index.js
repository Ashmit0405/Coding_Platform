import {app} from "./app.js"
import {cons} from "./utils/containerpools.js"
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"

for(const pool of Object.values(cons)){
    await pool.init()
    console.log(`Pool of language ${pool.language}`);
}

dotenv.config();

const PORT=process.env.PORT || 5000;
try {
    connectDB();
} catch (error) {
    throw error;
}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
