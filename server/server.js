import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import authRoutes from './auth.js'



import aiRoutes from "./assistant.js";

const pwd = process.env.MONGO_Y;
const uri = `mongodb+srv://yamenmoh250:${pwd}@cluster0.blp3ok9.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(uri).then(console.log("Connected")).catch( (err)=>console.log("error connecting to database"));

let refreshTokens = [];


const app = express();
app.use(cors());
const port = 4000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes)

const saltrounds = 10;

app.use((req,res,next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

app.use("/ai", aiRoutes);

app.listen(port, ()=>{
    console.log(`Server Running On Port: ${port}`);
})