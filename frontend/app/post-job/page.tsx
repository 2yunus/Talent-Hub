'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { jobsService } from '../../services/jobsService'
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
  companyName: string
  location: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  experience: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD'
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  responsibilities: string[] // Backend requires this field
  benefits: string[]
  skills: string[]
  isRemote: boolean
  applicationDeadline: string
}

export default function PostJobPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    companyName: user?.companyName || '',
    location: '',
    type: 'FULL_TIME',
    experience: 'MID',
    salary: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    description: '',
    requirements: [''],
    responsibilities: [''], // Backend requires this field
    benefits: [''],
    skills: [''],
    isRemote: false,
    applicationDeadline: ''
  })

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!user) {
      router.push('/login')
      return
    }
    
    // Only employers can post jobs
    if (user && user.role !== 'EMPLOYER') {
      router.push('/dashboard')
      return
    }
    
    setIsVisible(true)
  }, [user, router])

  const handleInputChange = (field: keyof JobFormData, value: string | number | boolean) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (!user) {
      alert('Please log in to post a job')
      router.push('/login')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Validate required fields
      if (!formData.title || !formData.companyName || !formData.location || !formData.description) {
        alert('Please fill in all required fields')
        return
      }
      
      // Validate that requirements and responsibilities have at least one non-empty item
      const validRequirements = formData.requirements.filter(req => req.trim() !== '')
      const validResponsibilities = formData.responsibilities.filter(resp => resp.trim() !== '')
      const validSkills = formData.skills.filter(skill => skill.trim() !== '')
      
      if (validRequirements.length === 0) {
        alert('Please add at least one requirement')
        return
      }
      
      if (validResponsibilities.length === 0) {
        alert('Please add at least one responsibility')
        return
      }
      
      if (validSkills.length === 0) {
        alert('Please add at least one skill')
        return
      }
      
      // Validate salary - both min and max must be positive numbers
      if (formData.salary.min <= 0 || formData.salary.max <= 0) {
        alert('Please enter valid salary amounts (both minimum and maximum must be greater than 0)')
        return
      }
      
      if (formData.salary.min > formData.salary.max) {
        alert('Minimum salary cannot be greater than maximum salary')
        return
      }
      
      // Clean up empty array items and ensure they meet backend requirements
      const cleanedFormData = {
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        location: formData.location.trim(),
        type: formData.type,
        experience: formData.experience,
        salary: {
          min: Number(formData.salary.min),
          max: Number(formData.salary.max),
          currency: formData.salary.currency
        },
        description: formData.description.trim(),
        requirements: validRequirements,
        responsibilities: validResponsibilities,
        benefits: formData.benefits.filter(benefit => benefit.trim() !== ''),
        skills: validSkills,
        isRemote: formData.isRemote
        // Note: applicationDeadline is not in the backend schema, so we're not sending it
      }
      
      // Log the exact data being sent to help debug
      console.log('Cleaned form data being sent to backend:', cleanedFormData)
      
      // Validate data structure before sending
      const validationChecks = [
        { field: 'title', value: cleanedFormData.title, minLength: 5, maxLength: 100 },
        { field: 'description', value: cleanedFormData.description, minLength: 20, maxLength: 2000 },
        { field: 'companyName', value: cleanedFormData.companyName, minLength: 2, maxLength: 100 },
        { field: 'location', value: cleanedFormData.location, maxLength: 100 },
        { field: 'requirements', value: cleanedFormData.requirements, minItems: 1, maxItems: 20 },
        { field: 'responsibilities', value: cleanedFormData.responsibilities, minItems: 1, maxItems: 20 },
        { field: 'skills', value: cleanedFormData.skills, minItems: 1, maxItems: 20 },
        { field: 'salary.min', value: cleanedFormData.salary.min, minValue: 0 },
        { field: 'salary.max', value: cleanedFormData.salary.max, minValue: 0 }
      ]
      
      for (const check of validationChecks) {
        if (check.minLength && check.value.length < check.minLength) {
          alert(`Validation error: ${check.field} must be at least ${check.minLength} characters`)
          return
        }
        if (check.maxLength && check.value.length > check.maxLength) {
          alert(`Validation error: ${check.field} must be no more than ${check.maxLength} characters`)
          return
        }
        if (check.minItems && check.value.length < check.minItems) {
          alert(`Validation error: ${check.field} must have at least ${check.minItems} items`)
          return
        }
        if (check.maxItems && check.value.length > check.maxItems) {
          alert(`Validation error: ${check.field} must have no more than ${check.maxItems} items`)
          return
        }
        if (check.minValue !== undefined && check.value < check.minValue) {
          alert(`Validation error: ${check.field} must be at least ${check.minValue}`)
          return
        }
      }
      
      console.log('Data validation passed, submitting to backend...')
      
      // Submit to the backend using jobsService
      const response = await jobsService.createJob(cleanedFormData)
      console.log('Job created successfully:', response)
      
      setSubmitSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          companyName: user?.companyName || '',
          location: '',
          type: 'FULL_TIME',
          experience: 'MID',
          salary: { min: 0, max: 0, currency: 'USD' },
          description: '',
          requirements: [''],
          responsibilities: [''], // Backend requires this field
          benefits: [''],
          skills: [''],
          isRemote: false,
          applicationDeadline: ''
        })
        setSubmitSuccess(false)
      }, 3000)
      
         } catch (error) {
       console.error('Failed to submit job:', error)
       
       // Show more detailed error information
       if (error instanceof Error) {
         console.error('Error details:', error.message)
         if (error.message.includes('Validation error')) {
           console.error('This is a backend validation issue. Check the console for more details.')
           
           // Check if error has a 'data' property with validation details
           if ((error as any).data) {
             console.error('Validation details:', (error as any).data)
             
             // If there are specific validation error details, show them to the user
             if ((error as any).data.details && Array.isArray((error as any).data.details)) {
               const errorMessages = (error as any).data.details.join('\n')
               alert(`Validation errors:\n${errorMessages}`)
               return
             }
           }
         }
       }
       
       alert('Failed to submit job. Please check the console for details and try again.')
     } finally {
      setIsSubmitting(false)
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Post a New Job</h1>
              <p className="text-xl text-gray-600">Create an attractive job listing to find the perfect candidate</p>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn-outline"
              >
                {showPreview ? 'Hide Preview' : 'Preview Job'}
              </button>
            </div>
          </div>
        </div>

        {/* Job Preview */}
        {showPreview && (
          <div className={`mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Preview</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {formData.companyName.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {formData.title || 'Job Title'}
                    </h3>
                    <p className="text-lg text-gray-600 mb-3">
                      {formData.companyName || 'Company Name'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{formData.location || 'Location'}</span>
                        {formData.isRemote && <span className="text-primary-600 font-medium">• Remote</span>}
                      </div>
                      <div className="flex items-center space-x-1">
                        <BriefcaseIcon className="w-4 h-4" />
                        <span className="capitalize">{(formData.type || 'FULL_TIME').replace('_', ' ').toLowerCase()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formData.experience || 'Experience'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                        {formData.experience || 'Experience'}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {formData.type?.replace('_', ' ') || 'Type'}
                      </span>
                    </div>
                    {formData.skills && formData.skills.length > 0 && formData.skills[0] && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.filter(skill => skill.trim() !== '').slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                                         <p className="text-gray-600 line-clamp-3">
                       {formData.description || 'Job description will appear here...'}
                     </p>
                     
                     {formData.responsibilities && formData.responsibilities.length > 0 && formData.responsibilities[0] && (
                       <div className="mt-3">
                         <p className="text-sm font-medium text-gray-700 mb-2">Key Responsibilities:</p>
                         <div className="flex flex-wrap gap-2">
                           {formData.responsibilities.filter(resp => resp.trim() !== '').slice(0, 3).map((resp, index) => (
                             <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                               {resp}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                    <div className="mt-4 text-lg font-semibold text-gray-900">
                      {formData.salary.min > 0 && formData.salary.max > 0 
                        ? `$${formData.salary.min.toLocaleString()} - $${formData.salary.max.toLocaleString()} per year`
                        : 'Salary not specified'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
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
                 
                 <div className="form-group">
                   <label className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       checked={formData.isRemote}
                       onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                       className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                     />
                     <span className="text-sm font-medium text-gray-700">Remote work available</span>
                   </label>
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

                 {/* Responsibilities */}
                 <div>
                   <label className="form-label">Responsibilities</label>
                   {formData.responsibilities.map((responsibility, index) => (
                     <div key={index} className="flex items-center space-x-2 mb-3">
                       <input
                         type="text"
                         value={responsibility}
                         onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                         className="input flex-1"
                         placeholder="e.g., Develop new features, Code review, Mentor junior developers"
                       />
                       {formData.responsibilities.length > 1 && (
                         <button
                           type="button"
                           onClick={() => removeArrayItem('responsibilities', index)}
                           className="btn-outline p-2"
                         >
                           <XMarkIcon className="w-4 h-4" />
                         </button>
                       )}
                     </div>
                   ))}
                   <button
                     type="button"
                     onClick={() => addArrayItem('responsibilities')}
                     className="btn-outline text-sm"
                   >
                     <PlusIcon className="w-4 h-4 mr-2" />
                     Add Responsibility
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
               {submitSuccess ? (
                 <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-semibold text-green-800 mb-2">Job Posted Successfully!</h3>
                   <p className="text-green-600">Your job listing has been published and is now visible to candidates.</p>
                 </div>
               ) : (
                 <button
                   type="submit"
                   className="btn-primary btn-xl"
                   disabled={isSubmitting}
                 >
                   {isSubmitting ? (
                     <>
                       <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full mr-3"></div>
                       Posting Job...
                     </>
                   ) : (
                     <>
                       <BriefcaseIcon className="w-6 h-6 mr-3" />
                       Post Job
                     </>
                   )}
                 </button>
               )}
             </div>
          </form>
        </div>
      </div>
    </div>
  )
}
