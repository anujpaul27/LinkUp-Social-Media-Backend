const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    DateOfBirth: {
        type: String, // fix it to date
    },
    photoURL: {
        type: String,
    },
    uid: {
        type: String,
    },
    address: {
        type: String,
    },
    bio: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    workAt: {
        type: String,
    }
})

const postModel = mongoose.model('users', postSchema);
module.exports = postModel;