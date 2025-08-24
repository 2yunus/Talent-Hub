'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface JobFormData {
  title: string
  company: string
  location: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE'
  experience: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER'
  salary: {
    min: string
    max: string
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  applicationDeadline: string
}

export default function PostJobPage() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: user?.companyName || '',
    location: '',
    type: 'FULL_TIME',
    experience: 'ENTRY',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    description: '',
    requirements: [''],
    benefits: [''],
    skills: [''],
    applicationDeadline: ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (field: keyof JobFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSalaryChange = (field: 'min' | 'max' | 'currency', value: string) => {
    setFormData(prev => ({
      ...prev,
      salary: { ...prev.salary, [field]: value }
    }))
  }

  const handleArrayChange = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }))
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: string, i: number) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to the backend
    console.log('Job data:', formData)
  }

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'FREELANCE', label: 'Freelance' }
  ]

  const experienceLevels = [
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'LEAD', label: 'Lead' },
    { value: 'MANAGER', label: 'Manager' }
  ]

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post a New Job</h1>
            <p className="text-xl text-gray-600">Create an attractive job listing to find the perfect candidate</p>
          </div>
        </div>

        {/* Form */}
        <div className={`transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BriefcaseIcon className="w-6 h-6 mr-3 text-primary-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group md:col-span-2">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="input"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                    className="input"
                    placeholder="Company name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <div className="input-group">
                    <MapPinIcon className="input-icon" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                      className="input pl-10"
                      placeholder="City, State or Remote"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                    className="input"
                  >
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    required
                    className="input"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-3 text-primary-600" />
                Salary & Benefits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">Minimum Salary</label>
                  <input
                    type="number"
                    value={formData.salary.min}
                    onChange={(e) => handleSalaryChange('min', e.target.value)}
                    className="input"
                    placeholder="50000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Maximum Salary</label>
                  <input
                    type="number"
                    value={formData.salary.max}
                    onChange={(e) => handleSalaryChange('max', e.target.value)}
                    className="input"
                    placeholder="80000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    value={formData.salary.currency}
                    onChange={(e) => handleSalaryChange('currency', e.target.value)}
                    className="input"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6">
                <label className="form-label">Benefits</label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      className="input flex-1"
                      placeholder="e.g., Health insurance, 401k, Flexible hours"
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('benefits', index)}
                        className="btn-outline p-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Benefit
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <AcademicCapIcon className="w-6 h-6 mr-3 text-primary-600" />
                Job Description & Requirements
              </h2>
              
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Job Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows={6}
                    className="input"
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="form-label">Requirements</label>
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        className="input flex-1"
                        placeholder="e.g., 3+ years of React experience"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="btn-outline p-2"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="btn-outline text-sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Requirement
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <label className="form-label">Required Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                        className="input flex-1"
                        placeholder="e.g., JavaScript, React, Node.js"
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="btn-outline p-2"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="btn-outline text-sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BuildingOfficeIcon className="w-6 h-6 mr-3 text-primary-600" />
                Additional Details
              </h2>
              
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn-primary btn-xl"
              >
                <BriefcaseIcon className="w-6 h-6 mr-3" />
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
