import express from "express";
import dotenv from 'dotenv';
import {OpenAI} from 'OpenAI';

import AIMap from "../models/AIMap.js";
import User from "../models/User.js";
import rateLimit from "../middleWare/rate.js";

dotenv.config();
const router = express.Router();

import {authenticateToken} from "../middleWare/secureEndPoint.js";


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
if (!process.env.A_B_ID || !process.env.A_M_ID || !process.env.A_M_ID || !process.env.A_P_ID || !process.env.A_S_ID || !process.env.A_MV_ID || !process.env.A_H_ID || !process.env.A_G_ID || !process.env.OPENAI_API) {
    console.error("Missing required environment variables");
    process.exit(1);
}

const assistants = {Music: process.env.A_M_ID, Books: process.env.A_B_ID, Podcasts: process.env.A_P_ID, Shows: process.env.A_S_ID, Movies: process.env.A_MV_ID, Hobbies: process.env.A_H_ID, Games: process.env.A_G_ID};
const fetchLimit = 20;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({
        error: true,
        message: err.message || 'Internal Server Error',
    });
}

async function getMapFromUser(userName) {
    try {
        const myUser = await User.findOne({ userName: userName }).select('AIMap');
        if (!myUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const curAIMapID = myUser.AIMap;
        if (!curAIMapID) {
            throw new Error("AIMap ID not available for user");
        }

        const curAIMap = await AIMap.findById(curAIMapID);
        if (!curAIMap) {
            const error = new Error("AIMap not found for user");
            error.statusCode = 404;
            throw error;
        }
        return curAIMap;
    } catch (err) {
        throw err;
    }
}

// figure out?
function convertToMessage(options){
    let message = "";
    for(let i = 0; i < options.length; i++){
        message += options[i] + " ";
    }
    return message;
}


async function createThread(userName, chatType, messageContent) {
    try {
        const myAIMap = await getMapFromUser(userName);
        if (myAIMap[chatType] === 'NULL') { // Check if the thread does not exist
            const thread = await openai.beta.threads.create();
            let threadToSend = String(thread.id);
            const data = { [chatType]: threadToSend };
            await AIMap.findByIdAndUpdate(myAIMap.id, data);
            await sendMessage(userName, chatType, messageContent, true);
        } else {
            console.log("Thread already exists");  // handling this case differently if necessary
        }
    } catch (err) {
        throw err;
    }
}

// incorporate into loading call
async function fetchMessages(userName, chatType, fetchAmt, earliestMessageId = null) {
    try {
        let currAIMap = await getMapFromUser(userName);

        if(currAIMap[chatType] === "NULL"){
            await createThread(userName, chatType, " ");
            currAIMap = await getMapFromUser(userName);
        }

        let options = { limit: fetchLimit };
        let begin = 0;

        if (earliestMessageId) {
            options.after = earliestMessageId; // Fetch messages after the earliest known message ID
            options.limit = 10;
        }

        if(fetchAmt == 1){
            options.limit = 3;
        }

        let threadMessages = await openai.beta.threads.messages.list(
            currAIMap[chatType], options
        );

        if (!threadMessages.body || !threadMessages.body.data || threadMessages.body.data.length === 0) {
            console.log("No messages to process.");
            return [];
        }

        const reachedEarliest = threadMessages.body.data.length <= fetchLimit;

        if (reachedEarliest) {
            begin  = 2;
        }

        let returnMessages = threadMessages.body.data.map(message => ({
            message: message.content?.[0]?.text?.value || 'Error loading message',
            msgID: message.id
        }));

        returnMessages = returnMessages.slice(0, returnMessages.length - begin);
        return returnMessages.reverse();
    } catch (err) {
        throw err;
    }
}


async function checkStatus(threadId, runId) {
    try {
        const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        return runStatus.status;
    } catch (err) {
        throw err; // Rethrow the error to be handled by the centralized error handler
    }
}


async function sendMessage(userName, chatType, messageContent, init) {
    try {
        const myAIMap = await getMapFromUser(userName);
        const assistantId = assistants[chatType];
        const curThread = myAIMap[chatType];

        await openai.beta.threads.messages.create(curThread, {
            role: "user",
            content: messageContent
        });

        const run = await openai.beta.threads.runs.create(curThread, {assistant_id: assistantId});

        if (!init) {
            let currMsgStatus = "pending";
            while (currMsgStatus !== "completed") {
                currMsgStatus = await checkStatus(curThread, run.id);
                await delay(500); // can add exponential backoff
            }

            const messages = await openai.beta.threads.messages.list(curThread);
            const toRet = messages.body.data[0].content[0].text.value;
            return toRet;
        }

    } catch (err) {
        throw err;  // Rethrow the error to be handled by the centralized error handler
    }
}


router.post("/create", async (req, res, next) => {
    const chatType = req.body.medium;
    const userName = req.body.userName;
    let messageContent = req.body.options; // to init

    if(messageContent == "" || messageContent == undefined){ // check this later
        messageContent = "Generic"
    }
    else{
        messageContent = convertToMessage(messageContent);
    }

    const myAIMap = await getMapFromUser(userName);
    myAIMap[chatType] = "NULL";
    await AIMap.findByIdAndUpdate(myAIMap.id, myAIMap);


    try {
        await createThread(userName, chatType, messageContent);
        res.sendStatus(200);  // OK status, thread created successfully
    } catch (err) {
        next(err);
    }
});

router.post("/sendMessage", authenticateToken, rateLimit, async (req, res, next) => {

    const userName = req.body.userName;
    const messageContent = req.body.messageContent;
    const chatType = req.body.type;

    try {
        const response = await sendMessage(userName, chatType, messageContent, false);
        res.status(200).send(response);  // Send the response obtained from the sendMessage function
    } catch (err) {
        next(err);
    }
});



// fetch previous messages up till var
// refactor to one endpoint?
router.get("/fetchMessages", authenticateToken,async (req, res, next) => {
    try {
        const userName = req.query.userName;
        const chatType = req.query.chatType;
        const fetchAmt = req.query.fetchAmt ?? "10";
        const response = await fetchMessages(userName, chatType, fetchAmt);
        res.send(response);
    } catch (err) {
        next(err);
    }
});

// can concat??^
router.get("/loadMessages", authenticateToken, async (req, res, next) => {
    try {
        const userName = req.query.userName;
        const chatType = req.query.chatType;
        const earliestMessageId = req.query.earliestMessageId;
        const response = await fetchMessages(userName, chatType, 10, earliestMessageId);
        res.send(response);
    } catch (err) {
        next(err);
    }
});


router.use(rateLimit);
router.use(errorHandler);
export default router;
