import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaHistory, FaPlay, FaEye, FaClock } from 'react-icons/fa'

function History() {
  const { backendURl, token, navigate } = useContext(ChannelContext)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchHistory()
  }, [token])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${backendURl}/api/user/history`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setHistory(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching history:', error)
      setHistory([])
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <FaHistory /> Watch History
        </h1>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {history.map((video) => (
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
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                  {video.owner && (
                    <p className="text-xs text-gray-500 mb-2">
                      {video.owner.fullName || video.owner.userName}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaEye /> {video.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock /> {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaHistory className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No watch history yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Videos you watch will appear here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Watching
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default History
