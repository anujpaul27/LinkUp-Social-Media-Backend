const express = require('express')
const app =  express()
const cors = require('cors')

// Importing Routes
const authRouter = require('./routes/auth.router')
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.route')
const messageRouter = require('./routes/message.routes')

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://linkup-f4145.web.app", // Firebase frontend
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Routes
app.use('/api/auth', authRouter)
app.use('/', postRouter)
app.use('/api/user', userRouter)
app.use('/api/messages', messageRouter)



// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the LinkUp API!');
});


module.exports = app