import mongoose from "mongoose";
import { Schema } from "mongoose";
import Thread from "./Thread.js";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: ()=> new Date()
    },
    thread: {type: 
        Schema.Types.ObjectID,
         ref: "Thread"
        }
});


let User = mongoose.model('Users', userSchema);
export default User;

