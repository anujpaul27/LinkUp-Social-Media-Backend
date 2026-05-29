const userModel = require("../models/users.models");
const uploadImage = require("../services/storage.services");
const postModel = require("../models/posts.model");
const followModel = require("../models/flower.model");

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
  try
  {
    const obj = req.body;
    const result = await followModel.create(obj);
    res.send(result);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get Following List
async function getFollowingList(req, res){
  const { uid } = req.params;
  try
  {
    const followingList = await followModel.findOne({uid})
    res.send(followingList);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  imageUpload,
  createPost,
  getAllPosts,
  getUserPostsByUid,
  followUser,
  getFollowingList,
};
