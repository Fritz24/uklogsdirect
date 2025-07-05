import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut, isAdmin, loading, profileLoading } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
      setUserMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">LSP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Logs Supply Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.href ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu (Desktop only) */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.email}
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUserMenuOpen(false)
                        setIsOpen(false) // Close mobile menu too if open
                      }}
                    >
                      My Account
                    </Link>
                    {!loading && !profileLoading && isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setUserMenuOpen(false)
                          setIsOpen(false) // Close mobile menu too if open
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2"> {/* Hidden on mobile */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t pb-3"> {/* Added pb-3 for consistent padding */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md transition-colors ${location.pathname === item.href ? 'bg-gray-100 text-green-600 font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile-specific Auth Links */}
            {user ? (
              <>
                <Link
                  to="/account"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
                {!loading && !profileLoading && isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-green-600 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-green-600 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}