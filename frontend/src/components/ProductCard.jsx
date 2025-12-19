import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const ProductCard = ({ product, onAddClick, isAuthenticated }) => {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      onAddClick?.()
      return
    }

    setIsAdding(true)
    await addItem(product, quantity)
    setQuantity(1)
    setIsAdding(false)
  }

  const placeholderImage =
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.image_url || placeholderImage}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = placeholderImage
          }}
        />

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Only {product.stock} left
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white font-bold text-lg">Out of Stock</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-orange-500">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.stock} in stock
          </span>
        </div>

        {product.stock > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                disabled={quantity === 1}
              >
                <Minus size={16} />
              </button>

              <span className="font-semibold w-8 text-center text-gray-800">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                disabled={quantity === product.stock}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ) : (
          <button className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-lg font-bold cursor-not-allowed border border-gray-200" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}
