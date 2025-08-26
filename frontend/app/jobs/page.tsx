'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useRole } from '../../hooks/useRole'
import { jobsService, Job, JobFilters } from '../../services/jobsService'
import { apiService } from '../../services/api'
import { API_CONFIG } from '../../config/api'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  ClockIcon,
  BookmarkIcon,
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

// Job interface is now imported from jobsService

export default function JobsPage() {
  const { user } = useAuth()
  const { isDeveloper, isEmployer } = useRole()
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
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set())
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    resume: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch jobs function
  const fetchJobs = async () => {
    console.log('Fetching jobs at:', new Date().toISOString())
    console.log('Current user role - isDeveloper:', isDeveloper, 'isEmployer:', isEmployer)
    try {
      setIsLoading(true)
      
      if (isEmployer) {
        // Employers see only their posted jobs
        console.log('Fetching employer jobs for user:', user?.id, 'role:', user?.role)
        const employerResponse = await jobsService.getEmployerJobs()
        console.log('Employer jobs response:', employerResponse)
        console.log('Response type:', typeof employerResponse)
        console.log('Is array?', Array.isArray(employerResponse))
        console.log('Response keys:', employerResponse && typeof employerResponse === 'object' ? Object.keys(employerResponse) : 'Not an object')
        
        if (Array.isArray(employerResponse)) {
          console.log('Setting employer jobs:', employerResponse.length, 'jobs')
          console.log('Jobs data:', employerResponse)
          setJobs(employerResponse)
          setFilteredJobs(employerResponse)
        } else if (employerResponse && typeof employerResponse === 'object' && 'jobs' in employerResponse) {
          // Handle case where response is { jobs: [...] }
          const jobsArray = (employerResponse as any).jobs
          console.log('Setting employer jobs from jobs property:', jobsArray.length, 'jobs')
          console.log('Jobs data:', jobsArray)
          setJobs(jobsArray)
          setFilteredJobs(jobsArray)
        } else {
          console.warn('Unexpected employer jobs response structure:', employerResponse)
          setJobs([])
          setFilteredJobs([])
        }
               } else {
           // Developers see all available jobs
           const filters: JobFilters = {
             search: searchQuery,
             location: selectedLocation,
             type: selectedType,
             experience: selectedExperience,
             page: currentPage,
             limit: jobsPerPage
           }
           console.log('Developer filters:', filters)
           const allJobsResponse = await jobsService.getJobs(filters)
           console.log('All jobs response for developer:', allJobsResponse)
           console.log('Response type:', typeof allJobsResponse)
           console.log('Is array?', Array.isArray(allJobsResponse))
           console.log('Response keys:', allJobsResponse && typeof allJobsResponse === 'object' ? Object.keys(allJobsResponse) : 'Not an object')
           
           // Handle paginated response from getJobs()
           if (allJobsResponse && allJobsResponse.jobs && Array.isArray(allJobsResponse.jobs)) {
             console.log('Setting jobs from paginated response:', allJobsResponse.jobs.length, 'jobs')
             console.log('Jobs data:', allJobsResponse.jobs)
             setJobs(allJobsResponse.jobs)
             setFilteredJobs(allJobsResponse.jobs)
           } else if (Array.isArray(allJobsResponse)) {
             // Handle case where response is directly an array
             console.log('Setting jobs from direct array response:', allJobsResponse.length, 'jobs')
             console.log('Jobs data:', allJobsResponse)
             setJobs(allJobsResponse)
             setFilteredJobs(allJobsResponse)
           } else {
             console.warn('Unexpected all jobs response structure:', allJobsResponse)
             setJobs([])
             setFilteredJobs([])
           }
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      // Show more detailed error information
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        if (error.message.includes('Validation error')) {
          console.error('This might be a backend validation issue. Check if the backend is running and has the expected schema.')
        }
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.error('Authentication error - user might not be logged in or token expired')
        }
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          console.error('Access denied - user might not have employer role')
        }
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          console.error('Endpoint not found - check if backend is running and endpoint exists')
        }
      }
      // Fallback to empty array on error
      setJobs([])
      setFilteredJobs([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs()
  }, [searchQuery, selectedLocation, selectedType, selectedExperience, currentPage, jobsPerPage, isEmployer, user?.id])

  // Update filtered jobs when jobs change
  useEffect(() => {
    console.log('Jobs state updated:', jobs.length, 'jobs')
    console.log('Jobs data:', jobs)
    console.log('Setting filtered jobs to:', jobs.length, 'jobs')
    setFilteredJobs(jobs)
  }, [jobs])

  // Pagination - using API response
  const currentJobs = filteredJobs
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  
  console.log('Current state - jobs:', jobs.length, 'filteredJobs:', filteredJobs.length, 'currentJobs:', currentJobs.length)
  console.log('Current jobs data:', currentJobs)

  const formatSalary = (salary: any) => {
    if (!salary || typeof salary !== 'object') {
      return 'Salary not specified'
    }
    
    // Handle different salary formats from backend
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
    } else if (salary.amount) {
      return `$${salary.amount.toLocaleString()}`
    } else if (salary.range) {
      return salary.range
    } else {
      return 'Salary not specified'
    }
  }

  const handleApplyClick = (job: Job) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }
    
    setSelectedJob(job)
    setShowApplicationModal(true)
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob || !user) return

    try {
      setIsSubmitting(true)
      
      console.log('Applying to job:', selectedJob.id, applicationForm)
      
      // If a resume file is selected, upload it first to get a URL
      let resumeUrl: string | undefined
      if (applicationForm.resume) {
        try {
          const uploadResp: any = await apiService.upload(API_CONFIG.ENDPOINTS.UPLOADS.RESUME, applicationForm.resume, 'file')
          // Expecting { file: { url, filename, ... } }
          resumeUrl = uploadResp?.file?.url || uploadResp?.file?.filename
          console.log('Resume uploaded. Using URL/filename:', resumeUrl)
        } catch (uploadErr) {
          console.warn('Resume upload failed, proceeding without resume:', uploadErr)
        }
      }

      // Create the application data
      const applicationData = {
        jobId: selectedJob.id,
        coverLetter: applicationForm.coverLetter,
        resume: resumeUrl
      }
      
      // Submit to backend API
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(applicationData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('Application submitted successfully:', result)
      
      // Mark job as applied
      setAppliedJobs(prev => new Set(prev).add(selectedJob.id))
      
      // Close modal and reset form
      setShowApplicationModal(false)
      setSelectedJob(null)
      setApplicationForm({ coverLetter: '', resume: null })
      
      // Show success message
      alert('Application submitted successfully! Your application has been saved to the database.')
      
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeApplicationModal = () => {
    setShowApplicationModal(false)
    setSelectedJob(null)
    setApplicationForm({ coverLetter: '', resume: null })
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
        {/* Header - Different for Developers vs Employers */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isDeveloper ? 'Find Your Dream Job' : 'Manage Job Postings'}
              </h1>
              <p className="text-xl text-gray-600">
                {isDeveloper 
                  ? 'Discover thousands of opportunities from top companies'
                  : 'Review and manage your company\'s job postings'
                }
              </p>
            </div>
                         {isEmployer && (
               <>
                 <Link href="/post-job" className="btn-primary">
                   <PlusIcon className="w-5 h-5 mr-2" />
                   Post New Job
                 </Link>
                 <button 
                   onClick={() => {
                     console.log('Force refresh clicked')
                     console.log('Current jobs state:', jobs)
                     console.log('Current filtered jobs state:', filteredJobs)
                     fetchJobs()
                   }}
                   className="btn-outline ml-2"
                 >
                   Refresh Jobs
                 </button>
               </>
             )}
             {isDeveloper && (
               <button 
                 onClick={() => {
                   console.log('Developer refresh clicked')
                   console.log('Current jobs state:', jobs)
                   console.log('Current filtered jobs state:', filteredJobs)
                   fetchJobs()
                 }}
                 className="btn-outline"
               >
                 Refresh Jobs
               </button>
             )}
          </div>
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
           {currentJobs.map((job) => {
             // Safety check for required fields
             if (!job || !job.title || !job.companyName) {
               console.warn('Invalid job data:', job)
               return null
             }
             
             return (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.01] group">
              <div className="flex items-start space-x-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                                                         <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                     {job.companyName.charAt(0)}
                   </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                                             <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 cursor-pointer">
                         {job.title}
                       </h3>
                       <p className="text-lg text-gray-600 mt-1">{job.companyName}</p>
                      
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
                           <span>{formatDate(job.createdAt)}</span>
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
                         {job.skills && Array.isArray(job.skills) && job.skills.slice(0, 4).map((skill) => (
                           <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                             {skill}
                           </span>
                         ))}
                         {job.skills && Array.isArray(job.skills) && job.skills.length > 4 && (
                           <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                             +{job.skills.length - 4} more
                           </span>
                         )}
                       </div>

                                             <p className="text-gray-600 mt-3 line-clamp-2">{job.description || 'No description available'}</p>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end space-y-3 ml-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{formatSalary(job.salary)}</div>
                        <div className="text-sm text-gray-500">per year</div>
                      </div>
                      
                                             {/* Applications and views not available in backend response */}

                      <div className="flex space-x-2">
                        {isDeveloper ? (
                          <>
                            <button 
                              onClick={() => {
                                // Toggle bookmark state
                                const newBookmarks = new Set(bookmarkedJobs)
                                if (newBookmarks.has(job.id)) {
                                  newBookmarks.delete(job.id)
                                } else {
                                  newBookmarks.add(job.id)
                                }
                                setBookmarkedJobs(newBookmarks)
                              }}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                bookmarkedJobs.has(job.id) 
                                  ? 'text-primary-600 bg-primary-50' 
                                  : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
                              }`}
                            >
                              <BookmarkIcon className="w-5 h-5" />
                            </button>
                            {appliedJobs.has(job.id) ? (
                              <button className="btn-outline bg-green-50 text-green-700 border-green-200" disabled>
                                Applied ✓
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleApplyClick(job)}
                                className="btn-primary hover:bg-primary-700 transition-colors duration-200"
                              >
                                Apply Now
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button className="btn-outline">Edit</button>
                            <Link href="/applications" className="btn-primary">
                              View Applications
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          })}
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

        {/* Application Modal */}
        {showApplicationModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Apply to {selectedJob.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedJob.companyName}</p>
                </div>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleApplicationSubmit} className="p-6 space-y-6">
                {/* Job Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Job Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Location:</span> {selectedJob.location}
                      {selectedJob.isRemote && <span className="text-primary-600 ml-1">• Remote</span>}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedJob.type.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {selectedJob.experience}
                    </div>
                    <div>
                      <span className="font-medium">Salary:</span> {formatSalary(selectedJob.salary)}
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Tell us why you're interested in this position and how your skills align with the job requirements..."
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload your resume (PDF, DOC, DOCX)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="btn-outline cursor-pointer"
                    >
                      Choose File
                    </label>
                                         {applicationForm.resume && (
                       <p className="text-sm text-primary-600 mt-2">Selected: {applicationForm.resume.name}</p>
                     )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeApplicationModal}
                    className="btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
