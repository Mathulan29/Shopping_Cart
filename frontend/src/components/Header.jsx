import React, { useState, useEffect } from 'react'
import { ShoppingCart, LogOut, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

export const Header = ({
  onCartClick,
  onAuthClick,
  onNavigate,
  onProfileClick,
  isAuthenticated,
}) => {
  const { itemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) setUserEmail(user.email || '')
    }

    getUser()
  }, [isAuthenticated])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail('')
    setIsMobileMenuOpen(false)
  }

  const handleNavigate = (page) => {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="w-full bg-orange-500 text-white shadow-lg sticky top-0 z-40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 hover:bg-orange-600 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="text-3xl font-bold">🛒</div>
              <div>
                <h1 className="text-2xl font-bold">Fresh Cart</h1>
                <p className="text-orange-100 text-sm hidden sm:block">
                  Fresh Groceries at Your Door
                </p>
              </div>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-orange-100 transition-colors font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="hover:text-orange-100 transition-colors font-semibold"
            >
              Products
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && userEmail && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User size={16} />
                <span className="text-orange-100">
                  {userEmail.split('@')[0]}
                </span>
              </div>
            )}

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-orange-600 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                <User size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-orange-400 pt-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigate('home')}
                className="text-left py-2 px-4 hover:bg-orange-600 rounded-lg transition-colors font-semibold"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('products')}
                className="text-left py-2 px-4 hover:bg-orange-600 rounded-lg transition-colors font-semibold"
              >
                Products
              </button>
            </nav>

            <div className="border-t border-orange-400 pt-4 px-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <User size={16} />
                    <span className="text-orange-100">
                      {userEmail}
                    </span>
                  </div>
                  <button
                    onClick={onProfileClick}
                    className="w-full flex items-center gap-2 py-2 hover:bg-orange-600 rounded-lg transition-colors text-left"
                  >
                    <User size={18} />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-2 hover:bg-orange-600 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  <User size={18} />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
