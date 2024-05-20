import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
    notificationToken: {
        type: String,
        required: false,
        unique: true
    },
    notificationOn: {
        type: Boolean,
        required: true,
        default: false
    },
    theme: {
        type: String,
        required: true,
        default: 'dark'
    },
    mediumOrder: {
        type: Array,
        required: true,
        default: ['Music', 'Books', 'Podcast', 'Shows', 'Movies', 'Hobbies', 'Games']
    },
});


let UserSettings = mongoose.model('UserSettings', UserSettingsSchema);
export default UserSettings;

