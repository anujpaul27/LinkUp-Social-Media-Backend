const express = require('express')
const app =  express()
const cors = require('cors')

// Importing Routes
const authRouter = require('./routes/auth.router')
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.route')

// Middlewares
app.use(express.json())
const allowedOrigins = [
  "http://localhost:5173",
  "https://linkup-f4145.web.app", // Firebase/Netlify frontend
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



// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the LinkUp API!');
});


module.exports = app