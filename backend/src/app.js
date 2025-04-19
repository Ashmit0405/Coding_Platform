import express from 'express';
import cors from 'cors';
import { router } from './routes/excuter.route.js';
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', router);

export {app};