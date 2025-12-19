import React, { useState, useEffect } from 'react'
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'

export const Home = ({ onAuthClick, onCartClick, isAuthenticated }) => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .limit(8)
          .order('created_at', { ascending: false })

        setCategories(categoryData || [])
        setFeaturedProducts(productData || [])
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
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Fresh Groceries <br />
                Delivered
              </h1>
              <p className="text-xl text-orange-100 mb-8 max-w-lg">
                Get fresh vegetables, fruits, cakes, and biscuits delivered to your door in minutes.
              </p>
              <button
                onClick={onCartClick}
                className="bg-white text-orange-600 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                Start Shopping <ArrowRight size={20} />
              </button>
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

      <section className="py-24 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Browse All Categories</h2>
          <p className="text-orange-100 mb-12 max-w-2xl mx-auto text-lg">
            Explore our wide range of products across various categories. From fresh produce to household essentials, we have it all.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
