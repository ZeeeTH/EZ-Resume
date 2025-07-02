'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase-client'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  Plus, 
  Search, 
  Star, 
  Filter,
  Edit,
  Download,
  Trash2,
  Eye,
  Calendar,
  Briefcase,
  MoreVertical,
  FileText
} from 'lucide-react'

interface Resume {
  id: string
  title: string
  industry?: string
  template_id: string
  job_title?: string
  content: any
  is_favorite: boolean
  created_at: string
  updated_at: string
}

const ResumesPage = () => {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'recent'>('all')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated')

  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user, filterType, sortBy])

  const fetchResumes = async () => {
    try {
      let query = supabase
        .from('resumes')
        .select('*')

      // Apply filters
      if (filterType === 'favorites') {
        query = query.eq('is_favorite', true)
      } else if (filterType === 'recent') {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        query = query.gte('created_at', oneWeekAgo.toISOString())
      }

      // Apply sorting
      if (sortBy === 'updated') {
        query = query.order('updated_at', { ascending: false })
      } else if (sortBy === 'created') {
        query = query.order('created_at', { ascending: false })
      } else {
        query = query.order('title', { ascending: true })
      }

      const { data, error } = await query

      if (error) throw error
      setResumes(data || [])
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (resumeId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ is_favorite: !currentFavorite })
        .eq('id', resumeId)

      if (error) throw error
      
      setResumes(resumes.map(resume => 
        resume.id === resumeId 
          ? { ...resume, is_favorite: !currentFavorite }
          : resume
      ))
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  const deleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)

      if (error) throw error
      
      setResumes(resumes.filter(resume => resume.id !== resumeId))
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  const downloadResume = async (resume: Resume) => {
    // This would trigger a PDF download
    // For now, we'll just show an alert
    alert(`Downloading ${resume.title}...`)
    // TODO: Implement PDF download functionality
  }

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTemplateDisplayName = (templateId: string) => {
    const templateNames: Record<string, string> = {
      'classic': 'Classic',
      'modern': 'Modern',
      'structured': 'Structured',
      'tech-modern': 'Tech Modern',
      'developer-pro': 'Developer Pro',
      'medical-professional': 'Medical Professional',
      'healthcare-modern': 'Healthcare Modern',
      'finance-classic': 'Finance Classic',
      'investment-pro': 'Investment Pro'
    }
    return templateNames[templateId] || templateId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Resumes</h1>
          <p className="text-gray-400 mt-1">
            Manage and edit your professional resumes
          </p>
        </div>
        
        <Link
          href="/resume-builder"
          className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Resume
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes by title, industry, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter Options */}
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Resumes</option>
              <option value="favorites">Favorites</option>
              <option value="recent">Recent (7 days)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
          <span>{resumes.length} total resumes</span>
          <span>{resumes.filter(r => r.is_favorite).length} favorites</span>
          <span>{filteredResumes.length} shown</span>
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center">
          <div className="w-24 h-24 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No matching resumes found' : 'No resumes yet'}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
              : 'Create your first professional resume to get started on your job search journey.'
            }
          </p>
          {!searchTerm && (
            <Link
              href="/resume-builder"
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Resume
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div 
              key={resume.id}
              className="group bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-200"
            >
              {/* Resume Preview */}
              <div className="aspect-[3/4] bg-white/5 flex items-center justify-center relative overflow-hidden">
                {/* Placeholder preview */}
                <div className="w-3/4 h-5/6 bg-white/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                
                {/* Favorite Badge */}
                <button
                  onClick={() => toggleFavorite(resume.id, resume.is_favorite)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                    resume.is_favorite 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-white/10 text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  <Star className={`h-4 w-4 ${resume.is_favorite ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/resume-builder?edit=${resume.id}`}
                    className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                    title="Edit Resume"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  
                  <button
                    onClick={() => downloadResume(resume)}
                    className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  
                  <Link
                    href={`/dashboard/resumes/${resume.id}`}
                    className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Resume Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
                    {resume.title}
                  </h3>
                  
                  <div className="relative group/menu">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-8 w-48 bg-slate-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-20">
                      <div className="py-2">
                        <Link
                          href={`/resume-builder?edit=${resume.id}`}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Resume</span>
                        </Link>
                        
                        <button
                          onClick={() => downloadResume(resume)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </button>
                        
                        <button
                          onClick={() => toggleFavorite(resume.id, resume.is_favorite)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Star className="h-4 w-4" />
                          <span>{resume.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                        </button>
                        
                        <hr className="border-white/10 my-2" />
                        
                        <button
                          onClick={() => deleteResume(resume.id)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Resume</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  {resume.job_title && (
                    <div className="flex items-center text-sm text-gray-400">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{resume.job_title}</span>
                    </div>
                  )}
                  
                  {resume.industry && (
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      <span>{resume.industry}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Template Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                    {getTemplateDisplayName(resume.template_id)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/resume-builder?edit=${resume.id}`}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResumesPage 