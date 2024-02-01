import express from "express";
import dotenv from 'dotenv';
import Nedb from "Nedb"
import {OpenAI} from 'OpenAI';
import Thread from "./models/Thread.js";
import User from "./models/User.js";

dotenv.config();
const router = express.Router();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const apiKey = process.env.OPENAI_API;
const assistants = [{Test: process.env.A_T_ID}]; // show as "${x}"



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });

  
// check logical flow, error handling, looping of array / assistandId translation on backend most likley

async function createThread(assistant_id, currAssistant, userId){  // should check existence in database per user per assistant

  try{
     //const myUser = await User.findById(`${userId}`)
    const myUser = await User.findById("65bb011f4acfa86163e05e87")
    const threadId = myUser.thread;
    const myThread = await Thread.findById(threadId);
    const curThread = myThread.thread[3];
    
    if(typeof(curThread) == 'undefined'){ // if thread does not exist then create new thread
      const thread = await openai.beta.threads.create();
      console.log(thread.id);
      const assistantIdToSend = assistants[0].Test; // can also be name, this might be better
      const threadToSend = thread.id
      const updatedThread = await Thread.findByIdAndUpdate(
        threadId, 
        {$push: {thread: {assistantId: assistantIdToSend, threadId: threadToSend}}}
      );
      console.log("created");
    }
    else{
      console.log("thread exists");
    }
    
  }
  catch(err){
    //
  }
}

async function sendMessageAndRun(threadId, messageContent, assistantId){ // can incorporate thread, run, and message into one call. createAndRun
  const message = await openai.beta.threads.messages.create(threadId, { // create message
    role: "user",
    content: messageContent
  });
  const run = await openai.beta.runs.create(threadId, {assisatnt_id: assistantId});
  return run;
}

async function checkStatus(threadId, runId){ // could remove as a function?
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  return runStatus.data.status;
}




router.post("/create", (req,res)=>{ // creates thread per assistant
  //req contains user, prefrences,
  //createThread();
});

router.post("/sendMessage", async (req,res)=>{
  let currMsgStatus = "pending"
  const currUser = req.body.userId;

  const pendingThread = Thread.findById(currUser.thread); // rename?

  const message = req.body.messageContent;
  const currAssistant = pendingThread[0].assisatnt_id // assistand id translation in front or backend
  const currThread = pendingThread[0].threadId
  //const currRun = sendMessageAndRun(currThrad, message, currAssistant);

  //retrieve message
  while(currMsgStatus !== "completed"){
    currMsgStatus = await checkStatus(currThread,currRun.id); // check syntax
    await delay(500);
   }

   const messages = await openai.beta.threads.messages.list(currThread);
   
   //messages.body.data.forEach(message =>{
    //console.log(message.content);
   //});

});



export default router;
