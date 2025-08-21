// External Module
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// Local Module
import connectDB from './config/mongodb.config.js'
import connectCloudinary from './config/cloudinary.config.js'
import { userRouter } from './routes/user.router.js'
import { videoRouter } from './routes/video.router.js'
import { commentRouter } from './routes/comment.router.js'
import { tweetRouter } from './routes/tweet.router.js'
import { playlistRouter } from './routes/playlist.router.js'
import { likeRouter } from './routes/like.router.js'

dotenv.config()
const PORT = process.env.PORT || 3000;
connectDB({
  path: './.env'
})
connectCloudinary()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


// Routes
app.use('/api/user', userRouter)
app.use('/api/user', videoRouter)
app.use('/api/user', commentRouter)
app.use('/api/user', tweetRouter)
app.use('/api/user', playlistRouter)
app.use('/api/user', likeRouter)


app.get('/', (req, res) => {
  res.send('Server Start')
});

app.listen(PORT, ()=> {
  console.log(`Surver running at http://localhost:${PORT}`)
})