const userModel = require('../models/users.models')

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

module.exports = {
  PostUserInfo,
  findUserByUid,
  getAllUsers,
  updateUserInfo,
}