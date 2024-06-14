import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
    notificationToken: {
        type: String,
        sparse: true
    },
    notificationOn: {
        type: Boolean,
        required: true,
        default: false
    },
    theme: {
        type: Boolean,
        required: true,
        default: false
    },
    mediumOrder: {
        type: Array,
        required: true,
        default: ['Music', 'Books', 'Podcasts', 'Shows', 'Movies', 'Hobbies', 'Games']
    },
});


let UserSettings = mongoose.model('UserSettings', UserSettingsSchema);
export default UserSettings;

