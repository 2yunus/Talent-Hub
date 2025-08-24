import { useAuth } from '../contexts/AuthContext'

export function useRole() {
  const { user } = useAuth()
  
  const isDeveloper = user?.role === 'DEVELOPER'
  const isEmployer = user?.role === 'EMPLOYER'
  const isAuthenticated = !!user
  
  return {
    isDeveloper,
    isEmployer,
    isAuthenticated,
    user
  }
}
