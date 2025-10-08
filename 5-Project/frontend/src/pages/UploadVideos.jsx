import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChannelContext } from "../context/ChannelContext";

function UploadVideos() {

  const {backendURl, navigate, token} = useContext(ChannelContext)

  const [title, setTitle] = useState("")
  const [description, setDiscription] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [dot, setDot] = useState("")
  const [thumbnail, setThumblain] = useState(null)
  const [videoFile, setUploadVideo] = useState(null)

  const thumbnailRef = useRef(null)
  const videoFileRef = useRef(null)
  
  const handelFormData = async (event) => {
    setLoading(true)
    event.preventDefault()
    setErrorMessage("")
    try {
      if(!title || !description || !thumbnail || !videoFile){
        setErrorMessage("All fields are required for uploading content")
        return;
      }

      const formData = new FormData();
      formData.append("title", title)
      formData.append("description", description)
      formData.append("videoFile", videoFile)
      formData.append("thumbnail", thumbnail)

      console.log("Token being sent:", token);
      console.log("Backend URL:", backendURl);
      
      const response = await axios.post(backendURl + "/api/user/uploadVideo", formData, { headers: {Authorization: `Bearer ${token}`} })
      if(response.data.success){
        setErrorMessage("content data will be successFully upload")
      }else{
        setErrorMessage("content data not uploaded")
      }
    } catch (error) {
      const msg = "something went wrong! in upload content video"
      setErrorMessage(`⚠️ ${msg}`)
    }finally{
      setLoading(false)
    }
    setTitle(" ")
    setDiscription(" ")
    setThumblain(null)
    setUploadVideo(null)

    thumbnailRef.current.value = ""
    videoFileRef.current.value = ""
  }

  useEffect(()=> {
   const interval = setInterval(()=> {
    setDot((prev) => (prev.length < 3 ? prev + "." : ""))
   },500)
   return ()=> clearInterval(interval)
  },[])


  if(loading){
    return(
      <div className="flex flex-col items-center justify-center h-screen bg-transparent text-black">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold tracking-wide">
        Loading{dot}
      </h2>
      <p className="text-gray-400 text-sm mt-2">
        Please wait while we prepare your content
      </p>
    </div>
    )
  }

  return (
    <>
    <div className="w-[100%] flex items-center flex-col justify-center mt-[-6%]">
    
      <form onSubmit={handelFormData} className="h-[80%] w-[50%] border p-5 rounded border-gray-300 shadow-sm mt-20">
        {/* Show error message */}
        {errorMessage && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
          {errorMessage}
        </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="mt-1 block px-3 py-2 border border-gray-300 w-full rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter Video title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Description
          </label>
         <textarea  
         rows="4" 
         onChange={(e) => setDiscription(e.target.value)}
         value={description}
         className="w-full mt-2 p-2 border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
         ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Thumblain
          </label>
          <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setThumblain(e.target.files[0])}
          ref={thumbnailRef}
          className="w-full mt-2 p-2 border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Upload Video
          </label>
          <input 
          type="file" 
          accept="video/*"
          onChange={(e)  => setUploadVideo(e.target.files[0])}
          ref={videoFileRef}
          className="w-full mt-2 p-2 border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400" />
        </div>
        <div className=" w-full flex items-center justify-center mt-5">
        <button className="w-full border p-1.5 rounded bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:transition-all duration-300 cursor-pointer" type="submit">Upload</button>
        </div>
      </form>
    </div>
    </>
  );
}

export default UploadVideos;
