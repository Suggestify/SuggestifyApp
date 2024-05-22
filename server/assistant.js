import express from "express";
import dotenv from 'dotenv';
import {OpenAI} from 'OpenAI';
import AIMap from "./models/AIMap.js";
import User from "./models/User.js";

dotenv.config();
const router = express.Router();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const assistants = {Book: process.env.A_B_ID, Music: process.env.A_M_ID};
const fetchLimit = 20;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });  



async function getMapFromUser(userName) {
    try {
        const myUser = await User.findOne({userName: userName});
        const curAIMapID = myUser.AIMap;
        const curAIMap = await AIMap.findById(curAIMapID);
        return curAIMap;
    }
    catch(err){
        //
    }
}

function convertToMessage(options){
    //converts to prompt manually
}

async function createThread(userName, chatType, messageContent){  // should check existence in database per user per assistant

  try{
   const myAIMap = await getMapFromUser(userName);
    if(myAIMap[chatType] === 'NULL'){ // if thread does not exist then create new thread
      try{
        const thread = await openai.beta.threads.create();
        let threadToSend = String(thread.id);
        const data = {[chatType]: threadToSend};
        // add error handling for object.keys if exist in set
        await AIMap.findByIdAndUpdate(myAIMap.id, data);
        await sendMessage(userName, chatType, messageContent, true);
      }

      // send init first message and run / dont?
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

// incorporate into loading call
async function fetchMessages(userName, chatType){
    const currAIMap = await getMapFromUser(userName);
    const threadMessages = await openai.beta.threads.messages.list(
        currAIMap[chatType], {limit: fetchLimit}
    );
    const returnMessages = [];
    threadMessages.body.data.forEach(message => {
        const temp = {message: message.content[0].text.value, msgID: message.id};
        returnMessages.push(temp);
        //returnMessages.push(message.content[0].text.value);
     });
    console.log(threadMessages.body.data[0]);
    return returnMessages.reverse();
}
// CONCAT^
async function loadMessages(userName, chatType, earliestMessageId){

    const currAIMap = await getMapFromUser(userName);
    const options = {
        limit: 10  // Set the number of messages to fetch
    };
    if (earliestMessageId) {
        options.before = earliestMessageId;
    }
    const threadMessages = await openai.beta.threads.messages.list(
        currAIMap[chatType], options
    );

    const returnMessages = [];
    threadMessages.body.data.forEach(message => {
        const temp = {message: message.content[0].text.value, msgID: message.id};
        returnMessages.push(temp);
        //returnMessages.push(message.content[0].text.value);
    });
    console.log("SUCCESS123");
    return returnMessages.reverse();
}


async function checkStatus(threadId, runId){ // could remove as a function?
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  return runStatus.status;
}

async function sendMessage(userName, chatType, messageContent, init){
    try{

        const myAIMap = await getMapFromUser(userName);
        const assistantId = assistants[chatType];
        const curThread = myAIMap[chatType];

        await openai.beta.threads.messages.create(curThread, { // create message // dont need as const?
            role: "user",
            content: messageContent
        });
        const run = await openai.beta.threads.runs.create(curThread, {assistant_id: assistantId});  // store in db

        if(!init) {
            let currMsgStatus = "pending";
            while (currMsgStatus !== "completed") {
                currMsgStatus = await checkStatus(curThread, run.id); // check syntax
                await delay(1000);
            }

            const messages = await openai.beta.threads.messages.list(curThread);// make single fetch
            const toRet = messages.body.data[0].content[0].text.value
            return toRet;
        }

    }catch(err){
        console.log(err);
    }

}

router.post("/create", async (req,res)=>{ // creates thread per assistant
  const chatType = req.body.medium;
  const userName = req.body.userName;
  const options = req.body.options;
    // try

    const test = "hello"
    // to convert in function then pass in
  await createThread(userName, chatType, test);
  //send initial message per thread
    res.sendStatus(200)
});

router.post("/sendMessage", async (req,res)=>{  // for indi message

    try {
        const userName = req.body.userName;
        const message = req.body.messageContent;
        const chatType = req.body.type;
        const response = await sendMessage(userName, chatType, message, false);
        res.send(response);
    }catch(err){
        console.log(err);
    }
});

// fetch previous messages up till var
router.get("/fetchMessages",async (req,res)=>{ // make get
    const response = await fetchMessages(req.query.userName, req.query.chatType);
    res.send(response);
});


router.get("/loadMessages",async (req,res)=>{ // make get
    console.log("hello");
    const response = await loadMessages(req.query.userName, req.query.chatType, req.query.earliestMessageId);
    res.send(response);
});

export default router;
