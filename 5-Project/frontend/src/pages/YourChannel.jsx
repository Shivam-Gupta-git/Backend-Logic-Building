import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaVideo, FaEye, FaHeart, FaPlay } from 'react-icons/fa'

function YourChannel() {
  const { backendURl, token, userData, navigate } = useContext(ChannelContext)
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalLikes: 0 })
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchChannelData()
  }, [token])

  const fetchChannelData = async () => {
    try {
      const [statsResponse, videosResponse] = await Promise.all([
        axios.get(`${backendURl}/api/user/status`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendURl}/api/user/getchannelVideos`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (statsResponse.data.success) {
        setStats({
          totalVideos: statsResponse.data.data.totalVideos || 0,
          totalViews: statsResponse.data.data.totalViews || 0,
          totalLikes: statsResponse.data.data.totalLikes || 0
        })
      }

      if (videosResponse.data.success) {
        setVideos(videosResponse.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching channel data:', error)
    } finally {
      setLoading(false)
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
        {/* Channel Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {userData?.avatar ? (
                <img src={userData.avatar} alt={userData.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  {userData?.fullName?.[0] || 'U'}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userData?.fullName || 'Your Channel'}</h1>
              <p className="text-gray-600">@{userData?.userName || 'username'}</p>
              <p className="text-gray-500 text-sm mt-2">{userData?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaVideo className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalVideos}</p>
                <p className="text-gray-600">Total Videos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaEye className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalViews}</p>
                <p className="text-gray-600">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaHeart className="text-red-500 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalLikes}</p>
                <p className="text-gray-600">Total Likes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Videos */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Videos</h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => navigate(`/video/${video._id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-900">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaPlay className="text-white text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye /> {video.views || 0} views
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          video.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
              <p className="text-gray-500 text-lg mb-4">No videos yet</p>
              <button
                onClick={() => navigate('/UploadVideos')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload Your First Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YourChannel
