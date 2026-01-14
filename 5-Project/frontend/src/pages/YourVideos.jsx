import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaPlay } from 'react-icons/fa'

function YourVideos() {
  const { backendURl, token, userData, navigate } = useContext(ChannelContext)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchVideos()
  }, [token])

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${backendURl}/api/user/getchannelVideos`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setVideos(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await axios.post(
        `${backendURl}/api/user/deleteVideo/${videoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        fetchVideos()
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Failed to delete video')
    }
  }

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      const response = await axios.patch(
        `${backendURl}/api/user/isPublishedStatus/${videoId}`,
        { isPublished: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        fetchVideos()
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Failed to update publish status')
    }
  }

  const handleEdit = (video) => {
    setEditingVideo(video._id)
    setEditForm({ title: video.title, description: video.description })
  }

  const handleUpdate = async (videoId) => {
    try {
      const formData = new FormData()
      formData.append('title', editForm.title)
      formData.append('description', editForm.description)

      const response = await axios.put(
        `${backendURl}/api/user/updateVideoDetails/${videoId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      if (response.data.success) {
        setEditingVideo(null)
        fetchVideos()
      }
    } catch (error) {
      console.error('Error updating video:', error)
      alert('Failed to update video')
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Videos</h1>
          <button
            onClick={() => navigate('/UploadVideos')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upload New Video
          </button>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
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
                  {editingVideo === video._id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Description"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(video._id)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingVideo(null)}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(video._id, video.isPublished)}
                          className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
                            video.isPublished
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {video.isPublished ? (
                            <>
                              <FaToggleOn /> Unpublish
                            </>
                          ) : (
                            <>
                              <FaToggleOff /> Publish
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">You haven't uploaded any videos yet</p>
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
  )
}

export default YourVideos
