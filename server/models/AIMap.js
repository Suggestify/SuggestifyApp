import mongoose from "mongoose";


const aiSchema = new mongoose.Schema({
    Music: {type: String, default: "NULL"},
    Books: {type: String, default: "NULL"},
    Shows: {type: String, default: "NULL"},
    Podcasts: {type: String, default: "NULL"},
    Movies: {type: String, default: "NULL"},
    Hobbies: {type: String, default: "NULL"},
    Games: {type: String, default: "NULL"},

}, {strict: true});

let AIMap = mongoose.model('AIMap', aiSchema);
export default AIMap;