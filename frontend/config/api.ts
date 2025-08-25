// API Configuration
export const API_CONFIG = {
  // Backend base URL - can be overridden via environment variable
  BASE_URL: typeof window !== 'undefined' 
    ? (window as any).__API_BASE_URL || 'http://localhost:5000'
    : 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      LOGOUT: '/api/auth/logout',
    },
    
    // Jobs
    JOBS: {
      LIST: '/api/jobs',
      CREATE: '/api/jobs',
      GET: (id: string) => `/api/jobs/${id}`,
      UPDATE: (id: string) => `/api/jobs/${id}`,
      DELETE: (id: string) => `/api/jobs/${id}`,
      APPLY: (id: string) => `/api/jobs/${id}/apply`,
    },
    
    // Applications
    APPLICATIONS: {
      LIST: '/api/applications',
      CREATE: '/api/applications',
      GET: (id: string) => `/api/applications/${id}`,
      UPDATE: (id: string) => `/api/applications/${id}`,
      DELETE: (id: string) => `/api/applications/${id}`,
      UPDATE_STATUS: (id: string) => `/api/applications/${id}/status`,
      JOB: '/api/applications/job',
    },
    
    // Users
    USERS: {
      PROFILE: '/api/users/profile',
      UPDATE: '/api/users/profile',
      UPLOAD_AVATAR: '/api/users/avatar',
    },
    
    // Uploads
    UPLOADS: {
      RESUME: '/api/uploads/resume',
      COMPANY_LOGO: '/api/uploads/company-logo',
    },
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
}

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
