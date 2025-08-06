// External modules
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { dataBase } from './config/mongodb.config.js'

// Local module
import { userRouter } from './router/user.router.js'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 3000
dataBase()

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/user', userRouter)


app.get('/', (req, res) => {
 res.send('Welcome to Home Page')
})

app.listen(PORT, ()=> {
  console.log(`Surver running at http://localhost:${PORT}`)
})