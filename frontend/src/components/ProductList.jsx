import React from 'react'
import { ProductCard } from './ProductCard'

export const ProductList = ({ products, isLoading, onAddClick, isAuthenticated }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="text-4xl">⏳</div>
          </div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-xl text-gray-600">No products found</p>
        <p className="text-gray-500 mt-2">Try selecting a different category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddClick={onAddClick}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  )
}
