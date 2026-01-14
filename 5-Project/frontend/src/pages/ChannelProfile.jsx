import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { FaPlay, FaEye, FaUserPlus, FaCheck, FaVideo } from 'react-icons/fa'

function ChannelProfile() {
  const { userName } = useParams()
  const navigate = useNavigate()
  const { backendURl, token, userData } = useContext(ChannelContext)
  const [channel, setChannel] = useState(null)
  const [channelVideos, setChannelVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchChannelProfile()
    fetchChannelVideos()
  }, [userName, token])

  const fetchChannelProfile = async () => {
    try {
      const response = await axios.get(
        `${backendURl}/api/user/c/${userName}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data) {
        setChannel(response.data)
      }
    } catch (error) {
      console.error('Error fetching channel profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChannelVideos = async () => {
    try {
      // Get all videos and filter by owner
      const response = await axios.get(`${backendURl}/api/user/videos`)
      if (response.data.success) {
        // We need to find videos by this channel's owner ID
        // Since we don't have owner info in channel response, we'll need to filter differently
        // For now, showing all published videos
        const allVideos = response.data.data || []
        setChannelVideos(allVideos.filter(v => v.isPublished !== false))
      }
    } catch (error) {
      console.error('Error fetching channel videos:', error)
    }
  }

  const handleSubscribe = async () => {
    if (!token) {
      navigate('/Login')
      return
    }
    // Note: Subscription API endpoint needs to be created in backend
    // For now, this is a placeholder
    setSubscribing(true)
    try {
      // This would be: POST /api/user/subscribe/:channelId
      // await axios.post(`${backendURl}/api/user/subscribe/${channel._id}`, {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      alert('Subscription functionality needs backend API endpoint')
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Channel not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Channel Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 -mt-20 relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
              {channel.avatar ? (
                <img
                  src={channel.avatar}
                  alt={channel.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  {channel.fullName?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {channel.fullName}
                  </h1>
                  <p className="text-gray-600">@{channel.userName}</p>
                </div>
                {channel.userName !== userData?.userName && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      channel.isSubscribed
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {channel.isSubscribed ? (
                      <>
                        <FaCheck /> Subscribed
                      </>
                    ) : (
                      <>
                        <FaUserPlus /> Subscribe
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex gap-6 text-gray-600">
                <div>
                  <span className="font-semibold">{channel.subscribersCount || 0}</span>
                  <span className="ml-2">subscribers</span>
                </div>
                <div>
                  <span className="font-semibold">{channelVideos.length}</span>
                  <span className="ml-2">videos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Videos */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <FaVideo /> Videos
          </h2>
          {channelVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {channelVideos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => navigate(`/video/${video._id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
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
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <FaPlay className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaEye /> {video.views || 0} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No videos available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChannelProfile

