// External module
import express from "express";
import dotenv from 'dotenv';

const app = express()

// API Config
dotenv.config()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Welcome to Home Page')
})

app.get('/about', (req, res) => {
  res.send('Welcome to About Page')
})

app.listen(PORT, ()=>{
  console.log(`Surver running at http://localhost:${PORT}`)
})

