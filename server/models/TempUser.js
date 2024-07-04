import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
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
    token: {
        type: String,
        required: true,
        unique: true
    },
});

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser;