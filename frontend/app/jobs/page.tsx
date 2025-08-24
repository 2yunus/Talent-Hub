'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  BookmarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  experience: string
  salary: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  isRemote: boolean
  postedAt: string
  applications: number
  views: number
  isActive: boolean
  companyLogo?: string
  description: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(10)

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Full-Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        experience: 'SENIOR',
        salary: { min: 120000, max: 180000, currency: 'USD' },
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        isRemote: true,
        postedAt: '2024-01-15',
        applications: 45,
        views: 234,
        isActive: true,
        companyLogo: '/api/placeholder/60/60',
        description: 'We are looking for a talented full-stack developer to join our growing team...'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'FULL_TIME',
        experience: 'MID',
        salary: { min: 80000, max: 120000, currency: 'USD' },
        skills: ['React', 'Vue.js', 'JavaScript', 'CSS3'],
        isRemote: false,
        postedAt: '2024-01-14',
        applications: 32,
        views: 189,
        isActive: true,
        companyLogo: '/api/placeholder/60/60',
        description: 'Join our dynamic team and help build amazing user experiences...'
      },
      {
        id: '3',
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'Austin, TX',
        type: 'CONTRACT',
        experience: 'SENIOR',
        salary: { min: 100000, max: 150000, currency: 'USD' },
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
        isRemote: true,
        postedAt: '2024-01-13',
        applications: 28,
        views: 156,
        isActive: true,
        companyLogo: '/api/placeholder/60/60',
        description: 'Help us scale our infrastructure and improve deployment processes...'
      },
      {
        id: '4',
        title: 'Mobile App Developer',
        company: 'AppWorks',
        location: 'Seattle, WA',
        type: 'FULL_TIME',
        experience: 'JUNIOR',
        salary: { min: 70000, max: 95000, currency: 'USD' },
        skills: ['React Native', 'iOS', 'Android', 'JavaScript'],
        isRemote: false,
        postedAt: '2024-01-12',
        applications: 67,
        views: 298,
        isActive: true,
        companyLogo: '/api/placeholder/60/60',
        description: 'Build amazing mobile experiences for millions of users...'
      },
      {
        id: '5',
        title: 'Data Scientist',
        company: 'DataFlow Analytics',
        location: 'Boston, MA',
        type: 'FULL_TIME',
        experience: 'MID',
        salary: { min: 90000, max: 130000, currency: 'USD' },
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
        isRemote: true,
        postedAt: '2024-01-11',
        applications: 23,
        views: 145,
        isActive: true,
        companyLogo: '/api/placeholder/60/60',
        description: 'Transform data into actionable insights for our clients...'
      }
    ]

    setJobs(mockJobs)
    setFilteredJobs(mockJobs)
    setIsLoading(false)
  }, [])

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesLocation = !selectedLocation || job.location.includes(selectedLocation)
      const matchesType = !selectedType || job.type === selectedType
      const matchesExperience = !selectedExperience || job.experience === selectedExperience
      
      return matchesSearch && matchesLocation && matchesType && matchesExperience
    })
    
    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [jobs, searchQuery, selectedLocation, selectedType, selectedExperience])

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const formatSalary = (salary: Job['salary']) => {
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'ENTRY': return 'bg-green-100 text-green-800'
      case 'JUNIOR': return 'bg-blue-100 text-blue-800'
      case 'MID': return 'bg-yellow-100 text-yellow-800'
      case 'SENIOR': return 'bg-orange-100 text-orange-800'
      case 'LEAD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-primary-100 text-primary-800'
      case 'PART_TIME': return 'bg-purple-100 text-purple-800'
      case 'CONTRACT': return 'bg-indigo-100 text-indigo-800'
      case 'INTERNSHIP': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="skeleton-avatar"></div>
                  <div className="flex-1 space-y-3">
                    <div className="skeleton-text h-6 w-3/4"></div>
                    <div className="skeleton-text h-4 w-1/2"></div>
                    <div className="skeleton-text h-4 w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600">Discover thousands of opportunities from top companies</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="input"
                >
                  <option value="">All Locations</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Austin">Austin</option>
                  <option value="Seattle">Seattle</option>
                  <option value="Boston">Boston</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Job Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input"
                >
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Experience Level</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="input"
                >
                  <option value="">All Levels</option>
                  <option value="ENTRY">Entry</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Highest Salary</option>
              <option>Most Applications</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {currentJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.01] group">
              <div className="flex items-start space-x-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                                      <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {job.company.charAt(0)}
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 cursor-pointer">
                        {job.title}
                      </h3>
                      <p className="text-lg text-gray-600 mt-1">{job.company}</p>
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{job.location}</span>
                          {job.isRemote && <span className="text-primary-600 font-medium">• Remote</span>}
                        </div>
                        <div className="flex items-center space-x-1">
                          <BriefcaseIcon className="w-4 h-4" />
                          <span className="capitalize">{job.type.replace('_', ' ').toLowerCase()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatDate(job.postedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        <span className={`badge ${getExperienceColor(job.experience)}`}>
                          {job.experience}
                        </span>
                        <span className={`badge ${getTypeColor(job.type)}`}>
                          {job.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mt-3 line-clamp-2">{job.description}</p>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end space-y-3 ml-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{formatSalary(job.salary)}</div>
                        <div className="text-sm text-gray-500">per year</div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{job.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-4 h-4" />
                          <span>{job.applications}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                          <BookmarkIcon className="w-5 h-5" />
                        </button>
                        <button className="btn-primary">Apply Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-button pagination-button-disabled disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`pagination-button ${
                      currentPage === page ? 'pagination-button-active' : ''
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-button pagination-button-disabled disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedLocation('')
                setSelectedType('')
                setSelectedExperience('')
              }}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
