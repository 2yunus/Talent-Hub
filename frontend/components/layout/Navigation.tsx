'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BellIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <BriefcaseIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              TalentHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="nav-link group">
              <BriefcaseIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Jobs
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <BellIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                    <UserCircleIcon className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:block font-medium">{user.firstName}</span>
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:block px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg slide-in-down">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link 
                href="/jobs" 
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-3" />
                  Jobs
                </div>
              </Link>


            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link 
                  href="/login" 
                  className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full text-center px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile User Actions */}
            {user && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
