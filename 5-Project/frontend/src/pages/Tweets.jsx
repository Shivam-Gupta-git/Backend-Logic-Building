import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaTwitter, FaEdit, FaTrash, FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa'

function Tweets() {
  const { backendURl, token, userData, navigate } = useContext(ChannelContext)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTweet, setNewTweet] = useState('')
  const [editingTweet, setEditingTweet] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchTweets()
  }, [token])

  const fetchTweets = async () => {
    try {
      if (!userData?._id) return
      const response = await axios.get(
        `${backendURl}/api/user/getUsertweet/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setTweets(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching tweets:', error)
      setTweets([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) return
    try {
      const response = await axios.post(
        `${backendURl}/api/user/createTweet`,
        { content: newTweet },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setShowCreateModal(false)
        setNewTweet('')
        fetchTweets()
      }
    } catch (error) {
      console.error('Error creating tweet:', error)
      alert('Failed to create tweet')
    }
  }

  const handleUpdateTweet = async (tweetId) => {
    if (!editContent.trim()) return
    try {
      const response = await axios.patch(
        `${backendURl}/api/user/updateTweet/${tweetId}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setEditingTweet(null)
        setEditContent('')
        fetchTweets()
      }
    } catch (error) {
      console.error('Error updating tweet:', error)
      alert('Failed to update tweet')
    }
  }

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return
    try {
      const response = await axios.delete(
        `${backendURl}/api/user/deleteTweet/${tweetId}`
      )
      if (response.data.success) {
        fetchTweets()
      }
    } catch (error) {
      console.error('Error deleting tweet:', error)
      alert('Failed to delete tweet')
    }
  }

  const handleLikeTweet = async (tweetId) => {
    try {
      await axios.post(
        `${backendURl}/api/user/addTweetLike/${tweetId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      // Refresh to show updated like status
      fetchTweets()
    } catch (error) {
      console.error('Error liking tweet:', error)
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaTwitter className="text-blue-500" /> Tweets
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Create Tweet
          </button>
        </div>

        {/* Create Tweet Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Tweet</h2>
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's happening?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCreateTweet}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Tweet
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewTweet('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tweets List */}
        {tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div key={tweet._id} className="bg-white rounded-lg shadow-md p-6">
                {editingTweet === tweet._id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateTweet(tweet._id)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditingTweet(null)
                          setEditContent('')
                        }}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {userData?.avatar ? (
                          <img
                            src={userData.avatar}
                            alt={userData.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {userData?.fullName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{userData?.fullName || 'User'}</p>
                        <p className="text-sm text-gray-500">
                          @{userData?.userName || 'username'} ·{' '}
                          {new Date(tweet.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTweet(tweet._id)
                            setEditContent(tweet.content)
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTweet(tweet._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                      {tweet.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeTweet(tweet._id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <FaRegHeart /> Like
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaTwitter className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No tweets yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Your First Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tweets

