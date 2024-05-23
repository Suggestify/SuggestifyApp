import mongoose from "mongoose";
import { Schema } from "mongoose";
import UserSettings from "./UserSettings.js";

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

    AIMap: {type: 
        Schema.Types.ObjectID,
         ref: "AIMap"
        },
    UserSettingsID: {type:
        Schema.Types.ObjectID,
        ref: "UserSettings"
    }
});


let User = mongoose.model('Users', userSchema);
export default User;

