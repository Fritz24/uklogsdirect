import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (error: any) {
      if (error.message && error.message.includes('Email not confirmed')) {
        setError('Please confirm your email address to log in. Check your inbox for a verification link.')
      } else {
        setError(error.message || 'An error occurred during login. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">UL</span>
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
          RETURNING CUSTOMER
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Email Address */}
            <div className="flex items-center space-x-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Email Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-1 w-2/3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center space-x-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-1 w-2/3 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500 text-sm">
                Forgotten Password?
              </Link>
            </div>
          </form>

          {/* Original Demo Accounts Section - Removed or relocated if not needed */}
          {/*
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setEmail('admin@uklogsdirect.co.uk')
                  setPassword('admin123')
                }}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <strong>Admin:</strong> admin@uklogsdirect.co.uk / admin123
              </button>
              <button
                onClick={() => {
                  setEmail('user@example.com')
                  setPassword('user123')
                }}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <strong>User:</strong> user@example.com / user123
              </button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  )
}