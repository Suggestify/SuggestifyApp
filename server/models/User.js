import mongoose from "mongoose";


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
    }
    
});


let User = mongoose.model('Users', userSchema);
export default User;

