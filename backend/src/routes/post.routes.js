const express = require('express');
const postRouter = express.Router();
const postController =require('../controllers/post.controllers')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /api/post/auth/registration/image-upload
 * @desc Upload an image for a registration time profile picture
 */
postRouter.post('/auth/registration/image-upload', upload.single('image'),postController.imageUpload)

/**
 * @route POST /api/post/image-upload
 * @desc  Upload image for a post
 */
postRouter.post('/image-upload', upload.single('image'), postController.imageUpload)


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


/**
 * @route  PUT api/post/like
 * @desc   Like to the post by logged in user
 */
postRouter.put('/api/post/like', postController.likePost)

/**
 * @route  PUT api/post/comment
 * @desc   Comment on the post
 */
postRouter.put('/api/post/comment', postController.commentPost)




/*************** Follow and followers *********** */

/**
 * @route POST /api/posts/follow
 * @desc  create a follow relationship between two users
 */
postRouter.get('/following', postController.followUser)

/**
 * @route GET /api/posts/following-list/:uid
 * @desc  Get the list of users that a specific user is following
 */
postRouter.get('/following/:uid', postController.getFollowingList)

module.exports = postRouter;

