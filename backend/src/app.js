const express = require('express')
const app =  express()
const cors = require('cors')

// Importing Routes
const authRouter = require('./routes/auth.router')

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', authRouter)



module.exports = app