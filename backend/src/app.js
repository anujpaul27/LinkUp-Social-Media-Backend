const express = require('express')
const app =  express()
const cors = require('cors')

// Importing Routes
const authRouter = require('./routes/auth.router')
const postRouter = require('./routes/post.routes')

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', authRouter)
app.use('/', postRouter)


module.exports = app