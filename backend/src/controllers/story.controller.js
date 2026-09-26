const Story = require("../models/story.model");

// Create a new story
const createStory = async (req, res) => {
  try {
    const { uid, userName, userPhoto, mediaLink, mediaType } = req.body;

    if (!uid || !mediaLink) {
      return res
        .status(400)
        .json({ success: false, message: "uid and mediaLink are required" });
    }

    const story = await Story.create({
      uid,
      userName,
      userPhoto,
      mediaLink,
      mediaType: mediaType || "image",
    });

    res.status(201).json({ success: true, story });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ success: false, message: "Failed to create story" });
  }
};

// Get all active stories
const getAllStories = async (req, res) => {
  try {
    const now = new Date();
    const stories = await Story.find({ expiresAt: { $gt: now } }).sort({
      createdAt: 1,
    });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
};

// Get stories by UID
const getStoriesByUid = async (req, res) => {
  try {
    const now = new Date();
    const stories = await Story.find({
      uid: req.params.uid,
      expiresAt: { $gt: now },
    }).sort({ createdAt: 1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching user stories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stories" });
  }
};

// Delete a story
const deleteStory = async (req, res) => {
  try {
    const { uid } = req.body;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    if (uid && story.uid !== uid) {
      return res
        .status(403)
        .json({ success: false, message: "Not your story" });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ success: false, message: "Failed to delete story" });
  }
};

module.exports = {
    createStory,
    getAllStories,
    getStoriesByUid,
    deleteStory
}