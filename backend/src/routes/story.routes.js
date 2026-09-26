const express = require("express");
const router = express.Router();
const { createStory, getAllStories, getStoriesByUid, deleteStory,} = require("../controllers/story.controller");

router.post("/create", createStory);
router.get("/all", getAllStories);
router.get("/:uid", getStoriesByUid);
router.delete("/:id", deleteStory);

module.exports = router;
