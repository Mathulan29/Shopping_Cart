import React, { useState, useEffect } from 'react'
import { ArrowRight, Truck, Shield, Clock, Search } from 'lucide-react'
import api from '../lib/api'
import { ProductCard } from '../components/ProductCard'

export const Home = ({ onAuthClick, onCartClick, isAuthenticated, onNavigateToProducts }) => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSearch, setHeroSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onNavigateToProducts({ searchQuery: heroSearch })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoryData } = await api.get('/categories')
        const { data: productData } = await api.get('/products?limit=8')

        setCategories(categoryData)
        setFeaturedProducts(productData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <form onSubmit={handleSearch} className="relative max-w-lg mb-8">
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search for fresh food..."
                  className="w-full pl-6 pr-14 py-4 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <Search size={24} />
                </button>
              </form>

              <div className="flex gap-4">
                <button
                  onClick={onCartClick}
                  className="bg-white text-orange-600 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center gap-2 shadow-lg"
                >
                  Start Shopping <ArrowRight size={20} />
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center relative">
              <div className="absolute inset-0 bg-white/20 blur-3xl opacity-30 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
                alt="Shopping Basket"
                className="w-full max-w-md object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Decorative background elements matching the feel */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Same-day delivery available for orders placed before 2 PM.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">100% Fresh</h3>
              <p className="text-gray-600 leading-relaxed">All products are sourced directly from trusted local farmers.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">Our customer support team is always ready to help you.</p>
            </div>
          </div>
        </div>
      </section>



      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddClick={onAuthClick}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
