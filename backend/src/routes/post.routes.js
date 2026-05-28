const express = require('express');
const postRouter = express.Router();
const postController =require('../controllers/post.controllers')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /api/posts/upload-image
 * @desc Upload an image for a login time profile picture
 * @access Public
 */
postRouter.post('/upload', upload.single('image'),postController.imageUpload)

/**
 * @route POST /api/posts/create
 * @desc  Upload image for a post
 * @access Private
 */
postRouter.post('/upload/posts', upload.single('image'), postController.imageUpload)

/**
 * @route POST /api/posts/user-info
 * @desc  Post user info to the database
 * @access Private
 */
postRouter.post('/users', postController.PostUserInfo)

/**
 * @route GET /api/posts/user/:uid
 * @desc  Get user info by uid
 * @access Private
 */
postRouter.get('/users/:uid', postController.findUserByUid)






module.exports = postRouter;

