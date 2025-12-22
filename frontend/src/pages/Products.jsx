import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { CategoryFilter } from '../components/CategoryFilter'
import { ProductList } from '../components/ProductList'

export const Products = ({ onAuthClick, isAuthenticated, initialState }) => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(initialState?.category_id || null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialState?.searchQuery || '')

  useEffect(() => {
    if (initialState) {
      setSelectedCategory(initialState.category_id || null)
      setSearchQuery(initialState.searchQuery || '')
    }
  }, [initialState])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      let url = '/products'
      const params = {}

      if (selectedCategory) {
        params.category_id = selectedCategory
      }

      if (searchQuery) {
        params.searchQuery = searchQuery
      }

      const { data } = await api.get(url, { params })
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-white min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name || 'Products'
              : 'All Products'}
          </h2>
          <p className="text-gray-600 mt-2">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <ProductList
          products={products}
          isLoading={isLoading}
          onAddClick={onAuthClick}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  )
}
