// External Module
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()

// Local Module
import { userRouter } from './routes/user.router.js'
import connectDB from './config/mongodb.config.js'
import connectCloudinary from './config/cloudinary.config.js'

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
app.use(express.urlencoded({extended: true}))
app.use(express.json({limit: "16kb"}))


// Routes
app.use('/api/user', userRouter)


app.get('/', (req, res) => {
  res.send('Server Start')
});

app.listen(PORT, ()=> {
  console.log(`Surver running at http://localhost:${PORT}`)
})