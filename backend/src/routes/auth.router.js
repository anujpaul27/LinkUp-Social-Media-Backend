const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controllers')

/**
 * @route POST /api/auth/register 
 */
authRouter.post('/register', authController.register)

/**
 * @route GET /api/auth/login
 */
authRouter.get('/login', authController.login)


module.exports = authRouter;