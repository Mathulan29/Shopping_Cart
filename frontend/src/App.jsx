import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Header } from './components/Header'
import { AuthModal } from './components/AuthModal'
import { CartSidebar } from './components/CartSidebar'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Profile } from './pages/Profile'
import { Checkout } from './pages/Checkout'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })

    return () => {
      subscription && subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setIsAuthenticated(!!user)
  }

  const handleAuthSuccess = () => {
    checkAuth()
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    setCurrentPage('home')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onAuthClick={() => setIsAuthModalOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
            isAuthenticated={isAuthenticated}
          />
        )
      case 'products':
        return (
          <Products
            onAuthClick={() => setIsAuthModalOpen(true)}
            isAuthenticated={isAuthenticated}
          />
        )
      case 'profile':
        return <Profile onLogout={handleLogout} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 relative">
      <Header
        onCartClick={() =>
          isAuthenticated ? setIsCartOpen(true) : setIsAuthModalOpen(true)
        }
        onAuthClick={() => setIsAuthModalOpen(true)}
        isAuthenticated={isAuthenticated}
        onNavigate={setCurrentPage}
        onProfileClick={() => setCurrentPage('profile')}
      />

      <main className="flex-1 w-full">{renderPage()}</main>

      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Fresh Cart</h3>
              <p className="text-gray-400 text-sm">
                Your trusted online grocery store
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="hover:text-white"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('products')}
                    className="hover:text-white"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="hover:text-white"
                  >
                    Cart
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Fresh Cart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {isAuthenticated && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 shadow-lg transition-colors"
          >
            Checkout
          </button>
        </div>
      )}

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  )
}

export default App
