import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import { FaUserCircle, FaCheckCircle } from 'react-icons/fa'

function Subscriptions() {
  const { token, navigate } = useContext(ChannelContext)
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    // Note: You'll need to implement a getSubscriptions API endpoint
    // For now, showing empty state
    setLoading(false)
  }, [token])

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
          <FaCheckCircle className="text-blue-500" /> Subscriptions
        </h1>

        {subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subscriptions.map((channel) => (
              <div
                key={channel._id}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/channel/${channel.userName}`)}
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                  {channel.avatar ? (
                    <img
                      src={channel.avatar}
                      alt={channel.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{channel.fullName}</h3>
                <p className="text-gray-600 text-sm mb-2">@{channel.userName}</p>
                <p className="text-gray-500 text-xs">
                  {channel.subscribersCount || 0} subscribers
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaCheckCircle className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No subscriptions yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to channels to see their latest videos here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Explore Channels
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Subscriptions
