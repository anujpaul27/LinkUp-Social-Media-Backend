const express = require('express');
const postRouter = express.Router();
const postController =require('../controllers/post.controllers')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /api/posts/upload-image
 * @desc Upload an image for a login time profile picture
 */
postRouter.post('/upload', upload.single('image'),postController.imageUpload)

/**
 * @route POST /api/posts/create
 * @desc  Upload image for a post
 */
postRouter.post('/upload/posts', upload.single('image'), postController.imageUpload)

/**
 * @route POST /api/posts/user-info
 * @desc  Post user info to the database
 */
postRouter.post('/users', postController.PostUserInfo)

/**
 * @route GET /api/posts/user/:uid
 * @desc  Get user info by uid
 */
postRouter.get('/users/:uid', postController.findUserByUid)

/**
 * @route GET /api/posts/get-all-post
 * @desc  Get all posts
 */
postRouter.get('/users', postController.getAllUsers)

/**
 * @route GET /api/posts/user/update/:uid
 * @desc  Update user info by uid
 */
postRouter.patch('/users/:uid', postController.updateUserInfo)


/************** This is user post router area ******************* */

/**
 * @route POST /api/posts/create-post
 * @desc  Create a new post
 */
postRouter.post('/post', postController.createPost)

/**
 * @route GET /api/posts/get-all-post
 * @desc  Get all posts
 */
postRouter.get('/post', postController.getAllPosts)

/**
 * @route GET /api/posts/user-posts/:uid
 * @desc  Get all posts by a specific user uid
 */
postRouter.get('/post/:uid', postController.getUserPostsByUid)



/*************** Follow and followers *********** */

/**
 * @route POST /api/posts/follow
 * @desc  create a follow relationship between two users
 */
postRouter.get('/following', postController.followUser)


module.exports = postRouter;

