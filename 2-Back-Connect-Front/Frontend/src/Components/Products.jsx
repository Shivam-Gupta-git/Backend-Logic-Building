import React from 'react'

function Products({studentDetails}) {
  return (
    <div className='w-[100%] flex items-center justify-center'>
      <div className='w-[90%] shadow-sm shadow-gray-400 mt-5 p-2 rounded'>
        <div className='w-full flex items-center justify-center bg-blue-400 p-2 rounded'>
        <h1 className='text-2xl font-bold text-white'>Student List</h1>
        </div>
        {
          studentDetails.map((items) => (
            <div key={items.id} className='w-full border border-gray-200 mt-5 py-1 px-2 rounded'>
              <h1>Name: {items.name}</h1>
              <h1>Age: {items.age}</h1>
              <h1>Email: {items.email}</h1>
              <h1>Course: {items.course}</h1>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Products