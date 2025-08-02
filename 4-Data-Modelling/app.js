// Eternal Modules
import express from 'express'
import dotenv from 'dotenv'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 3002

app.get('/', (req, res) => {
 res.send('Welcome to Home Page')
})

app.listen(PORT, ()=> {
  console.log(`Surver running at http://localhost:${PORT}`)
})