const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    uid: {
        type: String,
    },
    following: {
        type: [String], // Array of uids this user is following
        default: []
    },
    followers: {
        type: [String], // Array of uids following this user
        default: []
    }
}, {
    timestamps: true // Automatically tracks when connections are made
});

const followerModel = mongoose.model('friends', followSchema);
module.exports = followerModel;
