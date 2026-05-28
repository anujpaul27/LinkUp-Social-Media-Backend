const express = require('express');
const postRouter = express.Router();
const postController =require('../controllers/post.controllers')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /api/posts/upload-image
 */
postRouter.post('/upload-image', upload.single('image'),postController.imageUpload)

module.exports = postRouter;

