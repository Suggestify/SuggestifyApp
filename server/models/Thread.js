import mongoose from "mongoose";


const threadSchema = new mongoose.Schema({
    thread: [{assistantId: String, threadId: String}],
});

let Thread = mongoose.model('Thread', threadSchema);
export default Thread;