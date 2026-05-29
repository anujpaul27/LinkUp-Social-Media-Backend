const userController = require('../controllers/user.controller')
const express = require('express')
const userRouter = express.Router()

/**
 * @route POST /api/posts/create-user
 * @desc  create a new user with provided user info 
 */
userRouter.post('/create-user', userController.PostUserInfo)

/**
 * @route GET /api/posts/user/:uid
 * @desc  Get user info by uid
 */
userRouter.get('/:uid/find', userController.findUserByUid)

/**
 * @route GET /api/user/get-all-post
 * @desc  Get all user
 * @problem: This route do not work without root / router, but why? 
 */
userRouter.get('/', userController.getAllUsers)

/**
 * @route GET /api/posts/user/update/:uid
 * @desc  Update user info by uid
 */
userRouter.patch('/:uid/update', userController.updateUserInfo)

module.exports = userRouter