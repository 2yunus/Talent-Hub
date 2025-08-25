'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { useRole } from '../../hooks/useRole'
import { applicationsService } from '../../services/applicationsService'
import { API_CONFIG } from '../../config/api'
import { 
  DocumentTextIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

// Different interfaces for different user roles
interface DeveloperApplication {
  id: string
  jobTitle: string
  companyName: string
  companyLogo?: string
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'
  appliedDate: string
  location: string
  salary: {
    min: number
    max: number
    currency: string
  }
  jobType: string
  experience: string
  isRemote: boolean
  lastUpdated: string
}

interface EmployerApplication {
  id: string
  jobTitle: string
  applicant: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    experience: string
    location: string
    skills: string[]
    education: string
    website?: string
    github?: string
    linkedin?: string
  }
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'
  appliedDate: string
  coverLetter: string
  resume?: string
  lastUpdated: string
  matchScore?: number
}

export default function ApplicationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isDeveloper, isEmployer } = useRole()
  const [isVisible, setIsVisible] = useState(false)
  const [applications, setApplications] = useState<DeveloperApplication[] | EmployerApplication[]>([])
  const [applicationsType, setApplicationsType] = useState<'developer' | 'employer'>('developer')
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedEmployerApplication, setSelectedEmployerApplication] = useState<EmployerApplication | null>(null)

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!user) {
      router.push('/login')
      return
    }
    
    setIsVisible(true)
    fetchApplications()
  }, [user, router])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      if (isDeveloper) {
        // Fetch applications submitted by the developer
        const response = await applicationsService.getUserApplications()
        console.log('Developer applications response:', response)
        setApplicationsType('developer')
        
        if (response && Array.isArray(response)) {
                     // Convert Application[] to DeveloperApplication[]
           const convertedApplications = response.map(app => ({
             id: app.id,
             jobTitle: app.jobTitle || 'Unknown Job',
             companyName: app.company || 'Unknown Company',
             salary: { min: 0, max: 0, currency: 'USD' }, // Default values
             jobType: 'FULL_TIME', // Default value
             experience: app.experience || 'MID', // Use from API if available
             isRemote: false, // Default value
             status: app.status,
             appliedDate: app.appliedAt || app.appliedDate || new Date().toISOString(),
             coverLetter: app.coverLetter || '',
             resume: app.resume || '',
             lastUpdated: app.appliedAt || app.appliedDate || new Date().toISOString(),
             location: app.location || 'Unknown Location' // Use from API if available
           })) as DeveloperApplication[]
          setApplications(convertedApplications)
        } else {
          console.warn('Unexpected response structure for developer applications:', response)
          // Fallback to mock data
          const mockData = getMockApplications()
          setApplications(mockData)
        }
      } else if (isEmployer) {
        // Fetch applications for jobs posted by the employer
        const response = await applicationsService.getEmployerApplications()
        console.log('Employer applications response:', response)
        setApplicationsType('employer')
        
        if (response && Array.isArray(response)) {
          // Convert Application[] to EmployerApplication[]
          const convertedApplications = response.map(app => {
            console.log('Processing application:', app)
            console.log('app.jobTitle:', app.jobTitle)
            console.log('app.job:', app.job)
            console.log('app.company:', app.company)
            
            // Handle applicant name - check multiple possible fields
            let firstName = 'Unknown'
            let lastName = 'User'
            
            // Since backend doesn't provide applicant name directly, we'll show the applicant ID
            // In a real app, you'd fetch user details using applicantId
            if (app.applicant && typeof app.applicant === 'string') {
              const nameParts = app.applicant.split(' ')
              firstName = nameParts[0] || 'Unknown'
              lastName = nameParts[1] || 'User'
            } else if ((app as any).applicantFirstName && (app as any).applicantLastName) {
              firstName = (app as any).applicantFirstName
              lastName = (app as any).applicantLastName
            } else if ((app as any).applicantName && typeof (app as any).applicantName === 'string') {
              const nameParts = (app as any).applicantName.split(' ')
              firstName = nameParts[0] || 'Unknown'
              lastName = nameParts[1] || 'User'
            } else {
              // Use applicant ID as fallback since backend doesn't provide name
              firstName = `Applicant`
              lastName = `#${app.applicantId?.slice(-4) || 'Unknown'}`
            }
            
            return {
              id: app.id,
              jobTitle: app.jobTitle || app.job?.title || 'Unknown Job',
              applicant: {
                id: app.applicantId || 'unknown',
                firstName: firstName,
                lastName: lastName,
                email: app.applicantEmail || 'no-email@example.com',
                experience: app.experience || '3 years',
                location: app.location || 'Unknown',
                skills: app.skills || ['Unknown'],
                education: 'Unknown', // Default value
                website: undefined,
                github: undefined,
                linkedin: undefined
              },
              status: app.status,
              appliedDate: app.appliedAt || app.appliedDate || new Date().toISOString(),
              coverLetter: app.coverLetter || '',
              resume: app.resume || '',
              lastUpdated: app.appliedAt || app.appliedDate || new Date().toISOString(),
              matchScore: 85 // Default value
            }
          }) as EmployerApplication[]
          setApplications(convertedApplications)
        } else {
          console.warn('Unexpected response structure for employer applications:', response)
          // Fallback to mock data
          const mockData = getMockApplications()
          setApplications(mockData)
        }
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      // Fallback to mock data for now
      const mockData = getMockApplications()
      setApplicationsType(isDeveloper ? 'developer' : 'employer')
      setApplications(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const getMockApplications = () => {
    console.log('getMockApplications called, isDeveloper:', isDeveloper, 'isEmployer:', isEmployer)
    
    if (isDeveloper) {
      const mockData = [
        {
          id: '1',
          jobTitle: 'Senior React Developer',
          companyName: 'TechCorp',
          status: 'PENDING',
          appliedDate: '2024-01-15',
          location: 'San Francisco, CA',
          salary: { min: 120000, max: 180000, currency: 'USD' },
          jobType: 'Full Time',
          experience: '5+ years',
          isRemote: false,
          lastUpdated: '2024-01-15'
        },
        {
          id: '2',
          jobTitle: 'Full Stack Developer',
          companyName: 'StartupXYZ',
          status: 'REVIEWING',
          appliedDate: '2024-01-14',
          location: 'Remote',
          salary: { min: 90000, max: 140000, currency: 'USD' },
          jobType: 'Full Time',
          experience: '3+ years',
          isRemote: true,
          lastUpdated: '2024-01-16'
        },
        {
          id: '3',
          jobTitle: 'Frontend Engineer',
          companyName: 'BigTech Inc',
          status: 'ACCEPTED',
          appliedDate: '2024-01-13',
          location: 'New York, NY',
          salary: { min: 130000, max: 190000, currency: 'USD' },
          jobType: 'Full Time',
          experience: '4+ years',
          isRemote: false,
          lastUpdated: '2024-01-18'
        }
      ] as DeveloperApplication[]
      console.log('Generated developer mock data:', mockData)
      return mockData
    } else {
      const mockData = [
        {
          id: '1',
          jobTitle: 'Senior React Developer',
          applicant: {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            experience: '5 years',
            location: 'San Francisco, CA',
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            education: 'BS Computer Science, Stanford University',
            website: 'https://johndoe.dev',
            github: 'johndoe',
            linkedin: 'johndoe-sf'
          },
          status: 'PENDING',
          appliedDate: '2024-01-15',
          coverLetter: 'I am excited to apply for this Senior React Developer position at TechCorp. With 5 years of experience building scalable web applications, I believe I can contribute significantly to your team...',
          resume: 'john_doe_resume.pdf',
          lastUpdated: '2024-01-15',
          matchScore: 92
        },
        {
          id: '2',
          jobTitle: 'Full Stack Developer',
          applicant: {
            id: 'user2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            experience: '3 years',
            location: 'Remote',
            skills: ['JavaScript', 'Python', 'MongoDB', 'Express'],
            education: 'BS Software Engineering, MIT',
            website: 'https://janesmith.dev',
            github: 'janesmith',
            linkedin: 'janesmith-dev'
          },
          status: 'REVIEWING',
          appliedDate: '2024-01-14',
          coverLetter: 'I have a passion for building scalable applications and love working with modern technologies. My experience with JavaScript and Python makes me a great fit for this role...',
          resume: 'jane_smith_resume.pdf',
          lastUpdated: '2024-01-16',
          matchScore: 87
        }
      ] as EmployerApplication[]
      console.log('Generated employer mock data:', mockData)
      return mockData
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-4 h-4" />
      case 'REVIEWING':
        return <EyeIcon className="w-4 h-4" />
      case 'ACCEPTED':
        return <CheckIcon className="w-4 h-4" />
      case 'REJECTED':
        return <XMarkIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter
    
    if (isDeveloper) {
      const devApp = app as DeveloperApplication
      const matchesSearch = devApp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           devApp.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    } else {
      const empApp = app as EmployerApplication
      const matchesSearch = empApp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           empApp.applicant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           empApp.applicant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           empApp.applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesFilter && matchesSearch
    }
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0
    
    if (sortBy === 'date') {
      comparison = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
    } else if (sortBy === 'status') {
      const statusOrder = { 'PENDING': 0, 'REVIEWING': 1, 'ACCEPTED': 2, 'REJECTED': 3 }
      comparison = statusOrder[a.status] - statusOrder[b.status]
    } else if (sortBy === 'match' && isEmployer) {
      const empAppA = a as EmployerApplication
      const empAppB = b as EmployerApplication
      comparison = (empAppA.matchScore || 0) - (empAppB.matchScore || 0)
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const updateApplicationStatus = async (id: string, newStatus: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED') => {
    try {
      await applicationsService.updateApplicationStatus(id, { status: newStatus })
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: newStatus, lastUpdated: new Date().toISOString() } : app
        ) as DeveloperApplication[] | EmployerApplication[]
      )
    } catch (error) {
      console.error('Failed to update application status:', error)
    }
  }

  const getStatusCounts = () => {
    const counts = { all: 0, PENDING: 0, REVIEWING: 0, ACCEPTED: 0, REJECTED: 0 }
    applications.forEach(app => {
      counts.all++
      counts[app.status]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  const handleViewFullApplication = (app: EmployerApplication) => {
    setSelectedEmployerApplication(app)
    setShowApplicationModal(true)
  }

  const handleViewResume = (resume?: string) => {
    if (!resume) return
    try {
      const isUrl = /^https?:\/\//i.test(resume)
      const href = isUrl ? resume : `${API_CONFIG.BASE_URL}/uploads/resumes/${encodeURIComponent(resume)}`
      window.open(href, '_blank')
    } catch (e) {
      console.warn('Unable to open resume:', e)
    }
  }

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isDeveloper ? 'My Applications' : 'Job Applications'}
              </h1>
              <p className="text-xl text-gray-600">
                {isDeveloper 
                  ? 'Track your job applications and their progress'
                  : 'Review and manage applications for your job postings'
                }
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex space-x-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-4 text-center min-w-[120px]">
                <div className="text-2xl font-bold">{statusCounts.all}</div>
                <div className="text-sm opacity-90">Total</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-4 text-center min-w-[120px]">
                <div className="text-2xl font-bold">{statusCounts.PENDING}</div>
                <div className="text-sm opacity-90">Pending</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center min-w-[120px]">
                <div className="text-2xl font-bold">{statusCounts.REVIEWING}</div>
                <div className="text-sm opacity-90">Reviewing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`mb-6 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={isDeveloper ? "Search jobs or companies..." : "Search applicants or skills..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 w-full"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {['all', 'PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  {isEmployer && <option value="match">Sort by Match Score</option>}
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                >
                  {sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className={`transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="space-y-4">
                         {sortedApplications.map((application, index) => {
               // Safety check for application data structure
               if (isDeveloper) {
                 const devApp = application as DeveloperApplication
                 if (!devApp.jobTitle || !devApp.companyName) {
                   console.warn('Invalid developer application data:', devApp)
                   return null
                 }
               } else {
                 const empApp = application as EmployerApplication
                 if (!empApp.jobTitle || !empApp.applicant) {
                   console.warn('Invalid employer application data:', empApp)
                   return null
                 }
               }

               return (
                 <div
                   key={application.id}
                   className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-500 hover:shadow-md hover:scale-[1.01] ${
                     application.status === 'ACCEPTED' ? 'border-green-200 bg-green-50/30' :
                     application.status === 'REJECTED' ? 'border-red-200 bg-red-50/30' :
                     'hover:border-primary-200'
                   }`}
                 >
                   {isDeveloper ? (
                     <DeveloperApplicationCard 
                       application={application as DeveloperApplication} 
                       index={index}
                     />
                   ) : (
                     <EmployerApplicationCard 
                       application={application as EmployerApplication} 
                       index={index}
                       onStatusUpdate={updateApplicationStatus}
                      onViewFullApplication={handleViewFullApplication}
                      onViewResume={handleViewResume}
                     />
                   )}
                 </div>
               )
             })}

            {sortedApplications.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : isDeveloper 
                      ? 'You haven\'t applied to any jobs yet. Start exploring opportunities!'
                      : 'Applications will appear here once candidates start applying to your job postings'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isEmployer && (
        <EmployerApplicationModal
          open={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          application={selectedEmployerApplication}
        />
      )}
    </div>
  )
}

// Developer Application Card Component
function DeveloperApplicationCard({ application, index }: { application: DeveloperApplication, index: number }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-4 h-4" />
      case 'REVIEWING':
        return <EyeIcon className="w-4 h-4" />
      case 'ACCEPTED':
        return <CheckIcon className="w-4 h-4" />
      case 'REJECTED':
        return <XMarkIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Company Logo */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {application.companyName.charAt(0)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {application.jobTitle}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span className="font-medium">{application.companyName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{application.location}</span>
                {application.isRemote && <span className="text-primary-600 font-medium">• Remote</span>}
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`badge ${getStatusColor(application.status)}`}>
              <span className="flex items-center space-x-1">
                {getStatusIcon(application.status)}
                <span>{application.status}</span>
              </span>
            </span>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BriefcaseIcon className="w-4 h-4" />
              <span>Type: {application.jobType}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <StarIcon className="w-4 h-4" />
              <span>Experience: {application.experience}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DocumentTextIcon className="w-4 h-4" />
              <span>Salary: ${application.salary.min.toLocaleString()} - ${application.salary.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Last updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
            <span className="text-primary-600 font-medium">
              {application.status === 'PENDING' && 'Application submitted'}
              {application.status === 'REVIEWING' && 'Under review'}
              {application.status === 'ACCEPTED' && 'Application accepted! 🎉'}
              {application.status === 'REJECTED' && 'Application not selected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Employer Application Card Component
function EmployerApplicationCard({ 
  application, 
  index, 
  onStatusUpdate,
  onViewFullApplication,
  onViewResume
}: { 
  application: EmployerApplication, 
  index: number,
  onStatusUpdate: (id: string, status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED') => void,
  onViewFullApplication: (app: EmployerApplication) => void,
  onViewResume: (resume?: string) => void
}) {
  // Safety check for applicant data
  if (!application.applicant) {
    console.warn('Application missing applicant data:', application)
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">Error: Application data is incomplete</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-4 h-4" />
      case 'REVIEWING':
        return <EyeIcon className="w-4 h-4" />
      case 'ACCEPTED':
        return <CheckIcon className="w-4 h-4" />
      case 'REJECTED':
        return <XMarkIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Applicant Avatar */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {application.applicant.firstName?.charAt(0) || '?'}{application.applicant.lastName?.charAt(0) || '?'}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {application.jobTitle}
            </h3>
                         <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
               <div className="flex items-center space-x-1">
                 <UserIcon className="w-4 h-4" />
                 <span className="font-medium">{application.applicant.firstName || 'Unknown'} {application.applicant.lastName || 'Applicant'}</span>
               </div>
               <div className="flex items-center space-x-1">
                 <MapPinIcon className="w-4 h-4" />
                 <span>{application.applicant.location || 'Location not specified'}</span>
               </div>
               <div className="flex items-center space-x-1">
                 <CalendarIcon className="w-4 h-4" />
                 <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
               </div>
               {application.matchScore && (
                 <div className="flex items-center space-x-1">
                   <StarIcon className="w-4 h-4 text-yellow-500" />
                   <span className="text-yellow-600 font-medium">{application.matchScore}% Match</span>
                 </div>
               )}
             </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`badge ${getStatusColor(application.status)}`}>
              <span className="flex items-center space-x-1">
                {getStatusIcon(application.status)}
                <span>{application.status}</span>
              </span>
            </span>
          </div>
        </div>

                 {/* Applicant Details */}
         <div className="bg-gray-50 rounded-lg p-4 mb-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <div className="flex items-center space-x-2 mb-2">
                 <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                 <span className="text-sm text-gray-600">{application.applicant.email || 'Email not provided'}</span>
               </div>
               <div className="flex items-center space-x-2 mb-2">
                 <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                 <span className="text-sm text-gray-600">{application.applicant.experience || 'Experience not specified'}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                 <span className="text-sm text-gray-600">{application.applicant.education || 'Education not specified'}</span>
               </div>
             </div>
             <div>
               <div className="text-sm text-gray-600 mb-2">Skills:</div>
               <div className="flex flex-wrap gap-1">
                 {Array.isArray(application.applicant.skills) && application.applicant.skills.length > 0 ? (
                   <>
                     {application.applicant.skills.slice(0, 4).map((skill, skillIndex) => (
                       <span key={skillIndex} className="badge-outline text-xs">
                         {skill}
                       </span>
                     ))}
                     {application.applicant.skills.length > 4 && (
                       <span className="badge-outline text-xs">
                         +{application.applicant.skills.length - 4} more
                       </span>
                     )}
                   </>
                 ) : (
                   <span className="text-sm text-gray-500">No skills listed</span>
                 )}
               </div>
             </div>
           </div>
         </div>

                 {/* Cover Letter Preview */}
         <div className="mb-4">
           <h5 className="font-medium text-gray-900 mb-2">Cover Letter</h5>
           <p className="text-gray-600 text-sm line-clamp-3">
             {application.coverLetter || 'No cover letter provided'}
           </p>
         </div>

         {/* Actions */}
         <div className="flex flex-wrap gap-2">
           {application.resume && (
            <button className="btn-outline text-sm" onClick={() => onViewResume(application.resume)}>
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              View Resume
            </button>
            )}
           <button className="btn-outline text-sm" onClick={() => onViewFullApplication(application)}>
             <EyeIcon className="w-4 h-4 mr-2" />
             View Full Application
           </button>
           {application.applicant.website && (
             <a 
               href={application.applicant.website} 
               target="_blank" 
               rel="noopener noreferrer"
               className="btn-outline text-sm"
             >
               <GlobeAltIcon className="w-4 h-4 mr-2" />
               Portfolio
             </a>
           )}
         </div>
      </div>

      {/* Status Actions */}
      <div className="lg:w-48">
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Update Status</h5>
          
          {application.status === 'PENDING' && (
            <>
              <button
                onClick={() => onStatusUpdate(application.id, 'REVIEWING')}
                className="btn-outline w-full text-sm"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Mark as Reviewing
              </button>
              <button
                onClick={() => onStatusUpdate(application.id, 'ACCEPTED')}
                className="btn-primary w-full text-sm"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate(application.id, 'REJECTED')}
                className="btn-outline w-full text-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Reject
              </button>
            </>
          )}

          {application.status === 'REVIEWING' && (
            <>
              <button
                onClick={() => onStatusUpdate(application.id, 'ACCEPTED')}
                className="btn-primary w-full text-sm"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate(application.id, 'REJECTED')}
                className="btn-outline w-full text-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Reject
              </button>
            </>
          )}

          {(application.status === 'ACCEPTED' || application.status === 'REJECTED') && (
            <button
              onClick={() => onStatusUpdate(application.id, 'REVIEWING')}
              className="btn-outline w-full text-sm"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Mark as Reviewing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmployerApplicationModal({ open, onClose, application }: { open: boolean, onClose: () => void, application: EmployerApplication | null }) {
  if (!open || !application) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-200 p-6 mx-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
            <p className="text-sm text-gray-600">Applied {new Date(application.appliedDate).toLocaleString()}</p>
          </div>
          <button className="btn-outline" onClick={onClose}>Close</button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-auto pr-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Applicant</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>Name: {application.applicant.firstName} {application.applicant.lastName}</div>
              <div>Email: {application.applicant.email}</div>
              <div>Location: {application.applicant.location || '—'}</div>
              <div>Experience: {application.applicant.experience || '—'}</div>
            </div>
            {Array.isArray(application.applicant.skills) && application.applicant.skills.length > 0 && (
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {application.applicant.skills.map((s, i) => (
                    <span key={i} className="badge-outline text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.coverLetter || 'No cover letter provided'}</p>
          </div>
          {application.resume && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resume</h4>
              <a href={/^https?:\/\//i.test(application.resume) ? application.resume : `${API_CONFIG.BASE_URL}/uploads/resumes/${encodeURIComponent(application.resume)}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Open Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
