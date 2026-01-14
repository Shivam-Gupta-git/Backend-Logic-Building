import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaPlay, FaEye, FaHeart } from 'react-icons/fa'

function Home() {
  const { token, backendURl, video, refreshVideos } = useContext(ChannelContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (refreshVideos) {
      refreshVideos()
    }
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [refreshVideos])

  const handleVideoClick = (videoId) => {
    if (token) {
      navigate(`/video/${videoId}`)
    } else {
      navigate('/Login')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Trending Videos</h1>
        
        {video && Array.isArray(video) && video.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {video
              .filter(v => v && (v.isPublished !== false))
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleVideoClick(item._id)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative aspect-video bg-gray-900">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <FaPlay className="text-white text-4xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <FaPlay className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {item.duration > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaEye className="text-gray-400" />
                        <span>{item.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHeart className="text-gray-400" />
                        <span>Likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No videos available</p>
            {token && (
              <button
                onClick={() => navigate('/UploadVideos')}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload Your First Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
