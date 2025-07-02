'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Bell, Search } from 'lucide-react'

const DashboardHeader = () => {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname) return [{ label: 'Dashboard', href: '/dashboard' }]
    
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    // Add dashboard root
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' })

    // Add additional segments
    if (segments.length > 1) {
      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i]
        const href = `/${segments.slice(0, i + 1).join('/')}`
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
        breadcrumbs.push({ label, href })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  const getPageTitle = () => {
    if (!pathname) return 'Dashboard'
    
    switch (pathname) {
      case '/dashboard':
        return 'Overview'
      case '/dashboard/resumes':
        return 'My Resumes'
      case '/dashboard/cover-letters':
        return 'Cover Letters'
      case '/dashboard/settings':
        return 'Settings'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{getPageTitle()}</h1>
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <Link
                  href={crumb.href}
                  className={`transition-colors ${
                    index === breadcrumbs.length - 1
                      ? 'text-purple-400 font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right side - Quick Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>

          {/* Quick Create Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link
                  href="/resume-builder"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    📄
                  </div>
                  <div>
                    <p className="font-medium">New Resume</p>
                    <p className="text-xs text-gray-400">Create a new resume</p>
                  </div>
                </Link>
                
                <Link
                  href="/cover-letter-builder"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <p className="font-medium">Cover Letter</p>
                    <p className="text-xs text-gray-400">Write a cover letter</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader 