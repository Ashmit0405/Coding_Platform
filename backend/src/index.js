import {app} from "./app.js"
import {cons} from "./utils/containerpools.js"
import { image_build } from "./utils/imageBuild.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"

try {
    image_build();
} catch (error) {
    throw error;
}

for(const pool of Object.values(cons)){
    pool.init()
    console.log(`Pool of language ${pool.language}`);
}

dotenv.config();

const PORT=process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
