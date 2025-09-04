import {app} from "./app.js"
import {cons} from "./utils/containerpools.js"

// for(const pool of Object.values(cons)){
//     pool.init()
//     console.log(`Pool of language ${pool.language}`);
// }

import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"
dotenv.config();

const PORT=process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
