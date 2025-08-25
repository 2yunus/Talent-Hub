'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { useRole } from '../../hooks/useRole'
import { 
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isDeveloper, isEmployer } = useRole()
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
    linkedin: user?.linkedin || '',
    // Employer-specific fields
    companyName: (user as any)?.companyName || '',
    companyDescription: (user as any)?.companyDescription || '',
    industry: (user as any)?.industry || '',
    companySize: (user as any)?.companySize || '',
    // Developer-specific fields
    skills: (user as any)?.skills || [],
    experience: (user as any)?.experience || '',
    education: (user as any)?.education || '',
    resume: (user as any)?.resume || ''
  })

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!user) {
      router.push('/login')
      return
    }
    
    setIsVisible(true)
  }, [user, router])

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
      linkedin: user?.linkedin || '',
      // Employer-specific fields
      companyName: (user as any)?.companyName || '',
      companyDescription: (user as any)?.companyDescription || '',
      industry: (user as any)?.industry || '',
      companySize: (user as any)?.companySize || '',
      // Developer-specific fields
      skills: (user as any)?.skills || [],
      experience: (user as any)?.experience || '',
      education: (user as any)?.education || '',
      resume: (user as any)?.resume || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Different for Developers vs Employers */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isDeveloper ? 'Developer Profile' : 'Company Profile'}
              </h1>
              <p className="text-xl text-gray-600">
                {isDeveloper 
                  ? 'Manage your personal information and professional details'
                  : 'Manage your company information and hiring preferences'
                }
              </p>
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
                  <label className="form-label">
                    {isDeveloper ? 'Bio' : 'Company Description'}
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder={isDeveloper ? "Tell us about yourself..." : "Tell us about your company..."}
                  />
                </div>

                {/* Employer-specific fields */}
                {isEmployer && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          value={profileData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          disabled={!isEditing}
                          className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                          placeholder="Your Company Inc."
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Industry</label>
                        <input
                          type="text"
                          value={profileData.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          disabled={!isEditing}
                          className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                          placeholder="Technology, Healthcare, etc."
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Company Size</label>
                      <select
                        value={profileData.companySize}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Developer-specific fields */}
                {isDeveloper && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">Experience</label>
                        <input
                          type="text"
                          value={profileData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          disabled={!isEditing}
                          className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                          placeholder="e.g., 5 years in web development"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Education</label>
                        <input
                          type="text"
                          value={profileData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          disabled={!isEditing}
                          className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                          placeholder="e.g., BS Computer Science, Stanford University"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Skills</label>
                      <input
                        type="text"
                        value={Array.isArray(profileData.skills) ? profileData.skills.join(', ') : profileData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()) as any)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="JavaScript, React, Node.js, PostgreSQL"
                      />
                      <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                    </div>
                  </>
                )}

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
