'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'
import { API_CONFIG } from '../config/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'DEVELOPER' | 'EMPLOYER'
  bio?: string
  location?: string
  skills?: string[]
  experience?: string
  education?: string
  website?: string
  github?: string
  linkedin?: string
  avatar?: string
  phone?: string
  isProfilePublic?: boolean
  companyName?: string
  companyDescription?: string
  companyWebsite?: string
  companySize?: string
  companyIndustry?: string
  companyLocation?: string
  companyLogo?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        // Verify token with backend
        const userData = await apiService.get<{ user: User }>(API_CONFIG.ENDPOINTS.AUTH.PROFILE)
        setUser(userData.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await apiService.post<{ token: string; user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN, 
        { email, password }
      )
      
      // Store token and set user
      localStorage.setItem('authToken', data.token)
      setUser(data.user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await apiService.post<{ token: string; user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER, 
        userData
      )
      
      // Store token and set user
      localStorage.setItem('authToken', data.token)
      setUser(data.user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
