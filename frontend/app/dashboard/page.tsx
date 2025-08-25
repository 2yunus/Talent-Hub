'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useRole } from '../../hooks/useRole'
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  EyeIcon, 
  StarIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface Stat {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: React.ComponentType<{ className?: string }>
}

interface RecentJob {
  id: string
  title: string
  company: string
  location: string
  type: string
  postedAt: string
  salary: string
}

interface RecentApplication {
  id: string
  jobTitle: string
  company: string
  appliedAt: string
  status: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isDeveloper, isEmployer } = useRole()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!user) {
      router.push('/login')
      return
    }
    
    setIsVisible(true)
  }, [user, router])

  const stats: Stat[] = isDeveloper ? [
    { name: 'Applied Jobs', value: '12', change: '+3', changeType: 'positive', icon: BriefcaseIcon },
    { name: 'Profile Views', value: '45', change: '+12%', changeType: 'positive', icon: EyeIcon },
    { name: 'Saved Jobs', value: '8', change: '+2', changeType: 'positive', icon: StarIcon },
    { name: 'Interviews', value: '3', change: '+1', changeType: 'positive', icon: CalendarIcon }
  ] : [
    { name: 'Posted Jobs', value: '15', change: '+2', changeType: 'positive', icon: BriefcaseIcon },
    { name: 'Total Applications', value: '89', change: '+12%', changeType: 'positive', icon: UserGroupIcon },
    { name: 'Active Jobs', value: '8', change: '+1', changeType: 'positive', icon: EyeIcon },
    { name: 'Hired Candidates', value: '5', change: '+1', changeType: 'positive', icon: StarIcon }
  ]

  const recentJobs: RecentJob[] = [
          {
        id: '1',
        title: 'Senior Full-Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        postedAt: '2 hours ago',
        salary: '$120k - $180k'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'Full-time',
        postedAt: '4 hours ago',
        salary: '$80k - $120k'
      },
      {
        id: '3',
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'Austin, TX',
        type: 'Contract',
        postedAt: '6 hours ago',
        salary: '$100k - $150k'
      }
  ]

  const recentApplications: RecentApplication[] = [
          {
        id: '1',
        jobTitle: 'Senior Full-Stack Developer',
        company: 'TechCorp Inc.',
        status: 'Under Review',
        appliedAt: '2 days ago'
      },
      {
        id: '2',
        jobTitle: 'Frontend Developer',
        company: 'StartupXYZ',
        status: 'Interview Scheduled',
        appliedAt: '1 week ago'
      }
  ]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
                 {/* Header - Different for Developers vs Employers */}
         <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <h1 className="text-4xl font-bold text-gray-900 mb-2">
             Welcome back, {user?.firstName}!
           </h1>
           <p className="text-xl text-gray-600">
             {isDeveloper 
               ? "Here's what's happening with your job search today"
               : "Here's what's happening with your company today"
             }
           </p>
         </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={stat.name}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:scale-105"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm font-medium mt-2 ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Main Content - Different for Developers vs Employers */}
           <div className={`lg:col-span-2 transition-all duration-700 delay-400 ${
             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
           }`}>
             {isDeveloper ? (
               // Developer Dashboard - Recent Job Opportunities
               <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 <div className="p-6 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <h2 className="text-xl font-semibold text-gray-900">Recent Job Opportunities</h2>
                     <Link href="/jobs" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                       View All
                     </Link>
                   </div>
                 </div>
                 <div className="p-6">
                   <div className="space-y-4">
                     {recentJobs.map((job) => (
                       <div key={job.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                         <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                           {job.company.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                           <p className="text-gray-600 mb-2">{job.company}</p>
                           <div className="flex items-center space-x-4 text-sm text-gray-500">
                             <div className="flex items-center space-x-1">
                               <MapPinIcon className="w-4 h-4" />
                               <span>{job.location}</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <BriefcaseIcon className="w-4 h-4" />
                               <span>{job.type}</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <ClockIcon className="w-4 h-4" />
                               <span>{job.postedAt}</span>
                             </div>
                           </div>
                           <p className="text-primary-600 font-semibold mt-2">{job.salary}</p>
                         </div>
                         <button className="btn-primary">Apply</button>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             ) : (
               // Employer Dashboard - Recent Applications
               <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 <div className="p-6 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                     <Link href="/applications" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                       View All
                     </Link>
                   </div>
                 </div>
                 <div className="p-6">
                   <div className="space-y-4">
                     {recentApplications.map((app) => (
                       <div key={app.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                         <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                           {app.jobTitle.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.jobTitle}</h3>
                           <p className="text-gray-600 mb-2">Applicant: {app.company}</p>
                           <div className="flex items-center space-x-4 text-sm text-gray-500">
                             <div className="flex items-center space-x-1">
                               <DocumentTextIcon className="w-4 h-4" />
                               <span>{app.status}</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <ClockIcon className="w-4 h-4" />
                               <span>{app.appliedAt}</span>
                             </div>
                           </div>
                         </div>
                         <button className="btn-outline">Review</button>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </div>

          {/* Sidebar */}
          <div className={`space-y-6 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-600 capitalize mb-4">{user?.role?.toLowerCase()}</p>
                <button className="btn-outline w-full">Edit Profile</button>
              </div>
            </div>

                         {/* Sidebar Content - Different for Developers vs Employers */}
             {isDeveloper ? (
               // Developer Sidebar - Recent Applications
               <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 <div className="p-6 border-b border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                 </div>
                 <div className="p-6">
                   <div className="space-y-4">
                     {recentApplications.map((app) => (
                       <div key={app.id} className="border-l-4 border-primary-500 pl-4">
                         <h4 className="font-medium text-gray-900 mb-1">{app.jobTitle}</h4>
                         <p className="text-sm text-gray-600 mb-2">{app.company}</p>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500">{app.appliedAt}</span>
                           <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                             {app.status}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                   <Link href="/applications" className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                     View All Applications
                   </Link>
                 </div>
               </div>
             ) : (
               // Employer Sidebar - Recent Job Postings
               <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                 <div className="p-6 border-b border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
                 </div>
                 <div className="p-6">
                   <div className="space-y-4">
                     {recentJobs.map((job) => (
                       <div key={job.id} className="border-l-4 border-primary-500 pl-4">
                         <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                         <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500">{job.postedAt}</span>
                           <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                             Active
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                   <Link href="/jobs" className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                     View All Jobs
                   </Link>
                 </div>
               </div>
             )}

                         {/* Quick Actions - Different for Developers vs Employers */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
               <div className="space-y-3">
                 {isDeveloper ? (
                   <>
                     <Link href="/jobs" className="w-full btn-outline">Search Jobs</Link>
                     <Link href="/profile" className="w-full btn-outline">Update Profile</Link>
                     <button className="w-full btn-outline">Upload Resume</button>
                   </>
                 ) : (
                   <>
                     <Link href="/post-job" className="w-full btn-primary">Post a Job</Link>
                     <Link href="/applications" className="w-full btn-outline">Review Applications</Link>
                     <Link href="/profile" className="w-full btn-outline">Company Profile</Link>
                   </>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className={`mt-8 transition-all duration-700 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Activity Overview</h2>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5 text-success-500" />
                <span className="text-sm text-success-600 font-medium">+15% this week</span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Activity chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
