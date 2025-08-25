import { apiService } from './api'
import { API_CONFIG } from '../config/api'

// Job types based on backend schema
export interface Job {
  id: string
  title: string
  companyName: string // Backend uses companyName, not company
  location: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  experience: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD'
  salary: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  isRemote: boolean
  createdAt: string // Backend uses createdAt, not postedAt
  isActive: boolean
  companyLogo?: string
  description: string
  requirements: string[]
  responsibilities: string[] // Backend provides this field
  benefits: string[]
  postedById: string // Backend uses postedById, not employerId
}

export interface CreateJobData {
  title: string
  companyName: string // Backend uses companyName
  location: string
  type: Job['type']
  experience: Job['experience']
  salary: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  isRemote: boolean
  description: string
  requirements: string[] // Backend expects array
  responsibilities: string[] // Backend requires this field
  benefits: string[]
}

export interface JobFilters {
  search?: string
  location?: string
  type?: string
  experience?: string
  isRemote?: boolean
  page?: number
  limit?: number
}

export interface JobApplicationData {
  coverLetter: string
  resume?: File
}

// Jobs Service
export class JobsService {
  // Get all jobs with optional filters
  async getJobs(filters: JobFilters = {}): Promise<{
    jobs: Job[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const queryParams = new URLSearchParams()
    
    // Backend expects 'query' not 'search'
    if (filters.search) queryParams.append('query', filters.search)
    if (filters.location) queryParams.append('location', filters.location)
    if (filters.type) queryParams.append('type', filters.type)
    if (filters.experience) queryParams.append('experience', filters.experience)
    if (filters.isRemote !== undefined) queryParams.append('isRemote', filters.isRemote.toString())
    if (filters.page) queryParams.append('page', filters.page.toString())
    if (filters.limit) queryParams.append('limit', filters.limit.toString())
    
    const endpoint = `${API_CONFIG.ENDPOINTS.JOBS.LIST}?${queryParams.toString()}`
    console.log('Fetching jobs from:', endpoint)
    
    // No cache-busting for the main jobs endpoint
    return apiService.get(endpoint)
  }

  // Get a single job by ID
  async getJob(id: string): Promise<Job> {
    return apiService.get(API_CONFIG.ENDPOINTS.JOBS.GET(id))
  }

  // Create a new job (for employers)
  async createJob(jobData: CreateJobData): Promise<Job> {
    return apiService.post(API_CONFIG.ENDPOINTS.JOBS.CREATE, jobData)
  }

  // Update an existing job (for employers)
  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    return apiService.put(API_CONFIG.ENDPOINTS.JOBS.UPDATE(id), jobData)
  }

  // Delete a job (for employers)
  async deleteJob(id: string): Promise<void> {
    return apiService.delete(API_CONFIG.ENDPOINTS.JOBS.DELETE(id))
  }

  // Apply to a job (for developers)
  async applyToJob(jobId: string, applicationData: JobApplicationData): Promise<any> {
    return apiService.post(API_CONFIG.ENDPOINTS.JOBS.APPLY(jobId), applicationData)
  }

  // Get jobs posted by the current employer
  async getEmployerJobs(): Promise<Job[]> {
    const endpoint = `${API_CONFIG.ENDPOINTS.JOBS.LIST}/my`
    const cacheBuster = `?_t=${Date.now()}`
    const finalEndpoint = endpoint + cacheBuster
    
    console.log('Fetching employer jobs from:', finalEndpoint)
    const response = await apiService.get(finalEndpoint)
    console.log('Raw API response for employer jobs:', response)
    console.log('Response type:', typeof response)
    console.log('Is array?', Array.isArray(response))
    
    // Handle different response formats
    if (Array.isArray(response)) {
      return response
    } else if (response && typeof response === 'object' && 'jobs' in response) {
      return (response as any).jobs
    } else {
      console.warn('Unexpected response format, returning empty array')
      return []
    }
  }

  // Get jobs applied to by the current developer
  async getAppliedJobs(): Promise<Job[]> {
    return apiService.get(`${API_CONFIG.ENDPOINTS.JOBS.LIST}/applied`)
  }
}

// Export singleton instance
export const jobsService = new JobsService()
