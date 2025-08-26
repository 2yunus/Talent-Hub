import { useAuth } from '../contexts/AuthContext'

export function useRole() {
  const { user } = useAuth()
  
  const isDeveloper = user?.role === 'DEVELOPER'
  const isEmployer = user?.role === 'EMPLOYER'
  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = !!user
  
  return {
    isDeveloper,
    isEmployer,
    isAdmin,
    isAuthenticated,
    user
  }
}
