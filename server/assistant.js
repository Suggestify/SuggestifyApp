import express from "express";
import dotenv from 'dotenv';
import Nedb from "Nedb"
import jwt from "jsonwebtoken";
import {OpenAI} from 'OpenAI';
import AIMap from "./models/AIMap.js";
import User from "./models/User.js";

dotenv.config();
const router = express.Router();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const apiKey = process.env.OPENAI_API;
const assistants = {Book: process.env.A_B_ID, Music: process.env.A_M_ID};


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });  
  
// check logical flow, error handling, looping of array / assistandId translation on backend most likley

//async function to find threadid per type for a user


async function createThread(prefrenceType, userId){  // should check existence in database per user per assistant

  try{  //

    const myUser = await User.findById(`${userId}`)
    
    const AIMapId = myUser.AIMap;
    const myAIMap = await AIMap.findById(AIMapId);
    //preference type is passed in as a String, can be offloaded here if needed


    if(myAIMap[prefrenceType] == 'NULL'){ // if thread does not exist then create new thread
      try{
        const thread = await openai.beta.threads.create();
        console.log(thread.id);
        let threadToSend = String(thread.id);
        const data = {[prefrenceType]: threadToSend};
        // add error handling for object.keys if exist in set
        const updatedThread = await AIMap.findByIdAndUpdate(
        AIMapId, data
    );
      console.log("created");
      }
      catch(err){
        //
      }
    }
    else{
      console.log("thread exists");
    }
    
  }
  catch(err){
    console.log(err);
    //
  }
}

async function sendMessageAndRun(userId, messageContent, assistantType){ // can incorporate thread, run, and message into one call. createAndRun
  // create function for finding thread id from user id
    
    try{
    const myUser = await User.findById(`${userId}`)
    
    const AIMapId = myUser.AIMap;
    const myAIMap = await AIMap.findById(AIMapId);

    const assistantId = assistants[assistantType];
    console.log(assistantId)
    
    const curAIMap = myAIMap[assistantType];  // can be named thread find similar
    console.log(curAIMap);
    console.log(messageContent);

  const message = await openai.beta.threads.messages.create(curAIMap, { // create message
      role: "user",
      content: messageContent
  });
  // create and run thread in one? if needed
    const run = await openai.beta.threads.runs.create(curAIMap, {assistant_id: assistantId});
    return run;  // need to run?
}
catch(err){
  console.log(err);
}
}


async function checkStatus(threadId, runId){ // could remove as a function?
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  //console.log(runStatus.status);
  return runStatus.status;
}


router.post("/create", (req,res)=>{ // creates thread per assistant

  //req contains user, prefrences,
  const assistantType = req.body.medium;
  const userName = req.body.userName;
  const options = req.body.options;
  res.sendStatus(200)
  //createThread(assistantType, userId);
  //send initial message per thread
  //sendMessageAndRun(userId, messageContent, assistantType); // move inside createthread function for single run inside try?
});


// keep seperate function but this is for recieving as well?
router.post("/sendMessage", async (req,res)=>{  // try catch block
  let currMsgStatus = "pending";
  const userId = req.body.userId;
  const currUser = await User.findById(userId);

  // have backend map assistant somehow? no need tho
  //console.log(threadToRun[req.body.type]);  // rename preference type to assistant somtn cast to string?---
  const message = req.body.messageContent;
  
  //const currAssistant = assistants[req.body.type] // assistand id translation in front or backend ---
  //console.log(currAssistant);
  const currRun = await sendMessageAndRun(userId, message, req.body.type);
  //console.log(currRun);

  //retrieve message
  while(currMsgStatus !== "completed"){
    currMsgStatus = await checkStatus(currRun.thread_id,currRun.id); // check syntax
    await delay(500);
   }

   const messages = await openai.beta.threads.messages.list(currRun.thread_id);
   //console.log(messages);
   messages.body.data.forEach(message =>{
    console.log(message.content);
   });

});
export default router;
