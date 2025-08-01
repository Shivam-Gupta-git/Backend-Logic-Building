// External modules
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())

app.get('/', (req, res) => {
 res.send('Welcome to the Home Page.....')
})
 
app.get('/api/student', (req, res) => {
  const students = [
    {
      id: 1,
      name: "Ananya Sharma",
      age: 20,
      email: "ananya.sharma@example.com",
      course: "BCA"
    },
    {
      id: 2,
      name: "Ravi Mehta",
      age: 21,
      email: "ravi.mehta@example.com",
      course: "B.Sc IT"
    },
    {
      id: 3,
      name: "Priya Verma",
      age: 19,
      email: "priya.verma@example.com",
      course: "BBA"
    },
    {
      id: 4,
      name: "Amit Yadav",
      age: 22,
      email: "amit.yadav@example.com",
      course: "BCA"
    },
    {
      id: 5,
      name: "Sneha Kapoor",
      age: 20,
      email: "sneha.kapoor@example.com",
      course: "B.Com"
    }
  ];
  

  res.send(students)
})

app.listen(PORT, ()=>{
  console.log(`Surver running at http://localhost:${PORT}`)
})