import mongoose from "mongoose";


const aiSchema = new mongoose.Schema({
    Music: String,
    Books: String,
    Shows: String,
    Podcasts: String,
    Movies: String,
    Hobbies: String,
    Games: String,

}, {strict: true});

let AIMap = mongoose.model('AIMap', aiSchema);
export default AIMap;