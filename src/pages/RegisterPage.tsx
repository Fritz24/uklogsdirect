import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  // New state variables for additional fields
  const [fullName, setFullName] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [telephoneNo, setTelephoneNo] = useState('')
  const [joinNewsletter, setJoinNewsletter] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaValue, setCaptchaValue] = useState('') // State to store the displayed captcha

  useEffect(() => {
    generateCaptcha()
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  // Function to generate a simple captcha
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaValue(result)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    // Basic validations for new fields
    if (!fullName.trim()) {
      setError('Full Name is required.')
      setLoading(false)
      return
    }
    if (!billingAddress.trim()) {
      setError('Billing Address is required.')
      setLoading(false)
      return
    }
    if (!telephoneNo.trim()) {
      setError('Telephone No. is required.')
      setLoading(false)
      return
    }
    if (!acceptTerms) {
      setError('You must accept the Terms & Conditions.')
      setLoading(false)
      return
    }
    if (captchaInput !== captchaValue) {
      setError('Incorrect captcha.')
      generateCaptcha() // Regenerate captcha on failure
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await signUp(email, password)

      if (signUpError) {
        throw signUpError
      }

      // --- Handle additional user profile data here ---
      // If you have a 'profiles' table in Supabase, you would insert data here:
      
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user?.id,
        full_name: fullName,
        billing_address: billingAddress,
        telephone_no: telephoneNo,
        join_newsletter: joinNewsletter,
      });
      if (profileError) throw profileError;
      
      // -------------------------------------------------

      if (!user) {
        setSuccessMessage('Account created successfully! Please check your email to confirm your account and then log in.')
      } else {
        navigate('/')
      }

    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message || 'An error occurred during registration')
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
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          CREATE AN ACCOUNT
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-xl mx-auto">
          Creating an account with us is quick and easy, and will allow you to simply access
          your details when you return to the site. You can add multiple delivery addresses,
          track your order and much more.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-green-800 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Your Full Name */}
            <div className="flex items-center space-x-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Your Full Name
              </label>
              <div className="mt-1 w-2/3 flex items-center">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <span className="ml-2 text-red-500">*</span>
                <HelpCircle className="ml-1 w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center space-x-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Email Address
              </label>
              <div className="mt-1 w-2/3 flex items-center">
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
                <span className="ml-2 text-red-500">*</span>
                <HelpCircle className="ml-1 w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Billing Address */}
            <div className="flex items-start space-x-4">
              <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4 pt-2">
                Billing Address:
              </label>
              <div className="mt-1 w-2/3">
                <input
                  id="billingAddress"
                  name="billingAddress"
                  type="text"
                  placeholder="Start typing your postcode, street or town"
                  required
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Enter Address Manually
                </button>
                <span className="ml-2 text-red-500 absolute right-0 top-0 mt-1 mr-2">*</span>
                <HelpCircle className="ml-1 w-4 h-4 text-gray-400 cursor-pointer absolute right-0 top-0 mt-1 mr-2" />
              </div>
            </div>

            {/* Telephone No. */}
            <div className="flex items-center space-x-4">
              <label htmlFor="telephoneNo" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Telephone No.
              </label>
              <div className="mt-1 w-2/3 flex items-center">
                <input
                  id="telephoneNo"
                  name="telephoneNo"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={telephoneNo}
                  onChange={(e) => setTelephoneNo(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <span className="ml-2 text-red-500">*</span>
                <HelpCircle className="ml-1 w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center space-x-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Password
              </label>
              <div className="mt-1 w-2/3 relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
                <span className="ml-2 text-red-500">*</span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center space-x-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Confirm Password
              </label>
              <div className="mt-1 w-2/3 relative flex items-center">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <span className="ml-2 text-red-500">*</span>
              </div>
            </div>

            {/* Join email newsletter */}
            <div className="flex items-center space-x-4">
              <div className="w-1/3"></div> {/* Empty div to align checkbox */}
              <div className="mt-1 w-2/3 flex items-center">
                <input
                  id="joinNewsletter"
                  name="joinNewsletter"
                  type="checkbox"
                  checked={joinNewsletter}
                  onChange={(e) => setJoinNewsletter(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="joinNewsletter" className="ml-2 block text-sm text-gray-900">
                  Join email newsletter - Be informed of new stock, sales etc.
                </label>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-4">
              <div className="w-1/3"></div>
              <div className="mt-1 w-2/3 flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  I have read and accept the <Link to="/terms" className="font-medium text-green-600 hover:text-green-500">Terms of Delivery</Link> and I accept the <Link to="/terms" className="font-medium text-green-600 hover:text-green-500">Terms & Conditions</Link>
                </label>
                <span className="ml-2 text-red-500">*</span>
              </div>
            </div>

            {/* Captcha */}
            <div className="flex items-center space-x-4">
              <label htmlFor="captchaInput" className="block text-sm font-medium text-gray-700 w-1/3 text-right pr-4">
                Characters
              </label>
              <div className="mt-1 w-2/3">
                <div className="flex items-center mb-2">
                  <img 
                    src={`https://dummyimage.com/120x40/000/fff&text=${captchaValue}`} 
                    alt="Captcha" 
                    className="border border-gray-300 rounded mr-2"
                  />
                  <button 
                    type="button" 
                    onClick={generateCaptcha} 
                    className="text-green-600 text-sm hover:underline"
                  >
                    Reload
                  </button>
                </div>
                <input
                  id="captchaInput"
                  name="captchaInput"
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <span className="ml-2 text-red-500">*</span>
              </div>
            </div>

            {/* Register Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'REGISTER'}
              </button>
            </div>
            <p className="text-right text-xs text-gray-500 mt-2">Required *</p>
          </form>
        </div>
      </div>
    </div>
  )
}