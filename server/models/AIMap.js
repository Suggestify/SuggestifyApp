import mongoose from "mongoose";


const aiSchema = new mongoose.Schema({
    Book: String,
    Music: String,
    Shows: String,
    Game: String,
    Hobbie: String,
    Podcast: String,
    Movie: String
}, {strict: true});

let AIMap = mongoose.model('AIMap', aiSchema);
export default AIMap;