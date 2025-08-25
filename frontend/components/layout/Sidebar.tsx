'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { 
  HomeIcon,
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, requiresAuth: true },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon, requiresAuth: false },
    { name: 'Applications', href: '/applications', icon: EnvelopeIcon, requiresAuth: true },
    { name: 'Profile', href: '/profile', icon: UserIcon, requiresAuth: true },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <div className="flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          // Skip navigation items that require authentication if user is not logged in
          if (item.requiresAuth && !user) {
            return null
          }
          
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link group ${
                active ? 'sidebar-link-active' : ''
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className={`sidebar-icon ${isCollapsed ? 'mr-0' : ''}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
              
              {/* Active indicator */}
              {active && !isCollapsed && (
                <div className="absolute right-0 w-1 h-8 bg-primary-500 rounded-l-full"></div>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      {user && !isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Profile */}
      {user && isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
          </div>
        </div>
      )}
    </div>
  )
}
