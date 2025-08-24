'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  RocketLaunchIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: BriefcaseIcon,
      title: "Smart Job Matching",
      description: "AI-powered algorithm matches you with perfect opportunities based on skills and preferences.",
      color: "from-primary-600 to-primary-800"
    },
    {
      icon: UserGroupIcon,
      title: "Talent Discovery",
      description: "Find exceptional developers or discover amazing companies to work with.",
      color: "from-secondary-500 to-secondary-700"
    },
    {
      icon: RocketLaunchIcon,
      title: "Career Growth",
      description: "Accelerate your career with personalized recommendations and skill development.",
      color: "from-accent-500 to-accent-700"
    }
  ]

  const stats = [
    { number: "10K+", label: "Active Jobs", icon: BriefcaseIcon },
    { number: "50K+", label: "Developers", icon: UserGroupIcon },
    { number: "5K+", label: "Companies", icon: RocketLaunchIcon },
    { number: "95%", label: "Success Rate", icon: CheckCircleIcon }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer",
      company: "TechCorp",
      content: "TalentHub helped me find my dream job in just 2 weeks. The platform is incredibly intuitive!",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Engineering Manager",
      company: "InnovateLab",
      content: "We've hired 15 amazing developers through TalentHub. The quality of candidates is outstanding.",
      avatar: "MC",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Full-Stack Developer",
      company: "StartupXYZ",
      content: "The job matching algorithm is spot-on. I found opportunities I never knew existed!",
      avatar: "ER",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Next
                <span className="text-gradient block mt-2">Career Move</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Connect with amazing opportunities and talented developers. Whether you're hiring or looking for your next role, 
                <span className="text-primary-600 font-semibold"> TalentHub</span> is your gateway to success.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <Link 
                href="/jobs" 
                className="btn-primary btn-xl group"
              >
                Browse Jobs
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                href="/post-job" 
                className="btn-outline btn-xl group"
              >
                Post a Job
                <SparklesIcon className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-50"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 floating-animation"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 floating-animation" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 floating-animation" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary-400 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-secondary-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-accent-400 rounded-full animate-bounce"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={stat.label}
                  className={`text-center transition-all duration-700 delay-${index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-gradient">TalentHub</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've built the most comprehensive platform for developers and employers to connect seamlessly, 
              with cutting-edge technology and personalized experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={feature.title}
                  className={`text-center transition-all duration-700 delay-${700 + index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group`}>
                    <Icon className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 delay-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Experience the <span className="text-gradient">Future</span> of Hiring
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our platform combines AI-powered matching, seamless communication, and comprehensive analytics 
                to revolutionize how you find opportunities or discover talent.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-success-500 flex-shrink-0" />
                  <span className="text-gray-700">Instant job matching with 95% accuracy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-success-500 flex-shrink-0" />
                  <span className="text-gray-700">Advanced skill assessment and verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-success-500 flex-shrink-0" />
                  <span className="text-gray-700">Real-time communication and collaboration</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/demo" className="btn-primary btn-lg group">
                  <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Watch Demo
                </Link>
              </div>
            </div>
            
            <div className={`relative transition-all duration-700 delay-1200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center">
                        <BriefcaseIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Senior Full-Stack Developer</h3>
                        <p className="text-sm text-gray-600">TechCorp Inc. • San Francisco, CA</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Node.js', 'TypeScript', 'PostgreSQL'].map((skill, index) => (
                          <span 
                            key={skill}
                            className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>💰 $120k - $180k • 🏠 Remote • 📅 Full-time</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex-1 btn-primary">Apply Now</button>
                      <button className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                        <BookmarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 delay-1400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users <span className="text-gradient">Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied developers and companies who have transformed their careers and hiring processes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${1600 + index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-90"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 delay-1800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers and companies already using TalentHub to find their perfect match. 
              Start your journey today and discover endless possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Sign Up Free
              </Link>
              <Link 
                href="/about" 
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 transition-all duration-300 hover:scale-105"
              >
                Learn More
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
