'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to the backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || '',
      website: user?.website || '',
      github: user?.github || '',
      linkedin: user?.linkedin || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-xl text-gray-600">Manage your personal information and preferences</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'}`}
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className={`lg:col-span-1 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600 capitalize mb-4">{user?.role?.toLowerCase()}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.location && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <div className="input-group">
                      <MapPinIcon className="input-icon" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div className="input-group">
                      <PhoneIcon className="input-icon" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <div className="input-group">
                      <GlobeAltIcon className="input-icon" />
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        disabled={!isEditing}
                        className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">GitHub</label>
                    <div className="input-group">
                      <UserIcon className="input-icon" />
                      <input
                        type="text"
                        value={profileData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        disabled={!isEditing}
                        className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="GitHub username"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <div className="input-group">
                    <UserIcon className="input-icon" />
                    <input
                      type="url"
                      value={profileData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      disabled={!isEditing}
                      className={`input pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="btn-primary"
                    >
                      <CheckIcon className="w-5 h-5 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-outline"
                    >
                      <XMarkIcon className="w-5 h-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
