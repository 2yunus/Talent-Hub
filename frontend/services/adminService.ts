import { apiService } from './api'
import { API_CONFIG } from '../config/api'

export interface AdminStats {
  users: number
  jobs: number
  applications: number
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    return apiService.get(`${API_CONFIG.ENDPOINTS ? '/api/admin/stats' : '/api/admin/stats'}`)
  }

  // Get all users
  async listUsers(): Promise<{ users: any[] }> {
    return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.USERS)
  }

  async updateUserRole(id: string, role: 'ADMIN' | 'EMPLOYER' | 'DEVELOPER'): Promise<any> {
    return apiService.patch(`/api/admin/users/${id}/role`, { role })
  }

  // Get all jobs
  async listJobs(): Promise<{ jobs: any[] }> {
    return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.JOBS)
  }

  async moderateJob(id: string, isActive: boolean): Promise<any> {
    return apiService.patch(`/api/admin/jobs/${id}/moderate`, { isActive })
  }

  // Get all applications
  async listApplications(): Promise<{ applications: any[] }> {
    return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.APPLICATIONS)
  }

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${userId}`)
  }

  // Delete a job
  async deleteJob(jobId: string): Promise<void> {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.ADMIN.JOBS}/${jobId}`)
  }
}

export const adminService = new AdminService()


