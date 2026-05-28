const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    userName: {
      type: String,
    },
    userPhoto: {
      type: String,
    },
    postText: {
      type: String,
    },
    imageLink: {
      type: String,
      default: null, // Optional field in case a post only has text
    },
    like: {
      type: [String], // Array of strings storing the uids of users who liked the post
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;
