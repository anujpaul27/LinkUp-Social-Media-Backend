const userModel = require("../models/users.models");
const uploadImage = require("../services/storage.services");
const postModel = require("../models/posts.model");
const followModel = require("../models/flower.model");
const {
  generatePolishedPost,
  generateCaptionFromImage,
} = require("../services/ai.services");

async function imageUpload(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const response = await uploadImage(file.buffer.toString("base64"));
    res.status(200).json({ url: response.url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
}

// Create a post
async function createPost(req, res) {
  try {
    const postData = req.body;
    const newPost = await postModel.create(postData);
    res.send(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all posts
async function getAllPosts(req, res) {
  try {
    const allPosts = await postModel.find().sort({ _id: -1 });
    res.send(allPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get user post by specific uid
async function getUserPostsByUid(req, res) {
  const { uid } = req.params;
  try {
    const userPosts = await postModel.find({ uid }).sort({ _id: -1 });
    res.send(userPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Following Followers
async function followUser(req, res) {
  try {
    const obj = req.body;
    const result = await followModel.create(obj);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Following List
async function getFollowingList(req, res) {
  const { uid } = req.params;
  try {
    const followingList = await followModel.findOne({ uid });
    res.send(followingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update Folowing
async function updateFollowing(req, res) {
  try {
    const uid = req.params.uid;
    const obj = req.body;
    const result = await followModel.findOneAndUpdate(
      { uid: uid }, // filter
      { $addToSet: { following: obj.FollowingUserUid } }, //Update
    );
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
}

// Like to the any post
async function likePost(req, res) {
  try {
    const { postId, userId } = req.body;

    // if userId empty, without have a account don't like to be here
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required.",
      });
    }

    // 1. find the targeted post
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found!.",
      });
    }

    // 2. Check if user has already linked the post
    const hashLiked = post.like.includes(userId);

    let updatePost;
    if (hashLiked) {
      // if already liked, remove (pull) userId of the array
      updatePost = await postModel.findByIdAndUpdate(
        postId,
        { $pull: { like: userId } },
        { new: true },
      );
    } else {
      // if not like, add (addToSet do not push duplicate) the userId to the array
      updatePost = await postModel.findByIdAndUpdate(
        postId,
        { $addToSet: { like: userId } },
        { new: true },
      );
    }

    // 3. success response
    res.status(200).json({
      success: true,
      likeList: updatePost.like,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Comment on the post
async function commentPost(req, res) {
  try {
    const { postId, userId, userName, userPhoto, commentText } = req.body;

    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required.",
      });
    }

    const newComment = {
      userId,
      userName,
      userPhoto,
      commentText,
    };
    console.log(newComment);

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true },
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    console.log(updatedPost);
    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      commentsList: updatedPost.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Generate post build on the text and image with AI
const generateAiPostContent = async (req, res) => {
  try {
    const { type, text, base64Image, mimeType } = req.body;

    if (type === "text" && text) {
      const polishedText = await generatePolishedPost(text);
      return res.status(200).json({ success: true, content: polishedText });
    }

    if (type === "image" && base64Image) {
      const caption = await generateCaptionFromImage(base64Image, mimeType);
      return res.status(200).json({ success: true, content: caption });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid request payload" });
  } catch (error) {
    console.error("AI Post Generation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate content with AI" });
  }
};

// Delete Post Controller
const deletePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { userId } = req.body; // User ID sent via axios data option

    // 1. check to the user id send or not 
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to perform this action",
      });
    }

    // 2. Post exist or not in the database 
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // 3. Security Check: post owner or not 
    // post.uid means post creator and userId means request sender is same then delete it
    if (post.uid.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own posts",
      });
    }

    // 4. Remove post from the database 
    await postModel.findByIdAndDelete(id);

    // 5. Remove post your save list 
    await userModel.updateMany({ savedPosts: id }, { $pull: { savedPosts: id } });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePost controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  imageUpload,
  createPost,
  getAllPosts,
  getUserPostsByUid,
  followUser,
  getFollowingList,
  likePost,
  commentPost,
  updateFollowing,
  generateAiPostContent,
  deletePost
};
