import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { FaHeart, FaRegHeart, FaThumbsUp, FaComment, FaEye, FaEdit, FaTrash } from 'react-icons/fa'

// Comment Item Component with Edit/Delete
const CommentItem = ({ comment, token, backendURl, userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [loading, setLoading] = useState(false)

  const isOwner = userData?._id === comment.owner?._id

  const handleEdit = async () => {
    if (!editContent.trim()) return
    setLoading(true)
    try {
      const response = await axios.patch(
        `${backendURl}/api/user/updateComment/${comment._id}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setIsEditing(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Failed to update comment')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    setLoading(true)
    try {
      const response = await axios.delete(
        `${backendURl}/api/user/deleteComment/${comment._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4">
      <img
        src={comment.owner?.avatar || '/default-avatar.png'}
        alt={comment.owner?.userName}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                disabled={loading || !editContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(comment.content)
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm">
                  {comment.owner?.userName || 'Anonymous'}
                </p>
                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function VideoPlayer() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const { backendURl, token, userData } = useContext(ChannelContext)
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    fetchVideoDetails()
    fetchComments()
    checkLikeStatus()
  }, [videoId])

  const fetchVideoDetails = async () => {
    try {
      const allVideos = await axios.get(`${backendURl}/api/user/videos`)
      const foundVideo = allVideos.data.data.find(v => v._id === videoId)
      if (foundVideo) {
        setVideo(foundVideo)
        // Increment views
        // Note: You might want to add an API endpoint for this
      }
    } catch (error) {
      console.error('Error fetching video:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      if (!token) return
      const response = await axios.get(
        `${backendURl}/api/user/getComment/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setComments(response.data.docs || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const checkLikeStatus = async () => {
    if (!token) return
    try {
      // This would require a separate API endpoint to check like status
      // For now, we'll toggle on click
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (!token) {
      navigate('/Login')
      return
    }
    try {
      const response = await axios.post(
        `${backendURl}/api/user/addVideoLike/${videoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setIsLiked(response.data.liked)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleAddComment = async () => {
    if (!token) {
      navigate('/Login')
      return
    }
    if (!newComment.trim()) return

    setCommentLoading(true)
    try {
      const response = await axios.post(
        `${backendURl}/api/user/addComment/${videoId}`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setNewComment('')
        fetchComments()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Video not found</p>
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
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4">
              {video.videoFile ? (
                <video
                  src={video.videoFile}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  Video not available
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg p-6 mb-4">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <FaEye /> {video.views || 0} views
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    Like
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{video.description}</p>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaComment /> Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              {token && (
                <div className="mb-6">
                  <div className="flex gap-4">
                    <img
                      src={userData?.avatar || '/default-avatar.png'}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      token={token}
                      backendURl={backendURl}
                      userData={userData}
                      onUpdate={fetchComments}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Related Videos</h2>
            <div className="space-y-4">
              {/* You can add related videos here */}
              <p className="text-gray-500">More videos coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer

