const { default: mongoose } = require('mongoose');
const userModel = require('../models/users.models');
const messageModel = require('../models/message.model');

// post user info
async function PostUserInfo(req, res) {
  const user = req.body;
  if (!user) {
    return res.status(400).json({ error: "No user data provided" });
  }

  try {
    const newUser = await userModel.create(user);
    res.send(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Find Specific user with a uid
async function findUserByUid(req, res) {
    const { uid } = req.params;
  try {
    const user = await userModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const allUser = await userModel.find({});
    res.send(allUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update User Specific info
async function updateUserInfo(req, res) {
  const { uid } = req.params;
  const updatedData = req.body;
  try {
    const updatedUser = await userModel.findOneAndUpdate({ uid }, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllUsersSocket = async (req, res) => {
    try {
    const { currentUserId } = req.params;
    
    // 1. get all users without the current user 
    const users = await userModel.find({ _id: { $ne: new  mongoose.Types.ObjectId(currentUserId) } })

    // 2. get the last message time for any user send or receive message from the current user
    const usersWithLastMessageTime = await Promise.all(
      users?.map(async (user) => {
        const lastMessage = await messageModel.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId }
          ]
        })
        .sort({ createdAt: -1 }) // get the latest message 
        .select('createdAt'); 

        // count unseen message for the all user
        const unseenCount = await messageModel.countDocuments({
          sender: user._id,
          receiver: currentUserId,
          isSeen:false
        })

        return {
          ...user.toObject(),
          // if have a not message then set a initial data 
          lastMessageTime: lastMessage ? lastMessage.createdAt : new Date(0),
          unseenCount: unseenCount
        };
      })
    );

    // 3. Sort based on the last message time (newest time on top)
    usersWithLastMessageTime.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    res.status(200).json(usersWithLastMessageTime);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  PostUserInfo,
  findUserByUid,
  getAllUsers,
  updateUserInfo,
  getAllUsersSocket
}