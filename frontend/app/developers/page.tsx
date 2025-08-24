'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  MapPinIcon,
  CodeBracketIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Developer {
  id: string
  name: string
  title: string
  avatar: string
  location: string
  skills: string[]
  experience: string
  rating: number
  hourlyRate: number
  isAvailable: boolean
  isVerified: boolean
}

const mockDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Full Stack Developer',
    avatar: '/api/placeholder/60/60',
    location: 'San Francisco, CA',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    experience: '8 years',
    rating: 4.9,
    hourlyRate: 85,
    isAvailable: true,
    isVerified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Frontend Engineer',
    avatar: '/api/placeholder/60/60',
    location: 'New York, NY',
    skills: ['Vue.js', 'CSS', 'JavaScript', 'Webpack'],
    experience: '5 years',
    rating: 4.7,
    hourlyRate: 65,
    isAvailable: true,
    isVerified: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Backend Developer',
    avatar: '/api/placeholder/60/60',
    location: 'Austin, TX',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    experience: '6 years',
    rating: 4.8,
    hourlyRate: 75,
    isAvailable: false,
    isVerified: true
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'DevOps Engineer',
    avatar: '/api/placeholder/60/60',
    location: 'Seattle, WA',
    skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
    experience: '7 years',
    rating: 4.6,
    hourlyRate: 90,
    isAvailable: true,
    isVerified: true
  },
  {
    id: '5',
    name: 'Lisa Wang',
    title: 'Mobile Developer',
    avatar: '/api/placeholder/60/60',
    location: 'Boston, MA',
    skills: ['React Native', 'iOS', 'Android', 'Firebase'],
    experience: '4 years',
    rating: 4.5,
    hourlyRate: 70,
    isAvailable: true,
    isVerified: false
  }
]

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>(mockDevelopers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const allSkills = Array.from(new Set(developers.flatMap(d => d.skills)))

  const filteredDevelopers = developers.filter(developer => {
    const matchesSearch = developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         developer.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => developer.skills.includes(skill))
    const matchesLocation = !locationFilter || 
                           developer.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && developer.isAvailable) ||
                               (availabilityFilter === 'unavailable' && !developer.isAvailable)
    
    return matchesSearch && matchesSkills && matchesLocation && matchesAvailability
  })

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience)
      case 'hourlyRate':
        return a.hourlyRate - b.hourlyRate
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">
              Find Top Developers
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fade-in-delay">
              Connect with skilled developers for your next project
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative animate-fade-in-delay-2">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search developers by name, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2 text-primary-600" />
                Filters
              </h3>
              
              {/* Skills Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Skills</h4>
                <div className="space-y-2">
                  {allSkills.map(skill => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Location</h4>
                <input
                  type="text"
                  placeholder="Enter city or state..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Availability</h4>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">All Developers</option>
                  <option value="available">Available Now</option>
                  <option value="unavailable">Currently Busy</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="hourlyRate">Lowest Rate</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Developers Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredDevelopers.length} Developers Found
              </h2>
              {selectedSkills.length > 0 && (
                <p className="text-gray-600 mt-2">
                  Filtered by: {selectedSkills.join(', ')}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              {sortedDevelopers.map((developer, index) => (
                <div
                  key={developer.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {developer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            {developer.name}
                            {developer.isVerified && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600">{developer.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            ${developer.hourlyRate}
                          </p>
                          <p className="text-sm text-gray-500">per hour</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {developer.location}
                        <span className="mx-2">•</span>
                        <CodeBracketIcon className="w-4 h-4 mr-1" />
                        {developer.experience} experience
                        <span className="mx-2">•</span>
                        <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                        {developer.rating}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {developer.skills.map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            developer.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {developer.isAvailable ? 'Available Now' : 'Currently Busy'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-all duration-200">
                            <HeartIcon className="w-5 h-5" />
                          </button>
                          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedDevelopers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No developers found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
