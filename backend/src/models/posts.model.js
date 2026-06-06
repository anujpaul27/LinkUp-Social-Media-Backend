const mongoose = require("mongoose");

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  
  // Get short month name (e.g., "jan", "feb", "jun")
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const month = months[date.getMonth()];
  
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};  

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
    createAt: {
      type: String,
      default: getFormattedDate
    },
    like: [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users'
    }],
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'users'
      },
      userName: {
        type: String,
        required: true
      },
      userPhoto: {
        type: String,
      },
      commentText: {
        type: String,
        required: true,
      },
      createAt: {
      type: String,
      default: getFormattedDate
    },
    }]
  },
  {
    timestamps: true,
  },
);

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;
