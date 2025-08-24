'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <ExclamationTriangleIcon className="w-12 h-12 text-white" />
        </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/"
              className="btn-primary btn-lg w-full group"
            >
              <HomeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="btn-outline btn-lg w-full group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
