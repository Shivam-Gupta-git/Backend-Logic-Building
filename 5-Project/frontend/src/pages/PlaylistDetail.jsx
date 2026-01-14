import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { FaPlay, FaTrash, FaList } from 'react-icons/fa'

function PlaylistDetail() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { backendURl, token } = useContext(ChannelContext)
  const [playlist, setPlaylist] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchPlaylist()
  }, [playlistId, token])

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(
        `${backendURl}/api/user/getUserPlaylistById/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setPlaylist(response.data.data)
        // Fetch video details for each video ID
        if (response.data.data.videos && response.data.data.videos.length > 0) {
          fetchVideos(response.data.data.videos)
        }
      }
    } catch (error) {
      console.error('Error fetching playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async (videoIds) => {
    try {
      const allVideosResponse = await axios.get(`${backendURl}/api/user/videos`)
      if (allVideosResponse.data.success) {
        const allVideos = allVideosResponse.data.data || []
        const playlistVideos = allVideos.filter(v => videoIds.includes(v._id))
        setVideos(playlistVideos)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm('Remove this video from playlist?')) return
    try {
      const response = await axios.delete(
        `${backendURl}/api/user/removeVideoInPlaylist/${videoId}/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        fetchPlaylist()
      }
    } catch (error) {
      console.error('Error removing video:', error)
      alert('Failed to remove video')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Playlist not found</p>
          <button
            onClick={() => navigate('/Playlist')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <FaList className="text-blue-500" /> {playlist.name}
              </h1>
              <p className="text-gray-600">{playlist.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {videos.length} video{videos.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => navigate('/Playlist')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Playlists
            </button>
          </div>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div
                  className="relative aspect-video bg-gray-900 cursor-pointer"
                  onClick={() => navigate(`/video/${video._id}`)}
                >
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
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/video/${video._id}`)}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      Watch
                    </button>
                    <button
                      onClick={() => handleRemoveVideo(video._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaList className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">This playlist is empty</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Videos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistDetail

