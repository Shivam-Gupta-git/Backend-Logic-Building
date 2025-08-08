// External Module
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.config.js'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 3000;
connectDB()

app.get('/', (req, res) => {
  res.send('Server Start')
});

app.listen(PORT, ()=> {
  console.log(`Surver running at http://localhost:${PORT}`)
})