import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Products from './Components/Products'

function App() {
  const backendURL = import.meta.env.VITE_BACKEND_URL

  const [studentDetails, setStudentDetails] = useState([])

  const fetchProductData = async () => {
    try {
      const response = await axios.get(backendURL + '/api/student');
      setStudentDetails(response.data)
    } catch (error) {
      console.error('Error fetching product data:', error.message); 
    }
  };

  useEffect(()=>{
   fetchProductData()
  }, [studentDetails])
  return (
    <>
    <Products studentDetails={studentDetails}></Products>
    </>
  )
}

export default App
