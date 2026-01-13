import React, { useContext } from 'react'
import { ChannelContext } from '../context/ChannelContext'

function Home() {
  const {token, userData, backendURL} = useContext(ChannelContext)
  return (
    <div className='w-full h-[100vh] border p-2'>
      <div className='w-[30%] h-[300px] border rounded-2xl'></div>
    </div>
  )
}

export default Home