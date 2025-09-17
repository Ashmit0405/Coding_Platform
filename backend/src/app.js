import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { runner_router } from './routes/excuter.route.js';
import { userroute } from './routes/user.route.js';
import { prob_router } from './routes/problem.route.js';
import { code_router } from './routes/code.route.js';
import { admin_rou } from './routes/admin.route.js';
import { system_rou } from './routes/system.route.js';
const app=express();

app.use(cors());
app.use(express.json({limit: "15kb"}))
app.use(express.urlencoded({extended:true,limit: "15kb"}))
app.use(express.static("public"));

app.use(cookieParser())

app.use('/api', runner_router);
app.use('/api',userroute);
app.use('/api',prob_router);
app.use('/api',code_router);
app.use('/api',admin_rou);
app.use('/api',system_rou);
export {app};