import express from "express";
import dotenv from 'dotenv';
import Nedb from "Nedb"
import {OpenAI} from 'OpenAI';

dotenv.config();
const router = express.Router();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const apiKey = process.env.OPENAI_API
//const db = new Nedb({ filename: 'threads_db', autoload: true });



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });

//const assistant = await openai.beta.assistants.retrieve(assistantID);


async function createThread(assistant_id){
  const thread = await openai.beta.threads.create();
  return thread.id;
}

async function sendMessageGetRun(threadId, messageContent){
  const message = await openai.beta.threads.messages.create(threadId, { // create message
    role: "user",
    content: messageContent
  });

  const runId = message.data.run_id;
  return runId;
}

async function checkStatus(threadId, runId){
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  return runStatus.data.status;
}


async function main(){  // create run and list to allow run id tracking and thread mangament,
  // goal for now is to allow single based thread response
  try{
    const assistantID = process.env.A_ID;
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    })
    

    const thread_bob = await createThread(assistantID);
  
    //const thread_alex = createThread(assistantID);
    console.log("getting");
    const runId = await sendMessageGetRun(thread_bob, "Hi Im bob");
    console.log(runId);
    let bobS = "in"

    
    

    while(bobS !== "completed"){
     bobS = await checkStatus(thread_bob,runId)
     await delay(500);
    }

    const messages = await openai.beta.threads.messages.list(thread_bob);

    messages.body.data.forEach(message =>{
      console.log(message.content);
    });

  }
  catch (err){
    //console.log(err);
  }
}

main();
/*
const run = await openai.beta.threads.runs.create(thread.id, { create run object
  assistant_id: assistant.id,
})


const run = await openai.beta.threads.runs.retrieve( // retrieve run status
  'thread_2YXEy09TPuGoJXekjlDDWdTO', 
  'run_9tzyBjwSkCSDfCF90lGZyqDG');

*/

/*
const logs = await openai.beta.threads.runs.steps.list(
  //thread, run
);
  
logs.body.data.forEach(
  console.log(log.step_details);
);

*/


export default router;
