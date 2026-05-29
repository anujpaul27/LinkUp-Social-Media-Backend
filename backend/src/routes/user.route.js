const userController = require('../controllers/user.controller')
const express = require('express')
const userRouter = express.Router()

/**
 * @route POST /api/posts/user-info
 * @desc  Post user info to the database
 */
userRouter.post('/user', userController.PostUserInfo)

/**
 * @route GET /api/posts/user/:uid
 * @desc  Get user info by uid
 */
userRouter.get('/users/:uid', userController.findUserByUid)

/**
 * @route GET /api/posts/get-all-post
 * @desc  Get all posts
 */
userRouter.get('/users', userController.getAllUsers)

/**
 * @route GET /api/posts/user/update/:uid
 * @desc  Update user info by uid
 */
userRouter.patch('/users/:uid', userController.updateUserInfo)

module.exports = userRouter