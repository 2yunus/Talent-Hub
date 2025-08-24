'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalViews: number
  totalLikes: number
  totalApplications: number
  profileViews: number
  jobViews: number
  companyViews: number
  monthlyStats: {
    month: string
    views: number
    applications: number
    likes: number
  }[]
  topJobs: {
    id: string
    title: string
    company: string
    views: number
    applications: number
  }[]
  topCompanies: {
    id: string
    name: string
    views: number
    applications: number
  }[]
  locationStats: {
    location: string
    views: number
    applications: number
  }[]
  salaryStats: {
    range: string
    count: number
    percentage: number
  }[]
}

const mockAnalyticsData: AnalyticsData = {
  totalViews: 1247,
  totalLikes: 89,
  totalApplications: 23,
  profileViews: 156,
  jobViews: 892,
  companyViews: 199,
  monthlyStats: [
    { month: 'Jan', views: 120, applications: 8, likes: 12 },
    { month: 'Feb', views: 135, applications: 12, likes: 15 },
    { month: 'Mar', views: 142, applications: 15, likes: 18 },
    { month: 'Apr', views: 158, applications: 18, likes: 22 },
    { month: 'May', views: 165, applications: 20, likes: 25 },
    { month: 'Jun', views: 178, applications: 22, likes: 28 },
    { month: 'Jul', views: 189, applications: 25, likes: 30 },
    { month: 'Aug', views: 195, applications: 28, likes: 32 },
    { month: 'Sep', views: 208, applications: 30, likes: 35 },
    { month: 'Oct', views: 215, applications: 32, likes: 38 },
    { month: 'Nov', views: 228, applications: 35, likes: 40 },
    { month: 'Dec', views: 235, applications: 38, likes: 42 }
  ],
  topJobs: [
    { id: '1', title: 'Senior Full Stack Developer', company: 'TechCorp Solutions', views: 156, applications: 12 },
    { id: '2', title: 'Frontend Engineer', company: 'InnovateLabs', views: 134, applications: 9 },
    { id: '3', title: 'Backend Developer', company: 'DataFlow Systems', views: 98, applications: 7 },
    { id: '4', title: 'DevOps Engineer', company: 'CloudScale Technologies', views: 87, applications: 6 },
    { id: '5', title: 'Mobile Developer', company: 'MobileFirst Apps', views: 76, applications: 5 }
  ],
  topCompanies: [
    { id: '1', name: 'TechCorp Solutions', views: 234, applications: 18 },
    { id: '2', name: 'InnovateLabs', views: 198, applications: 15 },
    { id: '3', name: 'DataFlow Systems', views: 167, applications: 12 },
    { id: '4', name: 'CloudScale Technologies', views: 145, applications: 10 },
    { id: '5', name: 'MobileFirst Apps', views: 123, applications: 8 }
  ],
  locationStats: [
    { location: 'San Francisco, CA', views: 456, applications: 34 },
    { location: 'New York, NY', views: 389, applications: 28 },
    { location: 'Austin, TX', views: 234, applications: 18 },
    { location: 'Seattle, WA', views: 198, applications: 15 },
    { location: 'Boston, MA', views: 167, applications: 12 }
  ],
  salaryStats: [
    { range: '$50k - $75k', count: 45, percentage: 18 },
    { range: '$75k - $100k', count: 78, percentage: 31 },
    { range: '$100k - $125k', count: 89, percentage: 35 },
    { range: '$125k - $150k', count: 34, percentage: 13 },
    { range: '$150k+', count: 8, percentage: 3 }
  ]
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData)
  const [timeRange, setTimeRange] = useState('12months')
  const [selectedMetric, setSelectedMetric] = useState('views')

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  const getCurrentMonthData = () => {
    return analyticsData.monthlyStats[analyticsData.monthlyStats.length - 1]
  }

  const getPreviousMonthData = () => {
    return analyticsData.monthlyStats[analyticsData.monthlyStats.length - 2]
  }

  const currentMonth = getCurrentMonthData()
  const previousMonth = getPreviousMonthData()

  const viewsGrowth = getGrowthRate(currentMonth.views, previousMonth.views)
  const applicationsGrowth = getGrowthRate(currentMonth.applications, previousMonth.applications)
  const likesGrowth = getGrowthRate(currentMonth.likes, previousMonth.likes)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fade-in-delay">
              Track your performance and insights
            </p>
            
            {/* Time Range Selector */}
            <div className="max-w-md mx-auto animate-fade-in-delay-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none transition-all duration-200"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Views */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <EyeIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {viewsGrowth >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                viewsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(viewsGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Total Likes */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalLikes.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <HeartIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {likesGrowth >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                likesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(likesGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalApplications.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BriefcaseIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {applicationsGrowth >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                applicationsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(applicationsGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Profile Views */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.profileViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserGroupIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
            <div className="space-y-4">
              {analyticsData.monthlyStats.slice(-6).map((stat, index) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-12">{stat.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(stat.views / Math.max(...analyticsData.monthlyStats.map(s => s.views))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-16 text-right">{stat.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Jobs</h3>
            <div className="space-y-4">
              {analyticsData.topJobs.slice(0, 5).map((job, index) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{job.views} views</p>
                    <p className="text-xs text-gray-500">{job.applications} applications</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
              Location Performance
            </h3>
            <div className="space-y-3">
              {analyticsData.locationStats.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1">{location.location}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{location.views}</p>
                    <p className="text-xs text-gray-500">{location.applications} apps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary-600" />
              Salary Distribution
            </h3>
            <div className="space-y-3">
              {analyticsData.salaryStats.map((salary, index) => (
                <div key={salary.range} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{salary.range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${salary.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{salary.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Performance */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
              Company Performance
            </h3>
            <div className="space-y-3">
              {analyticsData.topCompanies.map((company, index) => (
                <div key={company.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">{company.name}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{company.views}</p>
                    <p className="text-xs text-gray-500">{company.applications} apps</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all duration-200">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Export Report
            </button>
            <button className="flex items-center justify-center p-4 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-all duration-200">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Schedule Report
            </button>
            <button className="flex items-center justify-center p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <ClockIcon className="w-5 h-5 mr-2" />
              Set Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
