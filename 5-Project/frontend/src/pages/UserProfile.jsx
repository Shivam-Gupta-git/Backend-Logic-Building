import React, { useContext, useEffect, useState } from 'react'
import { ChannelContext } from '../context/ChannelContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaEdit, FaUser, FaEnvelope, FaCamera } from 'react-icons/fa'

function UserProfile() {
  const { backendURl, token, userData, navigate, setToken } = useContext(ChannelContext)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [coverImageFile, setCoverImageFile] = useState(null)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/Login')
      return
    }
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || ''
      })
    }
  }, [userData, token])

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const response = await axios.patch(
        `${backendURl}/api/user/updateAccount`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setEditMode(false)
        alert('Profile updated successfully')
        window.location.reload() // Refresh to get updated data
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAvatar = async () => {
    if (!avatarFile) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)

      const response = await axios.patch(
        `${backendURl}/api/user/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      if (response.data.success) {
        setAvatarFile(null)
        alert('Avatar updated successfully')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      alert('Failed to update avatar')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCoverImage = async () => {
    if (!coverImageFile) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('coverImage', coverImageFile)

      const response = await axios.patch(
        `${backendURl}/api/user/coverImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      if (response.data.success) {
        setCoverImageFile(null)
        alert('Cover image updated successfully')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating cover image:', error)
      alert('Failed to update cover image')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confPassword) {
      alert('New passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(
        `${backendURl}/api/user/changePassword`,
        passwordForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.success) {
        setPasswordForm({ oldPassword: '', newPassword: '', confPassword: '' })
        setShowPasswordForm(false)
        alert('Password changed successfully')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 overflow-hidden">
          {userData.coverImage ? (
            <img
              src={userData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : null}
          <label className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all">
            <FaCamera /> Change Cover
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          {coverImageFile && (
            <button
              onClick={handleUpdateCoverImage}
              disabled={loading}
              className="absolute top-16 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Save Cover'}
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    {userData.fullName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {avatarFile && (
                <button
                  onClick={handleUpdateAvatar}
                  disabled={loading}
                  className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  Save
                </button>
              )}
            </div>

            <div className="flex-1">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setFormData({
                          fullName: userData.fullName || '',
                          email: userData.email || ''
                        })
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">
                        {userData.fullName || 'User'}
                      </h1>
                      <p className="text-gray-600">@{userData.userName}</p>
                    </div>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaEnvelope />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaUser />
                      <span>{userData.userName}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            {showPasswordForm ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confPassword: e.target.value
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordForm({
                        oldPassword: '',
                        newPassword: '',
                        confPassword: ''
                      })
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Change Password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
