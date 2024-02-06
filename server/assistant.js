import express from "express";
import dotenv from 'dotenv';
import Nedb from "Nedb"
import OpenAI from 'OpenAI';
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

const apiKey = process.env.OPENAI_API
const db = new Nedb({ filename: 'threads_db', autoload: true });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });

router.post('/create', (req, res) => {
});

export default router;
