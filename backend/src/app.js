import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { runner_router } from './routes/excuter.route.js';
import { userroute } from './routes/user.route.js';
import { prob_router } from './routes/problem.route.js';
import { admin_rou } from './routes/admin.route.js';
import { system_rou } from './routes/system.route.js';
import path from "path";
const app=express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://35.247.10.42",
    "https://coding-platform-livid.vercel.app"
  ],
  credentials: true,         
}));

app.use(express.json({limit: "15kb"}))
app.use(express.urlencoded({extended:true,limit: "15kb"}))
app.use("/static",express.static(path.join(process.cwd(),"public"),{
  index: false,
  dotfiles: "ignore"
}));
app.set("trust proxy",1);
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "https://coding-platform-livid.vercel.app",
  "http://35.247.10.42"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use('/api', runner_router);
app.use('/api',userroute);
app.use('/api',prob_router);
app.use('/api',admin_rou);
app.use('/api',system_rou);
export {app};