'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UsersIcon,
  GlobeAltIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

interface Company {
  id: string
  name: string
  logo: string
  industry: string
  location: string
  size: string
  founded: number
  description: string
  rating: number
  reviewCount: number
  openPositions: number
  isHiring: boolean
  isVerified: boolean
  website: string
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: '/api/placeholder/80/80',
    industry: 'Software Development',
    location: 'San Francisco, CA',
    size: '500-1000 employees',
    founded: 2015,
    description: 'Leading software development company specializing in enterprise solutions and cloud infrastructure.',
    rating: 4.6,
    reviewCount: 128,
    openPositions: 15,
    isHiring: true,
    isVerified: true,
    website: 'https://techcorp.com'
  },
  {
    id: '2',
    name: 'InnovateLabs',
    logo: '/api/placeholder/80/80',
    industry: 'Artificial Intelligence',
    location: 'New York, NY',
    size: '100-500 employees',
    founded: 2018,
    description: 'Cutting-edge AI research and development company focused on machine learning applications.',
    rating: 4.8,
    reviewCount: 89,
    openPositions: 8,
    isHiring: true,
    isVerified: true,
    website: 'https://innovatelabs.ai'
  },
  {
    id: '3',
    name: 'DataFlow Systems',
    logo: '/api/placeholder/80/80',
    industry: 'Data Analytics',
    location: 'Austin, TX',
    size: '50-100 employees',
    founded: 2020,
    description: 'Data analytics platform helping businesses make informed decisions through advanced insights.',
    rating: 4.4,
    reviewCount: 67,
    openPositions: 5,
    isHiring: true,
    isVerified: false,
    website: 'https://dataflow.io'
  },
  {
    id: '4',
    name: 'CloudScale Technologies',
    logo: '/api/placeholder/80/80',
    industry: 'Cloud Computing',
    location: 'Seattle, WA',
    size: '1000+ employees',
    founded: 2012,
    description: 'Enterprise cloud computing solutions provider with global infrastructure and support.',
    rating: 4.7,
    reviewCount: 234,
    openPositions: 22,
    isHiring: true,
    isVerified: true,
    website: 'https://cloudscale.tech'
  },
  {
    id: '5',
    name: 'MobileFirst Apps',
    logo: '/api/placeholder/80/80',
    industry: 'Mobile Development',
    location: 'Boston, MA',
    size: '25-50 employees',
    founded: 2019,
    description: 'Mobile app development studio creating innovative solutions for iOS and Android platforms.',
    rating: 4.3,
    reviewCount: 45,
    openPositions: 3,
    isHiring: false,
    isVerified: false,
    website: 'https://mobilefirst.apps'
  }
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [hiringFilter, setHiringFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const allIndustries = Array.from(new Set(companies.map(c => c.industry)))
  const allSizes = ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees']

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustries = selectedIndustries.length === 0 || 
                             selectedIndustries.includes(company.industry)
    const matchesLocation = !locationFilter || 
                           company.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesSize = sizeFilter === 'all' || company.size === sizeFilter
    const matchesHiring = hiringFilter === 'all' || 
                          (hiringFilter === 'hiring' && company.isHiring) ||
                          (hiringFilter === 'not-hiring' && !company.isHiring)
    
    return matchesSearch && matchesIndustries && matchesLocation && matchesSize && matchesHiring
  })

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'founded':
        return b.founded - a.founded
      case 'openPositions':
        return b.openPositions - a.openPositions
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">
              Discover Top Companies
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fade-in-delay">
              Find your next career opportunity with leading companies
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative animate-fade-in-delay-2">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies by name, industry, or location..."
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
              
              {/* Industry Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Industry</h4>
                <div className="space-y-2">
                  {allIndustries.map(industry => (
                    <label key={industry} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIndustries.includes(industry)}
                        onChange={() => toggleIndustry(industry)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{industry}</span>
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

              {/* Company Size Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Company Size</h4>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">All Sizes</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Hiring Status Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Hiring Status</h4>
                <select
                  value={hiringFilter}
                  onChange={(e) => setHiringFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">All Companies</option>
                  <option value="hiring">Currently Hiring</option>
                  <option value="not-hiring">Not Hiring</option>
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
                  <option value="founded">Newest Founded</option>
                  <option value="openPositions">Most Open Positions</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredCompanies.length} Companies Found
              </h2>
              {selectedIndustries.length > 0 && (
                <p className="text-gray-600 mt-2">
                  Filtered by: {selectedIndustries.join(', ')}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              {sortedCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                        {company.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                            {company.name}
                            {company.isVerified && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600 text-lg">{company.industry}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                            <span className="text-lg font-semibold text-gray-900">{company.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({company.reviewCount})</span>
                          </div>
                          <p className="text-sm text-gray-500">Overall Rating</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {company.location}
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          {company.size}
                        </div>
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                          Founded {company.founded}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{company.description}</p>

                      {/* Open Positions */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <BriefcaseIcon className="w-5 h-5 text-primary-600 mr-2" />
                            <span className="font-medium text-gray-900">{company.openPositions}</span>
                            <span className="text-gray-500 ml-1">open positions</span>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            company.isHiring 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {company.isHiring ? 'Hiring Now' : 'Not Hiring'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                          >
                            <GlobeAltIcon className="w-4 h-4 mr-1" />
                            Visit Website
                          </a>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-all duration-200">
                            <HeartIcon className="w-5 h-5" />
                          </button>
                          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium">
                            View Jobs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedCompanies.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
