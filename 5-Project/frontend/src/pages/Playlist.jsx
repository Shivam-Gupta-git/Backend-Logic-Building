import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaPlay, FaList } from 'react-icons/fa'

function Playlist() {
  const { backendURl, token, userData, navigate } = useContext(ChannelContext)
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' })
  const [editingPlaylist, setEditingPlaylist] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    fetchPlaylists()
  }, [token])

  const fetchPlaylists = async () => {
    try {
      if (!userData?._id) return
      const response = await axios.get(
        `${backendURl}/api/user/getUserPlaylist/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setPlaylists(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching playlists:', error)
      // If no playlists found, set empty array
      setPlaylists([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async () => {
    try {
      const response = await axios.post(
        `${backendURl}/api/user/createPlaylist`,
        newPlaylist,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setShowCreateModal(false)
        setNewPlaylist({ name: '', description: '' })
        fetchPlaylists()
      }
    } catch (error) {
      console.error('Error creating playlist:', error)
      alert('Failed to create playlist')
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return

    try {
      // Note: You might need to add a delete playlist endpoint
      alert('Delete playlist functionality needs to be implemented in backend')
    } catch (error) {
      console.error('Error deleting playlist:', error)
    }
  }

  const handleUpdatePlaylist = async (playlistId) => {
    try {
      const response = await axios.patch(
        `${backendURl}/api/user/updatePlaylist/${playlistId}`,
        editingPlaylist,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setEditingPlaylist(null)
        fetchPlaylists()
      }
    } catch (error) {
      console.error('Error updating playlist:', error)
      alert('Failed to update playlist')
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
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaList /> Playlists
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Create Playlist
          </button>
        </div>

        {/* Create Playlist Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={newPlaylist.name}
                    onChange={(e) =>
                      setNewPlaylist({ ...newPlaylist, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter playlist name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newPlaylist.description}
                    onChange={(e) =>
                      setNewPlaylist({ ...newPlaylist, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter playlist description"
                    rows="3"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePlaylist}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setNewPlaylist({ name: '', description: '' })
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                {editingPlaylist?._id === playlist._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingPlaylist.name}
                      onChange={(e) =>
                        setEditingPlaylist({ ...editingPlaylist, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      value={editingPlaylist.description}
                      onChange={(e) =>
                        setEditingPlaylist({
                          ...editingPlaylist,
                          description: e.target.value
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdatePlaylist(playlist._id)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPlaylist(null)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{playlist.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingPlaylist({
                              _id: playlist._id,
                              name: playlist.name,
                              description: playlist.description
                            })
                          }
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(playlist._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{playlist.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {playlist.videos?.length || 0} videos
                      </span>
                      <button
                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaPlay /> View Playlist
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FaList className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No playlists yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Your First Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlist
