import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import authRoutes from './routes/auth.js'
import aiRoutes from "./routes/assistant.js";
import settingRoutes from "./routes/settings.js";
import verificationRoutes from "./routes/verification.js";
import session from 'express-session';
import {scheduleFetchTask} from "./middleWare/notification.js";
import {checkNotifications} from "./middleWare/notificationSend.js";


const pwd = process.env.MONGO_Y;
const uri = `mongodb+srv://yamenmoh250:${pwd}@cluster0.blp3ok9.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', true);
mongoose.connect(uri).then(console.log("Connected")).catch( (err)=>console.log("error connecting to database"));


let refreshTokens = [];


const app = express();
app.use(cors());
const port = 4000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' } // Uses HTTPS if available
}));


app.use((req,res,next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

app.use("/ai", aiRoutes);
app.use('/auth', authRoutes)
app.use('/settings', settingRoutes)
app.use('/verification', verificationRoutes)

scheduleFetchTask();
checkNotifications();


app.listen(port, ()=>{
    console.log(`Server Running On Port: ${port}`);
})