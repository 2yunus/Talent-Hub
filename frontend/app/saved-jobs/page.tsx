'use client'

import { useState, useEffect } from 'react'
import { 
  BookmarkIcon,
  TrashIcon,
  EyeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface SavedJob {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  type: string
  salary: string
  postedDate: string
  description: string
  requirements: string[]
  benefits: string[]
  isRemote: boolean
  experienceLevel: string
  savedDate: string
}

const mockSavedJobs: SavedJob[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    companyLogo: '/api/placeholder/60/60',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    postedDate: '2 days ago',
    description: 'We are looking for a Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: ['React', 'Node.js', 'TypeScript', '5+ years experience'],
    benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work options'],
    isRemote: true,
    experienceLevel: 'Senior',
    savedDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: 'InnovateLabs',
    companyLogo: '/api/placeholder/60/60',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    postedDate: '1 week ago',
    description: 'Join our frontend team to build beautiful, responsive user interfaces that delight our customers.',
    requirements: ['Vue.js', 'CSS3', 'JavaScript ES6+', '3+ years experience'],
    benefits: ['Competitive salary', 'Stock options', 'Professional development', 'Team events'],
    isRemote: false,
    experienceLevel: 'Mid-level',
    savedDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'DataFlow Systems',
    companyLogo: '/api/placeholder/60/60',
    location: 'Austin, TX',
    type: 'Contract',
    salary: '$80 - $100 per hour',
    postedDate: '3 days ago',
    description: 'Contract position for a backend developer to help us scale our data processing infrastructure.',
    requirements: ['Python', 'Django', 'PostgreSQL', 'AWS', '2+ years experience'],
    benefits: ['Flexible hours', 'Remote work', 'Competitive rate'],
    isRemote: true,
    experienceLevel: 'Mid-level',
    savedDate: '2024-01-12'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudScale Technologies',
    companyLogo: '/api/placeholder/60/60',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    postedDate: '5 days ago',
    description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.',
    requirements: ['Kubernetes', 'Terraform', 'Jenkins', 'Linux', '4+ years experience'],
    benefits: ['Health benefits', '401k', 'Flexible PTO', 'Learning budget'],
    isRemote: false,
    experienceLevel: 'Senior',
    savedDate: '2024-01-08'
  },
  {
    id: '5',
    title: 'Mobile Developer',
    company: 'MobileFirst Apps',
    companyLogo: '/api/placeholder/60/60',
    location: 'Boston, MA',
    type: 'Part-time',
    salary: '$60 - $80 per hour',
    postedDate: '1 week ago',
    description: 'Part-time mobile developer to help us maintain and improve our existing mobile applications.',
    requirements: ['React Native', 'iOS development', 'Android development', '2+ years experience'],
    benefits: ['Flexible schedule', 'Remote work', 'Competitive rate'],
    isRemote: true,
    experienceLevel: 'Mid-level',
    savedDate: '2024-01-05'
  }
]

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(mockSavedJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('savedDate')

  const allCompanies = Array.from(new Set(savedJobs.map(job => job.company)))
  const allTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

  const filteredJobs = savedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompanies = selectedCompanies.length === 0 || 
                           selectedCompanies.includes(job.company)
    const matchesType = typeFilter === 'all' || job.type === typeFilter
    const matchesExperience = experienceFilter === 'all' || job.experienceLevel === experienceFilter
    
    return matchesSearch && matchesCompanies && matchesType && matchesExperience
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'savedDate':
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      case 'postedDate':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'company':
        return a.company.localeCompare(b.company)
      default:
        return 0
    }
  })

  const toggleCompany = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    )
  }

  const removeSavedJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">
              Saved Jobs
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fade-in-delay">
              Your curated collection of job opportunities
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative animate-fade-in-delay-2">
              <BookmarkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved jobs by title or company..."
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
                <BookmarkIcon className="w-5 h-5 mr-2 text-primary-600" />
                Filters
              </h3>
              
              {/* Company Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Company</h4>
                <div className="space-y-2">
                  {allCompanies.map(company => (
                    <label key={company} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company)}
                        onChange={() => toggleCompany(company)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{company}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Job Type</h4>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  {allTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Experience Level</h4>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
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
                  <option value="savedDate">Recently Saved</option>
                  <option value="postedDate">Recently Posted</option>
                  <option value="title">Title A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Collection</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Saved:</span>
                  <span className="font-semibold text-gray-900">{savedJobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Filtered:</span>
                  <span className="font-semibold text-gray-900">{filteredJobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Companies:</span>
                  <span className="font-semibold text-gray-900">{allCompanies.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Jobs Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredJobs.length} Saved Jobs
              </h2>
              {selectedCompanies.length > 0 && (
                <p className="text-gray-600 mt-2">
                  Filtered by: {selectedCompanies.join(', ')}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              {sortedJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {job.company.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-lg text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">{job.salary}</p>
                          <p className="text-sm text-gray-500">{job.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.location}
                          {job.isRemote && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          Posted {job.postedDate}
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {job.experienceLevel}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm font-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions and Saved Date */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Saved on {formatDate(job.savedDate)}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-all duration-200">
                            <ShareIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                            <HeartIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => removeSavedJob(job.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs found</h3>
                <p className="text-gray-500">
                  {filteredJobs.length === 0 && savedJobs.length > 0 
                    ? 'Try adjusting your filters.' 
                    : 'Start saving jobs you\'re interested in!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
