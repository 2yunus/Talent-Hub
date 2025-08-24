'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  DocumentTextIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [applications, setApplications] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setIsVisible(true)
    // Mock data - replace with actual API call
    setApplications([
      {
        id: 1,
        jobTitle: 'Senior React Developer',
        company: 'TechCorp',
        applicant: 'John Doe',
        applicantEmail: 'john@example.com',
        status: 'PENDING',
        appliedDate: '2024-01-15',
        location: 'San Francisco, CA',
        experience: '5 years',
        skills: ['React', 'TypeScript', 'Node.js'],
        coverLetter: 'I am excited to apply for this position...',
        resume: 'resume.pdf'
      },
      {
        id: 2,
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        applicant: 'Jane Smith',
        applicantEmail: 'jane@example.com',
        status: 'REVIEWING',
        appliedDate: '2024-01-14',
        location: 'Remote',
        experience: '3 years',
        skills: ['JavaScript', 'Python', 'MongoDB'],
        coverLetter: 'I have a passion for building scalable applications...',
        resume: 'jane_resume.pdf'
      },
      {
        id: 3,
        jobTitle: 'Frontend Engineer',
        company: 'BigTech Inc',
        applicant: 'Mike Johnson',
        applicantEmail: 'mike@example.com',
        status: 'ACCEPTED',
        appliedDate: '2024-01-13',
        location: 'New York, NY',
        experience: '4 years',
        skills: ['Vue.js', 'CSS', 'Webpack'],
        coverLetter: 'I am a detail-oriented developer...',
        resume: 'mike_resume.pdf'
      },
      {
        id: 4,
        jobTitle: 'Backend Developer',
        company: 'DataFlow Systems',
        applicant: 'Sarah Wilson',
        applicantEmail: 'sarah@example.com',
        status: 'REJECTED',
        appliedDate: '2024-01-12',
        location: 'Austin, TX',
        experience: '6 years',
        skills: ['Java', 'Spring', 'PostgreSQL'],
        coverLetter: 'I specialize in building robust backend systems...',
        resume: 'sarah_resume.pdf'
      }
    ])
  }, [])

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
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const updateApplicationStatus = (id: number, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Applications</h1>
              <p className="text-xl text-gray-600">Review and manage applications for your job postings</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{applications.length}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`mb-6 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 w-full"
                  />
                  <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className={`transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="space-y-4">
            {filteredApplications.map((application, index) => (
              <div
                key={application.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-500 delay-${index * 100}`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
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
                            <span>{application.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{application.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Applied {application.appliedDate}</span>
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

                    {/* Applicant Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{application.applicant}</h4>
                          <p className="text-sm text-gray-600">{application.applicantEmail}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Experience:</span>
                          <span className="ml-2 text-gray-900">{application.experience}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.skills.map((skill: string, skillIndex: number) => (
                              <span key={skillIndex} className="badge-outline text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter Preview */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Cover Letter</h5>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {application.coverLetter}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-outline text-sm">
                        <DocumentTextIcon className="w-4 h-4 mr-2" />
                        View Resume
                      </button>
                      <button className="btn-outline text-sm">
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Full Application
                      </button>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="lg:w-48">
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Update Status</h5>
                      
                      {application.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'REVIEWING')}
                            className="btn-outline w-full text-sm"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            Mark as Reviewing
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                            className="btn-primary w-full text-sm"
                          >
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
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
                            onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                            className="btn-primary w-full text-sm"
                          >
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                            className="btn-outline w-full text-sm text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XMarkIcon className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </>
                      )}

                      {(application.status === 'ACCEPTED' || application.status === 'REJECTED') && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'REVIEWING')}
                          className="btn-outline w-full text-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Mark as Reviewing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Applications will appear here once candidates start applying'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
