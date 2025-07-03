import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { X, Mail, Lock, Loader2, User, CheckCircle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth()

  // Debug logging
  console.log('AuthModal render:', { isOpen, defaultMode, mode });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted in mode:', mode);
    setIsLoading(true)
    setError('')
    setMessage('')

    const { data, error } = mode === 'signin' 
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      console.log('Auth error:', error);
      setError(error.message)
    } else if (data?.user) {
      console.log('Auth success:', data.user.email);
      if (mode === 'signup') {
        setMessage('Account created! Please check your email to verify your account.')
        // Reset form and switch to signin mode after a delay
        setTimeout(() => {
          setMode('signin')
          setMessage('')
          setEmail('')
          setPassword('')
        }, 3000)
      } else {
        onClose()
        setEmail('')
        setPassword('')
      }
    }

    setIsLoading(false)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
    setMessage('')
  }

  const switchMode = () => {
    console.log('Switching mode from', mode, 'to', mode === 'signin' ? 'signup' : 'signin');
    setMode(mode === 'signin' ? 'signup' : 'signin')
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm flex items-center">
                <span className="mr-2">⚠</span>
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {message}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-gray-400">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={switchMode}
            className="mt-3 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            {mode === 'signin' ? 'Create a free account' : 'Sign in to your account'}
          </button>
        </div>

        {mode === 'signup' && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">Free Account Includes:</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• 3 AI-generated bullet points</li>
              <li>• 1 AI-generated professional summary</li>
              <li>• 1 AI-generated skills list</li>
              <li>• Industry-specific optimization</li>
              <li>• All resume templates</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 