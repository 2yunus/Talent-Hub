import { apiService } from './api'
import { API_CONFIG } from '../config/api'

// Application types based on backend schema
export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  applicantId: string
  applicant: string
  applicantEmail: string
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'
  appliedDate: string
  appliedAt?: string // Backend uses appliedAt
  location: string
  experience: string
  skills: string[]
  coverLetter: string
  resume: string
  employerId: string
  // Backend nested job object
  job?: {
    id: string
    title: string
    companyName: string
    location: string
    type: string
    experience: string
    isRemote: boolean
    postedBy: {
      firstName: string
      lastName: string
    }
  }
}

export interface CreateApplicationData {
  jobId: string
  coverLetter: string
  resume?: File
}

export interface UpdateApplicationStatusData {
  status: Application['status']
}

export interface ApplicationFilters {
  status?: string
  search?: string
  page?: number
  limit?: number
}

// Applications Service
export class ApplicationsService {
  // Get all applications with optional filters
  async getApplications(filters: ApplicationFilters = {}): Promise<{
    applications: Application[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const queryParams = new URLSearchParams()
    
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.search) queryParams.append('search', filters.search)
    if (filters.page) queryParams.append('page', filters.page.toString())
    if (filters.limit) queryParams.append('limit', filters.limit.toString())
    
    const endpoint = `${API_CONFIG.ENDPOINTS.APPLICATIONS.LIST}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get a single application by ID
  async getApplication(id: string): Promise<Application> {
    return apiService.get(API_CONFIG.ENDPOINTS.APPLICATIONS.GET(id))
  }

  // Create a new application (for developers)
  async createApplication(applicationData: CreateApplicationData): Promise<Application> {
    return apiService.post(API_CONFIG.ENDPOINTS.APPLICATIONS.CREATE, applicationData)
  }

  // Update application status (for employers)
  async updateApplicationStatus(id: string, statusData: UpdateApplicationStatusData): Promise<Application> {
    return apiService.patch(API_CONFIG.ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), statusData)
  }

  // Delete an application
  async deleteApplication(id: string): Promise<void> {
    return apiService.delete(API_CONFIG.ENDPOINTS.APPLICATIONS.DELETE(id))
  }

  // Get applications for a specific job (for employers)
  async getJobApplications(jobId: string): Promise<Application[]> {
    const url = `${API_CONFIG.ENDPOINTS.APPLICATIONS.JOB}?jobId=${encodeURIComponent(jobId)}`
    return apiService.get(url)
  }

  // Get applications submitted by the current user (for developers)
  async getUserApplications(): Promise<Application[]> {
    const endpoint = `${API_CONFIG.ENDPOINTS.APPLICATIONS.LIST}/my`
    console.log('Fetching user applications from:', endpoint)
    
    try {
      const response = await apiService.get(endpoint)
      console.log('User applications response:', response)
      console.log('Response type:', typeof response)
      console.log('Is array?', Array.isArray(response))
      
      let applications: any[] = []
      
      if (Array.isArray(response)) {
        applications = response
      } else if (response && typeof response === 'object' && 'applications' in response) {
        applications = (response as any).applications
      } else {
        console.warn('Unexpected response format for user applications:', response)
        return []
      }
      
      // Extract job information from nested job objects
      const applicationsWithJobInfo = applications.map((app: any) => {
        console.log('Processing developer application:', app)
        
        // Extract job information from nested job object if it exists
        let jobTitle = 'Unknown Job'
        let company = 'Unknown Company'
        let location = 'Unknown Location'
        let experience = 'Unknown'
        let isRemote = false
        let type = 'Unknown'
        
        if (app.job && app.job.title) {
          jobTitle = app.job.title
          company = app.job.companyName
          location = app.job.location
          experience = app.job.experience
          isRemote = app.job.isRemote
          type = app.job.type
        }
        
        return {
          ...app,
          jobTitle: jobTitle,
          company: company,
          location: location,
          experience: experience,
          isRemote: isRemote,
          type: type
        }
      })
      
      console.log('Developer applications with job info:', applicationsWithJobInfo)
      return applicationsWithJobInfo
      
    } catch (error) {
      console.error('Failed to fetch user applications:', error)
      throw error
    }
  }

  // Get applications received by the current employer
  async getEmployerApplications(): Promise<Application[]> {
    try {
      // Single call: when jobId is omitted, backend returns all applications for employer's jobs
      const response = await apiService.get<any>(`${API_CONFIG.ENDPOINTS.APPLICATIONS.JOB}`)
      console.log('Employer applications (raw):', response)
      const applications = Array.isArray(response)
        ? response
        : (response && response.applications && Array.isArray(response.applications))
          ? response.applications
          : []

      // Normalize job info onto root for UI convenience
      const normalized = applications.map((app: any) => {
        const job = app.job || {}
        return {
          ...app,
          jobTitle: app.jobTitle || job.title || 'Unknown Job',
          company: app.company || job.companyName || 'Unknown Company',
          location: app.location || job.location,
          experience: app.experience || job.experience,
          isRemote: app.isRemote ?? job.isRemote
        }
      })

      return normalized
    } catch (error) {
      console.error('Failed to fetch employer applications:', error)
      return []
    }
  }
}

// Export singleton instance
export const applicationsService = new ApplicationsService()
