const postModel = require("../models/post.models");
const uploadImage = require("../services/storage.services");

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

// post user info
async function PostUserInfo(req, res) 
{
  const user = req.body;
  if (!user) {
    return res.status(400).json({ error: "No user data provided" });
  }

  try
  {
    const newUser = await postModel.create(user);
    res.send(newUser);
  }
  catch (error)
  {
    res.status(500).json({ message: error.message });
  }

}



module.exports = { imageUpload, PostUserInfo };
